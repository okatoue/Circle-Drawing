import React from 'react';
import Label from './Label';

const SpacerConfigLabel = ({ id, position, targetPosition, onPositionChange, value }) => {
  return (
    <Label
      id={id}
      text={`Spacer: ${value}`}
      position={position}
      targetPosition={targetPosition}
      onPositionChange={onPositionChange}
      color="#A8DADC"
      fontSize={13}
    />
  );
};

export default SpacerConfigLabel;
