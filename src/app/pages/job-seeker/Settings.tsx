import { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { User, Bell, Lock, Shield, Trash2, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export function JobSeekerSettings() {
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings updated');
    }, 1000);
  };

  return (
    <DashboardLayout userType="seeker">
      <div className="max-w-[800px] mx-auto space-y-6 pb-12">
        
        <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-[#000000E0]">Settings</h1>
          <p className="text-sm text-[#00000099]">Manage your account preferences and security.</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#0000000D]">
            <h2 className="text-base font-semibold text-[#000000E0]">Account information</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-[#000000E0]">Full Name</Label>
                <Input id="name" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="rounded-md border-[#00000099]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#000000E0]">Email Address</Label>
                <Input id="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="rounded-md border-[#00000099]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-[#000000E0]">Phone Number</Label>
                <Input id="phone" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="rounded-md border-[#00000099]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold text-[#000000E0]">Location</Label>
                <Input id="location" value={profileForm.location} onChange={(e) => setProfileForm({...profileForm, location: e.target.value})} className="rounded-md border-[#00000099]" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveProfile} disabled={saving} className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-6 font-semibold">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save changes
              </Button>
            </div>
          </div>
        </div>

        {/* Other Settings Links */}
        <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
          <div className="divide-y divide-[#0000000D]">
            {[
              { icon: Bell, title: 'Notifications', desc: 'Manage your email and push notifications' },
              { icon: Lock, title: 'Privacy', desc: 'Control who can see your profile and activity' },
              { icon: Shield, title: 'Security', desc: 'Password, two-step verification, and more' },
            ].map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-[#F3F2EF] cursor-pointer transition-colors group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#F3F2EF] rounded-full flex items-center justify-center text-[#00000099]">
                        <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-[#000000E0]">{item.title}</h4>
                        <p className="text-[11px] text-[#00000099]">{item.desc}</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#00000066] group-hover:text-[#000000E0]" />
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg border border-red-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-red-50/50 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-red-600">Close account</h4>
              <p className="text-[11px] text-[#00000099]">Permanently delete your profile and all data.</p>
            </div>
            <Button variant="ghost" className="text-red-600 font-semibold hover:bg-red-50 rounded-full px-6">Close account</Button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
