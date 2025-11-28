/**
 * useBundleSpacerData.js - Encapsulates all bundle spacer calculations
 */
import { useMemo } from 'react';
import { distributePointsWithOutwardNormals } from '../../../utils/perimeterUtils';
import { calculateOffsetPoints } from '../utils/offsetCalculations';
import { generateClosedPath } from '../utils/pathGenerators';
import { useBundleSpacerSelection } from '../../../hooks/useBundleSpacerSelection';

export const useBundleSpacerData = (effectiveData, selectedBundleSpacerId) => {
  // Get spacer selection based on effective diameter
  const bundleSpacerData = useBundleSpacerSelection(
    effectiveData?.effectiveDiameter,
    selectedBundleSpacerId
  );
  const runnerPositions = useMemo(() => {
    if (!effectiveData?.hullPoints || effectiveData.hullPoints.length < 3) {
      console.log('useBundleSpacerData: no or too few hullPoints');
      return [];
    }
    if (!bundleSpacerData?.runners || bundleSpacerData.runners.length === 0) {
      console.log('useBundleSpacerData: no runners in bundleSpacerData');
      return [];
    }

    const numRunners =
      bundleSpacerData.totalRunners && bundleSpacerData.totalRunners > 0
        ? bundleSpacerData.totalRunners
        : bundleSpacerData.runners.length;

    const positions = distributePointsWithOutwardNormals(
      effectiveData.hullPoints,
      numRunners
    );

    console.log(
      'useBundleSpacerData → numRunners:',
      numRunners,
      'runnerPositions length:',
      positions.length
    );

    return positions;
  }, [
    effectiveData?.hullPoints,
    bundleSpacerData?.runners,
    bundleSpacerData?.totalRunners,
  ]);



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