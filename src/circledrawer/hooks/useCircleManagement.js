import { useState } from 'react';
import { CIRCLE_TYPES, CIRCLE_DEFAULTS, createCircle } from '../components/CircleTypes';

export const useCircleManagement = () => {
  const [circles, setCircles] = useState([
    createCircle(1, 300, 300, CIRCLE_TYPES.CARRIER_OD)
  ]);
  const [selectedCircle, setSelectedCircle] = useState(1);
  const [selectedType, setSelectedType] = useState(CIRCLE_TYPES.CARRIER_OD);

const addCircle = () => {
  const newId = Math.max(...circles.map(c => c.id), 0) + 1;
  
  let bellOD = null;
  if (selectedType === CIRCLE_TYPES.CARRIER_OD) {
    const bellInput = prompt("Enter Bell OD (leave blank or 0 for none):");
    if (bellInput && bellInput.trim() !== '' && parseFloat(bellInput) > 0) {
      bellOD = parseFloat(bellInput);
    }
  }
  
  setCircles([
    ...circles,
    createCircle(newId, 200 + Math.random() * 200, 200 + Math.random() * 200, selectedType, bellOD)
  ]);
  setSelectedCircle(newId);
};

  const deleteCircle = () => {
    if (circles.length > 1) {
      const filteredCircles = circles.filter(c => c.id !== selectedCircle);
      setCircles(filteredCircles);
      setSelectedCircle(filteredCircles[0]?.id || null);
    }
  };

  const updateDiameter = (newDiameter) => {
    setCircles(circles.map(circle => {
      if (circle.id === selectedCircle) {
        const defaults = CIRCLE_DEFAULTS[circle.type];
        return { 
          ...circle, 
          diameter: Math.max(defaults.minDiameter, Math.min(defaults.maxDiameter, newDiameter))
        };
      }
      return circle;
    }));
  };

  const updateBellOD = (newBellOD) => {
  setCircles(circles.map(circle => {
    if (circle.id === selectedCircle && circle.type === CIRCLE_TYPES.CARRIER_OD) {
      return { 
        ...circle, 
        bellOD: newBellOD > 0 ? newBellOD : null
      };
    }
    return circle;
  }));
};

  const selectedCircleData = circles.find(c => c.id === selectedCircle);

  return {
    circles,
    setCircles,
    selectedCircle,
    setSelectedCircle,
    selectedType,
    setSelectedType,
    selectedCircleData,
    addCircle,
    deleteCircle,
    updateDiameter,
    updateBellOD
  };
};
