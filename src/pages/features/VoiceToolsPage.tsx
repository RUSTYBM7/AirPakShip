import React, { useState } from 'react';
import {
  Mic,
  Play,
  Pause,
  Square,
  Upload,
  Volume2,
  Settings2,
  MessageSquare,
  Terminal,
  Activity,
  FileAudio
} from 'lucide-react';

const VoiceToolsPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'tts' | 'stt' | 'commands'>('tts');
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('nova');

  // Generate mock waveform bars
  const waveformBars = Array.from({ length: 40 }, (_, i) => {
    // Generate a pseudo-random height that looks somewhat like a waveform
    const height = 15 + Math.abs(Math.sin(i * 0.5) * 60) + (Math.random() * 25);
    return Math.min(100, height);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-500" />
              Voice Tools
            </h1>
            <p className="text-slate-400 mt-2">Manage text-to-speech, transcription, and voice commands</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl w-fit border border-slate-800">
          <button
            onClick={() => setActiveTab('tts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'tts'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Text to Speech
            </div>
          </button>
          <button
            onClick={() => setActiveTab('stt')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'stt'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Speech to Text
            </div>
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'commands'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Voice Commands
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">

            {/* Text to Speech Panel */}
            {activeTab === 'tts' && (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Synthesize Speech</h2>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-400">Voice:</label>
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                    >
                      <option value="alloy">Alloy (Neutral)</option>
                      <option value="echo">Echo (Male)</option>
                      <option value="fable">Fable (British Male)</option>
                      <option value="onyx">Onyx (Deep Male)</option>
                      <option value="nova">Nova (Female)</option>
                      <option value="shimmer">Shimmer (Bright Female)</option>
                    </select>
                  </div>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to synthesize..."
                  className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />

                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Advanced
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Generate Audio
                  </button>
                </div>
              </div>
            )}

            {/* Speech to Text Panel */}
            {activeTab === 'stt' && (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">Transcription</h2>

                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:bg-slate-800/50 transition cursor-pointer">
                  <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-white font-medium">Click to upload audio file</p>
                  <p className="text-slate-500 text-sm mt-1">Supports MP3, WAV, M4A up to 25MB</p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-slate-900 px-4 text-sm text-slate-500">OR RECORD NOW</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-6 rounded-full transition-all duration-300 ${
                      isRecording
                        ? 'bg-red-500/20 text-red-500 animate-pulse'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </button>
                </div>
              </div>
            )}

            {/* Voice Commands Panel */}
            {activeTab === 'commands' && (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white">Voice Command Interface</h2>
                <p className="text-slate-400 text-sm">Say a command to execute actions in the admin portal.</p>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg font-mono text-sm h-48 overflow-y-auto space-y-3">
                  <div className="text-slate-500">Listening for commands...</div>
                  <div className="text-blue-400">&gt; User: "Navigate to shipping routes"</div>
                  <div className="text-green-400">&lt; System: Executing navigation to /shipping-routes</div>
                  <div className="text-blue-400">&gt; User: "Generate daily report"</div>
                  <div className="text-green-400">&lt; System: Triggered background job #4928</div>
                </div>

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                    isRecording
                      ? 'bg-red-500/10 text-red-500 border border-red-500/50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Mic className="h-5 w-5 animate-pulse" />
                      Listening...
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      Start Listening
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Audio Player & Visualizer */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <FileAudio className="h-5 w-5 text-blue-400" />
                Current Audio
              </h3>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-400">0:00</span>
                  <span className="text-xs text-slate-400">1:24</span>
                </div>

                {/* Waveform Visualization */}
                <div className="flex items-end gap-1 h-12 mb-4">
                  {waveformBars.map((height, i) => (
                    <div
                      key={i}
                      className="w-full bg-blue-500/30 rounded-t-sm transition-all duration-300"
                      style={{
                        height: `${height}%`,
                        backgroundColor: isPlaying && i < 15 ? '#3b82f6' : undefined
                      }}
                    ></div>
                  ))}
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button className="p-2 text-slate-400 hover:text-white transition">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white transition">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Recent Files */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-3">Recent Files</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-md">
                          <FileAudio className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">recording_{i}.wav</p>
                          <p className="text-xs text-slate-500">2 mins ago</p>
                        </div>
                      </div>
                      <Volume2 className="h-4 w-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceToolsPage;