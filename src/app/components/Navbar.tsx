import { Link, useLocation } from 'react-router';
import { 
  Search, Briefcase, Building2, User, Menu, X, 
  Home as HomeIcon, Users, MessageSquare, Bell,
  LogOut, LayoutDashboard, Settings 
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserResponse } from '../api/authAPI';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

export function Navbar() {
  const { user, logout } = useAuth() as { user: UserResponse | null, logout: () => void };
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const dashboardPath = user?.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard';
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white border-b border-[#00000014] transition-all duration-200">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          
          <div className="flex items-center gap-2 flex-1">
             {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 mr-2">
              <div className="w-8 h-8 bg-[#0A66C2] rounded-[4px] flex items-center justify-center shadow-sm">
                <Briefcase className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-[#0A66C2] tracking-tight hidden lg:block">
                JOBfinder
              </span>
            </Link>

            {/* Global Search Bar (LinkedIn style) */}
            <div className="hidden sm:block relative w-full max-w-[280px]">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00000099]" />
               <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-[#EDF3F8] border-none rounded-sm h-8 pl-10 text-sm focus:ring-2 focus:ring-black transition-all"
               />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {user ? (
              <>
                <Link 
                  to="/" 
                  className={`flex flex-col items-center justify-center min-w-[64px] transition-colors duration-100 ${
                    isActive('/') ? 'text-black border-b-2 border-black' : 'text-[#00000099] hover:text-black'
                  }`}
                >
                  <HomeIcon className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] lg:text-xs">Home</span>
                </Link>
                <Link 
                  to="/seeker/network" 
                  className={`flex flex-col items-center justify-center min-w-[64px] transition-colors duration-100 ${
                    isActive('/seeker/network') ? 'text-black border-b-2 border-black' : 'text-[#00000099] hover:text-black'
                  }`}
                >
                  <Users className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] lg:text-xs">My Network</span>
                </Link>
                <Link 
                  to="/jobs" 
                  className={`flex flex-col items-center justify-center min-w-[64px] transition-colors duration-100 ${
                    isActive('/jobs') ? 'text-black border-b-2 border-black' : 'text-[#00000099] hover:text-black'
                  }`}
                >
                  <Briefcase className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] lg:text-xs">Jobs</span>
                </Link>
                <Link 
                  to="/seeker/messages" 
                  className={`flex flex-col items-center justify-center min-w-[64px] transition-colors duration-100 ${
                    isActive('/seeker/messages') ? 'text-black border-b-2 border-black' : 'text-[#00000099] hover:text-black'
                  }`}
                >
                  <MessageSquare className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] lg:text-xs">Messaging</span>
                </Link>
                <Link 
                  to="/seeker/notifications" 
                  className={`flex flex-col items-center justify-center min-w-[64px] transition-colors duration-100 ${
                    isActive('/seeker/notifications') ? 'text-black border-b-2 border-black' : 'text-[#00000099] hover:text-black'
                  }`}
                >
                  <Bell className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] lg:text-xs">Notifications</span>
                </Link>

                <div className="h-full border-l border-[#00000014] ml-2 pl-2">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex flex-col items-center justify-center min-w-[64px] text-[#00000099] hover:text-black transition-colors">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-[#00000014]">
                          {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-full h-full p-1" />
                          )}
                        </div>
                        <span className="text-[10px] lg:text-xs flex items-center font-bold">{user.name.split(' ')[0]} <Menu className="w-3 h-3 ml-0.5 border-none" /></span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-bold text-[#000000E0]">{user.name}</p>
                          <p className="text-xs text-[#00000099] truncate">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link to={user.role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard'}>
                        <DropdownMenuItem className="cursor-pointer font-semibold py-2">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={user.role === 'employer' ? '/employer/settings' : '/seeker/profile'}>
                        <DropdownMenuItem className="cursor-pointer font-semibold py-2">
                          <User className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link to={user.role === 'employer' ? '/employer/settings' : '/seeker/settings'}>
                        <DropdownMenuItem className="cursor-pointer font-semibold py-2">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings & Privacy</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 font-semibold py-2" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Link to="/jobs" className="text-sm font-semibold text-[#00000099] hover:text-black">Find Jobs</Link>
                <Link to="/companies" className="text-sm font-semibold text-[#00000099] hover:text-black">Companies</Link>
                <Link to="/about" className="text-sm font-semibold text-[#00000099] hover:text-black">About</Link>
                <Link to="/support" className="text-sm font-semibold text-[#00000099] hover:text-black">Support</Link>
                <div className="h-8 border-l border-[#00000014] mx-2" />
                <Link to="/login">
                  <Button variant="ghost" className="text-[#00000099] font-bold hover:text-black hover:bg-black/5 rounded-full">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-6 font-bold shadow-none">Join now</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#00000099] p-2 hover:bg-black/5 rounded-full"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-[#00000014] bg-white absolute top-14 left-0 right-0 px-4 shadow-lg">
            {!user ? (
               <>
                 <Link to="/jobs" className="block px-4 py-3 rounded-md text-sm font-semibold text-[#00000099]" onClick={() => setMobileMenuOpen(false)}>Find Jobs</Link>
                 <Link to="/companies" className="block px-4 py-3 rounded-md text-sm font-semibold text-[#00000099]" onClick={() => setMobileMenuOpen(false)}>Companies</Link>
                 <Link to="/about" className="block px-4 py-3 rounded-md text-sm font-semibold text-[#00000099]" onClick={() => setMobileMenuOpen(false)}>About</Link>
                 <Link to="/support" className="block px-4 py-3 rounded-md text-sm font-semibold text-[#00000099]" onClick={() => setMobileMenuOpen(false)}>Support</Link>
                 <div className="flex flex-col gap-2 p-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="w-full">Sign In</Button></Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}><Button className="w-full bg-[#0A66C2]">Join now</Button></Link>
                 </div>
               </>
            ) : (
              <>
                <Link to="/" className="block px-4 py-3 rounded-md text-sm font-semibold text-[#00000099]" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link to="/seeker/network" className="block px-4 py-3 rounded-md text-sm font-semibold text-[#00000099]" onClick={() => setMobileMenuOpen(false)}>My Network</Link>
                <Link to="/jobs" className="block px-4 py-3 rounded-md text-sm font-semibold text-[#00000099]" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
                <Link to="/seeker/messages" className="block px-4 py-3 rounded-md text-sm font-semibold text-[#00000099]" onClick={() => setMobileMenuOpen(false)}>Messaging</Link>
                <Link to="/seeker/notifications" className="block px-4 py-3 rounded-md text-sm font-semibold text-[#00000099]" onClick={() => setMobileMenuOpen(false)}>Notifications</Link>
                <div className="border-t border-[#00000014] mt-2 pt-2">
                   <Link to={dashboardPath} className="block px-4 py-3 rounded-md text-sm font-semibold text-[#0A66C2]" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                   <button className="w-full text-left px-4 py-3 rounded-md text-sm font-semibold text-red-600" onClick={() => { logout(); setMobileMenuOpen(false); }}>Sign Out</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
