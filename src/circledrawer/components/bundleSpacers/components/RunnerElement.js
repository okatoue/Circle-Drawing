/**
 * RunnerElement.js - Renders a single runner with its cap
 */
import React from 'react';
import { PX_PER_INCH } from '../../CircleTypes';
import { RUNNER_CONFIG } from '../utils/runnerConfig';

const RunnerElement = ({ position, runner, runnerHeight, zoom, index }) => {
  if (!runner) return null;

  const { fillColor, runnerIndex } = runner;
  const isFirstRunner = runnerIndex === 0;
  
  const runnerHeightPx = runnerHeight * PX_PER_INCH;
  const runnerWidth = RUNNER_CONFIG.WIDTH / zoom;
  
  const angleDeg = (position.angle * 180) / Math.PI;
  const startX = position.point.x;
  const startY = position.point.y;
  const endX = startX + position.normal.x * runnerHeightPx;
  const endY = startY + position.normal.y * runnerHeightPx;

  return (
    <g key={`runner-${index}`}>
      {/* Main runner rectangle */}
      <rect
        x={-runnerWidth / 2}
        y={0}
        width={runnerWidth}
        height={runnerHeightPx}
        fill={fillColor}
        transform={`translate(${startX}, ${startY}) rotate(${angleDeg + 90})`}
        pointerEvents="none"
      />

      {/* Flat top for first runner of each element */}
      {isFirstRunner && (
        <rect
          x={-runnerWidth / 2}
          y={runnerHeightPx - runnerWidth / 2}
          width={runnerWidth}
          height={runnerWidth}
          fill={fillColor}
          transform={`translate(${startX}, ${startY}) rotate(${angleDeg + 90})`}
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
    </g>
  );
};

export default RunnerElement;