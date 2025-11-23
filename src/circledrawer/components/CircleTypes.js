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
  [CIRCLE_TYPES.CARRIER_OD]: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
  [CIRCLE_TYPES.CASING]: ['#1e40af', '#0284c7'],
  [CIRCLE_TYPES.BELL_OD]: ['#dc2626', '#ea580c'],
  [CIRCLE_TYPES.SPACER_OD]: ['#16a34a', '#15803d']
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
    label: 'Casing'
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
    minDiameter: 0.25,
    maxDiameter: 20,
    step: 0.25,
    label: 'Spacer OD'
  }
};

// Create a new circle
export const createCircle = (id, x, y, type = CIRCLE_TYPES.CARRIER_OD) => {
  const defaults = CIRCLE_DEFAULTS[type];
  const colors = CIRCLE_COLORS[type];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    id,
    x,
    y,
    diameter: defaults.diameter,
    color: randomColor,
    type: type,
    label: defaults.label
  };
};

// Get circle display properties
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

// Get readable type name
export const getCircleTypeName = (type) => {
  return CIRCLE_DEFAULTS[type]?.label || type;
};
