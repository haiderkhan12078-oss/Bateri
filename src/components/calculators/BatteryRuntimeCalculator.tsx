import React, { useState, useId } from 'react';
import { calculateBatteryRuntime } from '../../lib/calculations/batteryCalculators';
import { BatteryChemistry } from '../../types';
import { FormulaCard } from '../ui/FormulaCard';
import { CopyButton } from '../ui/CopyButton';
import { Clock, Zap, Shield, RotateCcw, Activity } from 'lucide-react';

interface PresetLoad {
  label: string;
  watts: number;
}

const PRESET_LOADS: PresetLoad[] = [
  { label: 'LED Lighting (10W)', watts: 10 },
  { label: 'Laptop Charger (65W)', watts: 65 },
  { label: '12V Fridge / Cooler (45W)', watts: 45 },
  { label: 'CPAP Machine (50W)', watts: 50 },
  { label: 'TV + Soundbar (120W)', watts: 120 },
  { label: 'Microwave (1,000W)', watts: 1000 },
  { label: 'Trolling Motor (300W)', watts: 300 },
  { label: 'Sump Pump (800W)', watts: 800 },
];

export const BatteryRuntimeCalculator: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(12);
  const [capacityAh, setCapacityAh] = useState<number>(100);
  const [loadWatts, setLoadWatts] = useState<number>(150);
  const [chemistry, setChemistry] = useState<BatteryChemistry>('lifepo4');
  const [efficiency, setEfficiency] = useState<number>(90);
  const [customDoD, setCustomDoD] = useState<number>(90);

  const voltageInputId = useId();
  const capacityInputId = useId();
  const loadInputId = useId();
  const chemistryInputId = useId();
  const efficiencyInputId = useId();
  const dodInputId = useId();

  // Update DoD default when chemistry changes
  const handleChemistryChange = (newChem: BatteryChemistry) => {
    setChemistry(newChem);
    if (newChem.includes('lead-acid')) {
      setCustomDoD(50);
    } else if (newChem === 'lifepo4') {
      setCustomDoD(90);
    } else if (newChem === 'nmc-lithium') {
      setCustomDoD(85);
    } else if (newChem === 'lto') {
      setCustomDoD(95);
    }
  };

  const result = calculateBatteryRuntime({
    voltage,
    capacityAh,
    loadWatts,
    efficiencyPercent: efficiency,
    chemistry,
    depthOfDischargePercent: customDoD,
  });

  const handleReset = () => {
    setVoltage(12);
    setCapacityAh(100);
    setLoadWatts(150);
    setChemistry('lifepo4');
    setEfficiency(90);
    setCustomDoD(90);
  };

  const copySummaryText = `Battery Runtime Calculation:
Pack: ${voltage}V ${capacityAh}Ah (${chemistry.toUpperCase()})
Load: ${loadWatts} Watts
Usable Energy: ${result.usableEnergyWh} Wh
Current Draw: ${result.currentAmps} A
Estimated Runtime: ${result.runtimeHoursFormatted} (${result.runtimeHours} hours)
Calculated by Bateri.com`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Battery Runtime Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Estimate how long your battery will power a specific electrical load based on chemistry, voltage, and inverter losses.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Preset Loads quick selector */}
      <div className="mt-4">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Quick Preset Loads:
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {PRESET_LOADS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setLoadWatts(preset.watts)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
                loadWatts === preset.watts
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* System Voltage */}
        <div>
          <label htmlFor={voltageInputId} className="block text-xs font-semibold text-slate-700">
            System Voltage (V)
          </label>
          <div className="mt-1.5 flex gap-2">
            {[12, 24, 48].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVoltage(v)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition-all ${
                  voltage === v
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {v}V
              </button>
            ))}
          </div>
          <input
            id={voltageInputId}
            type="number"
            min="1"
            max="1000"
            step="0.1"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="Custom Volts (e.g. 12)"
          />
        </div>

        {/* Battery Capacity */}
        <div>
          <label htmlFor={capacityInputId} className="block text-xs font-semibold text-slate-700">
            Battery Capacity (Ah)
          </label>
          <div className="mt-1.5 flex gap-2">
            {[50, 100, 200, 300].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCapacityAh(c)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition-all ${
                  capacityAh === c
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {c}Ah
              </button>
            ))}
          </div>
          <input
            id={capacityInputId}
            type="number"
            min="1"
            max="10000"
            value={capacityAh}
            onChange={(e) => setCapacityAh(Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="Custom Capacity (Ah)"
          />
        </div>

        {/* Load Watts */}
        <div>
          <label htmlFor={loadInputId} className="block text-xs font-semibold text-slate-700">
            Electrical Load (Watts)
          </label>
          <input
            id={loadInputId}
            type="number"
            min="1"
            max="50000"
            value={loadWatts}
            onChange={(e) => setLoadWatts(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 150"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Continuous power consumption of your device(s).
          </p>
        </div>

        {/* Chemistry */}
        <div>
          <label htmlFor={chemistryInputId} className="block text-xs font-semibold text-slate-700">
            Battery Chemistry
          </label>
          <select
            id={chemistryInputId}
            value={chemistry}
            onChange={(e) => handleChemistryChange(e.target.value as BatteryChemistry)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          >
            <option value="lifepo4">LiFePO4 (Lithium Iron Phosphate - 90% DoD)</option>
            <option value="nmc-lithium">NMC / NCA Lithium (85% DoD)</option>
            <option value="lead-acid-agm">AGM Lead-Acid (50% DoD)</option>
            <option value="lead-acid-flooded">Standard Flooded Lead-Acid (50% DoD)</option>
            <option value="lead-acid-gel">Gel Cell Lead-Acid (50% DoD)</option>
            <option value="lto">LTO (Lithium Titanate - 95% DoD)</option>
          </select>
        </div>

        {/* Depth of Discharge (DoD) */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={dodInputId} className="block text-xs font-semibold text-slate-700">
              Depth of Discharge (DoD)
            </label>
            <span className="text-xs font-bold text-blue-600">{customDoD}%</span>
          </div>
          <input
            id={dodInputId}
            type="range"
            min="20"
            max="100"
            step="5"
            value={customDoD}
            onChange={(e) => setCustomDoD(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Recommended: 50% for Lead-Acid; 85–90% for Lithium.
          </p>
        </div>

        {/* Efficiency */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={efficiencyInputId} className="block text-xs font-semibold text-slate-700">
              Inverter / Wiring Efficiency
            </label>
            <span className="text-xs font-bold text-blue-600">{efficiency}%</span>
          </div>
          <input
            id={efficiencyInputId}
            type="range"
            min="70"
            max="98"
            step="1"
            value={efficiency}
            onChange={(e) => setEfficiency(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Pure sine wave inverters operate at 88%–94% efficiency.
          </p>
        </div>
      </div>

      {/* Results Display Box */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-slate-50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Estimated Performance Output</span>
          </div>
          <CopyButton textToCopy={copySummaryText} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Estimated Runtime
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-black text-blue-600">
              {result.runtimeHoursFormatted}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">({result.runtimeHours} hrs)</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Usable Energy
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
              {result.usableEnergyWh} <span className="text-xs font-normal text-slate-500">Wh</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Total: {result.totalEnergyWh} Wh</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Continuous Draw
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
              {result.currentAmps} <span className="text-xs font-normal text-slate-500">Amps</span>
            </div>
            <span className="text-[11px] text-slate-500">Current from bank</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Max Continuous Rec.
            </span>
            <div className="mt-1 text-xl sm:text-2xl font-black text-emerald-600">
              {result.recommendedMaxDischargeRateAmps} <span className="text-xs font-normal text-slate-500">A</span>
            </div>
            <span className="text-[11px] text-slate-500">Safe discharge rate</span>
          </div>
        </div>

        {/* Lead Acid Peukert Alert */}
        {result.peukertAdjustedHours && (
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
            <span className="font-bold">Peukert Effect Note:</span> Because lead-acid battery capacity drops at high discharge rates, your heavy draw of {result.currentAmps}A will yield roughly <strong>{result.peukertAdjustedHours} hours</strong> of real-world runtime rather than the theoretical {result.runtimeHours} hours.
          </div>
        )}
      </div>

      {/* Formula & Engineering Assumptions */}
      <FormulaCard formula={result.formula} assumptions={result.assumptions} defaultExpanded={false} />
    </div>
  );
};
