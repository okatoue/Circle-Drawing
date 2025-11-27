/**
 * CircleLabels.jsx - Renders circle ID and type labels
 */

import React from 'react';

const CircleLabels = ({ circle, zoom }) => {
  return (
    <>
      <text
        x={circle.x}
        y={circle.y + 5 / zoom}
        textAnchor="middle"
        fill="#000"
        fontSize={16 / zoom}
        fontWeight="bold"
        pointerEvents="none"
      >
        #{circle.id}
      </text>
      
      <text
        x={circle.x}
        y={circle.y + 20 / zoom}
        textAnchor="middle"
        fill="#666"
        fontSize={12 / zoom}
        fontWeight="normal"
        pointerEvents="none"
      >
        {circle.label}
      </text>
    </>
  );
};

export default CircleLabels;