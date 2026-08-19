import React, { useState } from 'react';
import {
  convertAhToWh,
  convertWhToAh,
  convertMahToWh,
  convertWattsToAmps,
  convertAmpsToWatts,
  convertCcaToCa,
} from '../../lib/calculations/converters';
import { CopyButton } from '../ui/CopyButton';
import { FormulaCard } from '../ui/FormulaCard';
import { Repeat, ArrowRight, RotateCcw } from 'lucide-react';

interface ConverterToolProps {
  initialSubTab?: string;
}

export const ConverterTool: React.FC<ConverterToolProps> = ({ initialSubTab = 'ah-to-wh' }) => {
  const [activeConverter, setActiveConverter] = useState<string>(initialSubTab);

  // Ah to Wh state
  const [ahValue, setAhValue] = useState<number>(100);
  const [ahVolts, setAhVolts] = useState<number>(12);

  // Wh to Ah state
  const [whValue, setWhValue] = useState<number>(1200);
  const [whVolts, setWhVolts] = useState<number>(12);

  // mAh to Wh state
  const [mahValue, setMahValue] = useState<number>(20000);
  const [mahVolts, setMahVolts] = useState<number>(3.7);

  // Watts to Amps state
  const [wValue, setWValue] = useState<number>(1200);
  const [wVolts, setWVolts] = useState<number>(120);

  // Amps to Watts state
  const [aValue, setAValue] = useState<number>(10);
  const [aVolts, setAVolts] = useState<number>(120);

  // CCA to CA state
  const [ccaValue, setCcaValue] = useState<number>(650);

  const converterTabs = [
    { id: 'ah-to-wh', label: 'Ah to Wh' },
    { id: 'wh-to-ah', label: 'Wh to Ah' },
    { id: 'mah-to-wh', label: 'mAh to Wh' },
    { id: 'watts-to-amps', label: 'Watts to Amps' },
    { id: 'amps-to-watts', label: 'Amps to Watts' },
    { id: 'cca-to-ca', label: 'CCA to CA' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Repeat className="h-5 w-5 text-blue-600" />
            Electrical & Battery Unit Converters
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Instant bidirectional unit conversion with standard formulas, reference examples, and step explanations.
          </p>
        </div>
      </div>

      {/* Converter Sub-Tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
        {converterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveConverter(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeConverter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Converter 1: Ah to Wh */}
      {activeConverter === 'ah-to-wh' && (() => {
        const res = convertAhToWh(ahValue, ahVolts);
        return (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Capacity in Amp-Hours (Ah)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={ahValue}
                  onChange={(e) => setAhValue(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Nominal Voltage (V)
                </label>
                <div className="mt-1.5 flex gap-1.5">
                  {[3.7, 12, 24, 48].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAhVolts(v)}
                      className={`flex-1 rounded-md py-1 text-xs font-medium border ${
                        ahVolts === v ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'border-slate-200'
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={ahVolts}
                  onChange={(e) => setAhVolts(Number(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  placeholder="Custom Volts"
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Calculated Energy
                </span>
                <div className="text-3xl font-black text-blue-600">
                  {res.wattHours} <span className="text-base font-normal text-slate-600">Watt-Hours (Wh)</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Equivalent to <strong>{res.kilowattHours} kWh</strong> or {res.milliampHours.toLocaleString()} mAh
                </div>
              </div>
              <CopyButton textToCopy={`${ahValue}Ah at ${ahVolts}V = ${res.wattHours} Wh (${res.kilowattHours} kWh)`} />
            </div>

            <FormulaCard formula={res.formula} assumptions={[]} defaultExpanded={true} />
          </div>
        );
      })()}

      {/* Converter 2: Wh to Ah */}
      {activeConverter === 'wh-to-ah' && (() => {
        const res = convertWhToAh(whValue, whVolts);
        return (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Energy in Watt-Hours (Wh)
                </label>
                <input
                  type="number"
                  min="1"
                  value={whValue}
                  onChange={(e) => setWhValue(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Nominal Voltage (V)
                </label>
                <div className="mt-1.5 flex gap-1.5">
                  {[12, 24, 48].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setWhVolts(v)}
                      className={`flex-1 rounded-md py-1 text-xs font-medium border ${
                        whVolts === v ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'border-slate-200'
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={whVolts}
                  onChange={(e) => setWhVolts(Number(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Calculated Capacity
                </span>
                <div className="text-3xl font-black text-blue-600">
                  {res.ampHours} <span className="text-base font-normal text-slate-600">Amp-Hours (Ah)</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Equal to <strong>{res.milliampHours.toLocaleString()} mAh</strong>
                </div>
              </div>
              <CopyButton textToCopy={`${whValue}Wh at ${whVolts}V = ${res.ampHours} Ah`} />
            </div>

            <FormulaCard formula={res.formula} assumptions={[]} defaultExpanded={true} />
          </div>
        );
      })()}

      {/* Converter 3: mAh to Wh */}
      {activeConverter === 'mah-to-wh' && (() => {
        const res = convertMahToWh(mahValue, mahVolts);
        return (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Milliamp-Hours (mAh)
                </label>
                <input
                  type="number"
                  min="1"
                  value={mahValue}
                  onChange={(e) => setMahValue(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  placeholder="e.g. 20000"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Common for power banks, drones, phones, and flashlight 18650/21700 cells.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Cell / Battery Voltage (V)
                </label>
                <div className="mt-1.5 flex gap-1.5">
                  {[3.7, 3.85, 7.4, 11.1].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMahVolts(v)}
                      className={`flex-1 rounded-md py-1 text-xs font-medium border ${
                        mahVolts === v ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'border-slate-200'
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0.1"
                  step="0.05"
                  value={mahVolts}
                  onChange={(e) => setMahVolts(Number(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Energy Rating
                </span>
                <div className="text-3xl font-black text-blue-600">
                  {res.wattHours} <span className="text-base font-normal text-slate-600">Wh</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {res.wattHours <= 100 ? (
                    <span className="text-emerald-700 font-semibold">
                      ✓ TSA / Airline Passenger Cabin Approved (&lt;100 Wh limit)
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold">
                      ⚠ Exceeds 100 Wh airline carry-on limit without airline pre-approval
                    </span>
                  )}
                </div>
              </div>
              <CopyButton textToCopy={`${mahValue}mAh at ${mahVolts}V = ${res.wattHours} Wh`} />
            </div>

            <FormulaCard formula={res.formula} assumptions={[]} defaultExpanded={true} />
          </div>
        );
      })()}

      {/* Converter 4: Watts to Amps */}
      {activeConverter === 'watts-to-amps' && (() => {
        const res = convertWattsToAmps(wValue, wVolts);
        return (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Power in Watts (W)
                </label>
                <input
                  type="number"
                  min="1"
                  value={wValue}
                  onChange={(e) => setWValue(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Voltage (V)
                </label>
                <div className="mt-1.5 flex gap-1.5">
                  {[12, 24, 120, 230].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setWVolts(v)}
                      className={`flex-1 rounded-md py-1 text-xs font-medium border ${
                        wVolts === v ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'border-slate-200'
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  value={wVolts}
                  onChange={(e) => setWVolts(Number(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Current Draw
                </span>
                <div className="text-3xl font-black text-blue-600">
                  {res.currentAmps} <span className="text-base font-normal text-slate-600">Amps (A)</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Continuous DC / AC resistive current
                </div>
              </div>
              <CopyButton textToCopy={`${wValue} Watts at ${wVolts}V = ${res.currentAmps} Amps`} />
            </div>

            <FormulaCard formula={res.formula} assumptions={[]} defaultExpanded={true} />
          </div>
        );
      })()}

      {/* Converter 5: Amps to Watts */}
      {activeConverter === 'amps-to-watts' && (() => {
        const res = convertAmpsToWatts(aValue, aVolts);
        return (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Current in Amperes (A)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={aValue}
                  onChange={(e) => setAValue(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Voltage (V)
                </label>
                <div className="mt-1.5 flex gap-1.5">
                  {[12, 24, 120, 230].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAVolts(v)}
                      className={`flex-1 rounded-md py-1 text-xs font-medium border ${
                        aVolts === v ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'border-slate-200'
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  value={aVolts}
                  onChange={(e) => setAVolts(Number(e.target.value))}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Power Consumption
                </span>
                <div className="text-3xl font-black text-blue-600">
                  {res.powerWatts} <span className="text-base font-normal text-slate-600">Watts (W)</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Equivalent to {res.powerKilowatts} kW
                </div>
              </div>
              <CopyButton textToCopy={`${aValue} Amps at ${aVolts}V = ${res.powerWatts} Watts`} />
            </div>

            <FormulaCard formula={res.formula} assumptions={[]} defaultExpanded={true} />
          </div>
        );
      })()}

      {/* Converter 6: CCA to CA */}
      {activeConverter === 'cca-to-ca' && (() => {
        const res = convertCcaToCa(ccaValue);
        return (
          <div className="mt-6 space-y-6">
            <div className="max-w-md">
              <label className="block text-xs font-semibold text-slate-700">
                Cold Cranking Amps (CCA at 0°F / -18°C)
              </label>
              <input
                type="number"
                min="100"
                max="2500"
                value={ccaValue}
                onChange={(e) => setCcaValue(Number(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cranking Amps (CA / MCA at 32°F / 0°C)
                </span>
                <div className="text-3xl font-black text-blue-600">
                  {res.crankingAmpsCA} <span className="text-base font-normal text-slate-600">CA</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Marine Cranking Amps (MCA) = <strong>{res.marineCrankingAmpsMCA} MCA</strong>
                </div>
              </div>
              <CopyButton textToCopy={`${ccaValue} CCA = ${res.crankingAmpsCA} CA / MCA`} />
            </div>

            <FormulaCard formula={res.formula} assumptions={[]} defaultExpanded={true} />
          </div>
        );
      })()}
    </div>
  );
};
