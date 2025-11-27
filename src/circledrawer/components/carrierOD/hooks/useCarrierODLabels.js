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
  updateLabelValue,
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
// Create labels when circle is first rendered
  useEffect(() => {
    if (!addLabel) return;

    const centerScreen = svgToScreen(circle.x, circle.y, zoom, panOffset);
    
    // Create Carrier OD label if visibility is enabled
    if (circle.labelVisibility?.carrier && !labelIdsRef.current.carrier) {
      const labelPos = svgToScreen(circle.x - 120, circle.y - radiusInPixels - 60, zoom, panOffset);
labelIdsRef.current.carrier = addLabel('carrierOD', {
  position: labelPos,
  targetPosition: centerScreen,
  value: circle.diameter.toFixed(3),
  circleId: circle.id,
  labelType: 'carrier'
});
    } else if (!circle.labelVisibility?.carrier && labelIdsRef.current.carrier) {
      // Remove label if visibility is disabled
      removeLabel(labelIdsRef.current.carrier);
      labelIdsRef.current.carrier = null;
    }

    // Create Bell OD label if bell exists and visibility is enabled
    if (circle.bellOD && circle.bellOD > circle.diameter && circle.labelVisibility?.bell && !labelIdsRef.current.bell) {
      const bellEdgeScreen = svgToScreen(circle.x + bellRadiusInPixels, circle.y, zoom, panOffset);
      const labelPos = svgToScreen(circle.x + 100, circle.y - bellRadiusInPixels - 60, zoom, panOffset);
labelIdsRef.current.bell = addLabel('bellOD', {
  position: labelPos,
  targetPosition: bellEdgeScreen,
  value: circle.bellOD.toFixed(3),
  circleId: circle.id,
  labelType: 'bell'
});
    } else if ((!circle.labelVisibility?.bell || !circle.bellOD) && labelIdsRef.current.bell) {
      // Remove label if visibility is disabled or bell is removed
      removeLabel(labelIdsRef.current.bell);
      labelIdsRef.current.bell = null;
    }

    // Create Spacer OD label if spacer exists and visibility is enabled
    if (circle.spacerOD && circle.spacerOD > 0 && circle.labelVisibility?.spacer && !labelIdsRef.current.spacer) {
      const spacerEdgeScreen = svgToScreen(circle.x, circle.y + spacerRadiusInPixels, zoom, panOffset);
      const labelPos = svgToScreen(circle.x - 100, circle.y + spacerRadiusInPixels + 40, zoom, panOffset);
      labelIdsRef.current.spacer = addLabel('spacerOD', {
        position: labelPos,
        targetPosition: spacerEdgeScreen,
        value: circle.spacerOD.toFixed(3)
      });
    } else if ((!circle.labelVisibility?.spacer || !circle.spacerOD) && labelIdsRef.current.spacer) {
      // Remove label if visibility is disabled or spacer is removed
      removeLabel(labelIdsRef.current.spacer);
      labelIdsRef.current.spacer = null;
    }
// Create Spacer Config label if spacer configuration exists and visibility is enabled
    if (circle.selectedSpacer?.spacerName && circle.labelVisibility?.spacerConfig && !labelIdsRef.current.spacerConfig) {
      const spacerEdgeScreen = svgToScreen(circle.x, circle.y + spacerRadiusInPixels, zoom, panOffset);
      const labelPos = svgToScreen(circle.x + 100, circle.y + spacerRadiusInPixels + 40, zoom, panOffset);
      
      // Format configuration as "4 X F41 + 2 X G41"
      const configBreakdown = circle.selectedSpacer.configuration
        ? circle.selectedSpacer.configuration.map(c => `${c.quantity} X ${c.type}`).join(' + ')
        : circle.selectedSpacer.spacerName;
      
      labelIdsRef.current.spacerConfig = addLabel('spacerConfig', {
        position: labelPos,
        targetPosition: spacerEdgeScreen,
        value: configBreakdown
      });
    } else if ((!circle.labelVisibility?.spacerConfig || !circle.selectedSpacer) && labelIdsRef.current.spacerConfig) {
      // Remove label if visibility is disabled or spacer config is removed
      removeLabel(labelIdsRef.current.spacerConfig);
      labelIdsRef.current.spacerConfig = null;
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
  }, [addLabel, circle.labelVisibility, circle.bellOD, circle.spacerOD, circle.selectedSpacer, removeLabel]);
  

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
  }, [circle.x, circle.y, circle.diameter, circle.bellOD, circle.spacerOD, zoom, panOffset, updateLabelTarget]);

  // Update label VALUES when circle data changes
  useEffect(() => {
    if (!updateLabelValue) return;

    // Update Carrier OD label value
    if (labelIdsRef.current.carrier) {
      updateLabelValue(labelIdsRef.current.carrier, circle.diameter.toFixed(3));
    }

    // Update Bell OD label value
    if (labelIdsRef.current.bell && circle.bellOD) {
      updateLabelValue(labelIdsRef.current.bell, circle.bellOD.toFixed(3));
    }

    // Update Spacer OD label value
    if (labelIdsRef.current.spacer && circle.spacerOD) {
      updateLabelValue(labelIdsRef.current.spacer, circle.spacerOD.toFixed(3));
    }

    // Update Spacer Config label value
    if (labelIdsRef.current.spacerConfig && circle.selectedSpacer) {
      const configBreakdown = circle.selectedSpacer.configuration
        ? circle.selectedSpacer.configuration.map(c => `${c.quantity} X ${c.type}`).join(' + ')
        : circle.selectedSpacer.spacerName;
      updateLabelValue(labelIdsRef.current.spacerConfig, configBreakdown);
    }
  }, [circle.diameter, circle.bellOD, circle.spacerOD, circle.selectedSpacer, updateLabelValue]);
  return null; // This hook only manages side effects
};