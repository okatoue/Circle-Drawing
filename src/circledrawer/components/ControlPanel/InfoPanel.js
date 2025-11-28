import React from 'react';
import { getCircleTypeName } from '../CircleTypes';

const InfoPanel = ({ 
  carrierCount, 
  effectiveData, 
  selectedCircleData, 
  showBundleSpacer, 
  calculateBundleSpacerData,
  selectedBundleSpacerId,
  setSelectedBundleSpacerId,
}) => {

  return (
    <>
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

      {showBundleSpacer && effectiveData && effectiveData.effectiveDiameter > 0 && (
        <div className="control-section bundle-spacer-info">
          <h3>Bundle Spacer</h3>
                    {(() => {
            const bundleSpacerData = calculateBundleSpacerData(
              effectiveData.effectiveDiameter,
              selectedBundleSpacerId
            );

            if (bundleSpacerData && bundleSpacerData.validSpacers && bundleSpacerData.validSpacers.length > 0) {
              return (
                <div className="info-item">
                  <span className="info-label">Select Spacer:</span>
                  <select
                    className="info-select"
                    value={selectedBundleSpacerId || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedBundleSpacerId(value === '' ? null : value);
                    }}
                  >
                    <option value="">
                      Auto (recommended)
                    </option>
                    {bundleSpacerData.validSpacers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name || s.spacerName || s.id}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return null;
          })()}

          {(() => {
            const bundleSpacerData = calculateBundleSpacerData(
              effectiveData.effectiveDiameter,
              selectedBundleSpacerId
            );        
            if (!bundleSpacerData || !bundleSpacerData.hasValidSelection) {
              return (
                <div className="info-grid">
                  <div className="info-item" style={{color: 'red'}}>
                    <span className="info-value">No spacer available for Effective OD: {effectiveData.effectiveDiameter.toFixed(2)}"</span>
                  </div>
                </div>
              );
            }
            
            return (
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">
                    Selected Spacer{selectedBundleSpacerId ? ' (manual)' : ' (auto)'}:
                  </span>
                  <span className="info-value">{bundleSpacerData.selectedSpacer?.spacerName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Configuration:</span>
                  <span className="info-value">
                    {bundleSpacerData.configuration?.map(c => `${c.quantity}×${c.type}`).join(' + ')}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total Runners:</span>
                  <span className="info-value">{bundleSpacerData.totalRunners}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Runner Height:</span>
                  <span className="info-value">{bundleSpacerData.runnerHeight?.toFixed(2)}"</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Spacer OD:</span>
                  <span className="info-value">{bundleSpacerData.spacerOD?.toFixed(2)}"</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

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
    </>
  );
};

export default InfoPanel;