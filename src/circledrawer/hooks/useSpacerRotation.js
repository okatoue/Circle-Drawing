/**
 * useSpacerRotation.js - Hook to manage spacer rotation around carrier pipes
 * 
 * This hook provides functionality to rotate spacers 360 degrees around
 * their carrier pipe. The rotation angle is stored per-circle and affects
 * how the spacer runners are positioned.
 */

import { useState, useCallback } from 'react';

/**
 * Custom hook for spacer rotation management
 * 
 * @param {Array} circles - Array of circle objects
 * @param {Function} updateCircle - Function to update a specific circle
 * @returns {Object} Rotation control methods and state
 */
export const useSpacerRotation = (circles, updateCircle) => {
  /**
   * Update the rotation angle for a specific circle
   * 
   * @param {string} circleId - ID of the circle to rotate
   * @param {number} angle - Rotation angle in degrees (0-360)
   */
  const setSpacerRotation = useCallback((circleId, angle) => {
    if (!circleId) return;
    
    // Normalize angle to 0-360 range
    let normalizedAngle = angle % 360;
    if (normalizedAngle < 0) {
      normalizedAngle += 360;
    }
    
    const circle = circles.find(c => c.id === circleId);
    if (!circle) return;
    
    // Update the circle with the new rotation angle
    updateCircle(circleId, {
      ...circle,
      spacerRotation: normalizedAngle
    });
  }, [circles, updateCircle]);
  
  /**
   * Increment rotation by a specific amount
   * 
   * @param {string} circleId - ID of the circle to rotate
   * @param {number} degrees - Degrees to rotate (positive = clockwise)
   */
  const rotateSpacerBy = useCallback((circleId, degrees) => {
    const circle = circles.find(c => c.id === circleId);
    if (!circle) return;
    
    const currentRotation = circle.spacerRotation || 0;
    setSpacerRotation(circleId, currentRotation + degrees);
  }, [circles, setSpacerRotation]);
  
  /**
   * Reset rotation to 0 degrees
   * 
   * @param {string} circleId - ID of the circle to reset
   */
  const resetSpacerRotation = useCallback((circleId) => {
    setSpacerRotation(circleId, 0);
  }, [setSpacerRotation]);
  
  /**
   * Get the current rotation angle for a circle
   * 
   * @param {string} circleId - ID of the circle
   * @returns {number} Current rotation angle in degrees (0-360)
   */
  const getSpacerRotation = useCallback((circleId) => {
    const circle = circles.find(c => c.id === circleId);
    return circle?.spacerRotation || 0;
  }, [circles]);

  return {
    setSpacerRotation,
    rotateSpacerBy,
    resetSpacerRotation,
    getSpacerRotation
  };
};