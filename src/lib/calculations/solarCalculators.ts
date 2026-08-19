import {
  SolarBankInput,
  SolarBankResult,
  SolarPanelInput,
  SolarPanelResult,
  InverterSizingInput,
  InverterSizingResult,
} from '../../types';

/**
 * Solar Battery Bank Sizing Calculator
 * Calculates necessary battery capacity considering days of autonomy, DoD, and temperature derating.
 */
export function calculateSolarBatteryBank(input: SolarBankInput): SolarBankResult {
  const dailyLoadKWh = Math.max(
    0.1,
    Number(input.dailyEnergyConsumptionKWh ?? input.dailyLoadKWh) || 5
  );
  const daysAutonomy = Math.max(1, Number(input.daysOfAutonomy) || 2);
  const voltage = input.systemVoltage || 24;
  const tempC = Number(input.lowestWinterTempC ?? input.lowestTemperatureC) ?? 15;

  const chem = input.batteryChemistry ?? input.chemistry ?? 'lifepo4';

  // Depth of Discharge limits
  let dod = 0.90; // default for LiFePO4
  if (chem === 'lead-acid-flooded') dod = 0.50;
  else if (chem === 'lead-acid-agm') dod = 0.50;

  // Temperature derating factor
  let tempFactor = 1.0;
  if (chem.includes('lead-acid')) {
    if (tempC < 25) {
      tempFactor = Math.max(0.5, 1 - (25 - tempC) * 0.015);
    }
  } else {
    // Lithium maintains good discharge capacity down to 0C
    if (tempC < 0) {
      tempFactor = Math.max(0.7, 1 - (0 - tempC) * 0.02);
    }
  }

  const requiredUsableKWh = dailyLoadKWh * daysAutonomy;
  const totalNominalKWh = requiredUsableKWh / (dod * tempFactor);
  const totalCapacityAh = (totalNominalKWh * 1000) / voltage;

  // Standard 100Ah 12V unit battery estimation
  const batteryUnitWh = 12 * 100; // 1.2 kWh per unit
  const numberOfBatteriesRequired = Math.ceil((totalNominalKWh * 1000) / batteryUnitWh);

  const seriesCount = voltage / 12;
  const parallelStrings = Math.ceil(numberOfBatteriesRequired / seriesCount);
  const recommendedConfig = `${seriesCount} in series × ${parallelStrings} parallel strings (based on standard 12V 100Ah modules)`;

  return {
    requiredUsableKWh: Math.round(requiredUsableKWh * 10) / 10,
    usableCapacityRequiredKWh: Math.round(requiredUsableKWh * 10) / 10,
    totalNominalKWh: Math.round(totalNominalKWh * 10) / 10,
    totalNominalCapacityKWh: Math.round(totalNominalKWh * 10) / 10,
    totalCapacityAh: Math.round(totalCapacityAh * 10) / 10,
    totalNominalCapacityAh: Math.round(totalCapacityAh * 10) / 10,
    numberOfBatteriesRequired: Math.max(1, numberOfBatteriesRequired),
    recommended100AhBatteries: Math.max(1, numberOfBatteriesRequired),
    temperatureDeratingFactor: Math.round(tempFactor * 100) / 100,
    recommendedSeriesParallelConfig: recommendedConfig,
    assumptions: [
      `Daily consumption: ${dailyLoadKWh} kWh/day with ${daysAutonomy} day(s) autonomy reserve.`,
      `Battery chemistry Depth of Discharge limit: ${Math.round(dod * 100)}%.`,
      `Winter temperature derating factor at ${tempC}°C: ${Math.round(tempFactor * 100)}% available capacity.`,
      `System bus voltage: ${voltage}V DC.`,
    ],
  };
}

/**
 * Solar Panel Array Sizing Calculator
 */
export function calculateSolarPanels(input: SolarPanelInput): SolarPanelResult {
  const dailyKWh = Math.max(0.1, Number(input.dailyEnergyRequiredKWh) || 6);
  const sunHours = Math.max(1, Number(input.peakSunHoursPerDay) || 4.5);
  const lossesPercent = Math.min(40, Math.max(5, Number(input.systemLossesPercent) || 20)) / 100;
  const panelWatts = Math.max(50, Number(input.panelRatingWatts) || 400);

  const effectiveLossFactor = 1 - lossesPercent;
  const targetDailyGenerationWh = (dailyKWh * 1000) / effectiveLossFactor;
  const requiredArrayWatts = targetDailyGenerationWh / sunHours;
  const numberOfPanels = Math.ceil(requiredArrayWatts / panelWatts);
  const actualArrayWatts = numberOfPanels * panelWatts;
  const dailyEstimatedProductionKWh = (actualArrayWatts * sunHours * effectiveLossFactor) / 1000;

  return {
    totalArrayWatts: Math.round(requiredArrayWatts),
    numberOfPanels,
    actualArrayWatts,
    dailyEstimatedProductionKWh: Math.round(dailyEstimatedProductionKWh * 10) / 10,
    assumptions: [
      `Target daily generation: ${dailyKWh} kWh based on ${sunHours} Peak Sun Hours (PSH).`,
      `Factored system derating losses (dust, inverter, heat, MPPT): ${Math.round(lossesPercent * 100)}%.`,
      `Individual panel nominal output: ${panelWatts}W monocrystalline.`,
    ],
  };
}

/**
 * Inverter & DC Wire Sizing Calculator
 */
export function calculateInverterSizing(input: InverterSizingInput): InverterSizingResult {
  const continuousWatts = Math.max(
    100,
    Number(input.totalApplianceWatts ?? input.continuousLoadWatts) || 2000
  );
  const surgeWatts = Math.max(continuousWatts, Number(input.surgeLoadWatts) || continuousWatts * 1.8);
  const voltage = input.systemVoltage || 24;
  const efficiency = Math.min(99, Math.max(70, Number(input.inverterEfficiencyPercent) || 90)) / 100;

  const safetyMargin = (Number(input.safetyMarginPercent) || 25) / 100;
  const continuousRating = Math.ceil((continuousWatts * (1 + safetyMargin)) / 100) * 100;
  const surgeRating = Math.ceil(surgeWatts / 100) * 100;
  const maxDcCurrent = continuousWatts / (voltage * efficiency);

  // Recommended AWG wire gauge based on DC current for 3% max voltage drop up to 10ft / 3m
  let cableAWG = '1/0 AWG';
  let fuseAmps = 150;

  if (maxDcCurrent <= 30) {
    cableAWG = '8 AWG';
    fuseAmps = 40;
  } else if (maxDcCurrent <= 50) {
    cableAWG = '6 AWG';
    fuseAmps = 70;
  } else if (maxDcCurrent <= 85) {
    cableAWG = '4 AWG';
    fuseAmps = 100;
  } else if (maxDcCurrent <= 125) {
    cableAWG = '2 AWG';
    fuseAmps = 150;
  } else if (maxDcCurrent <= 175) {
    cableAWG = '1/0 AWG';
    fuseAmps = 200;
  } else if (maxDcCurrent <= 225) {
    cableAWG = '2/0 AWG';
    fuseAmps = 250;
  } else if (maxDcCurrent <= 300) {
    cableAWG = '4/0 AWG';
    fuseAmps = 350;
  } else {
    cableAWG = 'Dual 4/0 AWG or 250 MCM';
    fuseAmps = 500;
  }

  return {
    recommendedContinuousRatingWatts: continuousRating,
    recommendedContinuousWatts: continuousRating,
    recommendedSurgeRatingWatts: surgeRating,
    recommendedSurgeWatts: surgeRating,
    maxDcCurrentAmps: Math.round(maxDcCurrent * 10) / 10,
    maxContinuousDCCurrentAmps: Math.round(maxDcCurrent * 10) / 10,
    recommendedCableGaugeAWG: cableAWG,
    recommendedCableGauge: cableAWG,
    recommendedFuseRatingAmps: fuseAmps,
    recommendedFuseAmps: fuseAmps,
    assumptions: [
      `Continuous operating load: ${continuousWatts}W (with ${Math.round(safetyMargin * 100)}% safety margin: ${continuousRating}W rating).`,
      `Peak inductive surge capability: ${surgeRating}W.`,
      `Max continuous DC current draw at ${voltage}V: ${Math.round(maxDcCurrent)} Amps.`,
      `Wire gauge and fuse sized for Class T / ANL marine/solar grade copper conductor under 3% voltage drop.`,
    ],
  };
}

// Export alias
export const calculateInverterRequirements = calculateInverterSizing;
