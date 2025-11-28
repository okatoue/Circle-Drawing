/**
 * Spacer Selection Utility for CircleDrawing
 * 
 * This module provides spacer selection logic mirrored from the RACI app.
 * It selects the appropriate spacer for a carrier pipe based on:
 * 1. Carrier OD must be within the spacer's supported range
 * 2. Spacer OD must clear the bell OD (if present)
 * 
 * Key Formula: spacerOD = carrierOD + (runnerHeight * 2)
 */

import spacerData from './spacerData.json';

// ============================================================
// CORE SELECTION FUNCTION
// ============================================================

/**
 * Select the best spacer for a given carrier pipe.
 * 
 * Rules (simplified from RACI for individual carrier in CircleDrawing):
 * 1. Carrier OD must be within one of the spacer's carrierODRanges
 * 2. If bellOD > 0, the spacer OD must be >= bellOD (i.e., bellClearance >= 0)
 * 
 * The function returns the spacer with the smallest runner height that fits,
 * giving the tightest fit (same logic as RACI's sorting preference).
 * 
 * @param {Object} pipe - { carrierOD: number, bellOD: number }
 * @returns {Object|null} SpacerSelection or null if none fits
 * 
 * @example
 * const result = selectSpacerForPipe({ carrierOD: 4.5, bellOD: 5.2 });
 * // Returns: { spacerId: 6, spacerName: "F/G 25", runnerHeight: 0.98, spacerOuterDiameter: 6.46, bellClearance: 0.63 }
 */
export function selectSpacerForPipe(pipe) {
  const { carrierOD, bellOD } = pipe;
  
  if (!carrierOD || carrierOD <= 0) {
    return null;
  }
  
  const numBellOD = bellOD || 0;
  
  // Filter spacers that fit this carrier OD and clear the bell
  const validSpacers = spacerData.filter((spacer) => {
    // Check if carrier OD is within any of the spacer's ranges
    const inRange = spacer.carrierODRanges.some(
      (range) => carrierOD >= range.min && carrierOD <= range.max
    );
    
    if (!inRange) return false;
    
    // Calculate spacer OD
    const spacerOD = carrierOD + spacer.fixedRunnerHeight * 2;
    
    // Check bell clearance (must be >= 0 if bell exists)
    if (numBellOD > 0) {
      const bellClearance = (spacerOD - numBellOD) / 2;
      if (bellClearance < 0) return false;
    }
    
    return true;
  });
  
  if (validSpacers.length === 0) {
    return null;
  }
  
  // Sort by smallest runner height first (tightest fit)
  validSpacers.sort((a, b) => a.fixedRunnerHeight - b.fixedRunnerHeight);
  
  const bestSpacer = validSpacers[0];
  const spacerOD = carrierOD + bestSpacer.fixedRunnerHeight * 2;
  const bellClearance = numBellOD > 0 ? (spacerOD - numBellOD) / 2 : null;
  
  // Get configuration for this spacer + carrier OD
  const range = bestSpacer.carrierODRanges.find(
    (r) => carrierOD >= r.min && carrierOD <= r.max
  );
  
  const configuration = range && range.elements 
    ? Object.entries(range.elements).map(([type, quantity]) => ({
        type,
        quantity
      }))
    : [];
  
  return {
    spacerId: bestSpacer.id,
    spacerName: bestSpacer.name,
    runnerHeight: bestSpacer.fixedRunnerHeight,
    spacerOuterDiameter: spacerOD,
    bellClearance,
    configuration
  };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Calculate spacer OD given carrier OD and runner height
 * Formula: spacerOD = carrierOD + (runnerHeight * 2)
 * 
 * @param {number} carrierOD - Carrier outer diameter in inches
 * @param {number} runnerHeight - Runner height in inches
 * @returns {number} Spacer outer diameter in inches
 */
export function calculateSpacerOD(carrierOD, runnerHeight) {
  return carrierOD + runnerHeight * 2;
}

/**
 * Calculate bell clearance
 * Formula: bellClearance = (spacerOD - bellOD) / 2
 * 
 * @param {number} spacerOD - Spacer outer diameter in inches
 * @param {number} bellOD - Bell outer diameter in inches
 * @returns {number|null} Bell clearance in inches, or null if no bell
 */
export function calculateBellClearance(spacerOD, bellOD) {
  if (!bellOD || bellOD <= 0) return null;
  return (spacerOD - bellOD) / 2;
}

/**
 * Get all valid spacers for a pipe (useful for dropdown selection)
 * Returns spacers sorted by runner height (smallest first)
 * 
 * @param {Object} pipe - { carrierOD: number, bellOD: number }
 * @returns {Array} Array of valid spacer objects with computed metrics
 */
export function getValidSpacersForPipe(pipe) {
  const { carrierOD, bellOD } = pipe;
  const numBellOD = bellOD || 0;
  
  if (!carrierOD || carrierOD <= 0) {
    return [];
  }
  
  return spacerData
    .filter((spacer) => {
      const inRange = spacer.carrierODRanges.some(
        (range) => carrierOD >= range.min && carrierOD <= range.max
      );
      if (!inRange) return false;
      
      const spacerOD = carrierOD + spacer.fixedRunnerHeight * 2;
      if (numBellOD > 0 && (spacerOD - numBellOD) / 2 < 0) return false;
      
      return true;
    })
    .map((spacer) => ({
      ...spacer,
      spacerOD: carrierOD + spacer.fixedRunnerHeight * 2,
      bellClearance: numBellOD > 0 
        ? (carrierOD + spacer.fixedRunnerHeight * 2 - numBellOD) / 2 
        : null,
    }))
    .sort((a, b) => a.fixedRunnerHeight - b.fixedRunnerHeight);
}

/**
 * Check if a specific spacer is valid for a pipe
 * 
 * @param {number} spacerId - The spacer ID to check
 * @param {Object} pipe - { carrierOD: number, bellOD: number }
 * @returns {boolean} True if the spacer is valid for this pipe
 */
export function isSpacerValidForPipe(spacerId, pipe) {
  const { carrierOD, bellOD } = pipe;
  const spacer = spacerData.find(s => s.id === spacerId);
  
  if (!spacer || !carrierOD || carrierOD <= 0) return false;
  
  const inRange = spacer.carrierODRanges.some(
    (range) => carrierOD >= range.min && carrierOD <= range.max
  );
  
  if (!inRange) return false;
  
  const numBellOD = bellOD || 0;
  if (numBellOD > 0) {
    const spacerOD = carrierOD + spacer.fixedRunnerHeight * 2;
    const bellClearance = (spacerOD - numBellOD) / 2;
    if (bellClearance < 0) return false;
  }
  
  return true;
}

/**
 * Get a spacer by ID
 * 
 * @param {number} spacerId - The spacer ID
 * @returns {Object|null} The spacer object or null
 */
export function getSpacerById(spacerId) {
  return spacerData.find(s => s.id === spacerId) || null;
}

/**
 * Get all available spacers (for reference/debugging)
 * 
 * @returns {Array} All spacer data
 */
export function getAllSpacers() {
  return spacerData;
}

// ============================================================
// CONSTANTS (matching RACI's spacerConstants.js)
// ============================================================

/** Minimum clearance considered "safe" */
export const MIN_OK = 0.6;

/** Minimum clearance considered "tolerable" */
export const MIN_TOL = 0.4;

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  selectSpacerForPipe,
  calculateSpacerOD,
  calculateBellClearance,
  getValidSpacersForPipe,
  isSpacerValidForPipe,
  getSpacerById,
  getAllSpacers,
  MIN_OK,
  MIN_TOL,
};
