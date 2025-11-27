/**
 * pathGenerators.js - Generate SVG path strings from points
 */

/**
 * Generate a closed SVG path from an array of points
 * @param {Array} points - Array of {x, y} points
 * @returns {string} SVG path string
 */
export const generateClosedPath = (points) => {
  if (!points || points.length < 2) {
    return '';
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  path += ' Z';
  
  return path;
};