/**
 * useRunnerCalculations.js - Hook to calculate runner visualization data
 * Ported from RACI app/src/components/visual/hooks/useRunnerCalculations.js
 * 
 * This hook takes a spacer configuration and carrier OD, and returns
 * all the data needed to render the runners visually.
 */

import { useMemo } from 'react';
import { buildRunnerCountMap, generateRunners, getExtendedIndices } from '../utils/runnerUtils';
import { assignElementColors } from '../utils/colorUtils';
import { distributeAngles } from '../utils/angleUtils';
import { getElementConfiguration } from '../utils/configurationGenerator';

/**
 * Custom hook to calculate runner visualization data
 * 
 * @param {Object} circle - Circle object with diameter, selectedSpacer, etc.
 * @returns {Object} Object containing runners, angleList, configuration, etc.
 * 
 * @example
 * const runnerData = useRunnerCalculations(circle);
 * // runnerData.runners - Array of runner objects with colors
 * // runnerData.angleList - Array of {angle, index} for positioning
 * // runnerData.configuration - Array of {type, quantity}
 */
export const useRunnerCalculations = (circle) => {
  return useMemo(() => {
    // If no spacer selected, return empty data
    if (!circle?.selectedSpacer || !circle?.diameter) {
      return {
        runners: [],
        angleList: [],
        configuration: [],
        totalGroups: 0,
        extendedIndices: [],
        hasValidConfig: false,
      };
    }

    const carrierOD = circle.diameter;
    const spacerId = circle.selectedSpacer.spacerId;
    
    // Step 1: Get the element configuration for this spacer + carrier OD
    // Import spacerData to find the full spacer object
    const spacerData = require('../utils/spacerData.json');
    const spacer = spacerData.find(s => s.id === spacerId);
    const configuration = getElementConfiguration(spacer, carrierOD);

    if (!configuration || configuration.length === 0) {
      return {
        runners: [],
        angleList: [],
        configuration: [],
        totalGroups: 0,
        extendedIndices: [],
        hasValidConfig: false,
      };
    }

    // Step 2: Build runner count map
    const runnerCountMap = buildRunnerCountMap(configuration);

    // Step 3: Assign colors based on runner counts
    const elementColors = assignElementColors(runnerCountMap);

    // Step 4: Generate runner objects with group info
    const { runners, totalGroups } = generateRunners(configuration, elementColors);

    // Step 5: Distribute angles for runner positioning
    const angleList = distributeAngles(runners, totalGroups, carrierOD);

    // Step 6: No extensions for CircleDrawing (that's a RACI-specific feature)
    const extendedIndices = [];

    return {
      runners,
      angleList,
      configuration,
      totalGroups,
      extendedIndices,
      hasValidConfig: runners.length > 0,
    };
  }, [circle?.selectedSpacer?.spacerId, circle?.diameter]);
};

/**
 * Calculate runner data without a hook (for non-React contexts)
 * 
 * @param {number} spacerId - The spacer ID
 * @param {number} carrierOD - Carrier outer diameter in inches
 * @returns {Object} Runner calculation data
 */
export const calculateRunnerData = (spacerId, carrierOD) => {
  const spacerData = require('../utils/spacerData.json');
  const spacer = spacerData.find(s => s.id === spacerId);
  const configuration = getElementConfiguration(spacer, carrierOD);

  if (!configuration || configuration.length === 0) {
    return {
      runners: [],
      angleList: [],
      configuration: [],
      totalGroups: 0,
      hasValidConfig: false,
    };
  }

  const runnerCountMap = buildRunnerCountMap(configuration);
  const elementColors = assignElementColors(runnerCountMap);
  const { runners, totalGroups } = generateRunners(configuration, elementColors);
  const angleList = distributeAngles(runners, totalGroups, carrierOD);

  return {
    runners,
    angleList,
    configuration,
    totalGroups,
    hasValidConfig: runners.length > 0,
  };
};

export default useRunnerCalculations;
