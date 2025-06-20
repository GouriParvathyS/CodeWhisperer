import React from 'react';

const CodeInput = ({ code, setCode, onSubmit, isLoading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim() && !isLoading) {
      onSubmit();
    }
  };

  const handleKeyDown = (e) => {
    // Allow Ctrl+Enter or Cmd+Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="card input-card">
      <div className="card-content">
        <div className="card-header">
          <div className="card-title-section">
            <div className="card-icon">📝</div>
            <div>
              <h3 className="card-title">Code Input</h3>
              <p className="card-subtitle">Paste your code here for analysis</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="input-form">
          <div className="textarea-container">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="// Paste your code here...
// Supports Python, JavaScript, Java, C++, and more!

function example() {
    console.log('Hello, CodeWhisperer!');
    return 'Ready for analysis';
}"
              className="code-textarea"
              rows={16}
              disabled={isLoading}
            />
            <div className="textarea-footer">
              <div className="textarea-info">
                <span className="char-count">{code.length} characters</span>
                <span className="line-count">{code.split('\n').length} lines</span>
              </div>
              <div className="keyboard-hint">
                <span>💡 Tip: Press Ctrl+Enter to analyze</span>
              </div>
            </div>
          </div>
          
          <div className="input-actions">
            <button
              type="submit"
              disabled={!code.trim() || isLoading}
              className="btn-analyze"
            >
              {isLoading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Analyze Code</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setCode('')}
              disabled={!code || isLoading}
              className="btn-clear-input"
            >
              <span>🗑️</span>
              <span>Clear</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CodeInput;