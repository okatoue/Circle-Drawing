import React, { useState } from "react";
import "./CircleDrawer.css";
import "./CommandLine.css";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import CommandLine from "./CommandLine";
import { useCircleManagement } from "../hooks/useCircleManagement";
import { useZoomPan } from "../hooks/useZoomPan";
import { useCircleEditing } from "../hooks/useCircleEditing";
import { useCircleDragging } from "../hooks/useCircleDragging";
import { useSpacerRotation } from "../hooks/useSpacerRotation";
import { useCommandLine } from "../hooks/useCommandLine";
import { useEffectiveDiameter } from "../hooks/useEffectiveDiameter";
import { CIRCLE_TYPES } from "./CircleTypes";

const CircleDrawer = ({
  addLabel,
  updateLabelPosition,
  updateLabelValue,
  updateLabelTarget,
  removeLabel,
  clearLabels,
}) => {
  const [showEffectiveDiameter, setShowEffectiveDiameter] = useState(true);
  const [showDebugDistances, setShowDebugDistances] = useState(false);
  const [showBundleSpacer, setShowBundleSpacer] = useState(false);
  const [runnerHeight, setRunnerHeight] = useState(2);

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
    updateBellOD,
    updateSpacerOD,
    updateCircle,
    toggleAutoSpacer,
    selectSpacerById,
    getValidSpacersForSelectedCircle,
    updateBypassBellSpacer,
    updateExcludeFromEffectiveOD,
    toggleLabelVisibility,
  } = useCircleManagement();

  const {
    zoom,
    panOffset,
    isPanning,
    zoomIn,
    zoomOut,
    resetZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleWheel,
  } = useZoomPan();

  const {
    editingCircle,
    editingBellOD,
    editingSpacerOD,
    editValue,
    bellEditValue,
    spacerEditValue,
    inputRef: editInputRef,
    bellInputRef,
    spacerInputRef,
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
  } = useCircleEditing(
    circles,
    setSelectedCircle,
    updateDiameter,
    updateBellOD,
    updateSpacerOD
  );

  const { isDragging, handleMouseDown, handleMouseMove, handleMouseUp } =
    useCircleDragging(
      circles,
      setCircles,
      selectedCircle,
      setSelectedCircle,
      zoom,
      panOffset,
      editingCircle
    );

  const {
    setSpacerRotation,
    rotateSpacerBy,
    resetSpacerRotation,
    getSpacerRotation,
  } = useSpacerRotation(circles, updateCircle);

  const {
    isActive: commandLineActive,
    inputValue: commandInputValue,
    prompt: commandPrompt,
    inputRef: commandInputRef,
    startCommand,
    handleInputChange: handleCommandInputChange,
    handleKeyPress: handleCommandKeyPress,
    cancelCommand,
  } = useCommandLine();

  const effectiveData = useEffectiveDiameter(circles);

  const handleAddCircle = () => {
    if (selectedType === CIRCLE_TYPES.CARRIER_OD) {
      startCommand("ADD_CARRIER");
    } else {
      addCircle();
    }
  };

  const handleCommandSubmit = (commandData) => {
    addCircle(commandData);
  };

  const [showBundleSpacerRunners, setShowBundleSpacerRunners] = useState(false);

  return (
    <div className="circle-drawer">
      <h1>Circle Drawer</h1>
      <div
        className={`circle-drawer-container ${
          commandLineActive ? "canvas-with-command-line" : ""
        }`}
      >
        <ControlPanel
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCircleData={selectedCircleData}
          updateDiameter={updateDiameter}
          updateBellOD={updateBellOD}
          updateSpacerOD={updateSpacerOD}
          updateCircle={updateCircle}
          addCircle={handleAddCircle}
          deleteCircle={deleteCircle}
          circles={circles}
          zoom={zoom}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetZoom={resetZoom}
          showEffectiveDiameter={showEffectiveDiameter}
          setShowEffectiveDiameter={setShowEffectiveDiameter}
          showDebugDistances={showDebugDistances}
          setShowDebugDistances={setShowDebugDistances}
          showBundleSpacer={showBundleSpacer}
          setShowBundleSpacer={setShowBundleSpacer}
          runnerHeight={runnerHeight}
          setRunnerHeight={setRunnerHeight}
          effectiveData={effectiveData}
          toggleAutoSpacer={toggleAutoSpacer}
          selectSpacerById={selectSpacerById}
          getValidSpacersForSelectedCircle={getValidSpacersForSelectedCircle}
          updateBypassBellSpacer={updateBypassBellSpacer}
          updateExcludeFromEffectiveOD={updateExcludeFromEffectiveOD}
          showBundleSpacerRunners={showBundleSpacerRunners}
          setSpacerRotation={setSpacerRotation}
          rotateSpacerBy={rotateSpacerBy}
          resetSpacerRotation={resetSpacerRotation}
          getSpacerRotation={getSpacerRotation}
          setShowBundleSpacerRunners={setShowBundleSpacerRunners}
addLabel={addLabel}
clearLabels={clearLabels}
          toggleLabelVisibility={toggleLabelVisibility}
        />

        <Canvas
          circles={circles}
          selectedCircle={selectedCircle}
          zoom={zoom}
          panOffset={panOffset}
          isPanning={isPanning}
          editingCircle={editingCircle}
          editingBellOD={editingBellOD}
          editingSpacerOD={editingSpacerOD}
          editValue={editValue}
          bellEditValue={bellEditValue}
          spacerEditValue={spacerEditValue}
          inputRef={editInputRef}
          bellInputRef={bellInputRef}
          spacerInputRef={spacerInputRef}
          handleMouseDown={handleMouseDown}
          handleDoubleClick={handleDoubleClick}
          handleBellDoubleClick={handleBellDoubleClick}
          handleSpacerDoubleClick={handleSpacerDoubleClick}
          handleEditChange={handleEditChange}
          handleBellEditChange={handleBellEditChange}
          handleSpacerEditChange={handleSpacerEditChange}
          handleEditKeyPress={handleEditKeyPress}
          handleBellEditKeyPress={handleBellEditKeyPress}
          handleSpacerEditKeyPress={handleSpacerEditKeyPress}
          saveEdit={saveEdit}
          saveBellEdit={saveBellEdit}
          saveSpacerEdit={saveSpacerEdit}
          isDragging={isDragging}
          handlePanStart={handlePanStart}
          handlePanMove={handlePanMove}
          handlePanEnd={handlePanEnd}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleWheel={handleWheel}
          effectiveData={effectiveData}
          showEffectiveDiameter={showEffectiveDiameter}
          showBundleSpacer={showBundleSpacer}
          runnerHeight={runnerHeight}
          showDebugDistances={showDebugDistances}
          showBundleSpacerRunners={showBundleSpacerRunners}
          setShowBundleSpacerRunners={setShowBundleSpacerRunners}
          addLabel={addLabel}
          updateLabelPosition={updateLabelPosition}
          updateLabelValue={updateLabelValue}
          updateLabelTarget={updateLabelTarget}
          removeLabel={removeLabel}

        />
      </div>

      <CommandLine
        isActive={commandLineActive}
        prompt={commandPrompt}
        inputValue={commandInputValue}
        inputRef={commandInputRef}
        onInputChange={handleCommandInputChange}
        onKeyPress={(e) => handleCommandKeyPress(e, handleCommandSubmit)}
        onCancel={cancelCommand}
      />
    </div>
  );
};

export default CircleDrawer;
