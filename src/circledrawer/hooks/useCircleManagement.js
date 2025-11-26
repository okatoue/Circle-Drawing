/**
 * useCircleManagement.js - Circle state management with RACI spacer integration
 */

import { useState, useCallback } from 'react';
import { CIRCLE_TYPES, CIRCLE_DEFAULTS, createCircle } from '../components/CircleTypes';
import { selectSpacerForPipe, getValidSpacersForPipe, getSpacerById } from '../utils/spacerSelection';

const getConfigurationForSpacer = (spacerId, carrierOD) => {
  if (!spacerId || !carrierOD) return [];

  try {
    const spacerData = require('../utils/spacerData.json');
    const spacer = spacerData.find((s) => s.id === spacerId);
    if (!spacer) return [];

    const range = spacer.carrierODRanges.find(
      (r) => carrierOD >= r.min && carrierOD <= r.max
    );

    if (!range || !range.elements) return [];

    return Object.entries(range.elements).map(([type, quantity]) => ({
      type,
      quantity
    }));
  } catch (e) {
    console.error('Error getting configuration:', e);
    return [];
  }
};

export const useCircleManagement = () => {
  const [circles, setCircles] = useState(() => {
    const initialCircle = createCircle(1, 300, 300, CIRCLE_TYPES.CARRIER_OD);
    const spacerResult = selectSpacerForPipe({
      carrierOD: initialCircle.diameter,
      bellOD: initialCircle.bellOD || 0
    });

    if (spacerResult) {
      initialCircle.selectedSpacer = spacerResult;
      initialCircle.spacerOD = spacerResult.spacerOuterDiameter;
      initialCircle.autoSpacerEnabled = true;
    }

    return [initialCircle];
  });

  const [selectedCircle, setSelectedCircle] = useState(1);
  const [selectedType, setSelectedType] = useState(CIRCLE_TYPES.CARRIER_OD);

  const updateCircleSpacer = useCallback((circleId, carrierOD, bellOD) => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) => {
        if (circle.id !== circleId) return circle;
        if (!circle.autoSpacerEnabled) return circle;

        const spacerResult = selectSpacerForPipe({
          carrierOD,
          bellOD: bellOD || 0
        });

        if (spacerResult) {
          return {
            ...circle,
            selectedSpacer: spacerResult,
            spacerOD: spacerResult.spacerOuterDiameter
          };
        }

        return {
          ...circle,
          selectedSpacer: null,
          spacerOD: null
        };
      })
    );
  }, []);

  const addCircle = useCallback(
    (commandData = null) => {
      const newId = Math.max(...circles.map((c) => c.id), 0) + 1;

      let bellOD = null;
      let spacerOD = null;
      let diameter = CIRCLE_DEFAULTS[selectedType].diameter;

      if (commandData && selectedType === CIRCLE_TYPES.CARRIER_OD) {
        diameter = commandData.carrierDiameter;
        bellOD = commandData.bellOD;
        spacerOD = commandData.spacerOD;
      }

      const newCircle = createCircle(
        newId,
        200 + Math.random() * 200,
        200 + Math.random() * 200,
        selectedType,
        bellOD,
        spacerOD
      );

      if (commandData && commandData.carrierDiameter) {
        newCircle.diameter = diameter;
      }

      if (newCircle.type === CIRCLE_TYPES.CARRIER_OD) {
        const spacerResult = selectSpacerForPipe({
          carrierOD: newCircle.diameter,
          bellOD: newCircle.bellOD || 0
        });

        if (spacerResult) {
          newCircle.selectedSpacer = spacerResult;
          newCircle.spacerOD = spacerResult.spacerOuterDiameter;
          newCircle.autoSpacerEnabled = true;
        }
      }

      setCircles((prev) => [...prev, newCircle]);
      setSelectedCircle(newId);
    },
    [circles, selectedType]
  );

  const deleteCircle = useCallback(() => {
    if (circles.length > 1) {
      const filteredCircles = circles.filter((c) => c.id !== selectedCircle);
      setCircles(filteredCircles);
      setSelectedCircle(filteredCircles[0]?.id || null);
    }
  }, [circles, selectedCircle]);

  const updateDiameter = useCallback(
    (newDiameter) => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => {
          if (circle.id !== selectedCircle) return circle;

          const defaults = CIRCLE_DEFAULTS[circle.type];
          const clampedDiameter = Math.max(
            defaults.minDiameter,
            Math.min(defaults.maxDiameter, newDiameter)
          );

          if (circle.autoSpacerEnabled && circle.type === CIRCLE_TYPES.CARRIER_OD) {
            const spacerResult = selectSpacerForPipe({
              carrierOD: clampedDiameter,
              bellOD: circle.bellOD || 0
            });

            return {
              ...circle,
              diameter: clampedDiameter,
              selectedSpacer: spacerResult,
              spacerOD: spacerResult?.spacerOuterDiameter || null
            };
          }

          return { ...circle, diameter: clampedDiameter };
        })
      );
    },
    [selectedCircle]
  );

  const updateBellOD = useCallback(
    (newBellOD) => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => {
          if (circle.id !== selectedCircle) return circle;
          if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return circle;

          const bellValue = newBellOD > 0 ? newBellOD : null;

          if (circle.autoSpacerEnabled) {
            const spacerResult = selectSpacerForPipe({
              carrierOD: circle.diameter,
              bellOD: bellValue || 0
            });

            return {
              ...circle,
              bellOD: bellValue,
              selectedSpacer: spacerResult,
              spacerOD: spacerResult?.spacerOuterDiameter || null
            };
          }

          return { ...circle, bellOD: bellValue };
        })
      );
    },
    [selectedCircle]
  );

  const updateSpacerOD = useCallback(
    (newSpacerOD) => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => {
          if (circle.id !== selectedCircle) return circle;
          if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return circle;

          if (!newSpacerOD || newSpacerOD <= 0) {
            return {
              ...circle,
              autoSpacerEnabled: false,
              selectedSpacer: null,
              spacerOD: null
            };
          }

          return {
            ...circle,
            spacerOD: newSpacerOD,
            autoSpacerEnabled: false,
            selectedSpacer: null
          };
        })
      );
    },
    [selectedCircle]
  );

  const updateCircle = useCallback((circleId, updates) => {
    setCircles((prevCircles) =>
      prevCircles.map((circle) => {
        if (circle.id !== circleId) return circle;
        return { ...circle, ...updates };
      })
    );
  }, []);

  const updateBypassBellSpacer = useCallback(
    (enabled) => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => {
          if (circle.id !== selectedCircle) return circle;
          if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return circle;

          return {
            ...circle,
            bypassBellSpacer: enabled
          };
        })
      );
    },
    [selectedCircle]
  );

  const toggleAutoSpacer = useCallback(
    () => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => {
          if (circle.id !== selectedCircle) return circle;
          if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return circle;

          const newAutoEnabled = !circle.autoSpacerEnabled;

          if (newAutoEnabled) {
            const spacerResult = selectSpacerForPipe({
              carrierOD: circle.diameter,
              bellOD: circle.bellOD || 0
            });

            return {
              ...circle,
              autoSpacerEnabled: true,
              selectedSpacer: spacerResult,
              spacerOD: spacerResult?.spacerOuterDiameter || null
            };
          }

          return {
            ...circle,
            autoSpacerEnabled: false,
            selectedSpacer: null
          };
        })
      );
    },
    [selectedCircle]
  );

  const selectSpacerById = useCallback(
    (spacerId) => {
      setCircles((prevCircles) =>
        prevCircles.map((circle) => {
          if (circle.id !== selectedCircle) return circle;
          if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return circle;

          const spacer = getSpacerById(spacerId);
          if (!spacer) return circle;

          const spacerOD = circle.diameter + spacer.fixedRunnerHeight * 2;
          const bellClearance = circle.bellOD ? (spacerOD - circle.bellOD) / 2 : null;
          const configuration = getConfigurationForSpacer(spacerId, circle.diameter);

          return {
            ...circle,
            autoSpacerEnabled: false,
            selectedSpacer: {
              spacerId: spacer.id,
              spacerName: spacer.name,
              runnerHeight: spacer.fixedRunnerHeight,
              spacerOuterDiameter: spacerOD,
              bellClearance,
              configuration
            },
            spacerOD
          };
        })
      );
    },
    [selectedCircle]
  );

  const getValidSpacersForSelectedCircle = useCallback(
    () => {
      const circle = circles.find((c) => c.id === selectedCircle);
      if (!circle || circle.type !== CIRCLE_TYPES.CARRIER_OD) return [];

      return getValidSpacersForPipe({
        carrierOD: circle.diameter,
        bellOD: circle.bellOD || 0
      });
    },
    [circles, selectedCircle]
  );

  const selectedCircleData = circles.find((c) => c.id === selectedCircle);

  return {
    circles,
    setCircles,
    selectedCircle,
    setSelectedCircle,
    selectedType,
    setSelectedType,
    selectedCircleData,
    addCircle,
    deleteCircle,
    updateDiameter,
    updateBellOD,
    updateSpacerOD,
    updateCircle,
    toggleAutoSpacer,
    selectSpacerById,
    getValidSpacersForSelectedCircle,
    updateCircleSpacer,
    updateBypassBellSpacer
  };
};
