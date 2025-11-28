/**
 * useBundleSpacerSelection.js - Hook to select spacer for bundle based on Effective OD
 * 
 * This hook:
 * 1. Takes the effective OD of the bundle
 * 2. Selects an appropriate spacer using RACI logic
 * 3. Gets the configuration (e.g., 5×F25 + 1×G25)
 * 4. Calculates total number of runners
 * 5. Returns all data needed to render bundle spacer runners
 */

import { useMemo } from 'react';
import { selectSpacerForPipe, getValidSpacersForPipe } from '../utils/spacerSelection';
import { buildRunnerCountMap, generateRunners } from '../utils/runnerUtils';
import { assignElementColors } from '../utils/colorUtils';

/**
 * Hook to calculate bundle spacer selection and runner data
 * 
 * @param {number} effectiveDiameter - The effective OD in inches
 * @returns {Object} Bundle spacer data including runners
 */
export const useBundleSpacerSelection = (effectiveDiameter) => {
return useMemo(() => {
  console.log('=== useBundleSpacerSelection ===');
  console.log('effectiveDiameter:', effectiveDiameter);
  
  if (!effectiveDiameter || effectiveDiameter <= 0) {
      return {
        selectedSpacer: null,
        configuration: [],
        runners: [],
        totalRunners: 0,
        runnerHeight: 0,
        spacerOD: 0,
        hasValidSelection: false,
        validSpacers: []
      };
    }

    // Select spacer based on effective OD (no bell OD for bundle)
const spacerResult = selectSpacerForPipe({
  carrierOD: effectiveDiameter,
  bellOD: 0  // No bell for bundle
});

console.log('spacerResult:', spacerResult);

    if (!spacerResult) {
      return {
        selectedSpacer: null,
        configuration: [],
        runners: [],
        totalRunners: 0,
        runnerHeight: 0,
        spacerOD: 0,
        hasValidSelection: false,
        validSpacers: getValidSpacersForPipe({ carrierOD: effectiveDiameter, bellOD: 0 })
      };
    }

    const configuration = spacerResult.configuration || [];
    
    if (configuration.length === 0) {
      return {
        selectedSpacer: spacerResult,
        configuration: [],
        runners: [],
        totalRunners: 0,
        runnerHeight: spacerResult.runnerHeight,
        spacerOD: spacerResult.spacerOuterDiameter,
        hasValidSelection: true,
        validSpacers: []
      };
    }

    // Build runner data using the same logic as individual carriers
    const runnerCountMap = buildRunnerCountMap(configuration);
    const elementColors = assignElementColors(runnerCountMap);
const { runners, totalGroups } = generateRunners(configuration, elementColors);

console.log('Generated runners:', runners);
console.log('totalRunners:', runners.length);
console.log('================================');
    return {
      selectedSpacer: spacerResult,
      configuration,
      runners,
      totalRunners: runners.length,
      totalGroups,
      runnerHeight: spacerResult.runnerHeight,
      spacerOD: spacerResult.spacerOuterDiameter,
      hasValidSelection: true,
      validSpacers: getValidSpacersForPipe({ carrierOD: effectiveDiameter, bellOD: 0 })
    };
  }, [effectiveDiameter]);
};

/**
 * Get bundle spacer data without React hook (for non-React contexts)
 */
export const calculateBundleSpacerData = (effectiveDiameter) => {
  if (!effectiveDiameter || effectiveDiameter <= 0) {
    return null;
  }

  const spacerResult = selectSpacerForPipe({
    carrierOD: effectiveDiameter,
    bellOD: 0
  });

  if (!spacerResult || !spacerResult.configuration) {
    return spacerResult;
  }

  const configuration = spacerResult.configuration;
  const runnerCountMap = buildRunnerCountMap(configuration);
  const elementColors = assignElementColors(runnerCountMap);
  const { runners, totalGroups } = generateRunners(configuration, elementColors);

  return {
    ...spacerResult,
    runners,
    totalRunners: runners.length,
    totalGroups
  };
};

export default useBundleSpacerSelection;
