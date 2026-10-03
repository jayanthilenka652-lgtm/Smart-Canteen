import React, { useState, useEffect } from 'react';
import { Sparkles, X, Clock, BrainCircuit, ArrowRight, Send, CheckCircle2 } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useCart } from '../context/CartContext';

export const AIRecommendationsModal = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('recommender');
  const [budget, setBudget] = useState(150);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  
  // AI Chat state
  const [query, setQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Smart Canteen AI Assistant. Ask me anything about today\'s menu, prep times, or dietary recommendations!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'recommender') {
      fetchRecommendations();
    }
  }, [isOpen, activeTab, budget]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await aiService.getSmartMealRecommendations('balanced', budget);
      if (res.success) {
        setRecommendations(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    setQuery('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const res = await aiService.answerCanteenQuery(userText);
      setChatMessages(prev => [...prev, { sender: 'ai', text: res.answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I had trouble processing that. Try asking about quick snacks or paneer combos!' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gradient-bg-amber text-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center text-slate-950">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold flex items-center gap-2 text-slate-950">
                Smart Canteen <Sparkles className="w-5 h-5 text-amber-900 animate-spin" />
              </h2>
              <p className="text-xs font-semibold text-slate-900">
                AI Meal Recommender & Intelligent Assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-950/20 text-slate-950 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-6 pt-3 space-x-4">
          <button
            onClick={() => setActiveTab('recommender')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'recommender'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ✨ Smart Recommendations
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'assistant'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            💬 AI Assistant Q&A
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'recommender' ? (
            <div className="space-y-6">
              {/* Budget Slider */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-300">Max Budget Filter:</span>
                  <span className="text-indigo-400 font-extrabold text-base">₹{budget}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {loading ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-slate-400">AI is analyzing nutritional balances and student demand patterns...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/40 transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-base">{rec.title}</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {rec.matchPercentage}% AI Match
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{rec.reason}</p>
                        </div>
                        <span className="text-lg font-extrabold text-emerald-400">
                          ₹{rec.estimatedCost}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" /> Prep: {rec.prepTime}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80">
                          🔥 {rec.calories}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80">
                          Included: {rec.items.join(', ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // AI Assistant Tab
            <div className="flex flex-col h-[350px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'gradient-bg text-white rounded-br-none shadow-md'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-400 p-3 rounded-2xl text-xs animate-pulse">
                      AI is formulating response...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChat} className="mt-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask AI e.g. What is the fastest item to order?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || chatLoading}
                  className="p-2.5 rounded-xl gradient-bg text-white disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsModal;
