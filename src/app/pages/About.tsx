import { Link } from 'react-router';
import { Target, Users, Award, Globe, Heart, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';

export function About() {
  const stats = [
    { value: '50K+', label: 'Active Job Seekers' },
    { value: '2K+', label: 'Partner Companies' },
    { value: '10K+', label: 'Jobs Posted' },
    { value: '95%', label: 'Satisfaction Rate' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To revolutionize the job search experience by connecting talented professionals with their dream careers through innovation and technology.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building a supportive community where job seekers and employers can connect meaningfully.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from user experience to customer support.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting talent with opportunities across borders, making the world smaller for job seekers.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about helping people find careers they love and employers find perfect matches.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data security and privacy are our top priorities. We maintain the highest standards of protection.',
    },
  ];

  const team = [
    {
      name: 'Alexandra Chen',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1748346918817-0b1b6b2w=400&f9bab?h=400&fit=crop',
      bio: 'Former HR executive with 15 years of experience in talent acquisition.',
    },
    {
      name: 'Marcus Williams',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1758518731457-5ef826b75b3b?w=400&h=400&fit=crop',
      bio: 'Tech leader with expertise in building scalable platforms.',
    },
    {
      name: 'Sofia Rodriguez',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1770235622528-6ad764804e4c?w=400&h=400&fit=crop',
      bio: 'Product visionary focused on user-centric design.',
    },
    {
      name: 'David Kim',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Operations expert ensuring seamless service delivery.',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gray-50/50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black mb-6">
            About JOBfinder
          </h1>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            We're on a mission to transform how people find jobs and how companies find talent. 
            Join us in creating meaningful career connections.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition-all"
              >
                <div className="text-4xl font-bold tracking-tight text-[#2563EB] mb-2">
                  {stat.value}
                </div>
                <div className="text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-black mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-[#6B7280]">
                <p>
                  JOBfinder was founded in 2023 with a simple idea: job searching shouldn't be painful. 
                  We saw too many talented professionals struggling to find roles that matched their skills, 
                  and companies missing out on amazing candidates.
                </p>
                <p>
                  Our team combines decades of experience in HR, technology, and design to create a platform 
                  that puts people first. We believe in transparency, authenticity, and the power of 
                  meaningful connections.
                </p>
                <p>
                  Today, we're proud to have helped thousands of job seekers find their dream careers 
                  and hundreds of companies build incredible teams.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-8">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                  alt="Our team"
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-black mb-4">
              Our Values
            </h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              These principles guide everything we do at JOBfinder
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div 
                  key={value.title}
                  className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-[#2563EB]" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-black mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[#6B7280]">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-black mb-4">
              Meet Our Team
            </h2>
            <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
              The passionate people behind JOBfinder
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div 
                key={member.name}
                className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition-all"
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold tracking-tight text-black">
                  {member.name}
                </h3>
                <p className="text-[#2563EB] font-medium mb-2">{member.role}</p>
                <p className="text-[#6B7280] text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-3xl p-12 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold tracking-tight text-black mb-4">
                Join Our Journey
              </h2>
              <p className="text-[#6B7280] text-lg mb-8">
                Whether you're looking for your dream job or seeking top talent, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#E5E7EB] text-black">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            {/* Soft decorative background effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#2563EB]/5 rounded-full blur-[100px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
