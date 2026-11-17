import React, { useState } from 'react';
import { X, ShieldCheck, Smartphone, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function EscrowPaymentModal({ contract, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('MTN MoMo');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFundEscrow = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter your mobile money phone number.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/contracts/${contract._id}/fund-escrow`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod, paymentPhone: phone })
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess(data.contract);
      } else {
        setError(data.error || 'Failed to fund escrow.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111622] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Fund Secure Escrow</h3>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          Deposit funds securely for <span className="text-white font-semibold">{contract.projectTitle}</span> via local Mobile Money. Funds remain locked until work is completed and approved.
        </p>

        <div className="bg-[#0A0D14] p-4 rounded-2xl border border-slate-800 mb-6 flex justify-between items-center">
          <span className="text-xs text-slate-400">Total Escrow Amount:</span>
          <span className="text-emerald-400 font-black text-base">{contract.agreedAmount?.toLocaleString()} XAF</span>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleFundEscrow} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-medium">Select Provider</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('MTN MoMo')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === 'MTN MoMo'
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                    : 'bg-[#0A0D14] border-slate-800 text-slate-400'
                }`}
              >
                MTN Mobile Money
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Orange Money')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition ${
                  paymentMethod === 'Orange Money'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-[#0A0D14] border-slate-800 text-slate-400'
                }`}
              >
                Orange Money
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2 font-medium">Mobile Account Phone Number</label>
            <div className="relative">
              <Smartphone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 671236011"
                className="w-full bg-[#0A0D14] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing USSD Push...
              </>
            ) : (
              'Confirm & Authorize Escrow Deposit'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}