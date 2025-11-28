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
  onSpacerSelected,
  selectedBundleSpacerId,
}) => {
  // Get all calculated data
  const { bundleSpacerData, runnerPositions, spacerODPath } =
    useBundleSpacerData(effectiveData, selectedBundleSpacerId);

  // Notify parent of spacer selection
  useEffect(() => {
    if (onSpacerSelected && bundleSpacerData) {
      onSpacerSelected(bundleSpacerData);
    }
  }, [bundleSpacerData, onSpacerSelected]);
  // Early guard
  if (!showRunners || !effectiveData) {
    return null;
  }

  console.log('=== Bundle Spacer Debug (BundleSpacerRunners) ===');
  console.log('hasValidSelection:', bundleSpacerData?.hasValidSelection);
  console.log('runners length:', bundleSpacerData?.runners?.length || 0);
  console.log('totalRunners:', bundleSpacerData?.totalRunners);
  console.log('runnerPositions length:', runnerPositions.length);
  console.log('===============================================');

  if (!bundleSpacerData?.hasValidSelection) {
    return null;
  }

  const runners = bundleSpacerData.runners || [];
  const runnerHeight = bundleSpacerData.runnerHeight || 0;

  if (runners.length === 0 || runnerPositions.length === 0) {
    return null;
  }



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