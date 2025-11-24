import { useState, useRef } from 'react';

export const useCircleEditing = (circles, setSelectedCircle, updateDiameter, updateBellOD, updateSpacerOD) => {
  const [editingCircle, setEditingCircle] = useState(null);
  const [editingBellOD, setEditingBellOD] = useState(null);
  const [editingSpacerOD, setEditingSpacerOD] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [bellEditValue, setBellEditValue] = useState('');
  const [spacerEditValue, setSpacerEditValue] = useState('');
  const inputRef = useRef(null);
  const bellInputRef = useRef(null);
  const spacerInputRef = useRef(null);

  // Handle double-click on Carrier OD (main circle)
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

  // Handle double-click on Bell OD
  const handleBellDoubleClick = (e, circleId) => {
    e.stopPropagation();
    const circle = circles.find(c => c.id === circleId);
    if (circle.bellOD) {
      setEditingBellOD(circleId);
      setBellEditValue(circle.bellOD.toString());
      setSelectedCircle(circleId);
      
      setTimeout(() => {
        if (bellInputRef.current) {
          bellInputRef.current.focus();
          bellInputRef.current.select();
        }
      }, 0);
    }
  };

  // Handle double-click on Spacer OD
  const handleSpacerDoubleClick = (e, circleId) => {
    e.stopPropagation();
    const circle = circles.find(c => c.id === circleId);
    if (circle.spacerOD) {
      setEditingSpacerOD(circleId);
      setSpacerEditValue(circle.spacerOD.toString());
      setSelectedCircle(circleId);
      
      setTimeout(() => {
        if (spacerInputRef.current) {
          spacerInputRef.current.focus();
          spacerInputRef.current.select();
        }
      }, 0);
    }
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleBellEditChange = (e) => {
    setBellEditValue(e.target.value);
  };

  const handleSpacerEditChange = (e) => {
    setSpacerEditValue(e.target.value);
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleBellEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveBellEdit();
    } else if (e.key === 'Escape') {
      cancelBellEdit();
    }
  };

  const handleSpacerEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveSpacerEdit();
    } else if (e.key === 'Escape') {
      cancelSpacerEdit();
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

  const saveBellEdit = () => {
    const newBellOD = parseFloat(bellEditValue);
    if (!isNaN(newBellOD) && newBellOD >= 0) {
      updateBellOD(newBellOD);
    }
    setEditingBellOD(null);
    setBellEditValue('');
  };

  const saveSpacerEdit = () => {
    const newSpacerOD = parseFloat(spacerEditValue);
    if (!isNaN(newSpacerOD) && newSpacerOD >= 0) {
      updateSpacerOD(newSpacerOD);
    }
    setEditingSpacerOD(null);
    setSpacerEditValue('');
  };

  const cancelEdit = () => {
    setEditingCircle(null);
    setEditValue('');
  };

  const cancelBellEdit = () => {
    setEditingBellOD(null);
    setBellEditValue('');
  };

  const cancelSpacerEdit = () => {
    setEditingSpacerOD(null);
    setSpacerEditValue('');
  };

  return {
    editingCircle,
    editingBellOD,
    editingSpacerOD,
    editValue,
    bellEditValue,
    spacerEditValue,
    inputRef,
    bellInputRef,
    spacerInputRef,
    handleDoubleClick,
    handleBellDoubleClick,
    handleSpacerDoubleClick,
    handleEditChange,
    handleBellEditChange,
    handleSpacerEditChange,
    handleEditKeyPress,
    handleBellEditKeyPress,
    handleSpacerEditKeyPress,
    saveEdit,
    saveBellEdit,
    saveSpacerEdit,
    cancelEdit,
    cancelBellEdit,
    cancelSpacerEdit
  };
};