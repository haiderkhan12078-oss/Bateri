import React, { useState, useId } from 'react';
import { calculateChargingTime } from '../../lib/calculations/batteryCalculators';
import { BatteryChemistry } from '../../types';
import { FormulaCard } from '../ui/FormulaCard';
import { CopyButton } from '../ui/CopyButton';
import { Gauge, RotateCcw, BatteryCharging, Zap } from 'lucide-react';

export const ChargingTimeCalculator: React.FC = () => {
  const [capacityAh, setCapacityAh] = useState<number>(100);
  const [chargerCurrentA, setChargerCurrentA] = useState<number>(15);
  const [startSoC, setStartSoC] = useState<number>(20);
  const [targetSoC, setTargetSoC] = useState<number>(100);
  const [chemistry, setChemistry] = useState<BatteryChemistry>('lifepo4');

  const capacityInputId = useId();
  const currentInputId = useId();
  const startInputId = useId();
  const targetInputId = useId();
  const chemInputId = useId();

  const result = calculateChargingTime({
    batteryCapacityAh: capacityAh,
    chargerCurrentAmps: chargerCurrentA,
    startingStateOfChargePercent: startSoC,
    targetStateOfChargePercent: targetSoC,
    chemistry,
  });

  const handleReset = () => {
    setCapacityAh(100);
    setChargerCurrentA(15);
    setStartSoC(20);
    setTargetSoC(100);
    setChemistry('lifepo4');
  };

  const copySummaryText = `Battery Charging Estimate:
Capacity: ${capacityAh} Ah (${chemistry.toUpperCase()})
Charger Output: ${chargerCurrentA} Amps
Charge Span: ${startSoC}% to ${targetSoC}%
Bulk Phase (Constant Current): ${result.bulkPhaseHours} hours
Absorption Phase (Taper): ${result.absorptionPhaseHours} hours
Total Estimated Charging Time: ${result.totalTimeFormatted} (${result.totalHours} hrs)
Calculated by Bateri.com`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BatteryCharging className="h-5 w-5 text-blue-600" />
            Battery Charging Time Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Simulate multi-stage charging (Bulk Constant Current & Absorption Constant Voltage) across different battery chemistries.
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
        {/* Battery Capacity */}
        <div>
          <label htmlFor={capacityInputId} className="block text-xs font-semibold text-slate-700">
            Battery Capacity (Ah)
          </label>
          <input
            id={capacityInputId}
            type="number"
            min="1"
            max="5000"
            value={capacityAh}
            onChange={(e) => setCapacityAh(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 100"
          />
        </div>

        {/* Charger Output Current */}
        <div>
          <label htmlFor={currentInputId} className="block text-xs font-semibold text-slate-700">
            Charger Output Current (Amps)
          </label>
          <div className="mt-1.5 flex gap-2">
            {[5, 10, 15, 20, 30].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setChargerCurrentA(a)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition-all ${
                  chargerCurrentA === a
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {a}A
              </button>
            ))}
          </div>
          <input
            id={currentInputId}
            type="number"
            min="0.5"
            max="500"
            step="0.5"
            value={chargerCurrentA}
            onChange={(e) => setChargerCurrentA(Number(e.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="Custom Amps"
          />
        </div>

        {/* Battery Chemistry */}
        <div>
          <label htmlFor={chemInputId} className="block text-xs font-semibold text-slate-700">
            Battery Chemistry
          </label>
          <select
            id={chemInputId}
            value={chemistry}
            onChange={(e) => setChemistry(e.target.value as BatteryChemistry)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          >
            <option value="lifepo4">LiFePO4 (98% efficient, short absorption)</option>
            <option value="nmc-lithium">NMC Lithium (96% efficient)</option>
            <option value="lead-acid-agm">AGM Sealed Lead-Acid (92% efficient)</option>
            <option value="lead-acid-flooded">Standard Flooded (85% efficient)</option>
          </select>
        </div>

        {/* Starting SoC */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={startInputId} className="block text-xs font-semibold text-slate-700">
              Starting State of Charge (SoC)
            </label>
            <span className="text-xs font-bold text-blue-600">{startSoC}%</span>
          </div>
          <input
            id={startInputId}
            type="range"
            min="0"
            max="95"
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
              Target State of Charge (SoC)
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
        </div>
      </div>

      {/* Charging Output Box */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-slate-50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Charging Stage Timeline</span>
          </div>
          <CopyButton textToCopy={copySummaryText} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Time
            </span>
            <div className="mt-1 text-2xl font-black text-blue-600">
              {result.totalTimeFormatted}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">({result.totalHours} hrs)</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Bulk Stage (CC)
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.bulkPhaseHours} <span className="text-xs font-normal text-slate-500">hrs</span>
            </div>
            <span className="text-[11px] text-slate-500">Full {chargerCurrentA}A current</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Absorption Stage (CV)
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.absorptionPhaseHours} <span className="text-xs font-normal text-slate-500">hrs</span>
            </div>
            <span className="text-[11px] text-slate-500">Tapering current</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Energy Input Needed
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-600">
              {result.energyNeededAh} <span className="text-xs font-normal text-slate-500">Ah</span>
            </div>
            <span className="text-[11px] text-slate-500">with {Math.round(result.efficiencyFactor * 100)}% efficiency</span>
          </div>
        </div>
      </div>

      <FormulaCard
        formula="Charging Time = (Deficit Ah × (1 - AbsorptionFactor) ÷ Charger Amps) + (Deficit Ah × AbsorptionFactor ÷ Avg Taper Amps)"
        assumptions={result.assumptions}
        defaultExpanded={false}
      />
    </div>
  );
};
