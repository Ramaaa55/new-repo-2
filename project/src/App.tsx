import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ConceptMap } from './components/ConceptMap';
import { Brain } from 'lucide-react';
import { Node, Edge } from './types';

function App() {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const handleTextExtracted = async (extractedText: string) => {
    setText(extractedText);
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!response.ok) {
        throw new Error('Failed to process text');
      }

      const data = await response.json();
      setNodes(data.nodes);
      setEdges(data.edges);
    } catch (err) {
      setError('Failed to generate concept map');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Concept Map Generator
          </h1>
          <p className="text-lg text-gray-600">
            Upload your PDF, image, or text to generate an interactive concept map
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <FileUpload
            onTextExtracted={handleTextExtracted}
            onError={setError}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating concept map...</p>
          </div>
        )}

        {nodes.length > 0 && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <ConceptMap nodes={nodes} edges={edges} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;