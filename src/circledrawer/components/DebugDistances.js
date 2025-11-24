import React from 'react';
import { CIRCLE_TYPES, PX_PER_INCH } from './CircleTypes';

const DebugDistances = ({ circles, zoom, showDebug }) => {
  if (!showDebug) return null;

  // Filter only Carrier OD circles
  const carrierCircles = circles.filter(c => c.type === CIRCLE_TYPES.CARRIER_OD);
  
  if (carrierCircles.length < 2) return null;

  const lines = [];
  
  // Draw lines between all pairs of circles with distance labels
  for (let i = 0; i < carrierCircles.length; i++) {
    for (let j = i + 1; j < carrierCircles.length; j++) {
      const circle1 = carrierCircles[i];
      const circle2 = carrierCircles[j];
      
      // Calculate center-to-center distance
      const dx = circle2.x - circle1.x;
      const dy = circle2.y - circle1.y;
      const distancePixels = Math.sqrt(dx * dx + dy * dy);
      const distanceInches = distancePixels / PX_PER_INCH;
      
      // Calculate expected touching distance
      // This is: circle1's outer radius (Bell if present) + circle2's carrier radius
      const r1_outer = circle1.bellOD && circle1.bellOD > circle1.diameter 
        ? circle1.bellOD / 2 
        : circle1.diameter / 2;
      const r2_outer = circle2.bellOD && circle2.bellOD > circle2.diameter 
        ? circle2.bellOD / 2 
        : circle2.diameter / 2;
      
      // For Bell OD collision, we check outer to carrier
      const r1_carrier = circle1.diameter / 2;
      const r2_carrier = circle2.diameter / 2;
      
      // Expected distance: larger of the two collision scenarios
      const expectedDistance1 = r1_outer + r2_carrier; // Circle 1's Bell to Circle 2's Carrier
      const expectedDistance2 = r2_outer + r1_carrier; // Circle 2's Bell to Circle 1's Carrier
      const expectedDistance = Math.max(expectedDistance1, expectedDistance2);
      
      // Calculate gap/overlap
      const gap = distanceInches - expectedDistance;
      
      // Color code: green if touching, red if gap, yellow if overlap
      let color = '#00ff00'; // Green = perfect
      if (gap > 0.01) color = '#ff0000'; // Red = gap
      if (gap < -0.01) color = '#ffff00'; // Yellow = overlap/intrusion
      
      // Midpoint for label
      const midX = (circle1.x + circle2.x) / 2;
      const midY = (circle1.y + circle2.y) / 2;
      
      lines.push({
        id: `${circle1.id}-${circle2.id}`,
        x1: circle1.x,
        y1: circle1.y,
        x2: circle2.x,
        y2: circle2.y,
        midX,
        midY,
        distance: distanceInches,
        expected: expectedDistance,
        gap,
        color,
        hasBellOD1: circle1.bellOD && circle1.bellOD > circle1.diameter,
        hasBellOD2: circle2.bellOD && circle2.bellOD > circle2.diameter
      });
    }
  }

  return (
    <g className="debug-distances">
      {lines.map(line => (
        <g key={line.id}>
          {/* Distance line */}
          <line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.color}
            strokeWidth={1 / zoom}
            strokeDasharray={`${3 / zoom},${3 / zoom}`}
            opacity="0.5"
          />
          
          {/* Label background */}
          <rect
            x={line.midX - 50 / zoom}
            y={line.midY - 30 / zoom}
            width={100 / zoom}
            height={50 / zoom}
            fill="black"
            opacity="0.8"
            rx={3 / zoom}
          />
          
          {/* Actual distance */}
          <text
            x={line.midX}
            y={line.midY - 15 / zoom}
            textAnchor="middle"
            fill={line.color}
            fontSize={10 / zoom}
            fontWeight="bold"
            fontFamily="monospace"
          >
            {line.distance.toFixed(3)}"
          </text>
          
          {/* Expected distance with Bell OD indicator */}
          <text
            x={line.midX}
            y={line.midY}
            textAnchor="middle"
            fill="#888"
            fontSize={8 / zoom}
            fontFamily="monospace"
          >
            (exp: {line.expected.toFixed(3)}")
          </text>
          
          {/* Bell OD indicator */}
          {(line.hasBellOD1 || line.hasBellOD2) && (
            <text
              x={line.midX}
              y={line.midY + 10 / zoom}
              textAnchor="middle"
              fill="#ef4444"
              fontSize={7 / zoom}
              fontFamily="monospace"
            >
              {line.hasBellOD1 && line.hasBellOD2 ? '[Both w/Bell]' : '[Bell OD]'}
            </text>
          )}
          
          {/* Gap/overlap indicator */}
          {Math.abs(line.gap) > 0.001 && (
            <text
              x={line.midX}
              y={line.midY + 20 / zoom}
              textAnchor="middle"
              fill={line.color}
              fontSize={8 / zoom}
              fontFamily="monospace"
              fontWeight="bold"
            >
              {line.gap > 0 ? `+${line.gap.toFixed(3)}"` : `${line.gap.toFixed(3)}"`}
            </text>
          )}
        </g>
      ))}
    </g>
  );
};

export default DebugDistances;