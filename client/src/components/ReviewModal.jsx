import React, { useState } from 'react';
import { Star, X, CheckCircle2, Loader2, Award } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function ReviewModal({ contract, onClose, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!contract) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract._id,
          professionalId: contract.professionalId,
          clientId: contract.clientId,
          clientName: contract.clientName,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (res.ok) {
        onReviewSubmitted(data.review);
        onClose();
      } else {
        alert(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Review submission error:', err);
      alert('Network error while submitting review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111622] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-[#0A0D14] p-2 rounded-xl border border-slate-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-3 py-1 rounded-full mb-2">
            <Award className="h-3.5 w-3.5" /> Contract-Verified Review
          </span>
          <h2 className="text-lg font-black text-white">Rate {contract.professionalName}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Share your feedback for <strong className="text-white">{contract.projectTitle}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Interactive Star Rating Selector */}
          <div className="flex flex-col items-center justify-center bg-[#0A0D14] p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300">Overall Rating</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition transform hover:scale-110"
                >
                  <Star 
                    className={`h-7 w-7 ${
                      (hoverRating || rating) >= star 
                        ? 'text-amber-400 fill-amber-400 drop-shadow' 
                        : 'text-slate-600'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold text-amber-400">
              {rating === 5 ? '⭐ Exceptional Quality' : rating === 4 ? '👍 Very Good' : rating === 3 ? '👌 Satisfactory' : 'Needs Improvement'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Written Feedback</label>
            <textarea
              rows="3"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe communication quality, adherence to timeline, and technical execution..."
              className="w-full bg-[#0A0D14] border border-slate-700 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-black py-3.5 rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting Review...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Submit Verified Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}