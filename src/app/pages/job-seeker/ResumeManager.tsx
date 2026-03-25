import { useState, useRef } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { FileText, Upload, Download, Trash2, Eye, Clock, Loader2, Check, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

interface Resume {
  id: string;
  name: string;
  uploadedAt: string;
  size: string;
  isDefault: boolean;
  views: number;
}

export function ResumeManager() {
  const [resumes, setResumes] = useState<Resume[]>([
    { id: '1', name: 'Resume_2024_ProductDesign.pdf', uploadedAt: '2024-03-08', size: '2.4 MB', isDefault: true, views: 45 },
    { id: '2', name: 'Resume_Frontend_Developer.pdf', uploadedAt: '2024-02-15', size: '1.8 MB', isDefault: false, views: 23 },
  ]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      const newResume: Resume = {
        id: Date.now().toString(),
        name: file.name,
        uploadedAt: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        isDefault: resumes.length === 0,
        views: 0
      };
      setResumes(prev => [newResume, ...prev]);
      setUploading(false);
      toast.success('Resume uploaded!');
    }, 1500);
  };

  const handleSetDefault = (resumeId: string) => {
    setResumes(prev => prev.map(r => ({ ...r, isDefault: r.id === resumeId })));
    toast.success('Default resume updated');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this resume?')) return;
    setResumes(prev => prev.filter(r => r.id !== id));
    toast.success('Resume deleted');
  };

  return (
    <DashboardLayout userType="seeker">
      <div className="max-w-[1128px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-xl font-semibold text-[#000000E0]">Resumes</h1>
                <p className="text-sm text-[#00000099]">Manage the resumes you use for job applications.</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleUploadResume} className="hidden" accept=".pdf,.doc,.docx" />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-6 font-semibold"
              >
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload resume
              </Button>
            </div>

            <div className="divide-y divide-[#0000000D]">
              {resumes.length > 0 ? (
                resumes.map((resume) => (
                  <div key={resume.id} className="py-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-sm flex items-center justify-center text-[#0A66C2]">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#000000E0] hover:text-[#0A66C2] hover:underline cursor-pointer">{resume.name}</h3>
                          {resume.isDefault && <Badge className="bg-green-50 text-green-700 border-none rounded-sm px-2 py-0 text-[10px] uppercase font-bold">Default</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#00000099] mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {resume.uploadedAt}</span>
                          <span>•</span>
                          <span>{resume.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!resume.isDefault && (
                        <Button variant="ghost" size="sm" onClick={() => handleSetDefault(resume.id)} className="text-xs font-semibold text-[#0A66C2] hover:bg-blue-50 rounded-full">
                          Set as default
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00000099] hover:bg-black/5 rounded-full">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(resume.id)} className="h-8 w-8 text-[#00000099] hover:text-red-600 hover:bg-black/5 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <FileText className="w-16 h-16 text-[#0000000D] mx-auto mb-4" />
                  <p className="text-sm text-[#00000099]">No resumes uploaded yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
            <h3 className="text-base font-semibold text-[#000000E0] mb-4">Resume best practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#000000E0]">Keep it concise</h4>
                <p className="text-xs text-[#00000099]">Aim for 1-2 pages maximum. Focus on your most recent and relevant experience.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#000000E0]">Use action verbs</h4>
                <p className="text-xs text-[#00000099]">Words like "Led", "Created", "Improved" carry more weight than "Responsible for".</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#000000E0]">PDF format</h4>
                <p className="text-xs text-[#00000099]">Always upload your resume in PDF format to preserve formatting across all devices.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-[#000000E0]">Quantify results</h4>
                <p className="text-xs text-[#00000099]">Instead of "Improved sales", use "Increased sales by 15% within the first 6 months".</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#000000E0] mb-4">Resume insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#00000099]">Total views</span>
                <span className="font-semibold text-[#000000E0]">68</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#00000099]">Shortlisted by</span>
                <span className="font-semibold text-[#000000E0]">4 recruiters</span>
              </div>
              <div className="h-px bg-[#0000000D]" />
              <p className="text-[11px] text-[#00000099]">Recruiters are seeing your default resume when they search for candidates.</p>
            </div>
          </div>

          <div className="bg-[#0A66C2] rounded-lg p-6 text-white shadow-md">
            <h3 className="text-sm font-semibold mb-2">Enhance your resume</h3>
            <p className="text-xs text-white/80 mb-4">Use our AI-powered tool to scan your resume for keywords and improvements.</p>
            <Button className="w-full bg-white text-[#0A66C2] hover:bg-white/90 rounded-full font-semibold text-xs h-8">
              Analyze resume
            </Button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
