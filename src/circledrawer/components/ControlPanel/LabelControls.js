import React from 'react';

const LabelControls = ({ effectiveData, addLabel, clearLabels }) => {
  return (
    <div className="control-section">
      <h3>Label Controls</h3>
      
      <div className="button-group">
        <button onClick={() => {
          if (effectiveData) {
            addLabel('effectiveOD', {
              position: { x: 50, y: 50 },
              targetPosition: null,
              value: effectiveData.effectiveDiameter.toFixed(3)
            });
          }
        }} disabled={!effectiveData}>
          Add Effective OD Label
        </button>
      </div>
      
      <div className="button-group">
        <button onClick={clearLabels} className="delete-btn">
          Clear All Labels
        </button>
      </div>
    </div>
  );
};

export default LabelControls;