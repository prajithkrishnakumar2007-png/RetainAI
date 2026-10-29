import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  User,
  Wifi,
  CreditCard,
  DollarSign
} from 'lucide-react';

import Header from '../components/Header';
import RiskBadge from '../components/RiskBadge';
import ROIBadge from '../components/ROIBadge';
import ErrorMessage from '../components/ErrorMessage';
import { predictCustomer } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const PRESETS = {
  highRisk: {
    gender: 'Female',
    SeniorCitizen: 1,
    Partner: 'No',
    Dependents: 'No',
    tenure: 2,
    PhoneService: 'Yes',
    MultipleLines: 'No',
    InternetService: 'Fiber optic',
    OnlineSecurity: 'No',
    OnlineBackup: 'No',
    DeviceProtection: 'No',
    TechSupport: 'No',
    StreamingTV: 'Yes',
    StreamingMovies: 'Yes',
    Contract: 'Month-to-month',
    PaperlessBilling: 'Yes',
    PaymentMethod: 'Electronic check',
    MonthlyCharges: 95.50,
    TotalCharges: 191.00,
    offer_cost: 200.0,
  },
  lowRisk: {
    gender: 'Male',
    SeniorCitizen: 0,
    Partner: 'Yes',
    Dependents: 'Yes',
    tenure: 62,
    PhoneService: 'Yes',
    MultipleLines: 'Yes',
    InternetService: 'DSL',
    OnlineSecurity: 'Yes',
    OnlineBackup: 'Yes',
    DeviceProtection: 'Yes',
    TechSupport: 'Yes',
    StreamingTV: 'No',
    StreamingMovies: 'No',
    Contract: 'Two year',
    PaperlessBilling: 'No',
    PaymentMethod: 'Credit card (automatic)',
    MonthlyCharges: 64.80,
    TotalCharges: 4017.60,
    offer_cost: 200.0,
  },
  mediumRisk: {
    gender: 'Female',
    SeniorCitizen: 0,
    Partner: 'No',
    Dependents: 'No',
    tenure: 18,
    PhoneService: 'Yes',
    MultipleLines: 'Yes',
    InternetService: 'Fiber optic',
    OnlineSecurity: 'Yes',
    OnlineBackup: 'No',
    DeviceProtection: 'Yes',
    TechSupport: 'No',
    StreamingTV: 'Yes',
    StreamingMovies: 'No',
    Contract: 'One year',
    PaperlessBilling: 'Yes',
    PaymentMethod: 'Bank transfer (automatic)',
    MonthlyCharges: 79.20,
    TotalCharges: 1425.60,
    offer_cost: 200.0,
  },
};

export default function Predict() {
  const [formData, setFormData] = useState(PRESETS.highRisk);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handlePreset = (presetKey) => {
    setFormData(PRESETS[presetKey]);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await predictCustomer(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Prediction scoring failed. Please verify input values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-darkbg">
      <Header
        title="Predict Customer Churn & Financial Impact"
        subtitle="Simulate individual customer scenarios and calculate instant risk probability and retention ROI"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Scenario Presets Banner */}
        <div className="rounded-2xl border border-white/10 bg-surface-1 p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <Sparkles className="h-4 w-4 text-brand-400 shrink-0" />
            <span className="font-bold text-white">Interactive Scenario Presets:</span>
            <span className="text-slate-400">Load calibrated profiles to test model scoring</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handlePreset('highRisk')}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all shadow-sm"
            >
              High Risk Scenario
            </button>
            <button
              type="button"
              onClick={() => handlePreset('mediumRisk')}
              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all shadow-sm"
            >
              Medium Risk Scenario
            </button>
            <button
              type="button"
              onClick={() => handlePreset('lowRisk')}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-sm"
            >
              Loyal Customer Scenario
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Input Form (7 cols) */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 rounded-2xl border border-white/10 bg-surface-1 p-6 lg:p-7 shadow-xl space-y-7"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-heading font-extrabold uppercase tracking-wider text-white">
                Customer Profile Parameters
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Telco Feature Set
              </span>
            </div>

            {/* Group 1: Customer Profile (Demographics) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
                <User className="h-3.5 w-3.5" />
                <span>1. Customer Demographics</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Senior Citizen</label>
                  <select
                    name="SeniorCitizen"
                    value={formData.SeniorCitizen}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value={0}>No (0)</option>
                    <option value={1}>Yes (1)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Partner</label>
                  <select
                    name="Partner"
                    value={formData.Partner}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Dependents</label>
                  <select
                    name="Dependents"
                    value={formData.Dependents}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Group 2: Subscribed Services */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
                <Wifi className="h-3.5 w-3.5" />
                <span>2. Services & Infrastructure</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Internet Service</label>
                  <select
                    name="InternetService"
                    value={formData.InternetService}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="Fiber optic">Fiber optic</option>
                    <option value="DSL">DSL</option>
                    <option value="No">No Internet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Online Security</label>
                  <select
                    name="OnlineSecurity"
                    value={formData.OnlineSecurity}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Tech Support</label>
                  <select
                    name="TechSupport"
                    value={formData.TechSupport}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Phone Service</label>
                  <select
                    name="PhoneService"
                    value={formData.PhoneService}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Multiple Lines</label>
                  <select
                    name="MultipleLines"
                    value={formData.MultipleLines}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No phone service">No phone service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Device Protection</label>
                  <select
                    name="DeviceProtection"
                    value={formData.DeviceProtection}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Online Backup</label>
                  <select
                    name="OnlineBackup"
                    value={formData.OnlineBackup}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Streaming TV</label>
                  <select
                    name="StreamingTV"
                    value={formData.StreamingTV}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Streaming Movies</label>
                  <select
                    name="StreamingMovies"
                    value={formData.StreamingMovies}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="No internet service">No internet service</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Group 3: Contract & Billing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
                <CreditCard className="h-3.5 w-3.5" />
                <span>3. Contract & Billing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Contract Type</label>
                  <select
                    name="Contract"
                    value={formData.Contract}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="Month-to-month">Month-to-month</option>
                    <option value="One year">One year</option>
                    <option value="Two year">Two year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Payment Method</label>
                  <select
                    name="PaymentMethod"
                    value={formData.PaymentMethod}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="Electronic check">Electronic check</option>
                    <option value="Mailed check">Mailed check</option>
                    <option value="Bank transfer (automatic)">Bank transfer (automatic)</option>
                    <option value="Credit card (automatic)">Credit card (automatic)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Paperless Billing</label>
                  <select
                    name="PaperlessBilling"
                    value={formData.PaperlessBilling}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-white focus:border-brand focus:outline-none"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Group 4: Account Tenure & Charges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
                <DollarSign className="h-3.5 w-3.5" />
                <span>4. Financials & Offer Parameters</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Tenure (Months)</label>
                  <input
                    type="number"
                    name="tenure"
                    min="0"
                    max="100"
                    value={formData.tenure}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs font-mono font-bold text-white focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Monthly (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    name="MonthlyCharges"
                    min="0"
                    value={formData.MonthlyCharges}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs font-mono font-bold text-white focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Total Charges (₹)</label>
                  <input
                    type="number"
                    step="0.05"
                    name="TotalCharges"
                    min="0"
                    value={formData.TotalCharges}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs font-mono font-bold text-white focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 font-medium">Offer Cost (₹)</label>
                  <input
                    type="number"
                    step="10"
                    name="offer_cost"
                    min="10"
                    value={formData.offer_cost || 200}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs font-mono font-bold text-white focus:border-brand focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand py-3 text-sm font-bold text-white hover:bg-brand-600 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Evaluating Pipeline & Computing ROI...</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>Run Churn Prediction & Calculate ROI</span>
                </>
              )}
            </button>
          </form>

          {/* Prediction Result Display (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {error && <ErrorMessage message={error} />}

            {result ? (
              <div className="rounded-2xl border border-white/10 bg-surface-1 p-6 lg:p-7 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-base font-heading font-extrabold text-white">
                      Prediction Outcome
                    </h4>
                    <p className="text-xs text-slate-400 font-sans">
                      Scored by Logistic Regression Pipeline
                    </p>
                  </div>
                  <RiskBadge risk={result.risk} size="lg" />
                </div>

                {/* Churn Probability Gauge Box */}
                <div className="rounded-xl border border-white/10 bg-surface-2/80 p-5 text-center space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-sans">
                    Estimated Churn Likelihood
                  </span>
                  <div className="text-4xl lg:text-5xl font-heading font-extrabold text-white tabular-nums font-mono">
                    {result.churn_probability_pct}%
                  </div>
                  <p className="text-xs text-slate-300 font-sans">
                    Predicted Classification: <strong className="text-white">{result.churn_label === 'Yes' ? 'High Likelihood of Churn' : 'Likely to Retain'}</strong>
                  </p>

                  <div className="pt-2">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          result.churn_probability >= 0.8
                            ? 'bg-rose-500'
                            : result.churn_probability >= 0.6
                            ? 'bg-amber-500'
                            : result.churn_probability >= 0.3
                            ? 'bg-indigo-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${result.churn_probability_pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Financial ROI Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="rounded-xl border border-white/5 bg-surface-2/60 p-3 space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-sans block font-medium">Customer Value Proxy</span>
                    <p className="text-base font-bold text-white tabular-nums">{formatCurrency(result.customer_value, true)}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-surface-2/60 p-3 space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-sans block font-medium">Expected Value Saved</span>
                    <p className="text-base font-bold text-accent-400 tabular-nums">{formatCurrency(result.expected_value_saved, true)}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-surface-2/60 p-3 space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-sans block font-medium">Retention Offer Cost</span>
                    <p className="text-base font-bold text-slate-300 tabular-nums">{formatCurrency(result.offer_cost, true)}</p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-surface-2/60 p-3 space-y-0.5 flex flex-col justify-between">
                    <span className="text-[11px] text-slate-400 font-sans block font-medium">Projected ROI</span>
                    <div>
                      <ROIBadge roi={result.roi} size="md" />
                    </div>
                  </div>
                </div>

                {/* Prescribed Action */}
                <div className="rounded-xl border border-brand/40 bg-brand/10 p-4 space-y-1">
                  <span className="text-[11px] font-bold text-brand-300 uppercase tracking-wider block font-sans">
                    Prescribed Retention Strategy
                  </span>
                  <p className="text-sm font-heading font-extrabold text-white">
                    {result.recommended_action}
                  </p>
                </div>

                {/* Key Risk Signals */}
                {result.risk_factors && result.risk_factors.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-sans">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      Key Risk Signals
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                      {result.risk_factors.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-surface-1 p-10 text-center shadow-lg space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-brand-400 border border-white/10 shadow-inner">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-base font-heading font-bold text-white">
                  Awaiting Simulation
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
                  Customize the customer attributes on the left or select an interactive scenario preset, then click <strong>Run Churn Prediction</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
