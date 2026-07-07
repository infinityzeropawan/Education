'use client';
import { useState } from 'react';
import { appNotifications, type AppNotification } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, FileText, Award, CheckSquare, CreditCard, Trophy, Briefcase, Video, Megaphone, CheckCheck, Dot } from 'lucide-react';

const typeConfig: Record<AppNotification['type'], { icon: React.ElementType; color: string; bg: string; label: string }> = {
  assignment: { icon: FileText,    color: 'text-orange-600', bg: 'bg-orange-100', label: 'Assignment' },
  exam:       { icon: Award,       color: 'text-purple-600', bg: 'bg-purple-100', label: 'Exam' },
  attendance: { icon: CheckSquare, color: 'text-red-600',    bg: 'bg-red-100',    label: 'Attendance' },
  notice:     { icon: Megaphone,   color: 'text-amber-600',  bg: 'bg-amber-100',  label: 'Notice' },
  fee:        { icon: CreditCard,  color: 'text-blue-600',   bg: 'bg-blue-100',   label: 'Fee' },
  result:     { icon: Trophy,      color: 'text-green-600',  bg: 'bg-green-100',  label: 'Result' },
  leave:      { icon: Briefcase,   color: 'text-teal-600',   bg: 'bg-teal-100',   label: 'Leave' },
  class:      { icon: Video,       color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Class' },
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function StudentNotificationsPage() {
  const [notifs, setNotifs] = useState<AppNotification[]>(appNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifs.filter(n => !n.isRead).length;
  const displayed = filter === 'unread' ? notifs.filter(n => !n.isRead) : notifs;

  const markRead = (id: string) => setNotifs(p => p.map(n => n.id === id ? { ...n, isRead: true } : n));
  const markAllRead = () => setNotifs(p => p.map(n => ({ ...n, isRead: true })));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-teal-600" />Notifications
            {unreadCount > 0 && (
              <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Stay updated with all your activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="flex items-center gap-2">
            <CheckCheck className="h-4 w-4" />Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 animate-fade-in delay-100">
        {(['all', 'unread'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-300'}`}>
            {f === 'all' ? `All (${notifs.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {displayed.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center animate-scale-in">
            <Bell className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No unread notifications</p>
          </div>
        ) : displayed.map((n, i) => {
          const cfg = typeConfig[n.type];
          const Icon = cfg.icon;
          return (
            <div key={n.id}
              onClick={() => markRead(n.id)}
              className={`group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 animate-fade-in-up card-hover ${n.isRead ? 'bg-white border-gray-100' : 'bg-blue-50/60 border-blue-100 shadow-sm'}`}
              style={{ animationDelay: `${i * 50}ms` }}>
              {/* Icon */}
              <div className={`relative flex-shrink-0 w-11 h-11 rounded-2xl ${cfg.bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${cfg.color}`} />
                {!n.isRead && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">{timeAgo(n.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] py-0">{cfg.label}</Badge>
                  {!n.isRead && <span className="text-[10px] text-blue-600 font-medium">• New</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
