import React from 'react';
import { CIRCLE_TYPES, CIRCLE_DEFAULTS, getCircleTypeName } from './CircleTypes';

const ControlPanel = ({
  selectedType,
  setSelectedType,
  selectedCircleData,
  updateDiameter,
  updateBellOD,
  updateSpacerOD,
  addCircle,
  deleteCircle,
  circles,
  zoom,
  zoomIn,
  zoomOut,
  resetZoom,
  showEffectiveDiameter,
  setShowEffectiveDiameter,
  showDebugDistances,
  setShowDebugDistances,
  showBundleSpacer,
  setShowBundleSpacer,
  runnerHeight,
  setRunnerHeight,
  effectiveData
}) => {
  // Count carrier OD circles
  const carrierCount = circles.filter(c => c.type === CIRCLE_TYPES.CARRIER_OD).length;

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

            {/* Spacer OD controls */}
            <div className="control-group">
              <label>Spacer OD (inches):</label>
              <input
                type="number"
                value={selectedCircleData?.spacerOD || ''}
                onChange={(e) => updateSpacerOD(Number(e.target.value))}
                placeholder="0 or blank for none"
                min="0"
                max="20"
                step="0.25"
                className="diameter-input"
              />
            </div>
            <div className="control-group">
              <label>Spacer OD Slider:</label>
              <input
                type="range"
                value={selectedCircleData?.spacerOD || 0}
                onChange={(e) => updateSpacerOD(Number(e.target.value))}
                min="0"
                max="20"
                step="0.25"
                className="diameter-slider"
              />
              <div className="slider-labels">
                <span>0"</span>
                <span>20"</span>
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

      {/* Effective Diameter Section */}
      <div className="control-section">
        <h3>Effective Diameter</h3>
        
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showEffectiveDiameter}
              onChange={(e) => setShowEffectiveDiameter(e.target.checked)}
              className="checkbox-input"
            />
            Show Effective OD Boundary
          </label>
        </div>

        {effectiveData && (
          <div className="effective-info">
            <div className="info-row">
              <span className="info-label">Carrier Circles:</span>
              <span className="info-value">{carrierCount}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Effective OD:</span>
              <span className="info-value effective-od">{effectiveData.effectiveDiameter.toFixed(3)} in</span>
            </div>
            <div className="info-row">
              <span className="info-label">Perimeter:</span>
              <span className="info-value">{effectiveData.perimeter.toFixed(3)} in</span>
            </div>
          </div>
        )}
      </div>

      {/* Bundle Spacer Section - NEW */}
      <div className="control-section">
        <h3>Bundle Spacer</h3>
        
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showBundleSpacer}
              onChange={(e) => setShowBundleSpacer(e.target.checked)}
              className="checkbox-input"
            />
            Show Bundle Spacer
          </label>
        </div>

        <div className="control-group">
          <label>Runner Height (inches):</label>
          <input
            type="number"
            value={runnerHeight}
            onChange={(e) => setRunnerHeight(Number(e.target.value))}
            placeholder="Enter runner height"
            min="0"
            max="10"
            step="0.25"
            className="diameter-input"
          />
        </div>

        <div className="control-group">
          <label>Runner Height Slider:</label>
          <input
            type="range"
            value={runnerHeight}
            onChange={(e) => setRunnerHeight(Number(e.target.value))}
            min="0"
            max="10"
            step="0.25"
            className="diameter-slider"
          />
          <div className="slider-labels">
            <span>0"</span>
            <span>10"</span>
          </div>
        </div>

        {runnerHeight > 0 && (
          <div className="effective-info" style={{ marginTop: '10px' }}>
            <div className="info-row">
              <span className="info-label">Runner Height:</span>
              <span className="info-value" style={{ color: '#16a34a' }}>{runnerHeight.toFixed(2)} in</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '8px' }}>
              Creates offset boundary {runnerHeight.toFixed(2)}" from effective OD
            </p>
          </div>
        )}
      </div>

      {/* Debug Section */}
      <div className="control-section">
        <h3>Debug Tools</h3>
        
        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showDebugDistances}
              onChange={(e) => setShowDebugDistances(e.target.checked)}
              className="checkbox-input"
            />
            Show Center Distances
          </label>
        </div>
        
        <div className="debug-info">
          <p style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '8px' }}>
            Shows actual center-to-center distances between circles.
          </p>
          <p style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '4px' }}>
            <span style={{ color: '#00ff00' }}>Green</span> = Touching perfectly
            <br />
            <span style={{ color: '#ff0000' }}>Red</span> = Gap between circles
            <br />
            <span style={{ color: '#ffff00' }}>Yellow</span> = Overlapping
          </p>
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
          <div className="info-content">
            <p><strong>ID:</strong> #{selectedCircleData.id}</p>
            <p><strong>Type:</strong> {selectedCircleData.label}</p>
            <p><strong>Diameter:</strong> {selectedCircleData.diameter.toFixed(2)} in</p>
            <p><strong>Radius:</strong> {(selectedCircleData.diameter / 2).toFixed(2)} in</p>
            {selectedCircleData.bellOD && (
              <p><strong>Bell OD:</strong> {selectedCircleData.bellOD.toFixed(2)} in</p>
            )}
            {selectedCircleData.spacerOD && (
              <p><strong>Spacer OD:</strong> {selectedCircleData.spacerOD.toFixed(2)} in</p>
            )}
            <p><strong>Position:</strong> ({Math.round(selectedCircleData.x)}, {Math.round(selectedCircleData.y)})</p>
            <p><strong>Total Circles:</strong> {circles.length}</p>
          </div>
        ) : (
          <p>No circle selected</p>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;