import React from 'react';

const BellODControls = ({
  selectedCircleData,
  updateBellOD,
  updateBypassBellSpacer,
  updateExcludeFromEffectiveOD
}) => {
  return (
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

      <div className="control-group" style={{ marginTop: '10px' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: '#e2e8f0',
            fontWeight: '500'
          }}
        >
          <input
            type="checkbox"
            checked={selectedCircleData?.excludeFromEffectiveOD || false}
            onChange={(e) => updateExcludeFromEffectiveOD && updateExcludeFromEffectiveOD(e.target.checked)}
            style={{
              width: '18px',
              height: '18px',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '14px' }}>
            Exclude from Effective OD
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
          When checked, this carrier is removed from the effective OD boundary calculation
        </p>
      </div>
    </>
  );
};

export default BellODControls;