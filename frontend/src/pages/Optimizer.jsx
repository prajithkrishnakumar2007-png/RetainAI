import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  ExternalLink,
  Sparkles,
  RotateCcw
} from 'lucide-react';

import Header from '../components/Header';
import RiskBadge from '../components/RiskBadge';
import ROIBadge from '../components/ROIBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import { optimizeBudget } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

const BUDGET_PRESETS = [
  { label: 'Baseline', budget: 2000, cost: 200 },
  { label: 'Targeted Growth', budget: 5000, cost: 250 },
  { label: 'High Priority', budget: 10000, cost: 300 },
];

export default function Optimizer() {
  const [budget, setBudget] = useState(2000);
  const [offerCost, setOfferCost] = useState(200);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runOptimization = async (customBudget = budget, customCost = offerCost) => {
    try {
      setLoading(true);
      setError(null);
      const res = await optimizeBudget({
        budget: Number(customBudget),
        offer_cost: Number(customCost),
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Optimization solver failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimization(2000, 200);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    runOptimization(budget, offerCost);
  };

  const handleApplyPreset = (preset) => {
    setBudget(preset.budget);
    setOfferCost(preset.cost);
    runOptimization(preset.budget, preset.cost);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-darkbg">
      <Header
        title="Retention Campaign Optimizer"
        subtitle="Constrained knapsack budget allocation maximizing Expected Net Value & Portfolio ROI"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Core Product Strategy Callout */}
        <div className="rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/15 via-surface-2 to-surface-1 p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="rounded-xl bg-brand/20 p-2.5 text-brand-400 shrink-0 border border-brand/30 shadow-inner">
              <Target className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-heading font-extrabold text-white tracking-tight">
                Why Not Simply Target Customers with the Highest Churn Probability?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-4xl">
                Conventional churn tools naively target the highest risk probability (e.g. 95%), even if that account pays only ₹20/month with zero lifetime value.
                <strong> RetainAI solves the constrained allocation knapsack problem to prioritize accounts by Expected Business Value Saved (Probability × Customer Value) and Net Return on Investment (ROI)</strong>.
                This prevents wasting budget on low-value churners and protects high-value accounts that generate substantial enterprise profit.
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Input Workspace Controls */}
        <div className="rounded-2xl border border-white/10 bg-surface-1 p-6 lg:p-7 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Campaign Parameters & Budget Constraints
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Adjust allocated funds and per-customer incentive cost
              </p>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Presets:</span>
              {BUDGET_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    budget === p.budget && offerCost === p.cost
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-surface-2 border border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                Total Campaign Budget (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold font-mono">₹</span>
                <input
                  type="number"
                  min="200"
                  max="100000"
                  step="100"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-surface-2 pl-9 pr-4 py-2.5 text-sm font-bold text-white focus:border-brand focus:outline-none transition-all font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 font-sans">Benchmark allocation: ₹2,000</p>
            </div>

            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                Offer Cost per Customer (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold font-mono">₹</span>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="50"
                  value={offerCost}
                  onChange={(e) => setOfferCost(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-surface-2 pl-9 pr-4 py-2.5 text-sm font-bold text-white focus:border-brand focus:outline-none transition-all font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 font-sans">Benchmark incentive: ₹200</p>
            </div>

            <div className="md:col-span-4 flex items-center gap-2.5">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-brand py-2.5 px-4 text-xs sm:text-sm font-bold text-white hover:bg-brand-600 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{loading ? 'Solving...' : 'Calculate Optimal Allocation'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBudget(2000);
                  setOfferCost(200);
                  runOptimization(2000, 200);
                }}
                className="rounded-xl border border-white/10 bg-surface-2 p-2.5 text-slate-400 hover:text-white hover:bg-white/5 transition-all shadow-sm"
                title="Reset to defaults"
                aria-label="Reset to default benchmark"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {error && <ErrorMessage message={error} onRetry={() => runOptimization(budget, offerCost)} />}

        {loading ? (
          <div className="space-y-6">
            <SkeletonLoader count={5} />
            <SkeletonLoader type="table" rows={6} />
          </div>
        ) : result && (
          <div className="space-y-8">
            {/* Executive Metric Cards of Optimal Allocation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="rounded-xl border border-white/10 bg-surface-1 p-5 shadow-lg space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                  Allocated Offers
                </span>
                <p className="text-2xl font-heading font-extrabold text-white tabular-nums">
                  {result.selected_count} <span className="text-xs text-slate-400 font-sans font-normal">/ {result.max_customers} max</span>
                </p>
                <p className="text-[11px] text-slate-400 font-mono">₹{offerCost} / account</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-surface-1 p-5 shadow-lg space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                  Total Spending
                </span>
                <p className="text-2xl font-heading font-extrabold text-white tabular-nums font-mono">
                  {formatCurrency(result.total_spending)}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">of {formatCurrency(result.budget)} budget</p>
              </div>

              <div className="rounded-xl border border-brand/40 bg-gradient-to-b from-brand/10 to-surface-1 p-5 shadow-lg space-y-1 card-hero-glow">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300 block font-sans">
                  Exp. Value Saved
                </span>
                <p className="text-2xl font-heading font-extrabold text-white tabular-nums font-mono">
                  {formatCurrency(result.total_expected_value_saved)}
                </p>
                <p className="text-[11px] text-slate-400 font-sans">Sum of (Prob × Value)</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-surface-1 p-5 shadow-lg space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                  Expected Net Value
                </span>
                <p className="text-2xl font-heading font-extrabold text-white tabular-nums font-mono">
                  {formatCurrency(result.expected_net_value)}
                </p>
                <p className="text-[11px] text-slate-400 font-sans">Saved minus Spending</p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-surface-1 p-5 shadow-lg space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block font-sans">
                  Campaign Net ROI
                </span>
                <p className="text-2xl font-heading font-extrabold text-emerald-400 tabular-nums font-mono">
                  +{result.overall_roi}%
                </p>
                <p className="text-[11px] text-slate-400 font-sans">Net portfolio return</p>
              </div>
            </div>

            {/* Selected High-ROI Customers Table */}
            <section aria-labelledby="selected-customers-heading" className="rounded-2xl border border-white/10 bg-surface-1 overflow-hidden shadow-xl space-y-0">
              <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-2">
                <div>
                  <h4 id="selected-customers-heading" className="text-base font-heading font-bold text-white">
                    Selected High-ROI Target Customers
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">
                    Ranked strictly by expected business return on retention offer investment
                  </p>
                </div>
                <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand/40 self-start sm:self-auto font-mono">
                  {result.selected_customers?.length || 0} Targets Selected
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-txt-primary">
                  <thead className="border-b border-white/10 bg-surface-2/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th scope="col" className="px-5 py-3.5">Rank & ID</th>
                      <th scope="col" className="px-5 py-3.5">Risk Tier</th>
                      <th scope="col" className="px-5 py-3.5 text-right">Churn Prob</th>
                      <th scope="col" className="px-5 py-3.5 text-right">Customer Value</th>
                      <th scope="col" className="px-5 py-3.5 text-right">Exp. Value Saved</th>
                      <th scope="col" className="px-5 py-3.5 text-right">Projected ROI</th>
                      <th scope="col" className="px-5 py-3.5">Selection Rationalization</th>
                      <th scope="col" className="px-5 py-3.5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.selected_customers?.map((c, index) => (
                      <tr key={c.customer_id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-5 py-3.5 font-mono text-xs font-bold text-white flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono">
                            {index + 1}
                          </span>
                          <Link to={`/customers/${c.customer_id}`} className="hover:text-brand-400 transition-colors">
                            {c.customer_id}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5">
                          <RiskBadge risk={c.risk} size="sm" />
                        </td>
                        <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-white font-mono">
                          {formatPercent(c.churn_probability, true)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-xs text-slate-300 tabular-nums">
                          {formatCurrency(c.customer_value, true)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-xs font-bold text-accent-400 tabular-nums">
                          {formatCurrency(c.dynamic_val_saved, true)}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <ROIBadge roi={c.dynamic_roi} size="sm" />
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-300 max-w-xs font-sans">
                          {c.selection_reason}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            to={`/customers/${c.customer_id}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-surface-2 hover:bg-brand/20 border border-white/10 hover:border-brand/40 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
                          >
                            <span>Profile</span>
                            <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-brand-400" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
