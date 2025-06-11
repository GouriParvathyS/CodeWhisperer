import React from 'react';

const CodeInput = ({ code, setCode, onSubmit, isLoading }) => {
  return (
    <div className="code-input-container">
      <textarea
        className="code-textarea"
        rows={20}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        disabled={isLoading}
      />
      <button
        className="btn-analyze"
        onClick={onSubmit}
        disabled={isLoading || !code.trim()}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Code'}
      </button>
    </div>
  );
};

export default CodeInput;
