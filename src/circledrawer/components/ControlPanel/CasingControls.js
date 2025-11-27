import React from 'react';

const CasingControls = ({
  selectedCircleData,
  updateWallThickness
}) => {
  return (
    <>
      <div className="control-group">
        <label>Wall Thickness (inches):</label>
        <input
          type="number"
          value={selectedCircleData?.wallThickness || 0.5}
          onChange={(e) => updateWallThickness(Number(e.target.value))}
          placeholder="0.5"
          min="0.1"
          max="5"
          step="0.1"
          className="diameter-input"
        />
      </div>
      
      <div className="control-group">
        <label>Wall Thickness Slider:</label>
        <input
          type="range"
          value={selectedCircleData?.wallThickness || 0.5}
          onChange={(e) => updateWallThickness(Number(e.target.value))}
          min="0.1"
          max="5"
          step="0.1"
          className="diameter-slider"
        />
      </div>

      <div className="control-group" style={{ marginTop: '15px', padding: '10px', backgroundColor: '#2d2d2d', borderRadius: '6px' }}>
        <div style={{ color: '#a0aec0', fontSize: '0.85rem', marginBottom: '8px' }}>
          Calculated Values:
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.9rem' }}>
          <span>Casing ID:</span>
          <span style={{ fontWeight: 'bold' }}>
            {(selectedCircleData.diameter - 2 * (selectedCircleData.wallThickness || 0.5)).toFixed(2)}"
          </span>
        </div>
      </div>
    </>
  );
};

export default CasingControls;