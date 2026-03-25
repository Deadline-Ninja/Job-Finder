import { useState, useEffect } from 'react';
import { CompanyCard } from '../components/CompanyCard';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Loader2 } from 'lucide-react';
import { getCompanies } from '../api/companiesAPI';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any }
  }
};

import { mockCompanies } from '../data/mockData';

export function CompaniesDirectory() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [totalCompanies, setTotalCompanies] = useState(0);

  useEffect(() => {
    fetchCompanies();
  }, [industry, size, searchTerm]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (industry) params.industry = industry;
      if (size) params.size = size;

      try {
        const response = await getCompanies(params);
        const companiesData = response.data.companies || [];
        if (companiesData.length === 0 && !searchTerm && !industry && !size) {
          setCompanies(mockCompanies);
          setTotalCompanies(mockCompanies.length);
        } else {
          setCompanies(companiesData.map((company: any) => ({
            id: company._id || company.id,
            name: company.name,
            logo: company.logo,
            industry: company.industry,
            size: company.size,
            location: company.location,
            description: company.description,
            website: company.website,
            openPositions: company.openPositions || 0
          })));
          setTotalCompanies(companiesData.length);
        }
      } catch (err) {
        console.warn('Backend API failed, using mock data for companies');
        setCompanies(mockCompanies);
        setTotalCompanies(mockCompanies.length);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Demo data fallback
      setTotalCompanies(mockCompanies.length);
      setCompanies(mockCompanies);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="min-h-screen py-12 bg-white">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold tracking-tight text-black mb-2" id="companies-directory-title">
            Explore Companies
          </h1>
          <p className="text-[#6B7280]">
            Discover {totalCompanies} leading companies
          </p>
        </motion.div>

        {/* Filters */}
        <motion.form onSubmit={handleSearch} variants={itemVariants}>
          <GlassCard className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                placeholder="Search companies..." 
                className="bg-white/50 border-[#E5E7EB] focus:ring-[#2563EB] focus:border-[#2563EB] transition-all" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="bg-white/50 border-[#E5E7EB]">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                </SelectContent>
              </Select>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="bg-white/50 border-[#E5E7EB]">
                  <SelectValue placeholder="Company Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">1-50</SelectItem>
                  <SelectItem value="51-100">51-100</SelectItem>
                  <SelectItem value="101-500">101-500</SelectItem>
                  <SelectItem value="501-1000">501-1000</SelectItem>
                  <SelectItem value="1000+">1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </GlassCard>
        </motion.form>

        {/* Companies Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-[#2563EB]" />
          </div>
        ) : companies.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
          >
            {companies.map(company => (
              <motion.div key={company.id} variants={itemVariants}>
                <CompanyCard company={company} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div className="text-center py-12 text-[#6B7280]" variants={itemVariants}>
            <p>No companies found matching your criteria.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
