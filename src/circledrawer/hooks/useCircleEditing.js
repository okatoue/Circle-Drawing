import { useState, useRef } from 'react';

export const useCircleEditing = (circles, setSelectedCircle, updateDiameter) => {
  const [editingCircle, setEditingCircle] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  const handleDoubleClick = (e, circleId) => {
    e.stopPropagation();
    const circle = circles.find(c => c.id === circleId);
    setEditingCircle(circleId);
    setEditValue(circle.diameter.toString());
    setSelectedCircle(circleId);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const saveEdit = () => {
    const newDiameter = parseFloat(editValue);
    if (!isNaN(newDiameter) && newDiameter > 0) {
      updateDiameter(newDiameter);
    }
    setEditingCircle(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCircle(null);
    setEditValue('');
  };

  return {
    editingCircle,
    editValue,
    inputRef,
    handleDoubleClick,
    handleEditChange,
    handleEditKeyPress,
    saveEdit,
    cancelEdit
  };
};
