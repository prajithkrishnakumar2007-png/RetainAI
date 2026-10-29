/**
 * RetainAI Centralized Formatting Utilities
 * Standardized across the entire application using Indian locale (en-IN).
 */

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const currencyDecimalFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

/**
 * Format currency without decimals by default, or with decimals if requested.
 * Example: 2895782 -> "₹28,95,782"
 */
export function formatCurrency(value, decimals = false) {
  if (value === null || value === undefined || isNaN(value)) return '₹0';
  const num = Number(value);
  return decimals ? currencyDecimalFormatter.format(num) : currencyFormatter.format(num);
}

/**
 * Format compact currency for badges or quick KPI tags.
 * Example: 2895782 -> "₹28.96 L" or "₹2.9M"
 */
export function formatCompactCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '₹0';
  const num = Number(value);
  if (Math.abs(num) >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  if (Math.abs(num) >= 1000) {
    return `₹${(num / 1000).toFixed(1)}k`;
  }
  return `₹${num.toFixed(0)}`;
}

/**
 * Format percentages with controlled precision.
 * Example: 0.4749 -> "47.5%" or 47.49 -> "47.5%"
 */
export function formatPercent(value, isDecimal = false, precision = 1) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  const num = isDecimal ? Number(value) * 100 : Number(value);
  return `${num.toFixed(precision)}%`;
}

/**
 * Format standard integers or counts.
 * Example: 7043 -> "7,043"
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return numberFormatter.format(Number(value));
}

/**
 * Format decimal numbers.
 * Example: 70.354 -> "70.35"
 */
export function formatDecimal(value, precision = 2) {
  if (value === null || value === undefined || isNaN(value)) return '0.00';
  if (precision === 2) return decimalFormatter.format(Number(value));
  return Number(value).toFixed(precision);
}
