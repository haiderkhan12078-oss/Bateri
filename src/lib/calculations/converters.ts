/**
 * Deterministic Unit Converters for Electrical and Battery Metrics
 */

export interface ConverterResult {
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  formula: string;
  explanation: string;
  realWorldExample: string;
  // Specific helper properties for UI components
  wattHours?: number;
  kilowattHours?: number;
  milliampHours?: number;
  ampHours?: number;
  currentAmps?: number;
  powerWatts?: number;
  powerKilowatts?: number;
  crankingAmpsCA?: number;
  marineCrankingAmpsMCA?: number;
}

/**
 * Amp-Hours (Ah) to Watt-Hours (Wh)
 * Formula: Wh = Ah × Volts
 */
export function convertAhToWh(ah: number, volts: number): ConverterResult {
  const safeAh = Math.max(0, Number(ah) || 0);
  const safeVolts = Math.max(0.1, Number(volts) || 12);
  const wh = safeAh * safeVolts;
  const kwh = wh / 1000;
  const mah = safeAh * 1000;

  return {
    fromValue: safeAh,
    fromUnit: 'Ah',
    toValue: Math.round(wh * 100) / 100,
    toUnit: 'Wh',
    wattHours: Math.round(wh * 100) / 100,
    kilowattHours: Math.round(kwh * 1000) / 1000,
    milliampHours: Math.round(mah),
    formula: `Wh = Ah × Volts`,
    explanation: `${safeAh} Amp-Hours at ${safeVolts} Volts equals ${Math.round(wh * 100) / 100} Watt-Hours of total electrical energy.`,
    realWorldExample: `A standard 100Ah 12V marine battery holds 1,200 Wh (1.2 kWh) of nominal energy.`,
  };
}

/**
 * Watt-Hours (Wh) to Amp-Hours (Ah)
 * Formula: Ah = Wh ÷ Volts
 */
export function convertWhToAh(wh: number, volts: number): ConverterResult {
  const safeWh = Math.max(0, Number(wh) || 0);
  const safeVolts = Math.max(0.1, Number(volts) || 12);
  const ah = safeWh / safeVolts;
  const mah = ah * 1000;

  return {
    fromValue: safeWh,
    fromUnit: 'Wh',
    toValue: Math.round(ah * 100) / 100,
    toUnit: 'Ah',
    ampHours: Math.round(ah * 100) / 100,
    milliampHours: Math.round(mah),
    formula: `Ah = Wh ÷ Volts`,
    explanation: `${safeWh} Watt-Hours at ${safeVolts} Volts corresponds to ${Math.round(ah * 100) / 100} Amp-Hours.`,
    realWorldExample: `A 2,400 Wh solar generator pack on a 24V bus equals a 100Ah battery bank.`,
  };
}

/**
 * Milliamp-Hours (mAh) to Watt-Hours (Wh)
 * Formula: Wh = (mAh × Volts) ÷ 1000
 */
export function convertMahToWh(mah: number, volts: number): ConverterResult {
  const safeMah = Math.max(0, Number(mah) || 0);
  const safeVolts = Math.max(0.1, Number(volts) || 3.7);
  const wh = (safeMah * safeVolts) / 1000;

  return {
    fromValue: safeMah,
    fromUnit: 'mAh',
    toValue: Math.round(wh * 1000) / 1000,
    toUnit: 'Wh',
    wattHours: Math.round(wh * 100) / 100,
    formula: `Wh = (mAh × Volts) ÷ 1,000`,
    explanation: `${safeMah} mAh at ${safeVolts}V (typical single-cell lithium nominal voltage) equals ${Math.round(wh * 100) / 100} Wh.`,
    realWorldExample: `A 10,000 mAh smartphone power bank at 3.7V nominal internal cell voltage is 37 Wh (well within the airline 100 Wh carry-on limit).`,
  };
}

/**
 * Watt-Hours (Wh) to Milliamp-Hours (mAh)
 * Formula: mAh = (Wh × 1000) ÷ Volts
 */
export function convertWhToMah(wh: number, volts: number): ConverterResult {
  const safeWh = Math.max(0, Number(wh) || 0);
  const safeVolts = Math.max(0.1, Number(volts) || 3.7);
  const mah = (safeWh * 1000) / safeVolts;

  return {
    fromValue: safeWh,
    fromUnit: 'Wh',
    toValue: Math.round(mah),
    toUnit: 'mAh',
    milliampHours: Math.round(mah),
    formula: `mAh = (Wh × 1,000) ÷ Volts`,
    explanation: `${safeWh} Wh translates to ${Math.round(mah)} mAh at ${safeVolts} Volts.`,
    realWorldExample: `A 99.9 Wh laptop battery pack at 11.4V nominal is roughly 8,763 mAh.`,
  };
}

/**
 * Watts to Amps
 * Formula: Amps = Watts ÷ Volts
 */
export function convertWattsToAmps(watts: number, volts: number, powerFactor: number = 1.0): ConverterResult {
  const safeWatts = Math.max(0, Number(watts) || 0);
  const safeVolts = Math.max(0.1, Number(volts) || 120);
  const safePf = Math.min(1.0, Math.max(0.1, Number(powerFactor) || 1.0));
  const amps = safeWatts / (safeVolts * safePf);

  return {
    fromValue: safeWatts,
    fromUnit: 'Watts',
    toValue: Math.round(amps * 100) / 100,
    toUnit: 'Amps',
    currentAmps: Math.round(amps * 100) / 100,
    formula: safePf < 1.0 ? `Amps = Watts ÷ (Volts × PowerFactor)` : `Amps = Watts ÷ Volts`,
    explanation: `A ${safeWatts}W load on a ${safeVolts}V circuit draws ${Math.round(amps * 100) / 100} Amps.`,
    realWorldExample: `A 1,500W electric space heater on a 120V household outlet draws 12.5 Amps of current.`,
  };
}

/**
 * Amps to Watts
 * Formula: Watts = Amps × Volts
 */
export function convertAmpsToWatts(amps: number, volts: number, powerFactor: number = 1.0): ConverterResult {
  const safeAmps = Math.max(0, Number(amps) || 0);
  const safeVolts = Math.max(0.1, Number(volts) || 120);
  const safePf = Math.min(1.0, Math.max(0.1, Number(powerFactor) || 1.0));
  const watts = safeAmps * safeVolts * safePf;

  return {
    fromValue: safeAmps,
    fromUnit: 'Amps',
    toValue: Math.round(watts * 100) / 100,
    toUnit: 'Watts',
    powerWatts: Math.round(watts * 100) / 100,
    powerKilowatts: Math.round((watts / 1000) * 100) / 100,
    formula: safePf < 1.0 ? `Watts = Amps × Volts × PowerFactor` : `Watts = Amps × Volts`,
    explanation: `${safeAmps} Amps flowing through a ${safeVolts}V system delivers ${Math.round(watts * 100) / 100} Watts of power.`,
    realWorldExample: `A 15A 120V circuit breaker can safely sustain up to 1,800W max continuous or intermittent resistive load.`,
  };
}

/**
 * Cold Cranking Amps (CCA) to Cranking Amps (CA / MCA)
 * Standard Industry Ratio: CA = CCA × 1.25
 */
export function convertCcaToCa(cca: number): ConverterResult {
  const safeCca = Math.max(0, Number(cca) || 0);
  const ca = safeCca * 1.25;

  return {
    fromValue: safeCca,
    fromUnit: 'CCA',
    toValue: Math.round(ca),
    toUnit: 'CA',
    crankingAmpsCA: Math.round(ca),
    marineCrankingAmpsMCA: Math.round(ca),
    formula: `CA (at 32°F) ≈ CCA (at 0°F) × 1.25`,
    explanation: `${safeCca} Cold Cranking Amps (0°F / -18°C) delivers approximately ${Math.round(ca)} Cranking Amps at 32°F (0°C).`,
    realWorldExample: `A 650 CCA automotive battery delivers approximately 812 Marine Cranking Amps (MCA) at 32°F.`,
  };
}

/**
 * Kilowatt-Hours (kWh) to Watt-Hours (Wh)
 */
export function convertKwhToWh(kwh: number): ConverterResult {
  const safeKwh = Math.max(0, Number(kwh) || 0);
  const wh = safeKwh * 1000;
  return {
    fromValue: safeKwh,
    fromUnit: 'kWh',
    toValue: Math.round(wh * 100) / 100,
    toUnit: 'Wh',
    wattHours: Math.round(wh * 100) / 100,
    kilowattHours: safeKwh,
    formula: `Wh = kWh × 1,000`,
    explanation: `${safeKwh} kWh is equivalent to ${Math.round(wh).toLocaleString()} Watt-Hours.`,
    realWorldExample: `A 75 kWh EV battery contains 75,000 Watt-Hours of energy.`,
  };
}

/**
 * Watt-Hours (Wh) to Kilowatt-Hours (kWh)
 */
export function convertWhToKwh(wh: number): ConverterResult {
  const safeWh = Math.max(0, Number(wh) || 0);
  const kwh = safeWh / 1000;
  return {
    fromValue: safeWh,
    fromUnit: 'Wh',
    toValue: Math.round(kwh * 1000) / 1000,
    toUnit: 'kWh',
    wattHours: safeWh,
    kilowattHours: Math.round(kwh * 1000) / 1000,
    formula: `kWh = Wh ÷ 1,000`,
    explanation: `${safeWh} Wh equals ${Math.round(kwh * 1000) / 1000} kWh.`,
    realWorldExample: `A 5,000 Wh home battery system provides 5.0 kWh of energy storage.`,
  };
}
