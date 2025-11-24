import React from 'react';
import { PX_PER_INCH } from './CircleTypes';

const BundleSpacer = ({ effectiveData, runnerHeight, zoom }) => {
  if (!effectiveData || !runnerHeight || runnerHeight <= 0) {
    return null;
  }

  const { hullPoints, center } = effectiveData;
  
  if (hullPoints.length < 3 || !center) {
    return null;
  }

  // Convert runner height from inches to pixels
  const offsetDistance = runnerHeight * PX_PER_INCH;

  // Calculate offset points - simply move each point away from center
  const offsetPoints = hullPoints.map(point => {
    // Vector from center to point
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return point;
    
    // Normalize and extend by offset distance
    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;
    
    return {
      x: point.x + normalizedDx * offsetDistance,
      y: point.y + normalizedDy * offsetDistance
    };
  });

  // Create path for original hull (effective OD)
  let originalPath = `M ${hullPoints[0].x} ${hullPoints[0].y}`;
  for (let i = 1; i < hullPoints.length; i++) {
    originalPath += ` L ${hullPoints[i].x} ${hullPoints[i].y}`;
  }
  originalPath += ' Z';

  // Create path for offset hull (bundle spacer)
  let offsetPath = `M ${offsetPoints[0].x} ${offsetPoints[0].y}`;
  for (let i = 1; i < offsetPoints.length; i++) {
    offsetPath += ` L ${offsetPoints[i].x} ${offsetPoints[i].y}`;
  }
  offsetPath += ' Z';

  return (
    <g className="bundle-spacer">
      {/* Fill the space between effective OD and spacer boundary */}
      <path
        d={offsetPath}
        fill="#16a34a"
        fillOpacity="0.15"
        stroke="none"
      />

      {/* Clear interior (effective OD area) */}
      <path
        d={originalPath}
        fill="white"
        fillOpacity="0.9"
        stroke="none"
      />

      {/* Bundle spacer boundary line (offset) */}
      <path
        d={offsetPath}
        fill="none"
        stroke="#16a34a"
        strokeWidth={3 / zoom}
        strokeDasharray={`${10 / zoom},${5 / zoom}`}
        opacity="0.9"
      />

      {/* Label for runner height */}
      <g>
        <rect
          x={center.x - 100 / zoom}
          y={center.y - 200 / zoom}
          width={200 / zoom}
          height={50 / zoom}
          fill="white"
          stroke="#16a34a"
          strokeWidth={2 / zoom}
          rx={5 / zoom}
          opacity="0.95"
        />
        
        <text
          x={center.x}
          y={center.y - 180 / zoom}
          textAnchor="middle"
          fill="#16a34a"
          fontSize={14 / zoom}
          fontWeight="bold"
        >
          Bundle Spacer
        </text>
        
        <text
          x={center.x}
          y={center.y - 165 / zoom}
          textAnchor="middle"
          fill="#666"
          fontSize={11 / zoom}
        >
          Runner Height: {runnerHeight.toFixed(2)} in
        </text>
      </g>
    </g>
  );
};

export default BundleSpacer;