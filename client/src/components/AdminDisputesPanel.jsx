import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle, User, DollarSign, Loader2, FileText } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AdminDisputesPanel() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchContracts = () => {
    fetch(`${API_BASE_URL}/api/contracts`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setContracts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching contracts for dispute management:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleResolveDispute = async (contractId, resolution) => {
    if (!adminNotes.trim()) {
      alert('Please provide resolution notes for audit records.');
      return;
    }

    setResolvingId(contractId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/contracts/${contractId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution, adminNotes })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Dispute resolved successfully: ${resolution}`);
        setAdminNotes('');
        setResolvingId(null);
        fetchContracts();
      } else {
        alert(data.error || 'Failed to resolve dispute.');
        setResolvingId(null);
      }
    } catch (err) {
      console.error('Dispute resolution error:', err);
      alert('Network error while resolving dispute.');
      setResolvingId(null);
    }
  };

  const disputedContracts = contracts.filter(c => c.escrowStatus === 'Disputed' || c.escrowStatus === 'Funded in Escrow' || c.escrowStatus === 'Unfunded');

  return (
    <div className="bg-[#111622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold px-3 py-1 rounded-full mb-2">
            <ShieldAlert className="h-3.5 w-3.5" /> Admin Mediation Center
          </span>
          <h2 className="text-xl font-black text-white">Contract Disputes & Escrow Control</h2>
          <p className="text-xs text-slate-400 mt-1">Review flagged projects, evaluate justifications, and execute binding escrow payouts or refunds.</p>
        </div>
        <span className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold">
          {disputedContracts.length} Active Records
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-400" /> Loading contract records...
        </div>
      ) : disputedContracts.length > 0 ? (
        <div className="space-y-4">
          {disputedContracts.map((contract) => (
            <div key={contract._id} className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-emerald-400 font-bold text-xs">Ref: {contract._id}</span>
                  <h3 className="text-white font-bold text-base mt-0.5">{contract.projectTitle}</h3>
                </div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                  contract.escrowStatus === 'Disputed' 
                    ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}>
                  Status: {contract.escrowStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#111622] p-3.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block mb-0.5">Client</span>
                  <span className="text-white font-bold">{contract.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Professional</span>
                  <span className="text-teal-400 font-bold">{contract.professionalName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Escrow Amount</span>
                  <span className="text-emerald-400 font-black">{contract.agreedAmount?.toLocaleString()} XAF</span>
                </div>
              </div>

              {contract.disputeReason && (
                <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-3.5 text-xs text-red-200">
                  <strong className="text-red-400 block mb-1">Dispute Justification:</strong>
                  {contract.disputeReason}
                </div>
              )}

              {contract.escrowStatus === 'Disputed' && (
                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    placeholder="Enter admin resolution notes / audit trail justification..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full bg-[#111622] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      disabled={resolvingId === contract._id}
                      onClick={() => handleResolveDispute(contract._id, 'Released to Pro')}
                      className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Release Funds to Professional
                    </button>

                    <button
                      disabled={resolvingId === contract._id}
                      onClick={() => handleResolveDispute(contract._id, 'Refunded')}
                      className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="h-4 w-4" /> Refund Funds to Client
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-xs">
          <FileText className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          No contracts currently flagged for dispute mediation.
        </div>
      )}
    </div>
  );
}