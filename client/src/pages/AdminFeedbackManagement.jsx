import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { Star, MessageSquare, ThumbsUp, RefreshCw } from 'lucide-react';

export const AdminFeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/feedback');
      if (res.success && res.data) {
        setFeedbacks(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 'N/A';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Student Feedback Reviews</h1>
          <p className="text-xs text-slate-400">Review student ratings & service improvement comments</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-sm flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> Overall Avg: {avgRating} / 5
          </div>
          <button
            onClick={fetchFeedbacks}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading student feedback..." />
      ) : feedbacks.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl text-slate-400 text-sm">
          No feedback entries submitted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">{fb.userName || 'Student'}</h4>
                  <span className="text-[11px] text-indigo-400 font-semibold">Order ID: {fb.orderId}</span>
                </div>

                <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-amber-300 text-xs">{fb.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                "{fb.comment}"
              </p>

              <div className="text-[10px] text-slate-500 text-right">
                Submitted on {new Date(fb.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackManagement;
