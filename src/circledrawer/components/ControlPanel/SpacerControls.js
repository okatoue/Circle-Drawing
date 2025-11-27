import React from 'react';
import { CIRCLE_TYPES } from '../CircleTypes';
import SpacerSelection from './SpacerSelection';
import SpacerInfo from './SpacerInfo';
import SpacerRotation from './SpacerRotation';
import { useSpacerSelection } from './hooks/useSpacerSelection';

const SpacerControls = ({
  selectedCircleData,
  updateSpacerOD,
  updateCircle,
  toggleAutoSpacer,
  selectSpacerById,
  getValidSpacersForSelectedCircle,
  setSpacerRotation,
  rotateSpacerBy,
  resetSpacerRotation
}) => {
  // Call hook BEFORE any early returns
  const { validSpacers, hasNoValidSpacers } = useSpacerSelection(
    selectedCircleData,
    getValidSpacersForSelectedCircle
  );

  // Now we can do the early return
  if (!selectedCircleData || selectedCircleData.type !== CIRCLE_TYPES.CARRIER_OD) {
    return null;
  }

  return (
    <>
      <div className="control-section spacer-section">
        <h4>Spacer Selection (RACI)</h4>
        
        <SpacerSelection
          selectedCircleData={selectedCircleData}
          validSpacers={validSpacers}
          toggleAutoSpacer={toggleAutoSpacer}
          selectSpacerById={selectSpacerById}
          updateCircle={updateCircle}
          updateSpacerOD={updateSpacerOD}
        />

        <SpacerInfo
          selectedCircleData={selectedCircleData}
          hasNoValidSpacers={hasNoValidSpacers}
        />
      </div>

      <SpacerRotation
        selectedCircleData={selectedCircleData}
        setSpacerRotation={setSpacerRotation}
        rotateSpacerBy={rotateSpacerBy}
        resetSpacerRotation={resetSpacerRotation}
      />
    </>
  );
};

export default SpacerControls;