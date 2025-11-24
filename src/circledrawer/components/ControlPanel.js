import React from 'react';
import { CIRCLE_TYPES, CIRCLE_DEFAULTS, getCircleTypeName } from './CircleTypes';

const ControlPanel = ({
  selectedType,
  setSelectedType,
  selectedCircleData,
  updateDiameter,
  updateBellOD,  
  addCircle,
  deleteCircle,
  circles,
  zoom,
  zoomIn,
  zoomOut,
  resetZoom
}) => {
  return (
    <div className="controls-panel">
      {/* Circle Controls Section */}
      <div className="control-section">
        <h3>Circle Controls</h3>
        
        <div className="control-group">
          <label>Circle Type:</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-select"
          >
            <option value={CIRCLE_TYPES.CARRIER_OD}>Carrier OD</option>
            <option value={CIRCLE_TYPES.CASING}>Casing</option>
            <option value={CIRCLE_TYPES.BELL_OD}>Bell OD</option>
            <option value={CIRCLE_TYPES.SPACER_OD}>Spacer OD</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Diameter (inches):</label>
          <input
            type="number"
            value={selectedCircleData?.diameter || 2}
            onChange={(e) => updateDiameter(Number(e.target.value))}
            min={selectedCircleData ? CIRCLE_DEFAULTS[selectedCircleData.type].minDiameter : 0.25}
            max={selectedCircleData ? CIRCLE_DEFAULTS[selectedCircleData.type].maxDiameter : 100}
            step={selectedCircleData ? CIRCLE_DEFAULTS[selectedCircleData.type].step : 0.25}
            className="diameter-input"
          />
        </div>

        <div className="control-group">
          <label>Diameter Slider:</label>
          <input
            type="range"
            value={selectedCircleData?.diameter || 2}
            onChange={(e) => updateDiameter(Number(e.target.value))}
            min={selectedCircleData ? CIRCLE_DEFAULTS[selectedCircleData.type].minDiameter : 0.25}
            max={selectedCircleData ? CIRCLE_DEFAULTS[selectedCircleData.type].maxDiameter : 100}
            step={selectedCircleData ? CIRCLE_DEFAULTS[selectedCircleData.type].step : 0.25}
            className="diameter-slider"
          />
          <div className="slider-labels">
            <span>{selectedCircleData ? CIRCLE_DEFAULTS[selectedCircleData.type].minDiameter : 0.25}"</span>
            <span>{selectedCircleData ? CIRCLE_DEFAULTS[selectedCircleData.type].maxDiameter : 100}"</span>
          </div>
        </div>

        {/* Bell OD controls - only show for Carrier OD */}
        {selectedCircleData && selectedCircleData.type === CIRCLE_TYPES.CARRIER_OD && (
          <>
            <div className="control-group">
              <label>Bell OD (inches):</label>
              <input
                type="number"
                value={selectedCircleData?.bellOD || ''}
                onChange={(e) => updateBellOD(Number(e.target.value))}
                placeholder="0 or blank for none"
                min="0"
                max="100"
                step="0.25"
                className="diameter-input"
              />
            </div>
            <div className="control-group">
              <label>Bell OD Slider:</label>
              <input
                type="range"
                value={selectedCircleData?.bellOD || 0}
                onChange={(e) => updateBellOD(Number(e.target.value))}
                min="0"
                max="100"
                step="0.25"
                className="diameter-slider"
              />
              <div className="slider-labels">
                <span>0"</span>
                <span>100"</span>
              </div>
            </div>
          </>
        )}

        <div className="button-group">
          <button onClick={addCircle} className="btn btn-primary">
            Add {getCircleTypeName(selectedType)}
          </button>
          <button 
            onClick={deleteCircle} 
            className="btn btn-danger"
            disabled={!circles || circles.length <= 1}
          >
            Delete Circle
          </button>
        </div>
      </div>

      {/* View Controls Section */}
      <div className="control-section">
        <h3>View Controls</h3>
        
        <div className="zoom-display">
          <label>Zoom: {(zoom * 100).toFixed(0)}%</label>
        </div>

        <div className="button-group">
          <button onClick={zoomIn} className="btn btn-secondary">
            Zoom In (+)
          </button>
          <button onClick={zoomOut} className="btn btn-secondary">
            Zoom Out (-)
          </button>
          <button onClick={resetZoom} className="btn btn-secondary">
            Reset View
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <h4>Circle Info</h4>
        {selectedCircleData ? (
          <>
            <div className="info-item">
              <span>Type:</span>
              <span className="info-value">{selectedCircleData.label}</span>
            </div>
            <div className="info-item">
              <span>Selected:</span>
              <span className="info-value">#{selectedCircleData.id}</span>
            </div>
            <div className="info-item">
              <span>Diameter:</span>
              <span className="info-value">{selectedCircleData.diameter.toFixed(2)} in</span>
            </div>
            <div className="info-item">
              <span>Radius:</span>
              <span className="info-value">{(selectedCircleData.diameter / 2).toFixed(2)} in</span>
            </div>
            {selectedCircleData.bellOD && (
              <div className="info-item">
                <span>Bell OD:</span>
                <span className="info-value">{selectedCircleData.bellOD.toFixed(2)} in</span>
              </div>
            )}
            <div className="info-item">
              <span>Position:</span>
              <span className="info-value">
                ({selectedCircleData.x.toFixed(0)}, {selectedCircleData.y.toFixed(0)})
              </span>
            </div>
          </>
        ) : (
          <div className="info-item">
            <span className="info-value">No circle selected</span>
          </div>
        )}
        <div className="info-item">
          <span>Total Circles:</span>
          <span className="info-value">{circles?.length || 0}</span>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="instructions">
        <h4>Instructions</h4>
        <ul>
          <li>Click to select a circle</li>
          <li>Drag circles to move</li>
          <li>Double-click to edit diameter</li>
          <li>Mouse wheel to zoom</li>
          <li>Shift+Drag to pan view</li>
          <li>Circles snap when touching</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;