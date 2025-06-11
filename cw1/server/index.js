const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/analyze', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

    const prompt = `
You are an AI assistant. First, explain the following code line-by-line.
Then generate a Mermaid.js control flow diagram for it.
Respond strictly in this JSON format:

{
  "explanation": "...",
  "diagram": "graph TD; ..."
}

Code:
${code}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log('Raw Gemini response:', text);

    // Clean the response text by removing markdown code fences if present
    text = text.trim();
    if (text.startsWith('```')) {
      const lines = text.split('\n');
      if (lines[0].startsWith('```')) lines.shift();
      if (lines[lines.length - 1].startsWith('```')) lines.pop();
      text = lines.join('\n').trim();
    }

    console.log('Cleaned response text:', text);

    const json = JSON.parse(text);

    // Logging to debug [object Object] problem
    console.log('json.diagram before sanitizing:', json.diagram);
    console.log('Type of json.diagram:', typeof json.diagram);

    if (typeof json.diagram !== 'string') {
      // Convert to string if diagram is an object
      json.diagram = JSON.stringify(json.diagram);
    }

    // Sanitize Mermaid diagram labels: remove quotes and parentheses inside {...} and [...]
    json.diagram = json.diagram.replace(/\{([^}]+)\}/g, (_, label) => {
      const cleanedLabel = label.replace(/["'()]/g, '');
      return `{${cleanedLabel}}`;
    });

    json.diagram = json.diagram.replace(/\[([^\]]+)\]/g, (_, label) => {
      const cleanedLabel = label.replace(/["'()]/g, '');
      return `[${cleanedLabel}]`;
    });

    res.json(json);

  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Gemini API error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Gemini server running at http://localhost:${PORT}`);
});
