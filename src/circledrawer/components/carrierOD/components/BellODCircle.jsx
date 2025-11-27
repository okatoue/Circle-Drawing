/**
 * BellODCircle.jsx - Renders the bell OD circle with editing
 */

import React from 'react';
import { CIRCLE_COLORS, CIRCLE_TYPES } from '../../CircleTypes';

const BellODCircle = ({
  circle,
  bellRadiusInPixels,
  isSelected,
  zoom,
  editingBellOD,
  bellEditValue,
  bellInputRef,
  onBellDoubleClick,
  onBellEditChange,
  onBellEditKeyPress,
  onBellEditBlur
}) => {
  if (!circle.bellOD || circle.bellOD <= circle.diameter) {
    return null;
  }

  return (
    <>
      <circle
        cx={circle.x}
        cy={circle.y}
        r={bellRadiusInPixels}
        fill="none"
        stroke={CIRCLE_COLORS[CIRCLE_TYPES.BELL_OD]}
        strokeWidth={2 / zoom}
        strokeDasharray={`${8 / zoom},${4 / zoom}`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onBellDoubleClick(e, circle.id);
        }}
        style={{ cursor: 'pointer' }}
        pointerEvents="stroke"
      />

      {isSelected && (
        <line
          x1={circle.x - bellRadiusInPixels}
          y1={circle.y}
          x2={circle.x + bellRadiusInPixels}
          y2={circle.y}
          stroke={CIRCLE_COLORS[CIRCLE_TYPES.BELL_OD]}
          strokeWidth={1.5 / zoom}
          strokeDasharray={`${5 / zoom},${5 / zoom}`}
          pointerEvents="none"
        />
      )}

      {editingBellOD === circle.id ? (
        <foreignObject
          x={circle.x - 50 / zoom}
          y={circle.y - bellRadiusInPixels - 45 / zoom}
          width={100 / zoom}
          height={40 / zoom}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input
              ref={bellInputRef}
              type="number"
              value={bellEditValue}
              onChange={onBellEditChange}
              onKeyDown={onBellEditKeyPress}
              onBlur={onBellEditBlur}
              step="0.25"
              min="0"
              max="100"
              style={{
                width: `${80 / zoom}px`,
                padding: `${5 / zoom}px`,
                border: `2px solid ${CIRCLE_COLORS[CIRCLE_TYPES.BELL_OD]}`,
                borderRadius: '4px',
                fontSize: `${14 / zoom}px`,
                fontWeight: 'bold',
                textAlign: 'center',
                backgroundColor: '#fff'
              }}
            />
          </div>
        </foreignObject>
      ) : (
        <text
          x={circle.x}
          y={circle.y - bellRadiusInPixels - 10 / zoom}
          textAnchor="middle"
          fill={CIRCLE_COLORS[CIRCLE_TYPES.BELL_OD]}
          fontSize={13 / zoom}
          fontWeight="bold"
          onDoubleClick={(e) => {
            e.stopPropagation();
            onBellDoubleClick(e, circle.id);
          }}
          style={{ cursor: 'pointer' }}
        >
          Bell ø{circle.bellOD.toFixed(2)}"
        </text>
      )}
    </>
  );
};

export default BellODCircle;