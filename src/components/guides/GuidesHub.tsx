import React, { useState } from 'react';
import { GUIDES_DATABASE } from '../../data/guidesData';
import { GuideArticle } from '../../types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { BookOpen, Clock, Calendar, ArrowLeft, ChevronDown, ChevronUp, Calculator, Share2, CheckCircle2 } from 'lucide-react';

interface GuidesHubProps {
  initialSlug?: string;
  onNavigate: (tab: any, subTab?: string, slug?: string) => void;
}

export const GuidesHub: React.FC<GuidesHubProps> = ({ initialSlug, onNavigate }) => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const selectedGuide = GUIDES_DATABASE.find((g) => g.slug === selectedSlug);

  const categories = ['all', 'Car Battery', 'Battery Basics', 'Solar', 'Automotive Electrical'];

  const filteredGuides = selectedCategory === 'all'
    ? GUIDES_DATABASE
    : GUIDES_DATABASE.filter((g) => g.category === selectedCategory);

  if (selectedGuide) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Technical Guides & Knowledge', tab: 'guides' },
            { label: selectedGuide.title },
          ]}
          onNavigate={onNavigate}
        />

        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => setSelectedSlug(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Guides
          </button>

          {/* Guide Header */}
          <header className="border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-700">
                {selectedGuide.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {selectedGuide.readTimeMinutes} min read
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                Updated {selectedGuide.lastUpdated}
              </span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {selectedGuide.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {selectedGuide.summary}
            </p>
          </header>

          {/* Guide Content Sections */}
          <div className="mt-8 space-y-8 text-sm text-slate-800 leading-relaxed">
            {selectedGuide.sections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 border-l-3 border-blue-600 pl-3">
                  {section.title}
                </h2>

                <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                  {section.content}
                </div>

                {/* Callout Box */}
                {section.callout && (
                  <div
                    className={`rounded-xl border p-4 my-4 ${
                      section.callout.type === 'danger'
                        ? 'border-red-200 bg-red-50 text-red-900'
                        : section.callout.type === 'warning'
                        ? 'border-amber-200 bg-amber-50 text-amber-900'
                        : 'border-blue-200 bg-blue-50 text-blue-900'
                    }`}
                  >
                    <span className="font-bold block text-xs uppercase tracking-wider mb-1">
                      {section.callout.title}
                    </span>
                    <p className="text-xs leading-relaxed">{section.callout.text}</p>
                  </div>
                )}

                {/* Data Table */}
                {section.table && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 my-4 shadow-2xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                        <tr>
                          {section.table.headers.map((h, i) => (
                            <th key={i} className="px-4 py-3">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/70">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-4 py-2.5 ${
                                  cIdx === 0 ? 'font-bold text-slate-900 font-mono' : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* FAQs Accordion */}
          {selectedGuide.faqs && selectedGuide.faqs.length > 0 && (
            <div className="mt-10 border-t border-slate-100 pt-8">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {selectedGuide.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between p-4 text-left text-xs font-semibold text-slate-900 hover:text-blue-600 focus:outline-none"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Tools */}
          {selectedGuide.relatedToolLinks && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                Recommended Interactive Tools for this Topic:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedGuide.relatedToolLinks.map((tool, idx) => (
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
        </article>
      </div>
    );
  }

  // Directory View
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Verified Battery & Energy Engineering Guides
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              In-depth technical tutorials, multimeter diagnostic walkthroughs, chemistry comparisons, and safety guidelines written for automotive enthusiasts, solar DIYers, and engineers.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setSelectedSlug(guide.slug)}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100">
                    {guide.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {guide.readTimeMinutes} min read
                  </span>
                </div>
                <h2 className="mt-3 text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {guide.title}
                </h2>
                <p className="mt-2 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {guide.summary}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-blue-600">
                <span>Read Full Article</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
