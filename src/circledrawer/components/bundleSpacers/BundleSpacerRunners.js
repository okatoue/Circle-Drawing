/**
 * BundleSpacerRunners.js - Orchestrates runner rendering around the bundle
 */
import React, { useEffect } from 'react';
import { useBundleSpacerData } from './hooks/useBundleSpacerData';
import BandSegment from './components/BandSegment';
import RunnerElement from './components/RunnerElement';
import SpacerInfoLabel from './components/SpacerInfoLabel';

const BundleSpacerRunners = ({ 
  effectiveData, 
  zoom = 1,
  showRunners = true,
  onSpacerSelected
}) => {
  // Get all calculated data
  const { bundleSpacerData, runnerPositions, spacerODPath } = useBundleSpacerData(effectiveData);

  // Notify parent of spacer selection
  useEffect(() => {
    if (onSpacerSelected && bundleSpacerData) {
      onSpacerSelected(bundleSpacerData);
    }
  }, [bundleSpacerData, onSpacerSelected]);

  // Early returns after all hooks
  if (!showRunners || !effectiveData || !bundleSpacerData?.hasValidSelection) {
    return null;
  }

  if (runnerPositions.length === 0 || !bundleSpacerData.runners) {
    return null;
  }

  const { runners, runnerHeight } = bundleSpacerData;

  console.log('=== Bundle Spacer Debug ===');
console.log('bundleSpacerData:', bundleSpacerData);
console.log('runners:', runners);
console.log('runnerPositions:', runnerPositions);
console.log('runnerHeight:', runnerHeight);
console.log('========================');

  return (
    <g className="bundle-spacer-runners">
      {/* Spacer OD boundary */}
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

      {/* Colored band segments */}
      {runnerPositions.map((pos, index) => (
        <BandSegment
          key={`band-${index}`}
          position={pos}
          runner={runners[index % runners.length]}
          zoom={zoom}
          index={index}
        />
      ))}

      {/* Runner elements */}
      {runnerPositions.map((pos, index) => (
        <RunnerElement
          key={`runner-${index}`}
          position={pos}
          runner={runners[index % runners.length]}
          runnerHeight={runnerHeight}
          zoom={zoom}
          index={index}
        />
      ))}

      {/* Info label */}
      <SpacerInfoLabel
        center={effectiveData.center}
        bundleSpacerData={bundleSpacerData}
        runnerHeight={runnerHeight}
        zoom={zoom}
      />
    </g>
  );
};

export default BundleSpacerRunners;