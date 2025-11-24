/**
 * useCircleManagement.js - Circle state management with RACI spacer integration
 * 
 * This hook manages all circle operations and automatically selects spacers
 * based on carrier OD and bell OD using RACI's spacer selection logic.
 * 
 * KEY: When a spacer is selected, it includes the `configuration` array
 * which tells us which element types (F25, G25, etc.) make up the spacer.
 * This configuration is used by SpacerRunners to draw the visual runners.
 */

import { useState, useCallback } from 'react';
import { CIRCLE_TYPES, CIRCLE_DEFAULTS, createCircle } from '../components/CircleTypes';
import { selectSpacerForPipe, getValidSpacersForPipe, getSpacerById } from '../utils/spacerSelection';

// Helper to get element configuration for a spacer
const getConfigurationForSpacer = (spacerId, carrierOD) => {
  if (!spacerId || !carrierOD) return [];
  
  try {
    const spacerData = require('../utils/spacerData.json');
    const spacer = spacerData.find(s => s.id === spacerId);
    if (!spacer) return [];
    
    // Find the matching range
    const range = spacer.carrierODRanges.find(
      r => carrierOD >= r.min && carrierOD <= r.max
    );
    
    if (!range || !range.elements) return [];
    
    // Convert to array format
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
    // Create initial circle with auto-spacer selection
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

  /**
   * Update spacer selection for a circle based on its dimensions
   */
  const updateCircleSpacer = useCallback((circleId, carrierOD, bellOD) => {
    setCircles(prevCircles => prevCircles.map(circle => {
      if (circle.id !== circleId) return circle;
      if (!circle.autoSpacerEnabled) return circle;
      
      const spacerResult = selectSpacerForPipe({
        carrierOD: carrierOD,
        bellOD: bellOD || 0
      });
      
      if (spacerResult) {
        return {
          ...circle,
          selectedSpacer: spacerResult,
          spacerOD: spacerResult.spacerOuterDiameter
        };
      } else {
        return {
          ...circle,
          selectedSpacer: null,
          spacerOD: null
        };
      }
    }));
  }, []);

  /**
   * Add a new circle
   */
  const addCircle = useCallback((commandData = null) => {
    const newId = Math.max(...circles.map(c => c.id), 0) + 1;
    
    let bellOD = null;
    let spacerOD = null;
    let diameter = CIRCLE_DEFAULTS[selectedType].diameter;
    
    // If command data is provided (from command line), use it
    if (commandData && selectedType === CIRCLE_TYPES.CARRIER_OD) {
      diameter = commandData.carrierDiameter;
      bellOD = commandData.bellOD;
      spacerOD = commandData.spacerOD;
    }
    
    // Create the circle
    const newCircle = createCircle(
      newId, 
      200 + Math.random() * 200, 
      200 + Math.random() * 200, 
      selectedType, 
      bellOD,
      spacerOD
    );
    
    // Override the diameter if provided
    if (commandData && commandData.carrierDiameter) {
      newCircle.diameter = diameter;
    }
    
    // Auto-select spacer for CARRIER_OD circles
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
    
    setCircles(prev => [...prev, newCircle]);
    setSelectedCircle(newId);
  }, [circles, selectedType]);

  /**
   * Delete selected circle
   */
  const deleteCircle = useCallback(() => {
    if (circles.length > 1) {
      const filteredCircles = circles.filter(c => c.id !== selectedCircle);
      setCircles(filteredCircles);
      setSelectedCircle(filteredCircles[0]?.id || null);
    }
  }, [circles, selectedCircle]);

  /**
   * Update diameter and recalculate spacer if auto-enabled
   */
  const updateDiameter = useCallback((newDiameter) => {
    setCircles(prevCircles => prevCircles.map(circle => {
      if (circle.id !== selectedCircle) return circle;
      
      const defaults = CIRCLE_DEFAULTS[circle.type];
      const clampedDiameter = Math.max(defaults.minDiameter, Math.min(defaults.maxDiameter, newDiameter));
      
      // If auto-spacer is enabled, recalculate spacer
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
    }));
  }, [selectedCircle]);

  /**
   * Update bell OD and recalculate spacer if auto-enabled
   */
  const updateBellOD = useCallback((newBellOD) => {
    setCircles(prevCircles => prevCircles.map(circle => {
      if (circle.id !== selectedCircle) return circle;
      if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return circle;
      
      const bellValue = newBellOD > 0 ? newBellOD : null;
      
      // If auto-spacer is enabled, recalculate spacer
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
    }));
  }, [selectedCircle]);

  /**
   * Update spacer OD manually (disables auto-selection)
   */
  const updateSpacerOD = useCallback((newSpacerOD) => {
    setCircles(prevCircles => prevCircles.map(circle => {
      if (circle.id !== selectedCircle) return circle;
      if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return circle;
      
      // If setting to null/0, re-enable auto-selection
      if (!newSpacerOD || newSpacerOD <= 0) {
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
      
      // Manual spacer OD - disable auto-selection
      return {
        ...circle,
        spacerOD: newSpacerOD,
        autoSpacerEnabled: false,
        selectedSpacer: null  // Clear selected spacer when manual
      };
    }));
  }, [selectedCircle]);

  /**
   * Toggle auto-spacer selection on/off
   */
  const toggleAutoSpacer = useCallback(() => {
    setCircles(prevCircles => prevCircles.map(circle => {
      if (circle.id !== selectedCircle) return circle;
      if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return circle;
      
      const newAutoEnabled = !circle.autoSpacerEnabled;
      
      if (newAutoEnabled) {
        // Re-enable auto: recalculate spacer
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
      } else {
        // Disable auto: keep current spacerOD but clear selectedSpacer
        return {
          ...circle,
          autoSpacerEnabled: false,
          selectedSpacer: null
        };
      }
    }));
  }, [selectedCircle]);

  /**
   * Manually select a specific spacer by ID
   */
  const selectSpacerById = useCallback((spacerId) => {
    setCircles(prevCircles => prevCircles.map(circle => {
      if (circle.id !== selectedCircle) return circle;
      if (circle.type !== CIRCLE_TYPES.CARRIER_OD) return circle;
      
      const spacer = getSpacerById(spacerId);
      if (!spacer) return circle;
      
      const spacerOD = circle.diameter + spacer.fixedRunnerHeight * 2;
      const bellClearance = circle.bellOD ? (spacerOD - circle.bellOD) / 2 : null;
      const configuration = getConfigurationForSpacer(spacerId, circle.diameter);
      
      return {
        ...circle,
        autoSpacerEnabled: false,  // Disable auto when manually selecting
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
    }));
  }, [selectedCircle]);

  /**
   * Get valid spacers for the currently selected circle
   */
  const getValidSpacersForSelectedCircle = useCallback(() => {
    const circle = circles.find(c => c.id === selectedCircle);
    if (!circle || circle.type !== CIRCLE_TYPES.CARRIER_OD) return [];
    
    return getValidSpacersForPipe({
      carrierOD: circle.diameter,
      bellOD: circle.bellOD || 0
    });
  }, [circles, selectedCircle]);

  // Get currently selected circle data
  const selectedCircleData = circles.find(c => c.id === selectedCircle);

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
    // NEW: Spacer-related functions
    toggleAutoSpacer,
    selectSpacerById,
    getValidSpacersForSelectedCircle,
    updateCircleSpacer
  };
};