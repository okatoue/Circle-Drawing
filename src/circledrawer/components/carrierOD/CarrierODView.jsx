import React from 'react';
import { getCircleDisplayProps, PX_PER_INCH } from '../CircleTypes';
import SpacerRunners from './components/SpacerRunners';
import { useCarrierODLabels } from './hooks/useCarrierODLabels';
import { useRunnerData } from './hooks/useRunnerData';
import BellODCircle from './components/BellODCircle';
import SpacerODCircle from './components/SpacerODCircle';
import CarrierCircle from './components/CarrierCircle';
import CircleLabels from './components/CircleLabels';

const CarrierODView = ({ 
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
  showRunners = true,
  addLabel,
  updateLabelPosition,
  updateLabelValue,
  updateLabelTarget,
  panOffset,
  removeLabel
}) => {
  const { radiusInPixels } = getCircleDisplayProps(circle);
  const bellRadiusInPixels = circle.bellOD ? (circle.bellOD * PX_PER_INCH) / 2 : 0;
  const spacerRadiusInPixels = circle.spacerOD ? (circle.spacerOD * PX_PER_INCH) / 2 : 0;

useCarrierODLabels({
  circle,
  zoom,
  panOffset,
  addLabel,
  updateLabelTarget,
  updateLabelValue,
  removeLabel
});

  // Calculate runner data
  const runnerData = useRunnerData(circle);

  return (
    <g>
      {/* Bell OD - Render FIRST so it's behind everything */}
      <BellODCircle
        circle={circle}
        bellRadiusInPixels={bellRadiusInPixels}
        isSelected={isSelected}
        zoom={zoom}
        editingBellOD={editingBellOD}
        bellEditValue={bellEditValue}
        bellInputRef={bellInputRef}
        onBellDoubleClick={onBellDoubleClick}
        onBellEditChange={onBellEditChange}
        onBellEditKeyPress={onBellEditKeyPress}
        onBellEditBlur={onBellEditBlur}
      />

      {/* Spacer OD Circle */}
      <SpacerODCircle
        circle={circle}
        spacerRadiusInPixels={spacerRadiusInPixels}
        isSelected={isSelected}
        zoom={zoom}
        editingSpacerOD={editingSpacerOD}
        spacerEditValue={spacerEditValue}
        spacerInputRef={spacerInputRef}
        onSpacerDoubleClick={onSpacerDoubleClick}
        onSpacerEditChange={onSpacerEditChange}
        onSpacerEditKeyPress={onSpacerEditKeyPress}
        onSpacerEditBlur={onSpacerEditBlur}
      />

      {/* Spacer Runners */}
      {showRunners && circle.spacerOD && runnerData.runners.length > 0 && (
        <SpacerRunners
          circle={circle}
          runners={runnerData.runners}
          angleList={runnerData.angleList}
          zoom={zoom}
          showRunners={showRunners}
        />
      )}

      {/* Main Carrier Circle */}
      <CarrierCircle
        circle={circle}
        radiusInPixels={radiusInPixels}
        isSelected={isSelected}
        zoom={zoom}
        editingCircle={editingCircle}
        editValue={editValue}
        inputRef={inputRef}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        onEditChange={onEditChange}
        onEditKeyPress={onEditKeyPress}
        onEditBlur={onEditBlur}
        isDragging={isDragging}
      />

      {/* Circle Labels (ID and Type) */}
      <CircleLabels circle={circle} zoom={zoom} />
    </g>
  );
};

export default CarrierODView;