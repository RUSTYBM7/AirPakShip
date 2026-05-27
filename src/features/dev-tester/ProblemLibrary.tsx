import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, AlertCircle, Lightbulb, CheckCircle2 } from 'lucide-react';

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  description: string;
  hints: string[];
  initialCode: Record<string, string>;
}

export const problems: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
      'Try to use a hash map to store the values and their indices.'
    ],
    initialCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your code here
}`,
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
    }
}`
    }
  },
  {
    id: '2',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    hints: [
      'The aim is to maximize the area formed between the vertical lines.',
      'Try using a two-pointer approach, starting from the outermost lines.'
    ],
    initialCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxArea(height) {

}`,
      python: `def maxArea(height: list[int]) -> int:
    pass`,
      java: `class Solution {
    public int maxArea(int[] height) {

    }
}`
    }
  }
];

interface ProblemLibraryProps {
  activeProblemId: string;
  onSelectProblem: (id: string) => void;
}

export function ProblemLibrary({ activeProblemId, onSelectProblem }: ProblemLibraryProps) {
  return (
    <div className="h-full bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center gap-2 text-white">
        <BookOpen className="w-5 h-5 text-indigo-400" />
        <h2 className="font-semibold">Problem Library</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {problems.map((problem) => (
          <motion.div
            key={problem.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectProblem(problem.id)}
            className={`p-4 rounded-xl cursor-pointer border transition-colors ${
              activeProblemId === problem.id
                ? 'bg-indigo-900/30 border-indigo-500/50'
                : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-gray-100 font-medium">{problem.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                problem.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {problem.difficulty}
              </span>
            </div>

            <p className="text-sm text-gray-400 line-clamp-2">
              {problem.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProblemStatement({ problem }: { problem: Problem }) {
  const [showHints, setShowHints] = React.useState(false);

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
        <span className={`px-3 py-1 rounded-full text-sm ${
          problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
          problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
          problem.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
          'bg-purple-500/20 text-purple-400'
        }`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="prose prose-invert max-w-none mb-8">
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {problem.description}
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setShowHints(!showHints)}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
        >
          <Lightbulb className="w-4 h-4" />
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </button>

        {showHints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            {problem.hints.map((hint, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 text-sm flex gap-3">
                <span className="text-gray-500 font-mono mt-0.5">#{index + 1}</span>
                <p>{hint}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
