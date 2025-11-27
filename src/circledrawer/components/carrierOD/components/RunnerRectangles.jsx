/**
 * RunnerRectangles.jsx - Renders individual runner rectangles with caps
 */

import React from 'react';
import { generateArcPath } from '../utils/helpers';
import { RUNNER_CONFIG } from '../utils/runnerConstants';

const RunnerRectangles = ({ 
  runners, 
  angleList, 
  centerX, 
  centerY, 
  carrierRadiusPx,
  runnerHeight,
  rotationOffset,
  zoom,
  totalRunners 
}) => {
  const runnerWidth = RUNNER_CONFIG.WIDTH / zoom;

  return (
    <>
      {angleList.map(({ angle, index }) => {
        const currentRunner = runners[index];
        if (!currentRunner) return null;

        const { fillColor, runnerIndex } = currentRunner;
        const isFirstRunner = runnerIndex === 0;
        const runnerAngle = angle + rotationOffset;

        // Calculate rotation angle (convert from radians to degrees, offset by -90)
        const angleDeg = (runnerAngle * 180) / Math.PI - 90;

        // Calculate runner start position (on carrier surface)
        const startX = centerX + carrierRadiusPx * Math.cos(runnerAngle);
        const startY = centerY + carrierRadiusPx * Math.sin(runnerAngle);

        // Calculate runner end position (for the rounded cap)
        const endX = startX + runnerHeight * Math.cos(runnerAngle);
        const endY = startY + runnerHeight * Math.sin(runnerAngle);
        
        return (
          <g key={`runner-${index}`}>
            {/* Main runner rectangle */}
            <rect
              x={startX - runnerWidth / 2}
              y={startY}
              width={runnerWidth}
              height={runnerHeight}
              fill={fillColor}
              transform={`rotate(${angleDeg}, ${startX}, ${startY})`}
              pointerEvents="none"
            />
            
            {/* Flat top cap for first runner of each element */}
            {isFirstRunner && (
              <rect
                x={startX - runnerWidth / 2}
                y={startY + runnerHeight - runnerWidth / 2}
                width={runnerWidth}
                height={runnerWidth}
                fill={fillColor}
                transform={`rotate(${angleDeg}, ${startX}, ${startY})`}
                pointerEvents="none"
              />
            )}
            
            {/* Rounded end cap for non-first runners */}
            {!isFirstRunner && (
              <circle
                cx={endX}
                cy={endY}
                r={runnerWidth / 2}
                fill={fillColor}
                pointerEvents="none"
              />
            )}
            
            {/* Interlocking arc for first runners */}
            {isFirstRunner && (
              <path
                d={generateArcPath(
                  centerX, 
                  centerY, 
                  carrierRadiusPx + runnerWidth * 0.3,
                  runnerAngle - (2 * Math.PI / totalRunners) / 1.4,
                  runnerAngle + (2 * Math.PI / totalRunners) / 100
                )}
                fill="none"
                stroke={fillColor}
                strokeWidth={runnerWidth * 0.35}
                pointerEvents="none"
              />
            )}
          </g>
        );
      })}
    </>
  );
};

export default RunnerRectangles;