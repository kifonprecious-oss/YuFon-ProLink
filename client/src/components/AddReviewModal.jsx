import React, { useState } from 'react';
import { X, Star, Send, User, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AddReviewModal({ professional, onClose }) {
  const { lang, t } = useLanguage();
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId: professional._id || professional.id,
          clientName,
          rating: Number(rating),
          comment
        })
      });

      if (response.ok) {
        alert(lang === 'fr' ? 'Avis soumis avec succès !' : 'Review submitted successfully!');
        onClose();
      } else {
        alert(lang === 'fr' ? 'Échec de la soumission de l’avis.' : 'Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
      <div className="bg-blue-900 border border-blue-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-blue-950/50 p-1.5 rounded-xl transition">
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-black mb-1">
          {lang === 'fr' ? `Noter ${professional.name}` : `Rate ${professional.name}`}
        </h3>
        <p className="text-xs text-slate-300 mb-4">{t.reviewSubtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t.yourNameLabel}</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-blue-950/80 border border-blue-700/70 rounded-xl px-3 py-2.5 pl-9 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t.ratingLabel}</label>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400 fill-current" />
              <select 
                value={rating} 
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-blue-950/80 border border-blue-700/70 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="5">{lang === 'fr' ? '5 - Travail excellent' : '5 - Excellent Work'}</option>
                <option value="4">{lang === 'fr' ? '4 - Très bien' : '4 - Very Good'}</option>
                <option value="3">{lang === 'fr' ? '3 - Moyen' : '3 - Average'}</option>
                <option value="2">{lang === 'fr' ? '2 - En dessous des attentes' : '2 - Below Expectations'}</option>
                <option value="1">{lang === 'fr' ? '1 - Médiocre' : '1 - Poor'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t.reviewCommentLabel}</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <textarea 
                required
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={lang === 'fr' ? 'Écrivez des détails sur la qualité du service, le délai et le professionnalisme...' : 'Write details about the service quality, timeline, and professionalism...'}
                className="w-full bg-blue-950/80 border border-blue-700/70 rounded-xl p-3 pl-9 text-sm text-white focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> {isSubmitting ? (lang === 'fr' ? 'Envoi en cours...' : 'Submitting...') : t.postReviewBtn}
          </button>
        </form>
      </div>
    </div>
  );
}