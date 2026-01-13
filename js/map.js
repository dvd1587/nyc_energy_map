import { METRICS } from './config.js';
import { 
  filteredBuildings, currentMetric, map, markersLayer,
  setMap, setMarkersLayer
} from './state.js';
import { formatNum, getMarkerColor, getValueClass } from './utils.js';

// ============================================================================
// Map Initialization
// ============================================================================

export function initMap() {
  const mapInstance = L.map('map', { 
    zoomControl: false,
    preferCanvas: true
  }).setView([40.7128, -74.006], 11);
  
  L.control.zoom({ position: 'bottomleft' }).addTo(mapInstance);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO', 
    maxZoom: 19
  }).addTo(mapInstance);
  
  const markers = L.markerClusterGroup({
    maxClusterRadius: 50, 
    spiderfyOnMaxZoom: true, 
    showCoverageOnHover: false,
    iconCreateFunction: cluster => {
      const count = cluster.getChildCount();
      const size = count > 100 ? 52 : count > 10 ? 44 : 36;
      
      const markers = cluster.getAllChildMarkers();
      const values = markers.map(m => m.metricValue).filter(v => v !== null && v !== undefined);
      const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
      const color = getMarkerColor(avg, currentMetric);
      
      return L.divIcon({
        html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:${count>100?13:11}px;border:3px solid rgba(255,255,255,0.9);box-shadow:0 4px 12px rgba(0,0,0,0.35)">${count}</div>`,
        className: '', 
        iconSize: [size, size]
      });
    }
  });
  
  mapInstance.addLayer(markers);
  
  setMap(mapInstance);
  setMarkersLayer(markers);
}

// ============================================================================
// Map Update
// ============================================================================

export function updateMap() {

//Apply - Busy
  document.body.classList.add('busy');
  
  if (!map || !markersLayer) {
    //Close - Busy
    document.body.classList.remove('busy');
    return;
  }
  markersLayer.clearLayers();
  
  const m = METRICS[currentMetric];
  
  filteredBuildings.forEach(b => {
    const val = b[m.field];
    const color = getMarkerColor(val, currentMetric);
    
    const marker = L.circleMarker([b.lat, b.lng], {
      radius: 7, 
      fillColor: color, 
      color: 'rgba(255,255,255,0.8)', 
      weight: 2, 
      fillOpacity: 0.9
    });
    
    // Store metric value for cluster color calculation
    marker.metricValue = val;
    
    // Lazy popup loading for performance
    marker.on('click', function() {
      this.bindPopup(`<div class="popup">
        <div class="popup-header">
          <div class="popup-title">${b.name}</div>
          <div class="popup-address">${b.address}${b.borough ? ', ' + b.borough : ''}</div>
        </div>
        <div class="popup-grid">
          <div class="popup-item"><div class="popup-item-label">Type</div><div class="popup-item-value">${b.propertyType}</div></div>
          <div class="popup-item"><div class="popup-item-label">Year Built</div><div class="popup-item-value">${b.yearBuilt || 'N/A'}</div></div>
          <div class="popup-item"><div class="popup-item-label">Floor Area</div><div class="popup-item-value">${formatNum(b.floorArea)} ft²</div></div>
          <div class="popup-item"><div class="popup-item-label">Source EUI</div><div class="popup-item-value ${getValueClass(b.sourceEui, 'eui')}">${b.sourceEui ? b.sourceEui.toFixed(1) : 'N/A'}</div></div>
          <div class="popup-item"><div class="popup-item-label">Water Use</div><div class="popup-item-value ${getValueClass(b.wui, 'wui')}">${b.wui ? b.wui.toFixed(1) : 'N/A'}</div></div>
          <div class="popup-item"><div class="popup-item-label">GHG</div><div class="popup-item-value ${getValueClass(b.ghgIntensity, 'ghg')}">${b.ghgIntensity ? b.ghgIntensity.toFixed(2) : 'N/A'}</div></div>
          <div class="popup-item"><div class="popup-item-label">ENERGY STAR®</div><div class="popup-item-value ${getValueClass(b.energyStarScore, 'star')}">${b.energyStarScore || 'N/A'}</div></div>
          <div class="popup-item"><div class="popup-item-label">Report Year</div><div class="popup-item-value">${b.dataYear || 'N/A'}</div></div>
        </div>
      </div>`).openPopup();
    });
    
    markersLayer.addLayer(marker);
  });

//Close - Busy
  document.body.classList.remove('busy');
}

// ============================================================================
// Show Map
// ============================================================================

export function showMap() {
  document.getElementById('loadingScreen').style.display = 'none';
  document.getElementById('map').style.display = 'block';
  document.getElementById('legend').style.display = 'block';
  if (!map) initMap();
}

// ============================================================================
// Fit Map Bounds
// ============================================================================

export function fitMapBounds() {
  if (filteredBuildings.length > 0 && map) {
    const lats = filteredBuildings.map(b => b.lat);
    const lngs = filteredBuildings.map(b => b.lng);
    map.fitBounds([
      [Math.min(...lats) - 0.02, Math.min(...lngs) - 0.02],
      [Math.max(...lats) + 0.02, Math.max(...lngs) + 0.02]
    ]);
  }
}
