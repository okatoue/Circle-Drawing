/**
 * offsetCalculations.js - Calculate offset points from convex hull
 */
import { PX_PER_INCH } from '../../CircleTypes';

/**
 * Calculate offset points by moving each hull point away from center
 * @param {Array} hullPoints - Array of {x, y} points
 * @param {Object} center - Center point {x, y}
 * @param {number} offsetDistanceInches - Distance to offset in inches
 * @returns {Array} Array of offset points
 */
export const calculateOffsetPoints = (hullPoints, center, offsetDistanceInches) => {
  if (!hullPoints || hullPoints.length < 3 || !center) {
    return [];
  }

  const offsetDistance = offsetDistanceInches * PX_PER_INCH;

  return hullPoints.map(point => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return point;
    
    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;
    
    return {
      x: point.x + normalizedDx * offsetDistance,
      y: point.y + normalizedDy * offsetDistance
    };
  });
};