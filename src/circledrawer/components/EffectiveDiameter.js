import React from 'react';

const EffectiveDiameter = ({ effectiveData, zoom }) => {
  if (!effectiveData || effectiveData.circles.length === 0) {
    return null;
  }

  const { hullPoints, effectiveDiameter, perimeter, center } = effectiveData;

  // For single circle, just show a message
  if (effectiveData.circles.length === 1) {
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

  // Draw the hull boundary
  if (hullPoints.length < 2) {
    return null;
  }

  // Create path for the hull
  let pathData = `M ${hullPoints[0].x} ${hullPoints[0].y}`;
  for (let i = 1; i < hullPoints.length; i++) {
    pathData += ` L ${hullPoints[i].x} ${hullPoints[i].y}`;
  }
  pathData += ' Z'; // Close the path

  return (
    <g>
      {/* Draw the boundary line */}
      <path
        d={pathData}
        fill="none"
        stroke="#ff6600"
        strokeWidth={3 / zoom}
        strokeDasharray={`${10 / zoom},${5 / zoom}`}
        opacity="0.8"
      />

      {/* Draw label with effective diameter */}
      <g>
        {/* Background for label */}
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
        
        {/* Effective OD Label */}
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
        
        {/* Perimeter info */}
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

      {/* Draw small circles at hull vertices for visual clarity */}
      {hullPoints.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={3 / zoom}
          fill="#ff6600"
          opacity="0.6"
        />
      ))}
    </g>
  );
};

export default EffectiveDiameter;
