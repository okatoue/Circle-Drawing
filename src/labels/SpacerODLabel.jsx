import React from 'react';
import Label from './Label';

const SpacerODLabel = ({ id, position, targetPosition, onPositionChange, value }) => {
  return (
    <Label
      id={id}
      text={`Spacer OD: ${value}"`}
      position={position}
      targetPosition={targetPosition}
      onPositionChange={onPositionChange}
      color="#FFD93D"
      fontSize={13}
    />
  );
};

export default SpacerODLabel;
