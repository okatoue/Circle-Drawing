/**
 * Hook for calculating runner visualization data
 */

import { useMemo } from 'react';
import { buildRunnerCountMap, generateRunners } from '../../../utils/runnerUtils';
import { assignElementColors } from '../../../utils/colorUtils';
import { distributeAngles } from '../../../utils/angleUtils';

export const useRunnerData = (circle) => {
  return useMemo(() => {
    if (!circle.selectedSpacer?.configuration || circle.selectedSpacer.configuration.length === 0) {
      return { runners: [], angleList: [] };
    }

    const configuration = circle.selectedSpacer.configuration;
    const carrierOD = circle.diameter;

    // Build runner visualization data
    const runnerCountMap = buildRunnerCountMap(configuration);
    const elementColors = assignElementColors(runnerCountMap);
    const { runners, totalGroups } = generateRunners(configuration, elementColors);
    const angleList = distributeAngles(runners, totalGroups, carrierOD);

    return { runners, angleList };
  }, [circle.selectedSpacer?.configuration, circle.diameter]);
};