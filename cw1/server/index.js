const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Enhanced sanitization function for Mermaid diagrams
function sanitizeMermaidDiagram(diagram) {
  return diagram
    .split('\n')
    .map(line => {
      // Process lines that contain node definitions
      if (line.includes('[') && line.includes(']')) {
        line = line.replace(/\[([^\]]+)\]/g, (match, content) => {
          let cleaned = content
            // Replace array indexing patterns
            .replace(/\w+\[\w*\]/g, 'array element')
            .replace(/\[\w*\]/g, 'element')
            // Replace operators and symbols
            .replace(/</g, ' lt ')
            .replace(/>/g, ' gt ')
            .replace(/==/g, ' equals ')
            .replace(/!=/g, ' not equals ')
            .replace(/=/g, ' assign ')
            .replace(/\+=/g, ' increment ')
            .replace(/-=/g, ' decrement ')  
            .replace(/\+\+/g, ' increment')
            .replace(/--/g, ' decrement')
            .replace(/\+/g, ' plus ')
            .replace(/-/g, ' minus ')
            .replace(/\*/g, ' times ')
            .replace(/\/\//g, ' floor div ')
            .replace(/\//g, ' div ')
            .replace(/%/g, ' mod ')
            // Replace variable patterns
            .replace(/nums_/g, 'nums ')
            .replace(/res_/g, 'res ')
            .replace(/\w+_\w+/g, match => match.replace(/_/g, ' '))
            // Replace Python-specific syntax
            .replace(/len\([^)]+\)/g, 'length')
            .replace(/range\([^)]+\)/g, 'range')
            // Replace Python-specific syntax
.replace(/len\([^)]+\)/g, 'length')
.replace(/range\([^)]+\)/g, 'range')
// Handle common method calls intelligently
.replace(/\.add\(([^)]+)\)/g, 'Add $1 to set')
.replace(/\.remove\(([^)]+)\)/g, 'Remove $1 from set')
.replace(/\.append\(([^)]+)\)/g, 'Append $1 to list')
.replace(/\.get\(([^)]+)\)/g, 'Get $1 from dict')
// Catch remaining unknown method calls
.replace(/\.\w+\(\)/g, ' method')

            .replace(/\.\w+\(\)/g, ' method')
            // Replace common patterns
            .replace(/\w+\.\w+/g, 'property')
            .replace(/\(\w*\)/g, '')
            .replace(/\w+\(\w*\)/g, 'function call')
            // Clean up punctuation and spacing
            .replace(/[(){}[\]]/g, '')
            .replace(/[:,;]/g, '')
            .replace(/\?/g, '')
            .replace(/!/g, '')
            .replace(/@/g, '')
            .replace(/#/g, '')
            .replace(/\$/g, '')
            .replace(/&/g, ' and ')
            .replace(/\|/g, ' or ')
            .replace(/\^/g, ' xor ')
            .replace(/~/g, ' not ')
            .replace(/`/g, '')
            .replace(/"/g, '')
            .replace(/'/g, '')
            // Normalize whitespace
            .replace(/\s+/g, ' ')
            .trim();
          
          // If the content is too long or complex, simplify it further
          if (cleaned.length > 30) {
            // Extract key action words
            if (cleaned.includes('compare') || cleaned.includes('lt') || cleaned.includes('gt')) {
              cleaned = 'Compare values';
            } else if (cleaned.includes('assign') || cleaned.includes('equals')) {
              cleaned = 'Update variable';
            } else if (cleaned.includes('increment') || cleaned.includes('plus')) {
              cleaned = 'Increment';
            } else if (cleaned.includes('return')) {
              cleaned = 'Return result';
            } else if (cleaned.includes('while') || cleaned.includes('loop')) {
              cleaned = 'Loop condition';
            } else if (cleaned.includes('if') || cleaned.includes('check')) {
              cleaned = 'Check condition';
            } else {  
              cleaned = 'Process data';
            }
          }
          
          return `[${cleaned}]`;
        });
      }
      
      // Process diamond/decision nodes
      if (line.includes('{') && line.includes('}')) {
        line = line.replace(/\{([^}]+)\}/g, (match, content) => {
          let cleaned = content
            .replace(/</g, ' lt ')
            .replace(/>/g, ' gt ')
            .replace(/==/g, ' equals ')
            .replace(/!=/g, ' not equals ')
            .replace(/=/g, ' eq ')
            .replace(/\w+\[\w*\]/g, 'check array')
            .replace(/nums_/g, 'nums ')
            .replace(/\s+/g, ' ')
            .trim();
          
          // Simplify decision nodes
          if (cleaned.length > 20) {
            cleaned = 'condition';
          }
          
          return `{${cleaned}}`;
        });
      }
      
      return line;
    })
    .join('\n')
    .trim();
}

app.post('/analyze', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Updated prompt with stricter Mermaid guidelines
   const prompt = `
You are an expert code analysis AI.

Your task:

1️⃣ First, check the given code for any syntax or logical errors.
2️⃣ If any error is found, clearly mention:
    - The error description
    - How to fix it.

3️⃣ Then, provide a detailed line-by-line explanation. For every line of code, include:
    - The actual code line (as it appears in code)
    - Its explanation (what that line does)

4️⃣ Finally, generate a Mermaid.js flowchart following these STRICT diagram rules:

- Start with: graph TD;
- Use node IDs: A, B, C, D, etc.
- Use arrows: A --> B
- Inside nodes:
    - Always start the diagram with: A[Start];
    - Always end with: [End] after return statements.

    - Use real variable names from code.
    - Apply these replacements inside node text to ensure Mermaid v11 safety:
        - For assignments (lines like variable = expression):
            - Convert to: variable assign expression
            - Example: l = m + 1 becomes l assign m plus 1
        - Replace nums[m] with: "access m of array"
        - Replace any array[index] with: "access index of array"
        - Replace < with "lt"
        - Replace > with "gt"
        - Replace == with "equals"
        - Replace != with "not_equals"
        - Replace + with "plus"
        - Replace - with "minus"
        - Replace * with "times"
        - Replace / with "divide"
        - Replace % with "mod"
    - Do NOT use any parentheses (), square brackets [], or braces {} inside node text.
    - Do NOT include any Markdown or formatting.
    - Ensure valid Mermaid v11 syntax.

Your full response MUST be valid JSON object exactly like:

{
  "explanation": [
    {"line": "actual code line", "explanation": "its explanation"},
    ...
  ],
  "diagram": "graph TD; full diagram here"
}

Code:
${code}
`;




    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log('Raw Gemini response:', text);

    // Remove Markdown code fences if present
    text = text.trim();
    if (text.startsWith('```')) {
      const lines = text.split('\n');
      if (lines[0].startsWith('```')) lines.shift();
      if (lines[lines.length - 1].startsWith('```')) lines.pop();
      text = lines.join('\n').trim();
    }

    console.log('Cleaned response text:', text);

    const json = JSON.parse(text);

    console.log('json.diagram before sanitizing:', json.diagram);

    // Apply enhanced sanitization
    json.diagram = sanitizeMermaidDiagram(json.diagram);

    console.log('json.diagram after sanitizing:', json.diagram);

    res.json(json);

  } catch (err) {
    console.error('Gemini error:', err);
    
    // Enhanced error handling with fallback
    if (err.message && err.message.includes('JSON')) {
      console.error('JSON parsing failed, attempting to extract diagram...');
      
      // Try to extract a basic diagram as fallback
      const fallbackDiagram = `graph TD;
A[Start] --> B[Initialize];
B --> C[Process data];
C --> D[Check condition];
D --> E[Update values];
E --> D;
D --> F[Return result];`;

      res.json({
        explanation: [{"line": "Error parsing response", "explanation": "Could not parse the AI response properly"}],
        diagram: fallbackDiagram
      });
    } else {
      res.status(500).json({ error: 'Gemini API error' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Gemini server running at http://localhost:${PORT}`);
});