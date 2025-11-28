import React from 'react';
import CircleControls from './CircleControls';
import SpacerControls from './SpacerControls';
import ViewControls from './ViewControls';
import DisplayOptions from './DisplayOptions';
import LabelControls from './LabelControls';
import InfoPanel from './InfoPanel';
import { calculateBundleSpacerData } from '../../hooks/useBundleSpacerSelection';

const ControlPanel = ({
  selectedType,
  setSelectedType,
  selectedCircleData,
  updateDiameter,
  updateBellOD,
  updateSpacerOD,
  updateWallThickness,
  updateCircle,
  addCircle,
  deleteCircle,
  circles,
  zoom,
  zoomIn,
  zoomOut,
  resetZoom,
  showEffectiveDiameter,
  setShowEffectiveDiameter,
  showDebugDistances,
  setShowDebugDistances,
  showBundleSpacer,
  setShowBundleSpacer,
  effectiveData,
  toggleAutoSpacer,
  selectSpacerById,
  getValidSpacersForSelectedCircle,
  showBundleSpacerRunners,
  setShowBundleSpacerRunners,
  updateBypassBellSpacer,
  updateExcludeFromEffectiveOD,
  setSpacerRotation,
  rotateSpacerBy,
  resetSpacerRotation,
  getSpacerRotation,
  addLabel,
  toggleLabelVisibility,
  clearLabels,
  startLabelPlacement,
  placementStatus,
  cancelPlacement,
  selectedBundleSpacerId,
  setSelectedBundleSpacerId,
}) => {

  const carrierCount = circles.filter((c) => c.type === 'CARRIER_OD').length;

  return (
    <div className="controls-panel">
      <CircleControls
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCircleData={selectedCircleData}
        updateDiameter={updateDiameter}
        updateBellOD={updateBellOD}
         updateWallThickness={updateWallThickness}
        updateBypassBellSpacer={updateBypassBellSpacer}
        updateExcludeFromEffectiveOD={updateExcludeFromEffectiveOD}
        addCircle={addCircle}
        deleteCircle={deleteCircle}
        circles={circles}
      />

      <SpacerControls
        selectedCircleData={selectedCircleData}
        updateSpacerOD={updateSpacerOD}
        updateCircle={updateCircle}
        toggleAutoSpacer={toggleAutoSpacer}
        selectSpacerById={selectSpacerById}
        getValidSpacersForSelectedCircle={getValidSpacersForSelectedCircle}
        setSpacerRotation={setSpacerRotation}
        rotateSpacerBy={rotateSpacerBy}
        resetSpacerRotation={resetSpacerRotation}
      />

      <ViewControls
        zoom={zoom}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
      />

      <DisplayOptions
        showEffectiveDiameter={showEffectiveDiameter}
        setShowEffectiveDiameter={setShowEffectiveDiameter}
        showDebugDistances={showDebugDistances}
        setShowDebugDistances={setShowDebugDistances}
        showBundleSpacer={showBundleSpacer}
        setShowBundleSpacer={setShowBundleSpacer}
      />

      <LabelControls
        effectiveData={effectiveData}
        addLabel={addLabel}
        clearLabels={clearLabels}
         selectedCircleData={selectedCircleData}
        toggleLabelVisibility={toggleLabelVisibility}
        
      />

<InfoPanel
  carrierCount={carrierCount}
  effectiveData={effectiveData}
  selectedCircleData={selectedCircleData}
  showBundleSpacer={showBundleSpacer}
  calculateBundleSpacerData={calculateBundleSpacerData}
  selectedBundleSpacerId={selectedBundleSpacerId}
  setSelectedBundleSpacerId={setSelectedBundleSpacerId}
/>


    </div>
  );
};

export default ControlPanel;