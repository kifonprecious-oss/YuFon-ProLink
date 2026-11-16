import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Loader2, User } from 'lucide-react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../config';

const socket = io(API_BASE_URL);

export default function ContractChat({ contract }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const currentUserId = currentUser._id || currentUser.id;
  const currentUserName = currentUser.name || 'User';

  useEffect(() => {
    if (!contract?._id) return;

    // Join contract room via WebSocket
    socket.emit('join_contract_room', contract._id);

    // Fetch previous message history
    fetch(`${API_BASE_URL}/api/messages/${contract._id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching chat history:', err);
        setLoading(false);
      });

    // Listen for incoming live messages
    socket.on('receive_contract_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('receive_contract_message');
    };
  }, [contract]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageData = {
      contractId: contract._id,
      senderId: currentUserId,
      senderName: currentUserName,
      text: inputText.trim()
    };

    socket.emit('send_contract_message', messageData);
    setInputText('');
  };

  if (!contract) return null;

  return (
    <div className="bg-[#111622] border border-slate-800 rounded-3xl flex flex-col h-[550px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#0A0D14] border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30 text-emerald-400">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm">Contract Workspace Chat</h3>
            <p className="text-[11px] text-slate-400">{contract.projectTitle}</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
          Live Socket.io Active
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#111622]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-emerald-400" /> Loading secure chat history...
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-400 mb-1 px-1">
                  {isMe ? 'You' : msg.senderName}
                </span>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${
                  isMe 
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none' 
                    : 'bg-[#0A0D14] border border-slate-800 text-white rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs text-center px-4">
            <MessageSquare className="h-8 w-8 text-slate-700 mb-2" />
            No messages yet. Start the conversation with your counterpart regarding project milestones!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="bg-[#0A0D14] border-t border-slate-800 p-3 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message regarding deliverables or updates..."
          className="flex-1 bg-[#111622] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3 rounded-xl transition shadow flex items-center justify-center"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
