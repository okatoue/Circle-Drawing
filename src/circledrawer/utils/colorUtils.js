/**
 * colorUtils.js - Color assignment for runner elements
 * Ported from RACI app/src/components/visual/utils/colorUtils.js
 */

// Color scheme for runners
export const COLOR_SCHEME = {
  HIGHLIGHT: "#FF6347",  // Tomato red for elements with minimum runners
  NORMAL: ["#4682B4", "#228B22", "#DAA520", "#6A5ACD"]  // Steel blue, Forest green, Goldenrod, Slate blue
};

/**
 * Find minimum runner count among all element types
 * @param {Object} runnerCountMap - Map of element type to runner count
 * @returns {number} Minimum runner count
 */
export const findMinimumRunnerCount = (runnerCountMap) => {
  const counts = Object.values(runnerCountMap);
  return counts.length > 0 ? Math.min(...counts) : Infinity;
};

/**
 * Assign colors to each element type based on runner count
 * Highlights elements with minimum runner count (if multiple types exist)
 * @param {Object} runnerCountMap - Map of element type to runner count
 * @returns {Object} Map of element type to color
 */
export const assignElementColors = (runnerCountMap) => {
  const elementColors = {};
  const minRunnersPerElement = findMinimumRunnerCount(runnerCountMap);
  const onlyOneType = Object.keys(runnerCountMap).length === 1;
  
  let colorIndex = 0;

  Object.keys(runnerCountMap).forEach((type) => {
    const isMinRunnerElement = runnerCountMap[type] === minRunnersPerElement;
    
    elementColors[type] = onlyOneType
      ? COLOR_SCHEME.NORMAL[colorIndex++ % COLOR_SCHEME.NORMAL.length]
      : isMinRunnerElement
      ? COLOR_SCHEME.HIGHLIGHT
      : COLOR_SCHEME.NORMAL[colorIndex++ % COLOR_SCHEME.NORMAL.length];
  });

  return elementColors;
};
