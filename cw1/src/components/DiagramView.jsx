import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false }); // initialize once with options

const DiagramView = ({ diagram }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = `<div class="mermaid">${diagram}</div>`;
      try {
        mermaid.init(undefined, ref.current); // force render
      } catch (e) {
        console.error("Mermaid render failed:", e);
      }
    }
  }, [diagram]);

  return (
    <div
      ref={ref}
      className="bg-white p-4 rounded-lg shadow overflow-auto"
    />
  );
};

export default DiagramView;
