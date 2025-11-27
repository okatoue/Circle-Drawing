/**
 * BandSegment.js - Renders a single colored band segment along the hull
 */
import React from 'react';
import { RUNNER_CONFIG } from '../utils/runnerConfig';

const BandSegment = ({ position, runner, zoom, index }) => {
  if (!runner) return null;

  const bandLength = RUNNER_CONFIG.BAND_LENGTH / zoom;
  const bandWidth = RUNNER_CONFIG.BAND_WIDTH / zoom;
  
  const perpX = -position.normal.y;
  const perpY = position.normal.x;

  return (
    <line
      key={`band-${index}`}
      x1={position.point.x - perpX * bandLength / 2}
      y1={position.point.y - perpY * bandLength / 2}
      x2={position.point.x + perpX * bandLength / 2}
      y2={position.point.y + perpY * bandLength / 2}
      stroke={runner.fillColor}
      strokeWidth={bandWidth}
      strokeLinecap="round"
      pointerEvents="none"
    />
  );
};

export default BandSegment;