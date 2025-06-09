import React from 'react';

const ExplanationOutput = ({ explanation, isLoading, error }) => {
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="explanation-output">
      {isLoading ? <p>Loading explanation...</p> : <pre>{explanation}</pre>}
    </div>
  );
};

export default ExplanationOutput;
