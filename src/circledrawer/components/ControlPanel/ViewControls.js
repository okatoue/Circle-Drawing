import React from 'react';

const ViewControls = ({ zoom, zoomIn, zoomOut, resetZoom }) => {
  return (
    <div className="control-section">
      <h3>View Controls</h3>
      <div className="button-group">
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
        <button onClick={resetZoom}>Reset</button>
      </div>
      <div className="zoom-level">Zoom: {(zoom * 100).toFixed(0)}%</div>
    </div>
  );
};

export default ViewControls;