import React from 'react';
import { GitBranch, Loader2 } from 'lucide-react';

const DiagramView = ({ diagram, isLoading }) => {
  // Guard to ensure diagram is a string
  const safeDiagram = typeof diagram === 'string' ? diagram : '';

  if (!safeDiagram && !isLoading) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <GitBranch className="w-5 h-5 text-purple-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Flow Diagram</h2>
      </div>

      {isLoading ? (
        // Loading State
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Generating diagram...</span>
        </div>
      ) : (
        // Diagram Content
        <div>
          <div
            className="min-h-48 mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gradient-to-r from-blue-50 to-purple-50"
            dangerouslySetInnerHTML={{
              __html: `
                <div class="text-gray-600 mb-4">
                  <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p class="text-lg font-medium text-gray-800 mb-2">🎯 Mermaid Diagram Placeholder</p>
                <p class="text-sm text-gray-600 mb-4">In production, this would render:</p>
                <div class="bg-white p-3 rounded border text-xs font-mono text-left max-w-sm mx-auto">
                  ${safeDiagram.substring(0, 100)}${safeDiagram.length > 100 ? '...' : ''}
                </div>
              `,
            }}
          />
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
              🔍 View Mermaid Source Code
            </summary>
            <pre className="mt-2 text-xs bg-gray-50 p-3 rounded border overflow-x-auto font-mono">{safeDiagram}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default DiagramView;
