// ============================================================================
// Dual Range Slider with Editable Inputs
// ============================================================================

export function setupDualRangeWithInputs(config) {
  const {
    minSliderId, maxSliderId, minInputId, maxInputId, trackId,
    rangeMin, rangeMax, step, formatDisplay, parseInput, onChange
  } = config;
  
  const minSlider = document.getElementById(minSliderId);
  const maxSlider = document.getElementById(maxSliderId);
  const minInput = document.getElementById(minInputId);
  const maxInput = document.getElementById(maxInputId);
  const track = document.getElementById(trackId);
  
  let currentMin = rangeMin;
  let currentMax = rangeMax;
  
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }
  
  function updateTrack() {
    const sliderMin = parseFloat(minSlider.min);
    const sliderMax = parseFloat(minSlider.max);
    const leftPct = ((currentMin - sliderMin) / (sliderMax - sliderMin)) * 100;
    const rightPct = ((currentMax - sliderMin) / (sliderMax - sliderMin)) * 100;
    track.style.left = leftPct + '%';
    track.style.width = (rightPct - leftPct) + '%';
  }
  
  function updateDisplay() {
    minInput.value = formatDisplay(currentMin);
    maxInput.value = formatDisplay(currentMax);
    minSlider.value = currentMin;
    maxSlider.value = currentMax;
    updateTrack();
  }
  
  function applyValues(newMin, newMax, triggerChange = true) {
    // Clamp to valid range
    newMin = clamp(newMin, parseFloat(minSlider.min), parseFloat(minSlider.max));
    newMax = clamp(newMax, parseFloat(minSlider.min), parseFloat(minSlider.max));
    
    // Ensure min <= max
    if (newMin > newMax) {
      const temp = newMin;
      newMin = newMax;
      newMax = temp;
    }
    
    currentMin = newMin;
    currentMax = newMax;
    updateDisplay();
    
    if (triggerChange) {
      onChange(currentMin, currentMax);
    }
  }
  
  // Slider events with debouncing
  let sliderTimer;
  minSlider.addEventListener('input', () => {
    let val = parseFloat(minSlider.value);
    if (val > currentMax) val = currentMax;
    currentMin = val;
    updateDisplay();
    clearTimeout(sliderTimer);
    sliderTimer = setTimeout(() => onChange(currentMin, currentMax), 150);
  });
  
  maxSlider.addEventListener('input', () => {
    let val = parseFloat(maxSlider.value);
    if (val < currentMin) val = currentMin;
    currentMax = val;
    updateDisplay();
    clearTimeout(sliderTimer);
    sliderTimer = setTimeout(() => onChange(currentMin, currentMax), 150);
  });
  
  // Input field events
  function handleInputChange(inputEl, isMin) {
    const parsed = parseInput(inputEl.value);
    if (parsed !== null && !isNaN(parsed)) {
      if (isMin) {
        applyValues(parsed, currentMax);
      } else {
        applyValues(currentMin, parsed);
      }
    } else {
      // Invalid input - restore previous value
      updateDisplay();
    }
  }
  
  minInput.addEventListener('blur', () => handleInputChange(minInput, true));
  maxInput.addEventListener('blur', () => handleInputChange(maxInput, false));
  
  minInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputChange(minInput, true);
      minInput.blur();
    }
  });
  
  maxInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputChange(maxInput, false);
      maxInput.blur();
    }
  });
  
  // Select all on focus
  minInput.addEventListener('focus', () => minInput.select());
  maxInput.addEventListener('focus', () => maxInput.select());
  
  return {
    setRange: (min, max, newStep) => {
      minSlider.min = min;
      minSlider.max = max;
      minSlider.step = newStep || step || 1;
      maxSlider.min = min;
      maxSlider.max = max;
      maxSlider.step = newStep || step || 1;
      applyValues(min, max, false);
    },
    set: (min, max) => {
      applyValues(min, max, false);
    },
    get: () => ({ min: currentMin, max: currentMax })
  };
}
