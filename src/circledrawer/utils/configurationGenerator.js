/**
 * configurationGenerator.js - Generate element configuration from spacer selection
 * Ported from RACI app/src/components/spacerForm/utils/configurationGenerator.js
 * 
 * This generates the configuration array that tells us which element types
 * and quantities make up a spacer for a given carrier OD.
 * 
 * Example output: [{ type: "F25", quantity: 2 }, { type: "G25", quantity: 1 }]
 */

import spacerData from './spacerData.json';

/**
 * Get the element configuration for a spacer at a given carrier OD
 * 
 * @param {Object} spacer - The spacer object (from spacerData.json)
 * @param {number} carrierOD - Carrier outer diameter in inches
 * @returns {Array} Configuration array like [{type: "F25", quantity: 2}]
 * 
 * @example
 * const spacer = spacerData.find(s => s.id === 6); // F/G 25
 * const config = getElementConfiguration(spacer, 4.5);
 * // Returns: [{ type: "F25", quantity: 2 }]
 */
export const getElementConfiguration = (spacer, carrierOD) => {
  if (!spacer) return [];

  const numCarrierOD = typeof carrierOD === "number" ? carrierOD : parseFloat(carrierOD) || 0;

  // Find the range that matches this carrier OD
  const range = spacer.carrierODRanges.find(
    (r) => numCarrierOD >= r.min && numCarrierOD <= r.max
  );

  if (!range) return [];

  // Convert elements object to array format
  const elements = Object.entries(range.elements).map(([type, quantity]) => ({
    type,
    quantity,
  }));

  return elements;
};

/**
 * Get element configuration by spacer ID
 * 
 * @param {number} spacerId - The spacer ID
 * @param {number} carrierOD - Carrier outer diameter in inches
 * @returns {Array} Configuration array
 */
export const getElementConfigurationById = (spacerId, carrierOD) => {
  const spacer = spacerData.find(s => s.id === spacerId);
  return getElementConfiguration(spacer, carrierOD);
};

/**
 * Get total runner count for a configuration
 * 
 * @param {Array} config - Configuration array
 * @param {Object} runnerData - Runner data from elementRunners.json
 * @returns {number} Total number of runners
 */
export const getTotalRunnerCount = (config, runnerData) => {
  let total = 0;
  
  config.forEach(({ type, quantity }) => {
    const def = runnerData.find((r) => r.element === type);
    if (def) {
      total += def.numRunners * quantity;
    }
  });
  
  return total;
};