import React, { useState, useRef } from 'react';

const Label = ({ 
  id,
  text, 
  position, 
  targetPosition, 
  onPositionChange,
  color = '#4CAF50',
  fontSize = 14
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const labelRef = useRef(null);

  const handleMouseDown = (e) => {
    if (!labelRef.current) return;
    
    const rect = labelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    
    onPositionChange(id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Calculate arrow path from label to target
  const calculateArrowPath = () => {
    if (!targetPosition) return null;

    const startX = position.x + 10; // Small offset from label corner
    const startY = position.y + 15;
    const endX = targetPosition.x;
    const endY = targetPosition.y;

    // Arrow head size
    const arrowSize = 8;
    const angle = Math.atan2(endY - startY, endX - startX);
    
    const arrowHead1X = endX - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowHead1Y = endY - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowHead2X = endX - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowHead2Y = endY - arrowSize * Math.sin(angle + Math.PI / 6);

    return {
      line: `M ${startX} ${startY} L ${endX} ${endY}`,
      arrowHead: `M ${endX} ${endY} L ${arrowHead1X} ${arrowHead1Y} M ${endX} ${endY} L ${arrowHead2X} ${arrowHead2Y}`
    };
  };

  const arrowPath = calculateArrowPath();

  return (
    <>
      {/* Arrow line and pointer */}
      {arrowPath && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          <path
            d={arrowPath.line}
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 2"
          />
          <path
            d={arrowPath.arrowHead}
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      )}

      {/* Label box */}
      <div
        ref={labelRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: color,
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: `${fontSize}px`,
          fontWeight: '500',
          border: `1.5px solid ${color}`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          zIndex: 1001,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}
      >
        {text}
      </div>
    </>
  );
};

export default Label;
