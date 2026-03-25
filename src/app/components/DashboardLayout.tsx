import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Briefcase, Bookmark, FileText, MessageSquare, Bell, Settings, LogOut, Menu, X, User, Upload, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'seeker' | 'employer';
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const seekerNav: NavItem[] = [
    { name: 'Home', path: '/seeker/dashboard', icon: LayoutDashboard },
    { name: 'Applications', path: '/seeker/applications', icon: FileText },
    { name: 'My Jobs', path: '/seeker/saved', icon: Bookmark },
    { name: 'Profile', path: '/seeker/profile', icon: User },
    { name: 'Messaging', path: '/seeker/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/seeker/notifications', icon: Bell },
    { name: 'Settings', path: '/seeker/settings', icon: Settings },
  ];

  const employerNav: NavItem[] = [
    { name: 'Home', path: '/employer/dashboard', icon: LayoutDashboard },
    { name: 'Post Job', path: '/employer/post-job', icon: Briefcase },
    { name: 'Manage Jobs', path: '/employer/jobs', icon: FileText },
    { name: 'Applicants', path: '/employer/applicants', icon: MessageSquare },
    { name: 'Analytics', path: '/employer/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/employer/settings', icon: Settings },
  ];

  const navItems = userType === 'seeker' ? seekerNav : employerNav;

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <div className="max-w-[1128px] mx-auto pt-6 flex flex-col md:flex-row gap-6">
        
        {/* Mobile Navigation Toggle */}
        <div className="md:hidden px-4">
          <Button 
            variant="outline" 
            className="w-full bg-white border-[#00000014] text-[#00000099]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-4 h-4 mr-2" /> : <Menu className="w-4 h-4 mr-2" />}
            Menu
          </Button>
        </div>

        {/* Sidebar Nav */}
        <aside className={`
          ${sidebarOpen ? 'block' : 'hidden'} md:block 
          w-full md:w-[225px] flex-shrink-0
        `}>
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm sticky top-[4.5rem]">
            <div className="p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-semibold
                      ${isActive 
                        ? 'bg-[#F3F2EF] text-[#0A66C2]' 
                        : 'text-[#00000099] hover:bg-[#F3F2EF] hover:text-[#000000E0]'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#0A66C2]' : 'text-[#00000099]'}`} />
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-[#0A66C2] text-white">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
            
            <div className="border-t border-[#00000014] p-4">
              <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-semibold text-[#00000099] hover:bg-[#F3F2EF] text-left transition-colors">
                <LogOut className="w-5 h-5" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-0">
          <div className="animate-fade-in-premium">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
