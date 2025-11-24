import React from 'react';
import { getCircleDisplayProps, CIRCLE_COLORS, CIRCLE_TYPES } from './CircleTypes';

const CarrierOD = ({ 
  circle, 
  isSelected, 
  zoom,
  editingCircle,
  editValue,
  inputRef,
  onMouseDown,
  onDoubleClick,
  onEditChange,
  onEditKeyPress,
  onEditBlur,
  isDragging 
}) => {
  const { radiusInPixels } = getCircleDisplayProps(circle);

  return (
    <g>
      {/* Circle */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={radiusInPixels}
        fill={circle.color}
        fillOpacity="0.3"
        stroke={isSelected ? '#000' : circle.color}
        strokeWidth={isSelected ? 3 / zoom : 2 / zoom}
        onMouseDown={(e) => onMouseDown(e, circle.id)}
        onDoubleClick={(e) => onDoubleClick(e, circle.id)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Center point */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={4 / zoom}
        fill="#000"
        onMouseDown={(e) => onMouseDown(e, circle.id)}
        onDoubleClick={(e) => onDoubleClick(e, circle.id)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Diameter line and label for selected circle */}
      {isSelected && (
        <>
          <line
            x1={circle.x - radiusInPixels}
            y1={circle.y}
            x2={circle.x + radiusInPixels}
            y2={circle.y}
            stroke="#000"
            strokeWidth={2 / zoom}
            strokeDasharray={`${5 / zoom},${5 / zoom}`}
          />
          
          {/* Diameter label or edit input */}
          {editingCircle === circle.id ? (
            <foreignObject
              x={circle.x - 50 / zoom}
              y={circle.y - radiusInPixels - 45 / zoom}
              width={100 / zoom}
              height={40 / zoom}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                  ref={inputRef}
                  type="number"
                  value={editValue}
                  onChange={onEditChange}
                  onKeyDown={onEditKeyPress}
                  onBlur={onEditBlur}
                  step="0.25"
                  min="0.25"
                  max="100"
                  style={{
                    width: `${80 / zoom}px`,
                    padding: `${5 / zoom}px`,
                    border: '2px solid #667eea',
                    borderRadius: '4px',
                    fontSize: `${14 / zoom}px`,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                />
              </div>
            </foreignObject>
          ) : (
            <text
              x={circle.x}
              y={circle.y - radiusInPixels - 10 / zoom}
              textAnchor="middle"
              fill="#000"
              fontSize={14 / zoom}
              fontWeight="bold"
            >
              ø {circle.diameter.toFixed(2)} in
            </text>
          )}
        </>
      )}
      
      {/* Circle ID and Type Label */}
      <text
        x={circle.x}
        y={circle.y + 5 / zoom}
        textAnchor="middle"
        fill="#000"
        fontSize={16 / zoom}
        fontWeight="bold"
        pointerEvents="none"
      >
        #{circle.id}
      </text>
      
      {/* Type label below ID */}
      <text
        x={circle.x}
        y={circle.y + 20 / zoom}
        textAnchor="middle"
        fill="#666"
        fontSize={12 / zoom}
        fontWeight="normal"
        pointerEvents="none"
      >
        {circle.label}
      </text>

      {/* Bell OD - dotted line */}
{circle.bellOD && circle.bellOD > circle.diameter && (
  <circle
    cx={circle.x}
    cy={circle.y}
    r={(circle.bellOD * 96) / 2}
    fill="none"
    stroke={CIRCLE_COLORS[CIRCLE_TYPES.BELL_OD]}
    strokeWidth={2 / zoom}
    strokeDasharray={`${8 / zoom},${4 / zoom}`}
    pointerEvents="none"
  />
)}

    </g>
  );
};

export default CarrierOD;
