import React from 'react';

const DisplayOptions = ({
  showEffectiveDiameter,
  setShowEffectiveDiameter,
  showDebugDistances,
  setShowDebugDistances,
  showBundleSpacer,
  setShowBundleSpacer
}) => {
  return (
    <div className="control-section">
      <h3>Display Options</h3>
      
      <div className="control-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showEffectiveDiameter}
            onChange={(e) => setShowEffectiveDiameter(e.target.checked)}
          />
          Show Effective Diameter
        </label>
      </div>

      <div className="control-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showDebugDistances}
            onChange={(e) => setShowDebugDistances(e.target.checked)}
          />
          Show Debug Distances
        </label>
      </div>

      <div className="control-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showBundleSpacer}
            onChange={(e) => setShowBundleSpacer(e.target.checked)}
          />
          Show Bundle Spacer
        </label>
      </div>
    </div>
  );
};

export default DisplayOptions;