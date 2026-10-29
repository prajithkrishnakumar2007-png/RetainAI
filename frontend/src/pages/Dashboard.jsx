import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Flame,
  AlertTriangle,
  TrendingUp,
  Percent,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Target,
  BarChart2,
  Table as TableIcon,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import Header from '../components/Header';
import KPICard from '../components/KPICard';
import RiskBadge from '../components/RiskBadge';
import ROIBadge from '../components/ROIBadge';
import AssumptionsCard from '../components/AssumptionsCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import { getDashboard, getCustomers } from '../services/api';
import { formatCurrency, formatPercent, formatNumber } from '../utils/formatters';

const RISK_COLORS = {
  Low: '#22C55E',
  Medium: '#F59E0B',
  High: '#F97316',
  Critical: '#EF4444',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [priorityCustomers, setPriorityCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accessible chart view toggles
  const [riskViewMode, setRiskViewMode] = useState('chart'); // 'chart' | 'table'
  const [roiViewMode, setRoiViewMode] = useState('chart'); // 'chart' | 'table'

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard aggregations and top priority customers in parallel
      const [dashRes, custRes] = await Promise.all([
        getDashboard(),
        getCustomers({
          limit: 6,
          sort_by: 'expected_value_saved',
          sort_order: 'desc',
        }),
      ]);

      setData(dashRes);
      setPriorityCustomers(custRes.customers || []);
    } catch (err) {
      setError(err.message || 'Failed to aggregate dashboard telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-darkbg overflow-y-auto">
        <Header
          title="Retention Overview"
          subtitle="Real-time predictive churn diagnostics and enterprise retention value"
        />
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <SkeletonLoader count={4} />
          <SkeletonLoader count={4} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonLoader type="chart" />
            <SkeletonLoader type="chart" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-darkbg">
        <Header title="Retention Overview" subtitle="System Diagnostics" />
        <div className="mt-8 max-w-xl mx-auto w-full">
          <ErrorMessage message={error || 'Unable to load dashboard metrics.'} onRetry={fetchDashboardData} />
        </div>
      </div>
    );
  }

  // Calculate risk distribution percentages and counts
  const totalRiskCount = (data.risk_distribution || []).reduce((acc, curr) => acc + curr.count, 0) || 1;
  const riskCategories = ['Low', 'Medium', 'High', 'Critical'];
  const enrichedRiskData = riskCategories.map((level) => {
    const found = (data.risk_distribution || []).find((r) => r.risk === level) || { count: 0 };
    const pct = ((found.count / totalRiskCount) * 100);
    return {
      name: `${level} Risk`,
      level,
      count: found.count,
      pctFormatted: `${pct.toFixed(1)}%`,
      pctRaw: pct,
    };
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-darkbg">
      <Header
        title="Executive Retention Overview"
        subtitle="AI-Powered Customer Retention & ROI Value Optimization"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Core Product Question Header Answer */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand/5 pointer-events-none blur-3xl" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 font-sans flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Portfolio Decision Matrix
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight">
                Which customers should you contact today, and what is it worth?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl leading-relaxed">
                Prioritizing accounts by <strong className="text-white">Expected Business Value Saved</strong> rather than churn probability alone prevents wasting retention spend on low-value accounts.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/optimizer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-600 transition-all shadow-md focus:outline-none"
              >
                <Target className="h-4 w-4" />
                Run Retention Optimizer
              </Link>
            </div>
          </div>
        </div>

        {/* HERO KPIs Tier (Strongest visual emphasis) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
              High-Impact Retention Metrics (Primary)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Portfolio baseline @ ₹200 offer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Expected Value Saved"
              value={formatCurrency(data.total_expected_value_saved)}
              subtitle="Sum of (Churn Probability × TotalCharges)"
              icon={DollarSign}
              variant="hero"
              color="accent"
              tag="Primary Value"
              href="/customers?sort_by=expected_value_saved&sort_order=desc"
            />
            <KPICard
              title="Critical Risk Accounts"
              value={formatNumber(data.critical_risk_customers)}
              subtitle="Churn probability ≥ 80% (Requires immediate intervention)"
              icon={Flame}
              variant="hero"
              color="riskCritical"
              tag="Urgent"
              href="/customers?risk=Critical"
            />
            <KPICard
              title="High Risk Accounts"
              value={formatNumber(data.high_risk_customers)}
              subtitle="Churn probability 60% - 80% (Target for promotional offer)"
              icon={AlertTriangle}
              variant="hero"
              color="riskHigh"
              tag="Actionable"
              href="/customers?risk=High"
            />
            <KPICard
              title="Average Retention ROI"
              value={formatPercent(data.average_roi, false, 0)}
              subtitle="Projected ROI across all potential retention interventions"
              icon={TrendingUp}
              variant="hero"
              color="positive"
              tag="Efficiency"
              href="/optimizer"
            />
          </div>
        </div>

        {/* SECONDARY KPIs Tier */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
            Portfolio Baseline Telemetry (Secondary)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Customers"
              value={formatNumber(data.total_customers)}
              subtitle="Accounts analyzed in reference database"
              icon={Users}
              variant="standard"
              color="neutral"
            />
            <KPICard
              title="Baseline Churn Rate"
              value={formatPercent(data.churn_rate)}
              subtitle="Historical baseline across portfolio"
              icon={Percent}
              variant="standard"
              color="neutral"
            />
            <KPICard
              title="Model Accuracy"
              value={formatPercent(data.model_accuracy, true, 1)}
              subtitle="Logistic Regression classifier benchmark"
              icon={CheckCircle2}
              variant="standard"
              color="brand"
              href="/model"
            />
            <KPICard
              title="Default Retention Budget"
              value={formatCurrency(data.default_budget)}
              subtitle="Pre-configured campaign budget benchmark"
              icon={Target}
              variant="standard"
              color="neutral"
              href="/optimizer"
            />
          </div>
        </div>

        {/* PRIORITY CUSTOMERS PANEL */}
        <section aria-labelledby="priority-customers-heading" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-brand-400" />
                <h3 id="priority-customers-heading" className="text-base sm:text-lg font-heading font-extrabold text-white">
                  Priority Customers to Contact Today
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Prioritized by <strong className="text-brand-300">expected business value saved</strong>, not churn probability alone.
              </p>
            </div>

            <Link
              to="/customers"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors shrink-0"
            >
              <span>View all {formatNumber(data.total_customers)} accounts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface-1 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-txt-primary">
                <thead className="border-b border-white/10 bg-surface-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Customer ID</th>
                    <th scope="col" className="px-5 py-3.5">Risk Tier</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Churn Prob</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Customer Value</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Exp. Value Saved</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Retention ROI</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {priorityCustomers.map((c, index) => (
                    <tr
                      key={c.customer_id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-white">
                        <Link
                          to={`/customers/${c.customer_id}`}
                          className="hover:text-brand-400 transition-colors inline-flex items-center gap-2"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white/5 text-[10px] text-slate-400 font-mono">
                            {index + 1}
                          </span>
                          <span>{c.customer_id}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-400" />
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <RiskBadge risk={c.risk} size="sm" />
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-white">
                        {formatPercent(c.churn_probability, true)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums font-mono text-xs text-slate-300">
                        {formatCurrency(c.customer_value, true)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums font-mono text-xs font-bold text-accent-400">
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
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-400" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-surface-2/40 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <HelpCircle className="h-3.5 w-3.5 text-brand-400" />
                Formula: Expected Value Saved = Churn Probability × TotalCharges
              </span>
              <Link
                to="/customers?sort_by=expected_value_saved&sort_order=desc"
                className="text-brand-400 hover:underline font-semibold"
              >
                Sort Full Portfolio by Expected Value Saved →
              </Link>
            </div>
          </div>
        </section>

        {/* RETENTION OPTIMIZER CALLOUT BANNER */}
        <div className="rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/15 via-surface-2 to-surface-1 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl relative overflow-hidden">
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-brand-400 animate-pulse" />
              <h4 className="text-base font-heading font-extrabold text-white">
                Retention Optimizer Ready
              </h4>
              <span className="rounded bg-brand/20 border border-brand/40 px-2 py-0.5 text-[10px] font-bold text-brand-300">
                Budget Allocation
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-sans">
              Use your retention budget to prioritize customers with the highest expected business value. Calculate optimal portfolio allocations with customizable offer costs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <Link
              to="/optimizer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-600 transition-all shadow-md focus:outline-none"
            >
              <Target className="h-4 w-4" />
              Open Optimizer
            </Link>
            <Link
              to="/predict"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-surface-2 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/5 transition-all shadow-sm focus:outline-none"
            >
              <Sparkles className="h-4 w-4 text-accent-400" />
              Predict New
            </Link>
          </div>
        </div>

        {/* CHARTS GRID (Above the fold / Primary Analytics) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Churn Risk Donut Chart */}
          <div className="rounded-xl border border-white/10 bg-surface-1 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-base font-heading font-bold text-white">
                  Customer Churn Risk Distribution
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Segmented into Low, Medium, High, and Critical thresholds
                </p>
              </div>

              {/* View as Table Toggle */}
              <div className="flex items-center rounded-lg bg-surface-2 p-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setRiskViewMode('chart')}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                    riskViewMode === 'chart'
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="View risk distribution as chart"
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRiskViewMode('table')}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                    riskViewMode === 'table'
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="View risk distribution as accessible table"
                >
                  <TableIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {riskViewMode === 'chart' ? (
              <div className="h-64 w-full" role="img" aria-label="Donut chart showing customer risk breakdown">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={enrichedRiskData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={48}
                      paddingAngle={3}
                    >
                      {enrichedRiskData.map((entry) => (
                        <Cell key={entry.level} fill={RISK_COLORS[entry.level]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F1420',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      }}
                      itemStyle={{ color: '#F8FAFC' }}
                      formatter={(val, name, item) => [
                        `${formatNumber(val)} customers (${item.payload.pctFormatted})`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 overflow-y-auto">
                <table className="w-full text-left text-xs text-txt-primary">
                  <thead className="bg-surface-2 text-slate-400 border-b border-white/10 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Risk Level</th>
                      <th className="px-4 py-2.5 text-right">Customer Count</th>
                      <th className="px-4 py-2.5 text-right">Share of Portfolio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {enrichedRiskData.map((r) => (
                      <tr key={r.level}>
                        <td className="px-4 py-2.5 font-medium flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: RISK_COLORS[r.level] }}
                          />
                          <span>{r.level} Risk</span>
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-mono font-bold text-white">
                          {formatNumber(r.count)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-mono text-slate-300">
                          {r.pctFormatted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Visible Category Legend with Counts and Percentages */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/5">
              {enrichedRiskData.map((item) => (
                <div
                  key={item.level}
                  className="rounded-xl border border-white/5 bg-surface-2/60 p-2.5 text-center space-y-1"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: RISK_COLORS[item.level] }}
                    />
                    <span className="text-[11px] font-bold text-white">
                      {item.level}
                    </span>
                  </div>
                  <div className="font-heading font-extrabold text-sm text-white tabular-nums">
                    {formatNumber(item.count)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {item.pctFormatted}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Distribution Bar Chart */}
          <div className="rounded-xl border border-white/10 bg-surface-1 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-base font-heading font-bold text-white">
                  Retention Offer ROI Distribution
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Distribution of portfolio by expected return on ₹200 offer
                </p>
              </div>

              {/* View as Table Toggle */}
              <div className="flex items-center rounded-lg bg-surface-2 p-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setRoiViewMode('chart')}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                    roiViewMode === 'chart'
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="View ROI distribution as chart"
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRoiViewMode('table')}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                    roiViewMode === 'table'
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="View ROI distribution as accessible table"
                >
                  <TableIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {roiViewMode === 'chart' ? (
              <div className="h-64 w-full" role="img" aria-label="Bar chart showing distribution of ROI across customer portfolio">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.roi_distribution || []} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                    <XAxis
                      dataKey="roi_bucket"
                      tick={{ fill: '#94A3B8', fontSize: 10 }}
                      angle={-15}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F1420',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      }}
                      itemStyle={{ color: '#F8FAFC' }}
                      formatter={(val) => [`${formatNumber(val)} accounts`, 'Customers']}
                    />
                    <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 overflow-y-auto">
                <table className="w-full text-left text-xs text-txt-primary">
                  <thead className="bg-surface-2 text-slate-400 border-b border-white/10 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">ROI Tier Bucket</th>
                      <th className="px-4 py-2.5 text-right">Target Accounts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(data.roi_distribution || []).map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2.5 font-medium text-slate-200">
                          {row.roi_bucket}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-mono font-bold text-white">
                          {formatNumber(row.count)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between font-sans">
              <span>*Negative ROI accounts are deprioritized by the budget optimizer.</span>
              <Link to="/optimizer" className="text-brand-400 hover:underline font-semibold">
                Allocate Budget →
              </Link>
            </div>
          </div>
        </div>

        {/* Contract Breakdown & Churn Risk Bar */}
        <div className="rounded-xl border border-white/10 bg-surface-1 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <h4 className="text-base font-heading font-bold text-white">
                Churn Sensitivity by Contract Commitment
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                Comparing customer tenure stability across Month-to-month, One year, and Two year agreements
              </p>
            </div>
            <Link
              to="/analytics"
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
            >
              <span>Explore Multi-Variable Analytics</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(data.contract_stats || []).map((c) => {
              const churnPct = (c.total > 0 ? (c.churned / c.total) * 100 : 0).toFixed(1);
              const isHighChurn = parseFloat(churnPct) > 30;

              return (
                <div
                  key={c.contract}
                  className="rounded-xl border border-white/5 bg-surface-2/60 p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-heading font-bold text-white">
                      {c.contract}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold tabular-nums border ${
                        isHighChurn
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {churnPct}% Churn
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 font-sans">
                    <div className="flex justify-between">
                      <span>Total Accounts:</span>
                      <span className="font-semibold text-white font-mono">{formatNumber(c.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Churn Probability:</span>
                      <span className="font-semibold text-white font-mono">{formatPercent(c.avg_churn_prob, true)}</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isHighChurn ? 'bg-rose-500' : 'bg-brand-500'}`}
                      style={{ width: `${Math.min(100, Math.max(5, parseFloat(churnPct)))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assumptions Card */}
        <AssumptionsCard />
      </div>
    </div>
  );
}
