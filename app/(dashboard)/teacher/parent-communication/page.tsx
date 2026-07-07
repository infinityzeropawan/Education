'use client';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { parentMessages as initialParentMessages, messageTemplates, studentsList, ParentMessage } from '@/lib/mock-data';
import { MessageSquare, Users, Send, Search, Check, AlertTriangle, Filter, Plus, Calendar } from 'lucide-react';

export default function ParentCommunicationPage() {
  const [messages, setMessages] = useState<ParentMessage[]>(initialParentMessages);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Dialog controls
  const [isComposeOpen, setIsComposeOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  
  // Compose form state
  const [isBroadcast, setIsBroadcast] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(studentsList[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('custom');
  const [category, setCategory] = useState<ParentMessage['category']>('general');
  const [priority, setPriority] = useState<ParentMessage['priority']>('normal');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  
  // Detailed review state
  const [selectedMessage, setSelectedMessage] = useState<ParentMessage | null>(null);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  // Categories list for filtering
  const categories = ['attendance', 'behavior', 'academic', 'fee', 'general'];

  // Filtered sent messages
  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages, selectedCategory, searchQuery]);

  // Find currently selected student details
  const currentStudent = useMemo(() => {
    return studentsList.find(s => s.id === selectedStudentId);
  }, [selectedStudentId]);

  // Apply message template
  useEffect(() => {
    if (selectedTemplateId === 'custom') {
      setSubject('');
      setBody('');
      return;
    }

    const tpl = messageTemplates.find(t => t.id === selectedTemplateId);
    if (!tpl) return;

    setCategory(tpl.category);
    
    // Default values if student is not found
    const sName = currentStudent?.name || 'Student';
    const pName = currentStudent ? `${currentStudent.fatherName || 'Parent'}` : 'Parent';
    const classVal = currentStudent?.class || 'IOT-2026';
    const attPercent = currentStudent?.attendance || 85;

    let subText = tpl.subjectTemplate
      .replace('{studentName}', sName)
      .replace('{feeType}', 'Q1 Tuition Fee');

    let bodyText = tpl.bodyTemplate
      .replace('{parentName}', pName)
      .replace('{studentName}', sName)
      .replace('{attendance}', attPercent.toString())
      .replace('{subjectName}', 'IOT & Embedded Systems')
      .replace('{percentage}', '38')
      .replace('{feeType}', 'Q1 Tuition Fee')
      .replace('{amount}', '14,000')
      .replace('{dueDate}', 'July 31, 2026')
      .replace('{details}', 'is doing excellent work')
      .replace('{teacherName}', 'Pawan Kumar Dubey')
      .replace('{title}', 'Notice')
      .replace('{content}', '')
      .replace('{className}', classVal);

    setSubject(subText);
    setBody(bodyText);
  }, [selectedTemplateId, selectedStudentId, currentStudent]);

  // Handle send message
  const handleSendMessage = () => {
    if (!subject || !body) return;

    let targetParent = 'All Parents — IOT-2026';
    let targetStudentName = '';
    let targetStudentId = '';

    if (!isBroadcast && currentStudent) {
      targetParent = currentStudent.fatherName || 'Parent';
      targetStudentName = currentStudent.name;
      targetStudentId = currentStudent.id;
    }

    const newMessage: ParentMessage = {
      id: `pm-${Date.now()}`,
      teacherName: 'Pawan Kumar Dubey',
      studentId: targetStudentId,
      studentName: targetStudentName,
      parentName: targetParent,
      subject,
      body,
      category,
      priority,
      isBroadcast,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [newMessage, ...prev]);
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setIsComposeOpen(false);
      // Reset form
      setSelectedTemplateId('custom');
      setSubject('');
      setBody('');
    }, 1500);
  };

  const handleOpenDetails = (msg: ParentMessage) => {
    setSelectedMessage(msg);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Communication</h1>
          <p className="text-gray-500 text-sm mt-0.5">Send private notifications, academic alerts, and behavioral notes directly to parents.</p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Compose Message
        </Button>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-600 flex items-center gap-1"><Filter className="h-4 w-4" /> Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Message History Feed */}
      <div className="space-y-4">
        {filteredMessages.map(m => {
          const catColors = 
            m.category === 'attendance' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            m.category === 'behavior' ? 'bg-purple-50 text-purple-700 border-purple-200' :
            m.category === 'academic' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            m.category === 'fee' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-gray-50 text-gray-700 border-gray-200';

          const priorityColors =
            m.priority === 'urgent' ? 'bg-red-600 text-white' :
            m.priority === 'important' ? 'bg-amber-500 text-white' :
            'bg-gray-200 text-gray-800';

          return (
            <Card key={m.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleOpenDetails(m)}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${catColors}`}>
                      {m.category.charAt(0).toUpperCase() + m.category.slice(1)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${priorityColors}`}>
                      {m.priority}
                    </span>
                    {m.isBroadcast && (
                      <Badge variant="default" className="bg-teal-600 flex items-center gap-1 text-[10px] py-0 px-2">
                        <Users className="h-3 w-3" /> Class Broadcast
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(m.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">{m.subject}</h3>
                  <p className="text-sm font-semibold text-gray-600 mt-0.5">
                    {m.isBroadcast ? 'To: All Parents' : `To: ${m.parentName} (${m.studentName}'s parent)`}
                  </p>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed bg-gray-50/50 p-2.5 rounded border border-gray-100/50 font-mono text-[13px]">
                  {m.body}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-400 pt-1">
                  <span>Sent by {m.teacherName}</span>
                  <span className="text-teal-600 font-semibold hover:underline">View details →</span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No parent communications found.
          </div>
        )}
      </div>

      {/* Compose Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Send Message to Parents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            
            {/* Delivery mode */}
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <label className="text-xs text-gray-500 font-medium block">Send To:</label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="mode-single"
                  name="delivery-mode"
                  checked={!isBroadcast}
                  onChange={() => setIsBroadcast(false)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="mode-single" className="text-sm font-medium text-gray-700 cursor-pointer">Single Parent</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="mode-broadcast"
                  name="delivery-mode"
                  checked={isBroadcast}
                  onChange={() => setIsBroadcast(true)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="mode-broadcast" className="text-sm font-medium text-gray-700 cursor-pointer">Broadcast (All Class Parents)</label>
              </div>
            </div>

            {/* Student selection (if single) */}
            {!isBroadcast && (
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(ev) => setSelectedStudentId(ev.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {studentsList.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Roll: {s.rollNo})</option>
                  ))}
                </select>
                {currentStudent && (
                  <p className="text-xs text-gray-400 mt-1">
                    Primary Parent: {currentStudent.fatherName || 'Not specified'} · Attendance: {currentStudent.attendance}%
                  </p>
                )}
              </div>
            )}

            {/* Template selector */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Message Template</label>
              <select
                value={selectedTemplateId}
                onChange={(ev) => setSelectedTemplateId(ev.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="custom">-- Custom Message (No Template) --</option>
                {messageTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(ev) => setCategory(ev.target.value as ParentMessage['category'])}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Priority</label>
                <select
                  value={priority}
                  onChange={(ev) => setPriority(ev.target.value as ParentMessage['priority'])}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Subject Line</label>
              <Input
                placeholder="Enter email/message subject..."
                value={subject}
                onChange={(ev) => setSubject(ev.target.value)}
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Message Body</label>
              <Textarea
                placeholder="Write your message details here..."
                value={body}
                onChange={(ev) => setBody(ev.target.value)}
                rows={5}
                className="font-mono text-sm leading-relaxed"
              />
            </div>
          </div>
          <DialogFooter>
            {sendSuccess ? (
              <Button disabled className="bg-green-600 text-white flex items-center gap-2">
                <Check className="h-4 w-4" /> Message Sent!
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>Cancel</Button>
                <Button onClick={handleSendMessage} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sent Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 py-3">
              <div className="border-b pb-3 flex items-center justify-between flex-wrap gap-2 text-xs text-gray-400">
                <span>Category: <strong className="text-gray-700 uppercase">{selectedMessage.category}</strong></span>
                <span>Sent on: <strong className="text-gray-700">{new Date(selectedMessage.createdAt).toLocaleString()}</strong></span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-gray-900">{selectedMessage.subject}</h2>
                <div className="flex flex-col text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 gap-1">
                  <span><strong>Sender:</strong> {selectedMessage.teacherName} (Teacher)</span>
                  <span>
                    <strong>Recipient:</strong> {selectedMessage.isBroadcast ? 'All Parents of Batch IOT-2026' : `${selectedMessage.parentName} (${selectedMessage.studentName}'s parent)`}
                  </span>
                  <span><strong>Priority:</strong> <span className="uppercase text-xs font-extrabold text-red-600">{selectedMessage.priority}</span></span>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-4 text-[13px] font-mono leading-relaxed text-gray-800 whitespace-pre-wrap min-h-[150px] shadow-inner bg-slate-50/20">
                {selectedMessage.body}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)} className="bg-teal-600 hover:bg-teal-700 text-white">Close View</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
