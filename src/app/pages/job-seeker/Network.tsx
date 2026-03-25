import { useState } from 'react';
import { Users, UserPlus, MoreHorizontal, Settings, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function Network() {
  const [connections] = useState(428);
  
  const suggestions = [
    { id: 1, name: 'Binesh Kumar', title: 'Full Stack Developer', company: 'F1Soft', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', mutual: 12 },
    { id: 2, name: 'Sareena Lamichhane', title: 'UX Designer', company: 'Daraz', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', mutual: 8 },
    { id: 3, name: 'Rahul Shrestha', title: 'Product Manager', company: 'Foodmandu', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', mutual: 5 },
    { id: 4, name: 'Manisha KC', title: 'Data Scientist', company: 'CloudFactory', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', mutual: 15 },
  ];

  return (
    <div className="bg-[#F4F2EE] min-h-screen">
      <div className="max-w-[1128px] mx-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#0000000D]">
              <h2 className="text-base font-semibold text-[#000000E0]">Manage my network</h2>
            </div>
            <div className="p-2 space-y-1">
              <div className="flex items-center justify-between p-3 hover:bg-[#F3F2EF] cursor-pointer rounded-sm group">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#00000099]" />
                  <span className="text-sm text-[#00000099] font-semibold group-hover:underline">Connections</span>
                </div>
                <span className="text-sm text-[#00000099]">{connections}</span>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-[#F3F2EF] cursor-pointer rounded-sm group">
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-[#00000099]" />
                  <span className="text-sm text-[#00000099] font-semibold group-hover:underline">Following & Followers</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 hover:bg-[#F3F2EF] cursor-pointer rounded-sm group">
                <div className="flex items-center gap-3 text-[#00000099]">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-semibold group-hover:underline">Groups</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#0000000D] flex items-center justify-between group cursor-pointer hover:bg-[#F3F2EF]">
                <span className="text-sm text-[#00000099] font-semibold">Show less</span>
                <ChevronRight className="w-4 h-4 text-[#00000099] rotate-90" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Invitations Section */}
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
             <div className="p-4 border-b border-[#0000000D] flex justify-between items-center">
                <h2 className="text-base font-semibold text-[#000000E0]">Invitations</h2>
                <Button variant="ghost" className="text-sm font-bold text-[#00000099] hover:bg-black/5">See all</Button>
             </div>
             <div className="p-4 flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-[#F3F2EF] rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="w-8 h-8 text-[#0000004D]" />
                </div>
                <h3 className="text-lg font-semibold text-[#000000E0]">No pending invitations</h3>
                <p className="text-sm text-[#00000099] max-w-xs mt-1">When you receive an invitation to connect, it will appear here.</p>
             </div>
          </div>

          {/* Suggestions Section */}
          <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
             <div className="p-4 border-b border-[#0000000D] flex justify-between items-center">
                <h2 className="text-base font-semibold text-[#000000E0]">People you may know from your city</h2>
                <Button variant="ghost" className="text-sm font-bold text-[#00000099] hover:bg-black/5">See all</Button>
             </div>
             <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {suggestions.map(person => (
                  <div key={person.id} className="border border-[#00000014] rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full">
                    <div className="h-16 bg-[#A0B4B7] relative">
                      <button className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="px-3 pb-4 flex flex-col flex-1">
                      <div className="flex justify-center -mt-8 mb-2">
                         <img src={person.avatar} alt="" className="w-16 h-16 rounded-full border-2 border-white object-cover" />
                      </div>
                      <div className="text-center flex-1">
                         <h4 className="text-sm font-semibold text-[#000000E0] hover:underline cursor-pointer">{person.name}</h4>
                         <p className="text-xs text-[#00000099] mt-1 line-clamp-2">{person.title} at {person.company}</p>
                         <p className="text-[10px] text-[#00000099] mt-2 flex items-center justify-center gap-1">
                           <Users className="w-3 h-3" /> {person.mutual} mutual connections
                         </p>
                      </div>
                      <Button variant="outline" className="w-full h-8 rounded-full border-[#0A66C2] text-[#0A66C2] font-semibold hover:bg-blue-50 mt-4">
                        Connect
                      </Button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
