import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { wayfarerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  timestamp: string;
}

interface AIAssistantDrawerProps {
  currentDestinationName?: string;
  currentTripId?: string;
}

export function AIAssistantDrawer({
  currentDestinationName,
  currentTripId
}: AIAssistantDrawerProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your Wayfarer trip assistant. I'm grounded in real itinerary plans and verified reviews. Ask me anything about ${currentDestinationName || 'your travel plans'}!`,
      sources: ['Wayfarer Verified System'],
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    `What should I do on day 2?`,
    `Cheap places to eat nearby`,
    `How do I get around?`,
    `Recommended stays with sea views`
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await wayfarerApi.chatAssistant({
        message: text,
        destinationName: currentDestinationName,
        tripId: currentTripId
      });

      const assistantMsg: Message = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        sources: res.sources || ['Groq llama-3.3-70b-versatile'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const isRateLimited = err?.code === 'LLM_RATE_LIMITED' || err?.message?.includes('busy') || err?.status === 429;
      const errorText = isRateLimited
        ? 'The assistant is busy, try again in a minute'
        : 'The assistant is temporarily unavailable. Please try again shortly.';

      const fallbackMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: errorText,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Violet Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-[#6D28D9] hover:bg-[#5B21B6] text-white p-3.5 rounded-full shadow-wayfarer-lg hover:scale-105 transition-all flex items-center gap-2 group"
          aria-label="Open Wayfarer AI Assistant"
        >
          <Sparkles className="w-5 h-5" />
          <span className="hidden group-hover:inline text-xs font-semibold pr-1 whitespace-nowrap">
            Ask Wayfarer AI
          </span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-l border-[#EDE9FE] flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-[#EDE9FE] bg-[#F5F3FF] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#6D28D9] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#1F1637]">
                  Wayfarer AI Assistant
                </h3>
                <p className="text-[10px] text-[#6D28D9] font-medium">
                  Groq (llama-3.3-70b-versatile) · Grounded in real data
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-[#6B6385] hover:text-[#1F1637] hover:bg-white/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-[#F5F3FF] border border-[#EDE9FE] text-[#6D28D9] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-[#F5F3FF] text-[#1F1637] border border-[#EDE9FE]'
                        : 'bg-[#6D28D9] text-white shadow-sm'
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#EDE9FE]/60 text-[10px] text-[#6B6385] flex flex-wrap gap-1">
                        <span className="font-medium text-[#6D28D9]">Sources:</span>
                        {m.sources.map((s, idx) => (
                          <span key={idx} className="bg-white px-1.5 py-0.5 rounded border border-[#EDE9FE]">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="block mt-1 text-[10px] opacity-60 text-right">
                      {m.timestamp}
                    </span>
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-[#6D28D9] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold">
                      {user?.displayName ? user.displayName[0] : 'U'}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#6B6385] p-3 bg-[#F5F3FF] rounded-2xl border border-[#EDE9FE] w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-[#6D28D9]" />
                <span>Checking approved reviews &amp; schedule...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 border-t border-[#EDE9FE] bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] font-medium bg-[#F5F3FF] text-[#6D28D9] hover:bg-[#EDE9FE] rounded-lg transition-colors border border-[#EDE9FE] shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-[#EDE9FE] bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about places, food, or schedule..."
              className="flex-1 px-3.5 py-2.5 text-xs bg-[#F5F3FF] rounded-xl border border-[#EDE9FE] focus:outline-none focus:border-[#6D28D9] text-[#1F1637]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 bg-[#6D28D9] text-white rounded-xl hover:bg-[#5B21B6] transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
