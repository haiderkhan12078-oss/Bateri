import React, { useState, useId } from 'react';
import { calculateEVChargingTime } from '../../lib/calculations/evCalculators';
import { FormulaCard } from '../ui/FormulaCard';
import { CopyButton } from '../ui/CopyButton';
import { Zap, RotateCcw, DollarSign, Clock, Shield } from 'lucide-react';

interface ChargerPreset {
  name: string;
  powerKW: number;
  type: string;
}

const CHARGER_PRESETS: ChargerPreset[] = [
  { name: 'Standard 120V Outlet (Level 1)', powerKW: 1.4, type: 'AC Home' },
  { name: 'NEMA 14-50 32A Wall Box (Level 2)', powerKW: 7.7, type: 'AC Home' },
  { name: 'Tesla Wall Connector 48A (Level 2)', powerKW: 11.5, type: 'AC Home' },
  { name: 'Public Commercial AC (Level 2)', powerKW: 19.2, type: 'AC Public' },
  { name: '50 kW DC Fast Charger', powerKW: 50, type: 'DC Fast' },
  { name: '150 kW DC Fast Charger', powerKW: 150, type: 'DC Fast' },
  { name: '250 kW Supercharger V3 / 350kW HPC', powerKW: 250, type: 'DC Ultra' },
];

export const EVChargingCalculator: React.FC = () => {
  const [batterySizeKWh, setBatterySizeKWh] = useState<number>(75);
  const [startSoC, setStartSoC] = useState<number>(10);
  const [targetSoC, setTargetSoC] = useState<number>(80);
  const [chargerPowerKW, setChargerPowerKW] = useState<number>(150);
  const [costPerKWh, setCostPerKWh] = useState<number>(0.35);

  const sizeInputId = useId();
  const startInputId = useId();
  const targetInputId = useId();
  const powerInputId = useId();
  const costInputId = useId();

  const result = calculateEVChargingTime({
    batterySizeKWh,
    currentSoC: startSoC,
    targetSoC,
    chargerPowerKW,
    electricityCostPerKWh: costPerKWh,
  });

  const handleReset = () => {
    setBatterySizeKWh(75);
    setStartSoC(10);
    setTargetSoC(80);
    setChargerPowerKW(150);
    setCostPerKWh(0.35);
  };

  const copySummaryText = `EV Charging Session Estimate:
Battery Pack: ${batterySizeKWh} kWh (${startSoC}% to ${targetSoC}%)
Charger Output: ${chargerPowerKW} kW (Effective Average: ${result.averageEffectivePowerKW} kW)
Energy Added: ${result.energyAddedKWh} kWh
Charging Duration: ${result.chargingTimeFormatted} (${result.chargingTimeHours} hrs)
Estimated Session Cost: $${result.estimatedCostUSD}
Calculated by Bateri.com`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            EV Charging Time & Cost Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Simulate Level 1, Level 2, and DC Fast charging duration with thermal throttling and high-SoC battery curve tapering.
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

      {/* Charger Presets */}
      <div className="mt-4">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Quick Charger Presets:
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {CHARGER_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setChargerPowerKW(preset.powerKW)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
                chargerPowerKW === preset.powerKW
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Battery Size */}
        <div>
          <label htmlFor={sizeInputId} className="block text-xs font-semibold text-slate-700">
            Total Battery Pack Size (kWh)
          </label>
          <input
            id={sizeInputId}
            type="number"
            min="10"
            max="250"
            step="0.5"
            value={batterySizeKWh}
            onChange={(e) => setBatterySizeKWh(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 75"
          />
        </div>

        {/* Charger Power KW */}
        <div>
          <label htmlFor={powerInputId} className="block text-xs font-semibold text-slate-700">
            Charger Rated Power (kW)
          </label>
          <input
            id={powerInputId}
            type="number"
            min="1"
            max="400"
            step="0.5"
            value={chargerPowerKW}
            onChange={(e) => setChargerPowerKW(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 150"
          />
        </div>

        {/* Cost per kWh */}
        <div>
          <label htmlFor={costInputId} className="block text-xs font-semibold text-slate-700">
            Electricity / Charger Rate ($ / kWh)
          </label>
          <input
            id={costInputId}
            type="number"
            min="0"
            max="2"
            step="0.01"
            value={costPerKWh}
            onChange={(e) => setCostPerKWh(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 0.35"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Home AC: ~$0.14–$0.22/kWh; DC Fast: ~$0.35–$0.55/kWh.
          </p>
        </div>

        {/* Starting SoC */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={startInputId} className="block text-xs font-semibold text-slate-700">
              Starting Battery Level (SoC)
            </label>
            <span className="text-xs font-bold text-blue-600">{startSoC}%</span>
          </div>
          <input
            id={startInputId}
            type="range"
            min="0"
            max="90"
            step="5"
            value={startSoC}
            onChange={(e) => setStartSoC(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
        </div>

        {/* Target SoC */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={targetInputId} className="block text-xs font-semibold text-slate-700">
              Target Charge Level (SoC)
            </label>
            <span className="text-xs font-bold text-blue-600">{targetSoC}%</span>
          </div>
          <input
            id={targetInputId}
            type="range"
            min={startSoC + 5}
            max="100"
            step="5"
            value={targetSoC}
            onChange={(e) => setTargetSoC(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Note: DC Fast charging slows down dramatically above 80% SoC.
          </p>
        </div>
      </div>

      {/* Charging Session Results Box */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-slate-50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Charging Session Timeline & Cost</span>
          </div>
          <CopyButton textToCopy={copySummaryText} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Estimated Duration
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-blue-600">
              {result.chargingTimeFormatted}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">({result.chargingTimeHours} hrs)</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Energy Added
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.energyAddedKWh} <span className="text-xs font-normal text-slate-500">kWh</span>
            </div>
            <span className="text-[11px] text-slate-500">From {startSoC}% to {targetSoC}%</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Avg Effective Power
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.averageEffectivePowerKW} <span className="text-xs font-normal text-slate-500">kW</span>
            </div>
            <span className="text-[11px] text-slate-500">Taper-adjusted</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Estimated Session Cost
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-600">
              ${result.estimatedCostUSD}
            </div>
            <span className="text-[11px] text-slate-500">at ${costPerKWh}/kWh</span>
          </div>
        </div>
      </div>

      <FormulaCard
        formula="Time = (Energy Added ÷ (Charger kW × TaperEfficiency)) + Onboard Inverter Overhead"
        assumptions={result.assumptions}
        defaultExpanded={false}
      />
    </div>
  );
};
