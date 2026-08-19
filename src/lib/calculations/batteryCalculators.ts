import {
  BatteryCalculationInput,
  BatteryRuntimeResult,
  BatteryCapacityInput,
  BatteryCapacityResult,
  ApplianceItem,
  BackupCalculationResult,
  ChargingTimeInput,
  ChargingTimeResult,
  BatteryLifeResult,
  BatteryChemistry,
} from '../../types';

/**
 * Deterministic Battery Runtime Calculator
 * Calculates usable energy, current draw, and estimated runtime.
 */
export function calculateBatteryRuntime(input: BatteryCalculationInput): BatteryRuntimeResult {
  const voltage = Math.max(0.1, Number(input.voltage) || 12);
  const capacityAh = Math.max(0.1, Number(input.capacityAh) || 100);
  const loadWatts = Math.max(0.1, Number(input.loadWatts) || 100);
  const efficiency = Math.min(100, Math.max(50, Number(input.efficiencyPercent) || 90)) / 100;
  
  // Depth of Discharge defaults by chemistry
  let defaultDoD = 0.85; // default 85%
  if (input.chemistry === 'lead-acid-flooded') defaultDoD = 0.50;
  else if (input.chemistry === 'lead-acid-agm') defaultDoD = 0.50;
  else if (input.chemistry === 'lead-acid-gel') defaultDoD = 0.50;
  else if (input.chemistry === 'lifepo4') defaultDoD = 0.90;
  else if (input.chemistry === 'nmc-lithium') defaultDoD = 0.85;
  else if (input.chemistry === 'lto') defaultDoD = 0.95;

  const dod = input.depthOfDischargePercent
    ? Math.min(100, Math.max(10, Number(input.depthOfDischargePercent))) / 100
    : defaultDoD;

  const totalEnergyWh = voltage * capacityAh;
  const usableEnergyWh = totalEnergyWh * dod * efficiency;
  const currentAmps = loadWatts / (voltage * efficiency);
  const runtimeHours = usableEnergyWh / loadWatts;

  // Peukert adjustment for lead-acid if discharge rate exceeds C/20 (0.05C)
  let peukertHours = runtimeHours;
  const isLeadAcid = input.chemistry?.includes('lead-acid');
  if (isLeadAcid) {
    const dischargeRateC = currentAmps / capacityAh;
    if (dischargeRateC > 0.05) {
      // Peukert exponent approx 1.15 to 1.25 for standard AGM/Flooded
      const peukertExponent = 1.2;
      const nominalHours = 20; // rated at 20-hour rate
      const ratedCurrent = capacityAh / nominalHours;
      peukertHours = nominalHours * Math.pow(ratedCurrent / currentAmps, peukertExponent);
      peukertHours = Math.max(0.01, peukertHours * dod * efficiency);
    }
  }

  // Format hours and minutes
  const totalMinutes = Math.round(runtimeHours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const runtimeHoursFormatted = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;

  return {
    totalEnergyWh: Math.round(totalEnergyWh * 10) / 10,
    usableEnergyWh: Math.round(usableEnergyWh * 10) / 10,
    currentAmps: Math.round(currentAmps * 100) / 100,
    runtimeHours: Math.round(runtimeHours * 100) / 100,
    runtimeHoursFormatted,
    peukertAdjustedHours: isLeadAcid ? Math.round(peukertHours * 100) / 100 : undefined,
    recommendedMaxDischargeRateAmps: isLeadAcid ? capacityAh * 0.2 : capacityAh * 1.0,
    assumptions: [
      `Nominal battery pack voltage: ${voltage}V`,
      `Specified battery capacity: ${capacityAh} Ah (Total: ${Math.round(totalEnergyWh)} Wh)`,
      `Depth of Discharge (DoD) limit: ${Math.round(dod * 100)}% (Usable: ${Math.round(usableEnergyWh)} Wh)`,
      `Inverter / system conversion efficiency: ${Math.round(efficiency * 100)}%`,
      isLeadAcid
        ? 'Lead-acid capacity decreases under high discharge rates due to Peukert effect.'
        : 'Lithium (LiFePO4/NMC) maintains near 100% capacity across normal discharge rates.',
    ],
    formula: `Runtime (Hours) = (Voltage × Capacity Ah × DoD% × Efficiency%) ÷ Load Watts`,
  };
}

/**
 * Deterministic Battery Capacity Calculator
 * Determines the required Amp-Hours and Watt-Hours to power a specific load for a desired duration.
 */
export function calculateBatteryCapacity(input: BatteryCapacityInput): BatteryCapacityResult {
  const voltage = Math.max(0.1, Number(input.voltage) || 12);
  const loadWatts = Math.max(0.1, Number(input.loadWatts) || 100);
  const desiredHours = Math.max(0.1, Number(input.desiredRuntimeHours) || 8);
  const efficiency = Math.min(100, Math.max(50, Number(input.efficiencyPercent) || 90)) / 100;
  const dod = Math.min(100, Math.max(10, Number(input.depthOfDischargePercent) || 80)) / 100;

  const usableEnergyRequiredWh = (loadWatts * desiredHours) / efficiency;
  const totalEnergyRequiredWh = usableEnergyRequiredWh / dod;
  const requiredCapacityAh = totalEnergyRequiredWh / voltage;
  const recommendedCapacityAhWithMargin = requiredCapacityAh * 1.2; // 20% safety margin
  const continuousDrawAmps = loadWatts / (voltage * efficiency);

  return {
    totalEnergyRequiredWh: Math.round(totalEnergyRequiredWh * 10) / 10,
    usableEnergyRequiredWh: Math.round(usableEnergyRequiredWh * 10) / 10,
    requiredCapacityAh: Math.round(requiredCapacityAh * 10) / 10,
    recommendedCapacityAhWithMargin: Math.round(recommendedCapacityAhWithMargin * 10) / 10,
    continuousDrawAmps: Math.round(continuousDrawAmps * 100) / 100,
    assumptions: [
      `Constant continuous electrical load: ${loadWatts} Watts for ${desiredHours} hours`,
      `Total energy consumed by load: ${Math.round(loadWatts * desiredHours)} Wh`,
      `Inverter / wiring losses compensation: ${Math.round(efficiency * 100)}% efficiency`,
      `Target Depth of Discharge (DoD): ${Math.round(dod * 100)}%`,
      `Includes a recommended 20% safety buffer for battery aging and temperature fluctuations.`,
    ],
    formula: `Required Ah = (Load Watts × Runtime Hours) ÷ (System Voltage × Efficiency% × DoD%)`,
  };
}

/**
 * Deterministic Backup Load & Battery Bank Calculator
 * Computes appliance energy audit and recommended multi-voltage battery banks.
 */
export function calculateBackupSystem(appliances: ApplianceItem[]): BackupCalculationResult {
  let totalDailyWattHours = 0;
  let peakContinuousWatts = 0;

  appliances.forEach((item) => {
    const itemWatts = Math.max(0, Number(item.watts) || 0);
    const qty = Math.max(0, Number(item.quantity) || 0);
    const hrs = Math.max(0, Math.min(24, Number(item.hoursPerDay) || 0));

    const totalItemWatts = itemWatts * qty;
    peakContinuousWatts += totalItemWatts;
    totalDailyWattHours += totalItemWatts * hrs;
  });

  // Default efficiency 88%
  const systemEfficiency = 0.88;
  const grossDailyWh = totalDailyWattHours / systemEfficiency;

  // Inverter recommendations (25% continuous headroom, 2x surge for motor/compressor loads)
  const recommendedInverterContinuousWatts = Math.ceil((peakContinuousWatts * 1.25) / 100) * 100;
  const recommendedInverterSurgeWatts = recommendedInverterContinuousWatts * 2;

  // Bank sizes at different standard DC voltages
  const batteryCapacityAh12V = Math.round((grossDailyWh / 12) * 10) / 10;
  const batteryCapacityAh24V = Math.round((grossDailyWh / 24) * 10) / 10;
  const batteryCapacityAh48V = Math.round((grossDailyWh / 48) * 10) / 10;

  // Chemistry specific bank requirements for 1 day backup:
  // Lead-acid (50% max DoD) -> 2x usable Wh
  const leadAcidBankAh = Math.round(((grossDailyWh / 0.5) / 24) * 10) / 10; // at 24V nominal
  // LiFePO4 (90% usable DoD) -> 1.11x usable Wh
  const lithiumBankAh = Math.round(((grossDailyWh / 0.9) / 24) * 10) / 10; // at 24V nominal

  return {
    totalDailyWattHours: Math.round(totalDailyWattHours),
    peakContinuousWatts: Math.round(peakContinuousWatts),
    recommendedInverterContinuousWatts: Math.max(500, recommendedInverterContinuousWatts),
    recommendedInverterSurgeWatts: Math.max(1000, recommendedInverterSurgeWatts),
    batteryCapacityAh12V,
    batteryCapacityAh24V,
    batteryCapacityAh48V,
    leadAcidBankAh,
    lithiumBankAh,
    assumptions: [
      `Total daily energy consumed across ${appliances.length} appliance groups: ${Math.round(totalDailyWattHours)} Wh/day.`,
      `Inverter conversion efficiency factored at 88%.`,
      `Peak continuous power when all listed appliances run simultaneously: ${Math.round(peakContinuousWatts)} Watts.`,
      `Lead-Acid capacity sized at 50% Depth of Discharge to preserve battery longevity.`,
      `LiFePO4 Lithium capacity sized at 90% Depth of Discharge.`,
    ],
  };
}

/**
 * Deterministic Battery Charging Time Calculator
 * Simulates Constant Current (Bulk) and Constant Voltage (Absorption) multi-stage charging.
 */
export function calculateChargingTime(input: ChargingTimeInput): ChargingTimeResult {
  const capacityAh = Math.max(1, Number(input.batteryCapacityAh) || 100);
  const chargerCurrentA = Math.max(0.1, Number(input.chargerCurrentAmps) || 10);
  const startSoC = Math.min(99, Math.max(0, Number(input.startingStateOfChargePercent) || 20));
  const targetSoC = Math.min(100, Math.max(startSoC + 1, Number(input.targetStateOfChargePercent) || 100));
  
  let coulombEfficiency = 0.90;
  let absorptionFactor = 0.35; // lead-acid takes longer in CV stage
  
  if (input.chemistry === 'lifepo4') {
    coulombEfficiency = 0.98;
    absorptionFactor = 0.10; // LiFePO4 spends 90%+ in bulk stage
  } else if (input.chemistry === 'nmc-lithium') {
    coulombEfficiency = 0.96;
    absorptionFactor = 0.15;
  } else if (input.chemistry === 'lead-acid-agm') {
    coulombEfficiency = 0.92;
    absorptionFactor = 0.30;
  } else if (input.chemistry === 'lead-acid-flooded') {
    coulombEfficiency = 0.85;
    absorptionFactor = 0.40;
  }

  const deltaSoC = (targetSoC - startSoC) / 100;
  const energyNeededAh = (capacityAh * deltaSoC) / coulombEfficiency;

  // Bulk phase delivers roughly (1 - absorptionFactor) of the charge at constant current
  const bulkAh = energyNeededAh * (1 - absorptionFactor);
  const bulkPhaseHours = bulkAh / chargerCurrentA;

  // Absorption phase tapers down to ~C/20, average effective current is ~40-50% of peak charger current
  const absorptionAh = energyNeededAh * absorptionFactor;
  const avgAbsorptionCurrent = chargerCurrentA * 0.45;
  const absorptionPhaseHours = absorptionAh / avgAbsorptionCurrent;

  const totalHours = bulkPhaseHours + absorptionPhaseHours;
  const totalMinutes = Math.round(totalHours * 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const totalTimeFormatted = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;

  return {
    energyNeededAh: Math.round(energyNeededAh * 10) / 10,
    bulkPhaseHours: Math.round(bulkPhaseHours * 100) / 100,
    absorptionPhaseHours: Math.round(absorptionPhaseHours * 100) / 100,
    totalHours: Math.round(totalHours * 100) / 100,
    totalTimeFormatted,
    averagePowerWatts: Math.round(chargerCurrentA * 14.4), // approx 12V charging voltage
    efficiencyFactor: coulombEfficiency,
    assumptions: [
      `Charging from ${startSoC}% State of Charge to ${targetSoC}% State of Charge.`,
      `Coulombic charging efficiency for selected chemistry: ${Math.round(coulombEfficiency * 100)}%.`,
      `Stage 1 (Bulk / CC): Constant current charging accounts for ~${Math.round((1 - absorptionFactor) * 100)}% of charge time.`,
      `Stage 2 (Absorption / CV): Current tapers off as cell voltage reaches absorption threshold.`,
      `Actual charging time may vary with battery age, internal resistance, and ambient cell temperature.`,
    ],
  };
}

/**
 * Battery Life & Cycle Estimation
 */
export function calculateBatteryLife(
  chemistry: BatteryChemistry,
  cyclesPerYear: number,
  averageDoDPercent: number,
  ambientTemperatureC: number
): BatteryLifeResult {
  const cycles = Math.max(1, cyclesPerYear || 365);
  const dod = Math.min(100, Math.max(10, averageDoDPercent || 80));
  const temp = Number(ambientTemperatureC) || 25;

  let baseCyclesAt80DoD = 500;
  let maxCalendarYears = 5;

  switch (chemistry) {
    case 'lifepo4':
      baseCyclesAt80DoD = 4000;
      maxCalendarYears = 15;
      break;
    case 'nmc-lithium':
      baseCyclesAt80DoD = 1500;
      maxCalendarYears = 10;
      break;
    case 'lto':
      baseCyclesAt80DoD = 20000;
      maxCalendarYears = 25;
      break;
    case 'lead-acid-agm':
      baseCyclesAt80DoD = 450;
      maxCalendarYears = 6;
      break;
    case 'lead-acid-gel':
      baseCyclesAt80DoD = 600;
      maxCalendarYears = 7;
      break;
    case 'lead-acid-flooded':
    default:
      baseCyclesAt80DoD = 350;
      maxCalendarYears = 5;
      break;
  }

  // DoD exponent curve (shallower discharge yields exponentially more cycles)
  const dodFactor = Math.pow(80 / dod, 1.4);
  const adjustedCycleLife = Math.round(baseCyclesAt80DoD * dodFactor);

  // Temperature acceleration (Arrhenius rule approx: every 10C above 25C halves lead acid life, 1.4x lithium)
  const deltaTemp = Math.max(0, temp - 25);
  const tempPenaltyFactor = chemistry.includes('lead-acid')
    ? Math.pow(0.5, deltaTemp / 10)
    : Math.pow(0.7, deltaTemp / 10);

  const effectiveCalendarYears = Math.min(
    maxCalendarYears * tempPenaltyFactor,
    adjustedCycleLife / cycles
  );

  const estimatedCalendarYears = Math.max(0.5, Math.round(effectiveCalendarYears * 10) / 10);

  return {
    estimatedCycleLife: adjustedCycleLife,
    estimatedCalendarYears,
    totalLifetimeEnergyThroughputKWh: Math.round((adjustedCycleLife * (dod / 100) * 1.2) * 10) / 10,
    temperatureImpactDescription:
      temp > 25
        ? `Ambient operating temp of ${temp}°C accelerates electrolyte breakdown and reduces calendar life by approximately ${Math.round((1 - tempPenaltyFactor) * 100)}%.`
        : `Operating at optimal temperature range (≤25°C) preserves factory lifespan.`,
    dodImpactDescription:
      dod > 70 && chemistry.includes('lead-acid')
        ? `Discharging lead-acid to ${dod}% DoD significantly accelerates plate sulfation. Keeping DoD under 50% can double cycle life.`
        : `Discharging to ${dod}% DoD provides optimal balance of usable energy and longevity.`,
    assumptions: [
      `Base cycle rating at 80% DoD for ${chemistry}: ~${baseCyclesAt80DoD} cycles.`,
      `Cycle life is based on reaching 80% retained capacity (End of Life standard).`,
      `Calculation assumes proper multi-stage charging and standard maintenance.`,
    ],
  };
}

export const calculateBatteryChargingTime = calculateChargingTime;

/**
 * Deterministic Peukert's Law Calculator
 * Formula: C_p = I^k × t  => t = H × (C / (I × H))^k
 */
export function calculatePeukertCapacity(input: {
  ratedCapacityAh: number;
  ratedDischargeHours?: number;
  dischargeCurrentAmps: number;
  peukertExponent?: number;
}) {
  const c = Math.max(1, Number(input.ratedCapacityAh) || 100);
  const h = Math.max(1, Number(input.ratedDischargeHours) || 20);
  const i = Math.max(0.1, Number(input.dischargeCurrentAmps) || 10);
  const k = Math.min(1.6, Math.max(1.0, Number(input.peukertExponent) || 1.2));

  const ratedCurrent = c / h;
  const effectiveHours = h * Math.pow(ratedCurrent / i, k);
  const effectiveCapacityAh = i * effectiveHours;
  const capacityRetentionPercent = Math.min(100, Math.round((effectiveCapacityAh / c) * 100));

  return {
    ratedCapacityAh: c,
    dischargeCurrentAmps: i,
    peukertExponent: k,
    effectiveRuntimeHours: Math.round(effectiveHours * 100) / 100,
    effectiveCapacityAh: Math.round(effectiveCapacityAh * 10) / 10,
    capacityRetentionPercent,
    assumptions: [
      `Rated at ${c} Ah at the ${h}-hour rate (${ratedCurrent.toFixed(1)} A nominal current).`,
      `Discharge current of ${i} A with Peukert exponent k = ${k}.`,
      `Lead-acid capacities diminish rapidly at higher discharge rates, whereas lithium has a Peukert exponent of ~1.01-1.05.`,
    ],
  };
}

