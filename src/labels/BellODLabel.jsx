import React from 'react';
import EditableLabel from './EditableLabel';

const BellODLabel = ({ id, position, targetPosition, onPositionChange, onValueChange, value }) => {
  return (
    <EditableLabel
      id={id}
      text={`Bell OD: ${value}"`}
      position={position}
      targetPosition={targetPosition}
      onPositionChange={onPositionChange}
      onValueChange={onValueChange}
      color="#FF6B6B"
      fontSize={13}
      value={value}
    />
  );
};
export default BellODLabel;
