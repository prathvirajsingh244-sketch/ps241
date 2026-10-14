import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Bot, User, AlertTriangle, Mic } from 'lucide-react';
import { counsellingApi, parseApiError } from '../services/api';
import type { CounsellingMessage, CounsellingResponse } from '../types';
import { LoadingSpinner } from '../components/LoadingState';
import PageWrapper from '../components/PageWrapper';
import MockBanner from '../components/MockBanner';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export default function CounsellingChat() {
  const [messages, setMessages] = useState<CounsellingMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: CounsellingMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      message_text: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res: CounsellingResponse = await counsellingApi.sendMessage({
        message: text,
        conversation_id: conversationId,
        language,
      });
      setConversationId(res.conversation_id);

      const assistantMsg: CounsellingMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        message_text: res.answer,
        created_at: new Date().toISOString(),
        source_refs: res.source_refs,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (res.needs_human_followup) {
        const followupMsg: CounsellingMessage = {
          id: `followup-${Date.now()}`,
          role: 'assistant',
          message_text: '⚠️ This question may need personalised advice from a human counsellor. Would you like to book a meeting?',
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, followupMsg]);
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <MockBanner />
      <PageWrapper className="!py-4">
        <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <Bot className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">AI Career Counsellor</h1>
                <p className="text-xs text-gray-500">
                  Powered by backend AI service · Source-grounded answers
                  {USE_MOCK && <span className="ml-2 badge-amber">Mock responses</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="language-toggle" className="text-xs text-gray-500">Language:</label>
              <select
                id="language-toggle"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          </div>

          {/* Privacy notice */}
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <AlertTriangle className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              AI answers are based on verified career information but may be incomplete. Do not share sensitive personal information.
              For important decisions, consult a qualified human counsellor. AI provider is managed securely on the backend.
            </p>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto space-y-4 pr-1"
            role="log"
            aria-live="polite"
            aria-label="Counselling conversation"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-200 mb-4" />
                <h2 className="text-base font-semibold text-gray-700">Ask your career question</h2>
                <p className="mt-1 text-sm text-gray-400 max-w-xs">
                  For example: "What is the ITI Electrician course?" or "How do I become a Solar Technician?"
                </p>
                <div className="mt-4 flex flex-col gap-2 w-full max-w-sm">
                  {[
                    'What is the ITI Electrician course?',
                    'How do I enroll in a PMKVY training programme?',
                    'What careers suit someone who likes working outdoors?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-left rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 hover:border-green-300 hover:bg-green-50 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  msg.role === 'user' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-tr-sm'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.message_text}
                  </div>
                  {msg.source_refs && msg.source_refs.length > 0 && (
                    <div className="px-2">
                      <p className="text-xs text-gray-400">Sources:</p>
                      <ul className="text-xs text-gray-500 space-y-0.5">
                        {msg.source_refs.map((ref, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span> {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 px-1">
                    {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white border border-gray-100 px-4 py-3 flex items-center gap-2 shadow-sm">
                  <LoadingSpinner className="h-4 w-4" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="mt-4 flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                id="counselling-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your career question... (Enter to send)"
                rows={2}
                className="form-input resize-none pr-10"
                aria-label="Type your career question"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                title="Voice input — requires backend voice service support"
                disabled
                className="btn-secondary p-2.5 opacity-40 cursor-not-allowed"
                aria-label="Voice input (not yet available)"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                id="counselling-send"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="btn-primary p-2.5"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-400 text-center">
            Voice input requires backend speech service — currently unavailable. Text input always works.
          </p>
        </div>
      </PageWrapper>
    </>
  );
}
