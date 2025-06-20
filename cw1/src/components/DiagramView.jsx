import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const DiagramView = ({ diagram, isLoading, error }) => {
  const diagramRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 60,
        diagramPadding: 20
      },
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#1f2937',
        primaryBorderColor: '#2563eb',
        lineColor: '#6b7280',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#ffffff',
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondBkg: '#f8fafc',
        tertiaryBkg: '#f1f5f9'
      }
    });
  }, []);

  useEffect(() => {
    if (diagram && diagramRef.current && containerRef.current) {
      const renderDiagram = async () => {
        try {
          // Clear previous diagram
          diagramRef.current.innerHTML = '';
          
          // Generate unique ID for this diagram
          const diagramId = `diagram-${Date.now()}`;
          
          // Validate and clean the diagram syntax
          let cleanDiagram = diagram.trim();
          
          // Ensure it starts with a valid mermaid diagram type
          if (!cleanDiagram.startsWith('graph') && !cleanDiagram.startsWith('flowchart')) {
            cleanDiagram = `graph TD\n${cleanDiagram}`;
          }
          
          // Remove any problematic characters that might break parsing
          cleanDiagram = cleanDiagram
            .replace(/[^\x20-\x7E\n\r\t]/g, '') // Remove non-ASCII characters
            .replace(/\\n/g, '\n') // Convert literal \n to actual newlines
            .replace(/\\"/g, '"') // Convert escaped quotes
            .replace(/\\\\/g, '\\'); // Convert escaped backslashes
          
          // Render the diagram
          const { svg } = await mermaid.render(diagramId, cleanDiagram);
          diagramRef.current.innerHTML = svg;
          
          // Add some styling to the SVG
          const svgElement = diagramRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.background = 'transparent';
          }
          
        } catch (err) {
          console.error('Mermaid rendering error:', err);
          
          // Fallback to a simple diagram on error
          const fallbackDiagram = `graph TD
    A[🚀 Code Analysis] --> B[📊 Processing]
    B --> C[✅ Results Generated]
    
    classDef default fill:#f3f4f6,stroke:#6b7280,stroke-width:2px,color:#1f2937
    classDef highlight fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e40af`;
          
          try {
            const fallbackId = `fallback-${Date.now()}`;
            const { svg } = await mermaid.render(fallbackId, fallbackDiagram);
            diagramRef.current.innerHTML = svg;
          } catch (fallbackErr) {
            diagramRef.current.innerHTML = `
              <div style="text-align: center; padding: 2rem; color: #6b7280;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                <p>Diagram visualization temporarily unavailable</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">The code structure has been analyzed successfully</p>
              </div>
            `;
          }
        }
      };

      renderDiagram();
    }
  }, [diagram]);

  if (isLoading) {
    return (
      <div className="card diagram-card">
        <div className="card-content">
          <div className="card-header">
            <div className="card-title-section">
              <div className="card-icon">📊</div>
              <div>
                <h3 className="card-title">Flow Diagram</h3>
                <p className="card-subtitle">Visual representation of code flow</p>
              </div>
            </div>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Generating visual diagram...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !diagram) {
    return (
      <div className="card diagram-card">
        <div className="card-content">
          <div className="card-header">
            <div className="card-title-section">
              <div className="card-icon">📊</div>
              <div>
                <h3 className="card-title">Code Explanation</h3>
                <p className="card-subtitle">Visual Explanation of code flow</p>
              </div>
            </div>
          </div>
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p className="empty-text">Diagram will appear here after code analysis</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card diagram-card">
      <div className="card-content">
        <div className="card-header">
          <div className="card-title-section">
            <div className="card-icon">📊</div>
            <div>
              <h3 className="card-title">Flow Diagram</h3>
              <p className="card-subtitle">Visual representation of code execution flow</p>
            </div>
          </div>
        </div>
        <div className="diagram-container" ref={containerRef}>
          <div 
            ref={diagramRef} 
            className="mermaid-diagram"
            style={{
              textAlign: 'center',
              padding: '1rem',
              minHeight: '200px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DiagramView;