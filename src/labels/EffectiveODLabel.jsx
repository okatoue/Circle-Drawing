import React from 'react';
import Label from './Label';

const EffectiveODLabel = ({ id, position, targetPosition, onPositionChange, value }) => {
  return (
    <Label
      id={id}
      text={`Effective OD: ${value}"`}
      position={position}
      targetPosition={targetPosition}
      onPositionChange={onPositionChange}
      color="#95E1D3"
      fontSize={13}
    />
  );
};

export default EffectiveODLabel;
