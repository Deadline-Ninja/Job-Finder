import { useState } from 'react';
import { Link } from 'react-router';
import { Search, MessageCircle, Phone, Mail, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click the "Sign Up" button in the top right corner of the homepage. You can register as a job seeker or an employer. Fill in your details, verify your email, and you\'re ready to go!',
    },
    {
      question: 'How do I apply for a job?',
      answer: 'Browse jobs on our platform, click on a job that interests you, and click the "Apply Now" button. Make sure your profile is complete before applying for best results.',
    },
    {
      question: 'Is JOBfinder free to use?',
      answer: 'Yes, JOBfinder is free for job seekers! We offer a Basic plan with essential features. For advanced features like unlimited applications and resume building, check our Professional plan.',
    },
    {
      question: 'How do I post a job as an employer?',
      answer: 'Create an employer account, navigate to your dashboard, and click "Post a Job". Fill in the job details, and your listing will be live within minutes.',
    },
    {
      question: 'How can I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a link to reset your password.',
    },
    {
      question: 'How do I contact employers?',
      answer: 'Once you find a job you\'re interested in, you can apply directly through our platform. Some employers also enable messaging for shortlisted candidates.',
    },
    {
      question: 'How do I edit my profile?',
      answer: 'Log in to your account, go to your dashboard, and click on "Profile" in the sidebar. You can update your information, add work experience, skills, and upload your resume.',
    },
    {
      question: 'What file formats do you accept for resumes?',
      answer: 'We accept PDF, DOC, and DOCX files for resumes. The maximum file size is 5MB. Make sure your resume is clear and well-formatted.',
    },
  ];

  const categories = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      availability: 'Available 24/7',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      availability: 'support@jobfinder.com',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      availability: 'Mon-Fri, 9am-6pm EST',
    },
    {
      icon: FileText,
      title: 'Help Center',
      description: 'Browse our comprehensive knowledge base',
      availability: 'Available 24/7',
    },
  ];

  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-black mb-4">
            How can we help?
          </h1>
          <p className="text-xl text-[#6B7280] mb-8">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-white border-[#E5E7EB] text-lg shadow-sm"
            />
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div 
                key={category.title}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-black mb-1">
                  {category.title}
                </h3>
                <p className="text-sm text-[#6B7280] mb-2">
                  {category.description}
                </p>
                <p className="text-sm text-[#2563EB] font-medium">
                  {category.availability}
                </p>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-[#6B7280]">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-black pr-4">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[#6B7280]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#6B7280]">
                No results found for "{searchQuery}". Try different keywords or contact our support team.
              </p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-20">
          <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
                Still need help?
              </h2>
              <p className="text-[#6B7280] mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team is here to help you with any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="w-full sm:w-auto">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Live Chat
                </Button>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#E5E7EB] text-black">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
            {/* Soft decorative background effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#2563EB]/5 rounded-full blur-[80px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
