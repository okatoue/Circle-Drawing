import React, { useState, useRef, useEffect } from 'react';
import Label from './Label';

const EditableLabel = ({ 
  id, 
  text, 
  position, 
  targetPosition, 
  onPositionChange,
  onValueChange,
  color,
  fontSize,
  value
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && numValue > 0) {
      onValueChange(numValue);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  if (isEditing) {
    return (
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: color,
          padding: '6px 12px',
          borderRadius: '4px',
          border: `1.5px solid ${color}`,
          zIndex: 1001,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}
      >
        <input
          ref={inputRef}
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          step="0.25"
          min="0.25"
          max="100"
          style={{
            width: '80px',
            padding: '4px',
            border: `2px solid ${color}`,
            borderRadius: '4px',
            fontSize: `${fontSize}px`,
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: '#fff',
            color: '#000'
          }}
        />
      </div>
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick}>
      <Label
        id={id}
        text={text}
        position={position}
        targetPosition={targetPosition}
        onPositionChange={onPositionChange}
        color={color}
        fontSize={fontSize}
      />
    </div>
  );
};

export default EditableLabel;