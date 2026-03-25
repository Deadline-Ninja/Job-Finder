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
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-24 left-4 z-50 bg-white border border-black/10 rounded-none p-2 shadow-sm"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
        </button>

        {/* Admin Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-black/10 
          transform transition-transform duration-300 z-40 overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full p-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-black uppercase italic">
                ADMIN CONSOLE
              </h2>
              <div className="h-1 w-12 bg-black mt-2" />
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
                      flex items-center space-x-4 px-6 py-4 transition-all border-b border-black/5
                      ${isActive 
                        ? 'bg-black text-white' 
                        : 'text-black hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-lg font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-8 mt-auto border-t border-black/10">
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-4 px-6 py-4 w-full text-black hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-lg font-medium tracking-tight">System Termination</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Administrative Content */}
        <main className="flex-1 p-8 lg:p-12 min-h-screen overflow-y-auto text-black">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
