export type ActiveTab =
  | 'home'
  | 'battery-tools'
  | 'converters'
  | 'car-problems'
  | 'vehicle-battery'
  | 'solar'
  | 'ev'
  | 'guides'
  | 'comparisons'
  | 'ai'
  | 'admin'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'disclaimer';

// Calculator Types
export type BatteryChemistry =
  | 'lead-acid-flooded'
  | 'lead-acid-agm'
  | 'lead-acid-gel'
  | 'lifepo4'
  | 'nmc-lithium'
  | 'lto';

export interface BatteryCalculationInput {
  voltage: number;
  capacityAh: number;
  loadWatts: number;
  efficiencyPercent?: number;
  chemistry?: BatteryChemistry;
  depthOfDischargePercent?: number;
}

export interface BatteryRuntimeResult {
  totalEnergyWh: number;
  usableEnergyWh: number;
  currentAmps: number;
  runtimeHours: number;
  runtimeHoursFormatted: string;
  peukertAdjustedHours?: number;
  recommendedMaxDischargeRateAmps: number;
  assumptions: string[];
  formula: string;
}

export interface BatteryCapacityInput {
  voltage: number;
  loadWatts: number;
  desiredRuntimeHours: number;
  efficiencyPercent?: number;
  depthOfDischargePercent?: number;
}

export interface BatteryCapacityResult {
  totalEnergyRequiredWh: number;
  usableEnergyRequiredWh: number;
  requiredCapacityAh: number;
  recommendedCapacityAhWithMargin: number;
  continuousDrawAmps: number;
  assumptions: string[];
  formula: string;
}

export interface ApplianceItem {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
  category?: 'lighting' | 'appliances' | 'electronics' | 'heating-cooling' | 'other';
}

export interface BackupCalculationResult {
  totalDailyWattHours: number;
  peakContinuousWatts: number;
  recommendedInverterContinuousWatts: number;
  recommendedInverterSurgeWatts: number;
  batteryCapacityAh12V: number;
  batteryCapacityAh24V: number;
  batteryCapacityAh48V: number;
  leadAcidBankAh: number;
  lithiumBankAh: number;
  assumptions: string[];
}

export interface ChargingTimeInput {
  batteryCapacityAh: number;
  chargerCurrentAmps: number;
  startingStateOfChargePercent: number;
  targetStateOfChargePercent: number;
  chemistry: BatteryChemistry;
}

export interface ChargingTimeResult {
  energyNeededAh: number;
  bulkPhaseHours: number;
  absorptionPhaseHours: number;
  totalHours: number;
  totalTimeFormatted: string;
  averagePowerWatts: number;
  efficiencyFactor: number;
  assumptions: string[];
}

export interface BatteryLifeResult {
  estimatedCycleLife: number;
  estimatedCalendarYears: number;
  totalLifetimeEnergyThroughputKWh: number;
  temperatureImpactDescription: string;
  dodImpactDescription: string;
  assumptions: string[];
}

// Solar & Energy Types
export interface SolarBankInput {
  dailyLoadKWh?: number;
  dailyEnergyConsumptionKWh?: number;
  daysOfAutonomy: number;
  systemVoltage: 12 | 24 | 48;
  chemistry?: 'lead-acid-flooded' | 'lead-acid-agm' | 'lifepo4';
  batteryChemistry?: 'lead-acid-flooded' | 'lead-acid-agm' | 'lifepo4';
  lowestTemperatureC?: number;
  lowestWinterTempC?: number;
  minimumTemperatureC?: number;
}

export interface SolarBankResult {
  requiredUsableKWh: number;
  usableCapacityRequiredKWh?: number;
  totalNominalKWh: number;
  totalNominalCapacityKWh?: number;
  totalCapacityAh: number;
  totalNominalCapacityAh?: number;
  numberOfBatteriesRequired: number;
  recommended100AhBatteries?: number;
  temperatureDeratingFactor: number;
  recommendedSeriesParallelConfig: string;
  assumptions: string[];
}

export interface SolarPanelInput {
  dailyEnergyRequiredKWh: number;
  peakSunHoursPerDay: number;
  systemLossesPercent: number;
  panelRatingWatts: number;
}

export interface SolarPanelResult {
  totalArrayWatts: number;
  numberOfPanels: number;
  actualArrayWatts: number;
  dailyEstimatedProductionKWh: number;
  assumptions: string[];
}

export interface InverterSizingInput {
  continuousLoadWatts?: number;
  totalApplianceWatts?: number;
  surgeLoadWatts?: number;
  systemVoltage?: 12 | 24 | 48;
  inverterEfficiencyPercent?: number;
  safetyMarginPercent?: number;
  hasInductiveLoads?: boolean;
  cableLengthFeet?: number;
}

export interface InverterSizingResult {
  recommendedContinuousRatingWatts: number;
  recommendedContinuousWatts?: number;
  recommendedSurgeRatingWatts: number;
  recommendedSurgeWatts?: number;
  maxDcCurrentAmps: number;
  maxContinuousDCCurrentAmps?: number;
  recommendedCableGaugeAWG: string;
  recommendedCableGauge?: string;
  recommendedFuseRatingAmps: number;
  recommendedFuseAmps?: number;
  assumptions: string[];
}

// EV Types
export interface EVRangeInput {
  usableBatteryCapacityKWh?: number;
  batteryCapacityKWh?: number;
  baseConsumptionWhPerKm?: number;
  ratedEfficiencyWhPerMile?: number;
  ambientTemperatureC?: number;
  ambientTemperatureF?: number;
  drivingSpeedType?: 'city' | 'mixed' | 'highway';
  averageSpeedMph?: number;
  climateControlActive?: boolean;
  hvacSetting?: 'off' | 'mild' | 'extreme';
  hvacUsage?: 'off' | 'mild' | 'moderate' | 'extreme' | string | boolean;
  startingSoC?: number;
  targetEndSoC?: number;
}

export interface EVRangeResult {
  estimatedRangeKm: number;
  estimatedRangeMiles: number;
  effectiveConsumptionWhPerKm: number;
  adjustedWhPerMile?: number;
  adjustedWhPerKm?: number;
  rangeLossPercentage?: number;
  energyUsedKWh?: number;
  temperatureImpactPercent: number;
  speedImpactPercent: number;
  hvacImpactPercent: number;
  assumptions: string[];
}

export interface EVChargingInput {
  batteryCapacityKWh?: number;
  batterySizeKWh?: number;
  currentSoCPercent?: number;
  currentSoC?: number;
  startingSoCPercent?: number;
  targetSoCPercent?: number;
  targetSoC?: number;
  chargerType?: 'level1_120v' | 'level2_240v_16a' | 'level2_240v_32a' | 'level2_240v_48a' | 'dc_fast_50kw' | 'dc_fast_150kw' | 'dc_fast_250kw';
  chargerPowerKW?: number;
  chargerEfficiencyPercent?: number;
  electricityRatePerKWh?: number;
  electricityCostPerKWh?: number;
}

export interface EVChargingResult {
  energyNeededKWh: number;
  energyAddedKWh?: number;
  chargingSpeedKW: number;
  averageEffectivePowerKW?: number;
  estimatedHours: number;
  chargingTimeHours?: number;
  estimatedMinutes: number;
  estimatedTimeFormatted: string;
  chargingTimeFormatted?: string;
  rangeAddedPerChargingHourKm: number;
  estimatedCostUSD?: number;
  assumptions: string[];
}

export interface EVChargingCostInput {
  batteryCapacityKWh: number;
  startingSoCPercent: number;
  targetSoCPercent: number;
  electricityRatePerKWh: number;
  chargerEfficiencyPercent: number;
  currencySymbol: string;
}

export interface EVChargingCostResult {
  energyAddedKWh: number;
  gridEnergyDrawnKWh: number;
  totalCost: number;
  costPer100Km: number;
  currencySymbol: string;
  assumptions: string[];
}

// Vehicle Battery Types
export interface VehicleBatterySpec {
  id: string;
  make: string;
  model: string;
  generation?: string;
  years: string;
  engine: string;
  marketRegion?: string;
  groupSize: string; // e.g., Group 35, Group H6 / 48 / LN3, 096, Q85
  dinCode?: string;
  bciGroup?: string;
  voltage?: number;
  minCCA: number;
  recommendedCCA?: number;
  recommendedAh?: number;
  capacityAh?: number;
  reserveCapacityMinutes?: number;
  chemistry: string;
  terminalLayout?: string;
  terminalType?: string;
  holdDown?: string;
  dimensionsMm: { length: number; width: number; height: number };
  dimensionsInches: { length: number; width: number; height: number };
  startStopCompatible?: boolean;
  startStopRequired?: boolean;
  notes?: string;
  locationNotes?: string;
  verified?: boolean;
  lastUpdated?: string;
  oemPartNumber?: string;
  sourceVerification?: {
    verified: boolean;
    source: string;
    lastUpdated: string;
  };
}

// Car Diagnosis Types
export interface DiagnosticTreeNode {
  stepId: number | string;
  question: string;
  action: string;
  ifYes: { conclusion: string; nextStepId?: number | string };
  ifNo: { conclusion: string; nextStepId?: number | string };
}

export interface ProblemLikelyCause {
  cause: string;
  probability: number | string;
  verification: string;
  fix: string;
}

export interface CarProblem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  severity: 'critical' | 'moderate' | 'info' | 'Immediate Danger' | 'High' | 'Moderate' | 'Low';
  symptoms: string[];
  diagnosticTree: DiagnosticTreeNode[];
  likelyCauses: ProblemLikelyCause[];
  preventativeTips: string[];
  relatedTools?: { title: string; tab: ActiveTab | string; subTab?: string }[];
}

export interface DiagnosticStep {
  id: string;
  question: string;
  description: string;
  options: {
    id: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
}

export interface DiagnosticCause {
  title: string;
  probability: 'High' | 'Medium' | 'Low';
  description: string;
  actionSteps: string[];
  multimeterTest?: {
    setting: string;
    expectedValue: string;
    failedValue: string;
    interpretation: string;
  };
  safetyWarning?: string;
}

export interface DiagnosticResultData {
  problemId: string;
  problemTitle: string;
  likelyCauses: DiagnosticCause[];
  whatToCheckFirst: string[];
  safetyWarnings: string[];
  relatedTools: { title: string; link: string; tab: ActiveTab; subTab?: string }[];
  relatedGuides: { title: string; slug: string }[];
}

// Educational Guides
export interface GuideSection {
  id: string;
  title: string;
  content: string;
  callout?: {
    type: 'info' | 'warning' | 'tip' | 'danger';
    title: string;
    text: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Battery Basics' | 'Car Battery' | 'Automotive Electrical' | 'Solar' | 'Inverter' | 'EV' | 'Maintenance & Safety';
  readTimeMinutes: number;
  publishedDate: string;
  lastUpdated: string;
  summary: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  relatedToolLinks: { title: string; tab: ActiveTab; subTab?: string }[];
  relatedGuideSlugs: string[];
  seoDescription: string;
}

// Comparison Types
export interface ComparisonAttribute {
  name: string;
  description: string;
  optionAValue: string;
  optionBValue: string;
  winner?: 'A' | 'B' | 'Tie' | 'Context-dependent';
  explanation: string;
}

export interface ComparisonItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  optionAName: string;
  optionBName: string;
  summary: string;
  keyTakeaways: string[];
  attributes: ComparisonAttribute[];
  bestForOptionA: string[];
  bestForOptionB: string[];
  recommendation: string;
  faqs: { question: string; answer: string }[];
}

// AI Diagnostic Agent Types
export type AIMode =
  | 'car_diagnosis'
  | 'battery_assistant'
  | 'calculator_assistant'
  | 'solar_assistant'
  | 'ev_assistant'
  | 'knowledge_assistant';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: {
    toolName: string;
    arguments: Record<string, any>;
    result: any;
  }[];
  structuredResult?: {
    type: 'diagnosis' | 'calculation' | 'vehicle_match' | 'safety_alert';
    title: string;
    items: string[];
    multimeterGuidance?: string;
    confidenceNote: string;
  };
  isSafetyAlert?: boolean;
}

// Knowledge Base Doc
export interface KnowledgeDoc {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  source: string;
  sourceUrl?: string;
  verified: boolean;
  lastUpdated: string;
}

const app = require('../dist/server.cjs');
module.exports = app;