import React from 'react';
import './App.css';
import CircleDrawer from './circledrawer/components/CircleDrawer';
import { LabelRenderer, useLabelManagement } from './labels';

function App() {
  const { 
    labels, 
    addLabel, 
    updateLabelPosition,
    updateLabelValue,
    updateLabelTarget,
    removeLabel,
    toggleLabelVisibility,
    clearLabels 
  } = useLabelManagement();

  return (
    <div className="App" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <header className="App-header">
        <h1>Circle Drawer</h1>
        <p>Draw circles with adjustable diameters</p>
      </header>
      
      <CircleDrawer 
        addLabel={addLabel}
        updateLabelPosition={updateLabelPosition}
        updateLabelValue={updateLabelValue}
        updateLabelTarget={updateLabelTarget}
        removeLabel={removeLabel}
          clearLabels={clearLabels}

      />
      
      {/* Labels - rendered last so they're on top */}
      <LabelRenderer 
        labels={labels} 
        onPositionChange={updateLabelPosition} 
      />
    </div>
  );
}

export default App;