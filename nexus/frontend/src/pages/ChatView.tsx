import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Layout, FileText, ChevronRight } from 'lucide-react';
import { chatWithNexus } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatView() {
  const [messages, setMessages] = useState<Array<{role: string, content: string, sources?: any[], trace?: any[]}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('auto');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setLoading(true);

    try {
      const response = await chatWithNexus(userQuery, mode);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        trace: response.trace
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'An error occurred connecting to the backend engine.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <div className="h-16 border-b border-zinc-800/60 bg-zinc-950/30 backdrop-blur-md flex items-center px-6 justify-between">
          <h2 className="text-sm font-semibold text-white">NexusLLM Engine</h2>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-zinc-500">ROUTING MODE:</span>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-300 focus:outline-none focus:border-blue-500"
            >
              <option value="auto">AUTO</option>
              <option value="direct">DIRECT</option>
              <option value="rag">RAG</option>
              <option value="agentic">AGENTIC</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-center px-4">
              <div className="max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-zinc-800 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/10">
                  <Cpu className="text-blue-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Autonomous Agentic Reasoning</h3>
                <p className="text-zinc-400 text-sm">
                  Initialize query to test document retrieval, tool calling, and deterministic routing.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-600/10 border border-blue-500/20 text-blue-100' 
                  : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-300'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                
                {/* Sources Display */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div className="text-xs font-mono text-zinc-500 mb-2 flex items-center gap-1">
                      <FileText size={12} /> GROUNDING SOURCES
                    </div>
                    <div className="space-y-2">
                      {msg.sources.map((src, idx) => (
                        <div key={idx} className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50 text-xs">
                          <span className="text-blue-400 font-semibold">[{src.id}] {src.filename}</span>
                          <span className="text-zinc-600 ml-2">Score: {src.score?.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-zinc-800/60 bg-zinc-950/50 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the Nexus Engine..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white placeholder-zinc-500 shadow-inner"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Observability Sidebar (Right) */}
      <div className="w-80 border-l border-zinc-800/60 bg-zinc-950/50 backdrop-blur-xl hidden lg:flex flex-col">
        <div className="h-16 border-b border-zinc-800/60 flex items-center px-4 gap-2 text-sm font-semibold text-white">
          <Layout size={16} className="text-purple-400" /> Execution Trace
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {messages.filter(m => m.trace).map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6"
              >
                <div className="text-[10px] font-mono text-zinc-500 mb-3 uppercase">Transaction #{idx+1}</div>
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                  {msg.trace?.map((step, sIdx) => (
                    <div key={sIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <ChevronRight size={12} />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 shadow-sm text-xs">
                        <div className="font-mono text-blue-400 mb-1">{step.step}</div>
                        <div className="text-zinc-400">{step.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-zinc-600 text-xs font-mono text-center">
              Awaiting query execution...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
