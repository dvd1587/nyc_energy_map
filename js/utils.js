import { METRICS } from './config.js';

// ============================================================================
// Number Parsing and Formatting
// ============================================================================

export function parseNum(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const str = String(val).trim();
  if (str === '' || str.toLowerCase() === 'not available' || str.toLowerCase() === 'n/a') return null;
  const num = parseFloat(str.replace(/,/g, ''));
  return isNaN(num) ? null : num;
}

export function formatNum(n, dec = 0) {
  if (n === null || n === undefined) return 'N/A';
  return n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export function formatYear(n) {
  if (n === null || n === undefined) return 'N/A';
  return String(Math.round(n));
}

// ============================================================================
// Borough Normalization
// ============================================================================

export function normalizeBorough(borough) {
  if (!borough) return 'Unknown';
  const b = borough.trim().toUpperCase();
  
  if (b === 'MANHATTAN' || b === 'MN' || b === 'NEW YORK' || b === 'NY') return 'Manhattan';
  if (b === 'BROOKLYN' || b === 'BK' || b === 'KINGS') return 'Brooklyn';
  if (b === 'QUEENS' || b === 'QN' || b === 'QNS') return 'Queens';
  if (b === 'BRONX' || b === 'THE BRONX' || b === 'BX') return 'Bronx';
  if (b === 'STATEN ISLAND' || b === 'SI' || b === 'RICHMOND' || b === 'STATEN IS' || b === 'STATEN IS.') return 'Staten Island';
  
  return 'Unknown';
}

// ============================================================================
// Color and Value Classification
// ============================================================================

export function getMarkerColor(value, metric) {
  if (value === null || value === undefined) return '#6b7280';
  const m = METRICS[metric];
  if (m.lowerIsBetter) {
    if (value <= m.goodThreshold) return '#10b981';
    if (value >= m.badThreshold) return '#ef4444';
    const ratio = (value - m.goodThreshold) / (m.badThreshold - m.goodThreshold);
    return `rgb(${Math.round(245 + ratio * (234 - 245))},${Math.round(158 - ratio * 70)},${Math.round(11 + ratio)})`;
  } else {
    if (value >= m.goodThreshold) return '#10b981';
    if (value <= m.badThreshold) return '#ef4444';
    const ratio = (value - m.badThreshold) / (m.goodThreshold - m.badThreshold);
    return `rgb(${Math.round(234 + ratio * 11)},${Math.round(88 + ratio * 70)},${Math.round(12 - ratio)})`;
  }
}

export function getValueClass(value, metric) {
  if (value === null || value === undefined) return '';
  const m = METRICS[metric];
  if (m.lowerIsBetter) {
    if (value <= m.goodThreshold) return 'good';
    if (value >= m.badThreshold) return 'danger';
    return 'warning';
  } else {
    if (value >= m.goodThreshold) return 'good';
    if (value <= m.badThreshold) return 'danger';
    return 'warning';
  }
}
