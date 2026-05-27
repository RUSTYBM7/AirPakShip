import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Zap, Target, Trophy } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

const skillData = [
  { subject: 'Algorithms', A: 85, fullMark: 100 },
  { subject: 'Data Structures', A: 90, fullMark: 100 },
  { subject: 'System Design', A: 65, fullMark: 100 },
  { subject: 'Database', A: 75, fullMark: 100 },
  { subject: 'Frontend', A: 95, fullMark: 100 },
  { subject: 'API Design', A: 80, fullMark: 100 },
];

const achievements = [
  { id: 1, title: 'Bug Squasher', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 2, title: 'Algorithm Master', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { id: 3, title: 'Top 10%', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/20' },
];

export function SkillDashboard() {
  return (
    <div className="bg-gray-900 h-full p-6 overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Award className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Alex Developer</h2>
          <p className="text-indigo-400 flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" /> Senior Software Engineer Level
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Global Rank</div>
          <div className="text-2xl font-bold text-white">#1,423</div>
          <div className="text-emerald-400 text-xs mt-1">↑ 12 positions this week</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Total Score</div>
          <div className="text-2xl font-bold text-white">8,450</div>
          <div className="text-indigo-400 text-xs mt-1">Elite Tier</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
        <h3 className="text-white font-medium mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          Skill Analysis
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Skills"
                dataKey="A"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Recent Achievements
        </h3>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg border border-gray-700"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.bg}`}>
                <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{achievement.title}</div>
                <div className="text-xs text-gray-400">Earned 2 days ago</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
