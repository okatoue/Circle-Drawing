export const getBellClearanceColor = (clearance) => {
  if (clearance >= 0.6) return '#16a34a'; // green
  if (clearance >= 0.4) return '#ca8a04'; // yellow
  return '#dc2626'; // red
};

export const getSliderLabels = (circleType, defaults) => {
  if (!circleType || !defaults || !defaults[circleType]) {
    return { min: '0.25"', max: '100"' };
  }
  
  const { minDiameter, maxDiameter } = defaults[circleType];
  return {
    min: `${minDiameter}"`,
    max: `${maxDiameter}"`
  };
};

export const normalizeRotation = (degrees) => {
  const normalized = degrees % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};