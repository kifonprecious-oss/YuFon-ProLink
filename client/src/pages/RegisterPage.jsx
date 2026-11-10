import React, { useState } from 'react';
import { User, Mail, Lock, MapPin, Phone, Briefcase, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE_URL } from '../config';

export default function RegisterPage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    phone: '',
    category: 'Software & Digital Development'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'professional' })
      });

      const data = await response.json();

      if (response.ok) {
        // Automatically store user session and route to profile setup
        if (data.user) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        alert(lang === 'fr' ? 'Inscription réussie ! Veuillez configurer votre profil.' : 'Registration successful! Please setup your profile.');
        navigate('/profile-setup');
      } else {
        alert(lang === 'fr' ? `Échec de l’inscription : ${data.error || 'Veuillez vérifier vos informations'}` : `Registration failed: ${data.error || 'Please check your details'}`);
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert(lang === 'fr' ? 'Impossible de se connecter au serveur backend.' : 'Unable to connect to the backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full z-20 my-auto">
        
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 bg-[#111622] border border-slate-800 text-emerald-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-inner">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> {t.registerBadge || 'Secure Registration Portal'}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {lang === 'fr' ? 'Créer un compte' : 'Create Account'}
          </h1>
          <p className="text-slate-300 text-xs mt-1">{t.registerSubtitle || 'Join our platform to connect with verified professionals and clients.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111622]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 backdrop-blur-md">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.fullNameLabel || 'Full Name'}</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Eng. Kifon Precious" 
                  className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.emailLabel || 'Email Address'}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. kifon@example.com" 
                  className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t.passwordLabel || 'Password'}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••" 
                className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.locationLabel || 'Location'}</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Buea, Cameroon" 
                  className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t.phoneLabel || 'Phone Number'}</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +237 6XXXXXXXX" 
                  className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">{t.specialtyLabel || 'Professional Specialty'}</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 pl-10 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Software & Digital Development">Software & Digital Development (Web, Mobile, Apps)</option>
                <option value="IT Support & Network Engineering">IT Support, Networking & Hardware Repairs</option>
                <option value="Cybersecurity & Database Administration">Cybersecurity & Database Administration</option>
                <option value="Graphics & Brand Design">Graphics, Brand Design & Packaging</option>
                <option value="Video Editing, Photography & Cinematography">Video Editing, Photography & Cinematography</option>
                <option value="Technical & Engineering Services">Technical & Engineering Services</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl shadow-xl transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (lang === 'fr' ? 'Création du compte...' : 'Creating Account...') : (t.completeRegBtn || 'Complete Registration')} <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            {t.alreadyAccount || (lang === 'fr' ? 'Déjà un compte ?' : 'Already have an account?')}{' '}
            <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
              {t.signInLink || (lang === 'fr' ? 'Se connecter' : 'Sign In')}
            </Link>
          </p>
        </form>

      </div>
      <Footer />
    </div>
  );
}