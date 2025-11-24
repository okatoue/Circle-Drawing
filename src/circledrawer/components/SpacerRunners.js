/**
 * SpacerRunners.js - Renders the visual spacer runner elements
 * Ported from RACI app/src/components/visual/drawing/drawRunners.js
 * 
 * This component renders:
 * - Colored band segments around the carrier (showing runner positions)
 * - Runner rectangles radiating outward from the carrier to the spacer OD
 * - Rounded caps on non-first runners
 * - Flat tops on first runners
 * - Interlocking arcs on first runners
 */

import React from 'react';
import { PX_PER_INCH } from './CircleTypes';

// Runner configuration constants (from RACI visualConstants.js)
const RUNNER_CONFIG = {
  WIDTH: 14,           // Width of each runner rectangle in pixels (at zoom=1)
  BAND_WIDTH: 5,       // Width of the colored band around carrier
};

/**
 * SpacerRunners - Renders runners around a carrier circle
 * 
 * @param {Object} props
 * @param {Object} props.circle - Circle data with x, y, diameter, spacerOD
 * @param {Array} props.runners - Array of runner objects from runner calculations
 * @param {Array} props.angleList - Array of {angle, index} for positioning
 * @param {number} props.zoom - Current zoom level
 */
const SpacerRunners = ({ 
  circle, 
  runners, 
  angleList, 
  zoom = 1
}) => {
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
  const runnerWidth = RUNNER_CONFIG.WIDTH / zoom;
  const bandWidth = RUNNER_CONFIG.BAND_WIDTH / zoom;

  /**
   * Generate SVG arc path string
   */
  const generateArcPath = (cx, cy, radius, startAngle, endAngle) => {
    const start = {
      x: cx + radius * Math.cos(startAngle),
      y: cy + radius * Math.sin(startAngle)
    };
    const end = {
      x: cx + radius * Math.cos(endAngle),
      y: cy + radius * Math.sin(endAngle)
    };
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  return (
    <g className="spacer-runners">
      {/* 1. Render colored band segments around carrier */}
      {angleList.map(({ angle, index }) => {
        const currentRunner = runners[index];
        if (!currentRunner) return null;
        
        const { fillColor } = currentRunner;
        const angleStep = (2 * Math.PI) / totalRunners;
        const startAngle = angle - angleStep / 4;
        const endAngle = angle + angleStep;
        
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

      {/* 2. Render runner rectangles and caps */}
      {angleList.map(({ angle, index }) => {
        const currentRunner = runners[index];
        if (!currentRunner) return null;
        
        const { fillColor, runnerIndex } = currentRunner;
        const isFirstRunner = runnerIndex === 0;
        
        // Calculate rotation angle (convert from radians to degrees, offset by -90)
        const angleDeg = (angle * 180) / Math.PI - 90;
        
        // Calculate runner start position (on carrier surface)
        const startX = centerX + carrierRadiusPx * Math.cos(angle);
        const startY = centerY + carrierRadiusPx * Math.sin(angle);
        
        // Calculate runner end position (for the rounded cap)
        const endX = startX + runnerHeight * Math.cos(angle);
        const endY = startY + runnerHeight * Math.sin(angle);
        
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
                  angle - (2 * Math.PI / totalRunners) / 1.4,
                  angle + (2 * Math.PI / totalRunners) / 100
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
    </g>
  );
};

export default SpacerRunners;