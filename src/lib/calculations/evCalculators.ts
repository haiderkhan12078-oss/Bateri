import {
  EVRangeInput,
  EVRangeResult,
  EVChargingInput,
  EVChargingResult,
  EVChargingCostInput,
  EVChargingCostResult,
} from '../../types';

/**
 * Deterministic EV Range & Efficiency Calculator
 * Factors in ambient temperature, highway vs city drag, and cabin HVAC.
 */
export function calculateEVRange(input: EVRangeInput): EVRangeResult {
  const capacityKWh = Math.max(
    10,
    Number(input.batteryCapacityKWh ?? input.usableBatteryCapacityKWh) || 75
  );
  const baseWhPerKm = input.baseConsumptionWhPerKm
    ? Number(input.baseConsumptionWhPerKm)
    : input.ratedEfficiencyWhPerMile
    ? Number(input.ratedEfficiencyWhPerMile) / 1.60934
    : 160;
  const tempC = Number(input.ambientTemperatureC) ?? 20;

  // Temperature penalty: optimal around 20-25C. Below 0C and above 35C penalize efficiency
  let tempPenalty = 0;
  if (tempC < 20) {
    // Up to 35% penalty at -20C
    tempPenalty = Math.min(0.35, ((20 - tempC) / 40) * 0.35);
  } else if (tempC > 28) {
    // Cooling battery & cabin penalty
    tempPenalty = Math.min(0.15, ((tempC - 28) / 20) * 0.15);
  }

  // Speed type aero drag penalty
  let speedPenalty = 0;
  if (input.drivingSpeedType === 'highway' || (input.averageSpeedMph && input.averageSpeedMph >= 70)) {
    speedPenalty = 0.20; // 20% higher drag at 110-120 km/h (70-75 mph)
  } else if (input.drivingSpeedType === 'city' || (input.averageSpeedMph && input.averageSpeedMph <= 35)) {
    speedPenalty = -0.10; // 10% lower consumption due to regenerative braking and low aero drag
  }

  // HVAC penalty
  let hvacPenalty = 0;
  if (input.hvacSetting === 'extreme') {
    hvacPenalty = 0.15;
  } else if (input.hvacSetting === 'mild') {
    hvacPenalty = 0.07;
  } else if (input.climateControlActive) {
    hvacPenalty = tempC < 10 || tempC > 30 ? 0.12 : 0.05;
  }

  const totalMultiplier = 1 + tempPenalty + speedPenalty + hvacPenalty;
  const effectiveConsumptionWhPerKm = baseWhPerKm * totalMultiplier;
  const effectiveConsumptionWhPerMile = effectiveConsumptionWhPerKm * 1.60934;
  const estimatedRangeKm = (capacityKWh * 1000) / effectiveConsumptionWhPerKm;
  const estimatedRangeMiles = estimatedRangeKm * 0.621371;

  // Baseline standard range for comparison
  const nominalRangeKm = (capacityKWh * 1000) / baseWhPerKm;
  const rangeLossPercentage = Math.max(0, Math.round(((nominalRangeKm - estimatedRangeKm) / nominalRangeKm) * 100));

  return {
    estimatedRangeKm: Math.round(estimatedRangeKm),
    estimatedRangeMiles: Math.round(estimatedRangeMiles),
    effectiveConsumptionWhPerKm: Math.round(effectiveConsumptionWhPerKm),
    adjustedWhPerKm: Math.round(effectiveConsumptionWhPerKm),
    adjustedWhPerMile: Math.round(effectiveConsumptionWhPerMile),
    rangeLossPercentage,
    energyUsedKWh: capacityKWh,
    temperatureImpactPercent: Math.round(tempPenalty * 100),
    speedImpactPercent: Math.round(speedPenalty * 100),
    hvacImpactPercent: Math.round(hvacPenalty * 100),
    assumptions: [
      `Usable battery capacity: ${capacityKWh} kWh.`,
      `Base vehicle efficiency: ${Math.round(baseWhPerKm)} Wh/km (${Math.round(baseWhPerKm * 1.60934)} Wh/mi).`,
      `Ambient temperature impact (${tempC}°C): ${tempPenalty >= 0 ? '+' : ''}${Math.round(tempPenalty * 100)}% consumption.`,
      `Driving profile: ${speedPenalty >= 0 ? '+' : ''}${Math.round(speedPenalty * 100)}% aerodynamic drag variation.`,
      `Climate control (HVAC): +${Math.round(hvacPenalty * 100)}% active draw.`,
    ],
  };
}

/**
 * Deterministic EV Charging Time Calculator
 * Accounts for power limits, taper curves (e.g. 80-100% DC fast taper), and onboard charger limits.
 */
export function calculateEVChargingTime(input: EVChargingInput): EVChargingResult {
  const capacityKWh = Math.max(
    10,
    Number(input.batterySizeKWh ?? input.batteryCapacityKWh) || 75
  );
  const startSoC = Math.min(
    99,
    Math.max(0, Number(input.startingSoCPercent ?? input.currentSoCPercent) || 20)
  );
  const targetSoC = Math.min(100, Math.max(startSoC + 1, Number(input.targetSoCPercent) || 80));

  let chargingSpeedKW = input.chargerPowerKW || 7.2;
  let chargerEfficiency = (input.chargerEfficiencyPercent || 90) / 100;
  let isDCFast = false;

  if (input.chargerType) {
    switch (input.chargerType) {
      case 'level1_120v':
        chargingSpeedKW = 1.4; // 120V @ 12A
        chargerEfficiency = 0.82;
        break;
      case 'level2_240v_16a':
        chargingSpeedKW = 3.8; // 240V @ 16A
        chargerEfficiency = 0.88;
        break;
      case 'level2_240v_32a':
        chargingSpeedKW = 7.7; // 240V @ 32A
        chargerEfficiency = 0.91;
        break;
      case 'level2_240v_48a':
        chargingSpeedKW = 11.5; // 240V @ 48A
        chargerEfficiency = 0.93;
        break;
      case 'dc_fast_50kw':
        chargingSpeedKW = 50;
        chargerEfficiency = 0.94;
        isDCFast = true;
        break;
      case 'dc_fast_150kw':
        chargingSpeedKW = 150;
        chargerEfficiency = 0.94;
        isDCFast = true;
        break;
      case 'dc_fast_250kw':
        chargingSpeedKW = 250;
        chargerEfficiency = 0.94;
        isDCFast = true;
        break;
    }
  } else if (chargingSpeedKW >= 40) {
    isDCFast = true;
  }

  const energyNeededKWh = capacityKWh * ((targetSoC - startSoC) / 100);
  let effectiveHours = 0;
  let averageEffectivePower = chargingSpeedKW;

  if (isDCFast) {
    // DC fast charging tapers sharply past 80% SoC
    const below80SoC = Math.max(0, Math.min(80, targetSoC) - Math.min(80, startSoC)) / 100;
    const above80SoC = Math.max(0, targetSoC - Math.max(80, startSoC)) / 100;

    const energyBelow80 = capacityKWh * below80SoC;
    const energyAbove80 = capacityKWh * above80SoC;

    // Below 80%: average delivers ~75% of peak station capability
    const avgPowerBelow80 = Math.min(chargingSpeedKW * 0.75, 200);
    const timeBelow80 = energyBelow80 / (avgPowerBelow80 * chargerEfficiency);

    // Above 80%: steep taper to ~25-35kW average
    const avgPowerAbove80 = Math.min(35, chargingSpeedKW * 0.25);
    const timeAbove80 = energyAbove80 / (avgPowerAbove80 * chargerEfficiency);

    effectiveHours = timeBelow80 + timeAbove80;
    averageEffectivePower = effectiveHours > 0 ? (energyNeededKWh / effectiveHours) : chargingSpeedKW;
  } else {
    // AC charging is flat up to ~98%
    effectiveHours = energyNeededKWh / (chargingSpeedKW * chargerEfficiency);
    averageEffectivePower = chargingSpeedKW * chargerEfficiency;
  }

  const totalMinutes = Math.round(effectiveHours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeFormatted = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;

  // Range added estimation (~160 Wh/km average)
  const rangeAddedKmPerHour = Math.round((chargingSpeedKW * chargerEfficiency * 1000) / 160);

  // Estimated cost USD
  const rate = Number(input.electricityRatePerKWh) || 0.16;
  const estimatedCost = (energyNeededKWh / chargerEfficiency) * rate;

  return {
    energyNeededKWh: Math.round(energyNeededKWh * 10) / 10,
    energyAddedKWh: Math.round(energyNeededKWh * 10) / 10,
    chargingSpeedKW,
    averageEffectivePowerKW: Math.round(averageEffectivePower * 10) / 10,
    estimatedHours: Math.round(effectiveHours * 100) / 100,
    chargingTimeHours: Math.round(effectiveHours * 100) / 100,
    estimatedMinutes: totalMinutes,
    estimatedTimeFormatted: timeFormatted,
    chargingTimeFormatted: timeFormatted,
    rangeAddedPerChargingHourKm: rangeAddedKmPerHour,
    estimatedCostUSD: Math.round(estimatedCost * 100) / 100,
    assumptions: [
      `Charging from ${startSoC}% to ${targetSoC}% State of Charge (${Math.round(energyNeededKWh * 10) / 10} kWh added).`,
      `Peak charger delivery: ${chargingSpeedKW} kW with ${Math.round(chargerEfficiency * 100)}% electrical transfer efficiency.`,
      isDCFast
        ? `DC Fast Charging includes simulated thermal throttling and taper curve past 80% State of Charge.`
        : `AC charging rate assumes vehicle onboard charger supports ${chargingSpeedKW} kW maximum input.`,
    ],
  };
}

/**
 * Deterministic EV Charging Cost Calculator
 */
export function calculateEVChargingCost(input: EVChargingCostInput): EVChargingCostResult {
  const capacityKWh = Math.max(10, Number(input.batteryCapacityKWh) || 75);
  const startSoC = Math.min(99, Math.max(0, Number(input.startingSoCPercent) || 10));
  const targetSoC = Math.min(100, Math.max(startSoC + 1, Number(input.targetSoCPercent) || 80));
  const rate = Math.max(0.01, Number(input.electricityRatePerKWh) || 0.16);
  const efficiency = Math.min(100, Math.max(50, Number(input.chargerEfficiencyPercent) || 90)) / 100;
  const currencySymbol = input.currencySymbol || '$';

  const energyAddedKWh = capacityKWh * ((targetSoC - startSoC) / 100);
  const gridEnergyDrawnKWh = energyAddedKWh / efficiency;
  const totalCost = gridEnergyDrawnKWh * rate;

  // Cost per 100km assuming 16 kWh/100km
  const costPer100Km = (16 / efficiency) * rate;

  return {
    energyAddedKWh: Math.round(energyAddedKWh * 10) / 10,
    gridEnergyDrawnKWh: Math.round(gridEnergyDrawnKWh * 10) / 10,
    totalCost: Math.round(totalCost * 100) / 100,
    costPer100Km: Math.round(costPer100Km * 100) / 100,
    currencySymbol,
    assumptions: [
      `Battery intake: ${Math.round(energyAddedKWh * 10) / 10} kWh (${startSoC}% to ${targetSoC}% SoC).`,
      `Grid draw factoring ${Math.round(efficiency * 100)}% charger efficiency: ${Math.round(gridEnergyDrawnKWh * 10) / 10} kWh.`,
      `Electricity tariff: ${currencySymbol}${rate.toFixed(3)} per kWh.`,
    ],
  };
}
