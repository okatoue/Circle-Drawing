import { useMemo } from 'react';
import { CIRCLE_TYPES, PX_PER_INCH } from '../components/CircleTypes';

export const useEffectiveDiameter = (circles) => {
  const effectiveData = useMemo(() => {
    // Filter ONLY Carrier OD circles (ignore Bell OD and Spacer OD)
    const carrierCircles = circles.filter(c => c.type === CIRCLE_TYPES.CARRIER_OD);
    
    if (carrierCircles.length === 0) {
      return null;
    }

    if (carrierCircles.length === 1) {
      // Single carrier: effective diameter is just its carrier diameter
      const circle = carrierCircles[0];
      return {
        circles: carrierCircles,
        effectiveDiameter: circle.diameter,
        perimeter: Math.PI * circle.diameter,
        hullPoints: [],
        center: { x: circle.x, y: circle.y }
      };
    }

    // Calculate convex hull of CARRIER circles ONLY (not Bell OD, not Spacer OD)
    const hullPoints = calculateConvexHullOfCircles(carrierCircles);
    
    // Calculate perimeter of the hull
    const perimeter = calculateHullPerimeter(hullPoints);
    
    // Calculate effective diameter: C = π * D, so D = C / π
    const effectiveDiameter = perimeter / Math.PI;
    
    // Calculate center of all carrier circles
    const center = {
      x: carrierCircles.reduce((sum, c) => sum + c.x, 0) / carrierCircles.length,
      y: carrierCircles.reduce((sum, c) => sum + c.y, 0) / carrierCircles.length
    };

    return {
      circles: carrierCircles,
      effectiveDiameter,
      perimeter,
      hullPoints,
      center
    };
  }, [circles]);

  return effectiveData;
};

// Calculate convex hull of circles (considering their radii)
const calculateConvexHullOfCircles = (circles) => {
  // For each CARRIER circle, sample points around the perimeter
  // Use ONLY the carrier diameter, NOT Bell OD or Spacer OD
  const points = [];
  
  circles.forEach(circle => {
    // Use CARRIER diameter only (ignore bellOD and spacerOD)
    const radius = (circle.diameter / 2) * PX_PER_INCH;
    
    // Use 32 points for good accuracy
    const numPoints = 32;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      points.push({
        x: circle.x + radius * Math.cos(angle),
        y: circle.y + radius * Math.sin(angle),
        circleId: circle.id,
        angle: angle
      });
    }
  });

  // Calculate convex hull using Graham scan
  return grahamScan(points);
};

// Graham scan algorithm for convex hull
const grahamScan = (points) => {
  if (points.length < 3) return points;

  // Find the point with the lowest y-coordinate (and leftmost if tied)
  let start = points[0];
  for (let i = 1; i < points.length; i++) {
    if (points[i].y < start.y || (points[i].y === start.y && points[i].x < start.x)) {
      start = points[i];
    }
  }

  // Sort points by polar angle with respect to start point
  const sortedPoints = points.filter(p => p !== start).sort((a, b) => {
    const angleA = Math.atan2(a.y - start.y, a.x - start.x);
    const angleB = Math.atan2(b.y - start.y, b.x - start.x);
    if (Math.abs(angleA - angleB) < 0.000001) {
      // If angles are equal, sort by distance
      const distA = Math.sqrt((a.x - start.x) ** 2 + (a.y - start.y) ** 2);
      const distB = Math.sqrt((b.x - start.x) ** 2 + (b.y - start.y) ** 2);
      return distA - distB;
    }
    return angleA - angleB;
  });

  // Build the hull
  const hull = [start, sortedPoints[0]];

  for (let i = 1; i < sortedPoints.length; i++) {
    let top = hull[hull.length - 1];
    let middle = hull[hull.length - 2];

    while (hull.length >= 2 && ccw(middle, top, sortedPoints[i]) <= 0) {
      hull.pop();
      top = hull[hull.length - 1];
      middle = hull[hull.length - 2];
    }

    hull.push(sortedPoints[i]);
  }

  return hull;
};

// Counter-clockwise test
const ccw = (a, b, c) => {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
};

// Calculate perimeter of the hull
const calculateHullPerimeter = (hullPoints) => {
  if (hullPoints.length < 2) return 0;

  let perimeter = 0;

  for (let i = 0; i < hullPoints.length; i++) {
    const p1 = hullPoints[i];
    const p2 = hullPoints[(i + 1) % hullPoints.length];

    // Calculate distance between consecutive hull points
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    perimeter += distance;
  }

  // Convert from pixels to inches
  return perimeter / PX_PER_INCH;
};