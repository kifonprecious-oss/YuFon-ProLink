import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Upload, Send, ShieldCheck } from 'lucide-react';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function PostRequestPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    image: null,
    imageName: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result,
          imageName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const newRequest = {
      ...formData,
      budget: 'Discussed via Chat',
      _id: Date.now().toString(),
      clientId: currentUser._id || currentUser.id || 'local-client',
      clientName: currentUser.name || 'Client',
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    try {
      // Always save to localStorage first so it's instantly available
      const existing = JSON.parse(localStorage.getItem('clientRequests')) || [];
      localStorage.setItem('clientRequests', JSON.stringify([newRequest, ...existing]));

      // Attempt to post to backend API, catch any offline/network errors seamlessly
      await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      }).catch((err) => {
        console.warn('Backend server offline, saved locally to localStorage.', err);
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12 w-full z-20 my-auto">
        
        <div className="bg-[#111622]/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-3 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {lang === 'fr' ? 'Nouveau Projet' : 'Client Portal'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-white">
              {lang === 'fr' ? 'Publier un nouvel emploi' : 'Post a New Job'}
            </h1>
            <p className="text-slate-300 text-xs mt-1">
              {lang === 'fr' 
                ? 'Remplissez les détails ci-dessous. Le budget sera discuté directement par chat avec les professionnels.' 
                : 'Provide the project specifications. Pricing and budget will be discussed directly via chat with professionals.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'fr' ? 'Titre du projet / Emploi' : 'Job Title'}
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={lang === 'fr' ? 'Ex: Peinture de maison' : 'e.g. House Painting Job'}
                  className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'fr' ? 'Lieu du travail' : 'Job Location'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={lang === 'fr' ? 'Ex: Mudeka' : 'e.g. Mudeka'}
                  className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'fr' ? 'Ajouter une photo / image de référence (Optionnel)' : 'Upload Reference Picture / Mockup (Optional)'}
              </label>
              <div className="border-2 border-dashed border-slate-700/80 rounded-2xl p-4 text-center bg-[#0A0D14]/60 hover:border-emerald-400 transition relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <Upload className="h-6 w-6 text-emerald-400" />
                  <p className="text-xs text-slate-300 font-medium">
                    {formData.imageName ? (
                      <span className="text-emerald-400 font-bold">{formData.imageName}</span>
                    ) : (
                      lang === 'fr' ? 'Cliquez pour télécharger ou glissez-déposez une image' : 'Click to upload or drag & drop an image'
                    )}
                  </p>
                  <p className="text-[10px] text-slate-500">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'fr' ? 'Description détaillée' : 'Project Description'}
              </label>
              <textarea 
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder={lang === 'fr' ? 'Décrivez vos attentes...' : 'Describe scope of work...'}
                className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-3 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                {lang === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button 
                type="submit"
                disabled={submitting}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition shadow-lg"
              >
                <Send className="h-4 w-4" /> {submitting ? 'Submitting...' : (lang === 'fr' ? 'Publier le Job' : 'Publish Job')}
              </button>
            </div>
          </form>
        </div>

      </div>
      <Footer />
    </div>
  );
}