import React, { useState, useEffect } from 'react';
import './App.css';

// CodeInput Component - Handles the code input area
const CodeInput = ({ code, setCode, onSubmit, isLoading }) => {
  const [language, setLanguage] = useState('auto');
  
  return (
    <div className="card code-input-card">
      <div className="card-content">
        {/* Header Section */}
        <div className="card-header">
          <div className="card-title-section">
            <div className="card-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="card-title">Code Input</h2>
              <p className="card-subtitle">Paste your code for AI analysis</p>
            </div>
          </div>
          
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option value="auto">Auto-detect</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>
        
        {/* Main Textarea */}
        <div className="textarea-container">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here... (Python, JavaScript, Java, etc.)"
            className="code-textarea"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-content">
                <div className="loading-spinner"></div>
                <span>Processing...</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Section */}
        <div className="card-footer">
          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-dot stat-dot-green"></div>
              <span className="stat-text">
                {code.length.toLocaleString()} characters
              </span>
            </div>
            <div className="stat-item">
              <div className="stat-dot stat-dot-purple"></div>
              <span className="stat-text">
                {code.split('\n').length} lines
              </span>
            </div>
          </div>
          
          <button
            onClick={onSubmit}
            disabled={isLoading || !code.trim()}
            className="btn-primary"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin\" fill="none\" viewBox="0 0 24 24">
                <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            <span>
              {isLoading ? 'Analyzing...' : 'Explain Code'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ExplanationOutput Component - Shows the AI explanation
const ExplanationOutput = ({ explanation, isLoading, error }) => {
  const [viewMode, setViewMode] = useState('formatted');
  
  if (!explanation && !isLoading && !error) return null;

  const formatExplanation = (text) => {
    if (!text) return '';
    
    return text
      .split('\n\n')
      .map((paragraph, index) => (
        <div key={index} className="mb-6">
          {paragraph.split('\n').map((line, lineIndex) => (
            <div key={lineIndex} className={line.startsWith('Line ') ? 'font-mono text-sm bg-gradient-to-r from-gray-50 to-blue-50/50 p-3 rounded-lg mb-2 border border-gray-100' : 'leading-relaxed'}>
              {line}
            </div>
          ))}
        </div>
      ));
  };

  return (
    <div className="card explanation-card">
      <div className="card-content">
        <div className="card-header">
          <div className="card-title-section">
            <div className="card-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="card-title">Code Explanation</h2>
              <p className="card-subtitle">AI-powered code analysis</p>
            </div>
          </div>
          
          {explanation && (
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('formatted')}
                className={`view-toggle-btn ${viewMode === 'formatted' ? 'active' : ''}`}
              >
                Formatted
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`view-toggle-btn ${viewMode === 'raw' ? 'active' : ''}`}
              >
                Raw Text
              </button>
            </div>
          )}
        </div>
        
        {error ? (
          <div className="error-banner">
            <div className="error-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>{error}</span>
          </div>
        ) : isLoading ? (
          <div className="loading-dots">
            <div className="loading-dots-container">
              <div className="dots">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
              </div>
              <span>AI is analyzing your code...</span>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            {viewMode === 'formatted' ? (
              <div className="text-gray-700 leading-relaxed">
                {formatExplanation(explanation)}
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-inner">
                {explanation}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// DiagramView Component - Renders Mermaid diagrams
const DiagramView = ({ diagram, isLoading, error }) => {
  const [diagramId] = useState(() => `diagram-${Math.random().toString(36).substr(2, 9)}`);
  const [showSource, setShowSource] = useState(false);

  useEffect(() => {
    if (diagram && !isLoading) {
      const element = document.getElementById(diagramId);
      if (element) {
        element.innerHTML = `
          <div class="diagram-placeholder">
            <svg class="diagram-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="diagram-title">🎯 Flow Diagram</p>
            <p class="diagram-subtitle">Interactive diagram showing code flow and logic</p>
            <div class="diagram-preview">
              ${diagram.substring(0, 200)}${diagram.length > 200 ? '...' : ''}
            </div>
          </div>
        `;
      }
    }
  }, [diagram, isLoading, diagramId]);

  if (!diagram && !isLoading && !error) return null;

  return (
    <div className="card diagram-card">
      <div className="card-content">
        <div className="card-header">
          <div className="card-title-section">
            <div className="card-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="card-title">Flow Diagram</h2>
              <p className="card-subtitle">Visual code structure</p>
            </div>
          </div>
          
          {diagram && (
            <button
              onClick={() => setShowSource(!showSource)}
              className="btn-sample"
              style={{ background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)', color: '#7c2d12' }}
            >
              {showSource ? 'Hide Source' : 'Show Source'}
            </button>
          )}
        </div>
        
        {error ? (
          <div className="error-banner">
            <div className="error-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Failed to generate diagram</span>
          </div>
        ) : isLoading ? (
          <div className="loading-dots">
            <div className="loading-dots-container">
              <div className="dots">
                <div className="dot dot-1" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}></div>
                <div className="dot dot-2" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}></div>
                <div className="dot dot-3" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}></div>
              </div>
              <span>Generating diagram...</span>
            </div>
          </div>
        ) : (
          <div>
            <div id={diagramId} className="min-h-48 mb-4"></div>
            
            {showSource && (
              <div className="source-code">
                <h4>
                  <span className="source-code-dot"></span>
                  Mermaid Source Code:
                </h4>
                <pre>{diagram}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  // State Management
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [diagram, setDiagram] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError('');
    setExplanation('');
    setDiagram('');
    
    try {
      // In a real app, you'd call your API here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = generateMockResponse(code);
      setExplanation(mockResponse.explanation);
      setDiagram(mockResponse.diagram);
      
      // Add to history
      setHistory(prev => [{
        id: Date.now(),
        code: code.substring(0, 100) + (code.length > 100 ? '...' : ''),
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]);
      
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to analyze code. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock response for development
  const generateMockResponse = (code) => {
    const lines = code.split('\n').filter(line => line.trim());
    const complexity = lines.length > 20 ? 'High' : lines.length > 10 ? 'Medium' : 'Low';
    
    // Detect language patterns
    const language = detectLanguage(code);
    
    return {
      explanation: `## Code Analysis Summary

**Language**: ${language}
**Complexity**: ${complexity}
**Lines of Code**: ${lines.length}
**Characters**: ${code.length}

## Line-by-Line Breakdown

${lines.slice(0, 10).map((line, i) => `**Line ${i + 1}**: \`${line.trim()}\`
${generateLineExplanation(line.trim(), language)}`).join('\n\n')}

${lines.length > 10 ? `\n*... and ${lines.length - 10} more lines*` : ''}

## Key Programming Concepts
- Control flow structures
- Variable declarations and assignments
- Function definitions and calls
- ${language === 'Python' ? 'Indentation-based scoping' : 'Brace-based scoping'}

## Code Quality Assessment
✅ Structure appears well-organized
${code.includes('//') || code.includes('#') ? '✅ Contains comments' : '⚠️ Consider adding comments'}
${/^[\s]*/.test(code) ? '✅ Proper indentation' : '⚠️ Check indentation'}`,
      
      diagram: generateDiagram(code, language)
    };
  };

  const detectLanguage = (code) => {
    if (code.includes('def ') && code.includes(':')) return 'Python';
    if (code.includes('function') || code.includes('=>')) return 'JavaScript';
    if (code.includes('public class')) return 'Java';
    if (code.includes('#include')) return 'C/C++';
    return 'Generic';
  };

  const generateLineExplanation = (line, language) => {
    if (line.includes('def ') || line.includes('function')) return 'Function definition';
    if (line.includes('if') || line.includes('else')) return 'Conditional statement';
    if (line.includes('for') || line.includes('while')) return 'Loop construct';
    if (line.includes('return')) return 'Return statement';
    if (line.includes('=') && !line.includes('==')) return 'Variable assignment';
    if (line.includes('print') || line.includes('console.log')) return 'Output statement';
    return 'Code execution step';
  };

  const generateDiagram = (code, language) => {
    const hasLoop = /for|while/.test(code);
    const hasCondition = /if|else/.test(code);
    const hasFunction = /def |function/.test(code);
    
    return `graph TD
    A[📝 Start Program] --> B[🔧 Initialize Variables]
    B --> ${hasFunction ? 'C[📦 Define Functions]' : 'C[⚙️ Main Logic]'}
    ${hasFunction ? 'C --> D[⚙️ Main Logic]' : ''}
    ${hasFunction ? 'D' : 'C'} --> ${hasCondition ? 'E{🤔 Check Conditions}' : 'F[📊 Process Data]'}
    ${hasCondition ? `E -->|True| F[📊 Process Data]
    E -->|False| G[🔄 Alternative Path]
    G --> F` : ''}
    ${hasLoop ? `F --> H{🔄 Loop Condition}
    H -->|Continue| I[🔁 Loop Body]
    I --> H
    H -->|Exit| J[📤 Output Results]` : 'F --> J[📤 Output Results]'}
    J --> K[✅ End Program]
    
    style A fill:#e1f5fe
    style K fill:#e8f5e8
    style E fill:#fff3e0
    style H fill:#fff3e0`;
  };

  // Load sample code
  const loadSampleCode = () => {
    const samples = [
      {
        name: "Python Factorial",
        code: `def factorial(n):
    """Calculate factorial of a number recursively"""
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

# Test the function
result = factorial(5)
print(f"Factorial of 5 is: {result}")

# Calculate factorials for a range
for i in range(1, 6):
    print(f"{i}! = {factorial(i)}")`
      },
      {
        name: "JavaScript Fibonacci",
        code: `function fibonacci(n) {
    // Base cases
    if (n <= 1) return n;
    
    // Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate Fibonacci sequence
console.log("Fibonacci Sequence:");
for (let i = 0; i < 10; i++) {
    console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}

// Optimized version with memoization
const fibMemo = {};
function fibonacciMemo(n) {
    if (n in fibMemo) return fibMemo[n];
    if (n <= 1) return n;
    
    fibMemo[n] = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
    return fibMemo[n];
}`
      },
      {
        name: "Python Class Example",
        code: `class Calculator:
    """A simple calculator class with history tracking"""
    
    def __init__(self):
        self.history = []
        self.result = 0
    
    def add(self, a, b):
        """Add two numbers"""
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        self.result = result
        return result
    
    def multiply(self, a, b):
        """Multiply two numbers"""
        result = a * b
        self.history.append(f"{a} × {b} = {result}")
        self.result = result
        return result
    
    def get_history(self):
        """Return calculation history"""
        return self.history
    
    def clear_history(self):
        """Clear calculation history"""
        self.history = []

# Usage example
calc = Calculator()
print(calc.add(5, 3))
print(calc.multiply(4, 7))
print("History:", calc.get_history())`
      }
    ];
    
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setCode(randomSample.code);
  };

  // Clear all data
  const clearAll = () => {
    setCode('');
    setExplanation('');
    setDiagram('');
    setError('');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-logo">
            <div className="logo-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div className="logo-text">
              <h1>CodeWhisperer</h1>
              <p>AI-powered code explanation and visualization</p>
            </div>
          </div>
          <div className="header-buttons">
            <button onClick={loadSampleCode} className="btn-sample">
              <span>📝</span>
              <span>Load Sample</span>
            </button>
            <button onClick={clearAll} className="btn-clear">
              <span>🗑️</span>
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <div className="error-icon">
              <svg fill="none\" stroke="currentColor\" viewBox="0 0 24 24">
                <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth="2\" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>{error}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="main-grid">
          {/* Left Column - Input (wider) */}
          <div className="left-column">
            <CodeInput 
              code={code}
              setCode={setCode}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            
            {/* Recent History */}
            {history.length > 0 && (
              <div className="card history-card">
                <div className="card-content">
                  <div className="card-header">
                    <div className="card-title-section">
                      <div className="card-icon">
                        <span>📚</span>
                      </div>
                      <div>
                        <h3 className="card-title">Recent Analysis</h3>
                        <p className="card-subtitle">Your code analysis history</p>
                      </div>
                    </div>
                  </div>
                  <div className="history-list">
                    {history.map((item) => (
                      <div key={item.id} className="history-item">
                        <span className="history-code">
                          {item.code}
                        </span>
                        <span className="history-time">
                          {item.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Output */}
          <div className="right-column">
            <ExplanationOutput 
              explanation={explanation}
              isLoading={isLoading}
              error={error}
            />
            
            <DiagramView 
              diagram={diagram}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <div className="tips-content">
            <div className="tips-header">
              <h3 className="tips-title">💡 Tips for Better Results</h3>
              <p className="tips-subtitle">Follow these best practices to get the most accurate code analysis</p>
            </div>
            <div className="tips-grid">
              <div className="tip-card tip-card-blue">
                <div className="tip-card-content">
                  <div className="tip-icon tip-icon-blue">
                    <span>📐</span>
                  </div>
                  <h4 className="tip-title tip-title-blue">Clean Code</h4>
                  <p className="tip-description tip-description-blue">Use proper indentation and clear variable names for better analysis results</p>
                </div>
              </div>
              <div className="tip-card tip-card-green">
                <div className="tip-card-content">
                  <div className="tip-icon tip-icon-green">
                    <span>💬</span>
                  </div>
                  <h4 className="tip-title tip-title-green">Add Comments</h4>
                  <p className="tip-description tip-description-green">Brief comments help AI provide more contextual explanations</p>
                </div>
              </div>
              <div className="tip-card tip-card-purple">
                <div className="tip-card-content">
                  <div className="tip-icon tip-icon-purple">
                    <span>🔧</span>
                  </div>
                  <h4 className="tip-title tip-title-purple">Complete Functions</h4>
                  <p className="tip-description tip-description-purple">Include full function definitions and main logic for comprehensive analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;