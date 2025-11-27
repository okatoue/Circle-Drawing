import React from 'react';

const SpacerRotation = ({
  selectedCircleData,
  setSpacerRotation,
  rotateSpacerBy,
  resetSpacerRotation
}) => {
  if (!selectedCircleData?.spacerOD) {
    return null;
  }

  const currentRotation = Math.round(selectedCircleData?.spacerRotation || 0);

  return (
    <div className="control-group" style={{ marginTop: '15px' }}>
      <label style={{ 
        color: '#e2e8f0',
        fontWeight: '500',
        marginBottom: '8px',
        display: 'block'
      }}>
        Spacer Rotation:
      </label>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '10px'
      }}>
        <input
          type="number"
          value={currentRotation}
          onChange={(e) => setSpacerRotation(selectedCircleData.id, Number(e.target.value))}
          min={0}
          max={360}
          step={1}
          style={{
            flex: '1',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #4a5568',
            background: '#1a202c',
            color: '#fff',
            fontSize: '14px'
          }}
        />
        <span style={{ 
          color: '#cbd5e0',
          fontSize: '14px',
          minWidth: '20px'
        }}>°</span>
        <button
          onClick={() => resetSpacerRotation(selectedCircleData.id)}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #4a5568',
            background: '#2d3748',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Reset
        </button>
      </div>
      
      <input
        type="range"
        value={selectedCircleData?.spacerRotation || 0}
        onChange={(e) => setSpacerRotation(selectedCircleData.id, Number(e.target.value))}
        min={0}
        max={360}
        step={1}
        style={{
          width: '100%',
          cursor: 'pointer'
        }}
        className="diameter-slider"
      />
      
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '8px'
      }}>
        <button
          onClick={() => rotateSpacerBy(selectedCircleData.id, -15)}
          style={{
            flex: '1',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #4a5568',
            background: '#2d3748',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ← 15°
        </button>
        <button
          onClick={() => rotateSpacerBy(selectedCircleData.id, -5)}
          style={{
            flex: '1',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #4a5568',
            background: '#2d3748',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ← 5°
        </button>
        <button
          onClick={() => rotateSpacerBy(selectedCircleData.id, 5)}
          style={{
            flex: '1',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #4a5568',
            background: '#2d3748',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          5° →
        </button>
        <button
          onClick={() => rotateSpacerBy(selectedCircleData.id, 15)}
          style={{
            flex: '1',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #4a5568',
            background: '#2d3748',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          15° →
        </button>
      </div>
      
      <p style={{
        fontSize: '11px',
        color: '#888',
        marginTop: '8px',
        marginBottom: '0'
      }}>
        Rotate the spacer runners around the carrier pipe
      </p>
    </div>
  );
};

export default SpacerRotation;