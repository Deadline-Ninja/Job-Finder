import React from 'react';
import { User, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoogleAccountChooserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: { name: string, email: string }) => void;
}

export function GoogleAccountChooser({ isOpen, onClose, onSelect }: GoogleAccountChooserProps) {
  const accounts = [
    { name: 'Aayush Shrestha', email: 'aayush.shrestha@gmail.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aayush' },
    { name: 'Sita Kumari', email: 'sita.k@gmail.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sita' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl w-full max-w-[400px] overflow-hidden"
            >
              {/* Google Header */}
              <div className="p-6 text-center border-b border-gray-100">
                 <div className="flex justify-center mb-4">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                 </div>
                 <h2 className="text-xl font-medium text-gray-800">Choose an account</h2>
                 <p className="text-sm text-gray-500 mt-1">to continue to <span className="text-[#0A66C2] font-semibold">JOBfinder</span></p>
              </div>

              {/* Account List */}
              <div className="max-h-[300px] overflow-y-auto">
                {accounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(account)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left group"
                  >
                    <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full bg-gray-100" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{account.name}</p>
                      <p className="text-xs text-gray-500">{account.email}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-gray-200 group-hover:border-[#4285F4] transition-colors" />
                  </button>
                ))}
                
                <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left group">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Use another account</span>
                </button>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50/50">
                <div className="flex items-start gap-3 text-[11px] text-gray-500 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5" />
                  <p>
                    To continue, Google will share your name, email address, language preference, and profile picture with JOBfinder. 
                    Before using this app, you can review its <span className="text-blue-600 cursor-pointer hover:underline">privacy policy</span> and <span className="text-blue-600 cursor-pointer hover:underline">terms of service</span>.
                  </p>
                </div>
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
