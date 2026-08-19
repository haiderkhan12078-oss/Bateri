import React, { useState, useId } from 'react';
import { calculateBatteryCapacity } from '../../lib/calculations/batteryCalculators';
import { FormulaCard } from '../ui/FormulaCard';
import { CopyButton } from '../ui/CopyButton';
import { BatteryCharging, RotateCcw, CheckCircle } from 'lucide-react';

export const BatteryCapacityCalculator: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(12);
  const [loadWatts, setLoadWatts] = useState<number>(200);
  const [desiredHours, setDesiredHours] = useState<number>(10);
  const [dod, setDod] = useState<number>(80);
  const [efficiency, setEfficiency] = useState<number>(90);

  const voltageInputId = useId();
  const loadInputId = useId();
  const hoursInputId = useId();
  const dodInputId = useId();
  const effInputId = useId();

  const result = calculateBatteryCapacity({
    voltage,
    loadWatts,
    desiredRuntimeHours: desiredHours,
    depthOfDischargePercent: dod,
    efficiencyPercent: efficiency,
  });

  const handleReset = () => {
    setVoltage(12);
    setLoadWatts(200);
    setDesiredHours(10);
    setDod(80);
    setEfficiency(90);
  };

  const copySummaryText = `Battery Capacity Requirement:
System: ${voltage}V
Continuous Load: ${loadWatts} Watts for ${desiredHours} Hours
Required Nominal Capacity: ${result.requiredCapacityAh} Ah (${result.totalEnergyRequiredWh} Wh)
Recommended with 20% Safety Buffer: ${result.recommendedCapacityAhWithMargin} Ah
Calculated by Bateri.com`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BatteryCharging className="h-5 w-5 text-blue-600" />
            Battery Capacity Sizing Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Determine how many Amp-Hours (Ah) or Watt-Hours (Wh) you need to sustain your appliances for a specific target duration.
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

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* System Voltage */}
        <div>
          <label htmlFor={voltageInputId} className="block text-xs font-semibold text-slate-700">
            Target System Voltage (V)
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
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="Custom Voltage"
          />
        </div>

        {/* Electrical Load */}
        <div>
          <label htmlFor={loadInputId} className="block text-xs font-semibold text-slate-700">
            Continuous Load (Watts)
          </label>
          <input
            id={loadInputId}
            type="number"
            min="1"
            max="50000"
            value={loadWatts}
            onChange={(e) => setLoadWatts(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 200"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Total average wattage drawn by all running appliances.
          </p>
        </div>

        {/* Desired Runtime */}
        <div>
          <label htmlFor={hoursInputId} className="block text-xs font-semibold text-slate-700">
            Desired Runtime (Hours)
          </label>
          <input
            id={hoursInputId}
            type="number"
            min="0.1"
            max="720"
            step="0.5"
            value={desiredHours}
            onChange={(e) => setDesiredHours(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 10"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Target continuous backup runtime required.
          </p>
        </div>

        {/* Depth of Discharge */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={dodInputId} className="block text-xs font-semibold text-slate-700">
              Depth of Discharge (DoD)
            </label>
            <span className="text-xs font-bold text-blue-600">{dod}%</span>
          </div>
          <input
            id={dodInputId}
            type="range"
            min="30"
            max="100"
            step="5"
            value={dod}
            onChange={(e) => setDod(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            50% for standard Lead-Acid; 80–90% for LiFePO4.
          </p>
        </div>

        {/* Efficiency */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={effInputId} className="block text-xs font-semibold text-slate-700">
              Inverter / System Efficiency
            </label>
            <span className="text-xs font-bold text-blue-600">{efficiency}%</span>
          </div>
          <input
            id={effInputId}
            type="range"
            min="70"
            max="98"
            step="1"
            value={efficiency}
            onChange={(e) => setEfficiency(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Typical AC inverters have 88%–92% efficiency.
          </p>
        </div>
      </div>

      {/* Sizing Output Box */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-slate-50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Recommended Battery Bank Capacity</span>
          </div>
          <CopyButton textToCopy={copySummaryText} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Required Capacity
            </span>
            <div className="mt-1 text-2xl font-black text-blue-600">
              {result.requiredCapacityAh} <span className="text-xs font-normal text-slate-500">Ah</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">at {voltage}V</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Rec. with 20% Buffer
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-600">
              {result.recommendedCapacityAhWithMargin} <span className="text-xs font-normal text-slate-500">Ah</span>
            </div>
            <span className="text-[11px] text-slate-500">Longevity buffer</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Energy (Wh)
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.totalEnergyRequiredWh} <span className="text-xs font-normal text-slate-500">Wh</span>
            </div>
            <span className="text-[11px] text-slate-500">({Math.round((result.totalEnergyRequiredWh / 1000) * 10) / 10} kWh)</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Continuous DC Current
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.continuousDrawAmps} <span className="text-xs font-normal text-slate-500">Amps</span>
            </div>
            <span className="text-[11px] text-slate-500">Wiring load</span>
          </div>
        </div>
      </div>

      <FormulaCard formula={result.formula} assumptions={result.assumptions} defaultExpanded={false} />
    </div>
  );
};
