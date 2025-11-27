/**
 * EffectiveDiameter.js - Renders the effective diameter boundary
 */
import React, { useMemo } from 'react';
import { generateClosedPath } from '../bundleSpacers/utils/pathGenerators';
import EffectiveDiameterLabel from './components/EffectiveDiameterLabel';

const EffectiveDiameter = ({ effectiveData, zoom }) => {
  // ALL HOOKS FIRST
  
  // Generate path for hull boundary
  const pathData = useMemo(() => {
    if (!effectiveData || effectiveData.circles.length === 0) {
      return '';
    }
    if (effectiveData.circles.length === 1) {
      return ''; // Single circle doesn't need path
    }
    if (!effectiveData.hullPoints || effectiveData.hullPoints.length < 2) {
      return '';
    }
    return generateClosedPath(effectiveData.hullPoints);
  }, [effectiveData]);

  // NOW do early returns AFTER all hooks
  if (!effectiveData || effectiveData.circles.length === 0) {
    return null;
  }

  const { hullPoints, effectiveDiameter, perimeter, center } = effectiveData;
  const isSingleCircle = effectiveData.circles.length === 1;

  // For single circle, just show label
  if (isSingleCircle) {
    return (
      <EffectiveDiameterLabel
        center={center}
        effectiveDiameter={effectiveDiameter}
        perimeter={perimeter}
        zoom={zoom}
        isSingleCircle={true}
      />
    );
  }

  // Multi-circle: show hull boundary
  if (!pathData) {
    return null;
  }

  return (
    <g>
      {/* Hull boundary line */}
      <path
        d={pathData}
        fill="none"
        stroke="#ff6600"
        strokeWidth={3 / zoom}
        strokeDasharray={`${10 / zoom},${5 / zoom}`}
        opacity="0.8"
      />

      {/* Label */}
      <EffectiveDiameterLabel
        center={center}
        effectiveDiameter={effectiveDiameter}
        perimeter={perimeter}
        zoom={zoom}
        isSingleCircle={false}
      />

      {/* Hull vertices */}
      {hullPoints.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={3 / zoom}
          fill="#ff6600"
          opacity="0.6"
        />
      ))}
    </g>
  );
};

export default EffectiveDiameter;