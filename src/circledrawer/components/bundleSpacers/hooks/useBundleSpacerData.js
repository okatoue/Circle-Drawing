/**
 * useBundleSpacerData.js - Encapsulates all bundle spacer calculations
 */
import { useMemo } from 'react';
import { distributePointsWithOutwardNormals } from '../../../utils/perimeterUtils';
import { calculateOffsetPoints } from '../utils/offsetCalculations';
import { generateClosedPath } from '../utils/pathGenerators';
import { useBundleSpacerSelection } from '../../../hooks/useBundleSpacerSelection';

export const useBundleSpacerData = (effectiveData) => {
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

    return calculateOffsetPoints(
      effectiveData.hullPoints,
      effectiveData.center,
      bundleSpacerData.runnerHeight
    );
  }, [effectiveData?.hullPoints, effectiveData?.center, bundleSpacerData?.runnerHeight]);

  // Create path for spacer OD boundary
  const spacerODPath = useMemo(
    () => generateClosedPath(offsetHullPoints),
    [offsetHullPoints]
  );

  return {
    bundleSpacerData,
    runnerPositions,
    spacerODPath,
  };
};