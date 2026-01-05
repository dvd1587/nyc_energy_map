import { 
  allBuildings, filters, selectAllActive, defaultYear, dataRanges,
  setFilteredBuildings, setFilters, setSelectAllActive, resetFiltersState
} from './state.js';
import { updateStats, updatePropertyTypes } from './ui.js';
import { updateMap } from './map.js';

// ============================================================================
// Filter Application
// ============================================================================

export function applyFilters() {
  // First filter by year (required)
  let baseData = allBuildings.filter(b => b.dataYear == filters.year);
  
  const filtered = baseData.filter(b => {
    if (filters.borough && b.borough !== filters.borough) return false;
    
    if (b.yearBuilt !== null) {
      if (b.yearBuilt < filters.yearBuiltMin || b.yearBuilt > filters.yearBuiltMax) return false;
    }
    
    if (b.floorArea !== null) {
      if (b.floorArea < filters.floorAreaMin || b.floorArea > filters.floorAreaMax) return false;
    }
    
    if (b.energyStarScore !== null) {
      if (b.energyStarScore < filters.starMin || b.energyStarScore > filters.starMax) return false;
    }
    
    if (filters.energyStarOnly && b.energyStarScore === null) return false;
    
    if (!selectAllActive && (filters.selectedTypes.length === 0 || !filters.selectedTypes.includes(b.propertyType))) return false;
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const text = [b.name, b.address, b.bbl].filter(Boolean).join(' ').toLowerCase();
      if (!text.includes(q)) return false;
    }
    
    return true;
  });
  
  setFilteredBuildings(filtered);
  
  updateStats();
  updatePropertyTypes();
  updateMap();
}

// ============================================================================
// Filter Reset
// ============================================================================

export function resetFilters(sliders) {
  resetFiltersState();
  
  document.querySelectorAll('#boroughFilter .checkbox-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('#boroughFilter .checkbox-btn[data-borough=""]').classList.add('active');
  document.getElementById('yearFilter').value = defaultYear;
  document.getElementById('searchInput').value = '';
  document.getElementById('energyStarToggle').classList.remove('active');
  
  sliders.yearBuilt.setRange(dataRanges.yearBuilt.min, dataRanges.yearBuilt.max, 1);
  sliders.floorArea.setRange(dataRanges.floorArea.min, dataRanges.floorArea.max, 10000);
  sliders.star.setRange(1, 100, 1);
  
  applyFilters();
}

// ============================================================================
// Property Type Toggles
// ============================================================================

export function toggleSelectAll() {
  const newSelectAllActive = !selectAllActive;
  setSelectAllActive(newSelectAllActive);
  if (newSelectAllActive) {
    setFilters({ selectedTypes: [] });
  }
  applyFilters();
}

export function togglePropertyType(type) {
  if (selectAllActive) {
    setSelectAllActive(false);
    setFilters({ selectedTypes: [type] });
  } else {
    const selectedTypes = [...filters.selectedTypes];
    const idx = selectedTypes.indexOf(type);
    if (idx >= 0) {
      selectedTypes.splice(idx, 1);
      if (selectedTypes.length === 0) {
        setSelectAllActive(true);
      }
    } else {
      selectedTypes.push(type);
    }
    setFilters({ selectedTypes });
  }
  applyFilters();
}

// Make toggle functions globally available for onclick handlers
window.toggleSelectAll = toggleSelectAll;
window.togglePropertyType = togglePropertyType;
