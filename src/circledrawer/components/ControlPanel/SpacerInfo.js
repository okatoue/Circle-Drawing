import React from 'react';
import { getBellClearanceColor } from './utils/spacerUtils';

const SpacerInfo = ({ selectedCircleData, hasNoValidSpacers }) => {
  if (hasNoValidSpacers) {
    return (
      <div className="warning-message">
        No spacers available for this carrier OD
        {selectedCircleData?.bellOD > 0 && ' and bell OD combination'}
      </div>
    );
  }

  if (!selectedCircleData?.selectedSpacer) {
    return null;
  }

  const { selectedSpacer, spacerOD } = selectedCircleData;

  return (
    <div className="spacer-info">
      <div className="info-row">
        <span className="info-label">Model:</span>
        <span className="info-value">{selectedSpacer.spacerName}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Runner Height:</span>
        <span className="info-value">{selectedSpacer.runnerHeight}"</span>
      </div>
      <div className="info-row">
        <span className="info-label">Spacer OD:</span>
        <span className="info-value">{spacerOD?.toFixed(2)}"</span>
      </div>
      {selectedSpacer.bellClearance !== null && (
        <div className="info-row">
          <span className="info-label">Bell Clearance:</span>
          <span
            className="info-value"
            style={{
              color: getBellClearanceColor(selectedSpacer.bellClearance)
            }}
          >
            {selectedSpacer.bellClearance.toFixed(2)}"
          </span>
        </div>
      )}
    </div>
  );
};

export default SpacerInfo;