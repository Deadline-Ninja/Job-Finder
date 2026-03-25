import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import messagesAPI from '../../api/messagesAPI';
import { Search, Send, Paperclip, MoreHorizontal, CheckCheck, Loader2, Info } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { mockMessages } from '../../data/mockData';

interface Message {
  _id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    profilePhoto?: string;
    title?: string;
  }>;
  lastMessage?: {
    text: string;
    createdAt: string;
    sender: string;
  };
  updatedAt: string;
  unreadCount?: number;
}

export function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatIndex, setSelectedChatIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      fetchMessages(conversations[selectedChatIndex]._id);
    }
  }, [selectedChatIndex, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await messagesAPI.getConversations();
      const convs = response.data.conversations || [];
      if (convs.length === 0) {
        setConversations(mockMessages.map(m => ({
          _id: m.id,
          participants: [
            { _id: m.senderId, name: m.senderName, profilePhoto: m.senderAvatar, title: 'Hiring Manager' },
            { _id: 'me', name: 'You' }
          ],
          lastMessage: { text: m.text, createdAt: new Date().toISOString(), sender: m.senderId },
          updatedAt: new Date().toISOString(),
          unreadCount: m.isRead ? 0 : 1
        })));
      } else {
        setConversations(convs);
      }
    } catch (err) {
      setConversations(mockMessages.map(m => ({
        _id: m.id,
        participants: [
          { _id: m.senderId, name: m.senderName, profilePhoto: m.senderAvatar, title: 'Hiring Manager' },
          { _id: 'me', name: 'You' }
        ],
        lastMessage: { text: m.text, createdAt: new Date().toISOString(), sender: m.senderId },
        updatedAt: new Date().toISOString(),
        unreadCount: m.isRead ? 0 : 1
      })));
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await messagesAPI.getMessages(conversationId);
      const msgs = response.data.messages || [];
      if (msgs.length === 0) {
        setMessages([
          { _id: '1', sender: 'them', text: 'Hi! I saw your application and would like to discuss further.', time: '10:00 AM', createdAt: new Date().toISOString() },
          { _id: '2', sender: 'me', text: 'Hello! I would love to chat. What time works for you?', time: '10:15 AM', createdAt: new Date().toISOString() },
          { _id: '3', sender: 'them', text: 'How about tomorrow at 2 PM?', time: '10:20 AM', createdAt: new Date().toISOString() },
        ]);
      } else {
        setMessages(msgs.map((m: any) => ({
          _id: m._id,
          sender: m.sender === 'me' ? 'me' : 'them',
          text: m.text,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: m.createdAt
        })));
      }
    } catch (error) {
      setMessages([
        { _id: '1', sender: 'them', text: 'Hi! I saw your application and would like to discuss further.', time: '10:00 AM', createdAt: new Date().toISOString() },
        { _id: '2', sender: 'me', text: 'Hello! I would love to chat. What time works for you?', time: '10:15 AM', createdAt: new Date().toISOString() },
        { _id: '3', sender: 'them', text: 'How about tomorrow at 2 PM?', time: '10:20 AM', createdAt: new Date().toISOString() },
      ]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    setTimeout(() => {
      const newMsg: Message = {
        _id: Date.now().toString(),
        sender: 'me',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setSending(false);
    }, 500);
  };

  const currentChat = conversations[selectedChatIndex];
  const otherParticipant = currentChat?.participants?.find(p => p._id !== 'me');

  const filteredConversations = conversations.filter(conv => 
    conv.participants?.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout userType="seeker">
      <div className="max-w-[1128px] mx-auto h-[calc(100vh-140px)] min-h-[500px] flex gap-0 bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
        
        {/* Left Side: Conversation List */}
        <div className="w-[320px] lg:w-[400px] border-r border-[#0000000D] flex flex-col h-full">
          <div className="p-4 border-b border-[#0000000D]">
            <h1 className="text-base font-semibold text-[#000000E0] mb-4">Messaging</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00000099]" />
              <Input 
                placeholder="Search messages" 
                className="pl-9 h-9 bg-[#F3F2EF] border-none text-sm rounded-md" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#0A66C2]" /></div>
            ) : (
              filteredConversations.map((conv, index) => {
                const participant = conv.participants.find(p => p._id !== 'me');
                const isSelected = selectedChatIndex === index;
                return (
                  <div 
                    key={conv._id} 
                    onClick={() => setSelectedChatIndex(index)}
                    className={`p-4 flex items-start gap-3 cursor-pointer transition-colors border-l-[3px] ${isSelected ? 'bg-blue-50/50 border-[#0A66C2]' : 'hover:bg-[#F3F2EF] border-transparent'}`}
                  >
                    <img src={participant?.profilePhoto} className="w-12 h-12 rounded-full border border-[#00000014]" alt="" />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-[#0A66C2]' : 'text-[#000000E0]'}`}>{participant?.name}</h4>
                        <span className="text-[10px] text-[#00000099] font-medium">Mar 22</span>
                      </div>
                      <p className={`text-xs truncate ${conv.unreadCount ? 'font-semibold text-[#000000E0]' : 'text-[#00000099]'}`}>
                        {conv.lastMessage?.sender === 'me' ? 'You: ' : ''}{conv.lastMessage?.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div className="flex-1 flex flex-col h-full relative">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#0000000D] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-[#000000E0]">{otherParticipant?.name}</h3>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[11px] text-[#00000099]">{otherParticipant?.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00000099] hover:bg-black/5 rounded-full"><MoreHorizontal className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00000099] hover:bg-black/5 rounded-full"><Info className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white">
                <div className="flex flex-col items-center mb-10 mt-4">
                  <img src={otherParticipant?.profilePhoto} className="w-20 h-20 rounded-full border border-[#00000014] mb-3" alt="" />
                  <h4 className="text-lg font-semibold text-[#000000E0]">{otherParticipant?.name}</h4>
                  <p className="text-xs text-[#00000099] mb-4">{otherParticipant?.title}</p>
                  <Button variant="outline" size="sm" className="rounded-full border-[#0A66C2] text-[#0A66C2] font-semibold h-7 text-[11px] px-4">View profile</Button>
                </div>

                {messages.map((msg, i) => (
                  <div key={msg._id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex flex-col max-w-[80%]">
                      <div className={`p-3 rounded-xl text-sm ${msg.sender === 'me' ? 'bg-[#F3F2EF] text-[#000000E0]' : 'bg-white border border-[#00000014] text-[#000000E0]'}`}>
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-[10px] text-[#00000099] ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        {msg.time} {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-green-500" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[#0000000D] bg-white">
                <div className="flex flex-col gap-2 p-2 rounded-lg bg-[#F8F9FA] border border-[#0000000D]">
                  <Textarea 
                    placeholder="Write a message..." 
                    className="border-none bg-transparent shadow-none resize-none min-h-[60px] text-sm focus:ring-0" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <div className="flex justify-between items-center px-1">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#00000099] hover:bg-black/5 rounded-md"><Paperclip className="w-4 h-4" /></Button>
                    </div>
                    <Button 
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-4 h-8 text-xs font-semibold"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10">
               <div className="w-16 h-16 bg-[#F3F2EF] rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-[#00000014]" />
               </div>
               <h3 className="text-lg font-semibold text-[#000000E0]">Select a chat</h3>
               <p className="text-sm text-[#00000099] max-w-xs">Connecting with people through messages helps you stay organized.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
