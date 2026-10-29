import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Database,
  Layers,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';

import Header from '../components/Header';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import AssumptionsCard from '../components/AssumptionsCard';
import { getModelMetrics } from '../services/api';
import { formatPercent, formatNumber } from '../utils/formatters';

export default function ModelInfo() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getModelMetrics();
      setMetrics(res);
    } catch (err) {
      setError(err.message || 'Unable to retrieve serialized model telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-darkbg overflow-y-auto">
        <Header
          title="Machine Learning Architecture & Governance"
          subtitle="Extracting pipeline hyperparameters, confusion matrix, and held-out classification metrics..."
        />
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <SkeletonLoader count={4} />
          <SkeletonLoader count={4} />
          <SkeletonLoader type="chart" />
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-darkbg">
        <Header title="Model Information" subtitle="System Diagnostics" />
        <div className="mt-8 max-w-xl mx-auto w-full">
          <ErrorMessage message={error || 'Model telemetry unavailable.'} onRetry={fetchMetrics} />
        </div>
      </div>
    );
  }

  const cm = metrics.confusion_matrix || { tn: 925, fp: 110, fn: 162, tp: 212 };
  const totalTest = cm.tn + cm.fp + cm.fn + cm.tp;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-darkbg">
      <Header
        title="Model Architecture & Machine Learning Transparency"
        subtitle="Full architecture disclosure, confusion matrix, classification tradeoffs, and business boundaries"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Core Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-surface-1 p-5 shadow-lg space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-sans">
              Pipeline Estimator
            </span>
            <p className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-brand-400" />
              <span>{metrics.model_name}</span>
            </p>
            <p className="text-xs text-slate-400 font-mono">max_iter=1000, StandardScaler</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface-1 p-5 shadow-lg space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-sans">
              Reference Dataset
            </span>
            <p className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-accent-400" />
              <span>{metrics.dataset_name}</span>
            </p>
            <p className="text-xs text-slate-400 font-mono">{formatNumber(metrics.total_customers)} customer accounts</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface-1 p-5 shadow-lg space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-sans">
              Feature Dimensions
            </span>
            <p className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              <span>{metrics.feature_count} Raw Features</span>
            </p>
            <p className="text-xs text-slate-400 font-mono">OneHotEncoded (drop='first')</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-surface-1 p-5 shadow-lg space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-sans">
              Held-Out Split
            </span>
            <p className="text-xl font-heading font-extrabold text-white">
              80% Train / 20% Test
            </p>
            <p className="text-xs text-slate-400 font-mono">{formatNumber(metrics.test_customers)} validation customers</p>
          </div>
        </div>

        {/* Evaluation Metrics Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
              Held-Out Validation Scores
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Evaluated on {formatNumber(metrics.test_customers)} test samples
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-brand/30 bg-surface-1 p-5 text-center shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-sans font-medium">Model Accuracy</span>
              <p className="text-3xl lg:text-4xl font-heading font-extrabold text-white tabular-nums font-mono">
                {formatPercent(metrics.accuracy, true, 1)}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Benchmark: 80.7%</span>
            </div>

            <div className="rounded-xl border border-brand/30 bg-surface-1 p-5 text-center shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-sans font-medium">Precision (Churn=1)</span>
              <p className="text-3xl lg:text-4xl font-heading font-extrabold text-brand-400 tabular-nums font-mono">
                {formatPercent(metrics.precision, true, 1)}
              </p>
              <span className="text-[10px] text-slate-400 font-sans">Accuracy of predicted churners</span>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-surface-1 p-5 text-center shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-sans font-medium">Recall (Sensitivity)</span>
              <p className="text-3xl lg:text-4xl font-heading font-extrabold text-amber-400 tabular-nums font-mono">
                {formatPercent(metrics.recall, true, 1)}
              </p>
              <span className="text-[10px] text-slate-400 font-sans">Captured real churners</span>
            </div>

            <div className="rounded-xl border border-indigo-500/30 bg-surface-1 p-5 text-center shadow-lg space-y-1">
              <span className="text-xs text-slate-400 font-sans font-medium">F1 Score (Balanced)</span>
              <p className="text-3xl lg:text-4xl font-heading font-extrabold text-indigo-400 tabular-nums font-mono">
                {formatPercent(metrics.f1_score, true, 1)}
              </p>
              <span className="text-[10px] text-slate-400 font-sans">Harmonic precision-recall mean</span>
            </div>
          </div>
        </div>

        {/* Business Critical Insight Callout */}
        <div className="rounded-2xl border border-brand/40 bg-gradient-to-r from-brand/15 via-surface-2 to-surface-1 p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-4 relative z-10">
            <div className="rounded-xl bg-brand/20 p-2.5 text-brand-400 shrink-0 border border-brand/30 shadow-inner">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-heading font-extrabold text-white">
                Why Accuracy Alone Is Not Sufficient for Churn Prediction
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-4xl">
                {metrics.business_context || (
                  "Accuracy alone is not sufficient for evaluating churn prediction because the business objective is to identify customers who may churn and prioritize useful retention actions. In a dataset where 73% of customers do not churn, a naive model that always predicts 'No Churn' would achieve 73% accuracy while offering zero retention value. RetainAI prioritizes Recall and Expected Return on Investment (ROI) to save maximum revenue."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Confusion Matrix Interactive Breakdown */}
        <section aria-labelledby="confusion-matrix-heading" className="rounded-2xl border border-white/10 bg-surface-1 p-6 lg:p-7 shadow-xl space-y-6">
          <div>
            <h4 id="confusion-matrix-heading" className="text-base font-heading font-bold text-white">
              Held-Out Test Confusion Matrix ({formatNumber(totalTest)} Customers)
            </h4>
            <p className="text-xs text-slate-400 font-sans">
              Comparing model predicted classifications against verified ground-truth customer retention outcomes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 2x2 Matrix */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4 text-center">
                {/* True Negative */}
                <div className="rounded-2xl border border-emerald-500/30 bg-surface-2 p-5 space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
                    True Negative (TN)
                  </span>
                  <p className="text-3xl font-heading font-extrabold text-white tabular-nums font-mono">{cm.tn}</p>
                  <p className="text-xs text-slate-300 font-semibold">Correctly Predicted Retained</p>
                  <p className="text-[11px] text-slate-500 font-sans">Zero offer budget wasted</p>
                </div>

                {/* False Positive */}
                <div className="rounded-2xl border border-amber-500/30 bg-surface-2 p-5 space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block font-mono">
                    False Positive (FP)
                  </span>
                  <p className="text-3xl font-heading font-extrabold text-white tabular-nums font-mono">{cm.fp}</p>
                  <p className="text-xs text-slate-300 font-semibold">False Alarm</p>
                  <p className="text-[11px] text-slate-500 font-sans">Unnecessary offer incentive proposed</p>
                </div>

                {/* False Negative */}
                <div className="rounded-2xl border border-rose-500/30 bg-surface-2 p-5 space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block font-mono">
                    False Negative (FN)
                  </span>
                  <p className="text-3xl font-heading font-extrabold text-white tabular-nums font-mono">{cm.fn}</p>
                  <p className="text-xs text-slate-300 font-semibold">Missed Churner</p>
                  <p className="text-[11px] text-slate-500 font-sans">Customer departed unaddressed</p>
                </div>

                {/* True Positive */}
                <div className="rounded-2xl border border-brand/40 bg-surface-2 p-5 space-y-1 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 block font-mono">
                    True Positive (TP)
                  </span>
                  <p className="text-3xl font-heading font-extrabold text-white tabular-nums font-mono">{cm.tp}</p>
                  <p className="text-xs text-slate-300 font-semibold">Correctly Flagged Churner</p>
                  <p className="text-[11px] text-slate-500 font-sans">Actionable retention opportunity</p>
                </div>
              </div>
            </div>

            {/* Business Cost Impact Explanation */}
            <div className="lg:col-span-5 space-y-3.5 text-xs text-slate-300 font-sans">
              <div className="rounded-xl border border-white/5 bg-surface-2 p-4 space-y-1">
                <span className="font-heading font-bold text-white text-sm block">
                  High Specificity (89.4%)
                </span>
                <p className="text-slate-400 leading-relaxed">
                  The model leaves 925 retained customers undisturbed, avoiding margin dilution and unnecessary promotional discounting.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-surface-2 p-4 space-y-1">
                <span className="font-heading font-bold text-white text-sm block">
                  Actionable Recall (56.7%)
                </span>
                <p className="text-slate-400 leading-relaxed">
                  The model isolates 212 out of 374 churners on the held-out split, allowing retention teams to proactively intervene before contract expiration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Model Limitations */}
        <section aria-labelledby="limitations-heading" className="rounded-2xl border border-white/10 bg-surface-1 p-6 lg:p-7 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-brand-400" />
            <h4 id="limitations-heading" className="text-base font-heading font-bold text-white">
              Model Limitations & Boundary Disclosure
            </h4>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300 font-sans list-none">
            {(metrics.limitations || []).map((lim, i) => (
              <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Assumptions Card */}
        <AssumptionsCard />
      </div>
    </div>
  );
}
