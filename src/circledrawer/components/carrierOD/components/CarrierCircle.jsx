/**
 * CarrierCircle.jsx - Renders the main carrier circle with editing
 */

import React from "react";

const CarrierCircle = ({
  circle,
  radiusInPixels,
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
  isDragging,
}) => {
  return (
    <>
      {/* Main Carrier Circle */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={radiusInPixels}
        fill={circle.color}
        fillOpacity="0.3"
        stroke={isSelected ? "#000" : circle.color}
        strokeWidth={isSelected ? 3 / zoom : 2 / zoom}
        onMouseDown={(e) => onMouseDown(e, circle.id)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClick(e, circle.id);
        }}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
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
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
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

        {editingCircle === circle.id && (
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
)}
        </>
      )}
    </>
  );
};

export default CarrierCircle;
