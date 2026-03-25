import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: string;
  time: string;
  sender: 'me' | 'them';
  isRead?: boolean;
}

export function MessageBubble({ message, time, sender, isRead = false }: MessageBubbleProps) {
  const isMe = sender === 'me';
  
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[70%] p-4 rounded-2xl animate-fade-in ${
          isMe 
            ? 'bg-blue-50 text-white' 
            : 'bg-white border border-[#000000]/10 text-black'
        } shadow-md`}
      >
        <p className="leading-relaxed">{message}</p>
        <div className={`flex items-center justify-end gap-1 mt-2 text-xs ${
          isMe ? 'text-white/70' : 'text-[#6B7280]'
        }`}>
          <span>{time}</span>
          {isMe && (
            isRead ? (
              <CheckCheck className="w-3 h-3" />
            ) : (
              <Check className="w-3 h-3" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
