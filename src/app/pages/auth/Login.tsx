import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { Briefcase, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../hooks/useAuth';
import { GoogleAccountChooser } from '../../components/GoogleAccountChooser';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({ email, password });
      if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (result.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'google') {
      setIsGoogleChooserOpen(true);
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login({ provider });
      navigate('/seeker/dashboard');
    } catch (err: any) {
      setError(`Failed to login with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleAccountSelect = async (account: { name: string, email: string }) => {
    setIsGoogleChooserOpen(false);
    setLoading(true);
    try {
      // Simulate login with the chosen account
      await login({ 
        provider: 'google', 
        email: account.email,
        name: account.name 
      });
      navigate('/seeker/dashboard');
    } catch (err: any) {
      setError(`Failed to login with Google as ${account.name}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] flex flex-col items-center pt-20 px-4">
      
      {/* Mock Google Chooser Modal */}
      <GoogleAccountChooser 
        isOpen={isGoogleChooserOpen} 
        onClose={() => setIsGoogleChooserOpen(false)} 
        onSelect={onGoogleAccountSelect}
      />

      {/* Logo */}
      <Link to="/" className="flex items-center gap-1 mb-8">
        <span className="text-2xl font-bold text-[#0A66C2]">JOB</span>
        <span className="text-2xl font-bold bg-[#0A66C2] text-white px-1 rounded-sm">finder</span>
      </Link>

      <div className="bg-white rounded-lg border border-[#00000014] p-8 shadow-sm w-full max-w-[400px]">
        <h1 className="text-2xl font-semibold text-[#000000E0] mb-1">Sign in</h1>
        <p className="text-sm text-[#00000099] mb-6">Stay updated on your professional world</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-semibold text-[#00000099]">Email or Phone</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-[#00000099] rounded-md focus:ring-1 focus:ring-[#0A66C2]"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-semibold text-[#00000099]">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 border-[#00000099] rounded-md focus:ring-1 focus:ring-[#0A66C2]"
              required
            />
          </div>

          <Link to="/forgot-password" title="Forgot password link" className="block text-sm font-semibold text-[#0A66C2] hover:underline">
            Forgot password?
          </Link>

          <Button 
            type="submit" 
            className="w-full h-12 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full text-lg font-semibold transition-all mt-4"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-2">
          <div className="h-px bg-[#00000014] flex-1" />
          <span className="text-xs text-[#00000066]">or</span>
          <div className="h-px bg-[#00000014] flex-1" />
        </div>

        <div className="mt-6 space-y-3">
          <Button onClick={() => handleSocialLogin('google')} variant="outline" className="w-full h-10 rounded-full border-[#00000099] text-[#00000099] font-semibold flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>
          <Button onClick={() => handleSocialLogin('linkedin')} variant="outline" className="w-full h-10 rounded-full border-[#00000099] text-[#00000099] font-semibold flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            Continue with LinkedIn
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-[#000000E0]">
          New to JOBfinder?{' '}
          <Link to="/register" className="text-[#0A66C2] font-semibold hover:underline">
            Join now
          </Link>
        </p>
      </div>

    </div>
  );
}
