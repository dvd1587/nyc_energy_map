// ============================================================================
// API Configuration
// ============================================================================
export const API_URL = 'https://data.cityofnewyork.us/api/v3/views/5zyy-y8am/query.json';
export const APP_TOKEN = '5U3PdX83pjEizBSCi3g28npTj';
export const PAGE_SIZE = 25000;

export const SELECT_FIELDS = [
  'property_id', 'property_name', 'address_1', 'borough',
  'nyc_borough_block_and_lot', 'nyc_building_identification',
  'latitude', 'longitude', 'year_built',
  'primary_property_type_self', 'largest_property_use_type',
  'property_gfa_self_reported', 'property_gfa_calculated',
  'site_eui_kbtu_ft', 'source_eui_kbtu_ft',
  'energy_star_score', 'total_location_based_ghg_1',
  'water_use_all_water_sources', 'report_year'
].join(', ');

// ============================================================================
// Metrics Configuration
// ============================================================================
export const METRICS = {
  eui: { 
    label: 'Source EUI (kBtu/ft²)', 
    field: 'sourceEui', 
    unit: 'kBtu/ft²', 
    goodThreshold: 100, 
    badThreshold: 200, 
    lowerIsBetter: true 
  },
  wui: { 
    label: 'Water Use Intensity (gal/ft²)', 
    field: 'wui', 
    unit: 'gal/ft²', 
    goodThreshold: 30, 
    badThreshold: 80, 
    lowerIsBetter: true 
  },
  ghg: { 
    label: 'GHG Intensity (kgCO₂e/ft²)', 
    field: 'ghgIntensity', 
    unit: 'kgCO₂e/ft²', 
    goodThreshold: 5, 
    badThreshold: 10, 
    lowerIsBetter: true 
  },
  star: { 
    label: 'ENERGY STAR® Rating (1-100)', 
    field: 'energyStarScore', 
    unit: '1-100', 
    goodThreshold: 75, 
    badThreshold: 50, 
    lowerIsBetter: false 
  }
};
