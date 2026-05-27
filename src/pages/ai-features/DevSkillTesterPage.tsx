import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Settings, Layout, Code2, Timer } from 'lucide-react';
import { ProblemLibrary, problems, ProblemStatement } from '../../features/dev-tester/ProblemLibrary';
import { CodeEditor } from '../../features/dev-tester/CodeEditor';
import { TestRunner } from '../../features/dev-tester/TestRunner';
import { SkillDashboard } from '../../features/dev-tester/SkillDashboard';

export default function DevSkillTesterPage() {
  const [activeProblemId, setActiveProblemId] = useState(problems[0].id);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(problems[0].initialCode.javascript);
  const [showDashboard, setShowDashboard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeProblem = problems.find(p => p.id === activeProblemId) || problems[0];

  const handleProblemChange = (id: string) => {
    setActiveProblemId(id);
    const problem = problems.find(p => p.id === id);
    if (problem) {
      setCode(problem.initialCode[language] || '');
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(activeProblem.initialCode[newLang] || '');
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0f19] text-gray-100 overflow-hidden">
      {/* Header */}
      <header className="flex-none h-14 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AirPak DevTester
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-emerald-400 font-mono text-sm border border-gray-700">
            <Timer className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>

          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm transition-colors"
          >
            <Layout className="w-4 h-4" />
            {showDashboard ? 'Code Editor' : 'Dashboard'}
          </button>

          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {showDashboard ? (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl h-full">
              <SkillDashboard />
            </div>
          </div>
        ) : (
          <>
            {/* Left Panel: Problem Library & Description */}
            <div className="w-1/4 min-w-[300px] flex flex-col border-r border-gray-800">
              <div className="h-1/2 border-b border-gray-800">
                <ProblemLibrary
                  activeProblemId={activeProblemId}
                  onSelectProblem={handleProblemChange}
                />
              </div>
              <div className="h-1/2 bg-gray-900/50">
                <ProblemStatement problem={activeProblem} />
              </div>
            </div>

            {/* Center Panel: Code Editor */}
            <div className="flex-1 flex flex-col min-w-[500px]">
              <div className="flex-none p-2 border-b border-gray-800 bg-gray-900/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400 font-mono">
                  <Code2 className="w-4 h-4" />
                  solution.{language === 'python' ? 'py' : language === 'java' ? 'java' : 'js'}
                </div>
              </div>
              <div className="flex-1 p-2 bg-[#0b0f19]">
                <CodeEditor
                  language={language === 'typescript' ? 'javascript' : language} // Monaco handles JS/TS mostly same for basic syntax
                  code={code}
                  onChange={(val) => setCode(val || '')}
                />
              </div>
            </div>

            {/* Right Panel: Test Runner */}
            <div className="w-1/3 min-w-[400px]">
              <TestRunner
                code={code}
                language={language}
                problemId={activeProblemId}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
