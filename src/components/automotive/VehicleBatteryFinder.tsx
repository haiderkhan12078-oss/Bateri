import React, { useState, useMemo } from 'react';
import {
  VEHICLE_BATTERY_DATABASE,
  getUniqueMakes,
  getModelsByMake,
  getYearsByMakeAndModel,
  findVehicleBatterySpecs,
} from '../../data/vehicleDatabase';
import { VehicleBatterySpec } from '../../types';
import { CopyButton } from '../ui/CopyButton';
import { Car, Search, ShieldAlert, CheckCircle2, Sliders, BatteryCharging, ExternalLink } from 'lucide-react';

interface VehicleBatteryFinderProps {
  initialVehicleId?: string;
  onNavigate: (tab: any, subTab?: string, slug?: string) => void;
}

export const VehicleBatteryFinder: React.FC<VehicleBatteryFinderProps> = ({
  initialVehicleId,
  onNavigate,
}) => {
  const allMakes = useMemo(() => getUniqueMakes(), []);

  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pre-fill if vehicle specified
  const initialVehicle = useMemo(() => {
    if (initialVehicleId) {
      return VEHICLE_BATTERY_DATABASE.find((v) => v.id === initialVehicleId);
    }
    return null;
  }, [initialVehicleId]);

  const modelsForMake = useMemo(() => {
    return selectedMake ? getModelsByMake(selectedMake) : [];
  }, [selectedMake]);

  const yearsForModel = useMemo(() => {
    return selectedMake && selectedModel
      ? getYearsByMakeAndModel(selectedMake, selectedModel)
      : [];
  }, [selectedMake, selectedModel]);

  // Selected specific vehicle match
  const selectedVehicleMatch: VehicleBatterySpec | undefined = useMemo(() => {
    if (initialVehicle && !selectedMake) return initialVehicle;
    if (selectedMake && selectedModel) {
      const match = VEHICLE_BATTERY_DATABASE.find(
        (v) =>
          v.make === selectedMake &&
          v.model === selectedModel &&
          (!selectedYear || v.years.includes(selectedYear))
      );
      return match;
    }
    return undefined;
  }, [selectedMake, selectedModel, selectedYear, initialVehicle]);

  // Filtered vehicle catalog for quick search
  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return VEHICLE_BATTERY_DATABASE;
    const q = searchQuery.toLowerCase().trim();
    return VEHICLE_BATTERY_DATABASE.filter(
      (v) =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.groupSize.toLowerCase().includes(q) ||
        v.engine.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel('');
    setSelectedYear('');
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedYear('');
  };

  const handleSelectVehicleCard = (v: VehicleBatterySpec) => {
    setSelectedMake(v.make);
    setSelectedModel(v.model);
    setSelectedYear('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600" />
              OEM Vehicle Battery Group Size & Fitment Finder
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              Verified OEM battery replacement specifications: BCI Group Size, DIN code, minimum Cold Cranking Amps (CCA), physical tray dimensions, terminal polarity, and BMS registration mandates.
            </p>
          </div>
        </div>

        {/* Dropdown Filters Selector */}
        <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
            Select Your Vehicle Specifications:
          </span>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Make */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">1. Vehicle Make</label>
              <select
                value={selectedMake}
                onChange={(e) => handleMakeChange(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
              >
                <option value="">-- Select Make (e.g. Toyota, Ford, BMW) --</option>
                {allMakes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">2. Vehicle Model</label>
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                disabled={!selectedMake}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">-- Select Model --</option>
                {modelsForMake.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700">3. Generation / Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={!selectedModel}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">-- All Matching Model Years --</option>
                {yearsForModel.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Vehicle Fitment Spec Result Card */}
        {selectedVehicleMatch && (
          <div className="mt-8 rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50/80 via-white to-slate-50 p-6 shadow-md animate-in fade-in zoom-in-95">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-4">
              <div>
                <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Exact OEM Fitment Match
                </span>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {selectedVehicleMatch.make} {selectedVehicleMatch.model} ({selectedVehicleMatch.years})
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Trim / Engine: <strong>{selectedVehicleMatch.engine}</strong> · OEM Voltage: <strong>{selectedVehicleMatch.voltage}V</strong>
                </p>
              </div>

              <CopyButton
                textToCopy={`Battery Specs for ${selectedVehicleMatch.make} ${selectedVehicleMatch.model} (${selectedVehicleMatch.years}):
Group Size: ${selectedVehicleMatch.groupSize}
Min CCA: ${selectedVehicleMatch.minCCA}
Chemistry: ${selectedVehicleMatch.chemistry}
Dimensions: ${selectedVehicleMatch.dimensionsMm.length}x${selectedVehicleMatch.dimensionsMm.width}x${selectedVehicleMatch.dimensionsMm.height} mm
Terminal: ${selectedVehicleMatch.terminalType}`}
              />
            </div>

            {/* Spec Highlights 4-Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-white p-4 border border-blue-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  BCI Group Size
                </span>
                <div className="mt-1 text-2xl font-black text-blue-600">
                  {selectedVehicleMatch.groupSize}
                </div>
                <span className="text-[11px] text-slate-500">Standard tray size</span>
              </div>

              <div className="rounded-xl bg-white p-4 border border-blue-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Minimum CCA Rating
                </span>
                <div className="mt-1 text-2xl font-black text-slate-900">
                  {selectedVehicleMatch.minCCA} <span className="text-xs font-normal text-slate-500">CCA</span>
                </div>
                <span className="text-[11px] text-slate-500">Rec. Capacity: {selectedVehicleMatch.recommendedAh} Ah</span>
              </div>

              <div className="rounded-xl bg-white p-4 border border-blue-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Required Chemistry
                </span>
                <div className="mt-1 text-xl font-black text-slate-900">
                  {selectedVehicleMatch.chemistry}
                </div>
                <span className="text-[11px] text-slate-500">
                  {selectedVehicleMatch.startStopRequired ? '⚠ Start-Stop Required' : 'Standard Charging'}
                </span>
              </div>

              <div className="rounded-xl bg-white p-4 border border-blue-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Terminal Layout
                </span>
                <div className="mt-1 text-sm font-bold text-slate-800">
                  {selectedVehicleMatch.terminalType}
                </div>
                <span className="text-[11px] text-slate-500">
                  Loc: {selectedVehicleMatch.locationNotes}
                </span>
              </div>
            </div>

            {/* Dimensional Specifications */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-2">
                Physical Battery Tray Dimensions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-500 block">Metric (mm):</span>
                  <strong className="text-slate-900 font-mono text-sm">
                    {selectedVehicleMatch.dimensionsMm.length} mm (L) × {selectedVehicleMatch.dimensionsMm.width} mm (W) × {selectedVehicleMatch.dimensionsMm.height} mm (H)
                  </strong>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-500 block">Imperial (Inches):</span>
                  <strong className="text-slate-900 font-mono text-sm">
                    {selectedVehicleMatch.dimensionsInches.length}&Prime; (L) × {selectedVehicleMatch.dimensionsInches.width}&Prime; (W) × {selectedVehicleMatch.dimensionsInches.height}&Prime; (H)
                  </strong>
                </div>
              </div>
            </div>

            {/* OEM Caution & BMS Note */}
            {selectedVehicleMatch.notes && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  OEM Service & Installation Guidance
                </div>
                <p className="mt-1 text-xs text-amber-900 leading-relaxed">
                  {selectedVehicleMatch.notes}
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onNavigate('battery-tools', 'runtime-calculator')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
              >
                <BatteryCharging className="h-3.5 w-3.5 text-blue-600" />
                Calculate Battery Runtime
              </button>
              <button
                type="button"
                onClick={() => onNavigate('car-problems', undefined, 'car-wont-start')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
              >
                <span>Troubleshoot No-Start</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Vehicle Database Quick Directory */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Browse All Verified Vehicle Fitments ({filteredVehicles.length} Models)
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter models (e.g. Corolla, F-150)..."
                className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((v) => (
              <div
                key={v.id}
                onClick={() => handleSelectVehicleCard(v)}
                className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {v.make} {v.model}
                    </span>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200 font-mono">
                      {v.groupSize}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Years: {v.years} · {v.engine}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                    <span>Min CCA: <strong>{v.minCCA}</strong></span>
                    <span>Type: <strong>{v.chemistry}</strong></span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-semibold text-blue-600">
                  <span>View Full Dimensions & Fitment</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
