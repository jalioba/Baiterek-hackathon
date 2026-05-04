"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/lib/mock-data";
import { useLang } from "@/lib/i18n";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatWidget() {
  const { t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: t.ai.welcome,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    if (messages.length >= 40) { // 20 sessions (40 messages)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "model",
        content: "Достигнут лимит сообщений в текущей сессии. Пожалуйста, перезагрузите страницу для нового диалога.",
        timestamp: new Date()
      }]);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    
    const newUserMsg: Message = { id: Date.now().toString(), role: "user", content: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const history = messages.filter(m => m.id !== "welcome").map(m => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.content
      }));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.concat({ role: "user", content: userMessage }),
          servicesContext: SERVICES
        })
      });

      const data = await response.json();
      const aiContent = data.message || "Извините, я не смог обработать ваш запрос.";

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: aiContent,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: "Произошла ошибка связи с сервером. Попробуйте позже.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
    setTimeout(() => {
      const form = document.getElementById("ai-chat-form") as HTMLFormElement;
      form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#003F87] text-white shadow-xl transition-transform hover:scale-110",
          isOpen && "rotate-90 scale-0 opacity-0"
        )}
      >
        <Bot size={28} />
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm border-2 border-white">
          AI
        </span>
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 origin-bottom-right border border-gray-100",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-[#003F87] px-4 py-3 text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles size={16} className="text-yellow-300" />
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border border-[#003F87]"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">{t.ai.name}</h3>
              <p className="text-[10px] text-blue-200">{t.ai.online}</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col max-w-[85%]", msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start")}>
              <div className="flex items-end gap-2 mb-1">
                {msg.role === "model" && <div className="w-6 h-6 rounded-full bg-[#003F87] flex items-center justify-center shrink-0 mb-1"><Bot size={14} className="text-white" /></div>}
                <div 
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap",
                    msg.role === "user" 
                      ? "bg-[#003F87] text-white rounded-br-sm" 
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
                  )}
                >
                  {/* Simplistic markdown bold rendering */}
                  {msg.content.split(/\*(.*?)\*/g).map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                </div>
              </div>
              
              <div className="text-[10px] text-gray-400 px-8">
                {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              {msg.role === "model" && msg.id !== "welcome" && (
                <div className="flex items-center gap-2 mt-1 ml-8">
                  <button className="text-gray-400 hover:text-green-600 transition-colors"><ThumbsUp size={12} /></button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors"><ThumbsDown size={12} /></button>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-end gap-2 mr-auto max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-[#003F87] flex items-center justify-center shrink-0 mb-1"><Bot size={14} className="text-white" /></div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick questions (only if no custom messages yet) */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-gray-100 bg-white">
            <button onClick={() => handleQuickQuestion("Какие кредиты доступны?")} className="text-[10px] bg-blue-50 text-[#003F87] px-2.5 py-1 rounded-full border border-blue-100 hover:bg-blue-100">Какие кредиты доступны?</button>
            <button onClick={() => handleQuickQuestion("Как получить гарантию?")} className="text-[10px] bg-blue-50 text-[#003F87] px-2.5 py-1 rounded-full border border-blue-100 hover:bg-blue-100">Как получить гарантию?</button>
          </div>
        )}

        {/* Input area */}
        <form id="ai-chat-form" onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.ai.placeholder}
              className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-2.5 text-sm outline-none focus:border-[#003F87] transition-colors"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-1 w-8 h-8 flex items-center justify-center bg-[#003F87] text-white rounded-full disabled:opacity-50 disabled:bg-gray-400 transition-colors"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
