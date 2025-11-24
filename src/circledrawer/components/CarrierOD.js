/**
 * CarrierOD.js - Renders individual carrier circles with Bell, Spacer, and Runner overlays
 * 
 * Enhanced with visual runner rendering from RACI logic.
 * Shows the actual spacer elements (runners) around the carrier.
 */

import React, { useMemo } from 'react';
import { 
  getCircleDisplayProps, 
  CIRCLE_COLORS, 
  CIRCLE_TYPES,
  PX_PER_INCH 
} from './CircleTypes';
import SpacerRunners from './SpacerRunners';
import { buildRunnerCountMap, generateRunners } from '../utils/runnerUtils';
import { assignElementColors } from '../utils/colorUtils';
import { distributeAngles } from '../utils/angleUtils';

const CarrierOD = ({ 
  circle, 
  isSelected, 
  zoom,
  editingCircle,
  editingBellOD,
  editingSpacerOD,
  editValue,
  bellEditValue,
  spacerEditValue,
  inputRef,
  bellInputRef,
  spacerInputRef,
  onMouseDown,
  onDoubleClick,
  onBellDoubleClick,
  onSpacerDoubleClick,
  onEditChange,
  onBellEditChange,
  onSpacerEditChange,
  onEditKeyPress,
  onBellEditKeyPress,
  onSpacerEditKeyPress,
  onEditBlur,
  onBellEditBlur,
  onSpacerEditBlur,
  isDragging,
  showRunners = true  // NEW: Option to show/hide runners
}) => {
  const { radiusInPixels } = getCircleDisplayProps(circle);
  const bellRadiusInPixels = circle.bellOD ? (circle.bellOD * PX_PER_INCH) / 2 : 0;
  const spacerRadiusInPixels = circle.spacerOD ? (circle.spacerOD * PX_PER_INCH) / 2 : 0;

  // Calculate runner data for visualization
  const runnerData = useMemo(() => {
    if (!circle.selectedSpacer?.configuration || circle.selectedSpacer.configuration.length === 0) {
      return { runners: [], angleList: [] };
    }

    const configuration = circle.selectedSpacer.configuration;
    const carrierOD = circle.diameter;

    // Build runner visualization data
    const runnerCountMap = buildRunnerCountMap(configuration);
    const elementColors = assignElementColors(runnerCountMap);
    const { runners, totalGroups } = generateRunners(configuration, elementColors);
    const angleList = distributeAngles(runners, totalGroups, carrierOD);

    return { runners, angleList };
  }, [circle.selectedSpacer?.configuration, circle.diameter]);

  // Determine spacer label text
  const getSpacerLabelText = () => {
    if (circle.selectedSpacer && circle.autoSpacerEnabled) {
      return `${circle.selectedSpacer.spacerName} ø${circle.spacerOD.toFixed(2)}"`;
    } else if (circle.spacerOD) {
      return `Spacer ø${circle.spacerOD.toFixed(2)}"`;
    }
    return '';
  };

  // Get spacer info for tooltip
  const getSpacerTooltip = () => {
    if (!circle.selectedSpacer) return '';
    const s = circle.selectedSpacer;
    let tooltip = `${s.spacerName}\nRunner Height: ${s.runnerHeight}"`;
    if (s.bellClearance !== null) {
      tooltip += `\nBell Clearance: ${s.bellClearance.toFixed(2)}"`;
    }
    if (s.configuration && s.configuration.length > 0) {
      const configStr = s.configuration.map(c => `${c.quantity}×${c.type}`).join(', ');
      tooltip += `\nConfig: ${configStr}`;
    }
    return tooltip;
  };

  return (
    <g>
      {/* Bell OD - Render FIRST so it's behind everything */}
      {circle.bellOD && circle.bellOD > circle.diameter && (
        <>
          <circle
            cx={circle.x}
            cy={circle.y}
            r={bellRadiusInPixels}
            fill="none"
            stroke={CIRCLE_COLORS[CIRCLE_TYPES.BELL_OD]}
            strokeWidth={2 / zoom}
            strokeDasharray={`${8 / zoom},${4 / zoom}`}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onBellDoubleClick(e, circle.id);
            }}
            style={{ cursor: 'pointer' }}
            pointerEvents="stroke"
          />

          {isSelected && (
            <line
              x1={circle.x - bellRadiusInPixels}
              y1={circle.y}
              x2={circle.x + bellRadiusInPixels}
              y2={circle.y}
              stroke={CIRCLE_COLORS[CIRCLE_TYPES.BELL_OD]}
              strokeWidth={1.5 / zoom}
              strokeDasharray={`${5 / zoom},${5 / zoom}`}
              pointerEvents="none"
            />
          )}

          {editingBellOD === circle.id ? (
            <foreignObject
              x={circle.x - 50 / zoom}
              y={circle.y - bellRadiusInPixels - 45 / zoom}
              width={100 / zoom}
              height={40 / zoom}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                  ref={bellInputRef}
                  type="number"
                  value={bellEditValue}
                  onChange={onBellEditChange}
                  onKeyDown={onBellEditKeyPress}
                  onBlur={onBellEditBlur}
                  step="0.25"
                  min="0"
                  max="100"
                  style={{
                    width: `${80 / zoom}px`,
                    padding: `${5 / zoom}px`,
                    border: `2px solid ${CIRCLE_COLORS[CIRCLE_TYPES.BELL_OD]}`,
                    borderRadius: '4px',
                    fontSize: `${14 / zoom}px`,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    backgroundColor: '#fff'
                  }}
                />
              </div>
            </foreignObject>
          ) : (
            <text
              x={circle.x}
              y={circle.y - bellRadiusInPixels - 10 / zoom}
              textAnchor="middle"
              fill={CIRCLE_COLORS[CIRCLE_TYPES.BELL_OD]}
              fontSize={13 / zoom}
              fontWeight="bold"
              onDoubleClick={(e) => {
                e.stopPropagation();
                onBellDoubleClick(e, circle.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              Bell ø{circle.bellOD.toFixed(2)}"
            </text>
          )}
        </>
      )}

      {/* Spacer OD Circle - Background */}
      {circle.spacerOD && circle.spacerOD > 0 && (
        <>
          <circle
            cx={circle.x}
            cy={circle.y}
            r={spacerRadiusInPixels}
            fill={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
            fillOpacity="0.1"
            stroke={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
            strokeWidth={2 / zoom}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onSpacerDoubleClick(e, circle.id);
            }}
            style={{ cursor: 'pointer' }}
          >
            <title>{getSpacerTooltip()}</title>
          </circle>

          {isSelected && (
            <line
              x1={circle.x - spacerRadiusInPixels}
              y1={circle.y}
              x2={circle.x + spacerRadiusInPixels}
              y2={circle.y}
              stroke={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
              strokeWidth={1.5 / zoom}
              strokeDasharray={`${5 / zoom},${5 / zoom}`}
              pointerEvents="none"
            />
          )}
        </>
      )}

      {/* NEW: Render Spacer Runners (the visual element representation) */}
      {showRunners && circle.spacerOD && runnerData.runners.length > 0 && (
        <SpacerRunners
          circle={circle}
          runners={runnerData.runners}
          angleList={runnerData.angleList}
          zoom={zoom}
          showRunners={showRunners}
        />
      )}

      {/* Carrier OD Circle - Rendered AFTER Bell/Spacer so it's on top */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={radiusInPixels}
        fill={circle.color}
        fillOpacity="0.3"
        stroke={isSelected ? '#000' : circle.color}
        strokeWidth={isSelected ? 3 / zoom : 2 / zoom}
        onMouseDown={(e) => onMouseDown(e, circle.id)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClick(e, circle.id);
        }}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Center point */}
      <circle
        cx={circle.x}
        cy={circle.y}
        r={4 / zoom}
        fill="#000"
        onMouseDown={(e) => onMouseDown(e, circle.id)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onDoubleClick(e, circle.id);
        }}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      
      {/* Diameter line and label for selected Carrier OD */}
      {isSelected && (
        <>
          <line
            x1={circle.x - radiusInPixels}
            y1={circle.y}
            x2={circle.x + radiusInPixels}
            y2={circle.y}
            stroke="#000"
            strokeWidth={2 / zoom}
            strokeDasharray={`${5 / zoom},${5 / zoom}`}
            pointerEvents="none"
          />
          
          {editingCircle === circle.id ? (
            <foreignObject
              x={circle.x - 50 / zoom}
              y={circle.y - radiusInPixels - 45 / zoom}
              width={100 / zoom}
              height={40 / zoom}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                  ref={inputRef}
                  type="number"
                  value={editValue}
                  onChange={onEditChange}
                  onKeyDown={onEditKeyPress}
                  onBlur={onEditBlur}
                  step="0.25"
                  min="0.25"
                  max="100"
                  style={{
                    width: `${80 / zoom}px`,
                    padding: `${5 / zoom}px`,
                    border: '2px solid #667eea',
                    borderRadius: '4px',
                    fontSize: `${14 / zoom}px`,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                />
              </div>
            </foreignObject>
          ) : (
            <text
              x={circle.x}
              y={circle.y - radiusInPixels - 10 / zoom}
              textAnchor="middle"
              fill="#000"
              fontSize={14 / zoom}
              fontWeight="bold"
              pointerEvents="none"
            >
              ø{circle.diameter.toFixed(2)}"
            </text>
          )}
        </>
      )}

      {/* Spacer OD Label */}
      {circle.spacerOD && circle.spacerOD > 0 && (
        <>
          {editingSpacerOD === circle.id ? (
            <foreignObject
              x={circle.x - 60 / zoom}
              y={circle.y + spacerRadiusInPixels + 10 / zoom}
              width={120 / zoom}
              height={40 / zoom}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                  ref={spacerInputRef}
                  type="number"
                  value={spacerEditValue}
                  onChange={onSpacerEditChange}
                  onKeyDown={onSpacerEditKeyPress}
                  onBlur={onSpacerEditBlur}
                  step="0.25"
                  min="0"
                  max="100"
                  style={{
                    width: `${100 / zoom}px`,
                    padding: `${5 / zoom}px`,
                    border: `2px solid ${CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}`,
                    borderRadius: '4px',
                    fontSize: `${14 / zoom}px`,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    backgroundColor: '#fff'
                  }}
                />
              </div>
            </foreignObject>
          ) : (
            <text
              x={circle.x}
              y={circle.y + spacerRadiusInPixels + 20 / zoom}
              textAnchor="middle"
              fill={CIRCLE_COLORS[CIRCLE_TYPES.SPACER_OD]}
              fontSize={12 / zoom}
              fontWeight="bold"
              onDoubleClick={(e) => {
                e.stopPropagation();
                onSpacerDoubleClick(e, circle.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              {getSpacerLabelText()}
            </text>
          )}

          {circle.autoSpacerEnabled && isSelected && (
            <text
              x={circle.x}
              y={circle.y + spacerRadiusInPixels + 35 / zoom}
              textAnchor="middle"
              fill="#666"
              fontSize={10 / zoom}
              fontStyle="italic"
            >
              (auto-selected)
            </text>
          )}
        </>
      )}
      
      {/* Circle ID and Type Label */}
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
    </g>
  );
};

export default CarrierOD;