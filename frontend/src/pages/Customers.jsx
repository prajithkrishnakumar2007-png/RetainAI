import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  ChevronRight as ChevronIcon
} from 'lucide-react';

import Header from '../components/Header';
import RiskBadge from '../components/RiskBadge';
import ROIBadge from '../components/ROIBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { getCustomers } from '../services/api';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

const RISK_TABS = ['All', 'Critical', 'High', 'Medium', 'Low'];

export default function Customers() {
  const [searchParams] = useSearchParams();

  const initialRisk = searchParams.get('risk') || 'All';
  const initialSortBy = searchParams.get('sort_by') || 'roi';
  const initialSortOrder = searchParams.get('sort_order') || 'desc';

  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and pagination states
  const [search, setSearch] = useState('');
  const [risk, setRisk] = useState(initialRisk);
  const [minProb, setMinProb] = useState(0);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [page, setPage] = useState(0);
  const limit = 25;

  const fetchCustomerList = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        search: search.trim() || undefined,
        risk: risk !== 'All' ? risk : undefined,
        min_churn_probability: minProb > 0 ? minProb / 100 : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        limit,
        offset: page * limit,
      };

      const res = await getCustomers(params);
      setCustomers(res.customers || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message || 'Unable to retrieve customer list from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, [risk, minProb, sortBy, sortOrder, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCustomerList();
  };

  const handleResetFilters = () => {
    setSearch('');
    setRisk('All');
    setMinProb(0);
    setSortBy('roi');
    setSortOrder('desc');
    setPage(0);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-darkbg">
      <Header
        title="Customer Risk & Portfolio Analysis"
        subtitle="Searchable portfolio of 7,043 customers ranked by churn risk and expected financial ROI"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls & Filter Panel */}
        <div className="rounded-2xl border border-white/10 bg-surface-1 p-5 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Customer ID (e.g. 7590-VHVEG)..."
                className="w-full rounded-xl border border-white/10 bg-surface-2 pl-10 pr-24 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-brand focus:outline-none transition-all"
                aria-label="Search customer ID"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 rounded-lg bg-brand px-3 py-1 text-xs font-bold text-white hover:bg-brand-600 transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Quick Risk Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1.5 hidden sm:inline">
                Risk:
              </span>
              {RISK_TABS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRisk(r);
                    setPage(0);
                  }}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                    risk === r
                      ? 'bg-brand text-white shadow-md'
                      : 'bg-surface-2 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  {r === 'All' ? 'All Tiers' : `${r}`}
                </button>
              ))}
            </div>

            {/* Metric Sorting Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline">
                Sort:
              </span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [col, ord] = e.target.value.split('-');
                  setSortBy(col);
                  setSortOrder(ord);
                  setPage(0);
                }}
                className="rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs font-medium text-white focus:border-brand focus:outline-none transition-all"
                aria-label="Sort customer table"
              >
                <option value="roi-desc">Highest ROI (%)</option>
                <option value="roi-asc">Lowest ROI (%)</option>
                <option value="expected_value_saved-desc">Highest Expected Value Saved</option>
                <option value="churn_probability-desc">Highest Churn Probability</option>
                <option value="churn_probability-asc">Lowest Churn Probability</option>
                <option value="customer_value-desc">Highest Customer Value</option>
                <option value="tenure-desc">Longest Tenure</option>
              </select>
            </div>
          </div>

          {/* Secondary filter bar: Probability Slider & Counts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-medium whitespace-nowrap">
                Min Churn Probability: <strong className="text-white font-mono">{minProb}%</strong>
              </span>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minProb}
                onChange={(e) => {
                  setMinProb(Number(e.target.value));
                  setPage(0);
                }}
                className="w-36 sm:w-48 h-1.5 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-brand"
                aria-label="Minimum churn probability filter"
              />
              {minProb > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setMinProb(0);
                    setPage(0);
                  }}
                  className="text-xs text-brand-400 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {(search || risk !== 'All' || minProb > 0) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset All</span>
                </button>
              )}
              <span className="font-mono text-slate-300">
                Found <strong className="text-white">{formatNumber(total)}</strong> matching accounts
              </span>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="rounded-2xl border border-white/10 bg-surface-1 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-6">
              <SkeletonLoader type="table" rows={8} />
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorMessage message={error} onRetry={fetchCustomerList} />
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No customers match your filter criteria"
                message="Try adjusting your search query, lowering the minimum churn probability, or switching risk tiers."
                action={
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 transition-colors shadow-md"
                  >
                    Reset All Filters
                  </button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-txt-primary">
                <thead className="border-b border-white/10 bg-surface-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Customer ID</th>
                    <th scope="col" className="px-5 py-3.5">Risk Tier</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Churn Prob</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Customer Value</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Offer Cost</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Exp. Value Saved</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Retention ROI</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {customers.map((c) => (
                    <tr
                      key={c.customer_id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-white">
                        <Link
                          to={`/customers/${c.customer_id}`}
                          className="hover:text-brand-400 transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>{c.customer_id}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-400" />
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <RiskBadge risk={c.risk} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <span className="font-semibold text-white tabular-nums">
                            {formatPercent(c.churn_probability, true)}
                          </span>
                          <div className="w-12 h-1.5 bg-surface-2 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full ${
                                c.churn_probability >= 0.8
                                  ? 'bg-rose-500'
                                  : c.churn_probability >= 0.6
                                  ? 'bg-amber-500'
                                  : c.churn_probability >= 0.3
                                  ? 'bg-indigo-400'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${c.churn_probability * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-xs text-slate-300 tabular-nums">
                        {formatCurrency(c.customer_value, true)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-xs text-slate-400 tabular-nums">
                        {formatCurrency(c.offer_cost, true)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-xs font-bold text-accent-400 tabular-nums">
                        {formatCurrency(c.expected_value_saved, true)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <ROIBadge roi={c.roi} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/customers/${c.customer_id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-surface-2 hover:bg-brand/20 border border-white/10 hover:border-brand/40 px-3 py-1 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
                        >
                          <span>Inspect</span>
                          <ChevronIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="border-t border-white/10 bg-surface-2/60 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span className="font-mono">
                Showing <strong className="text-white">{page * limit + 1}</strong> – <strong className="text-white">{Math.min(total, (page + 1) * limit)}</strong> of <strong className="text-white">{formatNumber(total)}</strong> accounts (Page {page + 1} of {totalPages})
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-surface-1 px-3 py-1.5 font-semibold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-all shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-surface-1 px-3 py-1.5 font-semibold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-all shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
