import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import companiesAPI from '../../api/companiesAPI';
import { useAuth } from '../../hooks/useAuth';
import { Building2, Bell, Lock, Users, Trash2, Loader2, Camera, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export function EmployerSettings() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: '',
    size: '',
    website: '',
    description: '',
    logo: ''
  });

  useEffect(() => {
    fetchCompanyData();
  }, [user]);

  const fetchCompanyData = async () => {
    const userId = (user as any)?._id;
    if (!userId) return;
    setLoading(true);
    try {
      const response = await companiesAPI.getCompanies();
      const myCompany = response.data.companies.find((c: any) => c.owner === userId);
      if (myCompany) {
        setCompanyId(myCompany._id);
        setCompanyForm({
          name: myCompany.name || '',
          industry: myCompany.industry || '',
          size: myCompany.size || '',
          website: myCompany.website || '',
          description: myCompany.description || '',
          logo: myCompany.logo || ''
        });
      }
    } catch (error) {
      // Fallback
      setCompanyForm({
        name: 'TechFlow Solutions',
        industry: 'Software Engineering',
        size: '50-100 employees',
        website: 'https://techflow.io',
        description: 'Leading the way in cloud infrastructure and DevOps automation.',
        logo: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Company settings updated');
    }, 1000);
  };

  if (loading) {
    return (
      <DashboardLayout userType="employer">
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="employer">
      <div className="max-w-[800px] mx-auto space-y-6 pb-12">
        
        <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-[#000000E0]">Company settings</h1>
          <p className="text-sm text-[#00000099]">Manage your organization's public profile and team access.</p>
        </div>

        {/* Company Profile Section */}
        <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#0000000D]">
            <h2 className="text-base font-semibold text-[#000000E0]">Company information</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-lg bg-[#F3F2EF] border border-[#00000014] flex items-center justify-center text-[#00000066] overflow-hidden">
                  {companyForm.logo ? (
                    <img src={companyForm.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-12 h-12" />
                  )}
                </div>
                <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold h-8 border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50">
                  <Camera className="w-3 h-3 mr-2" /> Upload logo
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-[#00000099]">Legal Name</Label>
                    <Input value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="h-9 text-sm border-[#0000004D]" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-[#00000099]">Industry</Label>
                    <Input value={companyForm.industry} onChange={e => setCompanyForm({...companyForm, industry: e.target.value})} className="h-9 text-sm border-[#0000004D]" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-[#00000099]">Company Size</Label>
                    <Input value={companyForm.size} onChange={e => setCompanyForm({...companyForm, size: e.target.value})} className="h-9 text-sm border-[#0000004D]" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-[#00000099]">Website</Label>
                    <Input value={companyForm.website} onChange={e => setCompanyForm({...companyForm, website: e.target.value})} className="h-9 text-sm border-[#0000004D]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-[#00000099]">About Company</Label>
                  <textarea 
                    value={companyForm.description} 
                    onChange={e => setCompanyForm({...companyForm, description: e.target.value})}
                    className="w-full p-3 border border-[#0000004D] rounded-md text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-[#0A66C2]"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} disabled={saving} className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-8 font-semibold">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#0000000D] flex justify-between items-center">
            <h2 className="text-base font-semibold text-[#000000E0]">Team access</h2>
            <Button variant="ghost" className="text-[#0A66C2] text-xs font-semibold hover:bg-blue-50 h-8 px-4 rounded-full">+ Invite teammate</Button>
          </div>
          <div className="divide-y divide-[#0000000D]">
            {[
              { name: 'John Doe', email: 'john@techflow.io', role: 'Company Owner' },
              { name: 'Sarah Wilson', email: 'sarah@techflow.io', role: 'Recruiter' },
            ].map((member, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-[#F3F2EF] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0A66C2]/10 text-[#0A66C2] rounded-full flex items-center justify-center font-bold">{member.name.charAt(0)}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#000000E0]">{member.name}</h4>
                    <p className="text-[11px] text-[#00000099]">{member.email} • {member.role}</p>
                  </div>
                </div>
                <Button variant="ghost" className="text-red-600 text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Remove</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Other Sections */}
        <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
           <div className="divide-y divide-[#0000000D]">
              {[
                { icon: Bell, title: 'Notifications', desc: 'Manage your application alerts and weekly reports' },
                { icon: Lock, title: 'Security', desc: 'Secure your organization account and team access' },
                { icon: Users, title: 'Recruitment preferences', desc: 'Set default values for new job postings' }
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
          <div className="p-4 bg-red-50/50 flex items-center justify-between text-red-600">
            <div>
              <h4 className="text-sm font-semibold">Dissolve organization</h4>
              <p className="text-[11px] text-[#00000099]">Permanently delete this company and all its job postings.</p>
            </div>
            <Button variant="ghost" className="text-red-600 font-semibold hover:bg-red-50 rounded-full h-9 px-6">Close organization</Button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
