import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, Plus, Layers } from 'lucide-react';
import { API_BASE_URL } from '../config';
import PortfolioUploadModal from './PortfolioUploadModal';

export default function PortfolioGallery({ professionalId }) {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const isOwner = currentUser._id === professionalId || currentUser.id === professionalId;

  const fetchPortfolio = () => {
    if (!professionalId) return;
    fetch(`${API_BASE_URL}/api/portfolio/${professionalId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(err => console.error('Failed to load portfolio:', err));
  };

  useEffect(() => {
    fetchPortfolio();
  }, [professionalId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" /> Professional Portfolio & Work Showcase
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Explore past projects and verified before/after transformations.</p>
        </div>

        {isOwner && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
          >
            <Plus className="h-3.5 w-3.5" /> Add Project
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div key={item._id} className="bg-[#111622] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-start">
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full">
                  {item.category}
                </span>
                {item.isBeforeAfter && (
                  <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-3 py-1 rounded-full">
                    Before & After
                  </span>
                )}
              </div>

              <h4 className="text-white font-bold text-sm">{item.title}</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{item.description}</p>

              {item.isBeforeAfter && item.beforeImage ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="relative">
                    <span className="absolute top-2 left-2 bg-black/70 text-slate-200 text-[9px] font-bold px-2 py-0.5 rounded-lg z-10">Before</span>
                    <img 
                      src={`${API_BASE_URL}${item.beforeImage}`} 
                      alt="Before" 
                      className="w-full h-40 object-cover rounded-2xl border border-slate-800"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg z-10">After</span>
                    <img 
                      src={`${API_BASE_URL}${item.afterImage}`} 
                      alt="After" 
                      className="w-full h-40 object-cover rounded-2xl border border-slate-800"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <img 
                    src={`${API_BASE_URL}${item.afterImage}`} 
                    alt={item.title} 
                    className="w-full h-48 object-cover rounded-2xl border border-slate-800"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#111622]/50 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 text-xs">
          <ImageIcon className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          No portfolio projects added yet.
        </div>
      )}

      <PortfolioUploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUploadSuccess={fetchPortfolio}
      />
    </div>
  );
}