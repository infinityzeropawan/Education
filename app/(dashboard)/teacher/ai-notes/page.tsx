'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Layers, Sparkles, BookOpen } from 'lucide-react';

const MOCK_NOTES: Record<string, string> = {
  IOT101: `# IoT & Embedded Systems — Notes

## 1. Introduction to IoT
The **Internet of Things (IoT)** refers to the network of physical devices embedded with sensors, software, and connectivity to exchange data.

### Key Components
- **Sensors** — Collect data from the environment (temperature, humidity, motion)
- **Actuators** — Perform actions based on commands (motors, LEDs, relays)
- **Microcontrollers** — Process data (Arduino, ESP32, Raspberry Pi)
- **Connectivity** — Wi-Fi, Bluetooth, Zigbee, LoRa

## 2. Embedded C Basics
\`\`\`c
#include <avr/io.h>
#include <util/delay.h>

int main(void) {
  DDRB |= (1 << PB5);  // Set pin as output
  while(1) {
    PORTB ^= (1 << PB5); // Toggle LED
    _delay_ms(500);
  }
  return 0;
}
\`\`\`

## 3. MQTT Protocol
- **Publish/Subscribe** model
- Lightweight for constrained devices
- Uses **broker** (e.g., Mosquitto) to route messages
- Topics: \`home/temperature\`, \`factory/sensor1\`

## 4. Common Protocols
| Protocol | Range | Power | Use Case |
|----------|-------|-------|----------|
| Wi-Fi | 50m | High | Home automation |
| Bluetooth | 10m | Low | Wearables |
| Zigbee | 100m | Very Low | Smart home |
| LoRa | 15km | Very Low | Agriculture |

## 5. Project Ideas
- Smart home automation system
- Industrial temperature monitoring
- GPS vehicle tracking
- Smart irrigation system`,
};

export default function AiNotesPage() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const generate = async () => {
    if (!subject || !topic) return;
    setLoading(true);
    setNotes('');
    await new Promise(r => setTimeout(r, 1800));
    setNotes(MOCK_NOTES[subject] || `# ${topic}\n\n## Overview\nDetailed notes for **${topic}** in ${subject}.\n\n## Key Points\n- Point 1: Important concept\n- Point 2: Another concept\n- Point 3: Practical application\n\n## Summary\nThis topic covers the fundamentals of ${topic}.`);
    setLoading(false);
  };

  const renderMarkdown = (md: string) => {
    return md
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-3 pb-2 border-b border-gray-200">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-teal-700 mt-5 mb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-gray-800 mt-4 mb-1">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-teal-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto my-3"><code>$1</code></pre>')
      .replace(/^\| (.+) \|$/gm, (_, row) => `<tr>${row.split(' | ').map((c: string) => `<td class="border border-gray-200 px-3 py-2 text-sm">${c}</td>`).join('')}</tr>`)
      .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-sm text-gray-700 my-1"><span class="text-teal-500 mt-1">•</span><span>$1</span></li>')
      .replace(/\n\n/g, '<br/>')
      .replace(/<tr>[\s\S]*?<\/tr>/g, m => `<table class="w-full border-collapse my-3 text-sm">${m}</table>`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="h-6 w-6 text-teal-600" />AI Notes Generator
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Generate comprehensive study notes using AI</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />Generate Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Subject</label>
              <Select value={subject} onValueChange={setSubject} placeholder="Select Subject">
                <SelectItem value="IOT101">IOT & Embedded System (IOT101)</SelectItem>
                <SelectItem value="CS101">Computer Science (CS101)</SelectItem>
                <SelectItem value="MATH101">Mathematics (MATH101)</SelectItem>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Topic</label>
              <Textarea
                placeholder="e.g. MQTT Protocol, Sensor Integration, Embedded C..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                rows={1}
                className="resize-none"
              />
            </div>
          </div>
          <Button onClick={generate} disabled={loading || !subject || !topic} className="flex items-center gap-2">
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
            ) : (
              <><Sparkles className="h-4 w-4" />Generate Notes with AI</>
            )}
          </Button>
        </CardContent>
      </Card>

      {notes && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal-600" />Generated Notes
              </CardTitle>
              <Badge variant="success" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />AI Generated
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
