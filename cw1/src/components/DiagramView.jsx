import React, { useEffect } from 'react';
import mermaid from 'mermaid';

const DiagramView = ({ diagram, isLoading, error }) => {
  useEffect(() => {
    if (diagram && !isLoading && !error) {
      mermaid.init(undefined, '#diagram-container');
    }
  }, [diagram, isLoading, error]);

  if (error) return null;

  return (
    <div className="diagram-view">
      {isLoading ? (
        <p>Loading diagram...</p>
      ) : (
        <div className="mermaid" id="diagram-container">
          {diagram}
        </div>
      )}
    </div>
  );
};

export default DiagramView;
