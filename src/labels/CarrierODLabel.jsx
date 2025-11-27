import React from 'react';
import Label from './Label';

const CarrierODLabel = ({ id, position, targetPosition, onPositionChange, value }) => {
  return (
    <Label
      id={id}
      text={`Carrier OD: ${value}"`}
      position={position}
      targetPosition={targetPosition}
      onPositionChange={onPositionChange}
      color="#4ECDC4"
      fontSize={13}
    />
  );
};

export default CarrierODLabel;
