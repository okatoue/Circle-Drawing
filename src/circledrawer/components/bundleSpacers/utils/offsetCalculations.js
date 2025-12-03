/**
 * offsetCalculations.js - Calculate offset points from convex hull using normals
 */
import { PX_PER_INCH } from '../../CircleTypes';
import { distributePointsWithOutwardNormals, calculatePerimeterPx } from '../../../utils/perimeterUtils';

/**
 * Calculate offset points by moving along normals at each point
 * This matches how runners extend - perpendicular to hull edges
 * 
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
  
  // Use the same distribution method as runners to ensure consistency
  const numSamplePoints = hullPoints.length * 8; // Sample more densely for smooth boundary
  const positions = distributePointsWithOutwardNormals(hullPoints, numSamplePoints);
  
  // Offset each point along its normal
  return positions.map(pos => ({
    x: pos.point.x + pos.normal.x * offsetDistance,
    y: pos.point.y + pos.normal.y * offsetDistance
  }));
};