import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Utensils, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2,
  Users,
  Award
} from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-400" /> College Canteen Pre-Order System
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-tight">
              Smart <span className="gradient-text">Canteen</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-indigo-200/90 tracking-normal">
              Skip the Queue, Enjoy Your Food On Time.
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Pre-order your favorite campus meals, select a guaranteed capacity-limited pickup slot, and collect your food without standing in line.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white gradient-bg shadow-lg shadow-indigo-500/30 hover:scale-[1.03] transition-all flex items-center justify-center gap-2"
              >
                Browse Menu & Order Now <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-200 glass-card hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                Sign In / Demo Login <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Stat Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-5 rounded-2xl text-center">
              <span className="text-3xl font-extrabold text-indigo-400 block mb-1">0 Mins</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Queue Time Saved</span>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <span className="text-3xl font-extrabold text-purple-400 block mb-1">100%</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Slot Capacity Control</span>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <span className="text-3xl font-extrabold text-emerald-400 block mb-1">Live</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Real-Time Status</span>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <span className="text-3xl font-extrabold text-amber-400 block mb-1">4.9 ★</span>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Student Feedback</span>
            </div>
          </div>
        </div>
      </section>

      {/* SRS Features Section */}
      <section className="py-20 bg-slate-900/60 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white">Engineered as per SRS Specifications</h2>
            <p className="text-slate-400 text-sm">
              Complete end-to-end functionality mapping every functional requirement from the Software Requirements Specification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Capacity-Limited Pickup Slots</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Prevents canteen crowding by spreading student arrivals evenly across 15-minute time slots with real-time seat availability checks.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Live Status Pipeline</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Track your order in real-time through every stage: Placed → Accepted → Preparing → Ready for Pickup → Collected.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Smart Canteen AI Assistant</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Integrated rule-based AI engine recommending balanced student meal combos and predicting peak hour preparation delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-white">How It Works</h2>
            <p className="text-slate-400 text-sm">4 simple steps to pre-order your lunch on campus.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <span className="w-8 h-8 rounded-full gradient-bg text-white font-extrabold text-sm flex items-center justify-center mb-4">1</span>
              <h4 className="font-bold text-white mb-2">Browse & Select</h4>
              <p className="text-xs text-slate-400">Choose from South Indian, Combos, Snacks, Chinese and Beverages.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <span className="w-8 h-8 rounded-full gradient-bg text-white font-extrabold text-sm flex items-center justify-center mb-4">2</span>
              <h4 className="font-bold text-white mb-2">Reserve Pickup Slot</h4>
              <p className="text-xs text-slate-400">Select an available 15-minute time window that fits your class schedule.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <span className="w-8 h-8 rounded-full gradient-bg text-white font-extrabold text-sm flex items-center justify-center mb-4">3</span>
              <h4 className="font-bold text-white mb-2">Choose Payment</h4>
              <p className="text-xs text-slate-400">Pay online or choose Cash on Pickup upon order collection.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <span className="w-8 h-8 rounded-full gradient-bg text-white font-extrabold text-sm flex items-center justify-center mb-4">4</span>
              <h4 className="font-bold text-white mb-2">Collect & Rate</h4>
              <p className="text-xs text-slate-400">Show your Order ID at the counter when status is Ready, then submit rating.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <p>Smart Canteen Pre-Order System • Built strictly as per SRS Specifications by Lenka Jayanthi</p>
      </footer>
    </div>
  );
};

export default Landing;
