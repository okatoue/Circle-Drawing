import React from 'react';

const DisplayOptions = ({
  showEffectiveDiameter,
  setShowEffectiveDiameter,
  showDebugDistances,
  setShowDebugDistances,
  showBundleSpacer,
  setShowBundleSpacer,
  runnerHeight,
  setRunnerHeight
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

      {showBundleSpacer && (
        <div className="control-group">
          <label>Bundle Runner Height (in):</label>
          <input
            type="number"
            value={runnerHeight}
            onChange={(e) => setRunnerHeight(Number(e.target.value))}
            min="0"
            max="10"
            step="0.25"
            className="diameter-input"
          />
        </div>
      )}
    </div>
  );
};

export default DisplayOptions;