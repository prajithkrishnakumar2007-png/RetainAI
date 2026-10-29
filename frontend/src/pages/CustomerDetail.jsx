import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  CreditCard,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Sliders
} from 'lucide-react';

import Header from '../components/Header';
import RiskBadge from '../components/RiskBadge';
import ROIBadge from '../components/ROIBadge';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import { getCustomerById } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/formatters';

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic individual offer simulator
  const [customOffer, setCustomOffer] = useState(200);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomerById(id);
      setCustomer(data);
      if (data?.offer_cost) setCustomOffer(data.offer_cost);
    } catch (err) {
      setError(err.message || 'Customer profile not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-darkbg overflow-y-auto">
        <Header title={`Customer Profile: ${id}`} subtitle="Retrieving predictive diagnostics and account telemetry..." />
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <SkeletonLoader count={4} />
          <SkeletonLoader type="chart" />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-darkbg">
        <Header title="Customer Profile" subtitle="Account Telemetry" />
        <div className="mt-8 max-w-lg mx-auto w-full">
          <ErrorMessage message={error || `Customer record '${id}' was not found in the database.`} />
          <div className="mt-6 text-center">
            <Link
              to="/customers"
              className="inline-flex items-center gap-2 rounded-xl bg-surface-2 border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/5 transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Customer Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Real-time calculation for individual simulator
  const simulatedSaved = customer.churn_probability * customer.customer_value;
  const simulatedROI = customOffer > 0 ? ((simulatedSaved - customOffer) / customOffer) * 100 : 0;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-darkbg">
      <Header
        title={`Customer: ${customer.customer_id}`}
        subtitle="Individual Churn Diagnostics & Prescribed Retention Strategy"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            to="/customers"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Customer Directory</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <RiskBadge risk={customer.risk} size="lg" />
            <ROIBadge roi={customer.roi} size="lg" />
          </div>
        </div>

        {/* HERO EXECUTIVE PROFILE SUMMARY */}
        <div className="rounded-2xl border border-white/10 bg-surface-1 p-6 lg:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand/5 pointer-events-none blur-3xl" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {/* Churn Probability */}
            <div className="sm:border-r border-white/10 sm:pr-6 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-sans">
                Churn Probability
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-heading font-extrabold text-white tabular-nums">
                  {formatPercent(customer.churn_probability, true)}
                </span>
                <span className="text-xs text-slate-400 font-sans">likelihood</span>
              </div>
              <p className="text-xs text-slate-400 pt-1 font-mono">
                Classification: <strong className="text-white">{customer.predicted_churn === 1 ? 'Will Churn (1)' : 'Will Retain (0)'}</strong>
              </p>
            </div>

            {/* Customer Value Proxy */}
            <div className="lg:border-r border-white/10 lg:pr-6 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-sans">
                Customer Value Proxy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-heading font-extrabold text-accent-400 tabular-nums">
                  {formatCurrency(customer.customer_value)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 italic pt-1 font-sans">
                TotalCharges proxy (not net CLV)
              </p>
            </div>

            {/* Expected Value Saved */}
            <div className="sm:border-r border-white/10 sm:pr-6 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-sans">
                Expected Value Saved
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-heading font-extrabold text-white tabular-nums">
                  {formatCurrency(customer.expected_value_saved)}
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-1 font-mono">
                Prob × Customer Value
              </p>
            </div>

            {/* Prescribed Retention Strategy */}
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-sans">
                Prescribed Strategy
              </span>
              <div className="pt-0.5">
                <span className="inline-block rounded-xl bg-brand/20 border border-brand/40 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
                  {customer.recommended_action}
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-1 font-sans">
                Agreement: <strong className="text-white">{customer.contract}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* WHY THIS CUSTOMER IS AT RISK? (Explainability Section) */}
        <section aria-labelledby="explainability-heading" className="rounded-2xl border border-white/10 bg-surface-1 p-6 lg:p-7 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 id="explainability-heading" className="text-base font-heading font-bold text-white">
                  Why is this customer at risk?
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Transparent behavioral indicators and contract stabilizers
                </p>
              </div>
            </div>

            <span className="inline-flex items-center rounded-lg bg-surface-2 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-300 self-start sm:self-auto font-mono">
              Rule-based insight
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Primary Churn Drivers */}
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                <span>Primary Churn Risk Drivers ({customer.risk_factors?.length || 0})</span>
              </div>
              {customer.risk_factors && customer.risk_factors.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-200 font-sans">
                  {customer.risk_factors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 font-sans">
                  No elevated structural churn drivers detected.
                </p>
              )}
            </div>

            {/* Protective Retention Stabilizers */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Retention Stabilizers & Loyalty Factors ({customer.protective_factors?.length || 0})</span>
              </div>
              {customer.protective_factors && customer.protective_factors.length > 0 ? (
                <ul className="space-y-2 text-xs text-slate-200 font-sans">
                  {customer.protective_factors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 font-sans">
                  No long-term contracts or automatic billing safeguards detected.
                </p>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 italic pt-1 font-sans">
            Note: Drivers are transparent diagnostic heuristics correlated with Logistic Regression feature coefficients from the Telco training cohort.
          </p>
        </section>

        {/* INDIVIDUAL RETENTION OFFER SIMULATOR */}
        <div className="rounded-2xl border border-white/10 bg-surface-1 p-6 lg:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-brand-400" />
            <h3 className="text-base font-heading font-bold text-white">
              Individual Retention Offer Cost Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Simulate how different promotional discounts or hardware credits impact net return for this specific account:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Simulated Offer Incentive:</span>
                <span className="font-mono font-bold text-accent-400 text-sm">{formatCurrency(customOffer)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={customOffer}
                onChange={(e) => setCustomOffer(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-brand"
                aria-label="Custom offer cost slider"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹50</span>
                <span>₹500</span>
                <span>₹1,000</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-surface-2/60 p-4 text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium">Expected Value Saved</span>
              <p className="text-xl font-heading font-extrabold text-white tabular-nums font-mono">
                {formatCurrency(simulatedSaved, true)}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-surface-2/60 p-4 text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium">Simulated Net ROI</span>
              <p
                className={`text-xl font-heading font-extrabold tabular-nums font-mono ${
                  simulatedROI >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {simulatedROI >= 0 ? '+' : ''}{simulatedROI.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* COMPLETE FEATURE TELEMETRY */}
        <section aria-labelledby="telemetry-heading" className="rounded-2xl border border-white/10 bg-surface-1 p-6 lg:p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <FileText className="h-4 w-4 text-slate-400" />
            <h3 id="telemetry-heading" className="text-base font-heading font-bold text-white">
              Complete Account Telemetry & Feature Vectors
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
            {/* Demographic */}
            <div className="rounded-xl border border-white/5 bg-surface-2/40 p-4 space-y-3">
              <h4 className="font-heading font-bold uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2 flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-brand-400" />
                <span>Customer Demographics</span>
              </h4>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between"><span className="text-slate-400">Gender:</span><span className="text-white font-medium">{customer.gender}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Senior Citizen:</span><span className="text-white font-medium">{customer.senior_citizen === 1 ? 'Yes (1)' : 'No (0)'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Partner:</span><span className="text-white font-medium">{customer.partner}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Dependents:</span><span className="text-white font-medium">{customer.dependents}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Account Tenure:</span><span className="text-white font-mono font-bold">{customer.tenure} Months</span></div>
              </div>
            </div>

            {/* Service & Subscriptions */}
            <div className="rounded-xl border border-white/5 bg-surface-2/40 p-4 space-y-3">
              <h4 className="font-heading font-bold uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2 flex items-center gap-2">
                <Wifi className="h-3.5 w-3.5 text-brand-400" />
                <span>Subscribed Services</span>
              </h4>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between"><span className="text-slate-400">Phone Service:</span><span className="text-white font-medium">{customer.phone_service}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Multiple Lines:</span><span className="text-white font-medium">{customer.multiple_lines}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Internet Service:</span><span className="text-accent-400 font-bold">{customer.internet_service}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Online Security:</span><span className="text-white font-medium">{customer.online_security}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Online Backup:</span><span className="text-white font-medium">{customer.online_backup}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Device Protection:</span><span className="text-white font-medium">{customer.device_protection}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Tech Support:</span><span className="text-white font-medium">{customer.tech_support}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Streaming TV:</span><span className="text-white font-medium">{customer.streaming_tv}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Streaming Movies:</span><span className="text-white font-medium">{customer.streaming_movies}</span></div>
              </div>
            </div>

            {/* Billing & Contract */}
            <div className="rounded-xl border border-white/5 bg-surface-2/40 p-4 space-y-3">
              <h4 className="font-heading font-bold uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2 flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-brand-400" />
                <span>Contract & Billing</span>
              </h4>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between"><span className="text-slate-400">Contract:</span><span className="text-white font-bold">{customer.contract}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Paperless Billing:</span><span className="text-white font-medium">{customer.paperless_billing}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Payment Channel:</span><span className="text-white font-medium">{customer.payment_method}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Monthly Charges:</span><span className="text-white font-mono font-bold">{formatCurrency(customer.monthly_charges, true)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Total Charges:</span><span className="text-accent-400 font-mono font-bold">{formatCurrency(customer.total_charges, true)}</span></div>
                <div className="flex justify-between pt-1 border-t border-white/5">
                  <span className="text-slate-400">Historical Churn:</span>
                  <span className={`font-bold ${customer.actual_churn === 'Yes' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {customer.actual_churn === 'Yes' ? 'Churned (Yes)' : 'Retained (No)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
