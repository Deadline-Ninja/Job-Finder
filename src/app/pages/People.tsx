import { Search, MapPin, Building2, Briefcase, Plus, Users, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router';

export function People() {
  const professionals = [
    {
      id: 1,
      name: "Shruti Ranjan",
      headline: "Senior Software Engineer @ F1Soft | React | Node.js",
      location: "Kathmandu, NP",
      connections: "500+",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      company: "F1Soft International",
      industry: "Information Technology"
    },
    {
      id: 2,
      name: "Ramesh Sharma",
      headline: "Product Manager | Ex-Daraz | Agile Enthusiast",
      location: "Lalitpur, NP",
      connections: "342",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      company: "Foodmandu",
      industry: "Internet"
    },
    {
      id: 3,
      name: "Anita KC",
      headline: "Data Scientist passionate about AI & Machine Learning",
      location: "Kathmandu, NP",
      connections: "500+",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      company: "CloudFactory",
      industry: "Information Technology"
    },
    {
      id: 4,
      name: "Bipin Thapa",
      headline: "UX/UI Designer | Creating delightful experiences",
      location: "Pokhara, NP",
      connections: "189",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      company: "Leapfrog Technology",
      industry: "Design"
    },
    {
      id: 5,
      name: "Suman Shrestha",
      headline: "DevOps Engineer | AWS Certified Solutions Architect",
      location: "Kathmandu, NP",
      connections: "421",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      company: "Cotiviti Nepal",
      industry: "Information Technology"
    },
    {
      id: 6,
      name: "Pooja Gurung",
      headline: "HR Manager | Talent Acquisition | Employer Branding",
      location: "Kathmandu, NP",
      connections: "500+",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      company: "Ncell",
      industry: "Telecommunications"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F2EE] pt-14">
      {/* Search Header */}
      <div className="bg-white border-b border-[#00000014] py-4 sticky top-14 z-20 shadow-sm">
        <div className="max-w-[1128px] mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00000099]" />
            <Input 
              placeholder="Search by name, title, or company..." 
              className="pl-10 h-10 border-[#00000099] rounded-md focus:ring-2 focus:ring-[#0A66C2] text-sm w-full"
            />
          </div>
          <div className="flex-1 w-full relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00000099]" />
            <Input 
              placeholder="Location..." 
              className="pl-10 h-10 border-[#00000099] rounded-md focus:ring-2 focus:ring-[#0A66C2] text-sm w-full"
            />
          </div>
          <Button className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-8 h-10 font-bold w-full md:w-auto">
            Find People
          </Button>
        </div>
      </div>

      <div className="max-w-[1128px] mx-auto px-4 flex flex-col md:flex-row gap-6 py-6">
        
        {/* Left Sidebar Filters */}
        <div className="w-full md:w-[300px] flex-shrink-0 space-y-4">
          <div className="bg-white rounded-lg border border-[#00000014] p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#000000E0] mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter Professionals
            </h3>
            
            <div className="space-y-4">
               <div>
                  <h4 className="text-xs font-semibold text-[#000000E0] mb-2 uppercase tracking-wide">Industry</h4>
                  <div className="space-y-2">
                     <label className="flex items-center gap-2 text-sm text-[#00000099] cursor-pointer hover:text-black">
                        <input type="checkbox" className="w-4 h-4 rounded-sm border-[#00000099] accent-[#0A66C2]" /> Information Technology
                     </label>
                     <label className="flex items-center gap-2 text-sm text-[#00000099] cursor-pointer hover:text-black">
                        <input type="checkbox" className="w-4 h-4 rounded-sm border-[#00000099] accent-[#0A66C2]" /> Financial Services
                     </label>
                     <label className="flex items-center gap-2 text-sm text-[#00000099] cursor-pointer hover:text-black">
                        <input type="checkbox" className="w-4 h-4 rounded-sm border-[#00000099] accent-[#0A66C2]" /> E-commerce
                     </label>
                  </div>
               </div>
               
               <hr className="border-[#0000000D]" />
               
               <div>
                  <h4 className="text-xs font-semibold text-[#000000E0] mb-2 uppercase tracking-wide">Current Company</h4>
                  <div className="space-y-2">
                     <label className="flex items-center gap-2 text-sm text-[#00000099] cursor-pointer hover:text-black">
                        <input type="checkbox" className="w-4 h-4 rounded-sm border-[#00000099] accent-[#0A66C2]" /> F1Soft International
                     </label>
                     <label className="flex items-center gap-2 text-sm text-[#00000099] cursor-pointer hover:text-black">
                        <input type="checkbox" className="w-4 h-4 rounded-sm border-[#00000099] accent-[#0A66C2]" /> Daraz Nepal
                     </label>
                     <label className="flex items-center gap-2 text-sm text-[#00000099] cursor-pointer hover:text-black">
                        <input type="checkbox" className="w-4 h-4 rounded-sm border-[#00000099] accent-[#0A66C2]" /> CloudFactory
                     </label>
                  </div>
               </div>
            </div>
            
            <Link to="/login" className="block mt-6">
               <Button variant="outline" className="w-full text-[#0A66C2] border-[#0A66C2] rounded-full hover:bg-blue-50 font-bold h-8 text-xs">
                 Sign in to view all
               </Button>
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm mb-6 flex items-center justify-between">
            <div>
               <h2 className="text-xl font-normal text-[#000000E0]">Professionals in your network</h2>
               <p className="text-sm text-[#00000099] mt-1">Connect with over 1M+ professionals around the world.</p>
            </div>
            <Users className="w-10 h-10 text-[#00000024] hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionals.map(person => (
               <div key={person.id} className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow h-full">
                  <div className="h-16 bg-[#A0B4B7] relative">
                     <div className="absolute -bottom-8 left-4 w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-white shadow-sm">
                       <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                     </div>
                  </div>
                  <div className="pt-10 px-4 pb-4 flex flex-col flex-1">
                     <h3 className="text-base font-semibold text-[#000000E0] hover:text-[#0A66C2] hover:underline cursor-pointer">{person.name}</h3>
                     <p className="text-sm text-[#000000E0] mt-1 line-clamp-2 leading-tight flex-1">{person.headline}</p>
                     
                     <div className="mt-4 space-y-1">
                        <p className="text-xs text-[#00000099] flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {person.location}
                        </p>
                        <p className="text-xs text-[#00000099] flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {person.company}
                        </p>
                        <p className="text-xs text-[#00000099] flex items-center gap-1 mt-2">
                          <Users className="w-3 h-3" /> {person.connections} connections
                        </p>
                     </div>
                     
                     <Link to="/login" className="mt-5">
                       <Button variant="outline" className="w-full h-8 rounded-full border-[#0A66C2] text-[#0A66C2] font-semibold hover:bg-blue-50 text-xs shadow-sm">
                          <Plus className="w-4 h-4 mr-1" /> Connect
                       </Button>
                     </Link>
                  </div>
               </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
             <Link to="/login">
                <Button className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-8 h-10 font-bold shadow-sm">
                  Sign in to discover more
                </Button>
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
