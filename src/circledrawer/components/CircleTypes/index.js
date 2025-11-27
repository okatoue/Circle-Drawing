/**
 * CircleTypes - Main export barrel file
 * 
 * Enhanced with automatic spacer selection from RACI logic.
 */

// Constants
export {
  PX_PER_INCH,
  CIRCLE_TYPES,
  CIRCLE_COLORS,
  CIRCLE_DEFAULTS
} from './constants';

// Circle factory functions
export {
  createCircle,
  updateCircleSpacer,
  setManualSpacerOD
} from './utils/circleFactory';

// Circle helper functions
export {
  getCircleDisplayProps,
  getCircleTypeName,
  inchesToPixels,
  pixelsToInches,
  getSpacerRadiusPixels,
  getBellRadiusPixels
} from './utils/circleHelpers';