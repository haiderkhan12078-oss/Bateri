import React, { useState, useId } from 'react';
import { calculateInverterRequirements } from '../../lib/calculations/solarCalculators';
import { FormulaCard } from '../ui/FormulaCard';
import { CopyButton } from '../ui/CopyButton';
import { Zap, RotateCcw, ShieldAlert, Cpu } from 'lucide-react';

export const InverterCalculator: React.FC = () => {
  const [totalWatts, setTotalWatts] = useState<number>(2200);
  const [hasInductive, setHasInductive] = useState<boolean>(true);
  const [systemVoltage, setSystemVoltage] = useState<number>(24);
  const [cableLengthFt, setCableLengthFt] = useState<number>(6);

  const wattsInputId = useId();
  const voltInputId = useId();
  const cableInputId = useId();

  const result = calculateInverterRequirements({
    totalApplianceWatts: totalWatts,
    hasInductiveLoads: hasInductive,
    systemVoltage,
    cableLengthFeet: cableLengthFt,
  });

  const handleReset = () => {
    setTotalWatts(2200);
    setHasInductive(true);
    setSystemVoltage(24);
    setCableLengthFt(6);
  };

  const copySummaryText = `Inverter & Cable Sizing Specification:
Continuous Load: ${totalWatts} Watts
Inductive Motor Surges: ${hasInductive ? 'Yes' : 'No'}
System Voltage: ${systemVoltage}V DC
Recommended Inverter: ${result.recommendedContinuousWatts}W Pure Sine Wave (${result.recommendedSurgeWatts}W Surge)
Max DC Input Amps: ${result.maxContinuousDCCurrentAmps} A
Recommended DC Fuse / Breaker: ${result.recommendedFuseAmps} A
Recommended DC Cable Gauge: ${result.recommendedCableGaugeAWG} (for ${cableLengthFt} ft run)
Calculated by Bateri.com`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-600" />
            Inverter & DC Cable Gauge Sizing Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Calculate continuous and surge wattage ratings, max DC amperage draw, DC fuse sizing, and safe AWG battery cable gauge.
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
        {/* Total Simultaneous Watts */}
        <div>
          <label htmlFor={wattsInputId} className="block text-xs font-semibold text-slate-700">
            Total Running Load (Watts)
          </label>
          <input
            id={wattsInputId}
            type="number"
            min="100"
            max="30000"
            value={totalWatts}
            onChange={(e) => setTotalWatts(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 2200"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Sum of all appliances that might run simultaneously.
          </p>
        </div>

        {/* System Voltage */}
        <div>
          <label htmlFor={voltInputId} className="block text-xs font-semibold text-slate-700">
            DC System Bus Voltage
          </label>
          <div className="mt-1.5 flex gap-2">
            {[12, 24, 48].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSystemVoltage(v)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition-all ${
                  systemVoltage === v
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {v}V
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Higher voltage reduces DC current draw and wire thickness.
          </p>
        </div>

        {/* Cable Run Length */}
        <div>
          <label htmlFor={cableInputId} className="block text-xs font-semibold text-slate-700">
            Battery-to-Inverter Cable Run (Feet)
          </label>
          <input
            id={cableInputId}
            type="number"
            min="1"
            max="50"
            value={cableLengthFt}
            onChange={(e) => setCableLengthFt(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 6"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            One-way physical distance between battery terminals and inverter.
          </p>
        </div>

        {/* Inductive Loads Checkbox */}
        <div className="md:col-span-2 lg:col-span-3 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3.5">
          <input
            id="inductiveCheckbox"
            type="checkbox"
            checked={hasInductive}
            onChange={(e) => setHasInductive(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="inductiveCheckbox" className="text-xs text-slate-700 cursor-pointer">
            <span className="font-semibold block text-slate-900">
              System includes inductive motor / compressor loads (e.g. Fridge, A/C, Air Compressor, Power Tools)
            </span>
            Motors require 2x to 3x starting surge wattage for 2–5 seconds during compressor startup.
          </label>
        </div>
      </div>

      {/* Inverter Results Box */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-slate-50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Recommended Inverter & Electrical Sizing</span>
          </div>
          <CopyButton textToCopy={copySummaryText} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Continuous Inverter
            </span>
            <div className="mt-1 text-2xl font-black text-blue-600">
              {result.recommendedContinuousWatts} <span className="text-xs font-normal text-slate-500">W</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Pure Sine Wave</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Peak Surge Rating
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.recommendedSurgeWatts} <span className="text-xs font-normal text-slate-500">W</span>
            </div>
            <span className="text-[11px] text-slate-500">Motor startup surge</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Max DC Current
            </span>
            <div className="mt-1 text-2xl font-black text-amber-600">
              {result.maxContinuousDCCurrentAmps} <span className="text-xs font-normal text-slate-500">Amps</span>
            </div>
            <span className="text-[11px] text-slate-500">Fuse: {result.recommendedFuseAmps}A Class-T / ANL</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              DC Cable Gauge
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-600">
              {result.recommendedCableGaugeAWG}
            </div>
            <span className="text-[11px] text-slate-500">Pure copper (105°C)</span>
          </div>
        </div>
      </div>

      <FormulaCard
        formula="Max DC Current = Continuous Watts ÷ (System Volts × Inverter Efficiency); Cable sized for <2% voltage drop"
        assumptions={result.assumptions}
        defaultExpanded={false}
      />
    </div>
  );
};
