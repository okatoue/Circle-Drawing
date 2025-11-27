/**
 * SpacerODCircle.jsx - Renders the spacer OD circle with editing
 */

import React from 'react';
import { CIRCLE_COLORS, CIRCLE_TYPES } from '../../CircleTypes';
import { getSpacerLabelText, getSpacerTooltip } from '../utils/helpers';

const SpacerODCircle = ({
  circle,
  spacerRadiusInPixels,
  isSelected,
  zoom,
  editingSpacerOD,
  spacerEditValue,
  spacerInputRef,
  onSpacerDoubleClick,
  onSpacerEditChange,
  onSpacerEditKeyPress,
  onSpacerEditBlur
}) => {
  if (!circle.spacerOD || circle.spacerOD <= 0) {
    return null;
  }

  return (
    <>
      <circle
        cx={circle.x}
        cy={circle.y}
        r={spacerRadiusInPixels}
        fill={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
        fillOpacity="0.1"
        stroke={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
        strokeWidth={2 / zoom}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onSpacerDoubleClick(e, circle.id);
        }}
        style={{ cursor: 'pointer' }}
      >
        <title>{getSpacerTooltip(circle)}</title>
      </circle>

      {isSelected && (
        <line
          x1={circle.x - spacerRadiusInPixels}
          y1={circle.y}
          x2={circle.x + spacerRadiusInPixels}
          y2={circle.y}
          stroke={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
          strokeWidth={1.5 / zoom}
          strokeDasharray={`${5 / zoom},${5 / zoom}`}
          pointerEvents="none"
        />
      )}
{editingSpacerOD === circle.id && (
  <foreignObject
    x={circle.x - 60 / zoom}
    y={circle.y + spacerRadiusInPixels + 10 / zoom}
    width={120 / zoom}
    height={40 / zoom}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <input
        ref={spacerInputRef}
        type="number"
        value={spacerEditValue}
        onChange={onSpacerEditChange}
        onKeyDown={onSpacerEditKeyPress}
        onBlur={onSpacerEditBlur}
        step="0.25"
        min="0"
        max="100"
        style={{
          width: `${100 / zoom}px`,
          padding: `${5 / zoom}px`,
          border: `2px solid ${CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}`,
          borderRadius: '4px',
          fontSize: `${14 / zoom}px`,
          fontWeight: 'bold',
          textAlign: 'center',
          backgroundColor: '#fff'
        }}
      />
    </div>
  </foreignObject>
)}
    </>
  );
};

export default SpacerODCircle;