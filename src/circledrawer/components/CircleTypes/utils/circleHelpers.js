/**
 * circleHelpers.js - Helper functions for circle display and conversions
 */

import { PX_PER_INCH, CIRCLE_DEFAULTS } from '../constants';

/**
 * Get circle display properties
 * @param {Object} circle - Circle object
 * @returns {Object} Display properties (radiusInPixels, diameterInPixels, etc.)
 */
export const getCircleDisplayProps = (circle) => {
  const radiusInPixels = (circle.diameter * PX_PER_INCH) / 2;
  const diameterInPixels = circle.diameter * PX_PER_INCH;
  const defaults = CIRCLE_DEFAULTS[circle.type];
  
  return {
    radiusInPixels,
    diameterInPixels,
    minDiameter: defaults.minDiameter,
    maxDiameter: defaults.maxDiameter,
    step: defaults.step
  };
};

/**
 * Get readable type name
 * @param {string} type - Circle type
 * @returns {string} Human-readable type name
 */
export const getCircleTypeName = (type) => {
  return CIRCLE_DEFAULTS[type]?.label || type;
};

/**
 * Convert inches to pixels using PX_PER_INCH
 * @param {number} inches - Value in inches
 * @returns {number} Value in pixels
 */
export const inchesToPixels = (inches) => {
  return inches * PX_PER_INCH;
};

/**
 * Convert pixels to inches using PX_PER_INCH
 * @param {number} pixels - Value in pixels
 * @returns {number} Value in inches
 */
export const pixelsToInches = (pixels) => {
  return pixels / PX_PER_INCH;
};

/**
 * Get the spacer radius in pixels for rendering
 * @param {Object} circle - Circle with spacerOD
 * @returns {number} Spacer radius in pixels (0 if no spacer)
 */
export const getSpacerRadiusPixels = (circle) => {
  if (!circle.spacerOD || circle.spacerOD <= 0) return 0;
  return (circle.spacerOD / 2) * PX_PER_INCH;
};

/**
 * Get the bell radius in pixels for rendering
 * @param {Object} circle - Circle with bellOD
 * @returns {number} Bell radius in pixels (0 if no bell)
 */
export const getBellRadiusPixels = (circle) => {
  if (!circle.bellOD || circle.bellOD <= 0) return 0;
  return (circle.bellOD / 2) * PX_PER_INCH;
};