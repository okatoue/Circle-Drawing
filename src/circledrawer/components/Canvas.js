import React from 'react';
import CarrierOD from './CarrierOD';
import EffectiveDiameter from './EffectiveDiameter';
import BundleSpacer from './BundleSpacer';
import DebugDistances from './DebugDistances';

const Canvas = ({
  circles,
  selectedCircle,
  zoom,
  panOffset,
  isPanning,
  editingCircle,
  editingBellOD,
  editingSpacerOD,
  editValue,
  bellEditValue,
  spacerEditValue,
  inputRef,
  bellInputRef,
  spacerInputRef,
  handleMouseDown,
  handleDoubleClick,
  handleBellDoubleClick,
  handleSpacerDoubleClick,
  handleEditChange,
  handleBellEditChange,
  handleSpacerEditChange,
  handleEditKeyPress,
  handleBellEditKeyPress,
  handleSpacerEditKeyPress,
  saveEdit,
  saveBellEdit,
  saveSpacerEdit,
  isDragging,
  handlePanStart,
  handlePanMove,
  handlePanEnd,
  handleMouseMove,
  handleMouseUp,
  handleWheel,
  effectiveData,
  showEffectiveDiameter,
  showBundleSpacer,
  runnerHeight,
  showDebugDistances
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
          
          {/* Render Bundle Spacer (furthest back) */}
          {showBundleSpacer && effectiveData && runnerHeight > 0 && (
            <BundleSpacer 
              effectiveData={effectiveData}
              runnerHeight={runnerHeight}
              zoom={zoom}
            />
          )}
          
          {/* Render Effective Diameter boundary */}
          {showEffectiveDiameter && effectiveData && (
            <EffectiveDiameter 
              effectiveData={effectiveData}
              zoom={zoom}
            />
          )}
          
          {/* Render all circles */}
          {circles.map((circle) => (
            <CarrierOD
              key={circle.id}
              circle={circle}
              isSelected={circle.id === selectedCircle}
              zoom={zoom}
              editingCircle={editingCircle}
              editingBellOD={editingBellOD}
              editingSpacerOD={editingSpacerOD}
              editValue={editValue}
              bellEditValue={bellEditValue}
              spacerEditValue={spacerEditValue}
              inputRef={inputRef}
              bellInputRef={bellInputRef}
              spacerInputRef={spacerInputRef}
              onMouseDown={handleMouseDown}
              onDoubleClick={handleDoubleClick}
              onBellDoubleClick={handleBellDoubleClick}
              onSpacerDoubleClick={handleSpacerDoubleClick}
              onEditChange={handleEditChange}
              onBellEditChange={handleBellEditChange}
              onSpacerEditChange={handleSpacerEditChange}
              onEditKeyPress={handleEditKeyPress}
              onBellEditKeyPress={handleBellEditKeyPress}
              onSpacerEditKeyPress={handleSpacerEditKeyPress}
              onEditBlur={saveEdit}
              onBellEditBlur={saveBellEdit}
              onSpacerEditBlur={saveSpacerEdit}
              isDragging={isDragging}
            />
          ))}
          
          {/* Debug overlay - shows distances between circles */}
          {showDebugDistances && (
            <DebugDistances 
              circles={circles}
              zoom={zoom}
              showDebug={showDebugDistances}
            />
          )}
        </g>
      </svg>
    </div>
  );
};

export default Canvas;