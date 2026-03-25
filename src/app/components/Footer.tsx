import { Link } from 'react-router';
import { Twitter, Facebook, Instagram, Briefcase } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#00000014] py-12">
      <div className="max-w-[1128px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo/Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <div className="w-8 h-8 bg-[#0A66C2] rounded-md flex items-center justify-center shadow-sm">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0A66C2] tracking-tight">JOBfinder</span>
            </div>
            <p className="text-xs text-[#00000099] leading-relaxed">
              Connecting Nepal's professionals to opportunities.
            </p>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-sm font-semibold text-[#000000E0] mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-xs text-[#00000099] hover:text-[#0A66C2] hover:underline">About us</Link></li>
              <li><Link to="/support" className="text-xs text-[#00000099] hover:text-[#0A66C2] hover:underline">Support</Link></li>
              <li><Link to="#" className="text-xs text-[#00000099] hover:text-[#0A66C2] hover:underline">Privacy & Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#000000E0] mb-4">Careers</h4>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-xs text-[#00000099] hover:text-[#0A66C2] hover:underline">Browse Jobs</Link></li>
              <li><Link to="/companies" className="text-xs text-[#00000099] hover:text-[#0A66C2] hover:underline">Companies</Link></li>
              <li><Link to="#" className="text-xs text-[#00000099] hover:text-[#0A66C2] hover:underline">Post a Job</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#000000E0] mb-4">Community</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-xs text-[#00000099] hover:text-[#0A66C2] hover:underline">Guidelines</Link></li>
              <li><Link to="#" className="text-xs text-[#00000099] hover:text-[#0A66C2] hover:underline">Diversity</Link></li>
              <li><Link to="#" className="text-xs text-[#00000099] hover:text-[#0A66C2] hover:underline">Safety</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#000000E0] mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-[#00000099] hover:text-[#0A66C2]"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-[#00000099] hover:text-[#0A66C2]"><Briefcase className="w-5 h-5" /></a>
              <a href="#" className="text-[#00000099] hover:text-[#0A66C2]"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-[#00000099] hover:text-[#0A66C2]"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#00000014] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#00000099]">
            JOBfinder Corporation &copy; {currentYear}
          </p>
          <div className="flex gap-6 text-xs text-[#00000099]">
            <a href="#" className="hover:text-[#0A66C2] hover:underline">Language</a>
            <a href="#" className="hover:text-[#0A66C2] hover:underline">Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
