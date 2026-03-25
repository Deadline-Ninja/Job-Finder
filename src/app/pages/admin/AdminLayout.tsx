import { Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, Users, Briefcase, Settings, LogOut, Menu, X, BarChart3, Database, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNav: NavItem[] = [
    { name: 'Console Home', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Directory', path: '/admin/dashboard?tab=users', icon: Users },
    { name: 'Job Repository', path: '/admin/dashboard?tab=jobs', icon: Briefcase },
    { name: 'Corporate Nodes', path: '/admin/dashboard?tab=companies', icon: Database },
    { name: 'Regional Hubs', path: '/admin/dashboard?tab=branches', icon: MapPin },
    { name: 'Audit Reports', path: '/admin/dashboard?tab=analytics', icon: BarChart3 },
    { name: 'Global Settings', path: '/admin/dashboard?tab=settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <div className="flex">
        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 bg-white border border-[#00000014] rounded-full p-2 shadow-md"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-[#00000099]" /> : <Menu className="w-5 h-5 text-[#00000099]" />}
        </button>

        {/* Admin Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-[#00000014] 
          transform transition-transform duration-300 z-40 overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full p-6">
            <div className="mb-10 px-2">
              <h2 className="text-xl font-bold tracking-tight text-[#0A66C2]">
                Admin Console
              </h2>
              <p className="text-[10px] text-[#00000099] uppercase tracking-widest font-semibold mt-1">Management Hub</p>
            </div>

            <div className="flex-1 space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                      ${isActive 
                        ? 'bg-[#F3F2EF] text-[#0A66C2]' 
                        : 'text-[#00000099] hover:bg-[#F3F2EF] hover:text-[#000000E0]'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#0A66C2]' : 'text-[#00000099]'}`} />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-6 mt-auto border-t border-[#00000014]">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 w-full text-[#00000099] hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Administrative Content */}
        <main className="flex-1 p-6 lg:p-10 min-h-screen overflow-y-auto text-[#000000E0]">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
