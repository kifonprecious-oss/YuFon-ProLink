import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function DisputeModal({ contract, onClose, onDisputeSubmitted }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!contract) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const userId = currentUser._id || currentUser.id;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/contracts/${contract._id}/dispute`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          raisedBy: userId
        })
      });

      const data = await res.json();
      if (res.ok) {
        onDisputeSubmitted(data.contract);
        onClose();
      } else {
        alert(data.error || 'Failed to submit dispute.');
      }
    } catch (err) {
      console.error('Dispute error:', err);
      alert('Network error while connecting to server.');
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
          <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold px-3 py-1 rounded-full mb-2">
            <ShieldAlert className="h-3.5 w-3.5" /> Escrow Dispute Mediation
          </span>
          <h2 className="text-lg font-black text-white">Raise a Contract Dispute</h2>
          <p className="text-xs text-slate-400 mt-1">
            This will pause escrow fund release and assign an administrator to review deliverables and mediate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Reason for Dispute</label>
            <textarea
              rows="4"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why work is incomplete, unsatisfactory, or unresponsive..."
              className="w-full bg-[#0A0D14] border border-slate-700 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting Dispute...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" /> Submit Dispute to Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
