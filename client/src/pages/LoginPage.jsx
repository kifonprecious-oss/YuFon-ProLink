import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // If user is admin, redirect to admin panel, otherwise profile/dashboard hub
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      } else {
        // Explicitly handle pending admin approval error message from backend
        setErrorMsg(data.error || (lang === 'fr' ? 'Compte en attente d’approbation par l’administrateur ou identifiants invalides.' : 'Account pending admin approval or invalid credentials.'));
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setErrorMsg(lang === 'fr' ? 'Impossible de se connecter au serveur backend.' : 'Unable to connect to the backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full z-20 my-auto">
        
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#111622] border border-slate-800 text-emerald-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-inner">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> {t.loginBadge || 'Secure Portal Login'}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white">{t.loginTitle || 'Welcome Back'}</h1>
          <p className="text-slate-300 text-xs mt-1">{t.loginSubtitle || 'Sign in to access your dashboard and manage projects.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111622]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 backdrop-blur-md">
          
          {errorMsg && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 p-3.5 rounded-2xl text-xs flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

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
                placeholder="e.g. user@example.com" 
                className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
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

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl shadow-xl transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (lang === 'fr' ? 'Connexion en cours...' : 'Signing In...') : (t.signInBtn || 'Sign In')} <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            {t.noAccount || "Don't have an account?"}{' '}
            <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
              {t.registerLink || 'Register now'}
            </Link>
          </p>
        </form>

      </div>
      <Footer />
    </div>
  );
}