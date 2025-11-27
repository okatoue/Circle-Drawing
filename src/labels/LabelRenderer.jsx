import React from 'react';
import BellODLabel from './BellODLabel';
import CarrierODLabel from './CarrierODLabel';
import EffectiveODLabel from './EffectiveODLabel';
import SpacerODLabel from './SpacerODLabel';
import SpacerConfigLabel from './SpacerConfigLabel';
import CasingIDLabel from './CasingIDLabel';

const LabelRenderer = ({ labels, onPositionChange, circleUpdateFunctions }) => {
  const renderLabel = (label) => {
    if (!label.visible) return null;

const handleValueChange = (newValue) => {
  if (circleUpdateFunctions && label.circleId && label.labelType) {
    if (label.labelType === 'carrier') {
      circleUpdateFunctions.updateDiameter(newValue);
    } else if (label.labelType === 'bell') {
      circleUpdateFunctions.updateBellOD(newValue);
    }
  }
};

    const commonProps = {
      id: label.id,
      position: label.position,
      targetPosition: label.targetPosition,
      onPositionChange,
      onValueChange: handleValueChange,
      value: label.value
    };

    switch (label.type) {
      case 'bellOD':
        return <BellODLabel key={label.id} {...commonProps} />;
      case 'carrierOD':
        return <CarrierODLabel key={label.id} {...commonProps} />;
      case 'effectiveOD':
        return <EffectiveODLabel key={label.id} {...commonProps} />;
      case 'spacerOD':
        return <SpacerODLabel key={label.id} {...commonProps} />;
case 'spacerConfig':
  return <SpacerConfigLabel key={label.id} {...commonProps} />;
case 'casingID':
  return <CasingIDLabel key={label.id} {...commonProps} />;
default:
  return null;
    }
  };

  return (
    <>
      {labels.map(label => renderLabel(label))}
    </>
  );
};

export default LabelRenderer;
