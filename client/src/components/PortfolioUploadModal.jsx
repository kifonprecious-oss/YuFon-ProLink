import React, { useState } from 'react';
import { Image as ImageIcon, X, Upload, Loader2, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function PortfolioUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Software & Digital Development');
  const [isBeforeAfter, setIsBeforeAfter] = useState(false);
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const professionalId = currentUser._id || currentUser.id;
    const professionalName = currentUser.name || 'Professional';

    if (!professionalId) {
      alert('You must be logged in as a professional.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('professionalId', professionalId);
    formData.append('professionalName', professionalName);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('isBeforeAfter', isBeforeAfter);

    if (isBeforeAfter && beforeFile) {
      formData.append('beforeImage', beforeFile);
    }
    if (afterFile) {
      formData.append('afterImage', afterFile);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/portfolio`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        onUploadSuccess(data.item);
        onClose();
        setTitle('');
        setDescription('');
        setBeforeFile(null);
        setAfterFile(null);
      } else {
        alert(data.error || 'Failed to upload portfolio item.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Network error while uploading.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111622] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-[#0A0D14] p-2 rounded-xl border border-slate-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Professional Showcase
          </span>
          <h2 className="text-lg font-black text-white">Add Project to Portfolio</h2>
          <p className="text-xs text-slate-400 mt-1">Showcase your past work or highlight a "Before & After" transformation to attract clients.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Web Dashboard or Electrical Rewiring"
              className="w-full bg-[#0A0D14] border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0A0D14] border border-slate-700 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="Software & Digital Development">Software & Digital Development</option>
              <option value="Technical & Engineering Services">Technical & Engineering Services</option>
              <option value="Creative & Design">Creative & Design</option>
              <option value="Construction & Maintenance">Construction & Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Description</label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem solved, technologies used, or materials installed..."
              className="w-full bg-[#0A0D14] border border-slate-700 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 bg-[#0A0D14] p-3 rounded-2xl border border-slate-800">
            <input
              type="checkbox"
              id="beforeAfterToggle"
              checked={isBeforeAfter}
              onChange={(e) => setIsBeforeAfter(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="beforeAfterToggle" className="text-xs font-bold text-slate-200 cursor-pointer">
              This is a "Before & After" project transformation
            </label>
          </div>

          {isBeforeAfter && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Before Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBeforeFile(e.target.files[0])}
                className="w-full bg-[#0A0D14] border border-slate-700 rounded-2xl p-2.5 text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isBeforeAfter ? 'After / Final Result Image' : 'Project Image'}
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setAfterFile(e.target.files[0])}
              className="w-full bg-[#0A0D14] border border-slate-700 rounded-2xl p-2.5 text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-black py-3.5 rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading to Portfolio...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Publish Portfolio Item
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}