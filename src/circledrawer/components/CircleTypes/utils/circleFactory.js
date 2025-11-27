/**
 * circleFactory.js - Circle creation and spacer management utilities
 */

import { selectSpacerForPipe } from '../../../utils/spacerSelection';
import { CIRCLE_TYPES, CIRCLE_COLORS, CIRCLE_DEFAULTS } from '../constants';

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
    bypassBellSpacer: false,
    // NEW: When true, exclude this circle from effective OD calculation
    excludeFromEffectiveOD: false,
    spacerRotation: 0
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