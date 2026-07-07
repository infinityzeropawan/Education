'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { chatMessages, contacts } from '@/lib/mock-data';
import type { ChatMessage } from '@/lib/mock-data';
import { MessageCircle, Send, Search, Circle } from 'lucide-react';

export default function MessagingPage() {
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      sender: 'Pawan Kumar Dubey',
      senderId: 'usr-001',
      text: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    }]);
    setInput('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-teal-600" />Messaging
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">1-to-1 direct messaging</p>
      </div>

      <div className="flex gap-0 h-[calc(100vh-220px)] min-h-[500px] rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
        {/* Contact List */}
        <div className="w-72 flex-shrink-0 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <Input
                placeholder="Search active chats..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveContact(c)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${activeContact.id === c.id ? 'bg-teal-50 border-l-2 border-l-teal-500' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  {c.online && <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-400 text-green-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{c.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                    {c.unread > 0 && (
                      <span className="ml-1 flex-shrink-0 w-4 h-4 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center">{c.unread}</span>
                    )}
                  </div>
                  <Badge variant="outline" className="mt-0.5 text-[10px] py-0">{c.role}</Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
              {activeContact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{activeContact.name}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                {activeContact.online ? <><Circle className="h-2 w-2 fill-green-400 text-green-400" />Online</> : 'Offline'}
                · {activeContact.role}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                  msg.isOwn
                    ? 'bg-teal-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                }`}>
                  {!msg.isOwn && <p className="text-[10px] font-semibold text-teal-600 mb-1">{msg.sender}</p>}
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.isOwn ? 'text-teal-200' : 'text-gray-400'} text-right`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                className="flex-1"
              />
              <Button onClick={send} size="icon" className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
