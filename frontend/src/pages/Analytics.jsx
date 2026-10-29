import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid
} from 'recharts';
import {
  Clock,
  Wifi,
  DollarSign
} from 'lucide-react';

import Header from '../components/Header';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import { getAnalytics } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAnalytics();
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to retrieve portfolio analytics breakdown.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-darkbg overflow-y-auto">
        <Header
          title="Predictive Portfolio Analytics"
          subtitle="Aggregating multi-dimensional behavioral, infrastructure, and contract cohorts across 7,043 accounts..."
        />
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonLoader type="chart" />
            <SkeletonLoader type="chart" />
          </div>
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
        <Header title="Portfolio Analytics" subtitle="System Analytics" />
        <div className="mt-8 max-w-xl mx-auto w-full">
          <ErrorMessage message={error || 'No analytics telemetry available.'} onRetry={fetchAnalyticsData} />
        </div>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: '#0F1420',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-darkbg">
      <Header
        title="Predictive Churn Analytics Workspace"
        subtitle="Behavioral and structural churn analysis across contracts, infrastructure, and financial segments"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto w-full">
        {/* SECTION 1: Customer Behavior & Lifecycle */}
        <section aria-labelledby="behavior-heading" className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Clock className="h-4 w-4 text-brand-400" />
            <div>
              <h3 id="behavior-heading" className="text-base font-heading font-extrabold text-white">
                1. Customer Lifecycle & Contract Behavior
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Vulnerability across account commitment types and tenure duration
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Churn by Contract */}
            <div className="rounded-2xl border border-white/10 bg-surface-1 p-5 sm:p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-heading font-bold text-white">
                Average Churn Probability by Contract Type
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                Month-to-month contracts exhibit nearly 4x higher churn rate than multi-year commitments
              </p>
              <div className="h-64 w-full" role="img" aria-label="Bar chart showing average churn probability by contract">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.churn_by_contract} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                    <XAxis dataKey="category" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} unit="%" />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      itemStyle={{ color: '#F8FAFC' }}
                      formatter={(val) => [`${val}%`, 'Avg Churn Probability']}
                    />
                    <Bar dataKey="avg_churn_prob_pct" fill="#6366F1" radius={[6, 6, 0, 0]} name="Avg Churn %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Churn by Tenure Cohort */}
            <div className="rounded-2xl border border-white/10 bg-surface-1 p-5 sm:p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-heading font-bold text-white">
                Churn Risk Across Customer Lifecycle (Tenure)
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                The first 12 months constitute the primary vulnerability window across customer accounts
              </p>
              <div className="h-64 w-full" role="img" aria-label="Bar chart showing churn across tenure cohorts">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.churn_by_tenure} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                    <XAxis dataKey="tenure_group" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} unit="%" />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      itemStyle={{ color: '#F8FAFC' }}
                      formatter={(val) => [`${val}%`, 'Avg Churn Probability']}
                    />
                    <Bar dataKey="avg_churn_prob_pct" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Avg Churn %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Infrastructure & Payment Drivers */}
        <section aria-labelledby="infrastructure-heading" className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Wifi className="h-4 w-4 text-brand-400" />
            <div>
              <h3 id="infrastructure-heading" className="text-base font-heading font-extrabold text-white">
                2. Infrastructure & Payment Churn Drivers
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Impact of technical infrastructure and billing friction
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Churn by Internet Service */}
            <div className="rounded-2xl border border-white/10 bg-surface-1 p-5 sm:p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-heading font-bold text-white">
                Churn Sensitivity by Internet Infrastructure
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                Fiber Optic exhibits highest churn propensity due to premium recurring price points
              </p>
              <div className="h-64 w-full" role="img" aria-label="Bar chart showing churn probability by internet service">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.churn_by_internet_service} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                    <XAxis dataKey="category" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} unit="%" />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      itemStyle={{ color: '#F8FAFC' }}
                      formatter={(val) => [`${val}%`, 'Avg Churn Probability']}
                    />
                    <Bar dataKey="avg_churn_prob_pct" fill="#22D3EE" radius={[6, 6, 0, 0]} name="Avg Churn %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Churn by Payment Method */}
            <div className="rounded-2xl border border-white/10 bg-surface-1 p-5 sm:p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-heading font-bold text-white">
                Churn Probability by Payment Channel
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                Electronic check accounts demonstrate highest churn due to manual payment friction
              </p>
              <div className="h-64 w-full" role="img" aria-label="Bar chart showing churn by payment channel">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.churn_by_payment_method} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                    <XAxis
                      dataKey="category"
                      tick={{ fill: '#94A3B8', fontSize: 10 }}
                      angle={-15}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} unit="%" />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      itemStyle={{ color: '#F8FAFC' }}
                      formatter={(val) => [`${val}%`, 'Avg Churn Probability']}
                    />
                    <Bar dataKey="avg_churn_prob_pct" fill="#6366F1" radius={[6, 6, 0, 0]} name="Avg Churn %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Financial Elasticity & Value Quadrant */}
        <section aria-labelledby="financial-heading" className="space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <DollarSign className="h-4 w-4 text-brand-400" />
            <div>
              <h3 id="financial-heading" className="text-base font-heading font-extrabold text-white">
                3. Financial Impact & Value Quadrant Mapping
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Price tier elasticity and high-priority accounts quadrant
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Monthly Charges Tier Bar */}
            <div className="rounded-2xl border border-white/10 bg-surface-1 p-5 sm:p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-heading font-bold text-white">
                Churn Likelihood by Monthly Charge Tiers
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                Accounts billed over ₹70/month have double the churn rate of accounts billed under ₹35/month
              </p>
              <div className="h-64 w-full" role="img" aria-label="Bar chart showing churn likelihood across bill brackets">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.churn_by_monthly_charges} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                    <XAxis dataKey="charge_group" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} unit="%" />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      itemStyle={{ color: '#F8FAFC' }}
                      formatter={(val) => [`${val}%`, 'Avg Churn Probability']}
                    />
                    <Bar dataKey="avg_churn_prob_pct" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Avg Churn %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scatter Plot Quadrant Map */}
            <div className="rounded-2xl border border-white/10 bg-surface-1 p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div>
                  <h4 className="text-base font-heading font-bold text-white">
                    Customer Value (₹) vs Churn Probability (Quadrant Matrix)
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">
                    Top-right quadrant represents prime retention targets: high customer value and high churn probability
                  </p>
                </div>
                <span className="rounded-full bg-surface-2 border border-white/10 px-3 py-1 text-xs text-slate-300 font-mono">
                  Sample 150 Portfolio Accounts
                </span>
              </div>

              <div className="h-80 w-full" role="img" aria-label="Scatter plot quadrant map of customer value versus churn probability">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      type="number"
                      dataKey="churn_probability"
                      name="Churn Probability"
                      domain={[0, 1]}
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      label={{ value: 'Churn Probability (0% - 100%)', position: 'bottom', fill: '#94A3B8', fontSize: 11, offset: 5 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="customer_value"
                      name="Customer Value"
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      tickFormatter={(v) => `₹${v}`}
                      label={{ value: 'Customer Value (TotalCharges)', angle: -90, position: 'left', fill: '#94A3B8', fontSize: 11, offset: 5 }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-white/10 bg-surface-1 p-3 text-xs shadow-2xl space-y-1 font-mono">
                              <p className="font-bold text-white">{item.customer_id}</p>
                              <p className="text-slate-400">Churn Likelihood: <strong className="text-white">{formatPercent(item.churn_probability, true)}</strong></p>
                              <p className="text-accent-400">Customer Value: <strong>{formatCurrency(item.customer_value)}</strong></p>
                              <p className="text-brand-400">Retention ROI: <strong>+{item.roi}%</strong></p>
                              <p className="text-slate-400">Risk Tier: <strong className="text-white">{item.risk}</strong></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter name="Customers" data={data.value_vs_probability_sample || []} fill="#22D3EE" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
