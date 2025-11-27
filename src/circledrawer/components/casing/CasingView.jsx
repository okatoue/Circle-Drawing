/**
 * CasingView.jsx - Renders casing circles
 */
import React, { useEffect, useRef } from 'react';
import { PX_PER_INCH } from '../CircleTypes';

const CasingView = ({
  circle,
  isSelected,
  zoom,
  onMouseDown,
  isDragging,
  addLabel,
  updateLabelTarget,
  removeLabel,
  panOffset
}) => {
  const radiusInPixels = (circle.diameter / 2) * PX_PER_INCH;
  const wallThickness = circle.wallThickness || 0.5;
  const innerDiameter = circle.diameter - 2 * wallThickness;
  const innerRadiusInPixels = (innerDiameter / 2) * PX_PER_INCH;

  const labelIdRef = useRef(null);

  // Helper to convert SVG coords to screen coords
  const svgToScreen = (svgX, svgY) => {
    const canvas = document.querySelector('.drawing-canvas');
    if (!canvas) return { x: svgX, y: svgY };
    
    const rect = canvas.getBoundingClientRect();
    const screenX = rect.left + (svgX * zoom) + panOffset.x;
    const screenY = rect.top + (svgY * zoom) + panOffset.y;
    
    return { x: screenX, y: screenY };
  };

  // Create/update label for Casing ID
  // Create/update label for Casing ID
useEffect(() => {
  if (!addLabel || !updateLabelTarget) return;

  const centerScreen = svgToScreen(circle.x, circle.y);
  
  // Point to the inner circle edge (casing ID)
  const innerEdgeScreen = svgToScreen(circle.x + innerRadiusInPixels, circle.y);

  if (!labelIdRef.current) {
    // Create label using the correct signature: addLabel(type, data)
    labelIdRef.current = addLabel('casingID', {
      position: centerScreen,
      targetPosition: innerEdgeScreen,
      value: innerDiameter.toFixed(2)
    });
  } else {
    // Update label target to point to inner edge
    updateLabelTarget(labelIdRef.current, innerEdgeScreen);
  }
    return () => {
      if (labelIdRef.current && removeLabel) {
        removeLabel(labelIdRef.current);
        labelIdRef.current = null;
      }
    };
  }, [circle.x, circle.y, circle.diameter, circle.wallThickness, zoom, panOffset, addLabel, updateLabelTarget, removeLabel, innerDiameter]);

  return (
    <g>
      {/* Outer circle (casing OD) - white fill with black stroke */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={radiusInPixels}
fill="none"
        stroke="#000000"
        strokeWidth={3 / zoom}
        onMouseDown={(e) => onMouseDown(e, circle.id)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Inner circle (casing ID) - just for visual reference */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={innerRadiusInPixels}
        fill="none"
        stroke="#000000"
        strokeWidth={1 / zoom}
        strokeDasharray={`${5 / zoom},${5 / zoom}`}
        pointerEvents="none"
      />
      
      {/* Center point */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={4 / zoom}
        fill="#000"
        onMouseDown={(e) => onMouseDown(e, circle.id)}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Selection indicator */}
      {isSelected && (
        <circle
          cx={circle.x}
          cy={circle.y}
          r={radiusInPixels}
          fill="none"
          stroke="#000"
          strokeWidth={4 / zoom}
          pointerEvents="none"
        />
      )}

      {/* Circle type label */}
      <text
        x={circle.x}
        y={circle.y + 15 / zoom}
        textAnchor="middle"
        fill="#666"
        fontSize={11 / zoom}
        fontWeight="500"
        pointerEvents="none"
      >
        Casing #{circle.id}
      </text>
    </g>
  );
};

export default CasingView;