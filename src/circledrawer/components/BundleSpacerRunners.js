/**
 * BundleSpacerRunners.js - Renders spacer runners around the bundle's convex hull
 * 
 * This component:
 * 1. Takes the effective OD data (including hull points)
 * 2. Selects a spacer based on effective diameter
 * 3. Distributes runners evenly around the hull perimeter
 * 4. Draws each runner perpendicular to the hull at that position
 */

import React, { useMemo, useEffect } from 'react';
import { PX_PER_INCH } from './CircleTypes';
import { useBundleSpacerSelection } from '../hooks/useBundleSpacerSelection';
import { distributePointsWithOutwardNormals } from '../utils/perimeterUtils';

// Runner configuration
const RUNNER_CONFIG = {
  WIDTH: 14,
  BAND_WIDTH: 5,
};

const BundleSpacerRunners = ({ 
  effectiveData, 
  zoom = 1,
  showRunners = true,
  onSpacerSelected
}) => {
  // ALL HOOKS MUST BE CALLED FIRST, BEFORE ANY RETURNS
  
  // Get spacer selection based on effective diameter
  const bundleSpacerData = useBundleSpacerSelection(effectiveData?.effectiveDiameter);

  // Calculate runner positions around the hull
  const runnerPositions = useMemo(() => {
    if (!effectiveData?.hullPoints || effectiveData.hullPoints.length < 3) {
      return [];
    }
    if (!bundleSpacerData?.runners || bundleSpacerData.runners.length === 0) {
      return [];
    }

    const numRunners = bundleSpacerData.totalRunners;
    return distributePointsWithOutwardNormals(effectiveData.hullPoints, numRunners);
  }, [effectiveData?.hullPoints, bundleSpacerData?.runners, bundleSpacerData?.totalRunners]);

  // Calculate offset hull points for the spacer OD boundary
  const offsetHullPoints = useMemo(() => {
    if (!effectiveData?.hullPoints || effectiveData.hullPoints.length < 3 || !effectiveData?.center) {
      return [];
    }
    if (!bundleSpacerData?.runnerHeight) {
      return [];
    }
    
    const runnerHeightPx = bundleSpacerData.runnerHeight * PX_PER_INCH;
    const center = effectiveData.center;
    
    return effectiveData.hullPoints.map(point => {
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return point;
      
      return {
        x: point.x + (dx / dist) * runnerHeightPx,
        y: point.y + (dy / dist) * runnerHeightPx
      };
    });
  }, [effectiveData?.hullPoints, effectiveData?.center, bundleSpacerData?.runnerHeight]);

  // Create path for spacer OD boundary
  const spacerODPath = useMemo(() => {
    if (offsetHullPoints.length < 3) return '';
    
    let path = `M ${offsetHullPoints[0].x} ${offsetHullPoints[0].y}`;
    for (let i = 1; i < offsetHullPoints.length; i++) {
      path += ` L ${offsetHullPoints[i].x} ${offsetHullPoints[i].y}`;
    }
    path += ' Z';
    return path;
  }, [offsetHullPoints]);

  // Notify parent of spacer selection
  useEffect(() => {
    if (onSpacerSelected && bundleSpacerData) {
      onSpacerSelected(bundleSpacerData);
    }
  }, [bundleSpacerData, onSpacerSelected]);

  // NOW we can do early returns after all hooks are called
  if (!showRunners || !effectiveData || !bundleSpacerData?.hasValidSelection) {
    return null;
  }

  if (runnerPositions.length === 0 || !bundleSpacerData.runners) {
    return null;
  }

  const { runners, runnerHeight } = bundleSpacerData;
  const runnerHeightPx = runnerHeight * PX_PER_INCH;
  const runnerWidth = RUNNER_CONFIG.WIDTH / zoom;
  const bandWidth = RUNNER_CONFIG.BAND_WIDTH / zoom;

  return (
    <g className="bundle-spacer-runners">
      {/* Spacer OD boundary (offset from effective OD) */}
      {spacerODPath && (
        <path
          d={spacerODPath}
          fill="#16a34a"
          fillOpacity="0.1"
          stroke="#16a34a"
          strokeWidth={2 / zoom}
          pointerEvents="none"
        />
      )}

      {/* Colored band segments along the hull perimeter */}
      {runnerPositions.map((pos, index) => {
        const runner = runners[index % runners.length];
        if (!runner) return null;

        const bandLength = 20 / zoom;
        const perpX = -pos.normal.y;
        const perpY = pos.normal.x;

        return (
          <line
            key={`band-${index}`}
            x1={pos.point.x - perpX * bandLength / 2}
            y1={pos.point.y - perpY * bandLength / 2}
            x2={pos.point.x + perpX * bandLength / 2}
            y2={pos.point.y + perpY * bandLength / 2}
            stroke={runner.fillColor}
            strokeWidth={bandWidth}
            strokeLinecap="round"
            pointerEvents="none"
          />
        );
      })}

      {/* Runner rectangles */}
      {runnerPositions.map((pos, index) => {
        const runner = runners[index % runners.length];
        if (!runner) return null;

        const { fillColor, runnerIndex } = runner;
        const isFirstRunner = runnerIndex === 0;
        const angleDeg = (pos.angle * 180) / Math.PI;
        const startX = pos.point.x;
        const startY = pos.point.y;
        const endX = startX + pos.normal.x * runnerHeightPx;
        const endY = startY + pos.normal.y * runnerHeightPx;

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
      })}

      {/* Info label */}
      {effectiveData.center && (
        <g>
          <rect
            x={effectiveData.center.x - 120 / zoom}
            y={effectiveData.center.y + 100 / zoom}
            width={240 / zoom}
            height={70 / zoom}
            fill="white"
            stroke="#16a34a"
            strokeWidth={2 / zoom}
            rx={5 / zoom}
            opacity="0.95"
          />
          <text
            x={effectiveData.center.x}
            y={effectiveData.center.y + 125 / zoom}
            textAnchor="middle"
            fill="#16a34a"
            fontSize={14 / zoom}
            fontWeight="bold"
          >
            Bundle Spacer: {bundleSpacerData.selectedSpacer?.spacerName}
          </text>
          <text
            x={effectiveData.center.x}
            y={effectiveData.center.y + 145 / zoom}
            textAnchor="middle"
            fill="#666"
            fontSize={11 / zoom}
          >
            Config: {bundleSpacerData.configuration?.map(c => `${c.quantity}×${c.type}`).join(' + ')}
          </text>
          <text
            x={effectiveData.center.x}
            y={effectiveData.center.y + 160 / zoom}
            textAnchor="middle"
            fill="#666"
            fontSize={11 / zoom}
          >
            {bundleSpacerData.totalRunners} runners | Height: {runnerHeight.toFixed(2)}"
          </text>
        </g>
      )}
    </g>
  );
};

export default BundleSpacerRunners;