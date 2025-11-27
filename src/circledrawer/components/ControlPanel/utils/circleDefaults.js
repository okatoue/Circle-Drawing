export const getCircleDefaults = (circleType, defaults) => {
  if (!circleType || !defaults || !defaults[circleType]) {
    return {
      minDiameter: 0.25,
      maxDiameter: 100,
      step: 0.25
    };
  }
  return defaults[circleType];
};

export const getSliderLabels = (circleType, defaults) => {
  const { minDiameter, maxDiameter } = getCircleDefaults(circleType, defaults);
  return {
    min: `${minDiameter}"`,
    max: `${maxDiameter}"`
  };
};