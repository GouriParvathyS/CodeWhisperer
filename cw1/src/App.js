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

  const generateFallbackDiagram = (code) => {
    const hasLoop = /for|while|do\s*{/.test(code);
    const hasCondition = /if|else|switch|case/.test(code);
    const hasFunction = /def |function|class|public\s+\w+\s+\w+\s*\(/.test(code);
    const hasTryCatch = /try|catch|except|finally/.test(code);
    const hasAsync = /async|await|Promise|then/.test(code);
    
    let diagram = `graph TD
    A[🚀 Program Start] --> B[📋 Initialize Variables]`;
    
    if (hasFunction) {
      diagram += `
    B --> C[🔧 Define Functions/Classes]
    C --> D[⚡ Main Execution]`;
    } else {
      diagram += `
    B --> D[⚡ Main Execution]`;
    }
    
    if (hasCondition) {
      diagram += `
    D --> E{🤔 Conditional Logic}
    E -->|True| F[✅ Execute Branch A]
    E -->|False| G[❌ Execute Branch B]
    F --> H[📊 Process Results]
    G --> H`;
    } else {
      diagram += `
    D --> H[📊 Process Results]`;
    }
    
    if (hasLoop) {
      diagram += `
    H --> I{🔄 Loop Condition}
    I -->|Continue| J[🔁 Loop Body]
    J --> K[📈 Update Variables]
    K --> I
    I -->|Exit| L[📤 Generate Output]`;
    } else {
      diagram += `
    H --> L[📤 Generate Output]`;
    }
    
    if (hasTryCatch) {
      diagram += `
    L --> M{⚠️ Error Handling}
    M -->|Success| N[✅ Success Path]
    M -->|Error| O[🚨 Error Handler]
    N --> P[🏁 Program End]
    O --> P`;
    } else {
      diagram += `
    L --> P[🏁 Program End]`;
    }
    
    // Add styling
    diagram += `
    
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef loop fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px,color:#000
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#000
    
    class A,P startEnd
    class B,C,D,F,G,H,J,K,L,N process
    class E,I,M decision
    class O error`;
    
    return diagram;
  };

  const generateFallbackExplanation = (code) => {
    const lines = code.split('\n').filter(line => line.trim());
    const language = detectLanguage(code);
    const complexity = lines.length > 50 ? 'High' : lines.length > 20 ? 'Medium' : 'Low';
    
    const keyFeatures = [];
    if (/def |function|class/.test(code)) keyFeatures.push('Function/Class Definitions');
    if (/if|else|switch/.test(code)) keyFeatures.push('Conditional Logic');
    if (/for|while/.test(code)) keyFeatures.push('Iterative Loops');
    if (/try|catch|except/.test(code)) keyFeatures.push('Error Handling');
    if (/import|include|require/.test(code)) keyFeatures.push('External Dependencies');
    
    return `## 🔍 Code Analysis Summary

**Programming Language**: ${language}
**Complexity Level**: ${complexity}
**Total Lines**: ${lines.length}
**Key Features**: ${keyFeatures.join(', ') || 'Basic Operations'}

## 📋 Detailed Breakdown

This code demonstrates ${language.toLowerCase()} programming concepts with ${complexity.toLowerCase()} complexity. The implementation includes:

${keyFeatures.map(feature => `• **${feature}**: Essential programming construct identified`).join('\n')}

## 🎯 Code Structure Analysis

**Main Components:**
${lines.slice(0, 8).map((line, i) => {
  const trimmed = line.trim();
  if (!trimmed) return '';
  
  let description = 'Code execution step';
  if (/def |function|class/.test(trimmed)) description = '🔧 Function/Class definition';
  else if (/if|else/.test(trimmed)) description = '🤔 Conditional statement';
  else if (/for|while/.test(trimmed)) description = '🔄 Loop construct';
  else if (/return/.test(trimmed)) description = '📤 Return statement';
  else if (/=/.test(trimmed) && !/==/.test(trimmed)) description = '📝 Variable assignment';
  else if (/print|console\.log|cout/.test(trimmed)) description = '📺 Output statement';
  else if (/import|include|require/.test(trimmed)) description = '📦 Import statement';
  
  return `**Line ${i + 1}**: \`${trimmed.length > 60 ? trimmed.substring(0, 60) + '...' : trimmed}\`
   ${description}`;
}).filter(Boolean).join('\n\n')}

${lines.length > 8 ? `\n*... and ${lines.length - 8} additional lines with similar patterns*` : ''}

## 💡 Code Quality Insights

✅ **Structure**: Well-organized code structure detected
${/\/\/|#|\/\*/.test(code) ? '✅ **Documentation**: Comments found for better readability' : '⚠️ **Documentation**: Consider adding comments for clarity'}
${/^\s+/.test(code) ? '✅ **Formatting**: Proper indentation maintained' : '⚠️ **Formatting**: Check indentation consistency'}
${keyFeatures.length > 2 ? '✅ **Complexity**: Good use of programming constructs' : '💡 **Complexity**: Simple and straightforward implementation'}

## 🚀 Execution Flow

The program follows a ${complexity.toLowerCase()}-complexity execution pattern with ${keyFeatures.length} major programming concepts implemented. The code structure suggests a ${language === 'Python' ? 'Pythonic' : language === 'JavaScript' ? 'modern JavaScript' : 'structured'} approach to problem-solving.`;
  };

  const parseAIResponse = (responseText) => {
    try {
      // Clean the response text
      let cleanText = responseText.trim();
      
      // Remove markdown code fences
      if (cleanText.startsWith('```')) {
        const lines = cleanText.split('\n');
        if (lines[0].startsWith('```')) lines.shift();
        if (lines[lines.length - 1].startsWith('```')) lines.pop();
        cleanText = lines.join('\n').trim();
      }
      
      // Try to parse as JSON
      const parsed = JSON.parse(cleanText);
      
      // Validate the structure
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          explanation: parsed.explanation || 'No explanation provided',
          diagram: parsed.diagram || generateFallbackDiagram(code)
        };
      }
      
      throw new Error('Invalid response structure');
    } catch (parseError) {
      console.warn('JSON parsing failed, using fallback:', parseError);
      
      // Try to extract explanation and diagram from malformed response
      const explanationMatch = responseText.match(/"explanation":\s*"([^"]+)"/);
      const diagramMatch = responseText.match(/"diagram":\s*"([^"]+)"/);
      
      return {
        explanation: explanationMatch ? explanationMatch[1] : generateFallbackExplanation(code),
        diagram: diagramMatch ? diagramMatch[1] : generateFallbackDiagram(code)
      };
    }
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
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();

    let finalExplanation = '';
    let finalDiagram = '';

    // ✅ Check if API returned directly usable fields
    if (data.explanation && data.diagram) {
      finalExplanation = data.explanation;
      finalDiagram = data.diagram;
    } else {
      // ✅ Otherwise, try to parse the raw response text
      const parsed = parseAIResponse(JSON.stringify(data));
      finalExplanation = parsed.explanation;
      finalDiagram = parsed.diagram;
    }

    // ✅ Set both outputs
    setExplanation(finalExplanation);
    setDiagram(finalDiagram);

    // ✅ Save to history
    const newEntry = {
      id: Date.now(),
      code,
      timestamp: new Date().toLocaleString(),
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 4)]); // Keep only 5 entries

  } catch (err) {
    console.error('Analysis error:', err);
    
    // ✅ Fallback always sets BOTH explanation and diagram
    setExplanation(generateFallbackExplanation(code));
    setDiagram(generateFallbackDiagram(code));

    setError('Using offline analysis due to server issues.');
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