import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import { User, MapPin, Phone, Briefcase, Camera, ShieldCheck, AlertCircle, Save, Lock } from 'lucide-react';

export default function ProfileSetupPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    bio: '',
    skills: ''
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Load existing user data on component mount
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};

      setFormData({
        fullName: storedUser.name || storedUser.fullName || '',
        email: storedUser.email || '',
        phone: storedUser.phone || '',
        location: storedUser.location || 'Buea, Cameroon',
        role: storedUser.role ? (storedUser.role.charAt(0).toUpperCase() + storedUser.role.slice(1)) : 'Client',
        bio: storedUser.bio || '',
        skills: storedUser.services ? (Array.isArray(storedUser.services) ? storedUser.services.join(', ') : storedUser.services) : (storedUser.skills || '')
      });

      if (storedUser.profilePicture) {
        const fullImgUrl = storedUser.profilePicture.startsWith('http') 
          ? storedUser.profilePicture 
          : `http://localhost:5000${storedUser.profilePicture}`;
        setPreviewUrl(fullImgUrl);
      }
    } catch (err) {
      console.error('Failed to load profile details for editing:', err);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatusMsg({ type: '', text: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
      const userId = currentUser._id || currentUser.id;

      // Prepare form data for backend submit (including file if uploaded)
      const data = new FormData();
      data.append('userId', userId);
      data.append('phone', formData.phone);
      data.append('bio', formData.bio);
      data.append('skills', formData.skills);
      if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }

      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (response.ok || result.success) {
        // Update local session storage
        const updatedUser = {
          ...currentUser,
          phone: formData.phone,
          bio: formData.bio,
          services: formData.skills,
          skills: formData.skills,
          profilePicture: result.user?.profilePicture || currentUser.profilePicture
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        setStatusMsg({
          type: 'success',
          text: lang === 'fr' ? 'Profil mis à jour avec succès !' : 'Profile updated successfully!'
        });

        setTimeout(() => {
          navigate('/profile');
        }, 1200);
      } else {
        setStatusMsg({
          type: 'error',
          text: result.error || (lang === 'fr' ? 'Échec de la mise à jour.' : 'Failed to update profile.')
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setStatusMsg({
        type: 'error',
        text: lang === 'fr' ? 'Erreur de connexion au serveur.' : 'Unable to connect to backend server.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-20 space-y-6">
        
        {/* Header Title */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 bg-[#111622] border border-slate-800 text-emerald-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-inner">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            {lang === 'fr' ? 'Mettre à jour vos informations' : 'Profile Management'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'fr' ? 'Modifier le Profil' : 'Edit Profile Details'}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {lang === 'fr' 
              ? 'Mettez à jour votre biographie, compétences et photo de profil.' 
              : 'Keep your professional biography, contacts, and expertise up to date.'}
          </p>
        </div>

        {/* Status Message Display */}
        {statusMsg.text && (
          <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
          }`}>
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Profile Setup Form */}
        <form onSubmit={handleSubmit} className="bg-[#111622]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-md">
          
          {/* Avatar Upload / Preview Section */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-slate-800">
            <div className="relative">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile Preview" 
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-emerald-400/50 shadow-xl" 
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 font-black flex items-center justify-center text-3xl shadow-xl uppercase border-2 border-emerald-300/40">
                  {(formData.fullName || 'U').charAt(0)}
                </div>
              )}
              <label 
                htmlFor="avatar-upload" 
                className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2 rounded-full cursor-pointer shadow-lg transition border-2 border-[#111622]"
                title="Upload Photo"
              >
                <Camera className="h-4 w-4" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </label>
            </div>
            <span className="text-[11px] text-slate-400">
              {lang === 'fr' ? 'Cliquez sur l’icône appareil photo pour changer l’image' : 'Click camera icon to change profile picture'}
            </span>
          </div>

          {/* Locked Identity Information Warning Box */}
          <div className="bg-[#0A0D14] border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
            <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-300/90 leading-relaxed">
              <strong>Identity Lock Security:</strong> Full Name and Registered Location are permanently verified to prevent impersonation and fraud. To request changes to locked details, submit a verification request to Admin support.
            </p>
          </div>

          {/* Grid Layout for Locked & Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name (LOCKED) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-500" /> Full Name <Lock className="h-3 w-3 text-amber-400 ml-auto" />
              </label>
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                readOnly 
                className="w-full bg-[#0A0D14]/60 border border-slate-800 text-slate-400 rounded-2xl px-4 py-3 text-xs cursor-not-allowed focus:outline-none" 
              />
            </div>

            {/* Email (LOCKED) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                Email Address <Lock className="h-3 w-3 text-amber-400 ml-auto" />
              </label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                readOnly 
                className="w-full bg-[#0A0D14]/60 border border-slate-800 text-slate-400 rounded-2xl px-4 py-3 text-xs cursor-not-allowed focus:outline-none" 
              />
            </div>

            {/* Location (LOCKED) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" /> Registered Location <Lock className="h-3 w-3 text-amber-400 ml-auto" />
              </label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                readOnly 
                className="w-full bg-[#0A0D14]/60 border border-slate-800 text-slate-400 rounded-2xl px-4 py-3 text-xs cursor-not-allowed focus:outline-none" 
              />
            </div>

            {/* Phone Number (EDITABLE) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-teal-400" /> Phone Number (Editable)
              </label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="e.g. +237 670000000" 
                className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400" 
              />
            </div>
          </div>

          {/* Bio (EDITABLE) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5 text-teal-400" /> Biography / Experience
            </label>
            <textarea 
              name="bio" 
              rows="3" 
              value={formData.bio} 
              onChange={handleChange} 
              placeholder="Tell clients or contractors about your experience, qualifications, and background..." 
              className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Skills & Stack (EDITABLE) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Skills & Stack / Services Offered (Comma separated)
            </label>
            <input 
              type="text" 
              name="skills" 
              value={formData.skills} 
              onChange={handleChange} 
              placeholder="e.g. Full-Stack Web App, React, Node.js, Electrical Wiring, Plumbing" 
              className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400" 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl shadow-xl transition text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting 
              ? (lang === 'fr' ? 'Enregistrement...' : 'Saving Changes...') 
              : (lang === 'fr' ? 'Enregistrer les Modifications' : 'Save Profile Changes')}
          </button>

        </form>

      </div>
      <Footer />
    </div>
  );
}