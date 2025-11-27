import React from 'react';
import { CIRCLE_TYPES, CIRCLE_DEFAULTS } from '../CircleTypes';
import DiameterInput from './DiameterInput';
import BellODControls from './BellODControls';

const CircleControls = ({
  selectedType,
  setSelectedType,
  selectedCircleData,
  updateDiameter,
  updateBellOD,
  updateBypassBellSpacer,
  updateExcludeFromEffectiveOD,
  addCircle,
  deleteCircle,
  circles
}) => {
  const isCarrierOD = selectedCircleData?.type === CIRCLE_TYPES.CARRIER_OD;

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
          <option value={CIRCLE_TYPES.BELL_OD}>Bell OD</option>
          <option value={CIRCLE_TYPES.SPACER_OD}>Spacer OD</option>
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