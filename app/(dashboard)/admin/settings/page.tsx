'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Save, Shield, Bell, Database, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Settings className="h-6 w-6 text-teal-600" />System Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure platform-wide settings</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: 'General Settings', icon: Globe, fields: [{ label: 'Platform Name', value: 'Buildroonix' }, { label: 'Academic Year', value: '2026-2027' }, { label: 'Institution Name', value: 'Buildroonix Institute' }] },
          { title: 'Security Settings', icon: Shield, fields: [{ label: 'Session Timeout (mins)', value: '30' }, { label: 'Max Login Attempts', value: '5' }, { label: 'Password Min Length', value: '8' }] },
          { title: 'Notification Settings', icon: Bell, fields: [{ label: 'Admin Email', value: 'admin@buildroonix.com' }, { label: 'SMS Gateway', value: 'Twilio' }, { label: 'Notification Frequency', value: 'Daily' }] },
          { title: 'Database Settings', icon: Database, fields: [{ label: 'Backup Frequency', value: 'Daily' }, { label: 'Retention Period (days)', value: '90' }, { label: 'Storage Limit (GB)', value: '50' }] },
        ].map(section => (
          <Card key={section.title}>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><section.icon className="h-4 w-4 text-teal-600" />{section.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {section.fields.map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">{f.label}</label>
                  <Input defaultValue={f.value} />
                </div>
              ))}
              <Button size="sm" className="flex items-center gap-2 mt-2"><Save className="h-3.5 w-3.5" />Save Changes</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
