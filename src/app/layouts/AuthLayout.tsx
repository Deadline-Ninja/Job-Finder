import { Link } from 'react-router';
import { Briefcase } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2563EB] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/10" />
          {/* Abstract pattern */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <Link to="/" className="flex items-center space-x-3 mb-12">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-[#2563EB]" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">
              JOBfinder
            </span>
          </Link>
          
          <div className="text-center max-w-md">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
              Your Career Journey Starts Here
            </h2>
            <p className="text-white/70 text-lg">
              Connect with top employers, discover opportunities, and take the next step in your professional journey.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-2 gap-6 max-w-lg">
            {[
              '10K+ Active Jobs',
              '2K+ Companies',
              'Direct Applications',
              'Career Tools',
            ].map((feature) => (
              <div key={feature} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white text-sm font-medium">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center space-x-2 lg:hidden mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#2563EB]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-black">
              JOBfinder
            </span>
          </Link>
          
          {children}
        </div>
      </div>
    </div>
  );
}
