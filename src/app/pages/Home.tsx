import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  Search, Building2, Star, Quote, Briefcase, MapPin, 
  Users, TrendingUp, Image as ImageIcon, Video, Calendar, 
  Newspaper, Plus, Info, ChevronRight, Bookmark
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CompanyCard } from '../components/CompanyCard';
import { FeedItem } from '../components/FeedItem';
import { useAuth } from '../hooks/useAuth';
import companiesAPI from '../api/companiesAPI';
import { mockCompanies, mockReviews, mockPosts, Company, Review, Post } from '../data/mockData';

export function Home() {
  const { user } = useAuth() as any;
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [reviews] = useState<Review[]>(mockReviews);
  const [posts] = useState<Post[]>(mockPosts);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let companies = [];
      try {
        const companiesResponse = await companiesAPI.getFeaturedCompanies();
        companies = companiesResponse.data.companies || [];
      } catch (err) {
        companies = mockCompanies;
      }
      setTopCompanies(companies.slice(0, 8) as Company[]);
    } catch (error) {
      setTopCompanies(mockCompanies.slice(0, 8));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
        navigate(`/jobs?search=${searchTerm}`);
    } else {
        navigate('/login');
    }
  };

  // --- Authenticated Layout (Feed) ---
  if (user) {
    return (
      <div className="bg-[#F4F2EE] pb-12">
        <div className="max-w-[1128px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-lg border border-[#00000014] overflow-hidden shadow-sm">
              <div className="h-14 bg-[#A0B4B7]" />
              <div className="px-3 pb-4">
                <div className="flex justify-center -mt-8 mb-3">
                  <img 
                    src={user.profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'} 
                    alt={user.name} 
                    className="w-18 h-18 rounded-full border-2 border-white object-cover shadow-sm bg-white"
                  />
                </div>
                <div className="text-center">
                  <Link to={user.role === 'employer' ? '/employer/settings' : '/seeker/profile'} className="hover:underline">
                    <h2 className="text-base font-semibold text-[#000000E0]">{user.name}</h2>
                  </Link>
                  <p className="text-xs text-[#00000099] mt-1">{user.role === 'employer' ? 'Hiring at ' + user.companyName : 'Aspiring Professional'}</p>
                </div>
              </div>
              <div className="border-t border-[#0000000D] py-3">
                <div className="px-3 py-1 hover:bg-[#F3F2EF] cursor-pointer flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#00000099] font-semibold">Connections</span>
                    <span className="text-xs font-semibold text-[#000000E0] group-hover:text-[#0A66C2]">428</span>
                  </div>
                </div>
                <div className="px-3 py-1 hover:bg-[#F3F2EF] cursor-pointer group mt-1">
                  <span className="text-[10px] text-[#00000099] font-semibold">Grow your network</span>
                </div>
              </div>
              <div className="border-t border-[#0000000D] p-3 hover:bg-[#F3F2EF] cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#00000099]" />
                    <span className="text-xs font-semibold text-[#000000E0] group-hover:text-[#0A66C2]">My items</span>
                  </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-[#00000014] p-3 shadow-sm sticky top-20">
               <h3 className="text-xs font-semibold text-[#000000E0] mb-3">Recent</h3>
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00000099] hover:bg-[#F3F2EF] p-1.5 rounded-sm cursor-pointer">
                    <Users className="w-3.5 h-3.5" />
                    <span>Nepal Developers</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00000099] hover:bg-[#F3F2EF] p-1.5 rounded-sm cursor-pointer">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Next.js Community</span>
                  </div>
               </div>
               <div className="mt-4 pt-3 border-t border-[#0000000D]">
                  <p className="text-xs font-bold text-[#0A66C2] hover:underline cursor-pointer">Groups</p>
                  <div className="flex justify-between items-center mt-2 group cursor-pointer hover:bg-[#F3F2EF] p-1.5 rounded-sm">
                    <p className="text-xs font-bold text-[#0A66C2]">Events</p>
                    <Plus className="w-4 h-4 text-[#00000099] group-hover:text-black" />
                  </div>
                  <p className="text-xs font-bold text-[#0A66C2] hover:underline cursor-pointer mt-2">Followed Hashtags</p>
               </div>
            </div>
          </div>

          {/* Center Column (Feed) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Start a Post */}
            <div className="bg-white rounded-lg border border-[#00000014] p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src={user.profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <button className="flex-1 text-left px-4 h-12 border border-[#0000004D] rounded-full hover:bg-black/5 transition-colors text-sm font-semibold text-[#00000099]">
                  Start a post
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 px-2">
                <button className="flex items-center gap-2 text-[#0A66C2] hover:bg-black/5 px-2 py-3 rounded-md transition-colors">
                  <ImageIcon className="w-5 h-5 text-[#378FE9]" />
                  <span className="text-sm font-semibold text-[#00000099]">Photo</span>
                </button>
                <button className="flex items-center gap-2 text-[#0A66C2] hover:bg-black/5 px-2 py-3 rounded-md transition-colors">
                  <Video className="w-5 h-5 text-[#5F9B41]" />
                  <span className="text-sm font-semibold text-[#00000099]">Video</span>
                </button>
                <button className="flex items-center gap-2 text-[#0A66C2] hover:bg-black/5 px-2 py-3 rounded-md transition-colors">
                  <Calendar className="w-5 h-5 text-[#C37D16]" />
                  <span className="text-sm font-semibold text-[#00000099]">Event</span>
                </button>
                <button className="flex items-center gap-2 text-[#0A66C2] hover:bg-black/5 px-2 py-3 rounded-md transition-colors">
                  <Newspaper className="w-5 h-5 text-[#E16745]" />
                  <span className="text-sm font-semibold text-[#00000099]">Write article</span>
                </button>
              </div>
            </div>

            {/* Sort Divider */}
            <div className="flex items-center gap-1 my-2">
              <hr className="flex-1 border-[#00000014]" />
              <div className="flex items-center gap-1 text-[10px] text-[#00000099]">
                <span>Sort by:</span>
                <button className="flex items-center gap-0.5 font-bold text-[#000000E0]">
                  Top <ChevronRight className="w-3 h-3 rotate-90" />
                </button>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map(post => (
                <FeedItem key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg border border-[#00000014] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#000000E0]">Add to your feed</h3>
                <Info className="w-4 h-4 text-[#00000099] cursor-pointer" />
              </div>
              <div className="space-y-4">
                {topCompanies.slice(0, 3).map(company => (
                  <div key={company.id} className="flex items-start gap-3">
                    <img src={company.logo} alt={company.name} className="w-12 h-12 object-cover rounded-none" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#000000E0] truncate">{company.name}</h4>
                      <p className="text-xs text-[#00000099] line-clamp-1">{company.industry} • Company</p>
                      <Button variant="outline" className="h-8 rounded-full border-[#00000099] text-[#00000099] mt-2 font-semibold hover:bg-black/5 px-4 text-xs">
                        <Plus className="w-4 h-4 mr-1" /> Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/companies" className="flex items-center gap-1 text-sm font-semibold text-[#00000099] mt-6 hover:bg-[#F3F2EF] p-1 rounded-sm w-fit">
                View all recommendations <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-[#00000014] p-4 shadow-sm sticky top-20">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-[#000000E0]">Today's Top Courses</h3>
                  <Info className="w-3.5 h-3.5 text-[#00000099]" />
               </div>
               <div className="space-y-3">
                  <div className="group cursor-pointer">
                    <p className="text-xs font-semibold text-[#000000E0] group-hover:text-[#0A66C2]">React Patterns for Scale</p>
                    <p className="text-[10px] text-[#00000099]">428 viewers</p>
                  </div>
                  <div className="group cursor-pointer">
                    <p className="text-xs font-semibold text-[#000000E0] group-hover:text-[#0A66C2]">DevOps in Nepal: 2024</p>
                    <p className="text-[10px] text-[#00000099]">1.2k viewers</p>
                  </div>
                  <div className="group cursor-pointer">
                    <p className="text-xs font-semibold text-[#000000E0] group-hover:text-[#0A66C2]">Banking Security Basics</p>
                    <p className="text-[10px] text-[#00000099]">856 viewers</p>
                  </div>
               </div>
               <div className="mt-4 pt-4 border-t border-[#0000000D] flex flex-wrap gap-x-4 gap-y-1 justify-center text-[11px] text-[#00000099]">
                  <span className="hover:underline cursor-pointer">About</span>
                  <span className="hover:underline cursor-pointer">Accessibility</span>
                  <span className="hover:underline cursor-pointer">Privacy & Terms</span>
                  <p className="w-full text-center mt-2 flex items-center justify-center gap-1 font-bold text-[#0A66C2]">
                    <Briefcase className="w-3 h-3" /> JOBfinder Corporation © 2024
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- Unauthenticated Layout (Landing) ---
  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      {/* Hero Section */}
      <section className="bg-white py-20 border-b border-[#00000014]">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-normal text-[#000000E0] mb-8 leading-[1.1]">
                Find your next professional opportunity in Nepal
              </h1>
              
              <div className="space-y-6 max-w-md">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00000099]" />
                    <Input 
                      placeholder="Job title, skills, or company"
                      className="pl-12 h-14 text-lg border-[#00000099] rounded-md focus:ring-1 focus:ring-[#0A66C2]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 text-xl font-semibold bg-[#0A66C2] hover:bg-[#1D4ED8] text-white rounded-full transition-all">
                    Search Jobs
                  </Button>
                </form>
                <p className="text-sm text-[#00000099]">Sign in to access 1,000+ active job openings</p>
              </div>
            </div>
            
            <div className="hidden lg:block w-[500px]">
              <img 
                src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktm5s4" 
                alt="Community" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-[1128px] mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { label: 'Active Jobs', value: '2,500+', icon: Briefcase },
                { label: 'Companies', value: '450+', icon: Building2 },
                { label: 'Professionals', value: '50k+', icon: Users },
                { label: 'Locations', value: '15+', icon: MapPin },
            ].map((stat, i) => (
                <div key={i} className="text-center group">
                    <div className="text-3xl font-bold text-[#000000E0] mb-1 group-hover:text-[#0A66C2] transition-colors">{stat.value}</div>
                    <div className="text-sm text-[#00000099] font-medium">{stat.label}</div>
                </div>
            ))}
        </div>
      </section>

      {/* Connected Companies Section */}
      <section className="max-w-[1128px] mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-semibold text-[#000000E0]">Leading Companies In Nepal</h2>
            <p className="text-[#00000099] mt-1">Directly connected with JOBfinder</p>
          </div>
          <Link to="/register" className="text-[#0A66C2] font-bold hover:underline">See all companies</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topCompanies.map(company => (
            <div key={company.id} className="transition-transform hover:-translate-y-1">
               <CompanyCard company={company} />
            </div>
          ))}
        </div>
      </section>

      {/* Member Reviews Section */}
      <section className="bg-white py-20 border-y border-[#00000014]">
        <div className="max-w-[1128px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-[#000000E0]">Hear from our members</h2>
            <p className="text-[#00000099] mt-2">Professionals who found their dream careers through JOBfinder.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-[#F8F9FA] p-8 rounded-xl relative group">
                <Quote className="absolute top-4 right-6 w-10 h-10 text-[#0000000D] group-hover:text-[#0A66C2]/10 transition-colors" />
                <div className="flex items-center gap-3 mb-6">
                   <img src={review.userAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                   <div>
                      <h4 className="font-bold text-[#000000E0] text-sm">{review.userName}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                      </div>
                   </div>
                </div>
                <p className="text-[#00000099] text-sm italic leading-relaxed mb-4">"{review.comment}"</p>
                <div className="pt-4 border-t border-[#0000000D]">
                   <span className="text-[10px] font-bold text-[#0A66C2] uppercase tracking-wider">{review.companyName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-semibold text-[#000000E0] mb-6">Join your professional community today</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/register">
                <Button size="lg" className="h-14 px-10 rounded-full bg-[#0A66C2] text-white font-bold text-lg">Get Started</Button>
             </Link>
             <Link to="/login">
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full border-[#0A66C2] text-[#0A66C2] font-bold text-lg hover:bg-blue-50">Sign In</Button>
             </Link>
          </div>
      </section>

    </div>
  );
}
