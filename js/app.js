import { 
  allBuildings, filteredBuildings, filters, defaultYear, dataRanges, sliders,
  setAllBuildings, setFilteredBuildings, setFilters, setCurrentMetric, setSliders
} from './state.js';
import { fetchAllData } from './api.js';
import { setupDualRangeWithInputs } from './sliders.js';
import { applyFilters, resetFilters } from './filters.js';
import { updateStats, updateYearDropdown, updatePropertyTypes, updateLegend, calculateDataRanges, showError } from './ui.js';
import { initMap, updateMap, showMap, fitMapBounds } from './map.js';

// ============================================================================
// Slider Initialization
// ============================================================================

function initSliders() {
  const yearBuiltSlider = setupDualRangeWithInputs({
    minSliderId: 'yearBuiltMin',
    maxSliderId: 'yearBuiltMax',
    minInputId: 'yearBuiltMinInput',
    maxInputId: 'yearBuiltMaxInput',
    trackId: 'yearBuiltTrack',
    rangeMin: 1800,
    rangeMax: 2025,
    step: 1,
    formatDisplay: (val) => Math.round(val).toString(),
    parseInput: (val) => {
      const num = parseInt(val.replace(/,/g, ''), 10);
      return isNaN(num) ? null : num;
    },
    onChange: (min, max) => {
      setFilters({ yearBuiltMin: min, yearBuiltMax: max });
      applyFilters();
    }
  });
  
  const floorAreaSlider = setupDualRangeWithInputs({
    minSliderId: 'floorAreaMin',
    maxSliderId: 'floorAreaMax',
    minInputId: 'floorAreaMinInput',
    maxInputId: 'floorAreaMaxInput',
    trackId: 'floorAreaTrack',
    rangeMin: 0,
    rangeMax: 15000000,
    step: 10000,
    formatDisplay: (val) => Math.round(val).toLocaleString(),
    parseInput: (val) => {
      const num = parseInt(val.replace(/,/g, ''), 10);
      return isNaN(num) ? null : num;
    },
    onChange: (min, max) => {
      setFilters({ floorAreaMin: min, floorAreaMax: max });
      applyFilters();
    }
  });
  
  const starSlider = setupDualRangeWithInputs({
    minSliderId: 'starMin',
    maxSliderId: 'starMax',
    minInputId: 'starMinInput',
    maxInputId: 'starMaxInput',
    trackId: 'starTrack',
    rangeMin: 1,
    rangeMax: 100,
    step: 1,
    formatDisplay: (val) => Math.round(val).toString(),
    parseInput: (val) => {
      const num = parseInt(val.replace(/,/g, ''), 10);
      return isNaN(num) ? null : num;
    },
    onChange: (min, max) => {
      setFilters({ starMin: min, starMax: max });
      applyFilters();
    }
  });
  
  setSliders({ yearBuilt: yearBuiltSlider, floorArea: floorAreaSlider, star: starSlider });
  
  return { yearBuilt: yearBuiltSlider, floorArea: floorAreaSlider, star: starSlider };
}

// ============================================================================
// UI Event Listeners
// ============================================================================

function initUI(sliderInstances) {
  // Borough filter
  document.getElementById('boroughFilter').addEventListener('click', e => {
    if (e.target.classList.contains('checkbox-btn')) {
      document.querySelectorAll('#boroughFilter .checkbox-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      setFilters({ borough: e.target.dataset.borough });
      applyFilters();
    }
  });
  
  // Metric tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      setCurrentMetric(tab.dataset.metric);
      updateLegend();
      updateMap();
    });
  });
  
  // Year filter
  document.getElementById('yearFilter').addEventListener('change', e => { 
    setFilters({ year: e.target.value });
    applyFilters(); 
  });
  
  // ENERGY STAR toggle
  document.getElementById('energyStarToggle').addEventListener('click', function() {
    this.classList.toggle('active');
    setFilters({ energyStarOnly: this.classList.contains('active') });
    applyFilters();
  });
  
  // Search
  let searchTimer;
  document.getElementById('searchInput').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { 
      setFilters({ search: e.target.value });
      applyFilters(); 
    }, 300);
  });
  
  // Reset button
  document.getElementById('resetBtn').addEventListener('click', () => resetFilters(sliderInstances));
  
  // Download button
  document.getElementById('downloadBtn').addEventListener('click', downloadCSV);
  
  // Mobile sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    sidebarToggle.style.display = 'none';
  });
  
  // Close sidebar when tapping on map area (mobile only)
  document.querySelector('.map-area').addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.add('collapsed');
      sidebarToggle.style.display = 'flex';
    }
  });
  
  // Auto-collapse on mobile
  if (window.innerWidth <= 768) {
    sidebar.classList.add('collapsed');
  }
  
  // Handle resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('collapsed');
    } else {
      sidebar.classList.add('collapsed');
    }
  });
}

// ============================================================================
// Update Sliders from Data
// ============================================================================

function updateSlidersFromData(sliderInstances) {
  sliderInstances.yearBuilt.setRange(dataRanges.yearBuilt.min, dataRanges.yearBuilt.max, 1);
  setFilters({ yearBuiltMin: dataRanges.yearBuilt.min, yearBuiltMax: dataRanges.yearBuilt.max });
  
  sliderInstances.floorArea.setRange(dataRanges.floorArea.min, dataRanges.floorArea.max, 10000);
  setFilters({ floorAreaMin: dataRanges.floorArea.min, floorAreaMax: dataRanges.floorArea.max });
  
  sliderInstances.star.setRange(1, 100, 1);
  setFilters({ starMin: 1, starMax: 100 });
}

// ============================================================================
// CSV Download
// ============================================================================

function downloadCSV() {

  //Apply - Busy
  document.body.classList.add('busy');
  
  if (filteredBuildings.length === 0) return;
  
  const headers = ['Name','Address','Borough','BBL','Type','Year Built','Floor Area','Site EUI','Source EUI','WUI','GHG Intensity','ENERGY STAR Rating','Report Year','Lat','Lng'];
  const rows = filteredBuildings.map(b => [
    b.name, b.address, b.borough, b.bbl, b.propertyType, b.yearBuilt, b.floorArea,
    b.siteEui?.toFixed(1), b.sourceEui?.toFixed(1), b.wui?.toFixed(2),
    b.ghgIntensity?.toFixed(2), b.energyStarScore, b.dataYear, b.lat, b.lng
  ]);
  
  const csv = [headers, ...rows].map(r => r.map(c => `"${c ?? ''}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nyc_building_energy_${filters.year}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);

//Close - Busy
  document.body.classList.remove('busy');
}

// ============================================================================
// Main Initialization
// ============================================================================

async function init() {
  const sliderInstances = initSliders();
  initUI(sliderInstances);
  
  try {
    const buildings = await fetchAllData();
    setAllBuildings(buildings);
    
    if (buildings.length === 0) {
      showError('No building data was returned.', 'The API returned data but no valid buildings with coordinates were found.');
      return;
    }
    
    updateYearDropdown();
    calculateDataRanges();
    
    const filtered = buildings.filter(b => b.dataYear == defaultYear);
    setFilteredBuildings(filtered);
    
    showMap();
    updateSlidersFromData(sliderInstances);
    updateStats();
    updatePropertyTypes();
    updateLegend();
    updateMap();
    fitMapBounds();
    
  } catch (error) {
    console.error('Init error:', error);
    showError('Failed to load data from NYC Open Data API.', error.message);
  }
}

// ============================================================================
// Start Application
// ============================================================================

document.addEventListener('DOMContentLoaded', init);
