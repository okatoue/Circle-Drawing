import React from 'react';

const CommandLine = ({
  isActive,
  prompt,
  inputValue,
  inputRef,
  onInputChange,
  onKeyPress,
  onCancel
}) => {
  if (!isActive) return null;

  return (
    <div className="command-line-container">
      <div className="command-line-content">
        <div className="command-prompt">{prompt}</div>
        <div className="command-input-wrapper">
          <span className="command-prefix">:</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={onKeyPress}
            className="command-input"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <button 
          className="command-cancel"
          onClick={onCancel}
          title="Press ESC to cancel"
        >
          ✕
        </button>
      </div>
      <div className="command-hint">
        Press <kbd>Enter</kbd> to submit • <kbd>ESC</kbd> to cancel
      </div>
    </div>
  );
};

export default CommandLine;
