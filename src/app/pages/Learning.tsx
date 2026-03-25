import { Search, Star, PlayCircle, Users, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link } from 'react-router';

export function Learning() {
  const topCourses = [
    {
      id: 1,
      title: "Advanced React.js with TypeScript",
      instructor: "Binesh Kumar",
      viewers: "12,400",
      rating: 4.8,
      duration: "4h 15m",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
      tag: "Popular"
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      instructor: "Sareena Lamichhane",
      viewers: "8,920",
      rating: 4.6,
      duration: "3h 40m",
      image: "https://images.unsplash.com/photo-1432888117426-14dfcbfddbb6?w=600&h=400&fit=crop",
      tag: "Trending"
    },
    {
      id: 3,
      title: "Project Management using Agile",
      instructor: "Rahul Shrestha",
      viewers: "21,500",
      rating: 4.9,
      duration: "6h 20m",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop",
      tag: "Essential"
    },
    {
      id: 4,
      title: "Data Science for Beginners",
      instructor: "Manisha KC",
      viewers: "5,400",
      rating: 4.7,
      duration: "5h 10m",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tag: "New"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F2EE] pt-14">
      {/* Search Header */}
      <div className="bg-[#0A66C2] py-12 text-center text-white">
        <div className="max-w-[1128px] mx-auto px-4">
           <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-90" />
           <h1 className="text-3xl sm:text-4xl font-normal mb-8 leading-tight">
             Keep learning in the moments that matter
           </h1>
           <div className="relative max-w-2xl mx-auto shadow-lg">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00000099]" />
             <Input 
                 placeholder="Search for skills, subjects, or software..." 
                 className="pl-12 h-12 bg-white border-none rounded-sm focus:ring-2 focus:ring-white text-black text-sm w-full font-semibold"
             />
           </div>
        </div>
      </div>

      <div className="max-w-[1128px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
           <div className="bg-white rounded-lg border border-[#00000014] p-5 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <div>
                   <h2 className="text-lg font-semibold text-[#000000E0]">Top picks for you</h2>
                   <p className="text-sm text-[#00000099] mt-0.5">Based on the skills you want to learn</p>
                </div>
                <Button variant="ghost" className="text-sm font-bold text-[#0A66C2] hover:bg-blue-50">See all</Button>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topCourses.map(course => (
                   <div key={course.id} className="group cursor-pointer border border-[#0000000D] rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                      <div className="h-40 relative bg-gray-100 overflow-hidden">
                         <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="w-12 h-12 text-white" />
                         </div>
                         <div className="absolute top-2 left-2 bg-[#F6A000] text-black text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                            {course.tag}
                         </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1 bg-white">
                         <h3 className="text-base font-semibold text-[#000000E0] group-hover:text-[#0A66C2] group-hover:underline line-clamp-2 min-h-[46px]">{course.title}</h3>
                         <p className="text-xs text-[#00000099] font-medium mt-1">By: {course.instructor}</p>
                         
                         <div className="mt-4 flex flex-col gap-1 text-[11px] text-[#00000099] font-bold">
                            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {course.viewers} viewers</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                            <span className="flex items-center gap-1.5 text-[#000000E0]">
                              <div className="flex text-yellow-500"><Star className="w-3.5 h-3.5 fill-current" /></div> {course.rating}
                            </span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
           </div>

           <div className="bg-white rounded-lg border border-[#00000014] p-8 shadow-sm text-center">
              <h3 className="text-xl font-semibold text-[#000000E0] mb-2">Advance your career with JOBfinder Learning</h3>
              <p className="text-[#00000099] mb-6 max-w-xl mx-auto">Get access to 16,000+ expert-led courses. Cancel anytime.</p>
              <Link to="/login">
                <Button className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full px-8 h-10 font-bold shadow-sm">
                  Start my free month
                </Button>
              </Link>
           </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-4">
           <div className="bg-white rounded-lg border border-[#00000014] p-5 shadow-sm sticky top-20">
              <h3 className="text-sm font-semibold text-[#000000E0] mb-4">Browse by category</h3>
              <ul className="space-y-1">
                 <li className="text-sm font-semibold text-[#0A66C2] hover:underline cursor-pointer py-1.5 flex items-center justify-between group">
                   Business <ChevronRight className="w-4 h-4 text-[#00000099] group-hover:text-black" />
                 </li>
                 <li className="text-sm font-semibold text-[#0A66C2] hover:underline cursor-pointer py-1.5 flex items-center justify-between group">
                   Creative <ChevronRight className="w-4 h-4 text-[#00000099] group-hover:text-black" />
                 </li>
                 <li className="text-sm font-semibold text-[#0A66C2] hover:underline cursor-pointer py-1.5 flex items-center justify-between group">
                   Technology <ChevronRight className="w-4 h-4 text-[#00000099] group-hover:text-black" />
                 </li>
                 <li className="text-sm font-semibold text-[#0A66C2] hover:underline cursor-pointer py-1.5 flex items-center justify-between group">
                   Certifications <ChevronRight className="w-4 h-4 text-[#00000099] group-hover:text-black" />
                 </li>
              </ul>
              
              <hr className="border-[#0000000D] my-4" />
              
              <Link to="/login" className="block text-center text-xs font-semibold text-[#00000099] hover:underline">
                 Show all categories
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
