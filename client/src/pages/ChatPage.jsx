import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, ShieldCheck, User, ArrowLeft, Phone, Video, AlertCircle, CheckCircle2, Search, Plus, MessageCircle } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const socket = io('http://localhost:5000');

export default function ChatPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proId = searchParams.get('proId');
  const proName = searchParams.get('proName') || (lang === 'fr' ? 'Professionnel Vérifié' : 'Verified Professional');
  const isVerifiedUser = searchParams.get('verified') !== 'false';

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState(proId || null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch initial message history from MongoDB only if a specific chat is selected
  useEffect(() => {
    if (!isVerifiedUser || !activeChat) return;

    fetch(`http://localhost:5000/api/messages?recipient=${activeChat}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data.map(m => ({
            sender: m.sender === 'client' ? 'client' : 'pro',
            text: m.text,
            time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        } else {
          // Keep messages empty if no conversation history exists yet
          setMessages([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch messages:', err);
        setMessages([]);
      });
  }, [activeChat, isVerifiedUser]);

  // Listen for live WebSocket messages between verified users
  useEffect(() => {
    socket.on('receive_message', (newMessage) => {
      setMessages(prev => [...prev, {
        sender: newMessage.sender === 'client' ? 'client' : 'pro',
        text: newMessage.text,
        time: new Date(newMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !isVerifiedUser || !activeChat) return;

    const messageData = {
      sender: 'client',
      recipient: activeChat,
      text: inputText,
      timestamp: new Date()
    };

    socket.emit('send_message', messageData);
    setInputText('');
  };

  if (!isVerifiedUser) {
    return (
      <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
        <div className="max-w-md mx-auto px-4 py-20 text-center my-auto z-20">
          <div className="bg-[#111622] border border-red-500/30 p-8 rounded-3xl shadow-2xl">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-black text-white mb-2">
              {lang === 'fr' ? 'Accès Restreint aux Utilisateurs Vérifiés' : 'Verified User Access Required'}
            </h2>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              {lang === 'fr' 
                ? 'YuFon-ProLink exige que les deux parties soient des utilisateurs vérifiés pour engager une messagerie en direct et des contrats sécurisés.' 
                : 'YuFon-ProLink requires both parties to be authenticated, verified platform users before initiating live direct messaging.'}
            </p>
            <Link 
              to="/find-jobs" 
              className="bg-emerald-500 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs hover:bg-emerald-400 transition inline-block shadow-lg"
            >
              {lang === 'fr' ? 'Retourner aux Missions' : 'Return to Job Board'}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-20 flex flex-col flex-grow">
        
        {/* Main Messenger Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 bg-[#111622]/80 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex-grow backdrop-blur-md min-h-[550px]">
          
          {/* Left Sidebar: Conversations & Search */}
          <div className="border-r border-slate-800 p-4 flex flex-col bg-[#0A0D14]/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-400" /> {lang === 'fr' ? 'Messages' : 'Conversations'}
              </h2>
              <button 
                onClick={() => navigate('/find-jobs')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow"
                title="New Chat"
              >
                <Plus className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Nouveau' : 'New Chat'}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-500" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher une discussion...' : 'Search chats...'}
                className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Chat List / Empty State */}
            <div className="flex-grow overflow-y-auto space-y-2">
              {activeChat ? (
                <div 
                  onClick={() => setActiveChat(proId)}
                  className="bg-[#111622] border border-emerald-500/40 p-3 rounded-2xl cursor-pointer flex items-center gap-3 shadow"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs flex-shrink-0">
                    {proName.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{proName}</h4>
                    <p className="text-[10px] text-emerald-400 truncate">
                      {messages.length > 0 ? messages[messages.length - 1].text : (lang === 'fr' ? 'Discussion active' : 'Active conversation')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500 text-xs px-4">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                  {lang === 'fr' ? 'Aucune discussion active. Cliquez sur "Nouveau" pour trouver un professionnel ou une mission.' : 'No active chats. Click "New Chat" to find a professional or open gig.'}
                </div>
              )}
            </div>
          </div>

          {/* Right Main Panel: Active Chat Thread or Empty State */}
          <div className="md:col-span-2 flex flex-col justify-between p-4 sm:p-6 bg-[#0A0D14]/20">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-[#111622] border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        {proName.charAt(0)}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#111622] rounded-full animate-pulse"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-extrabold text-xs text-white">{proName}</h2>
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> {lang === 'fr' ? 'Vérifié • WebSocket Actif' : 'Verified • Live WebSocket'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="bg-[#0A0D14] hover:bg-slate-800 p-2 rounded-xl text-slate-300 hover:text-white transition border border-slate-800" title="Voice Call">
                      <Phone className="h-3.5 w-3.5 text-emerald-400" />
                    </button>
                    <button className="bg-[#0A0D14] hover:bg-slate-800 p-2 rounded-xl text-slate-300 hover:text-white transition border border-slate-800" title="Video Meeting">
                      <Video className="h-3.5 w-3.5 text-teal-400" />
                    </button>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="bg-[#111622]/40 border border-slate-800 rounded-2xl p-4 flex-grow flex flex-col justify-between mb-4 shadow-inner max-h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                    {messages.length > 0 ? (
                      messages.map((msg, index) => {
                        const isClient = msg.sender === 'client';
                        return (
                          <div key={index} className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] sm:max-w-md rounded-2xl px-4 py-2.5 shadow-xl ${
                              isClient 
                                ? 'bg-emerald-500 text-slate-950 rounded-br-none font-semibold text-xs' 
                                : 'bg-[#111622] text-white border border-slate-700/60 rounded-bl-none text-xs'
                            }`}>
                              <p className="leading-relaxed">{msg.text}</p>
                              <span className={`block text-[9px] mt-1 text-right font-medium ${isClient ? 'text-slate-900/80' : 'text-slate-400'}`}>
                                {msg.time}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-16 text-slate-500 text-xs">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                        {lang === 'fr' ? 'Aucun message dans cette discussion pour le moment. Envoyez votre premier message ci-dessous.' : 'No messages in this chat yet. Send your first message below.'}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="bg-[#111622] border border-slate-800 p-2 rounded-2xl flex items-center gap-2 shadow-xl">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={lang === 'fr' ? 'Écrivez votre message sécurisé...' : 'Type your secure message...'}
                    className="flex-grow bg-[#0A0D14] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button 
                    type="submit" 
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-2.5 rounded-xl font-bold transition shadow flex items-center justify-center"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              /* Completely Empty State when no conversation is selected */
              <div className="flex flex-col items-center justify-center h-full py-28 text-center text-slate-400 space-y-4">
                <div className="p-4 bg-[#111622] border border-slate-800 rounded-3xl shadow-xl">
                  <MessageSquare className="h-10 w-10 text-emerald-400 mx-auto" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'fr' ? 'Aucune conversation sélectionnée' : 'No conversation selected'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  {lang === 'fr' 
                    ? 'Votre panneau de messages est vide. Cliquez ci-dessous pour trouver une mission ou un professionnel à contacter.' 
                    : 'Your message panel is empty. Explore open jobs or verified professionals to start a new chat.'}
                </p>
                <button
                  onClick={() => navigate('/find-jobs')}
                  className="bg-emerald-500 text-slate-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs hover:bg-emerald-400 transition shadow-lg inline-flex items-center gap-2"
                >
                  <Plus className="h-3.5 w-3.5" /> {lang === 'fr' ? 'Trouver des Missions / Pros' : 'Explore Job Board'}
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}