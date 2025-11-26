/**
 * ControlPanel.js - Left sidebar UI controls
 *
 * Enhanced with spacer selection controls from RACI logic.
 * Shows available spacers and allows manual selection or auto-mode.
 */

import React from 'react';
import { CIRCLE_TYPES, CIRCLE_DEFAULTS, getCircleTypeName } from './CircleTypes';

const ControlPanel = ({
  selectedType,
  setSelectedType,
  selectedCircleData,
  updateDiameter,
  updateBellOD,
  updateSpacerOD,
  updateCircle,
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
  effectiveData,
  toggleAutoSpacer,
  selectSpacerById,
  getValidSpacersForSelectedCircle,
  showBundleSpacerRunners,
  setShowBundleSpacerRunners,
  updateBypassBellSpacer
}) => {
  const carrierCount = circles.filter((c) => c.type === CIRCLE_TYPES.CARRIER_OD).length;

  const validSpacers = selectedCircleData?.type === CIRCLE_TYPES.CARRIER_OD
    ? (getValidSpacersForSelectedCircle ? getValidSpacersForSelectedCircle() : [])
    : [];

  return (
    <div className="controls-panel">
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
            </div>

            <div
              style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#2d2d2d',
                borderRadius: '8px',
                border: '1px solid #444'
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  color: '#fff'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedCircleData.bypassBellSpacer || false}
                  onChange={(e) => {
                    if (updateBypassBellSpacer) {
                      updateBypassBellSpacer(e.target.checked);
                    }
                  }}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '14px' }}>
                  Bypass Bell/Spacer Rules
                </span>
              </label>
              <p
                style={{
                  fontSize: '11px',
                  color: '#888',
                  marginTop: '5px',
                  marginBottom: '0'
                }}
              >
                When checked, this carrier can enter other spacer territories
                (bells and other carriers still block movement)
              </p>
            </div>

            <div className="control-section spacer-section">
              <h4>Spacer Selection (RACI)</h4>

              <div className="control-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCircleData?.autoSpacerEnabled ?? true}
                    onChange={() => toggleAutoSpacer && toggleAutoSpacer()}
                  />
                  Auto-select spacer
                </label>
              </div>

              <div className="control-group">
                <label>Spacer Model:</label>
                <select
                  value={selectedCircleData?.selectedSpacer?.spacerId || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) {
                      updateCircle(selectedCircleData.id, {
                        autoSpacerEnabled: false,
                        selectedSpacer: null,
                        spacerOD: null
                      });
                      return;
                    }

                    const spacerId = parseInt(value, 10);
                    if (selectSpacerById && spacerId) {
                      selectSpacerById(spacerId);
                    }
                  }}
                  className="spacer-select"
                >
                  <option value="">No spacer</option>
                  {validSpacers.map((spacer) => (
                    <option key={spacer.id} value={spacer.id}>
                      {spacer.name} (OD: {spacer.spacerOD.toFixed(2)}")
                    </option>
                  ))}
                </select>
              </div>

              {selectedCircleData?.selectedSpacer && (
                <div className="spacer-info">
                  <div className="info-row">
                    <span className="info-label">Model:</span>
                    <span className="info-value">{selectedCircleData.selectedSpacer.spacerName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Runner Height:</span>
                    <span className="info-value">{selectedCircleData.selectedSpacer.runnerHeight}"</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Spacer OD:</span>
                    <span className="info-value">{selectedCircleData.spacerOD?.toFixed(2)}"</span>
                  </div>
                  {selectedCircleData.selectedSpacer.bellClearance !== null && (
                    <div className="info-row">
                      <span className="info-label">Bell Clearance:</span>
                      <span
                        className="info-value"
                        style={{
                          color:
                            selectedCircleData.selectedSpacer.bellClearance >= 0.6
                              ? '#16a34a'
                              : selectedCircleData.selectedSpacer.bellClearance >= 0.4
                                ? '#ca8a04'
                                : '#dc2626'
                        }}
                      >
                        {selectedCircleData.selectedSpacer.bellClearance.toFixed(2)}"
                      </span>
                    </div>
                  )}
                </div>
              )}

              {validSpacers.length === 0 && selectedCircleData?.diameter > 0 && (
                <div className="warning-message">
                  No spacers available for this carrier OD
                  {selectedCircleData?.bellOD > 0 && ' and bell OD combination'}
                </div>
              )}

              {!selectedCircleData?.autoSpacerEnabled && (
                <div className="control-group">
                  <label>Manual Spacer OD:</label>
                  <input
                    type="number"
                    value={selectedCircleData?.spacerOD || ''}
                    onChange={(e) => updateSpacerOD(Number(e.target.value))}
                    placeholder="0 or blank for none"
                    min="0"
                    max="100"
                    step="0.25"
                    className="diameter-input"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div className="button-group">
          <button onClick={() => addCircle()} className="add-btn">
            Add Circle
          </button>
          <button onClick={deleteCircle} className="delete-btn" disabled={circles.length <= 1}>
            Delete
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>View Controls</h3>
        <div className="button-group">
          <button onClick={zoomIn}>Zoom In</button>
          <button onClick={zoomOut}>Zoom Out</button>
          <button onClick={resetZoom}>Reset</button>
        </div>
        <div className="zoom-level">Zoom: {(zoom * 100).toFixed(0)}%</div>
      </div>

      <div className="control-section">
        <h3>Display Options</h3>

        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showEffectiveDiameter}
              onChange={(e) => setShowEffectiveDiameter(e.target.checked)}
            />
            Show Effective Diameter
          </label>
        </div>

        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showDebugDistances}
              onChange={(e) => setShowDebugDistances(e.target.checked)}
            />
            Show Debug Distances
          </label>
        </div>

        <div className="control-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showBundleSpacer}
              onChange={(e) => setShowBundleSpacer(e.target.checked)}
            />
            Show Bundle Spacer
          </label>
        </div>

        {showBundleSpacer && (
          <div className="control-group">
            <label>Bundle Runner Height (in):</label>
            <input
              type="number"
              value={runnerHeight}
              onChange={(e) => setRunnerHeight(Number(e.target.value))}
              min="0"
              max="10"
              step="0.25"
              className="diameter-input"
            />
          </div>
        )}
      </div>

      <div className="control-section info-section">
        <h3>Info</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Carriers:</span>
            <span className="info-value">{carrierCount}</span>
          </div>
          {effectiveData && (
            <>
              <div className="info-item">
                <span className="info-label">Effective OD:</span>
                <span className="info-value">{effectiveData.effectiveDiameter.toFixed(2)}"</span>
              </div>
              <div className="info-item">
                <span className="info-label">Perimeter:</span>
                <span className="info-value">{effectiveData.perimeter.toFixed(2)}"</span>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedCircleData && (
        <div className="control-section selected-info">
          <h3>Selected: #{selectedCircleData.id}</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">{getCircleTypeName(selectedCircleData.type)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Carrier OD:</span>
              <span className="info-value">{selectedCircleData.diameter.toFixed(2)}"</span>
            </div>
            {selectedCircleData.bellOD && (
              <div className="info-item">
                <span className="info-label">Bell OD:</span>
                <span className="info-value">{selectedCircleData.bellOD.toFixed(2)}"</span>
              </div>
            )}
            {selectedCircleData.spacerOD && (
              <div className="info-item">
                <span className="info-label">Spacer OD:</span>
                <span className="info-value">{selectedCircleData.spacerOD.toFixed(2)}"</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
