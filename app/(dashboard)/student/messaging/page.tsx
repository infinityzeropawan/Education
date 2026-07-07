'use client';
import { useState } from 'react';
import { contacts, chatMessages } from '@/lib/mock-data';
import { MessageCircle, Send, Search } from 'lucide-react';

export default function StudentMessagingPage() {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, sender: 'Me', senderId: 'me', text: message, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), isOwn: true }]);
    setMessage('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><MessageCircle className="h-6 w-6 text-teal-600" />Messaging</h1>
        <p className="text-gray-500 text-sm mt-0.5">Chat with teachers and classmates</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '70vh' }}>
        <div className="flex h-full">
          {/* Contacts */}
          <div className="w-72 border-r border-gray-100 flex flex-col">
            <div className="p-3 border-b border-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input placeholder="Search..." className="w-full h-9 pl-9 pr-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {contacts.map(c => (
                <button key={c.id} onClick={() => setActiveContact(c)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${activeContact.id === c.id ? 'bg-teal-50 border-r-2 border-teal-500' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    {c.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                      <span className="text-[10px] text-gray-400">{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                      {c.unread > 0 && <span className="w-4 h-4 bg-teal-500 rounded-full text-white text-[10px] flex items-center justify-center flex-shrink-0">{c.unread}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                {activeContact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{activeContact.name}</p>
                <p className="text-xs text-gray-400">{activeContact.role} · {activeContact.online ? '🟢 Online' : '⚫ Offline'}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm shadow-sm ${m.isOwn ? 'bg-teal-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                    {!m.isOwn && <p className="text-[10px] font-semibold text-teal-600 mb-1">{m.sender}</p>}
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.isOwn ? 'text-teal-200' : 'text-gray-400'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={send} className="flex items-center gap-3 p-4 border-t border-gray-100">
              <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..."
                className="flex-1 h-10 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
              <button type="submit" className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white hover:bg-teal-700 transition-colors shadow-md">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
