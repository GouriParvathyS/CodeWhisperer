import React from 'react';
import ReactMarkdown from 'react-markdown';

const ExplanationOutput = ({ explanation, isLoading, error }) => {
  if (isLoading) return <div className="card">Loading...</div>;
  if (error) return <div className="card error">{error}</div>;
  if (!explanation) return null;

  return (
    <div className="card">
      <div className="card-content">
        <h2>🧠 Explanation</h2>
        <ReactMarkdown>{explanation}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ExplanationOutput;
