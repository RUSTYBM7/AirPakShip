import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, History, Download, Database, Code, TerminalSquare } from 'lucide-react';

export const DatabaseConsole: React.FC = () => {
  const [query, setQuery] = useState('SELECT * FROM users\nWHERE status = \'active\'\nORDER BY created_at DESC\nLIMIT 10;');
  const [results, setResults] = useState<{ columns: string[], rows: any[][] } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeQuery = () => {
    setIsExecuting(true);
    // Mock query execution
    setTimeout(() => {
      setResults({
        columns: ['id', 'email', 'name', 'status', 'created_at'],
        rows: [
          [1, 'alice@airpak.com', 'Alice Smith', 'active', '2026-05-01'],
          [2, 'bob@example.com', 'Bob Johnson', 'active', '2026-05-02'],
          [4, 'diana@example.com', 'Diana Prince', 'active', '2026-05-10'],
        ]
      });
      setIsExecuting(false);
    }, 800);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-green-400" />
          Database Console
        </h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
            <History className="w-4 h-4" /> History
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
            <Save className="w-4 h-4" /> Save
          </button>
          <button
            onClick={executeQuery}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4" /> {isExecuting ? 'Executing...' : 'Run Query'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="h-1/2 border-b border-gray-700 relative flex">
          <div className="w-10 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-2 text-gray-500 text-sm font-mono select-none">
            {query.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#1e1e1e] text-green-400 p-4 font-mono text-sm focus:outline-none resize-none"
            spellCheck="false"
          />
        </div>

        <div className="h-1/2 bg-gray-900 p-4 overflow-auto relative">
          {!results && !isExecuting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <TerminalSquare className="w-12 h-12 mb-3 opacity-20" />
              <p>Execute a query to see results</p>
            </div>
          )}

          {isExecuting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>Executing query...</p>
            </div>
          )}

          {results && !isExecuting && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">Query executed successfully. {results.rows.length} rows returned.</span>
                <button className="flex items-center gap-2 px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700 transition-colors">
                  <Download className="w-3 h-3" /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto border border-gray-700 rounded-lg">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-800 text-gray-300">
                      {results.columns.map((col, i) => (
                        <th key={i} className="px-4 py-2 font-medium border-b border-gray-700">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {results.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-800/50">
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 text-gray-400 whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
