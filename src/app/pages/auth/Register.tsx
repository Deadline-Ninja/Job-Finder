import { Link, useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';
import { Briefcase, User, Building2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'seeker'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: string) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      const result = await login({ email: formData.email, password: formData.password });
      if (result.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/seeker/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] flex flex-col items-center pt-10 pb-20 px-4">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-1 mb-8">
        <span className="text-2xl font-bold text-[#0A66C2]">JOB</span>
        <span className="text-2xl font-bold bg-[#0A66C2] text-white px-1 rounded-sm">finder</span>
      </Link>

      <div className="bg-white rounded-lg border border-[#00000014] p-8 shadow-sm w-full max-w-[450px]">
        <h1 className="text-2xl font-semibold text-[#000000E0] mb-1">Make the most of your professional life</h1>
        <p className="text-sm text-[#00000099] mb-8 text-center px-4">Create your account and find your next opportunity.</p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">{error}</span>
          </div>
        )}

        {/* Role Multi-Select (LinkedIn style toggle) */}
        <div className="mb-8">
          <Label className="text-xs font-semibold text-[#00000099] mb-3 block">I want to join as a</Label>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => handleRoleChange('seeker')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'seeker' ? 'border-[#0A66C2] bg-blue-50/50' : 'border-[#00000014] hover:border-[#0A66C2]/50'}`}
            >
              <User className={`w-6 h-6 ${formData.role === 'seeker' ? 'text-[#0A66C2]' : 'text-[#00000066]'}`} />
              <span className={`text-xs font-bold ${formData.role === 'seeker' ? 'text-[#0A66C2]' : 'text-[#00000099]'}`}>Professional</span>
            </button>
            <button 
              type="button"
              onClick={() => handleRoleChange('employer')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'employer' ? 'border-[#0A66C2] bg-blue-50/50' : 'border-[#00000014] hover:border-[#0A66C2]/50'}`}
            >
              <Building2 className={`w-6 h-6 ${formData.role === 'employer' ? 'text-[#0A66C2]' : 'text-[#00000066]'}`} />
              <span className={`text-xs font-bold ${formData.role === 'employer' ? 'text-[#0A66C2]' : 'text-[#00000099]'}`}>Employer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-[#00000099]">Full Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} className="h-11 border-[#00000099] rounded-md focus:ring-1 focus:ring-[#0A66C2]" required />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-[#00000099]">Email Address</Label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} className="h-11 border-[#00000099] rounded-md focus:ring-1 focus:ring-[#0A66C2]" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#00000099]">Password</Label>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} className="h-11 border-[#00000099] rounded-md focus:ring-1 focus:ring-[#0A66C2]" required />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-[#00000099]">Confirm</Label>
              <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="h-11 border-[#00000099] rounded-md focus:ring-1 focus:ring-[#0A66C2]" required />
            </div>
          </div>

          <p className="text-[11px] text-[#00000099] text-center pt-2">
            By clicking Agree & Join, you agree to the JOBfinder <span className="text-[#0A66C2] font-semibold">User Agreement, Privacy Policy,</span> and <span className="text-[#0A66C2] font-semibold">Cookie Policy.</span>
          </p>

          <Button 
            type="submit" 
            className="w-full h-12 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full text-lg font-semibold transition-all mt-4"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Agree & Join'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#000000E0]">
          Already on JOBfinder?{' '}
          <Link to="/login" className="text-[#0A66C2] font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
