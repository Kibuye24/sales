"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "OUTREACH STRATEGY",
  "MARKET DEMAND",
  "PITCH GUIDE",
  "COMPETITION ANALYSIS",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: data.reply, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-10 z-50 w-20 h-20 rounded-[40px] glass-card flex items-center justify-center cursor-pointer shadow-[0_4px_40px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all duration-500 overflow-hidden group border-white/20"
      >
        <div className="absolute inset-0 bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors" />
        <span className="text-[10px] font-bold tracking-[0.2em] text-white transition-colors relative z-10">
          {isOpen ? "CLOSE" : "CHAT"}
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-36 right-10 z-50 w-[420px] max-w-[calc(100vw-80px)] h-[600px] max-h-[calc(100vh-180px)] flex flex-col glass-card border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.9)] animate-premium overflow-hidden" 
             style={{ background: 'rgba(12, 15, 20, 0.98)', backdropFilter: 'blur(40px)' }}>
          <header className="p-10 pb-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-1">Intelligence Assistant</p>
              <h3 className="text-xl font-light tracking-tight">Active Session</h3>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_#10b981] animate-pulse" />
          </header>

          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {messages.length === 0 && (
              <div className="space-y-10">
                <p className="text-sm font-light text-white/60 leading-relaxed italic border-l-2 border-emerald-500/30 pl-6">"Awaiting strategic inquiries regarding the Nairobi market environment."</p>
                <div className="flex flex-col gap-3">
                   {QUICK_PROMPTS.map(p => (
                     <button 
                       key={p} 
                       onClick={() => sendMessage(p)}
                       className="text-left text-[10px] font-bold tracking-widest text-emerald-400/80 hover:text-emerald-400 border border-emerald-400/20 hover:border-emerald-400/50 hover:bg-emerald-500/5 rounded-2xl p-4 transition-all"
                     >
                       {p}
                     </button>
                   ))}
                </div>
              </div>
            )}

            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[85%] p-6 rounded-[32px] text-sm leading-relaxed shadow-lg ${m.role === 'user' ? 'bg-emerald-600/30 border border-emerald-500/30 text-white' : 'bg-white/[0.05] border border-white/10 text-white/90'}`}>
                    <div className="markdown-content">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                 </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white/[0.05] border border-white/10 p-6 rounded-[32px] flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animation-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animation-pulse" style={{ animationDelay: '200ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/30 animation-pulse" style={{ animationDelay: '400ms' }} />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <footer className="p-8 bg-black/40 border-t border-white/10">
             <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Enter strategic query..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-10 text-sm outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all uppercase tracking-widest text-[11px] font-bold text-white placeholder:text-white/20"
                />
                <button 
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full text-[10px] font-bold text-emerald-400 hover:text-white transition-colors"
                >
                  SEND
                </button>
             </div>
          </footer>
        </div>
      )}

      <style jsx global>{`
        .markdown-content p { margin-bottom: 0.5rem; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content strong { color: #fff; font-weight: 700; }
        .markdown-content ul, .markdown-content ol { padding-left: 1rem; margin-bottom: 0.5rem; }
        .markdown-content li { margin-bottom: 0.25rem; }
      `}</style>
    </>
  );
}
