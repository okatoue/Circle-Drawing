import React from 'react';
import { getCircleDisplayProps, CIRCLE_COLORS, CIRCLE_TYPES } from './CircleTypes';

const CarrierOD = ({ 
  circle, 
  isSelected, 
  zoom,
  editingCircle,
  editingBellOD,
  editingSpacerOD,
  editValue,
  bellEditValue,
  spacerEditValue,
  inputRef,
  bellInputRef,
  spacerInputRef,
  onMouseDown,
  onDoubleClick,
  onBellDoubleClick,
  onSpacerDoubleClick,
  onEditChange,
  onBellEditChange,
  onSpacerEditChange,
  onEditKeyPress,
  onBellEditKeyPress,
  onSpacerEditKeyPress,
  onEditBlur,
  onBellEditBlur,
  onSpacerEditBlur,
  isDragging 
}) => {
  const { radiusInPixels } = getCircleDisplayProps(circle);
  const bellRadiusInPixels = circle.bellOD ? (circle.bellOD * 96) / 2 : 0;
  const spacerRadiusInPixels = circle.spacerOD ? (circle.spacerOD * 96) / 2 : 0;

  return (
    <g>
      {/* Bell OD - Render FIRST so it's behind everything */}
      {circle.bellOD && circle.bellOD > circle.diameter && (
        <>
          {/* Bell OD Circle - only responds to clicks on the STROKE, not the fill area */}
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

          {/* Bell OD diameter line (only show when selected) */}
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

          {/* Bell OD Label or Edit Input */}
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
              Bell ø {circle.bellOD.toFixed(2)} in
            </text>
          )}
        </>
      )}

      {/* Spacer OD - Render as GREEN SOLID CIRCLE */}
      {circle.spacerOD && circle.spacerOD > 0 && (
        <>
          {/* Spacer OD Circle - SOLID green circle */}
          <circle
            cx={circle.x}
            cy={circle.y}
            r={spacerRadiusInPixels}
            fill={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
            fillOpacity="0.2"
            stroke={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
            strokeWidth={2 / zoom}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onSpacerDoubleClick(e, circle.id);
            }}
            style={{ cursor: 'pointer' }}
          />

          {/* Spacer OD diameter line (only show when selected) */}
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

          {/* Spacer OD Label or Edit Input */}
          {editingSpacerOD === circle.id ? (
            <foreignObject
              x={circle.x - 50 / zoom}
              y={circle.y + spacerRadiusInPixels + 10 / zoom}
              width={100 / zoom}
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
                  max="20"
                  style={{
                    width: `${80 / zoom}px`,
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
          ) : (
            <text
              x={circle.x}
              y={circle.y + spacerRadiusInPixels + 20 / zoom}
              textAnchor="middle"
              fill={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
              fontSize={13 / zoom}
              fontWeight="bold"
              onDoubleClick={(e) => {
                e.stopPropagation();
                onSpacerDoubleClick(e, circle.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              Spacer ø {circle.spacerOD.toFixed(2)} in
            </text>
          )}
        </>
      )}

      {/* Carrier OD Circle - Rendered AFTER Bell/Spacer so it's on top and clickable */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={radiusInPixels}
        fill={circle.color}
        fillOpacity="0.3"
        stroke={isSelected ? '#000' : circle.color}
        strokeWidth={isSelected ? 3 / zoom : 2 / zoom}
        onMouseDown={(e) => onMouseDown(e, circle.id)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClick(e, circle.id);
        }}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Center point */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={4 / zoom}
        fill="#000"
        onMouseDown={(e) => onMouseDown(e, circle.id)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClick(e, circle.id);
        }}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Diameter line and label for selected Carrier OD */}
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
            pointerEvents="none"
          />
          
          {/* Diameter label or edit input for Carrier OD */}
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
              pointerEvents="none"
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
    </g>
  );
};

export default CarrierOD;