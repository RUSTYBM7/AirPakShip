import React, { useState } from 'react';
import {
  Play, Code, Clock, Book, Plus, Trash2, Send,
  Save, Copy, Check, ChevronDown, Activity,
  RefreshCcw, Terminal, Zap, FileJson, Server
} from 'lucide-react';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const MOCK_HISTORY = [
  { id: 1, method: 'GET', url: '/v1/shipments/AWB123456789', status: 200, time: '24ms' },
  { id: 2, method: 'POST', url: '/v1/shipments', status: 201, time: '156ms' },
  { id: 3, method: 'GET', url: '/v1/users/profile', status: 200, time: '42ms' },
  { id: 4, method: 'DELETE', url: '/v1/webhooks/98', status: 204, time: '12ms' },
];

const MOCK_DOCS = [
  { id: 1, title: 'Authentication', path: 'Authentication required for all endpoints via Bearer token.' },
  { id: 2, title: 'Shipments API', path: '/v1/shipments' },
  { id: 3, title: 'Tracking API', path: '/v1/tracking' },
  { id: 4, title: 'Webhooks', path: '/v1/webhooks' },
];

export default function APIPlaygroundPage() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.airpak-express.com/v1/shipments');
  const [activeReqTab, setActiveReqTab] = useState('headers');
  const [activeResTab, setActiveResTab] = useState('body');
  const [activeSidebar, setActiveSidebar] = useState('history');

  const [headers, setHeaders] = useState([
    { id: 1, key: 'Authorization', value: 'Bearer sk_test_123456789' },
    { id: 2, key: 'Content-Type', value: 'application/json' }
  ]);

  const [body, setBody] = useState('{\n  "trackingNumber": "AWB123456789",\n  "status": "in_transit"\n}');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const addHeader = () => {
    setHeaders([...headers, { id: Date.now(), key: '', value: '' }]);
  };

  const removeHeader = (id: number) => {
    setHeaders(headers.filter(h => h.id !== id));
  };

  const updateHeader = (id: number, field: 'key' | 'value', val: string) => {
    setHeaders(headers.map(h => h.id === id ? { ...h, [field]: val } : h));
  };

  const handleSend = () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setResponse({
        status: 200,
        statusText: 'OK',
        time: '124ms',
        size: '1.2 KB',
        data: {
          success: true,
          message: "Request processed successfully",
          data: {
            id: "shp_987654321",
            trackingNumber: "AWB123456789",
            status: "in_transit",
            origin: "New York, NY",
            destination: "Los Angeles, CA",
            estimatedDelivery: "2026-05-28T10:00:00Z",
            events: [
              {
                id: "evt_1",
                timestamp: "2026-05-25T08:30:00Z",
                status: "picked_up",
                location: "New York, NY"
              }
            ]
          }
        },
        headers: [
          { key: 'content-type', value: 'application/json; charset=utf-8' },
          { key: 'x-request-id', value: 'req_abc123def456' },
          { key: 'x-ratelimit-limit', value: '1000' },
          { key: 'x-ratelimit-remaining', value: '998' }
        ]
      });
      setIsLoading(false);
    }, 800);
  };

  const handleCopy = () => {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getMethodColor = (m: string) => {
    switch (m) {
      case 'GET': return 'text-emerald-400 bg-emerald-400/10';
      case 'POST': return 'text-blue-400 bg-blue-400/10';
      case 'PUT': return 'text-amber-400 bg-amber-400/10';
      case 'PATCH': return 'text-amber-400 bg-amber-400/10';
      case 'DELETE': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-emerald-400';
    if (status >= 300 && status < 400) return 'text-blue-400';
    if (status >= 400 && status < 500) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden">

      {/* Sidebar */}
      <div className="w-72 flex flex-col border-r border-slate-800 bg-slate-900/50">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-2 text-white font-semibold">
          <Server className="w-5 h-5 text-indigo-400" />
          <span>API Playground</span>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeSidebar === 'history' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            onClick={() => setActiveSidebar('history')}
          >
            <Clock className="w-4 h-4" />
            <span>History</span>
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${activeSidebar === 'docs' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            onClick={() => setActiveSidebar('docs')}
          >
            <Book className="w-4 h-4" />
            <span>Docs</span>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
          {activeSidebar === 'history' ? (
            MOCK_HISTORY.map((item) => (
              <div key={item.id} className="group flex items-center p-3 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors">
                <div className={`text-xs font-bold w-14 ${getMethodColor(item.method).split(' ')[0]}`}>
                  {item.method}
                </div>
                <div className="flex-1 truncate text-sm text-slate-300 ml-2">
                  {item.url}
                </div>
                <div className={`text-xs flex items-center ${getStatusColor(item.status)}`}>
                  <div className="w-2 h-2 rounded-full bg-current mr-1.5 opacity-60"></div>
                  {item.status}
                </div>
              </div>
            ))
          ) : (
            MOCK_DOCS.map((doc) => (
              <div key={doc.id} className="p-3 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors">
                <div className="text-sm font-medium text-slate-200 mb-1">{doc.title}</div>
                <div className="text-xs text-slate-500 truncate">{doc.path}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* URL Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`appearance-none bg-slate-800 border border-slate-700 rounded-l-lg py-2.5 pl-4 pr-10 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${getMethodColor(method).split(' ')[0]}`}
              >
                {METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter API URL or endpoint"
              className="flex-1 bg-slate-800/50 border-y border-slate-700 py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500 font-mono"
            />

            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-r-lg py-2.5 px-6 font-medium text-sm flex items-center space-x-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed border border-indigo-600"
            >
              {isLoading ? (
                <RefreshCcw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Send</span>
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg p-2.5 transition-colors ml-2" title="Save Request">
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resizer/Splitter container */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Request Section */}
          <div className="flex-1 flex flex-col min-h-[200px] border-b border-slate-800 bg-slate-950">
            <div className="flex items-center space-x-6 px-4 border-b border-slate-800/80 bg-slate-900/30 pt-2">
              <button
                className={`py-2 text-sm font-medium border-b-2 ${activeReqTab === 'params' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                onClick={() => setActiveReqTab('params')}
              >
                Params
              </button>
              <button
                className={`py-2 text-sm font-medium border-b-2 flex items-center space-x-2 ${activeReqTab === 'headers' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                onClick={() => setActiveReqTab('headers')}
              >
                <span>Headers</span>
                {headers.length > 0 && (
                  <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full">{headers.length}</span>
                )}
              </button>
              <button
                className={`py-2 text-sm font-medium border-b-2 flex items-center space-x-2 ${activeReqTab === 'body' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                onClick={() => setActiveReqTab('body')}
              >
                <span>Body</span>
                <span className="text-[10px] text-emerald-500 font-mono">JSON</span>
              </button>
              <button
                className={`py-2 text-sm font-medium border-b-2 ${activeReqTab === 'auth' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                onClick={() => setActiveReqTab('auth')}
              >
                Authorization
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
              {activeReqTab === 'headers' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 pb-2 border-b border-slate-800/50 text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                    <div className="col-span-4">Key</div>
                    <div className="col-span-7">Value</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>
                  {headers.map((header) => (
                    <div key={header.id} className="grid grid-cols-12 gap-2 items-center group">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                          placeholder="Header name"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-slate-300 placeholder-slate-600"
                        />
                      </div>
                      <div className="col-span-7">
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                          placeholder="Value"
                          className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-slate-300 placeholder-slate-600"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeHeader(header.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addHeader}
                    className="mt-3 flex items-center space-x-1 text-sm text-indigo-400 hover:text-indigo-300 font-medium py-1 px-2 hover:bg-indigo-500/10 rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Header</span>
                  </button>
                </div>
              )}

              {activeReqTab === 'body' && (
                <div className="h-full flex flex-col">
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-sm text-emerald-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none scrollbar-thin scrollbar-thumb-slate-700"
                    spellCheck="false"
                  />
                </div>
              )}

              {activeReqTab === 'params' && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                  <Code className="w-8 h-8 opacity-20" />
                  <p className="text-sm">Query parameters will appear here</p>
                  <button className="text-sm text-indigo-400 hover:text-indigo-300">Add Parameter</button>
                </div>
              )}

              {activeReqTab === 'auth' && (
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                  <h3 className="text-sm font-semibold text-white mb-4">Authentication</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                      <select className="w-full bg-slate-800 border border-slate-700 rounded py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        <option>Bearer Token</option>
                        <option>API Key</option>
                        <option>Basic Auth</option>
                        <option>No Auth</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Token</label>
                      <input
                        type="password"
                        value="sk_test_123456789"
                        readOnly
                        className="w-full bg-slate-800 border border-slate-700 rounded py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                      <p className="text-xs text-slate-500 mt-2">This token will automatically be added to the Headers tab.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Response Section */}
          <div className="flex-1 flex flex-col min-h-[300px] bg-[#0f111a]">
            {!response ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                <Terminal className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">Hit Send to get a response</p>
                <p className="text-xs mt-1 opacity-60">The response will be displayed here</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-900/40 pt-2">
                  <div className="flex items-center space-x-6">
                    <button
                      className={`py-2 text-sm font-medium border-b-2 flex items-center space-x-2 ${activeResTab === 'body' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                      onClick={() => setActiveResTab('body')}
                    >
                      <FileJson className="w-4 h-4" />
                      <span>Response Body</span>
                    </button>
                    <button
                      className={`py-2 text-sm font-medium border-b-2 flex items-center space-x-2 ${activeResTab === 'headers' ? 'text-indigo-400 border-indigo-500' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                      onClick={() => setActiveResTab('headers')}
                    >
                      <span>Headers</span>
                      <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full">{response.headers.length}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono mb-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-500">Status:</span>
                      <span className={`font-bold flex items-center ${getStatusColor(response.status)}`}>
                        {response.status} {response.statusText}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-500">Time:</span>
                      <span className="text-emerald-400 flex items-center">
                        <Zap className="w-3 h-3 mr-1" />
                        {response.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-500">Size:</span>
                      <span className="text-slate-300">{response.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 relative group">
                  {activeResTab === 'body' && (
                    <>
                      <button
                        onClick={handleCopy}
                        className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2 z-10"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span className="text-xs font-medium">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <pre className="font-mono text-sm leading-relaxed">
                        <code dangerouslySetInnerHTML={{
                          __html: JSON.stringify(response.data, null, 2)
                            .replace(/"(.*?)":/g, '<span class="text-blue-400">"$1"</span>:')
                            .replace(/: "(.*?)"/g, ': <span class="text-emerald-400">"$1"</span>')
                            .replace(/: true/g, ': <span class="text-amber-400">true</span>')
                            .replace(/: false/g, ': <span class="text-amber-400">false</span>')
                            .replace(/: null/g, ': <span class="text-slate-500 italic">null</span>')
                        }} />
                      </pre>
                    </>
                  )}

                  {activeResTab === 'headers' && (
                    <div className="space-y-1 font-mono text-sm">
                      {response.headers.map((h: any, i: number) => (
                        <div key={i} className="flex py-1 border-b border-slate-800/50 hover:bg-slate-800/30">
                          <div className="w-1/3 text-indigo-300">{h.key}:</div>
                          <div className="w-2/3 text-emerald-300 break-all">{h.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
