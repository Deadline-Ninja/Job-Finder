import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'sonner';

export function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    // Simulation: Success if OTP matches 123456
    setTimeout(() => {
      setLoading(false);
      if (otp.join('') === '123456') {
        toast.success("Identity Verified! Matrix node activated.");
        navigate('/login');
      } else {
        toast.error("Invalid OTP. Signal rejected.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full border-4 border-black p-10 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-black text-white">
            <ShieldCheck className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-2">Gate_Keeper</h1>
        <p className="text-black/60 font-bold mb-8">
          A secure OTP has been transmitted to <span className="text-black">{email}</span>. Use it to activate your node.
        </p>

        <div className="flex gap-2 justify-between mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-12 h-16 border-4 border-black text-center text-2xl font-black bg-gray-50 focus:bg-white focus:outline-none"
            />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleVerify}
            disabled={loading || otp.some(d => !d)}
            className="w-full h-16 bg-black text-white rounded-none font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition-all"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Verify Node <ArrowRight className="w-5 h-5" /></>}
          </Button>

          <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-black/40">
            {timer > 0 ? (
              <span>Link expires in {timer}s</span>
            ) : (
              <button onClick={() => setTimer(60)} className="text-black flex items-center gap-1 hover:underline">
                <RefreshCw className="w-3 h-3" /> Resend Protocol
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
