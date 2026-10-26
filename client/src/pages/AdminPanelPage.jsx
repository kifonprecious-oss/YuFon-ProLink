import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CheckCircle, AlertTriangle, Users, Search, 
  LayoutDashboard, UserCheck, FolderKanban, MessageSquareWarning, 
  CreditCard, FileBarChart, ShieldAlert, Activity, ArrowRight, XCircle 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';

export default function AdminPanelPage() {
  const { lang } = useLanguage();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'dashboard', 'users', 'verification', 'categories', 'complaints', 'transactions', 'reports', 'security'
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId, approveStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: approveStatus, verified: approveStatus })
      });
      const data = await res.json();
      if (res.ok) {
        fetchUsers();
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const filteredUsers = users.filter(u => {
    if (u.role === 'admin') return false; 
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'pending') return !u.isApproved && matchesSearch;
    if (filter === 'approved') return u.isApproved && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="flex flex-col flex-grow bg-blue-950 text-white justify-between min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Admin Header Banner */}
        <div className="bg-blue-900/60 border border-blue-700/65 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white">Administrator Workflow & Control</h1>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Secure Admin
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'fr' ? 'Gérez les utilisateurs, vérifiez les professionnels et supervisez la plateforme.' : 'Manage users, verify professionals, categories, disputes and platform security.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-blue-950 px-4 py-2 rounded-xl border border-blue-800 text-xs font-semibold text-cyan-300">
              Pending Approvals: <strong className="text-amber-400">{users.filter(u => !u.isApproved && u.role !== 'admin').length}</strong>
            </span>
          </div>
        </div>

        {/* Main Layout: Sidebar Workflow Navigation + Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Workflow Sidebar Navigation */}
          <div className="lg:col-span-1 bg-blue-900/30 border border-blue-700/50 rounded-2xl p-4 h-fit shadow-xl space-y-2">
            <div className="px-3 py-2 text-xs font-black tracking-wider text-amber-400 uppercase border-b border-blue-800/60 mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Admin Panel
            </div>

            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'text-slate-300 hover:bg-blue-900/40'}`}
            >
              <LayoutDashboard className="h-4 w-4" /> 1. Dashboard
            </button>

            <button 
              onClick={() => setActiveTab('users')} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'users' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'text-slate-300 hover:bg-blue-900/40'}`}
            >
              <Users className="h-4 w-4" /> 2. Manage Users
            </button>

            <button 
              onClick={() => setActiveTab('verification')} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'verification' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'text-slate-300 hover:bg-blue-900/40'}`}
            >
              <UserCheck className="h-4 w-4" /> 3. Verify Professionals
            </button>

            <button 
              onClick={() => setActiveTab('categories')} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'categories' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'text-slate-300 hover:bg-blue-900/40'}`}
            >
              <FolderKanban className="h-4 w-4" /> 4. Manage Categories
            </button>

            <button 
              onClick={() => setActiveTab('complaints')} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'complaints' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'text-slate-300 hover:bg-blue-900/40'}`}
            >
              <MessageSquareWarning className="h-4 w-4" /> 5. Handle Complaints
            </button>

            <button 
              onClick={() => setActiveTab('transactions')} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'transactions' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'text-slate-300 hover:bg-blue-900/40'}`}
            >
              <CreditCard className="h-4 w-4" /> 6. Monitor Transactions
            </button>

            <button 
              onClick={() => setActiveTab('reports')} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'reports' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'text-slate-300 hover:bg-blue-900/40'}`}
            >
              <FileBarChart className="h-4 w-4" /> 7. Generate Reports
            </button>

            <button 
              onClick={() => setActiveTab('security')} 
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'security' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'text-slate-300 hover:bg-blue-900/40'}`}
            >
              <ShieldAlert className="h-4 w-4" /> 8. Platform Security
            </button>
          </div>

          {/* Dynamic Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-900/40 border border-blue-700/50 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs text-slate-400 font-semibold">Total Registered Users</p>
                    <h3 className="text-2xl font-black text-white mt-1">{users.length}</h3>
                  </div>
                  <div className="bg-blue-900/40 border border-blue-700/50 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs text-slate-400 font-semibold">Pending Approvals</p>
                    <h3 className="text-2xl font-black text-amber-400 mt-1">{users.filter(u => !u.isApproved && u.role !== 'admin').length}</h3>
                  </div>
                  <div className="bg-blue-900/40 border border-blue-700/50 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs text-slate-400 font-semibold">Active Professionals</p>
                    <h3 className="text-2xl font-black text-emerald-400 mt-1">{users.filter(u => u.role === 'professional' && u.isApproved).length}</h3>
                  </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-6 shadow-xl space-y-3">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> System Workflow Quick Status
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All workflow subsystems are online. Use the sidebar sections to review professional accreditation documents, manage active category listings, handle user dispute tickets, and monitor security flags.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2 & 3: MANAGE USERS / VERIFY PROFESSIONALS */}
            {(activeTab === 'users' || activeTab === 'verification') && (
              <div className="space-y-6">
                
                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-blue-900/30 p-4 rounded-2xl border border-blue-700/50">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => setFilter('pending')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === 'pending' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'bg-blue-950/60 text-slate-300 border border-blue-800'}`}
                    >
                      Pending Review ({users.filter(u => !u.isApproved && u.role !== 'admin').length})
                    </button>
                    <button 
                      onClick={() => setFilter('approved')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === 'approved' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'bg-blue-950/60 text-slate-300 border border-blue-800'}`}
                    >
                      Approved Users
                    </button>
                    <button 
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${filter === 'all' ? 'bg-amber-500 text-blue-950 shadow-lg' : 'bg-blue-950/60 text-slate-300 border border-blue-800'}`}
                    >
                      All Users
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-blue-950/80 border border-blue-700/60 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl shadow-xl overflow-hidden">
                  {loading ? (
                    <div className="p-12 text-center text-slate-400 text-xs">Loading accounts...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <Users className="h-10 w-10 text-slate-500 mx-auto" />
                      <p className="text-slate-300 text-xs font-medium">No accounts found in this filter.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-blue-900/60 border-b border-blue-800 text-[11px] text-slate-400 uppercase tracking-wider">
                            <th className="p-4">User Details</th>
                            <th className="p-4">Role & Category</th>
                            <th className="p-4">Credentials / ID</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-800/60 text-xs">
                          {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-blue-900/20 transition">
                              <td className="p-4">
                                <div className="font-bold text-white text-sm">{user.name}</div>
                                <div className="text-slate-400 text-[11px]">{user.email}</div>
                              </td>
                              <td className="p-4">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase mb-1 ${
                                  user.role === 'professional' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                }`}>
                                  {user.role}
                                </span>
                                <div className="text-slate-300 text-[11px]">{user.category || 'General'}</div>
                              </td>
                              <td className="p-4 text-slate-300">
                                {user.idDocument ? (
                                  <a href={`http://localhost:5000${user.idDocument}`} target="_blank" rel="noreferrer" className="text-amber-400 underline text-[11px] font-semibold">
                                    View Uploaded ID
                                  </a>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">No ID uploaded</span>
                                )}
                              </td>
                              <td className="p-4">
                                {user.isApproved ? (
                                  <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                    <CheckCircle className="h-3 w-3" /> Approved
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2.5 py-1 rounded-full text-[10px] font-bold animate-pulse">
                                    <AlertTriangle className="h-3 w-3" /> Pending Review
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-right space-x-2">
                                {!user.isApproved ? (
                                  <button 
                                    onClick={() => handleUpdateStatus(user._id, true)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-blue-950 font-bold px-3 py-1.5 rounded-xl transition shadow"
                                  >
                                    Approve
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleUpdateStatus(user._id, false)}
                                    className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold px-3 py-1.5 rounded-xl transition"
                                  >
                                    Revoke
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-amber-300">Manage Service Categories</h3>
                <p className="text-xs text-slate-300">Add, edit, or remove professional industry classifications and specialties across the marketplace.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-blue-950/60 p-4 rounded-xl border border-blue-800 flex justify-between items-center">
                    <span className="text-xs font-semibold">Technical & Engineering Services</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="bg-blue-950/60 p-4 rounded-xl border border-blue-800 flex justify-between items-center">
                    <span className="text-xs font-semibold">Digital Graphics & Branding</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: COMPLAINTS */}
            {activeTab === 'complaints' && (
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-amber-300">Handle Complaints & Disputes</h3>
                <p className="text-xs text-slate-300">Review client-professional dispute tickets, manage intervention notes, and issue resolutions.</p>
                <div className="p-8 text-center text-slate-400 text-xs bg-blue-950/40 rounded-xl border border-blue-800/60">
                  No active dispute complaints recorded at this time.
                </div>
              </div>
            )}

            {/* TAB 6: TRANSACTIONS */}
            {activeTab === 'transactions' && (
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-amber-300">Monitor Platform Transactions</h3>
                <p className="text-xs text-slate-300">Inspect escrow payments, commission deductions, and service milestone payouts.</p>
                <div className="p-8 text-center text-slate-400 text-xs bg-blue-950/40 rounded-xl border border-blue-800/60">
                  Transaction ledger is up to date. No flagged payments.
                </div>
              </div>
            )}

            {/* TAB 7: REPORTS */}
            {activeTab === 'reports' && (
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-amber-300">Generate Analytics & Insights Reports</h3>
                <p className="text-xs text-slate-300">Export platform growth metrics, professional engagement summaries, and user activity logs.</p>
                <button className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow">
                  Export PDF Summary Report
                </button>
              </div>
            )}

            {/* TAB 8: SECURITY */}
            {activeTab === 'security' && (
              <div className="bg-blue-900/30 border border-blue-700/50 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-amber-300">Platform Security & Fraud Detection</h3>
                <p className="text-xs text-slate-300">Monitor IP login anomalies, automated rate-limiting blocks, and suspicious account flags.</p>
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-300">
                  System Security Status: Optimal. Zero suspicious login alerts detected.
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}