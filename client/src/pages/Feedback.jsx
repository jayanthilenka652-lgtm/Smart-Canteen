import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { Star, MessageSquare, CheckCircle2, ShieldAlert, Send, ThumbsUp } from 'lucide-react';

export const Feedback = () => {
  const [searchParams] = useSearchParams();
  const prefilledOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(prefilledOrderId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/feedback');
      if (res.success && res.data) {
        setFeedbackList(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const submittedFeedback = feedbackList.find((feedback) => feedback.orderId === orderId.trim());
    setRating(submittedFeedback?.rating || 0);
  }, [feedbackList, orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!orderId.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid Collected Order ID' });
      return;
    }

    const trimmedComment = comment.trim();
    const hasFeedback = trimmedComment.length > 0 && Number.isFinite(rating) && rating >= 1 && rating <= 5;

    if (!hasFeedback) {
      setMessage({ type: 'success', text: 'Feedback skipped. You can submit it later if you wish.' });
      setComment('');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/feedback', {
        orderId,
        rating,
        comment: trimmedComment
      });

      if (res.success) {
        setMessage({ type: 'success', text: res.message || 'Thank you for your feedback!' });
        setComment('');
        fetchFeedbacks();
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Feedback submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    setMessage({ type: 'success', text: 'Feedback skipped. You can always share your experience later.' });
    setComment('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Canteen Feedback & Student Ratings</h1>
        <p className="text-xs text-slate-400">Share your experience on food quality, speed & pickup service</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Submission Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <MessageSquare className="w-5 h-5 text-amber-400" /> Submit Order Feedback
          </h2>

          {message.text && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Collected Order ID</label>
              <input
                type="text"
                required
                placeholder="e.g. ORD-847291"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Note: Feedback can be submitted only for orders marked Collected.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Rating Star Score</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} out of 5 stars`}
                    aria-pressed={star <= rating}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-sm text-amber-400">
                  {rating ? `${rating} / 5 Stars` : 'No rating selected'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Review Comment</label>
              <textarea
                rows="4"
                required
                placeholder="How was the food quality, warmth, and slot pickup speed?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm text-slate-950 gradient-bg-amber shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : <>Submit Feedback <Send className="w-4 h-4" /></>}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="sm:w-auto px-4 py-3 rounded-xl font-semibold text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700"
              >
                Skip / Maybe Later
              </button>
            </div>
          </form>
        </div>

        {/* Public Student Reviews List */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <ThumbsUp className="w-5 h-5 text-indigo-400" /> Recent Student Reviews ({feedbackList.length})
          </h2>

          {loading ? (
            <Loader label="Loading student reviews..." />
          ) : feedbackList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No feedback entries submitted yet. Be the first to rate your order!
            </div>
          ) : (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {feedbackList.map((fb) => (
                <div key={fb._id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{fb.userName || 'Student'}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    "{fb.comment}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>Order: {fb.orderId}</span>
                    <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
