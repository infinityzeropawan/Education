'use client';
import { useState } from 'react';
import { feedbackItems, teachers, onlineClasses, type FeedbackItem } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare, CheckCircle, GraduationCap, Video, Plus } from 'lucide-react';

function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" disabled={readonly}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}>
          <Star className={`h-5 w-5 ${(hover || value) >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

const ratingLabel = (r: number) => ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][r] || '';

export default function StudentFeedbackPage() {
  const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>(feedbackItems);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ targetType: 'teacher', targetId: teachers[0].id, rating: 0, comment: '', isAnonymous: false });
  const [done, setDone] = useState(false);

  const targetOptions = form.targetType === 'teacher'
    ? teachers.map(t => ({ id: t.id, name: t.name, sub: t.subject }))
    : onlineClasses.filter(c => c.status === 'completed').map(c => ({ id: c.id, name: c.subject, sub: c.teacherName }));

  const submit = () => {
    if (!form.rating || !form.comment.trim()) return;
    const target = targetOptions.find(t => t.id === form.targetId);
    const fb: FeedbackItem = {
      id: `fb-${Date.now()}`, targetType: form.targetType as FeedbackItem['targetType'],
      targetId: form.targetId, targetName: target?.name || '',
      subjectName: form.targetType === 'teacher' ? target?.sub : undefined,
      rating: form.rating, comment: form.comment,
      submittedAt: new Date().toISOString().split('T')[0],
      isAnonymous: form.isAnonymous,
    };
    setAllFeedback(p => [fb, ...p]);
    setDone(true);
    setTimeout(() => { setOpen(false); setDone(false); setForm({ targetType: 'teacher', targetId: teachers[0].id, rating: 0, comment: '', isAnonymous: false }); }, 1600);
  };

  const avgRating = allFeedback.length ? (allFeedback.reduce((a, f) => a + f.rating, 0) / allFeedback.length).toFixed(1) : '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="h-6 w-6 text-teal-600" />Feedback
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Rate your teachers and classes to help improve quality</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2 shadow-lg">
          <Plus className="h-4 w-4" />Give Feedback
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Feedback Given', value: allFeedback.length,  color: 'text-teal-600',  bg: 'bg-teal-50',  border: 'border-teal-200' },
          { label: 'Avg Rating',     value: avgRating,            color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
          { label: 'Anonymous',      value: allFeedback.filter(f => f.isAnonymous).length, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feedback list */}
      <div className="space-y-4">
        {allFeedback.map((f, i) => (
          <div key={f.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${f.targetType === 'teacher' ? 'bg-teal-100' : 'bg-purple-100'}`}>
                {f.targetType === 'teacher' ? <GraduationCap className="h-6 w-6 text-teal-600" /> : <Video className="h-6 w-6 text-purple-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{f.targetName}</p>
                    {f.subjectName && <p className="text-xs text-gray-400">{f.subjectName}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {f.isAnonymous && <Badge variant="outline" className="text-[10px] py-0">Anonymous</Badge>}
                    <Badge variant={f.targetType === 'teacher' ? 'default' : 'info'} className="text-[10px] py-0">
                      {f.targetType === 'teacher' ? 'Teacher' : 'Class'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating value={f.rating} readonly />
                  <span className="text-xs font-semibold text-amber-600">{ratingLabel(f.rating)}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{f.comment}</p>
                <p className="text-[10px] text-gray-400 mt-2">{f.submittedAt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />Give Feedback
            </DialogTitle>
          </DialogHeader>
          {done ? (
            <DialogBody className="text-center py-10">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                <CheckCircle className="h-8 w-8 text-amber-500" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">Thank you!</p>
              <p className="text-sm text-gray-500 mt-1">Your feedback helps improve teaching quality.</p>
            </DialogBody>
          ) : (
            <>
              <DialogBody className="space-y-4">
                {/* Target type */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Feedback For</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ v: 'teacher', label: 'Teacher', icon: GraduationCap }, { v: 'class', label: 'Online Class', icon: Video }].map(opt => (
                      <button key={opt.v} onClick={() => setForm(p => ({ ...p, targetType: opt.v, targetId: opt.v === 'teacher' ? teachers[0].id : onlineClasses.filter(c => c.status === 'completed')[0]?.id || '' }))}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${form.targetType === opt.v ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        <opt.icon className="h-4 w-4" />{opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Target select */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Select {form.targetType === 'teacher' ? 'Teacher' : 'Class'}</label>
                  <select value={form.targetId} onChange={e => setForm(p => ({ ...p, targetId: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                    {targetOptions.map(t => <option key={t.id} value={t.id}>{t.name} — {t.sub}</option>)}
                  </select>
                </div>
                {/* Rating */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Rating</label>
                  <div className="flex items-center gap-3">
                    <StarRating value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
                    {form.rating > 0 && <span className="text-sm font-semibold text-amber-600">{ratingLabel(form.rating)}</span>}
                  </div>
                </div>
                {/* Comment */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Comments</label>
                  <Textarea placeholder="Share your experience, suggestions or appreciation..." value={form.comment}
                    onChange={e => setForm(p => ({ ...p, comment: e.target.value }))} rows={3} />
                </div>
                {/* Anonymous toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm(p => ({ ...p, isAnonymous: !p.isAnonymous }))}
                    className={`w-10 h-5 rounded-full transition-colors ${form.isAnonymous ? 'bg-teal-500' : 'bg-gray-200'} relative`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isAnonymous ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-gray-700">Submit anonymously</span>
                </label>
              </DialogBody>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={submit} disabled={!form.rating || !form.comment.trim()}>Submit Feedback</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
