import React from 'react';
import Label from './Label';

const BellODLabel = ({ id, position, targetPosition, onPositionChange, value }) => {
  return (
    <Label
      id={id}
      text={`Bell OD: ${value}"`}
      position={position}
      targetPosition={targetPosition}
      onPositionChange={onPositionChange}
      color="#FF6B6B"
      fontSize={13}
    />
  );
};

export default BellODLabel;
