import React from 'react';
import CarrierOD from './CarrierOD';

const Canvas = ({
  circles,
  selectedCircle,
  zoom,
  panOffset,
  isPanning,
  editingCircle,
  editValue,
  inputRef,
  handleMouseDown,
  handleDoubleClick,
  handleEditChange,
  handleEditKeyPress,
  saveEdit,
  isDragging,
  handlePanStart,
  handlePanMove,
  handlePanEnd,
  handleMouseMove,
  handleMouseUp,
  handleWheel
}) => {
  return (
    <div className="canvas-container">
      <svg
        width="100%"
        height="100%"
        onMouseMove={(e) => {
          handlePanMove(e);
          handleMouseMove(e);
        }}
        onMouseDown={handlePanStart}
        onMouseUp={() => {
          handlePanEnd();
          handleMouseUp();
        }}
        onMouseLeave={() => {
          handlePanEnd();
          handleMouseUp();
        }}
        onWheel={handleWheel}
        className="drawing-canvas"
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cccccc" strokeWidth="1"/>
          </pattern>
        </defs>
        
        <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoom})`}>
          <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#grid)" />
          
          {circles.map((circle) => (
            <CarrierOD
              key={circle.id}
              circle={circle}
              isSelected={circle.id === selectedCircle}
              zoom={zoom}
              editingCircle={editingCircle}
              editValue={editValue}
              inputRef={inputRef}
              onMouseDown={handleMouseDown}
              onDoubleClick={handleDoubleClick}
              onEditChange={handleEditChange}
              onEditKeyPress={handleEditKeyPress}
              onEditBlur={saveEdit}
              isDragging={isDragging}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default Canvas;
