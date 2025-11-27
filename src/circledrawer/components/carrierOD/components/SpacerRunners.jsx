import React from 'react';
import { PX_PER_INCH } from '../../CircleTypes';
import { RUNNER_CONFIG } from '../utils/runnerConstants';
import RunnerBands from './RunnerBands';
import RunnerRectangles from './RunnerRectangles';

const SpacerRunners = ({ 
  circle, 
  runners, 
  angleList, 
  zoom = 1
}) => {
  // Convert rotation from degrees to radians
  const rotationOffset = ((circle.spacerRotation || 0) * Math.PI) / 180;

  // Validate inputs
  if (!runners || runners.length === 0) {
    return null;
  }
  if (!angleList || angleList.length === 0) {
    return null;
  }
  if (!circle.spacerOD || circle.spacerOD <= circle.diameter) {
    return null;
  }

  const centerX = circle.x;
  const centerY = circle.y;
  const carrierRadiusPx = (circle.diameter / 2) * PX_PER_INCH;
  const spacerRadiusPx = (circle.spacerOD / 2) * PX_PER_INCH;
  
  // Calculate runner height (distance from carrier surface to spacer OD)
  // Subtract half the runner width so runners don't extend past spacer OD
  const runnerHeight = spacerRadiusPx - carrierRadiusPx - (RUNNER_CONFIG.WIDTH / zoom) / 2;
  
  if (runnerHeight <= 0) {
    return null;
  }
  
  const totalRunners = runners.length;

  return (
    <g className="spacer-runners">
      {/* Colored band segments around carrier */}
      <RunnerBands
        runners={runners}
        angleList={angleList}
        centerX={centerX}
        centerY={centerY}
        carrierRadiusPx={carrierRadiusPx}
        rotationOffset={rotationOffset}
        zoom={zoom}
        totalRunners={totalRunners}
      />

      {/* Runner rectangles and caps */}
      <RunnerRectangles
        runners={runners}
        angleList={angleList}
        centerX={centerX}
        centerY={centerY}
        carrierRadiusPx={carrierRadiusPx}
        runnerHeight={runnerHeight}
        rotationOffset={rotationOffset}
        zoom={zoom}
        totalRunners={totalRunners}
      />
    </g>
  );
};

export default SpacerRunners;