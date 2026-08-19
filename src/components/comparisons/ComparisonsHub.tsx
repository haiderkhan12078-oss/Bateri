import React, { useState } from 'react';
import { COMPARISONS_DATABASE } from '../../data/comparisonsData';
import { ComparisonItem } from '../../types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { Scale, ArrowLeft, Check, Award, CheckCircle2, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface ComparisonsHubProps {
  initialSlug?: string;
  onNavigate: (tab: any, subTab?: string, slug?: string) => void;
}

export const ComparisonsHub: React.FC<ComparisonsHubProps> = ({ initialSlug, onNavigate }) => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const selectedComparison = COMPARISONS_DATABASE.find((c) => c.slug === selectedSlug);

  if (selectedComparison) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Battery Comparisons', tab: 'comparisons' },
            { label: selectedComparison.title },
          ]}
          onNavigate={onNavigate}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setSelectedSlug(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Comparisons
          </button>

          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {selectedComparison.title}
            </h1>
            <p className="mt-1 text-sm font-semibold text-blue-600">
              {selectedComparison.subtitle}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {selectedComparison.summary}
            </p>
          </div>

          {/* Key Takeaways Box */}
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50/60 p-5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              Key Engineering Takeaways:
            </span>
            <ul className="mt-3 space-y-2 text-xs text-blue-950">
              {selectedComparison.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Attribute Comparison Table */}
          <div className="mt-8">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              Direct Side-by-Side Specifications
            </h2>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5 w-1/4">Specification</th>
                    <th className="px-4 py-3.5 w-1/3 bg-blue-50/70 text-blue-900">
                      {selectedComparison.optionAName}
                    </th>
                    <th className="px-4 py-3.5 w-1/3 text-slate-900">
                      {selectedComparison.optionBName}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedComparison.attributes.map((attr, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-semibold text-slate-900 align-top">
                        <div>{attr.name}</div>
                        {attr.description && (
                          <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                            {attr.description}
                          </span>
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 font-mono font-medium align-top ${
                          attr.winner === 'A' ? 'bg-blue-50/40 text-blue-900 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {attr.winner === 'A' && (
                            <span className="rounded-full bg-blue-600 text-white p-0.5">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                          <span>{attr.optionAValue}</span>
                        </div>
                        {attr.explanation && attr.winner === 'A' && (
                          <p className="text-[11px] text-blue-700 mt-1 font-sans font-normal">
                            {attr.explanation}
                          </p>
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 font-mono font-medium align-top ${
                          attr.winner === 'B' ? 'bg-emerald-50/40 text-emerald-900 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {attr.winner === 'B' && (
                            <span className="rounded-full bg-emerald-600 text-white p-0.5">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                          <span>{attr.optionBValue}</span>
                        </div>
                        {attr.explanation && attr.winner === 'B' && (
                          <p className="text-[11px] text-emerald-700 mt-1 font-sans font-normal">
                            {attr.explanation}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Best-For Scenario Boxes */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
                Best Scenarios for {selectedComparison.optionAName}:
              </h3>
              <ul className="space-y-1.5 text-xs text-blue-950">
                {selectedComparison.bestForOptionA.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Best Scenarios for {selectedComparison.optionBName}:
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedComparison.bestForOptionB.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Expert Recommendation */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
              Bateri.com Engineering Verdict:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {selectedComparison.recommendation}
            </p>
          </div>

          {/* FAQs */}
          {selectedComparison.faqs && selectedComparison.faqs.length > 0 && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Frequently Asked Comparison Questions
              </h3>
              <div className="space-y-2">
                {selectedComparison.faqs.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200 bg-slate-50/70 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between p-3 text-left text-xs font-semibold text-slate-900 focus:outline-none"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 text-xs text-slate-600 border-t border-slate-200 pt-2 bg-white">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Directory view
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-600" />
            Battery Technology & Architecture Comparisons
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            Unbiased, engineering-grade comparisons analyzing cost per cycle, depth of discharge, charge speed, safety, and cold weather tolerance.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPARISONS_DATABASE.map((comp) => (
            <div
              key={comp.id}
              onClick={() => setSelectedSlug(comp.slug)}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Head-to-Head Comparison
                </span>
                <h2 className="mt-1 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {comp.title}
                </h2>
                <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {comp.summary}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-blue-600">
                <span>View Full Comparison</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
