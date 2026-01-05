// ============================================================================
// Global State
// ============================================================================

// Data
export let allBuildings = [];
export let filteredBuildings = [];
export let excludedCount = 0;

// Map
export let map = null;
export let markersLayer = null;

// UI State
export let currentMetric = 'eui';
export let allPropertyTypes = [];
export let selectAllActive = true;
export let availableYears = [];
export let defaultYear = '2024';

// Sliders
export let sliders = {};

// Data Ranges
export let dataRanges = { 
  yearBuilt: { min: 1700, max: 2025 }, 
  floorArea: { min: 0, max: 15000000 } 
};

// Filters
export let filters = {
  borough: '', 
  year: '2024',
  yearBuiltMin: 1700, 
  yearBuiltMax: 2025,
  floorAreaMin: 0, 
  floorAreaMax: 15000000,
  starMin: 1, 
  starMax: 100,
  energyStarOnly: false, 
  search: '', 
  selectedTypes: []
};

// ============================================================================
// State Setters (needed because we can't directly reassign imported variables)
// ============================================================================

export function setAllBuildings(buildings) {
  allBuildings = buildings;
}

export function setFilteredBuildings(buildings) {
  filteredBuildings = buildings;
}

export function setExcludedCount(count) {
  excludedCount = count;
}

export function setMap(mapInstance) {
  map = mapInstance;
}

export function setMarkersLayer(layer) {
  markersLayer = layer;
}

export function setCurrentMetric(metric) {
  currentMetric = metric;
}

export function setAllPropertyTypes(types) {
  allPropertyTypes = types;
}

export function setSelectAllActive(active) {
  selectAllActive = active;
}

export function setAvailableYears(years) {
  availableYears = years;
}

export function setDefaultYear(year) {
  defaultYear = year;
}

export function setSliders(sliderObj) {
  sliders = sliderObj;
}

export function setDataRanges(ranges) {
  dataRanges = ranges;
}

export function setFilters(newFilters) {
  filters = { ...filters, ...newFilters };
}

export function resetFiltersState() {
  filters = {
    borough: '', 
    year: defaultYear,
    yearBuiltMin: dataRanges.yearBuilt.min, 
    yearBuiltMax: dataRanges.yearBuilt.max,
    floorAreaMin: dataRanges.floorArea.min, 
    floorAreaMax: dataRanges.floorArea.max,
    starMin: 1, 
    starMax: 100,
    energyStarOnly: false, 
    search: '', 
    selectedTypes: []
  };
  selectAllActive = true;
}
