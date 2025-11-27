import React from 'react';

const LabelControls = ({ effectiveData, addLabel, clearLabels, selectedCircleData, toggleLabelVisibility }) => {
  const isCarrierOD = selectedCircleData?.type === 'CARRIER_OD';
  
  return (
    <div className="control-section">
      <h3>Label Controls</h3>
      
      {/* Carrier-specific label toggles */}
      {isCarrierOD && (
        <>
          <div className="control-group">
            <label style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block', color: '#e2e8f0' }}>
              Carrier Labels:
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#e2e8f0' }}>
                <input
                  type="checkbox"
                  checked={selectedCircleData?.labelVisibility?.carrier ?? true}
                  onChange={() => toggleLabelVisibility('carrier')}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.85rem' }}>Carrier OD</span>
              </label>
              
              {selectedCircleData?.bellOD && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#e2e8f0' }}>
                  <input
                    type="checkbox"
                    checked={selectedCircleData?.labelVisibility?.bell ?? true}
                    onChange={() => toggleLabelVisibility('bell')}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.85rem' }}>Bell OD</span>
                </label>
              )}
              
              {selectedCircleData?.spacerOD && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#e2e8f0' }}>
                  <input
                    type="checkbox"
                    checked={selectedCircleData?.labelVisibility?.spacer ?? true}
                    onChange={() => toggleLabelVisibility('spacer')}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.85rem' }}>Spacer OD</span>
                </label>
              )}
              
              {selectedCircleData?.selectedSpacer?.spacerName && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#e2e8f0' }}>
                  <input
                    type="checkbox"
                    checked={selectedCircleData?.labelVisibility?.spacerConfig ?? true}
                    onChange={() => toggleLabelVisibility('spacerConfig')}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.85rem' }}>Spacer Config</span>
                </label>
              )}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #4a5568', margin: '15px 0' }}></div>
        </>
      )}
      
      {/* Effective OD Label */}
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