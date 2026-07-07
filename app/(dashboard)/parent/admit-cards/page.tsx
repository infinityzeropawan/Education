'use client';

import { useState } from 'react';
import { admitCards, studentsList } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Download, Ticket, User, Calendar, Clock, MapPin, ListChecks, CheckCircle } from 'lucide-react';

export default function ParentAdmitCardsPage() {
  const student = studentsList[0];
  const [cards, setCards] = useState(admitCards.filter(c => c.studentName === student.name));

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Ticket className="h-6 w-6 text-indigo-600" />
          Admit Cards
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Hall Tickets for upcoming examinations for {student.name}
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-sm font-semibold text-gray-800">No Admit Cards Issued</p>
          <p className="text-xs text-gray-500 mt-1">Admit cards for upcoming exams will appear here once issued.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {cards.map((card, i) => (
            <div key={card.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/70 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{card.subject}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{card.examType}</p>
                </div>
                <Badge variant="success">Issued</Badge>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  {[
                    { icon: User,     label: 'Student Name', value: card.studentName },
                    { icon: User,     label: 'Roll Number',  value: card.rollNo },
                    { icon: Calendar, label: 'Exam Date',    value: card.examDate },
                    { icon: Clock,    label: 'Exam Time',    value: card.examTime },
                    { icon: MapPin,   label: 'Venue',        value: card.room },
                    { icon: Calendar, label: 'Issued On',    value: card.issuedOn },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-2">
                      <item.icon className="h-4 w-4 text-gray-400 mt-px flex-shrink-0" />
                      <div>
                        <p className="text-gray-500">{item.label}</p>
                        <p className="font-semibold text-gray-800 mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-start gap-2">
                    <ListChecks className="h-4 w-4 text-gray-400 mt-px flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Instructions</p>
                      <ul className="mt-2 space-y-1.5 text-xs text-gray-700 list-disc list-inside">
                        {card.instructions.map((inst, idx) => (
                          <li key={idx}>{inst}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => window.print()} 
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  View & Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
