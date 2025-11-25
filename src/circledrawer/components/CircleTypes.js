/**
 * CircleTypes.js - Circle type definitions and utilities
 * 
 * Enhanced with automatic spacer selection from RACI logic.
 */

import { selectSpacerForPipe } from '../utils/spacerSelection';

// Conversion: 96 pixels = 1 inch (standard screen DPI)
export const PX_PER_INCH = 96;

// Circle type definitions
export const CIRCLE_TYPES = {
  CARRIER_OD: 'CARRIER_OD',
  CASING: 'CASING',
  BELL_OD: 'BELL_OD',
  SPACER_OD: 'SPACER_OD'
};

// Default colors for each circle type
export const CIRCLE_COLORS = {
  [CIRCLE_TYPES.CARRIER_OD]: '#3b82f6',  // Blue
  [CIRCLE_TYPES.CASING]: '#1e40af',      // Dark blue
  [CIRCLE_TYPES.BELL_OD]: '#ef4444',     // Red
  [CIRCLE_TYPES.SPACER_OD]: '#16a34a'    // Green
};

// Default settings for each circle type
export const CIRCLE_DEFAULTS = {
  [CIRCLE_TYPES.CARRIER_OD]: {
    diameter: 2,
    minDiameter: 0.25,
    maxDiameter: 100,
    step: 0.25,
    label: 'Carrier OD'
  },
  [CIRCLE_TYPES.CASING]: {
    diameter: 10,
    minDiameter: 1,
    maxDiameter: 100,
    step: 0.5,
    label: 'Casing'
  },
  [CIRCLE_TYPES.BELL_OD]: {
    diameter: 3,
    minDiameter: 0.5,
    maxDiameter: 50,
    step: 0.25,
    label: 'Bell OD'
  },
  [CIRCLE_TYPES.SPACER_OD]: {
    diameter: 1.5,
    minDiameter: 0,
    maxDiameter: 20,
    step: 0.25,
    label: 'Spacer OD'
  }
};

/**
 * Create a new circle with optional auto-spacer selection
 * 
 * @param {number} id - Unique circle ID
 * @param {number} x - X position in pixels
 * @param {number} y - Y position in pixels
 * @param {string} type - Circle type from CIRCLE_TYPES
 * @param {number|null} bellOD - Bell outer diameter in inches (for CARRIER_OD)
 * @param {number|null} spacerOD - Manual spacer OD override (null for auto-select)
 * @param {boolean} autoSelectSpacer - Whether to auto-select spacer from RACI data
 * @returns {Object} Circle data object
 */
export const createCircle = (
  id, 
  x, 
  y, 
  type = CIRCLE_TYPES.CARRIER_OD, 
  bellOD = null, 
  spacerOD = null,
  autoSelectSpacer = true
) => {
  const defaults = CIRCLE_DEFAULTS[type];
  const color = CIRCLE_COLORS[type];
  
  const circle = {
    id,
    x,
    y,
    diameter: defaults.diameter,
    color: color,
    type: type,
    label: defaults.label,
    bellOD: bellOD,
    spacerOD: spacerOD,
    // NEW: Store selected spacer details
    selectedSpacer: null,
    // NEW: Flag for auto vs manual spacer selection
    autoSpacerEnabled: autoSelectSpacer && type === CIRCLE_TYPES.CARRIER_OD,
    // NEW: When true, this carrier ignores bell/spacer collision
    bypassBellSpacer: false
  };
  
  // Auto-select spacer if enabled and this is a carrier
  if (circle.autoSpacerEnabled && !spacerOD) {
    const spacerResult = selectSpacerForPipe({
      carrierOD: circle.diameter,
      bellOD: bellOD || 0
    });
    
    if (spacerResult) {
      circle.spacerOD = spacerResult.spacerOuterDiameter;
      circle.selectedSpacer = spacerResult;
    }
  }
  
  return circle;
};

/**
 * Update a circle's spacer based on its current diameter and bell OD
 * Call this whenever diameter or bellOD changes
 * 
 * @param {Object} circle - The circle object to update
 * @returns {Object} Updated circle with new spacer selection
 */
export const updateCircleSpacer = (circle) => {
  if (circle.type !== CIRCLE_TYPES.CARRIER_OD || !circle.autoSpacerEnabled) {
    return circle;
  }
  
  const spacerResult = selectSpacerForPipe({
    carrierOD: circle.diameter,
    bellOD: circle.bellOD || 0
  });
  
  if (spacerResult) {
    return {
      ...circle,
      spacerOD: spacerResult.spacerOuterDiameter,
      selectedSpacer: spacerResult
    };
  } else {
    return {
      ...circle,
      spacerOD: null,
      selectedSpacer: null
    };
  }
};

/**
 * Set a manual spacer OD (disables auto-selection for this circle)
 * 
 * @param {Object} circle - The circle object
 * @param {number|null} manualSpacerOD - Manual spacer OD or null to re-enable auto
 * @returns {Object} Updated circle
 */
export const setManualSpacerOD = (circle, manualSpacerOD) => {
  if (manualSpacerOD === null || manualSpacerOD === undefined) {
    // Re-enable auto-selection
    return updateCircleSpacer({
      ...circle,
      autoSpacerEnabled: true
    });
  }
  
  return {
    ...circle,
    spacerOD: manualSpacerOD,
    selectedSpacer: null,
    autoSpacerEnabled: false
  };
};

// Get circle display properties
export const getCircleDisplayProps = (circle) => {
  const radiusInPixels = (circle.diameter * PX_PER_INCH) / 2;
  const diameterInPixels = circle.diameter * PX_PER_INCH;
  const defaults = CIRCLE_DEFAULTS[circle.type];
  
  return {
    radiusInPixels,
    diameterInPixels,
    minDiameter: defaults.minDiameter,
    maxDiameter: defaults.maxDiameter,
    step: defaults.step
  };
};

// Get readable type name
export const getCircleTypeName = (type) => {
  return CIRCLE_DEFAULTS[type]?.label || type;
};

/**
 * Convert inches to pixels using PX_PER_INCH
 * @param {number} inches - Value in inches
 * @returns {number} Value in pixels
 */
export const inchesToPixels = (inches) => {
  return inches * PX_PER_INCH;
};

/**
 * Convert pixels to inches using PX_PER_INCH
 * @param {number} pixels - Value in pixels
 * @returns {number} Value in inches
 */
export const pixelsToInches = (pixels) => {
  return pixels / PX_PER_INCH;
};

/**
 * Get the spacer radius in pixels for rendering
 * @param {Object} circle - Circle with spacerOD
 * @returns {number} Spacer radius in pixels (0 if no spacer)
 */
export const getSpacerRadiusPixels = (circle) => {
  if (!circle.spacerOD || circle.spacerOD <= 0) return 0;
  return (circle.spacerOD / 2) * PX_PER_INCH;
};

/**
 * Get the bell radius in pixels for rendering
 * @param {Object} circle - Circle with bellOD
 * @returns {number} Bell radius in pixels (0 if no bell)
 */
export const getBellRadiusPixels = (circle) => {
  if (!circle.bellOD || circle.bellOD <= 0) return 0;
  return (circle.bellOD / 2) * PX_PER_INCH;
};