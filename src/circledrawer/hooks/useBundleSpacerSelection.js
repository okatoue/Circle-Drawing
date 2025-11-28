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
export const useBundleSpacerSelection = (effectiveDiameter, selectedSpacerId) => {
  return useMemo(() => {
    console.log('=== useBundleSpacerSelection ===');
    console.log('effectiveDiameter:', effectiveDiameter);

    const baseData = {
      selectedSpacer: null,
      configuration: [],
      runners: [],
      totalRunners: 0,
      totalGroups: 0,
      runnerHeight: 0,
      spacerOD: 0,
      hasValidSelection: false,
      validSpacers: []
    };

    if (!effectiveDiameter || effectiveDiameter <= 0) {
      return baseData;
    }

    const pipe = { carrierOD: effectiveDiameter, bellOD: 0 };
    const validSpacers = getValidSpacersForPipe(pipe);

  let spacerResult = null;

  if (selectedSpacerId != null) {
    const normalizedId =
      typeof selectedSpacerId === 'string'
        ? Number(selectedSpacerId)
        : selectedSpacerId;

    spacerResult =
      validSpacers.find((s) => s.id === normalizedId) || null;

    console.log('selectedSpacerId (bundle, non-hook):', selectedSpacerId);
    console.log('normalizedId (bundle, non-hook):', normalizedId);
    console.log('spacerResult from validSpacers (non-hook):', spacerResult);
  }

    if (!spacerResult) {
      spacerResult = selectSpacerForPipe(pipe);
      console.log('spacerResult from auto-selection:', spacerResult);
    }

    if (!spacerResult) {
      console.log('No spacerResult after auto-selection');
      return { ...baseData, validSpacers };
    }

    // Normalize spacerResult so manual and auto share the same shape
    let normalizedResult = spacerResult;

    if (!Array.isArray(normalizedResult.configuration) || normalizedResult.configuration.length === 0) {
      // This is likely a raw spacer object from spacerData (via getValidSpacersForPipe)
      const baseSpacer =
        validSpacers.find((s) => s.id === normalizedResult.id) || null;

      if (baseSpacer) {
        const range = baseSpacer.carrierODRanges.find(
          (r) => pipe.carrierOD >= r.min && pipe.carrierOD <= r.max
        );

        const configuration = range && range.elements
          ? Object.entries(range.elements).map(([type, quantity]) => ({
              type,
              quantity,
            }))
          : [];

        normalizedResult = {
          spacerId: baseSpacer.id,
          spacerName: baseSpacer.name,
          runnerHeight: baseSpacer.fixedRunnerHeight,
          spacerOuterDiameter:
            pipe.carrierOD + baseSpacer.fixedRunnerHeight * 2,
          bellClearance: null,
          configuration,
        };

        console.log('Normalized manual spacerResult:', normalizedResult);
      } else {
        console.log('No matching baseSpacer found for normalization');
      }
    }

    console.log('final spacerResult (normalized):', normalizedResult);

    const configuration = Array.isArray(normalizedResult.configuration)
      ? normalizedResult.configuration
      : [];

    if (configuration.length === 0) {
      return {
        ...baseData,
        selectedSpacer: normalizedResult,
        runnerHeight: normalizedResult.runnerHeight,
        spacerOD: normalizedResult.spacerOuterDiameter,
        hasValidSelection: true,
        validSpacers,
      };
    }

    const runnerCountMap = buildRunnerCountMap(configuration);
    const elementColors = assignElementColors(runnerCountMap);
    const { runners, totalGroups } = generateRunners(configuration, elementColors);

    console.log('Generated runners:', runners);
    console.log('totalRunners:', runners.length);
    console.log('================================');

    return {
      ...baseData,
      selectedSpacer: normalizedResult,
      configuration,
      runners,
      totalRunners: runners.length,
      totalGroups,
      runnerHeight: normalizedResult.runnerHeight,
      spacerOD: normalizedResult.spacerOuterDiameter,
      hasValidSelection: true,
      validSpacers,
    };
  }, [effectiveDiameter, selectedSpacerId]);
};

/**
 * Get bundle spacer data without React hook (for non-React contexts)
 */
/**
 * Get bundle spacer data without React hook (for non-React contexts)
 * 
 * @param {number} effectiveDiameter - The effective OD in inches
 * @param {string|number} [selectedSpacerId] - Optional ID of the spacer to force-select from validSpacers
 */
export const calculateBundleSpacerData = (effectiveDiameter, selectedSpacerId) => {
  const baseData = {
    selectedSpacer: null,
    configuration: [],
    runners: [],
    totalRunners: 0,
    totalGroups: 0,
    runnerHeight: 0,
    spacerOD: 0,
    hasValidSelection: false,
    validSpacers: []
  };

  if (!effectiveDiameter || effectiveDiameter <= 0) {
    return baseData;
  }

  const pipe = { carrierOD: effectiveDiameter, bellOD: 0 };
  const validSpacers = getValidSpacersForPipe(pipe);

  let spacerResult = null;

    if (selectedSpacerId != null) {
      const normalizedId =
        typeof selectedSpacerId === 'string'
          ? Number(selectedSpacerId)
          : selectedSpacerId;

      spacerResult =
        validSpacers.find((s) => s.id === normalizedId) || null;

      console.log('selectedSpacerId (bundle):', selectedSpacerId);
      console.log('normalizedId (bundle):', normalizedId);
      console.log('spacerResult from validSpacers:', spacerResult);
    }

  if (!spacerResult) {
    spacerResult = selectSpacerForPipe(pipe);
    console.log('spacerResult from auto-selection (non-hook):', spacerResult);
  }

  if (!spacerResult) {
    console.log('No spacerResult after auto-selection (non-hook)');
    return { ...baseData, validSpacers };
  }

  // Normalize spacerResult so manual and auto share the same shape
  let normalizedResult = spacerResult;

  if (!Array.isArray(normalizedResult.configuration) || normalizedResult.configuration.length === 0) {
    const baseSpacer =
      validSpacers.find((s) => s.id === normalizedResult.id) || null;

    if (baseSpacer) {
      const range = baseSpacer.carrierODRanges.find(
        (r) => pipe.carrierOD >= r.min && pipe.carrierOD <= r.max
      );

      const configuration = range && range.elements
        ? Object.entries(range.elements).map(([type, quantity]) => ({
            type,
            quantity,
          }))
        : [];

      normalizedResult = {
        spacerId: baseSpacer.id,
        spacerName: baseSpacer.name,
        runnerHeight: baseSpacer.fixedRunnerHeight,
        spacerOuterDiameter:
          pipe.carrierOD + baseSpacer.fixedRunnerHeight * 2,
        bellClearance: null,
        configuration,
      };

      console.log('Normalized manual spacerResult (non-hook):', normalizedResult);
    } else {
      console.log('No matching baseSpacer found for normalization (non-hook)');
    }
  }

  const spacerConfiguration = Array.isArray(normalizedResult.configuration)
    ? normalizedResult.configuration
    : [];

  if (spacerConfiguration.length === 0) {
    return {
      ...baseData,
      selectedSpacer: normalizedResult,
      runnerHeight: normalizedResult.runnerHeight,
      spacerOD: normalizedResult.spacerOuterDiameter,
      hasValidSelection: true,
      validSpacers,
   
  };

  }

  const runnerCountMap = buildRunnerCountMap(spacerConfiguration);
  const elementColors = assignElementColors(runnerCountMap);
  const { runners, totalGroups } = generateRunners(spacerConfiguration, elementColors);

  return {
    ...baseData,
    selectedSpacer: normalizedResult,
    configuration: spacerConfiguration,
    runners,
    totalRunners: runners.length,
    totalGroups,
    runnerHeight: normalizedResult.runnerHeight,
    spacerOD: normalizedResult.spacerOuterDiameter,
    hasValidSelection: true,
    validSpacers,
  };
};

export default useBundleSpacerSelection;
