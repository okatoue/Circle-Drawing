import { useState, useRef, useEffect } from 'react';

export const useCommandLine = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentCommand, setCurrentCommand] = useState(null);
  const [commandStep, setCommandStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [prompt, setPrompt] = useState('');
  const [commandData, setCommandData] = useState({});
  const inputRef = useRef(null);

  // Focus input when command becomes active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive, commandStep]);

  const startCommand = (commandType) => {
    setCurrentCommand(commandType);
    setCommandStep(0);
    setCommandData({});
    setInputValue('');
    setIsActive(true);

    // Set initial prompt based on command type
    if (commandType === 'ADD_CARRIER') {
      setPrompt('Enter Carrier OD diameter (inches):');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (callback) => {
    if (currentCommand === 'ADD_CARRIER') {
      if (commandStep === 0) {
        // First step: Carrier diameter (must be > 0)
        const value = parseFloat(inputValue);
        
        if (isNaN(value) || value <= 0) {
          setPrompt('Invalid input. Please enter a valid number greater than 0:');
          setInputValue('');
          return;
        }

        setCommandData({ ...commandData, carrierDiameter: value });
        setCommandStep(1);
        setPrompt('Enter Bell OD diameter (inches, or 0 for none):');
        setInputValue('');
        
      } else if (commandStep === 1) {
        // Second step: Bell OD (can be 0 or empty)
        let bellOD = null;
        
        // Allow empty input or "0" to mean no Bell OD
        if (inputValue.trim() === '' || inputValue.trim() === '0') {
          bellOD = null;
        } else {
          const value = parseFloat(inputValue);
          
          if (isNaN(value) || value < 0) {
            setPrompt('Invalid input. Please enter a valid number (or 0 for none):');
            setInputValue('');
            return;
          }
          
          bellOD = value > 0 ? value : null;
        }
        
        setCommandData({ ...commandData, bellOD: bellOD });
        setCommandStep(2);
        setPrompt('Enter Spacer OD diameter (inches, or 0 for none):');
        setInputValue('');
        
      } else if (commandStep === 2) {
        // Third step: Spacer OD (can be 0 or empty)
        let spacerOD = null;
        
        // Allow empty input or "0" to mean no Spacer OD
        if (inputValue.trim() === '' || inputValue.trim() === '0') {
          spacerOD = null;
        } else {
          const value = parseFloat(inputValue);
          
          if (isNaN(value) || value < 0) {
            setPrompt('Invalid input. Please enter a valid number (or 0 for none):');
            setInputValue('');
            return;
          }
          
          spacerOD = value > 0 ? value : null;
        }
        
        // Execute the callback with all collected data
        if (callback) {
          callback({
            carrierDiameter: commandData.carrierDiameter,
            bellOD: commandData.bellOD,
            spacerOD: spacerOD
          });
        }
        
        // Reset command line
        cancelCommand();
      }
    }
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputSubmit(callback);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelCommand();
    }
  };

  const cancelCommand = () => {
    setIsActive(false);
    setCurrentCommand(null);
    setCommandStep(0);
    setInputValue('');
    setPrompt('');
    setCommandData({});
  };

  return {
    isActive,
    currentCommand,
    commandStep,
    inputValue,
    prompt,
    inputRef,
    startCommand,
    handleInputChange,
    handleKeyPress,
    cancelCommand
  };
};