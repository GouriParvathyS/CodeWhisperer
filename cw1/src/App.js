import React, { useState } from 'react';
import CodeInput from './components/CodeInput';
import ExplanationOutput from './components/ExplanationOutput';
import DiagramView from './components/DiagramView';
import './styles/App.css';

function App() {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [diagram, setDiagram] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

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

  const generateMockResponse = (code) => {
    const lines = code.split('\n').filter(line => line.trim());
    const complexity = lines.length > 20 ? 'High' : lines.length > 10 ? 'Medium' : 'Low';
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

  const handleSubmit = async () => {
  setIsLoading(true);
  setError('');
  setExplanation('');
  setDiagram('');

  try {
    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }), // Send code in request body
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();

    // Assuming backend returns { explanation: "...", diagram: "..." }
    setExplanation(data.explanation);
    setDiagram(data.diagram);

    // Save to history with timestamp
    const newEntry = {
      id: Date.now(),
      code,
      timestamp: new Date().toLocaleString(),
    };
    setHistory(prev => [newEntry, ...prev]);

  } catch (err) {
    setError(err.message || 'Failed to analyze code. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


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
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={32} height={32}>
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
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width={24} height={24}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>{error}</span>
          </div>
        )}

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
                      <div className="card-icon">📚</div>
                      <div>
                        <h3 className="card-title">Recent Analysis</h3>
                        <p className="card-subtitle">Your code analysis history</p>
                      </div>
                    </div>
                  </div>
                  <div className="history-list">
                    {history.map(item => (
                      <div key={item.id} className="history-item">
                        <pre className="history-code">{item.code}</pre>
                        <span className="history-time">{item.timestamp}</span>
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
                  <div className="tip-icon tip-icon-blue">📐</div>
                  <h4 className="tip-title tip-title-blue">Clean Code</h4>
                  <p className="tip-description tip-description-blue">Use proper indentation and clear variable names for better analysis results</p>
                </div>
              </div>
              <div className="tip-card tip-card-green">
                <div className="tip-card-content">
                  <div className="tip-icon tip-icon-green">💬</div>
                  <h4 className="tip-title tip-title-green">Add Comments</h4>
                  <p className="tip-description tip-description-green">Brief comments help AI provide more contextual explanations</p>
                </div>
              </div>
              <div className="tip-card tip-card-purple">
                <div className="tip-card-content">
                  <div className="tip-icon tip-icon-purple">🔧</div>
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
