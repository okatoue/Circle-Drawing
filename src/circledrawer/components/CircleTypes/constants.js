/**
 * constants.js - Circle type definitions, colors, and default settings
 */

// Conversion: 96 pixels = 1 inch (standard screen DPI)
export const PX_PER_INCH = 96;

// Circle type definitions
export const CIRCLE_TYPES = {
  CARRIER_OD: 'CARRIER_OD',
  CASING: 'CASING',
  BELL_OD: 'BELL_OD',
  SPACER_OD: 'SPACER_OD'
};

// Default colors for each circle type
export const CIRCLE_COLORS = {
  [CIRCLE_TYPES.CARRIER_OD]: '#3b82f6',  // Blue
  [CIRCLE_TYPES.CASING]: '#000000',      // Black for casing outline
  [CIRCLE_TYPES.BELL_OD]: '#ef4444',     // Red
  [CIRCLE_TYPES.SPACER_OD]: '#16a34a'    // Green
};

// Default settings for each circle type
export const CIRCLE_DEFAULTS = {
  [CIRCLE_TYPES.CARRIER_OD]: {
    diameter: 2,
    minDiameter: 0.25,
    maxDiameter: 100,
    step: 0.25,
    label: 'Carrier OD'
  },
 [CIRCLE_TYPES.CASING]: {
  diameter: 10,
  minDiameter: 1,
  maxDiameter: 100,
  step: 0.5,
  label: 'Casing',
  wallThickness: 0.5
},
  [CIRCLE_TYPES.BELL_OD]: {
    diameter: 3,
    minDiameter: 0.5,
    maxDiameter: 50,
    step: 0.25,
    label: 'Bell OD'
  },
  [CIRCLE_TYPES.SPACER_OD]: {
    diameter: 1.5,
    minDiameter: 0,
    maxDiameter: 20,
    step: 0.25,
    label: 'Spacer OD'
  }
};