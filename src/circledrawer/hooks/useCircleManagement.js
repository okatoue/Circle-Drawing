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
    setCircles([
      ...circles,
      createCircle(newId, 200 + Math.random() * 200, 200 + Math.random() * 200, selectedType)
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
    updateDiameter
  };
};
