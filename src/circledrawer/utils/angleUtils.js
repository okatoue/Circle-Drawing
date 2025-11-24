/**
 * angleUtils.js - Utilities for distributing runners around a circle
 * Ported from RACI app/src/components/visual/utils/angleUtils.js
 */

// Angle configuration constants
export const ANGLE_CONFIG = {
  START_OFFSET: -Math.PI / 2.152,  // Starting angle offset
  MIN_GAP_DIVISOR: 14,
  DEFAULT_GAP_DIVISOR: 16,
};

/**
 * Calculate gap between runner groups based on carrier size
 * @param {number} carrierOD - Carrier outer diameter (inches)
 * @returns {number} Gap angle in radians
 */
export const calculateGapBetweenGroups = (carrierOD) => {
  const gapDivisor = Math.max(
    ANGLE_CONFIG.MIN_GAP_DIVISOR,
    carrierOD || ANGLE_CONFIG.DEFAULT_GAP_DIVISOR
  );
  return Math.PI / gapDivisor;
};

/**
 * Calculate available angle after accounting for gaps
 * @param {number} totalGroups - Total number of runner groups
 * @param {number} gapBetweenGroups - Gap angle in radians
 * @returns {number} Available angle for runners in radians
 */
export const calculateAvailableAngle = (totalGroups, gapBetweenGroups) => {
  const fullCircle = 2 * Math.PI;
  const totalGapAngle = gapBetweenGroups * totalGroups;
  return fullCircle - totalGapAngle;
};

/**
 * Distribute angles among runners with proper spacing
 * @param {Array} runners - Array of runner objects
 * @param {number} totalGroups - Total number of groups
 * @param {number} carrierOD - Carrier outer diameter (inches)
 * @returns {Array} Array of {angle, index} objects
 */
export const distributeAngles = (runners, totalGroups, carrierOD) => {
  if (!runners || runners.length === 0) {
    return [];
  }

  const gapBetweenGroups = calculateGapBetweenGroups(carrierOD);
  const availableAngle = calculateAvailableAngle(totalGroups, gapBetweenGroups);
  const totalRunners = runners.length;

  const angleList = [];
  const groupAngles = [];

  // Count runners per group
  for (let i = 0; i < totalGroups; i++) {
    const groupRunners = runners.filter((r) => r.groupId === i);
    groupAngles.push(groupRunners.length);
  }

  let angleSoFar = ANGLE_CONFIG.START_OFFSET;
  let runnerIndex = 0;

  groupAngles.forEach((groupCount) => {
    const groupSpan = (groupCount / totalRunners) * availableAngle;
    const angleStep = groupSpan / groupCount;
    const groupStart = angleSoFar;

    for (let i = 0; i < groupCount; i++) {
      angleList.push({
        angle: groupStart + angleStep * i + angleStep / 2,
        index: runnerIndex++,
      });
    }

    angleSoFar += groupSpan + gapBetweenGroups;
  });

  return angleList;
};
