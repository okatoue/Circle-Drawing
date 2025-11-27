/**
 * Hook for managing carrier OD labels (carrier, bell, spacer, spacerConfig)
 */

import { useEffect, useRef } from 'react';
import { PX_PER_INCH } from '../../CircleTypes';
import { svgToScreen } from '../utils/helpers';

export const useCarrierODLabels = ({
  circle,
  zoom,
  panOffset,
  addLabel,
  updateLabelTarget,
  removeLabel
}) => {
  const labelIdsRef = useRef({
    carrier: null,
    bell: null,
    spacer: null,
    spacerConfig: null
  });

  const radiusInPixels = (circle.diameter * PX_PER_INCH) / 2;
  const bellRadiusInPixels = circle.bellOD ? (circle.bellOD * PX_PER_INCH) / 2 : 0;
  const spacerRadiusInPixels = circle.spacerOD ? (circle.spacerOD * PX_PER_INCH) / 2 : 0;

  // Create labels when circle is first rendered
  useEffect(() => {
    if (!addLabel) return;

    const centerScreen = svgToScreen(circle.x, circle.y, zoom, panOffset);
    
    // Create Carrier OD label
    if (!labelIdsRef.current.carrier) {
      const labelPos = svgToScreen(circle.x - 120, circle.y - radiusInPixels - 60, zoom, panOffset);
      labelIdsRef.current.carrier = addLabel('carrierOD', {
        position: labelPos,
        targetPosition: centerScreen,
        value: circle.diameter.toFixed(3)
      });
    }

    // Create Bell OD label if bell exists
    if (circle.bellOD && circle.bellOD > circle.diameter && !labelIdsRef.current.bell) {
      const bellEdgeScreen = svgToScreen(circle.x + bellRadiusInPixels, circle.y, zoom, panOffset);
      const labelPos = svgToScreen(circle.x + 100, circle.y - bellRadiusInPixels - 60, zoom, panOffset);
      labelIdsRef.current.bell = addLabel('bellOD', {
        position: labelPos,
        targetPosition: bellEdgeScreen,
        value: circle.bellOD.toFixed(3)
      });
    }

    // Create Spacer OD label if spacer exists
    if (circle.spacerOD && circle.spacerOD > 0 && !labelIdsRef.current.spacer) {
      const spacerEdgeScreen = svgToScreen(circle.x, circle.y + spacerRadiusInPixels, zoom, panOffset);
      const labelPos = svgToScreen(circle.x - 100, circle.y + spacerRadiusInPixels + 40, zoom, panOffset);
      labelIdsRef.current.spacer = addLabel('spacerOD', {
        position: labelPos,
        targetPosition: spacerEdgeScreen,
        value: circle.spacerOD.toFixed(3)
      });
    }

    // Create Spacer Config label if spacer configuration exists
    if (circle.selectedSpacer?.spacerName && !labelIdsRef.current.spacerConfig) {
      const spacerEdgeScreen = svgToScreen(circle.x, circle.y + spacerRadiusInPixels, zoom, panOffset);
      const labelPos = svgToScreen(circle.x + 100, circle.y + spacerRadiusInPixels + 40, zoom, panOffset);
      labelIdsRef.current.spacerConfig = addLabel('spacerConfig', {
        position: labelPos,
        targetPosition: spacerEdgeScreen,
        value: circle.selectedSpacer.spacerName
      });
    }

    // Cleanup function to remove labels when circle is deleted
    return () => {
      if (removeLabel) {
        if (labelIdsRef.current.carrier) removeLabel(labelIdsRef.current.carrier);
        if (labelIdsRef.current.bell) removeLabel(labelIdsRef.current.bell);
        if (labelIdsRef.current.spacer) removeLabel(labelIdsRef.current.spacer);
        if (labelIdsRef.current.spacerConfig) removeLabel(labelIdsRef.current.spacerConfig);
      }
      labelIdsRef.current = {
        carrier: null,
        bell: null,
        spacer: null,
        spacerConfig: null
      };
    };
  }, [addLabel]);

  // Update label positions when circle moves or zoom/pan changes
  useEffect(() => {
    if (!updateLabelTarget) return;

    const centerScreen = svgToScreen(circle.x, circle.y, zoom, panOffset);

    // Update Carrier OD label target
    if (labelIdsRef.current.carrier) {
      updateLabelTarget(labelIdsRef.current.carrier, centerScreen);
    }

    // Update Bell OD label target
    if (labelIdsRef.current.bell && circle.bellOD) {
      const bellEdgeScreen = svgToScreen(circle.x + bellRadiusInPixels, circle.y, zoom, panOffset);
      updateLabelTarget(labelIdsRef.current.bell, bellEdgeScreen);
    }

    // Update Spacer OD label target
    if (labelIdsRef.current.spacer && circle.spacerOD) {
      const spacerEdgeScreen = svgToScreen(circle.x, circle.y + spacerRadiusInPixels, zoom, panOffset);
      updateLabelTarget(labelIdsRef.current.spacer, spacerEdgeScreen);
    }

    // Update Spacer Config label target
    if (labelIdsRef.current.spacerConfig && circle.selectedSpacer) {
      const spacerEdgeScreen = svgToScreen(circle.x, circle.y + spacerRadiusInPixels, zoom, panOffset);
      updateLabelTarget(labelIdsRef.current.spacerConfig, spacerEdgeScreen);
    }
  }, [circle.x, circle.y, circle.diameter, circle.bellOD, circle.spacerOD, zoom, panOffset]);

  return null; // This hook only manages side effects
};