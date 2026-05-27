import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, XCircle, Clock, Cpu, RefreshCw, Bot, AlertTriangle } from 'lucide-react';

interface TestCase {
  input: string;
  expected: string;
}

interface TestResult {
  passed: boolean;
  actual: string;
  executionTime: number;
}

interface TestRunnerProps {
  code: string;
  language: string;
  problemId: string;
}

export function TestRunner({ code, language, problemId }: TestRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [aiReview, setAiReview] = useState<string | null>(null);

  // Mock test cases for demonstration
  const mockTestCases: TestCase[] = [
    { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
    { input: 'nums = [3,3], target = 6', expected: '[0,1]' }
  ];

  const handleRunTests = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setResults(null);
    setAiReview(null);

    // Mock API call to execution engine
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock results
    const mockResults = mockTestCases.map(() => {
      const passed = Math.random() > 0.3; // 70% chance to pass
      return {
        passed,
        actual: passed ? '[0,1]' : 'undefined',
        executionTime: Math.floor(Math.random() * 50) + 10 // 10-60ms
      };
    });

    setResults(mockResults);
    setIsRunning(false);
  };

  const handleAIReview = async () => {
    if (!code.trim()) return;
    setIsReviewing(true);
    setAiReview(null);

    // Mock API call to AI code reviewer
    await new Promise(resolve => setTimeout(resolve, 2000));

    setAiReview("🔍 AI Review Complete\\n\\n1. **Time Complexity**: Your solution looks to be O(n^2). Consider using a Hash Map to improve this to O(n).\\n2. **Edge Cases**: Make sure you handle empty inputs or inputs with only 1 element.\\n3. **Variable Naming**: 'nums' is okay, but consider using more descriptive names for loop counters.");
    setIsReviewing(false);
  };

  const totalPassed = results?.filter(r => r.passed).length ?? 0;
  const allPassed = totalPassed === mockTestCases.length;

  return (
    <div className="h-full bg-gray-900 border-l border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-medium text-white flex items-center gap-2">
          <Play className="w-4 h-4 text-emerald-400" />
          Test Execution
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleAIReview}
            disabled={isReviewing || !code.trim()}
            className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isReviewing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
            AI Review
          </button>
          <button
            onClick={handleRunTests}
            disabled={isRunning || !code.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              'Run Tests'
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isReviewing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 rounded-xl border bg-indigo-900/10 border-indigo-500/30 flex items-center justify-center gap-3 text-indigo-400"
            >
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing code...</span>
            </motion.div>
          )}

          {aiReview && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 rounded-xl border bg-indigo-900/20 border-indigo-500/50"
            >
              <div className="flex items-center gap-2 mb-3 text-indigo-400 font-medium">
                <Bot className="w-5 h-5" />
                AI Code Review
              </div>
              <div className="prose prose-invert max-w-none text-sm text-indigo-100 whitespace-pre-wrap">
                {aiReview}
              </div>
            </motion.div>
          )}

          {!results && !isRunning && !aiReview && !isReviewing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-gray-500"
            >
              <Cpu className="w-12 h-12 mb-4 text-gray-700" />
              <p>Write your code and click Run Tests to see results</p>
            </motion.div>
          )}

          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-800/50 rounded-xl animate-pulse border border-gray-700/50" />
              ))}
            </motion.div>
          )}

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-xl border ${
                allPassed ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'
              }`}>
                <h4 className={`text-lg font-bold flex items-center gap-2 ${
                  allPassed ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {allPassed ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  {totalPassed} / {mockTestCases.length} Tests Passed
                </h4>
              </div>

              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300 font-medium">Test Case {idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {result.executionTime}ms
                      </span>
                      {result.passed ? (
                        <span className="text-emerald-400 text-sm font-medium flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Passed
                        </span>
                      ) : (
                        <span className="text-red-400 text-sm font-medium flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Failed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm font-mono">
                    <div className="bg-gray-900 p-2 rounded border border-gray-800">
                      <span className="text-gray-500 select-none">Input: </span>
                      <span className="text-gray-300">{mockTestCases[idx].input}</span>
                    </div>
                    <div className="bg-gray-900 p-2 rounded border border-gray-800">
                      <span className="text-gray-500 select-none">Expected: </span>
                      <span className="text-gray-300">{mockTestCases[idx].expected}</span>
                    </div>
                    {!result.passed && (
                      <div className="bg-red-900/10 p-2 rounded border border-red-900/30">
                        <span className="text-red-500/70 select-none">Actual: </span>
                        <span className="text-red-400">{result.actual}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
