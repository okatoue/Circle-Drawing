/**
 * EffectiveDiameterLabel.js - Info label for effective diameter
 */
import React from 'react';

const EffectiveDiameterLabel = ({ center, effectiveDiameter, perimeter, zoom, isSingleCircle }) => {
  if (!center) return null;

  if (isSingleCircle) {
    return (
      <g>
        <text
          x={center.x}
          y={center.y - 150 / zoom}
          textAnchor="middle"
          fill="#ff6600"
          fontSize={16 / zoom}
          fontWeight="bold"
        >
          Effective OD: {effectiveDiameter.toFixed(2)} in
        </text>
        <text
          x={center.x}
          y={center.y - 130 / zoom}
          textAnchor="middle"
          fill="#888"
          fontSize={12 / zoom}
        >
          (Single circle)
        </text>
      </g>
    );
  }

  return (
    <g>
      <rect
        x={center.x - 100 / zoom}
        y={center.y - 170 / zoom}
        width={200 / zoom}
        height={60 / zoom}
        fill="white"
        stroke="#ff6600"
        strokeWidth={2 / zoom}
        rx={5 / zoom}
        opacity="0.95"
      />
      
      <text
        x={center.x}
        y={center.y - 145 / zoom}
        textAnchor="middle"
        fill="#ff6600"
        fontSize={16 / zoom}
        fontWeight="bold"
      >
        Effective OD: {effectiveDiameter.toFixed(2)} in
      </text>
      
      <text
        x={center.x}
        y={center.y - 125 / zoom}
        textAnchor="middle"
        fill="#666"
        fontSize={11 / zoom}
      >
        Perimeter: {perimeter.toFixed(2)} in
      </text>
    </g>
  );
};

export default EffectiveDiameterLabel;