import { BookOpen, TrendingUp, Search, ChevronRight, Clock, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router';

export function Articles() {
  const trendingArticles = [
    {
      id: 1,
      title: "The Future of FinTech in Nepal: What to Expect in 2025",
      authorName: "Sagar Sharma",
      authorRole: "Tech Lead at F1Soft",
      date: "10 hours ago",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      title: "How e-commerce is transforming local businesses",
      authorName: "Anjali Rai",
      authorRole: "Strategy Director at Daraz",
      date: "1 day ago",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Building Scalable React Native Apps",
      authorName: "Binesh Kumar",
      authorRole: "Mobile Developer",
      date: "2 days ago",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop"
    }
  ];

  const topNews = [
    { title: "Nepal IT exports reach record high", readers: "14.2k readers" },
    { title: "New AI regulations proposed", readers: "8.5k readers" },
    { title: "Tech summits returning to Kathmandu", readers: "5.1k readers" },
    { title: "Remote work trends stabilizing", readers: "12k readers" },
    { title: "Startups securing regional funding", readers: "3.2k readers" }
  ];

  return (
    <div className="min-h-screen bg-[#F4F2EE] pt-14 flex flex-col">
      {/* Header Search */}
      <div className="bg-white border-b border-[#00000014] py-4">
        <div className="max-w-[1128px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <h1 className="text-xl font-normal text-[#000000E0]">Stay ahead with professional news</h1>
          </div>
          <div className="relative w-full md:w-[400px]">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00000099]" />
             <Input 
                placeholder="Search articles on JOBfinder..." 
                className="pl-10 h-10 bg-[#EDF3F8] border-none rounded-md focus:ring-2 focus:ring-black text-sm w-full"
             />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1128px] mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content: Trending Articles */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 mb-4">
             <TrendingUp className="w-5 h-5 text-[#057642]" />
             <h2 className="text-xl font-semibold text-[#000000E0]">Trending Articles</h2>
          </div>
          
          <div className="space-y-4">
             {trendingArticles.map(article => (
               <div key={article.id} className="bg-white rounded-lg border border-[#00000014] overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow cursor-pointer">
                  <div className="sm:w-64 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden group">
                     <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-1">
                     <div>
                       <div className="flex items-center gap-2 text-xs text-[#00000099] font-medium mb-3">
                         <span>{article.date}</span>
                         <span className="w-1 h-1 rounded-full bg-[#0000004D]" />
                         <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                       </div>
                       <h3 className="text-lg font-semibold text-[#000000E0] mb-2 hover:text-[#0A66C2] hover:underline">{article.title}</h3>
                       <p className="text-sm text-[#00000099] line-clamp-2">Dive deep into the insights provided by our industry experts and understand the shifting landscape...</p>
                     </div>
                     <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                             {article.authorName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#000000E0] hover:text-[#0A66C2]">{article.authorName}</p>
                            <p className="text-[10px] text-[#00000099]">{article.authorRole}</p>
                          </div>
                        </div>
                        <Link to="/login">
                           <Button variant="ghost" size="sm" className="hidden sm:flex text-[#00000099] hover:bg-black/5 rounded-full font-semibold">
                             <UserPlus className="w-4 h-4 mr-2" /> Follow
                           </Button>
                        </Link>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Sidebar: News & Prompts */}
        <div className="lg:col-span-4 space-y-4">
           {/* Top News */}
           <div className="bg-white rounded-lg border border-[#00000014] p-4 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-base font-semibold text-[#000000E0]">JOBfinder News</h3>
               <BookOpen className="w-5 h-5 text-[#00000099]" />
             </div>
             <ul className="space-y-3">
               {topNews.map((news, i) => (
                 <li key={i} className="group cursor-pointer">
                    <div className="flex items-start gap-2">
                       <span className="text-[#000000E0] font-bold text-xs mt-0.5">•</span>
                       <div>
                         <p className="text-sm font-semibold text-[#000000E0] group-hover:text-[#0A66C2] group-hover:underline line-clamp-2">
                           {news.title}
                         </p>
                         <p className="text-xs text-[#00000099] mt-0.5">{news.readers}</p>
                       </div>
                    </div>
                 </li>
               ))}
             </ul>
             <Button variant="ghost" className="w-full mt-4 text-xs font-semibold text-[#00000099] bg-[#F3F2EF] hover:bg-black/10 rounded-full h-8 flex items-center justify-center">
               Show more <ChevronRight className="w-4 h-4 rotate-90" />
             </Button>
           </div>

           {/* Call to Action */}
           <div className="bg-white rounded-lg border border-[#00000014] p-6 shadow-sm text-center sticky top-20">
             <h3 className="text-lg font-semibold text-[#000000E0] mb-2 border-b border-[#0000000D] pb-3">Join the conversation</h3>
             <p className="text-sm text-[#00000099] mb-6">Write an article, share an update, and connect with people who can help you grow.</p>
             <Link to="/login">
               <Button className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full font-bold h-10">Sign in to write</Button>
             </Link>
             <Link to="/register">
               <Button variant="outline" className="w-full mt-3 rounded-full border-black text-[#000000E0] hover:bg-black/5 font-semibold h-10">Join now</Button>
             </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
