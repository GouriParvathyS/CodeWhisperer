import React from 'react';

const ExplanationOutput = ({ explanation, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="card explanation-card">
        <div className="card-content">
          <div className="card-header">
            <div className="card-title-section">
              <div className="card-icon">📄</div>
              <div>
                <h3 className="card-title">Code Explanation</h3>
                <p className="card-subtitle">Analyzing code...</p>
              </div>
            </div>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Processing explanation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="card explanation-card">
        <div className="card-content">
          <div className="card-header">
            <div className="card-title-section">
              <div className="card-icon">📄</div>
              <div>
                <h3 className="card-title">Code Explanation</h3>
                <p className="card-subtitle">Explanation will appear here</p>
              </div>
            </div>
          </div>
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <p className="empty-text">Submit code to get explanation</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card explanation-card">
      <div className="card-content">
        <div className="card-header">
          <div className="card-title-section">
            <div className="card-icon">📄</div>
            <div>
              <h3 className="card-title">Code Explanation</h3>
              <p className="card-subtitle">AI-generated explanation</p>
            </div>
          </div>
        </div>
        <div
  className="explanation-wrapper"
  style={{
    maxHeight: '500px',
    overflowY: 'auto',
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '10px',
    background: '#f9fafb'
  }}
>
  <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
    {Array.isArray(explanation)
      ? explanation.map((item, idx) => (
          <div key={idx}>
            <strong>{item.line}:</strong> {item.explanation}
          </div>
        ))
      : explanation}
  </div>
</div>

      </div>
    </div>
  );
};

export default ExplanationOutput;
