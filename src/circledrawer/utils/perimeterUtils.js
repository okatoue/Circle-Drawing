/**
 * perimeterUtils.js - Utilities for distributing points along a convex hull perimeter
 * 
 * This handles the key challenge of placing runners evenly around an irregular
 * convex hull shape, not just a circle.
 */

import { PX_PER_INCH } from '../components/CircleTypes';

/**
 * Calculate the length of a line segment between two points
 */
export const segmentLength = (p1, p2) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate total perimeter of the hull in pixels
 */
export const calculatePerimeterPx = (hullPoints) => {
  if (!hullPoints || hullPoints.length < 2) return 0;
  
  let total = 0;
  for (let i = 0; i < hullPoints.length; i++) {
    const p1 = hullPoints[i];
    const p2 = hullPoints[(i + 1) % hullPoints.length];
    total += segmentLength(p1, p2);
  }
  return total;
};

/**
 * Get a point at a specific distance along the hull perimeter
 * 
 * @param {Array} hullPoints - Array of hull vertices
 * @param {number} targetDistance - Distance from start in pixels
 * @returns {Object} { point: {x, y}, normal: {x, y}, edgeIndex }
 */
export const getPointAtDistance = (hullPoints, targetDistance) => {
  if (!hullPoints || hullPoints.length < 2) return null;
  
  let accumulatedDistance = 0;
  
  for (let i = 0; i < hullPoints.length; i++) {
    const p1 = hullPoints[i];
    const p2 = hullPoints[(i + 1) % hullPoints.length];
    const edgeLength = segmentLength(p1, p2);
    
    if (accumulatedDistance + edgeLength >= targetDistance) {
      // The point is on this edge
      const remainingDistance = targetDistance - accumulatedDistance;
      const t = edgeLength > 0 ? remainingDistance / edgeLength : 0;
      
      // Interpolate position
      const point = {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y)
      };
      
      // Calculate outward normal (perpendicular to edge, pointing outward)
      // For a counterclockwise hull, outward is the right-hand perpendicular
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      
      // Right-hand perpendicular (outward for CCW hull)
      const normal = len > 0 ? {
        x: dy / len,
        y: -dx / len
      } : { x: 0, y: -1 };
      
      return { point, normal, edgeIndex: i };
    }
    
    accumulatedDistance += edgeLength;
  }
  
  // Fallback to first point
  return getPointAtDistance(hullPoints, 0);
};

/**
 * Distribute N points evenly around the hull perimeter
 * 
 * @param {Array} hullPoints - Array of hull vertices
 * @param {number} numPoints - Number of points to distribute
 * @returns {Array} Array of { point, normal, angle } objects
 */
export const distributePointsOnHull = (hullPoints, numPoints) => {
  if (!hullPoints || hullPoints.length < 2 || numPoints <= 0) {
    return [];
  }
  
  const totalPerimeter = calculatePerimeterPx(hullPoints);
  if (totalPerimeter <= 0) return [];
  
  const spacing = totalPerimeter / numPoints;
  const points = [];
  
  for (let i = 0; i < numPoints; i++) {
    const distance = i * spacing;
    const result = getPointAtDistance(hullPoints, distance);
    
    if (result) {
      // Calculate angle from normal for rotation
      const angle = Math.atan2(result.normal.y, result.normal.x);
      
      points.push({
        point: result.point,
        normal: result.normal,
        angle: angle,
        index: i
      });
    }
  }
  
  return points;
};

/**
 * Calculate the hull center (centroid of hull points)
 */
export const calculateHullCenter = (hullPoints) => {
  if (!hullPoints || hullPoints.length === 0) {
    return { x: 0, y: 0 };
  }
  
  const sum = hullPoints.reduce((acc, p) => ({
    x: acc.x + p.x,
    y: acc.y + p.y
  }), { x: 0, y: 0 });
  
  return {
    x: sum.x / hullPoints.length,
    y: sum.y / hullPoints.length
  };
};

/**
 * Verify that a normal points outward from the hull center
 * and flip it if necessary
 */
export const ensureOutwardNormal = (point, normal, center) => {
  // Vector from center to point
  const toPoint = {
    x: point.x - center.x,
    y: point.y - center.y
  };
  
  // Dot product - if positive, normal points same direction (outward)
  const dot = normal.x * toPoint.x + normal.y * toPoint.y;
  
  if (dot < 0) {
    // Flip the normal
    return { x: -normal.x, y: -normal.y };
  }
  
  return normal;
};

/**
 * Distribute points with verified outward normals
 */
export const distributePointsWithOutwardNormals = (hullPoints, numPoints) => {
  const points = distributePointsOnHull(hullPoints, numPoints);
  const center = calculateHullCenter(hullPoints);
  
  return points.map(p => {
    const correctedNormal = ensureOutwardNormal(p.point, p.normal, center);
    const correctedAngle = Math.atan2(correctedNormal.y, correctedNormal.x);
    
    return {
      ...p,
      normal: correctedNormal,
      angle: correctedAngle
    };
  });
};
