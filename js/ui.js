import { METRICS } from './config.js';
import { 
  allBuildings, filteredBuildings, excludedCount, filters, selectAllActive,
  availableYears, defaultYear, currentMetric,
  setAvailableYears, setDefaultYear, setFilters, setDataRanges, setAllPropertyTypes,
  dataRanges
} from './state.js';
import { formatNum, getValueClass } from './utils.js';

// ============================================================================
// Statistics Update
// ============================================================================

export function updateStats() {
  const withEui = filteredBuildings.filter(b => b.sourceEui !== null && b.sourceEui > 0 && b.sourceEui < 10000);
  const withWui = filteredBuildings.filter(b => b.wui !== null && b.wui > 0 && b.wui < 1000);
  const withGhg = filteredBuildings.filter(b => b.ghgIntensity !== null && b.ghgIntensity > 0 && b.ghgIntensity < 100);
  const withStar = filteredBuildings.filter(b => b.energyStarScore !== null && b.energyStarScore >= 1 && b.energyStarScore <= 100);
  
  const avgEui = withEui.length > 0 ? withEui.reduce((s, b) => s + b.sourceEui, 0) / withEui.length : null;
  const avgWui = withWui.length > 0 ? withWui.reduce((s, b) => s + b.wui, 0) / withWui.length : null;
  const avgGhg = withGhg.length > 0 ? withGhg.reduce((s, b) => s + b.ghgIntensity, 0) / withGhg.length : null;
  const avgStar = withStar.length > 0 ? withStar.reduce((s, b) => s + b.energyStarScore, 0) / withStar.length : null;
  
  const euiEl = document.getElementById('avgEui');
  euiEl.textContent = avgEui ? avgEui.toFixed(0) : '--';
  euiEl.className = 'stat-value';
  if (avgEui !== null) euiEl.classList.add(getValueClass(avgEui, 'eui'));
  document.getElementById('euiSample').textContent = `n=${withEui.length.toLocaleString()}`;
  
  const wuiEl = document.getElementById('avgWui');
  wuiEl.textContent = avgWui ? avgWui.toFixed(1) : '--';
  wuiEl.className = 'stat-value';
  if (avgWui !== null) wuiEl.classList.add(getValueClass(avgWui, 'wui'));
  document.getElementById('wuiSample').textContent = `n=${withWui.length.toLocaleString()}`;
  
  const ghgEl = document.getElementById('avgGhg');
  ghgEl.textContent = avgGhg ? avgGhg.toFixed(1) : '--';
  ghgEl.className = 'stat-value';
  if (avgGhg !== null) ghgEl.classList.add(getValueClass(avgGhg, 'ghg'));
  document.getElementById('ghgSample').textContent = `n=${withGhg.length.toLocaleString()}`;
  
  const starEl = document.getElementById('avgStar');
  starEl.textContent = avgStar ? avgStar.toFixed(0) : '--';
  starEl.className = 'stat-value';
  if (avgStar !== null) starEl.classList.add(getValueClass(avgStar, 'star'));
  document.getElementById('starSample').textContent = `n=${withStar.length.toLocaleString()}`;
  
  const yearTotal = allBuildings.filter(b => b.dataYear == filters.year).length;
  document.getElementById('filteredCount').textContent = formatNum(filteredBuildings.length);
  document.getElementById('totalCount').textContent = formatNum(yearTotal);
  
  if (excludedCount > 0) {
    document.getElementById('footerNote').textContent = `${excludedCount.toLocaleString()} records excluded (missing/invalid coordinates)`;
  }
}

// ============================================================================
// Year Dropdown
// ============================================================================

export function updateYearDropdown() {
  const years = [...new Set(allBuildings.map(b => b.dataYear).filter(Boolean))].sort((a, b) => b - a);
  setAvailableYears(years);
  
  if (years.length > 0) {
    setDefaultYear(years[0]);
    setFilters({ year: years[0] });
  }
  
  const select = document.getElementById('yearFilter');
  select.innerHTML = years.map(y => `<option value="${y}"${y === years[0] ? ' selected' : ''}>${y}</option>`).join('');
}

// ============================================================================
// Property Types
// ============================================================================

export function updatePropertyTypes() {
  // Count from year-filtered data (before other filters) so all types remain visible
  const yearData = allBuildings.filter(b => b.dataYear == filters.year);
  const counts = {};
  yearData.forEach(b => { 
    const type = b.propertyType || 'Not Specified';
    counts[type] = (counts[type] || 0) + 1; 
  });
  
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top20 = sorted.slice(0, 20);
  const otherTypes = sorted.slice(20);
  const otherCount = otherTypes.reduce((sum, [, count]) => sum + count, 0);
  
  const checkIcon = `<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor"/></svg>`;
  
  let html = `<div class="select-all-row" onclick="toggleSelectAll()">
    <div class="property-checkbox ${selectAllActive ? 'checked' : ''}">${checkIcon}</div>
    <span class="property-type-name">Select All</span>
    <span class="property-type-count">${yearData.length.toLocaleString()}</span>
  </div>`;
  
  html += top20.map(([type, count]) => {
    const isChecked = selectAllActive || filters.selectedTypes.includes(type);
    const safeType = type.replace(/'/g, "\\'").replace(/"/g, '\\"');
    return `<div class="property-type-row" onclick="togglePropertyType('${safeType}')">
      <div class="property-checkbox ${isChecked ? 'checked' : ''}" ${selectAllActive ? 'style="opacity:0.5"' : ''}>${checkIcon}</div>
      <span class="property-type-name" title="${type}">${type}</span>
      <span class="property-type-count">${count.toLocaleString()}</span>
    </div>`;
  }).join('');
  
  if (otherCount > 0) {
    html += `<div class="other-types-row">+ ${otherTypes.length} other types (${otherCount.toLocaleString()} buildings)</div>`;
  }
  
  document.getElementById('propertyTypes').innerHTML = html;
}

// ============================================================================
// Legend
// ============================================================================

export function updateLegend() {
  const m = METRICS[currentMetric];
  document.getElementById('legendTitle').textContent = m.label;
  const gradient = document.getElementById('legendGradient');
  if (currentMetric === 'star') {
    gradient.className = 'legend-gradient star';
    document.getElementById('legendLowLabel').textContent = 'Poor';
    document.getElementById('legendHighLabel').textContent = 'Good';
  } else {
    gradient.className = 'legend-gradient';
    document.getElementById('legendLowLabel').textContent = 'Good';
    document.getElementById('legendHighLabel').textContent = 'Poor';
  }
}

// ============================================================================
// Data Ranges Calculation
// ============================================================================

export function calculateDataRanges() {
  const yearBuilts = allBuildings.map(b => b.yearBuilt).filter(v => v !== null);
  const floorAreas = allBuildings.map(b => b.floorArea).filter(v => v !== null && v >= 0);
  
  const newRanges = { ...dataRanges };
  
  if (yearBuilts.length > 0) {
    newRanges.yearBuilt = { 
      min: Math.min(...yearBuilts), 
      max: Math.max(...yearBuilts) 
    };
  }
  if (floorAreas.length > 0) {
    newRanges.floorArea = { 
      min: 0,
      max: Math.ceil(Math.max(...floorAreas) / 1000000) * 1000000 
    };
  }
  
  setDataRanges(newRanges);
  
  const types = [...new Set(allBuildings.map(b => b.propertyType).filter(Boolean))].sort();
  setAllPropertyTypes(types);
}

// ============================================================================
// Error Display
// ============================================================================

export function showError(message, details = '') {
  document.getElementById('loadingScreen').innerHTML = `
    <div class="error-icon">
      <svg width="40" height="40" fill="none" stroke="#ef4444" stroke-width="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
      </svg>
    </div>
    <div class="error-title">Error Loading Data</div>
    <div class="error-text">${message}</div>
    ${details ? `<div class="error-details">${details}</div>` : ''}
    <button class="btn btn-primary" style="margin-top:20px;max-width:200px" onclick="location.reload()">Retry</button>
  `;
}
