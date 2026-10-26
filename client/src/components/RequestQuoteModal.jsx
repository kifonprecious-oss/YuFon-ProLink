import React, { useState } from 'react';
import { X, Send, FileText, DollarSign, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function RequestQuoteModal({ professional, onClose }) {
  const { lang, t } = useLanguage();
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newRequest = {
      professionalId: professional._id || professional.id,
      professionalName: professional.name,
      projectTitle,
      description,
      budget,
      timeline,
      status: 'Pending'
    };

    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRequest)
      });

      if (response.ok) {
        alert(
          lang === 'fr'
            ? `Demande envoyée avec succès à ${professional.name} ! Il/Elle l'examinera et vous contactera.`
            : `Request successfully sent to ${professional.name}! They will review and get back to you.`
        );
        onClose();
      } else {
        const errData = await response.json();
        alert(
          lang === 'fr'
            ? `Échec de l'envoi de la demande : ${errData.error || 'Erreur du serveur'}`
            : `Failed to send request: ${errData.error || 'Server error'}`
        );
      }
    } catch (error) {
      console.error('Error connecting to backend server:', error);
      alert(
        lang === 'fr'
          ? 'Impossible de se connecter au serveur backend. Assurez-vous que votre serveur fonctionne sur le port 5000.'
          : 'Unable to connect to the backend server. Make sure your server is running on port 5000.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
      <div className="bg-blue-900 border border-blue-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-blue-950/50 p-1.5 rounded-xl transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-500/30">
            {t.requestQuotationBadge}
          </span>
          <h3 className="text-xl font-black mt-2">
            {lang === 'fr' ? `Embaucher ${professional.name}` : `Hire ${professional.name}`}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            {professional.category || (lang === 'fr' ? 'Services techniques et d’ingénierie' : 'Technical & Engineering Services')} • {professional.location || 'Buea, Cameroon'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t.projectTitleLabel}</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder={lang === 'fr' ? 'ex. Installation d’un onduleur solaire pour bureau' : 'e.g. Solar Inverter Setup for Office Building'}
                className="w-full bg-blue-950/80 border border-blue-700/70 rounded-xl px-3 py-2.5 pl-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t.projectDescLabel}</label>
            <textarea 
              required
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === 'fr' ? 'Décrivez ce qui doit être fait, les spécifications et les exigences...' : 'Describe what needs to be done, specifications, and requirements...'}
              className="w-full bg-blue-950/80 border border-blue-700/70 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.estimatedBudgetLabel}</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 150,000 XAF"
                  className="w-full bg-blue-950/80 border border-blue-700/70 rounded-xl px-3 py-2.5 pl-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.expectedTimelineLabel}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder={lang === 'fr' ? 'ex. 3 Jours' : 'e.g. 3 Days'}
                  className="w-full bg-blue-950/80 border border-blue-700/70 rounded-xl px-3 py-2.5 pl-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="w-1/3 bg-blue-950 hover:bg-blue-900 border border-blue-700 text-slate-300 font-bold py-3 rounded-xl transition text-xs"
            >
              {t.cancelBtn}
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-2/3 bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold py-3 rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {isSubmitting ? (lang === 'fr' ? 'Envoi...' : 'Sending...') : t.sendRequestBtn}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}