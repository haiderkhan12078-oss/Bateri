import React, { useState, useId } from 'react';
import { calculateSolarBatteryBank } from '../../lib/calculations/solarCalculators';
import { FormulaCard } from '../ui/FormulaCard';
import { CopyButton } from '../ui/CopyButton';
import { Sun, RotateCcw, ShieldCheck, Battery } from 'lucide-react';

export const SolarBankCalculator: React.FC = () => {
  const [dailyKWh, setDailyKWh] = useState<number>(10);
  const [autonomyDays, setAutonomyDays] = useState<number>(2);
  const [systemVoltage, setSystemVoltage] = useState<number>(48);
  const [chemistry, setChemistry] = useState<'lifepo4' | 'lead-acid'>('lifepo4');
  const [minTempC, setMinTempC] = useState<number>(15);

  const dailyInputId = useId();
  const autoInputId = useId();
  const voltInputId = useId();
  const chemInputId = useId();
  const tempInputId = useId();

  const result = calculateSolarBatteryBank({
    dailyEnergyConsumptionKWh: dailyKWh,
    daysOfAutonomy: autonomyDays,
    systemVoltage,
    batteryChemistry: chemistry,
    minimumTemperatureC: minTempC,
  });

  const handleReset = () => {
    setDailyKWh(10);
    setAutonomyDays(2);
    setSystemVoltage(48);
    setChemistry('lifepo4');
    setMinTempC(15);
  };

  const copySummaryText = `Solar Battery Bank Sizing:
Daily Consumption: ${dailyKWh} kWh/day
Days of Autonomy: ${autonomyDays} days
System Bus Voltage: ${systemVoltage}V DC
Required Usable Storage: ${result.usableCapacityRequiredKWh} kWh
Recommended Total Bank Capacity: ${result.totalNominalCapacityKWh} kWh (${result.totalNominalCapacityAh} Ah @ ${systemVoltage}V)
Calculated by Bateri.com`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" />
            Solar Battery Bank Sizing Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Size off-grid and hybrid solar storage banks with days of autonomy, depth of discharge protection, and winter temperature derating.
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
        {/* Daily Energy Consumption */}
        <div>
          <label htmlFor={dailyInputId} className="block text-xs font-semibold text-slate-700">
            Daily Energy Consumption (kWh / Day)
          </label>
          <input
            id={dailyInputId}
            type="number"
            min="0.5"
            max="200"
            step="0.5"
            value={dailyKWh}
            onChange={(e) => setDailyKWh(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 10 kWh"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Average US home: ~25–30 kWh/day; Off-grid cabin/RV: ~3–10 kWh/day.
          </p>
        </div>

        {/* Days of Autonomy */}
        <div>
          <label htmlFor={autoInputId} className="block text-xs font-semibold text-slate-700">
            Days of Autonomy (Backup Days)
          </label>
          <div className="mt-1.5 flex gap-2">
            {[1, 2, 3, 4].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setAutonomyDays(d)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition-all ${
                  autonomyDays === d
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {d} {d === 1 ? 'Day' : 'Days'}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Number of overcast days without solar generation before depletion.
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
            48V is the standard for solar banks over 3 kWh.
          </p>
        </div>

        {/* Chemistry */}
        <div>
          <label htmlFor={chemInputId} className="block text-xs font-semibold text-slate-700">
            Storage Chemistry
          </label>
          <select
            id={chemInputId}
            value={chemistry}
            onChange={(e) => setChemistry(e.target.value as 'lifepo4' | 'lead-acid')}
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          >
            <option value="lifepo4">LiFePO4 Lithium (90% DoD, 4,000+ cycles)</option>
            <option value="lead-acid">Deep Cycle AGM / Flooded (50% DoD)</option>
          </select>
        </div>

        {/* Minimum Ambient Temperature */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={tempInputId} className="block text-xs font-semibold text-slate-700">
              Lowest Ambient Temperature
            </label>
            <span className="text-xs font-bold text-blue-600">{minTempC}°C ({Math.round(minTempC * 1.8 + 32)}°F)</span>
          </div>
          <input
            id={tempInputId}
            type="range"
            min="-10"
            max="35"
            step="5"
            value={minTempC}
            onChange={(e) => setMinTempC(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Cold temperatures decrease chemical capacity in unheated battery enclosures.
          </p>
        </div>
      </div>

      {/* Solar Sizing Results Display */}
      <div className="mt-8 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/50 via-slate-50 to-blue-50/40 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
          <div className="flex items-center gap-2">
            <Battery className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-bold text-slate-900">Recommended Solar Battery Bank Size</span>
          </div>
          <CopyButton textToCopy={copySummaryText} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Bank Energy
            </span>
            <div className="mt-1 text-2xl font-black text-amber-600">
              {result.totalNominalCapacityKWh} <span className="text-xs font-normal text-slate-500">kWh</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Usable: {result.usableCapacityRequiredKWh} kWh
            </span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Bank Capacity in Ah
            </span>
            <div className="mt-1 text-2xl font-black text-blue-600">
              {result.totalNominalCapacityAh} <span className="text-xs font-normal text-slate-500">Ah</span>
            </div>
            <span className="text-[11px] text-slate-500">at {systemVoltage}V bus</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              100Ah Batteries (Units)
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.recommended100AhBatteries} <span className="text-xs font-normal text-slate-500">units</span>
            </div>
            <span className="text-[11px] text-slate-500">12V 100Ah modules</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Daily Usable Energy
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-600">
              {dailyKWh * autonomyDays} <span className="text-xs font-normal text-slate-500">kWh</span>
            </div>
            <span className="text-[11px] text-slate-500">for {autonomyDays} full days</span>
          </div>
        </div>
      </div>

      <FormulaCard
        formula="Nominal Bank kWh = (Daily kWh × Days of Autonomy) ÷ (DoD × Efficiency × TempDerate)"
        assumptions={result.assumptions}
        defaultExpanded={false}
      />
    </div>
  );
};
