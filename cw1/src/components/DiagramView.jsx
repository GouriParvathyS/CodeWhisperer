// DiagramView.jsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const DiagramView = ({ diagram, isLoading, error }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (diagram && containerRef.current) {
      // Clear previous diagram content
      containerRef.current.innerHTML = '';

      // Insert Mermaid diagram block
      const element = document.createElement('div');
      element.className = 'mermaid';
      element.innerHTML = diagram;
      containerRef.current.appendChild(element);

      // Initialize Mermaid (safe for React)
      try {
        mermaid.initialize({ startOnLoad: false });
        mermaid.init(undefined, element); // ← safer than render()
      } catch (e) {
        containerRef.current.innerHTML = `<p style="color:red">Failed to render diagram: ${e.message}</p>`;
      }
    }
  }, [diagram]);

  if (isLoading) return <p>Loading diagram...</p>;
  if (error) return null;
  if (!diagram) return <p>No diagram to display yet.</p>;

  return (
    <div className="diagram-card card">
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">📊 Code Flow Diagram</h3>
          <p className="card-subtitle">Visual representation of code logic</p>
        </div>
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default DiagramView;
