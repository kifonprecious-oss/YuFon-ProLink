import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Page Imports
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ServicesPage from './pages/ServicesPage';         
import FindJobsPage from './pages/FindJobsPage';        
import MyJobsPage from './pages/MyJobsPage';            
import DashboardPage from './pages/DashboardPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ProfilePage from './pages/ProfilePage';          
import PostRequestPage from './pages/PostRequestPage';   
import ChatPage from './pages/ChatPage';                
import ContractPage from './pages/ContractPage';        
import ProfileDetailPage from './pages/ProfileDetailPage';
import AdminPanelPage from './pages/AdminPanelPage';
import NotificationsPage from './pages/NotificationsPage'; // <-- Added NotificationsPage import

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#0A0D14] font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden text-slate-100">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <Routes>
              {/* Public Routes (Accessible without login) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes (Locked: requires valid login session) */}
              <Route element={<ProtectedRoute />}>
                {/* Core & Dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile-setup" element={<ProfileSetupPage />} />
                <Route path="/profile" element={<ProfilePage />} />             
                <Route path="/profile/:id" element={<ProfileDetailPage />} />      
                <Route path="/notifications" element={<NotificationsPage />} /> {/* <-- Updated to NotificationsPage */}

                {/* Client & Pro Routes */}
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/find-jobs" element={<FindJobsPage />} />          
                <Route path="/post-request" element={<PostRequestPage />} />  
                <Route path="/my-jobs" element={<MyJobsPage />} />
                <Route path="/proposals" element={<MyJobsPage />} />          
                <Route path="/payments" element={<MyJobsPage />} />          
                <Route path="/earnings" element={<MyJobsPage />} />          
                <Route path="/reviews" element={<DashboardPage />} />        

                {/* Shared / Common Routes */}
                <Route path="/projects" element={<ContractPage />} />
                <Route path="/messages" element={<ChatPage />} />
                
                {/* Admin Panel */}
                <Route path="/admin" element={<AdminPanelPage />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}