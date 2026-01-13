import { API_URL, APP_TOKEN, PAGE_SIZE, SELECT_FIELDS } from './config.js';
import { parseNum, normalizeBorough } from './utils.js';
import { setExcludedCount } from './state.js';

// ============================================================================
// API Fetching
// ============================================================================

export async function fetchPage(pageNumber) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-App-Token': APP_TOKEN
    },
    body: JSON.stringify({
      query: `SELECT ${SELECT_FIELDS}`,
      page: {
        pageNumber: pageNumber,
        pageSize: PAGE_SIZE
      },
      includeSynthetic: false
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const responseText = await response.text();
  
  if (!responseText || responseText.trim() === '') {
    throw new Error('Empty response from API');
  }
  
  return JSON.parse(responseText);
}

export async function fetchAllData() {

  // Busy - start
  document.body.classList.add('busy');
  
  const loadingText = document.getElementById('loadingSubtext');
  
  try {
    let allData = [];
    let pageNumber = 1;
    
    while (true) {
      loadingText.textContent = `Loading page ${pageNumber}... (${allData.length.toLocaleString()} records)`;
      
      const response = await fetchPage(pageNumber);
      
      let pageData = [];
      if (Array.isArray(response)) {
        pageData = response;
      } else if (response && Array.isArray(response.data)) {
        pageData = response.data;
      } else if (response && Array.isArray(response.rows)) {
        pageData = response.rows;
      } else {
        for (const key of Object.keys(response || {})) {
          if (Array.isArray(response[key])) {
            pageData = response[key];
            break;
          }
        }
      }
      
      if (pageData.length === 0) break;
      
      allData = allData.concat(pageData);
      
      if (pageData.length < PAGE_SIZE) break;
      
      pageNumber++;
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    loadingText.textContent = 'Processing data...';
    
    const buildings = transformApiData(allData);
    
    loadingText.textContent = `Loaded ${buildings.length.toLocaleString()} buildings`;

    //Remove Busy - Success
    document.body.classList.remove('busy');
    
    return buildings;
    
  } catch (error) {
    //Remove Busy - Failure
    document.body.classList.remove('busy');
    console.error('API fetch error:', error);
    throw error;
  }
}

// ============================================================================
// Data Transformation
// ============================================================================

export function transformApiData(data) {
  const results = [];
  let noCoords = 0, invalidCoords = 0;
  
  data.forEach((row, i) => {
    const lat = parseNum(row.latitude);
    const lng = parseNum(row.longitude);
    
    if (lat === null || lng === null) { noCoords++; return; }
    if (lat < 40.4 || lat > 41.0 || lng < -74.3 || lng > -73.5) { invalidCoords++; return; }
    
    const gfa = parseNum(row.property_gfa_self_reported) || 
                parseNum(row.property_gfa_calculated);
    
    const waterUse = parseNum(row.water_use_all_water_sources);
    let wui = null;
    if (waterUse !== null && gfa !== null && gfa > 0) {
      wui = (waterUse * 1000) / gfa;
    }
    
    let propType = row.primary_property_type_self || row.largest_property_use_type;
    if (!propType || propType.trim() === '' || propType.toLowerCase() === 'n/a' || propType.toLowerCase() === 'not available') {
      propType = 'Not Specified';
    }
    
    results.push({
      id: row.property_id || `bldg-${i}`,
      name: row.property_name || 'Unknown Building',
      address: row.address_1 || '',
      borough: normalizeBorough(row.borough),
      bbl: row.nyc_borough_block_and_lot || '',
      bin: row.nyc_building_identification || '',
      lat, lng,
      yearBuilt: parseNum(row.year_built),
      propertyType: propType,
      floorArea: gfa,
      siteEui: parseNum(row.site_eui_kbtu_ft),
      sourceEui: parseNum(row.source_eui_kbtu_ft),
      wui: wui,
      ghgIntensity: parseNum(row.total_location_based_ghg_1),
      energyStarScore: parseNum(row.energy_star_score),
      dataYear: row.report_year || ''
    });
  });
  
  setExcludedCount(noCoords + invalidCoords);
  
  return results;
}
