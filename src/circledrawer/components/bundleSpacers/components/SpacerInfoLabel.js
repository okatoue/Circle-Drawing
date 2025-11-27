/**
 * SpacerInfoLabel.js - Renders the info label for bundle spacer
 */
import React from 'react';

const SpacerInfoLabel = ({ center, bundleSpacerData, runnerHeight, zoom }) => {
  if (!center || !bundleSpacerData) return null;

  return (
    <g>
      <rect
        x={center.x - 120 / zoom}
        y={center.y + 100 / zoom}
        width={240 / zoom}
        height={70 / zoom}
        fill="white"
        stroke="#16a34a"
        strokeWidth={2 / zoom}
        rx={5 / zoom}
        opacity="0.95"
      />
      
      <text
        x={center.x}
        y={center.y + 125 / zoom}
        textAnchor="middle"
        fill="#16a34a"
        fontSize={14 / zoom}
        fontWeight="bold"
      >
        Bundle Spacer: {bundleSpacerData.selectedSpacer?.spacerName}
      </text>
      
      <text
        x={center.x}
        y={center.y + 145 / zoom}
        textAnchor="middle"
        fill="#666"
        fontSize={11 / zoom}
      >
        Config: {bundleSpacerData.configuration?.map(c => `${c.quantity}×${c.type}`).join(' + ')}
      </text>
      
      <text
        x={center.x}
        y={center.y + 160 / zoom}
        textAnchor="middle"
        fill="#666"
        fontSize={11 / zoom}
      >
        {bundleSpacerData.totalRunners} runners | Height: {runnerHeight.toFixed(2)}"
      </text>
    </g>
  );
};

export default SpacerInfoLabel;