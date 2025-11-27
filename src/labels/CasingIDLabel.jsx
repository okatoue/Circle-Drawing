import React from 'react';
import Label from './Label';

const CasingIDLabel = ({ id, position, targetPosition, onPositionChange, value }) => {
  return (
    <Label
      id={id}
text={`Casing ID: ${value}"`}
      position={position}
      targetPosition={targetPosition}
      onPositionChange={onPositionChange}
color="#888888"
      fontSize={13}
    />
  );
};

export default CasingIDLabel;