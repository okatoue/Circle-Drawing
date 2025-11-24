import React from 'react';
import './CircleDrawer.css';
import ControlPanel from './ControlPanel';
import Canvas from './Canvas';
import { useCircleManagement } from '../hooks/useCircleManagement';
import { useZoomPan } from '../hooks/useZoomPan';
import { useCircleEditing } from '../hooks/useCircleEditing';
import { useCircleDragging } from '../hooks/useCircleDragging';

const CircleDrawer = () => {
  // Circle management (add, delete, update)
  const {
    circles,
    setCircles,
    selectedCircle,
    setSelectedCircle,
    selectedType,
    setSelectedType,
    selectedCircleData,
    addCircle,
    deleteCircle,
    updateDiameter,
    updateBellOD
  } = useCircleManagement();

  console.log('circles from hook:', circles); // ADD THIS LINE

  // Zoom and pan functionality
  const {
    zoom,
    panOffset,
    isPanning,
    zoomIn,
    zoomOut,
    resetZoom,
    handleWheel,
    handlePanStart,
    handlePanMove,
    handlePanEnd
  } = useZoomPan();

  // Circle editing (double-click)
  const {
    editingCircle,
    editValue,
    inputRef,
    handleDoubleClick,
    handleEditChange,
    handleEditKeyPress,
    saveEdit
  } = useCircleEditing(circles, setSelectedCircle, updateDiameter);

  // Circle dragging and snapping
  const {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCircleDragging(circles, setCircles, selectedCircle, setSelectedCircle);

  return (
    <div className="circle-drawer-container">
      <ControlPanel
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCircleData={selectedCircleData}
        updateDiameter={updateDiameter}
        updateBellOD={updateBellOD}  
        addCircle={addCircle}
        deleteCircle={deleteCircle}
        circles={circles}
        zoom={zoom}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
      />

      <Canvas
        circles={circles}
        selectedCircle={selectedCircle}
        zoom={zoom}
        panOffset={panOffset}
        isPanning={isPanning}
        editingCircle={editingCircle}
        editValue={editValue}
        inputRef={inputRef}
        handleMouseDown={handleMouseDown}
        handleDoubleClick={handleDoubleClick}
        handleEditChange={handleEditChange}
        handleEditKeyPress={handleEditKeyPress}
        saveEdit={saveEdit}
        isDragging={isDragging}
        handlePanStart={handlePanStart}
        handlePanMove={handlePanMove}
        handlePanEnd={handlePanEnd}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleWheel={handleWheel}
      />
    </div>
  );
};

export default CircleDrawer;
