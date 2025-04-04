import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
  loading: boolean;
}

export function TextInput({ onTextSubmit, loading }: TextInputProps) {
  const [text, setText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTextSubmit(text);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="space-x-2">
          <button
            type="button"
            className={`px-3 py-1 rounded ${
              !showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setShowPreview(false)}
          >
            Edit
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded ${
              showPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {showPreview ? (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none bg-white rounded-lg border p-6 min-h-[200px]">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {text || '*No content to preview*'}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-[200px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter or paste your text here. Markdown is supported!"
          />
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className={`px-6 py-2 rounded-lg font-medium ${
              loading || !text.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Generating...' : 'Generate Concept Map'}
          </button>
        </div>
      </form>
    </div>
  );
}