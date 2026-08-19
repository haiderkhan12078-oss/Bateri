import React, { useState } from 'react';
import { calculateBackupSystem } from '../../lib/calculations/batteryCalculators';
import { ApplianceItem } from '../../types';
import { FormulaCard } from '../ui/FormulaCard';
import { CopyButton } from '../ui/CopyButton';
import { Plus, Trash2, Home, Zap, Shield, RotateCcw } from 'lucide-react';

const DEFAULT_APPLIANCES: ApplianceItem[] = [
  { id: '1', name: 'LED Lights (4 rooms)', watts: 40, quantity: 1, hoursPerDay: 5, category: 'lighting' },
  { id: '2', name: 'Wi-Fi Router & Modem', watts: 20, quantity: 1, hoursPerDay: 24, category: 'electronics' },
  { id: '3', name: 'Refrigerator (Energy Star)', watts: 150, quantity: 1, hoursPerDay: 8, category: 'appliances' },
  { id: '4', name: 'Laptop Charging', watts: 65, quantity: 2, hoursPerDay: 4, category: 'electronics' },
  { id: '5', name: 'Ceiling Fan', watts: 60, quantity: 2, hoursPerDay: 6, category: 'heating-cooling' },
];

export const BatteryBackupCalculator: React.FC = () => {
  const [appliances, setAppliances] = useState<ApplianceItem[]>(DEFAULT_APPLIANCES);
  const [newName, setNewName] = useState('');
  const [newWatts, setNewWatts] = useState<number>(100);
  const [newQty, setNewQty] = useState<number>(1);
  const [newHours, setNewHours] = useState<number>(4);

  const result = calculateBackupSystem(appliances);

  const handleAddAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newItem: ApplianceItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      watts: Math.max(1, newWatts),
      quantity: Math.max(1, newQty),
      hoursPerDay: Math.min(24, Math.max(0.1, newHours)),
    };
    setAppliances([...appliances, newItem]);
    setNewName('');
    setNewWatts(100);
    setNewQty(1);
    setNewHours(4);
  };

  const handleRemove = (id: string) => {
    setAppliances(appliances.filter((a) => a.id !== id));
  };

  const handleReset = () => {
    setAppliances(DEFAULT_APPLIANCES);
  };

  const copySummaryText = `Home / Backup System Audit:
Total Daily Consumption: ${result.totalDailyWattHours} Wh/day (${Math.round(result.totalDailyWattHours / 100) / 10} kWh)
Peak Continuous Load: ${result.peakContinuousWatts} Watts
Recommended Inverter Size: ${result.recommendedInverterContinuousWatts}W Pure Sine Wave (${result.recommendedInverterSurgeWatts}W Surge)
Recommended 24V LiFePO4 Bank: ${result.lithiumBankAh} Ah
Recommended 24V Lead-Acid Bank: ${result.leadAcidBankAh} Ah
Calculated by Bateri.com`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            Home & Off-Grid Battery Backup Sizing Calculator
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Build your custom appliance load list to compute daily energy needs, inverter size, and multi-voltage battery bank capacity.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Appliance Load Table */}
      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Current Appliance Load List ({appliances.length} Items)
        </h3>

        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Appliance Name</th>
                <th className="px-4 py-3">Watts</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Hours / Day</th>
                <th className="px-4 py-3">Daily Wh</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appliances.map((item) => {
                const dailyWh = item.watts * item.quantity * item.hoursPerDay;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-2.5 font-mono">{item.watts}W</td>
                    <td className="px-4 py-2.5 font-mono">{item.quantity}</td>
                    <td className="px-4 py-2.5 font-mono">{item.hoursPerDay}h</td>
                    <td className="px-4 py-2.5 font-bold font-mono text-blue-600">{dailyWh} Wh</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Appliance Form */}
      <form onSubmit={handleAddAppliance} className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <span className="text-xs font-semibold text-slate-800">Add Appliance to Load List:</span>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-5">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Microwave, CPAP, TV"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <input
              type="number"
              min="1"
              max="10000"
              value={newWatts}
              onChange={(e) => setNewWatts(Number(e.target.value))}
              placeholder="Watts"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="number"
              min="1"
              max="50"
              value={newQty}
              onChange={(e) => setNewQty(Number(e.target.value))}
              placeholder="Quantity"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="0.1"
              max="24"
              step="0.5"
              value={newHours}
              onChange={(e) => setNewHours(Number(e.target.value))}
              placeholder="Hrs/Day"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </div>
      </form>

      {/* System Sizing Output */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 to-slate-50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-900">Backup System Sizing Recommendations</span>
          </div>
          <CopyButton textToCopy={copySummaryText} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Daily Energy Total
            </span>
            <div className="mt-1 text-2xl font-black text-blue-600">
              {result.totalDailyWattHours} <span className="text-xs font-normal text-slate-500">Wh</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              ({Math.round((result.totalDailyWattHours / 1000) * 100) / 100} kWh/day)
            </span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Rec. Inverter Rating
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.recommendedInverterContinuousWatts} <span className="text-xs font-normal text-slate-500">W</span>
            </div>
            <span className="text-[11px] text-slate-500">Surge: {result.recommendedInverterSurgeWatts}W</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              LiFePO4 Bank (24V)
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-600">
              {result.lithiumBankAh} <span className="text-xs font-normal text-slate-500">Ah</span>
            </div>
            <span className="text-[11px] text-slate-500">90% usable DoD</span>
          </div>

          <div className="rounded-lg bg-white p-3.5 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Lead-Acid Bank (24V)
            </span>
            <div className="mt-1 text-2xl font-black text-slate-900">
              {result.leadAcidBankAh} <span className="text-xs font-normal text-slate-500">Ah</span>
            </div>
            <span className="text-[11px] text-slate-500">50% usable DoD</span>
          </div>
        </div>

        {/* Multi-Voltage Bank Table */}
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-3.5">
          <span className="text-xs font-bold text-slate-800">
            Battery Bank Capacity by Bus Voltage (LiFePO4 90% DoD):
          </span>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-md bg-slate-50 p-2 border border-slate-100">
              <span className="text-slate-500 block text-[11px]">12V DC System</span>
              <strong className="text-slate-900 font-mono text-sm">{result.batteryCapacityAh12V} Ah</strong>
            </div>
            <div className="rounded-md bg-blue-50 p-2 border border-blue-100">
              <span className="text-blue-600 block text-[11px] font-semibold">24V DC (Recommended)</span>
              <strong className="text-blue-950 font-mono text-sm">{result.batteryCapacityAh24V} Ah</strong>
            </div>
            <div className="rounded-md bg-slate-50 p-2 border border-slate-100">
              <span className="text-slate-500 block text-[11px]">48V DC High-Power</span>
              <strong className="text-slate-900 font-mono text-sm">{result.batteryCapacityAh48V} Ah</strong>
            </div>
          </div>
        </div>
      </div>

      <FormulaCard formula="Total Daily Wh = Sum(Watts × Quantity × Hours) ÷ Inverter Efficiency" assumptions={result.assumptions} defaultExpanded={false} />
    </div>
  );
};
