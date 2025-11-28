import React, { useMemo } from 'react';
import { calculateOffsetPoints } from './utils/offsetCalculations';
import { generateClosedPath } from './utils/pathGenerators';
import { useBundleSpacerSelection } from '../../hooks/useBundleSpacerSelection';

/**
 * BundleSpacer - Renders the bundle spacer boundary visualization
 * Shows the offset area between effective OD and spacer boundary
 */
const BundleSpacer = ({ effectiveData, zoom }) => {
  
  // Calculate offset points
// Get auto-selected spacer data
const bundleSpacerData = useBundleSpacerSelection(effectiveData?.effectiveDiameter);

// Calculate offset points using auto-selected runner height
const offsetPoints = useMemo(() => {
  if (!effectiveData?.hullPoints || !effectiveData?.center) {
    return [];
  }
  if (!bundleSpacerData?.runnerHeight || bundleSpacerData.runnerHeight <= 0) {
    return [];
  }
  return calculateOffsetPoints(effectiveData.hullPoints, effectiveData.center, bundleSpacerData.runnerHeight);
}, [effectiveData?.hullPoints, effectiveData?.center, bundleSpacerData?.runnerHeight]);
  // Generate SVG paths
  const originalPath = useMemo(() => {
    if (!effectiveData?.hullPoints || effectiveData.hullPoints.length < 3) {
      return '';
    }
    return generateClosedPath(effectiveData.hullPoints);
  }, [effectiveData?.hullPoints]);

  const offsetPath = useMemo(() => {
    if (offsetPoints.length === 0) {
      return '';
    }
    return generateClosedPath(offsetPoints);
  }, [offsetPoints]);

// NOW do validation and early returns AFTER all hooks
if (!effectiveData || !bundleSpacerData?.hasValidSelection) {
  return null;
}
if (!bundleSpacerData.runnerHeight || bundleSpacerData.runnerHeight <= 0) {
  return null;
}

const runnerHeight = bundleSpacerData.runnerHeight;

  const { hullPoints, center } = effectiveData;
  
  if (hullPoints.length < 3 || !center) {
    return null;
  }

  if (!originalPath || !offsetPath) {
    return null;
  }

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
