import React from 'react';
import EditableLabel from './EditableLabel';

const CarrierODLabel = ({ id, position, targetPosition, onPositionChange, onValueChange, value }) => {
  return (
    <EditableLabel
      id={id}
      text={`Carrier OD: ${value}"`}
      position={position}
      targetPosition={targetPosition}
      onPositionChange={onPositionChange}
      onValueChange={onValueChange}
      color="#3b82f6"
      fontSize={13}
      value={value}
    />
  );
};

export default CarrierODLabel;
