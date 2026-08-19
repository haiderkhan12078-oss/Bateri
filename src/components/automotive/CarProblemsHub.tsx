import React, { useState } from 'react';
import { COMMON_CAR_PROBLEMS } from '../../data/carProblemsData';
import { CarProblem } from '../../types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Wrench, AlertTriangle, CheckCircle2, ChevronRight, ArrowLeft, ShieldAlert, Cpu, Calculator } from 'lucide-react';

interface CarProblemsHubProps {
  initialSlug?: string;
  onNavigate: (tab: any, subTab?: string, slug?: string) => void;
}

export const CarProblemsHub: React.FC<CarProblemsHubProps> = ({ initialSlug, onNavigate }) => {
  const [selectedProblemSlug, setSelectedProblemSlug] = useState<string | null>(initialSlug || null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const selectedProblem = COMMON_CAR_PROBLEMS.find((p) => p.slug === selectedProblemSlug);

  const filteredProblems = filterSeverity === 'all'
    ? COMMON_CAR_PROBLEMS
    : COMMON_CAR_PROBLEMS.filter((p) => p.severity === filterSeverity);

  const getSeverityBadge = (sev: CarProblem['severity']) => {
    switch (sev) {
      case 'critical':
        return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700">Critical / No-Start</span>;
      case 'moderate':
        return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">Moderate / Drain</span>;
      default:
        return <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">Informational</span>;
    }
  };

  if (selectedProblem) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Car Problems & Diagnostics', tab: 'car-problems' },
            { label: selectedProblem.title },
          ]}
          onNavigate={onNavigate}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setSelectedProblemSlug(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Diagnostic Trees
          </button>

          {/* Problem Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedProblem.icon}</span>
                <h1 className="text-2xl font-bold text-slate-900">{selectedProblem.title}</h1>
              </div>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                {selectedProblem.shortDescription}
              </p>
            </div>
            <div className="self-start sm:self-auto">
              {getSeverityBadge(selectedProblem.severity)}
            </div>
          </div>

          {/* Symptoms List */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Observable Symptoms:
            </h3>
            <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-slate-700">
              {selectedProblem.symptoms.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diagnostic Decision Tree */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                Interactive Diagnostic Decision Steps
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Step {activeStepIndex + 1} of {selectedProblem.diagnosticTree.length}
              </span>
            </div>

            {/* Step Navigation Pills */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-2">
              {selectedProblem.diagnosticTree.map((step, idx) => (
                <button
                  key={step.stepId}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all ${
                    activeStepIndex === idx
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>Step {idx + 1}:</span>
                  <span className="truncate max-w-[120px]">{step.question}</span>
                </button>
              ))}
            </div>

            {/* Active Step Card */}
            {(() => {
              const curStep = selectedProblem.diagnosticTree[activeStepIndex];
              return (
                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/40 p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    Step {activeStepIndex + 1}: {curStep.question}
                  </h3>
                  <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                    <strong>Testing Method:</strong> {curStep.action}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* YES Condition */}
                    <div className="rounded-lg bg-white p-4 border border-slate-200 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        If YES:
                      </div>
                      <p className="mt-2 text-xs text-slate-800 font-medium">
                        {curStep.ifYes.conclusion}
                      </p>
                      <div className="mt-2 text-[11px] text-slate-500">
                        {curStep.ifYes.nextStepId ? (
                          <button
                            type="button"
                            onClick={() => {
                              const nextIdx = selectedProblem.diagnosticTree.findIndex(
                                (s) => s.stepId === curStep.ifYes.nextStepId
                              );
                              if (nextIdx !== -1) setActiveStepIndex(nextIdx);
                            }}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            → Continue to Step {curStep.ifYes.nextStepId}
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold">✓ Root cause diagnosed</span>
                        )}
                      </div>
                    </div>

                    {/* NO Condition */}
                    <div className="rounded-lg bg-white p-4 border border-slate-200 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wide">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        If NO:
                      </div>
                      <p className="mt-2 text-xs text-slate-800 font-medium">
                        {curStep.ifNo.conclusion}
                      </p>
                      <div className="mt-2 text-[11px] text-slate-500">
                        {curStep.ifNo.nextStepId ? (
                          <button
                            type="button"
                            onClick={() => {
                              const nextIdx = selectedProblem.diagnosticTree.findIndex(
                                (s) => s.stepId === curStep.ifNo.nextStepId
                              );
                              if (nextIdx !== -1) setActiveStepIndex(nextIdx);
                            }}
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            → Continue to Step {curStep.ifNo.nextStepId}
                          </button>
                        ) : (
                          <span className="text-amber-700 font-bold">✓ Alternative route</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Likely Root Causes Table */}
          <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ranked Root Causes & Practical Fixes
            </h3>
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Probable Cause</th>
                    <th className="px-4 py-3">Likelihood</th>
                    <th className="px-4 py-3">Verification Method</th>
                    <th className="px-4 py-3">Repair / Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedProblem.likelyCauses.map((cause, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">{cause.cause}</td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">{cause.probability}%</td>
                      <td className="px-4 py-3 text-slate-600">{cause.verification}</td>
                      <td className="px-4 py-3 text-slate-900 font-medium">{cause.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Safety Warnings & Prevention */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              Safety Protocols & Prevention Tips
            </div>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-amber-900">
              {selectedProblem.preventativeTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Related Tools */}
          {selectedProblem.relatedTools && selectedProblem.relatedTools.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Related Diagnostic & Sizing Tools:
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedProblem.relatedTools.map((tool, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onNavigate(tool.tab as any, tool.subTab)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs"
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    <span>{tool.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Diagnostic Directory List View
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="h-6 w-6 text-blue-600" />
              Automotive Battery & Electrical Diagnostic Hub
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              Systematic, deterministic troubleshooting trees for automotive electrical problems, starting failures, alternator faults, and parasitic battery drains.
            </p>
          </div>

          {/* Severity filter */}
          <div className="flex gap-1.5 self-start sm:self-auto">
            {['all', 'critical', 'moderate'].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setFilterSeverity(sev)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-all ${
                  filterSeverity === sev
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Problems Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredProblems.map((prob) => (
            <div
              key={prob.id}
              onClick={() => setSelectedProblemSlug(prob.slug)}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{prob.icon}</span>
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {prob.title}
                    </h2>
                  </div>
                  {getSeverityBadge(prob.severity)}
                </div>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {prob.shortDescription}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {prob.symptoms.slice(0, 2).map((sym, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 border border-slate-200 truncate max-w-[200px]"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <span>Start Step-by-Step Diagnostic</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
