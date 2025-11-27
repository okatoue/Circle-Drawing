import React from 'react';
import { CIRCLE_TYPES, CIRCLE_DEFAULTS } from '../CircleTypes';
import DiameterInput from './DiameterInput';
import BellODControls from './BellODControls';
import CasingControls from './CasingControls';

const CircleControls = ({
  selectedType,
  setSelectedType,
  selectedCircleData,
  updateDiameter,
  updateBellOD,
  updateBypassBellSpacer,
  updateExcludeFromEffectiveOD,
  updateWallThickness,
  addCircle,
  deleteCircle,
  circles
}) => {
  const isCarrierOD = selectedCircleData?.type === CIRCLE_TYPES.CARRIER_OD;
const isCasing = selectedCircleData?.type === CIRCLE_TYPES.CASING;

  return (
    <div className="control-section">
      <h3>Circle Controls</h3>
      
      <div className="control-group">
        <label>Circle Type:</label>
<select
  value={selectedType}
  onChange={(e) => setSelectedType(e.target.value)}
  className="type-select"
>
  <option value={CIRCLE_TYPES.CARRIER_OD}>Carrier OD</option>
  <option value={CIRCLE_TYPES.CASING}>Casing</option>
</select>
      </div>
      
      <DiameterInput
        label="Diameter"
        value={selectedCircleData?.diameter || 2}
        onChange={updateDiameter}
        circleType={selectedCircleData?.type}
        defaults={CIRCLE_DEFAULTS}
      />

      {isCarrierOD && (
        <BellODControls
          selectedCircleData={selectedCircleData}
          updateBellOD={updateBellOD}
          updateBypassBellSpacer={updateBypassBellSpacer}
          updateExcludeFromEffectiveOD={updateExcludeFromEffectiveOD}
        />
      )}
{isCasing && (
  <CasingControls
    selectedCircleData={selectedCircleData}
    updateWallThickness={updateWallThickness}
  />
)}
      <div className="button-group">
        <button onClick={() => addCircle()} className="add-btn">
          Add Circle
        </button>
        <button onClick={deleteCircle} className="delete-btn" disabled={circles.length <= 1}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default CircleControls;