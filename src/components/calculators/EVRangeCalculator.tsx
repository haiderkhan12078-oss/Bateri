import React, { useState, useId } from 'react';
import { calculateEVRange } from '../../lib/calculations/evCalculators';
import { FormulaCard } from '../ui/FormulaCard';
import { CopyButton } from '../ui/CopyButton';
import { Zap, RotateCcw, Navigation, Thermometer, Wind } from 'lucide-react';

interface EVPreset {
  name: string;
  usableKWh: number;
  epaMi: number;
  ratedWhPerMi: number;
}

const EV_PRESETS: EVPreset[] = [
  { name: 'Tesla Model Y Long Range', usableKWh: 75, epaMi: 310, ratedWhPerMi: 260 },
  { name: 'Tesla Model 3 RWD', usableKWh: 57.5, epaMi: 272, ratedWhPerMi: 235 },
  { name: 'Ford Mustang Mach-E Ext', usableKWh: 91, epaMi: 300, ratedWhPerMi: 315 },
  { name: 'Hyundai Ioniq 5 AWD', usableKWh: 77.4, epaMi: 260, ratedWhPerMi: 300 },
  { name: 'Rivian R1T Large Pack', usableKWh: 135, epaMi: 352, ratedWhPerMi: 420 },
  { name: 'Chevy Bolt EV', usableKWh: 65, epaMi: 259, ratedWhPerMi: 255 },
];

export const EVRangeCalculator: React.FC = () => {
  const [usableKWh, setUsableKWh] = useState<number>(75);
  const [ratedWhPerMi, setRatedWhPerMi] = useState<number>(260);
  const [speedMph, setSpeedMph] = useState<number>(65);
  const [tempF, setTempF] = useState<number>(70);
  const [hvacState, setHvacState] = useState<'off' | 'mild-ac' | 'heavy-ac' | 'mild-heat' | 'extreme-heat'>('mild-ac');
  const [startSoC, setStartSoC] = useState<number>(90);
  const [endSoC, setEndSoC] = useState<number>(10);

  const kwhInputId = useId();
  const speedInputId = useId();
  const tempInputId = useId();
  const hvacInputId = useId();
  const startInputId = useId();
  const endInputId = useId();

  const handleSelectPreset = (preset: EVPreset) => {
    setUsableKWh(preset.usableKWh);
    setRatedWhPerMi(preset.ratedWhPerMi);
  };

  const result = calculateEVRange({
    usableBatteryCapacityKWh: usableKWh,
    ratedEfficiencyWhPerMile: ratedWhPerMi,
    ambientTemperatureF: tempF,
    averageSpeedMph: speedMph,
    hvacUsage: hvacState,
    startingSoC: startSoC,
    targetEndSoC: endSoC,
  });

  const handleReset = () => {
    setUsableKWh(75);
    setRatedWhPerMi(260);
    setSpeedMph(65);
    setTempF(70);
    setHvacState('mild-ac');
    setStartSoC(90);
    setEndSoC(10);
  };

  const copySummaryText = `EV Range & Consumption Estimate:
Battery Pack: ${usableKWh} kWh usable (${startSoC}% to ${endSoC}% SoC)
Speed: ${speedMph} mph | Ambient Temp: ${tempF}°F | HVAC: ${hvacState}
Estimated Real-World Range: ${result.estimatedRangeMiles} miles (${result.estimatedRangeKm} km)
Real-World Consumption: ${result.adjustedWhPerMile} Wh/mi (${result.adjustedWhPerKm} Wh/km)
Range Penalty vs EPA: -${result.rangeLossPercentage}%
Calculated by Bateri.com`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Electric Vehicle (EV) Real-World Range & Efficiency Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Simulate real-world EV highway driving range factoring in aerodynamic drag, sub-zero winter temperatures, and HVAC cabin heating.
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

      {/* EV Presets */}
      <div className="mt-4">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Quick Vehicle Presets:
        </span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {EV_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
                usableKWh === preset.usableKWh
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
        {/* Usable Battery Pack kWh */}
        <div>
          <label htmlFor={kwhInputId} className="block text-xs font-semibold text-slate-700">
            Usable Battery Capacity (kWh)
          </label>
          <input
            id={kwhInputId}
            type="number"
            min="10"
            max="250"
            step="0.5"
            value={usableKWh}
            onChange={(e) => setUsableKWh(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            placeholder="e.g. 75"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Net usable capacity (excludes buffer).
          </p>
        </div>

        {/* Highway Cruising Speed */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={speedInputId} className="block text-xs font-semibold text-slate-700">
              Cruising Speed
            </label>
            <span className="text-xs font-bold text-blue-600">{speedMph} mph ({Math.round(speedMph * 1.609)} km/h)</span>
          </div>
          <input
            id={speedInputId}
            type="range"
            min="45"
            max="85"
            step="5"
            value={speedMph}
            onChange={(e) => setSpeedMph(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Aerodynamic drag increases with the square of velocity (v²).
          </p>
        </div>

        {/* Ambient Temperature */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={tempInputId} className="block text-xs font-semibold text-slate-700">
              Ambient Outside Temperature
            </label>
            <span className="text-xs font-bold text-blue-600">{tempF}°F ({Math.round((tempF - 32) * (5 / 9))}°C)</span>
          </div>
          <input
            id={tempInputId}
            type="range"
            min="-10"
            max="110"
            step="5"
            value={tempF}
            onChange={(e) => setTempF(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Freezing temps increase air density and internal battery resistance.
          </p>
        </div>

        {/* HVAC Usage */}
        <div>
          <label htmlFor={hvacInputId} className="block text-xs font-semibold text-slate-700">
            Cabin Climate Control (HVAC)
          </label>
          <select
            id={hvacInputId}
            value={hvacState}
            onChange={(e) => setHvacState(e.target.value as any)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
          >
            <option value="off">Off (Windows up, fan off)</option>
            <option value="mild-ac">Mild A/C (72°F / 22°C)</option>
            <option value="heavy-ac">Max Cooling A/C (Ext. 95°F+)</option>
            <option value="mild-heat">Mild Cabin Heater (68°F / 20°C)</option>
            <option value="extreme-heat">Max Winter Defrost & Cabin Heat</option>
          </select>
        </div>

        {/* Starting SoC */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={startInputId} className="block text-xs font-semibold text-slate-700">
              Starting Charge (SoC)
            </label>
            <span className="text-xs font-bold text-blue-600">{startSoC}%</span>
          </div>
          <input
            id={startInputId}
            type="range"
            min="20"
            max="100"
            step="5"
            value={startSoC}
            onChange={(e) => setStartSoC(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
        </div>

        {/* Target Arrival SoC */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={endInputId} className="block text-xs font-semibold text-slate-700">
              Target Arrival Buffer (SoC)
            </label>
            <span className="text-xs font-bold text-blue-600">{endSoC}%</span>
          </div>
          <input
            id={endInputId}
            type="range"
            min="5"
            max={startSoC - 10}
            step="5"
            value={endSoC}
            onChange={(e) => setEndSoC(Number(e.target.value))}
            className="mt-3 w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Results Box */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-slate-50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Estimated Real-World EV Trip Range</span>
          </div>
          <CopyButton textToCopy={copySummaryText} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Real-World Range
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-blue-600">
              {result.estimatedRangeMiles} <span className="text-sm font-normal text-slate-500">miles</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">({result.estimatedRangeKm} km)</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Real Consumption
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.adjustedWhPerMile} <span className="text-xs font-normal text-slate-500">Wh/mi</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">({result.adjustedWhPerKm} Wh/km)</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Usable Trip Energy
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.energyUsedKWh} <span className="text-xs font-normal text-slate-500">kWh</span>
            </div>
            <span className="text-[11px] text-slate-500">From {startSoC}% to {endSoC}%</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Weather/Speed Loss
            </span>
            <div className="mt-1 text-2xl font-black text-amber-600">
              -{result.rangeLossPercentage}%
            </div>
            <span className="text-[11px] text-slate-500">vs optimal EPA rating</span>
          </div>
        </div>
      </div>

      <FormulaCard
        formula="Real-World Range = (Usable kWh × SoC Window × 1000) ÷ (Rated Wh/mi × SpeedPenalty × TempPenalty × HVACPenalty)"
        assumptions={result.assumptions}
        defaultExpanded={false}
      />
    </div>
  );
};
