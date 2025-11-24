/**
 * runnerUtils.js - Utilities for building runner objects from configuration
 * Ported from RACI app/src/components/visual/utils/runnerUtils.js
 * 
 * IMPORTANT: Requires elementRunners.json to be copied from RACI:
 * Copy: app/src/util/elementRunners.json → src/circledrawer/utils/elementRunners.json
 */

import runnerData from './elementRunners.json';

/**
 * Build a map of runner counts for each element type
 * @param {Array} config - Spacer configuration array, e.g. [{type: "F25", quantity: 2}]
 * @returns {Object} Map of element type to number of runners
 */
export const buildRunnerCountMap = (config) => {
  const runnerCountMap = {};

  config.forEach(({ type }) => {
    const def = runnerData.find((r) => r.element === type);
    if (!def) return;
    runnerCountMap[type] = def.numRunners;
  });

  return runnerCountMap;
};

/**
 * Generate runner objects with group and color information
 * @param {Array} config - Spacer configuration array
 * @param {Object} elementColors - Map of element type to color
 * @returns {Object} Object with runners array and totalGroups count
 */
export const generateRunners = (config, elementColors) => {
  const runners = [];
  let groupId = 0;

  config.forEach(({ type, quantity }) => {
    const def = runnerData.find((r) => r.element === type);
    if (!def) return;

    for (let i = 0; i < quantity; i++) {
      for (let j = 0; j < def.numRunners; j++) {
        runners.push({
          groupId,
          type,
          runnerIndex: j,
          numRunners: def.numRunners,
          fillColor: elementColors[type],
        });
      }
      groupId++;
    }
  });

  return { runners, totalGroups: groupId };
};

/**
 * Determine which runner indices should have extensions
 * @param {number} totalRunners - Total number of runners
 * @param {boolean} hasExtensions - Whether extensions are enabled
 * @returns {Array} Array of indices that should be extended
 */
export const getExtendedIndices = (totalRunners, hasExtensions) => {
  if (!hasExtensions) return [];
  return [0, totalRunners - 1];
};

/**
 * Get runner data for an element type
 * @param {string} elementType - Element type like "F25", "M50"
 * @returns {Object|null} Runner data or null
 */
export const getRunnerDataForElement = (elementType) => {
  return runnerData.find((r) => r.element === elementType) || null;
};
