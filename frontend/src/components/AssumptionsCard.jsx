import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function AssumptionsCard() {
  const [isOpen, setIsOpen] = useState(false);

  const assumptions = [
    {
      title: 'Customer Value Proxy',
      desc: 'TotalCharges is used as a prototype proxy for customer value. It is NOT actual net profit or true lifetime margin (CLV).',
    },
    {
      title: 'Standard Retention Offer',
      desc: 'Default retention offer cost is modeled at ₹200 per targeted customer.',
    },
    {
      title: 'Expected Value Saved',
      desc: 'Calculated dynamically as: Churn Probability × Customer Value (TotalCharges).',
    },
    {
      title: 'ROI Formulation',
      desc: 'Formulated as ((Expected Value Saved - Offer Cost) / Offer Cost) × 100.',
    },
    {
      title: 'Risk Thresholds',
      desc: 'Low (< 30%), Medium (30% - 60%), High (60% - 80%), Critical (≥ 80%).',
    },
    {
      title: 'Probabilistic Nature',
      desc: 'All model predictions are statistical likelihoods derived from Telco historical patterns, not guaranteed individual outcomes.',
    },
    {
      title: 'Prescribed Interventions',
      desc: 'Actions (Monitor, Personalized Engagement, Offer, Immediate Intervention) are business heuristics for the prototype.',
    },
    {
      title: 'Holistic Evaluation',
      desc: 'Accuracy alone is insufficient; churn prioritization relies on Precision, Recall, and Expected Net ROI.',
    },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-surface-1 overflow-hidden shadow-lg transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand-400 border border-brand/30">
            <Info className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <span className="text-sm font-heading font-bold text-white block">
              Business Logic & ML Prototype Assumptions
            </span>
            <span className="text-xs text-slate-400 font-sans">
              Transparency, financial formulation, and model boundaries
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex rounded-md bg-brand/15 px-2 py-0.5 text-[11px] font-semibold text-brand-300 border border-brand/30">
            Full Transparency
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-white/10 p-5 bg-surface-2/60 text-xs text-slate-300 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {assumptions.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/5 bg-surface-1 p-3.5 shadow-sm space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand/20 text-brand-300 font-mono text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-heading font-bold text-white text-xs">
                    {item.title}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed pl-7">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[11px] text-slate-400 italic font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-400 shrink-0" />
            <span>Telco Customer Churn reference dataset (7,043 customer accounts). Logistic Regression pipeline with StandardScaler.</span>
          </div>
        </div>
      )}
    </div>
  );
}
