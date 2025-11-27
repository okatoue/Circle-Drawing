import React from 'react';
import { getCircleDefaults, getSliderLabels } from './utils/circleDefaults';

const DiameterInput = ({ label, value, onChange, circleType, defaults }) => {
  const { minDiameter, maxDiameter, step } = getCircleDefaults(circleType, defaults);
  const labels = getSliderLabels(circleType, defaults);

  return (
    <>
      <div className="control-group">
        <label>{label} (inches):</label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={minDiameter}
          max={maxDiameter}
          step={step}
          className="diameter-input"
        />
      </div>

      <div className="control-group">
        <label>{label} Slider:</label>
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={minDiameter}
          max={maxDiameter}
          step={step}
          className="diameter-slider"
        />
        <div className="slider-labels">
          <span>{labels.min}</span>
          <span>{labels.max}</span>
        </div>
      </div>
    </>
  );
};

export default DiameterInput;