import { useState, useCallback } from 'react';

const useLabelManagement = () => {
  const [labels, setLabels] = useState([]);

  const addLabel = useCallback((type, data) => {
    const newLabel = {
      id: `${type}-${Date.now()}`,
      type,
      position: data.position || { x: 100, y: 100 },
      targetPosition: data.targetPosition || null,
      value: data.value || '',
      visible: true
    };
    
    setLabels(prev => [...prev, newLabel]);
    return newLabel.id;
  }, []);

  const updateLabelPosition = useCallback((id, newPosition) => {
    setLabels(prev => 
      prev.map(label => 
        label.id === id 
          ? { ...label, position: newPosition }
          : label
      )
    );
  }, []);

  const updateLabelValue = useCallback((id, value) => {
    setLabels(prev => 
      prev.map(label => 
        label.id === id 
          ? { ...label, value }
          : label
      )
    );
  }, []);

  const updateLabelTarget = useCallback((id, targetPosition) => {
    setLabels(prev => 
      prev.map(label => 
        label.id === id 
          ? { ...label, targetPosition }
          : label
      )
    );
  }, []);

  const removeLabel = useCallback((id) => {
    setLabels(prev => prev.filter(label => label.id !== id));
  }, []);

  const toggleLabelVisibility = useCallback((id) => {
    setLabels(prev => 
      prev.map(label => 
        label.id === id 
          ? { ...label, visible: !label.visible }
          : label
      )
    );
  }, []);

  const clearLabels = useCallback(() => {
    setLabels([]);
  }, []);

  const getLabelsByType = useCallback((type) => {
    return labels.filter(label => label.type === type);
  }, [labels]);

  return {
    labels,
    addLabel,
    updateLabelPosition,
    updateLabelValue,
    updateLabelTarget,
    removeLabel,
    toggleLabelVisibility,
    clearLabels,
    getLabelsByType
  };
};

export default useLabelManagement;
