import React, { useState } from 'react';
import { VEHICLE_BATTERY_DATABASE } from '../../data/vehicleDatabase';
import { COMMON_CAR_PROBLEMS } from '../../data/carProblemsData';
import { GUIDES_DATABASE } from '../../data/guidesData';
import { VehicleBatterySpec, CarProblem, GuideArticle } from '../../types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import {
  ShieldAlert,
  BarChart3,
  Car,
  Wrench,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Activity,
  Globe,
  Database,
} from 'lucide-react';

export const AdminPortal: React.FC<{ onNavigate: (tab: any, subTab?: string, slug?: string) => void }> = ({
  onNavigate,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'vehicles' | 'problems' | 'guides'>('analytics');

  const [vehicleList, setVehicleList] = useState<VehicleBatterySpec[]>(VEHICLE_BATTERY_DATABASE);
  const [problemList, setProblemList] = useState<CarProblem[]>(COMMON_CAR_PROBLEMS);
  const [guideList, setGuideList] = useState<GuideArticle[]>(GUIDES_DATABASE);

  // New vehicle form state
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newYears, setNewYears] = useState('');
  const [newGroupSize, setNewGroupSize] = useState('Group 35');
  const [newCCA, setNewCCA] = useState<number>(650);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMake.trim() || !newModel.trim()) return;

    const newEntry: VehicleBatterySpec = {
      id: `${newMake.toLowerCase()}-${newModel.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      make: newMake.trim(),
      model: newModel.trim(),
      years: newYears.trim() || '2020-2024',
      engine: '2.0L 4-Cylinder Standard',
      groupSize: newGroupSize,
      voltage: 12,
      minCCA: newCCA,
      recommendedAh: 60,
      chemistry: 'Flooded Lead-Acid',
      terminalType: 'Top Post (Positive Right)',
      dimensionsMm: { length: 230, width: 175, height: 225 },
      dimensionsInches: { length: 9.06, width: 6.89, height: 8.86 },
      startStopRequired: false,
      locationNotes: 'Engine Bay, Front Left',
      verified: true,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setVehicleList([newEntry, ...vehicleList]);
    setNewMake('');
    setNewModel('');
    setNewYears('');
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicleList(vehicleList.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: 'Admin CMS & Analytics Portal' }]}
        onNavigate={onNavigate}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Bateri.com Platform Admin CMS</h1>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                  Global CMS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage vehicle fitment database, diagnostic trees, technical guides, and usage analytics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <Activity className="h-3.5 w-3.5" />
            <span>Deterministic Engine Online</span>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
          {[
            { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
            { id: 'vehicles', label: `Vehicle Database (${vehicleList.length})`, icon: Car },
            { id: 'problems', label: `Diagnostic Trees (${problemList.length})`, icon: Wrench },
            { id: 'guides', label: `Technical Guides (${guideList.length})`, icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Platform Analytics */}
        {activeAdminTab === 'analytics' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Total Calculations
                </span>
                <div className="mt-1 text-2xl font-black text-blue-600">42,850+</div>
                <span className="text-[10px] text-emerald-600 font-semibold">↑ 18% this week</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Vehicle Lookups
                </span>
                <div className="mt-1 text-2xl font-black text-slate-900">19,230+</div>
                <span className="text-[10px] text-slate-500 font-mono">100% verified specs</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Diagnostic Solves
                </span>
                <div className="mt-1 text-2xl font-black text-emerald-600">8,410+</div>
                <span className="text-[10px] text-slate-500 font-mono">Top: Car Won’t Start</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  AI Sessions Served
                </span>
                <div className="mt-1 text-2xl font-black text-slate-900">3,180+</div>
                <span className="text-[10px] text-slate-500 font-mono">Gemini 2.5 Flash</span>
              </div>
            </div>

            {/* Popular Tool Engagement */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Top Calculation & Conversion Modules by Engagement
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Battery Runtime Calculator', runs: '14,200', pct: 33 },
                  { name: 'Ah to Wh / Wh to Ah Converters', runs: '11,450', pct: 27 },
                  { name: 'Vehicle Battery Group Finder', runs: '8,900', pct: 21 },
                  { name: 'Solar Battery Bank Sizer', runs: '4,800', pct: 11 },
                  { name: 'EV Range & Charging Sizer', runs: '3,500', pct: 8 },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span>{item.name}</span>
                      <span className="font-mono">{item.runs} runs ({item.pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vehicle Database Management */}
        {activeAdminTab === 'vehicles' && (
          <div className="mt-6 space-y-6">
            {/* Add New Vehicle Form */}
            <form onSubmit={handleAddVehicle} className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-3">
                Add New Vehicle Battery Specification to Catalog
              </span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 text-xs">
                <div>
                  <input
                    type="text"
                    value={newMake}
                    onChange={(e) => setNewMake(e.target.value)}
                    placeholder="Make (e.g. Subaru)"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="Model (e.g. Outback)"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newYears}
                    onChange={(e) => setNewYears(e.target.value)}
                    placeholder="Years (e.g. 2018-2024)"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newGroupSize}
                    onChange={(e) => setNewGroupSize(e.target.value)}
                    placeholder="Group Size"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newCCA}
                    onChange={(e) => setNewCCA(Number(e.target.value))}
                    placeholder="Min CCA"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Save
                  </button>
                </div>
              </div>
            </form>

            {/* Vehicle Database Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Years</th>
                    <th className="px-4 py-3">Group Size</th>
                    <th className="px-4 py-3">Min CCA</th>
                    <th className="px-4 py-3">Chemistry</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicleList.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-2.5 font-bold text-slate-900">
                        {v.make} {v.model}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-600">{v.years}</td>
                      <td className="px-4 py-2.5 font-bold font-mono text-blue-600">{v.groupSize}</td>
                      <td className="px-4 py-2.5 font-mono">{v.minCCA} CCA</td>
                      <td className="px-4 py-2.5 text-slate-600">{v.chemistry}</td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteVehicle(v.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Diagnostic Problems Management */}
        {activeAdminTab === 'problems' && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Active Diagnostic Decision Trees
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {problemList.map((prob) => (
                <div
                  key={prob.id}
                  className="rounded-xl border border-slate-200 p-4 flex items-center justify-between bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{prob.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{prob.title}</h4>
                      <p className="text-xs text-slate-500">
                        {prob.diagnosticTree.length} Decision Steps · {prob.likelyCauses.length} Root Causes Indexed
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Guides CMS */}
        {activeAdminTab === 'guides' && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Published Technical Guides & SEO Content
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {guideList.map((g) => (
                <div
                  key={g.id}
                  className="rounded-xl border border-slate-200 p-4 flex items-center justify-between bg-slate-50/50"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {g.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{g.title}</h4>
                    <p className="text-xs text-slate-500">
                      Slug: /{g.slug} · {g.readTimeMinutes} min read · Last updated: {g.lastUpdated}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                    Published
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
