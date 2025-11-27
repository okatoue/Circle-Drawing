import React from 'react';

const SpacerSelection = ({
  selectedCircleData,
  validSpacers,
  toggleAutoSpacer,
  selectSpacerById,
  updateCircle,
  updateSpacerOD
}) => {
  const handleSpacerChange = (value) => {
    if (!value) {
      updateCircle(selectedCircleData.id, {
        autoSpacerEnabled: false,
        selectedSpacer: null,
        spacerOD: null
      });
      return;
    }
    const spacerId = parseInt(value, 10);
    if (selectSpacerById && spacerId) {
      selectSpacerById(spacerId);
    }
  };

  return (
    <>
      <div className="control-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={selectedCircleData?.autoSpacerEnabled ?? true}
            onChange={() => toggleAutoSpacer && toggleAutoSpacer()}
          />
          Auto-select spacer
        </label>
      </div>
      
      <div className="control-group">
        <label>Spacer Model:</label>
        <select
          value={selectedCircleData?.selectedSpacer?.spacerId || ''}
          onChange={(e) => handleSpacerChange(e.target.value)}
          className="spacer-select"
        >
          <option value="">No spacer</option>
          {validSpacers.map((spacer) => (
            <option key={spacer.id} value={spacer.id}>
              {spacer.name} (OD: {spacer.spacerOD.toFixed(2)}")
            </option>
          ))}
        </select>
      </div>

      {!selectedCircleData?.autoSpacerEnabled && (
        <div className="control-group">
          <label>Manual Spacer OD:</label>
          <input
            type="number"
            value={selectedCircleData?.spacerOD || ''}
            onChange={(e) => updateSpacerOD(Number(e.target.value))}
            placeholder="0 or blank for none"
            min="0"
            max="100"
            step="0.25"
            className="diameter-input"
          />
        </div>
      )}
    </>
  );
};

export default SpacerSelection;