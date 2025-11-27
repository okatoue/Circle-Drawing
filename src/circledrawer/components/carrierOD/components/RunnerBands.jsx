/**
 * RunnerBands.jsx - Renders colored band segments around the carrier
 */

import React from 'react';
import { generateArcPath } from '../utils/helpers';
import { RUNNER_CONFIG } from '../utils/runnerConstants';

const RunnerBands = ({ 
  runners, 
  angleList, 
  centerX, 
  centerY, 
  carrierRadiusPx,
  rotationOffset,
  zoom,
  totalRunners 
}) => {
  const bandWidth = RUNNER_CONFIG.BAND_WIDTH / zoom;
  const angleStep = (2 * Math.PI) / totalRunners;

  return (
    <>
      {angleList.map(({ angle, index }) => {
        const currentRunner = runners[index];
        if (!currentRunner) return null;
        
        const { fillColor } = currentRunner;
        
        const startAngle = angle - angleStep / 4 + rotationOffset;
        const endAngle = angle + angleStep + rotationOffset;
        
        const arcPath = generateArcPath(centerX, centerY, carrierRadiusPx, startAngle, endAngle);
        
        return (
          <path
            key={`band-${index}`}
            d={arcPath}
            fill="none"
            stroke={fillColor}
            strokeWidth={bandWidth}
            pointerEvents="none"
          />
        );
      })}
    </>
  );
};

export default RunnerBands;