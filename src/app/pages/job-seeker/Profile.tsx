import { useState, useEffect, useRef } from 'react';
import {
  Pencil, MapPin, Mail, Phone, Globe, Briefcase,
  GraduationCap, Award, Loader2, Plus, Camera, CameraIcon, X, CheckCircle
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import usersAPI from '../../api/usersAPI';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Experience { title: string; company: string; duration: string; description: string; }
interface Education { degree: string; school: string; field: string; startYear: string; endYear: string; }
interface UserProfile {
  id?: string; name?: string; email?: string; mobile?: string;
  profilePhoto?: string; title?: string; location?: string;
  website?: string; about?: string; skills?: string[];
  experience?: Experience[]; education?: Education[];
  kycVerified?: boolean; role?: string;
}

// ─── Dialogs ─────────────────────────────────────────────────────────────────
const SectionDialog = ({ open, onClose, title, children, onSave, saveLabel = 'Save Changes' }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
  onSave?: () => void; saveLabel?: string;
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
      </DialogHeader>
      <div className="py-2">{children}</div>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
        {onSave && (
          <Button onClick={onSave} className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-6">
            {saveLabel}
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Dialog visibility
  const [basicOpen, setBasicOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);

  // Form states
  const [basicForm, setBasicForm] = useState({ name: '', title: '', location: '', mobile: '', website: '' });
  const [aboutText, setAboutText] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [expForm, setExpForm] = useState<Experience>({ title: '', company: '', duration: '', description: '' });
  const [expEditIdx, setExpEditIdx] = useState<number | null>(null);
  const [eduForm, setEduForm] = useState<Education>({ degree: '', school: '', field: '', startYear: '', endYear: '' });
  const [eduEditIdx, setEduEditIdx] = useState<number | null>(null);
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [kycIdType, setKycIdType] = useState('Citizenship ID (Nepal)');
  const kycRef = useRef<HTMLInputElement>(null);

  // ── Load profile ────────────────────────────────────────────────────────────
  useEffect(() => { loadProfile(); }, [authUser]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await usersAPI.getProfile();
      if (res.data?.user) {
        setProfile(res.data.user as any);
      } else { setDefaultProfile(); }
    } catch { setDefaultProfile(); }
    finally { setLoading(false); }
  };

  const setDefaultProfile = () => {
    if (authUser) {
      setProfile({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        mobile: authUser.mobile || '+977 9812345678',
        title: 'Software Engineer',
        location: 'Kathmandu, Nepal',
        website: 'https://jobfinder.com',
        about: 'Passionate professional looking for new opportunities.',
        profilePhoto: authUser.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.name)}&background=0A66C2&color=fff`,
        skills: ['React', 'TypeScript', 'Node.js'],
        experience: [],
        education: [],
        kycVerified: authUser.kycVerified || false,
        role: authUser.role
      });
      return;
    }

    setProfile({
      id: 'DEMO-001', name: 'John Doe', email: 'john@example.com',
      mobile: '+977 9812345678', title: 'Software Engineer',
      location: 'Kathmandu, Nepal', website: 'https://johndoe.dev',
      about: 'Passionate software engineer with experience in building scalable web applications for the Nepalese market.',
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      experience: [{ title: 'Senior Software Engineer', company: 'F1Soft International', duration: '2021 - Present', description: 'Developing fintech solutions for the Nepalese banking sector.' }],
      education: [{ degree: 'BE Computer Engineering', school: 'Tribhuvan University', field: 'Computer Science', startYear: '2015', endYear: '2019' }],
      kycVerified: false, role: 'seeker'
    });
  };

  const persist = async (update: Partial<UserProfile>) => {
    const updated = { ...profile, ...update };
    setProfile(updated as UserProfile);
    await usersAPI.updateProfile(update);
  };

  // ── Basic Info ──────────────────────────────────────────────────────────────
  const openBasic = () => {
    setBasicForm({ name: profile?.name || '', title: profile?.title || '', location: profile?.location || '', mobile: profile?.mobile || '', website: profile?.website || '' });
    setBasicOpen(true);
  };
  const saveBasic = async () => {
    await persist(basicForm);
    setBasicOpen(false);
    toast.success('Profile updated!');
  };

  // ── About ────────────────────────────────────────────────────────────────────
  const openAbout = () => { setAboutText(profile?.about || ''); setAboutOpen(true); };
  const saveAbout = async () => { await persist({ about: aboutText }); setAboutOpen(false); toast.success('About section updated!'); };

  // ── Skills ───────────────────────────────────────────────────────────────────
  const addSkill = async () => {
    const s = skillInput.trim();
    if (!s || !profile) return;
    if (profile.skills?.includes(s)) { toast.error('Skill already exists'); return; }
    const newSkills = [...(profile.skills || []), s];
    await persist({ skills: newSkills });
    setSkillInput('');
    toast.success(`Added "${s}"`);
  };
  const removeSkill = async (skill: string) => {
    if (!profile) return;
    await persist({ skills: profile.skills?.filter(s => s !== skill) });
    toast.success(`Removed "${skill}"`);
  };

  // ── Experience ───────────────────────────────────────────────────────────────
  const openAddExp = () => { setExpForm({ title: '', company: '', duration: '', description: '' }); setExpEditIdx(null); setExpOpen(true); };
  const openEditExp = (i: number) => { setExpForm({ ...(profile?.experience?.[i] as any) }); setExpEditIdx(i); setExpOpen(true); };
  const saveExp = async () => {
    if (!expForm.title || !expForm.company) { toast.error('Job title and company are required'); return; }
    const list = [...(profile?.experience || [])];
    if (expEditIdx !== null) list[expEditIdx] = expForm; else list.unshift(expForm);
    await persist({ experience: list });
    setExpOpen(false);
    toast.success('Experience saved!');
  };
  const deleteExp = async (i: number) => {
    if (!window.confirm('Remove this experience?')) return;
    await persist({ experience: profile?.experience?.filter((_, idx) => idx !== i) });
    toast.success('Experience removed');
  };

  // ── Education ────────────────────────────────────────────────────────────────
  const openAddEdu = () => { setEduForm({ degree: '', school: '', field: '', startYear: '', endYear: '' }); setEduEditIdx(null); setEduOpen(true); };
  const openEditEdu = (i: number) => { setEduForm({ ...(profile?.education?.[i] as any) }); setEduEditIdx(i); setEduOpen(true); };
  const saveEdu = async () => {
    if (!eduForm.degree || !eduForm.school) { toast.error('Degree and school are required'); return; }
    const list = [...(profile?.education || [])];
    if (eduEditIdx !== null) list[eduEditIdx] = eduForm; else list.unshift(eduForm);
    await persist({ education: list });
    setEduOpen(false);
    toast.success('Education saved!');
  };
  const deleteEdu = async (i: number) => {
    if (!window.confirm('Remove this education?')) return;
    await persist({ education: profile?.education?.filter((_, idx) => idx !== i) });
    toast.success('Education removed');
  };

  // ── KYC ──────────────────────────────────────────────────────────────────────
  const submitKyc = async () => {
    await persist({ kycVerified: true });
    setKycOpen(false);
    setKycFile(null);
    toast.success('KYC submitted! Pending admin review.');
  };

  // ── Loading State ─────────────────────────────────────────────────────────────
  if (loading) return (
    <DashboardLayout userType="seeker">
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout userType="seeker">
      <div className="max-w-[860px] mx-auto space-y-4 pb-16 px-4">

        {/* ── Profile Header Card ─────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="px-6 pb-6 relative">
            {/* Avatar */}
            <div className="absolute -top-14 left-6">
              <div className="relative">
                <img
                  src={profile?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'U')}&background=0A66C2&color=fff&size=128`}
                  alt={profile?.name}
                  className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
                />
                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Edit icon top-right */}
            <div className="flex justify-end pt-2">
              <button onClick={openBasic} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#0A66C2] transition">
                <Pencil className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-10">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{profile?.name}</h1>
                {profile?.kycVerified ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                    KYC Pending
                  </span>
                )}
              </div>
              <p className="text-base text-gray-700 mt-0.5">{profile?.title || 'Add a title'}</p>

              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                {profile?.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{profile.location}</span>}
                {profile?.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{profile.email}</span>}
                {profile?.mobile && <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{profile.mobile}</span>}
                {profile?.website && <span className="flex items-center gap-1"><Globe className="w-4 h-4" />{profile.website}</span>}
              </div>

              {/* KYC Banner */}
              {!profile?.kycVerified && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">Complete your KYC to unlock all features</p>
                    <p className="text-xs text-blue-600">Upload a valid government ID to get verified.</p>
                  </div>
                  <Button onClick={() => setKycOpen(true)} className="bg-[#0A66C2] hover:bg-[#004182] text-white text-xs px-4 py-2 rounded-full shrink-0">
                    Verify Now
                  </Button>
                </div>
              )}
              {profile?.kycVerified && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-800">Identity Verified — Your account is fully active.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── About ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900">About</h2>
            <button onClick={openAbout} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#0A66C2]"><Pencil className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {profile?.about || <span className="text-gray-400 italic">Tell recruiters about yourself — click the pencil to add a summary.</span>}
          </p>
        </div>

        {/* ── Skills ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Skills</h2>
            <button onClick={() => setSkillOpen(true)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#0A66C2]"><Plus className="w-4 h-4" /></button>
          </div>
          {profile?.skills && profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-red-500 transition"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No skills added yet. Click + to add skills.</p>
          )}
        </div>

        {/* ── Experience ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Work Experience</h2>
            <button onClick={openAddExp} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#0A66C2]"><Plus className="w-4 h-4" /></button>
          </div>
          {profile?.experience && profile.experience.length > 0 ? (
            <div className="space-y-5">
              {profile.experience.map((exp, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-[#0A66C2]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{exp.title}</p>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{exp.duration}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => openEditExp(i)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-[#0A66C2]"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteExp(i)} className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                    {exp.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No experience added yet. Click + to add.</p>
          )}
        </div>

        {/* ── Education ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Education</h2>
            <button onClick={openAddEdu} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#0A66C2]"><Plus className="w-4 h-4" /></button>
          </div>
          {profile?.education && profile.education.length > 0 ? (
            <div className="space-y-5">
              {profile.education.map((edu, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{edu.school}</p>
                        <p className="text-sm text-gray-600">{edu.degree}{edu.field && ` · ${edu.field}`}</p>
                        {(edu.startYear || edu.endYear) && (
                          <p className="text-xs text-gray-400 mt-0.5">{edu.startYear}{edu.endYear && ` — ${edu.endYear}`}</p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => openEditEdu(i)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-[#0A66C2]"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => deleteEdu(i)} className="p-1.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No education added yet. Click + to add.</p>
          )}
        </div>

      </div>

      {/* ══ Dialogs ══════════════════════════════════════════════════════════════ */}

      {/* Basic Info Dialog */}
      <SectionDialog open={basicOpen} onClose={() => setBasicOpen(false)} title="Edit Profile Info" onSave={saveBasic}>
        <div className="space-y-4">
          <div>
            <Label>Full Name *</Label>
            <Input className="mt-1" value={basicForm.name} onChange={e => setBasicForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
          </div>
          <div>
            <Label>Headline / Job Title</Label>
            <Input className="mt-1" value={basicForm.title} onChange={e => setBasicForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Software Engineer at F1Soft" />
          </div>
          <div>
            <Label>Location</Label>
            <Input className="mt-1" value={basicForm.location} onChange={e => setBasicForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Kathmandu, Nepal" />
          </div>
          <div>
            <Label>Mobile Number</Label>
            <Input className="mt-1" value={basicForm.mobile} onChange={e => setBasicForm(f => ({ ...f, mobile: e.target.value }))} placeholder="+977 98XXXXXXXX" />
          </div>
          <div>
            <Label>Website / Portfolio</Label>
            <Input className="mt-1" value={basicForm.website} onChange={e => setBasicForm(f => ({ ...f, website: e.target.value }))} placeholder="https://yourwebsite.com" />
          </div>
        </div>
      </SectionDialog>

      {/* About Dialog */}
      <SectionDialog open={aboutOpen} onClose={() => setAboutOpen(false)} title="Edit About" onSave={saveAbout}>
        <div>
          <Label>About Me</Label>
          <textarea
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none min-h-[140px] focus:border-[#0A66C2] focus:outline-none"
            value={aboutText}
            onChange={e => setAboutText(e.target.value)}
            placeholder="Write a summary about your professional background, skills, and goals..."
          />
        </div>
      </SectionDialog>

      {/* Skills Dialog */}
      <SectionDialog open={skillOpen} onClose={() => setSkillOpen(false)} title="Manage Skills">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="e.g. React, Python, SQL..."
              className="flex-1"
            />
            <Button onClick={addSkill} className="bg-[#0A66C2] hover:bg-[#004182] text-white px-4 rounded-lg">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map((s, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-sm">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            ))}
            {(!profile?.skills || profile.skills.length === 0) && (
              <p className="text-sm text-gray-400 italic">Type a skill and click Add or press Enter.</p>
            )}
          </div>
        </div>
      </SectionDialog>

      {/* Experience Dialog */}
      <SectionDialog
        open={expOpen}
        onClose={() => setExpOpen(false)}
        title={expEditIdx !== null ? 'Edit Experience' : 'Add Experience'}
        onSave={saveExp}
      >
        <div className="space-y-4">
          <div>
            <Label>Job Title *</Label>
            <Input className="mt-1" value={expForm.title} onChange={e => setExpForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Software Engineer" />
          </div>
          <div>
            <Label>Company *</Label>
            <Input className="mt-1" value={expForm.company} onChange={e => setExpForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. F1Soft International" />
          </div>
          <div>
            <Label>Duration</Label>
            <Input className="mt-1" value={expForm.duration} onChange={e => setExpForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 2022 - Present" />
          </div>
          <div>
            <Label>Description</Label>
            <textarea
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none min-h-[100px] focus:border-[#0A66C2] focus:outline-none"
              value={expForm.description}
              onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      </SectionDialog>

      {/* Education Dialog */}
      <SectionDialog
        open={eduOpen}
        onClose={() => setEduOpen(false)}
        title={eduEditIdx !== null ? 'Edit Education' : 'Add Education'}
        onSave={saveEdu}
      >
        <div className="space-y-4">
          <div>
            <Label>Degree / Qualification *</Label>
            <Input className="mt-1" value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} placeholder="e.g. BE Computer Engineering" />
          </div>
          <div>
            <Label>School / University *</Label>
            <Input className="mt-1" value={eduForm.school} onChange={e => setEduForm(f => ({ ...f, school: e.target.value }))} placeholder="e.g. Tribhuvan University" />
          </div>
          <div>
            <Label>Field of Study</Label>
            <Input className="mt-1" value={eduForm.field} onChange={e => setEduForm(f => ({ ...f, field: e.target.value }))} placeholder="e.g. Computer Science" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Year</Label>
              <Input className="mt-1" value={eduForm.startYear} onChange={e => setEduForm(f => ({ ...f, startYear: e.target.value }))} placeholder="2015" />
            </div>
            <div>
              <Label>End Year</Label>
              <Input className="mt-1" value={eduForm.endYear} onChange={e => setEduForm(f => ({ ...f, endYear: e.target.value }))} placeholder="2019" />
            </div>
          </div>
        </div>
      </SectionDialog>

      {/* KYC Dialog */}
      <SectionDialog open={kycOpen} onClose={() => setKycOpen(false)} title="Identity Verification (KYC)" onSave={submitKyc} saveLabel="Submit for Verification">
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            Upload a clear photo of your government-issued ID (Citizenship, Passport, or License) to verify your identity and unlock all features.
          </div>
          <div>
            <Label>ID Type</Label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[#0A66C2] focus:outline-none bg-white"
              value={kycIdType} onChange={e => setKycIdType(e.target.value)}
            >
              <option>Citizenship ID (Nepal)</option>
              <option>Passport</option>
              <option>Driving License</option>
              <option>PAN Card</option>
            </select>
          </div>
          <div>
            <Label>Upload Document</Label>
            <div
              onClick={() => kycRef.current?.click()}
              className={`mt-1 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${kycFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-[#0A66C2] bg-gray-50 hover:bg-blue-50'}`}
            >
              {kycFile ? (
                <div>
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-green-700">{kycFile.name}</p>
                  <p className="text-xs text-green-600 mt-1">Click to change file</p>
                </div>
              ) : (
                <div>
                  <CameraIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Click to upload document</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
                </div>
              )}
              <input ref={kycRef} type="file" className="hidden" accept="image/*,.pdf" onChange={e => setKycFile(e.target.files?.[0] || null)} />
            </div>
          </div>
        </div>
      </SectionDialog>

    </DashboardLayout>
  );
}
