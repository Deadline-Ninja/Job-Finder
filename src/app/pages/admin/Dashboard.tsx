import { AdminLayout } from './AdminLayout';
import { Users, Briefcase, FileCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, MoreVertical, Edit, Trash2, X, Plus, Search as SearchIcon, Check, Shield, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

// --- Types ---
interface AdminRecord {
  id: string;
  name: string;
  subtext: string;
  status: 'Active' | 'Pending' | 'Flagged' | 'Banned';
  date: string;
  type: 'users' | 'jobs' | 'companies' | 'branches';
}

// --- Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white border border-black/10 rounded-sm p-6 shadow-sm hover:border-black/30 transition-all ${className}`}>
    {children}
  </div>
);

const AdminButton = ({ children, onClick, className = "", variant = "primary" }: { children: React.ReactNode, onClick?: () => void, className?: string, variant?: 'primary' | 'danger' | 'ghost' }) => {
  const base = "px-6 py-3 rounded-none font-black uppercase tracking-widest text-[10px] shadow-sm transition-all duration-300 transform active:scale-95";
  const styles = {
    primary: "bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent border border-black/10 text-black hover:bg-black hover:text-white"
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border-4 border-black w-full max-w-xl p-10 shadow-[20px_20px_0px_0px_rgba(37,99,235,1)] relative">
        <button onClick={onClose} className="absolute top-6 right-6 hover:rotate-90 transition-transform">
          <X className="w-8 h-8" />
        </button>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-8 border-b-2 border-black pb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

import { useSearchParams } from 'react-router';

// --- Main Page ---
export function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'users';
  const [activeTab, setActiveTabState] = useState<'users' | 'jobs' | 'companies' | 'branches'>(initialTab);
  
  const setActiveTab = (tab: any) => {
    setActiveTabState(tab);
    setSearchParams({ tab });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    companies: 0,
    verifications: 0
  });
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState<AdminRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<AdminRecord | null>(null);
  const [formData, setFormData] = useState({ name: '', subtext: '', status: 'Active' as AdminRecord['status'] });

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['users', 'jobs', 'companies', 'branches'].includes(tabFromUrl)) {
      setActiveTabState(tabFromUrl as any);
    }
  }, [searchParams]);

  // Initial Data Load
  useEffect(() => {
    // Mock Data for UI/UX Review bypassing backend
    const loadMockData = () => {
      try {
        const allRecords: AdminRecord[] = [
          // Users
          { id: 'USR-8901', name: 'Alisha Thapa', subtext: 'alisha@example.com', status: 'Active', date: new Date().toISOString(), type: 'users' },
          { id: 'USR-8902', name: 'Bikram Shrestha', subtext: 'bikramp@example.com', status: 'Pending', date: new Date().toISOString(), type: 'users' },
          { id: 'USR-8903', name: 'Sita Sharma', subtext: 'sita.dev@example.com', status: 'Flagged', date: new Date().toISOString(), type: 'users' },
          { id: 'USR-8904', name: 'Nabin K.C.', subtext: 'nabin@example.com', status: 'Banned', date: new Date().toISOString(), type: 'users' },
          
          // Jobs
          { id: 'JOB-2201', name: 'Senior React Developer', subtext: 'F1Soft International', status: 'Active', date: new Date().toISOString(), type: 'jobs' },
          { id: 'JOB-2202', name: 'Marketing Manager', subtext: 'Daraz Nepal', status: 'Pending', date: new Date().toISOString(), type: 'jobs' },
          { id: 'JOB-2203', name: 'Tourism Guide', subtext: 'Fish Tail Lodge', status: 'Active', date: new Date().toISOString(), type: 'jobs' },
          { id: 'JOB-2204', name: 'Civil Engineer', subtext: 'Lalitpur Group', status: 'Flagged', date: new Date().toISOString(), type: 'jobs' },
          
          // Companies
          { id: 'COM-5510', name: 'F1Soft International', subtext: 'Technology', status: 'Active', date: new Date().toISOString(), type: 'companies' },
          { id: 'COM-5511', name: 'Prabhu Bank', subtext: 'Banking', status: 'Active', date: new Date().toISOString(), type: 'companies' },
          { id: 'COM-5512', name: 'AgroNepal Ltd.', subtext: 'Agriculture', status: 'Flagged', date: new Date().toISOString(), type: 'companies' },
          { id: 'COM-5513', name: 'Chitwan Jungle Lodge', subtext: 'Hospitality', status: 'Active', date: new Date().toISOString(), type: 'companies' },
          
          // Branches
          { id: 'BRN-101', name: 'Kathmandu HQ', subtext: 'Ram Prasad - Branch Head', status: 'Active', date: new Date().toISOString(), type: 'branches' },
          { id: 'BRN-102', name: 'Pokhara Hub', subtext: 'Sushil Gurung - Manager', status: 'Active', date: new Date().toISOString(), type: 'branches' },
          { id: 'BRN-103', name: 'Lalitpur Node', subtext: 'Anjali Maharjan - Lead', status: 'Active', date: new Date().toISOString(), type: 'branches' },
          { id: 'BRN-104', name: 'Bharatpur Branch', subtext: 'Dipendra Shah - Admin', status: 'Pending', date: new Date().toISOString(), type: 'branches' },
          { id: 'BRN-105', name: 'Biratnagar Sector', subtext: 'Pooja Jha - Supervisor', status: 'Active', date: new Date().toISOString(), type: 'branches' }
        ];
        
        setRecords(allRecords);

        // Update stats summary based on mock counts
        setStats({
          users: 4,
          jobs: 4,
          companies: 4,
          verifications: 1
        });
      } catch (err) {
        toast.error("Global Sync Interrupted");
      }
    };
    
    loadMockData();
  }, []);

  const filteredRecords = records.filter(r => 
    r.type === activeTab && 
    (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- CRUD Logic ---
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setFormData({ name: '', subtext: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: AdminRecord) => {
    setEditingRecord(record);
    setFormData({ name: record.name, subtext: record.subtext, status: record.status });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...r, ...formData } : r));
      toast.success(`System Record ${editingRecord.id} Synchronized`);
    } else {
      const newRecord: AdminRecord = {
        id: `${activeTab.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
        name: formData.name,
        subtext: formData.subtext,
        status: formData.status,
        date: new Date().toISOString(),
        type: activeTab
      };
      setRecords(prev => [newRecord, ...prev]);
      toast.success(`Initial Registry of ${newRecord.id} Established`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Initiate Terminate Protocol for Record ${id}?`)) {
      setRecords(prev => prev.filter(r => r.id !== id));
      toast.error(`Record ${id} Purged from Matrix`);
    }
  };

  const handleKycAction = (id: string, action: 'Approve' | 'Reject') => {
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = action === 'Approve' ? 'Active' : 'Flagged';
        toast.info(`KYC Protocol: ${action} for ${id}`);
        return { ...r, status: nextStatus as any, date: new Date().toISOString() };
      }
      return r;
    }));
    setKycModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'Active' ? 'Flagged' : 'Active';
        toast.info(`Status Variance Detected for ${id}: ${nextStatus}`);
        return { ...r, status: nextStatus as any };
      }
      return r;
    }));
  };

  const handleOpenKycModal = (record: AdminRecord) => {
    setSelectedKyc(record);
    setKycModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
        {/* Header Section */}
        <section>
          <div className="flex items-end justify-between border-b-8 border-black pb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-10 h-10 text-blue-600" />
                <span className="text-xs font-black uppercase tracking-[0.5em] text-black/40">Secured Node_01</span>
              </div>
              <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none">
                Command Center
              </h1>
              <p className="text-2xl mt-6 max-w-2xl font-bold tracking-tight text-black line-clamp-2">
                Real-time governance over the administrative matrix. Monitor, moderate, and manipulate system entities.
              </p>
            </div>
            <div className="flex flex-col items-end gap-4">
                <div className="bg-black text-white px-4 py-2 font-mono text-[10px] uppercase">Connection: Encrypted</div>
                <AdminButton onClick={() => window.print()}>
                    Export Master Ledger
                </AdminButton>
            </div>
          </div>
        </section>

        {/* Dynamic Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            { label: 'System Residents', value: records.filter(r => r.type === 'users').length, icon: Users, color: 'bg-black' },
            { label: 'KYC Verifications', value: records.filter(r => r.type === 'users' && r.status === 'Active').length, icon: FileCheck, color: 'bg-blue-600' },
            { label: 'Regional Branches', value: '5 Branches', icon: MapPin, color: 'bg-black' },
            { label: 'Verified Signals', value: records.filter(r => r.type === 'jobs' && r.status === 'Active').length, icon: Briefcase, color: 'bg-green-600' },
          ].map((stat, i) => (
            <Card key={i} className="group overflow-hidden relative border-2 border-black">
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity -rotate-12 translate-x-8 -translate-y-8`} />
              <div className="flex items-start justify-between mb-8">
                <div className={`p-4 ${stat.color} text-white shadow-lg shadow-black/10`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#2563EB]">Live_Sync</div>
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/50 mb-2">{stat.label}</h3>
              <p className="text-5xl font-black tracking-tighter italic text-black">{stat.value}</p>
            </Card>
          ))}
        </section>

        {/* Management Grid */}
        <section className="space-y-10">
          <div className="flex justify-between items-end border-b-2 border-black/10">
            <div className="flex gap-1">
                {(['users', 'jobs', 'companies', 'branches'] as const).map(tab => (
                <button 
                    key={tab}
                    onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
                    className={`px-12 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden ${
                        activeTab === tab ? 'bg-black text-white' : 'text-black/30 hover:text-black hover:bg-gray-50'
                    }`}
                >
                    {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />}
                    Manage_{tab}
                </button>
                ))}
            </div>
            <div className="pb-4 flex gap-6 items-center">
                <div className="relative group">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/30 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={`Filter ${activeTab} metadata...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-100 border-2 border-transparent border-b-black/10 px-12 py-3 text-sm font-bold w-80 focus:bg-white focus:border-black outline-none transition-all placeholder:italic"
                    />
                </div>
                <AdminButton onClick={handleOpenAddModal}>
                    Deploy New {activeTab.slice(0, -1)}
                </AdminButton>
            </div>
          </div>

          <div className="border-4 border-black overflow-hidden bg-white shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black text-white border-b-4 border-blue-600">
                  <tr>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em]">Hash_ID</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em]">Entity_Designation</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em]">Operational_State</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em]">Sync_Timestamp</th>
                    <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-right">Command_Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/5">
                  {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                    <tr key={record.id} className="group hover:bg-blue-50/30 transition-colors">
                      <td className="px-8 py-8 font-mono text-[10px] text-black/40 font-bold">{record.id}</td>
                      <td className="px-8 py-8">
                         <div className="flex flex-col gap-2">
                             <div className="font-black uppercase text-base text-black group-hover:translate-x-1 transition-transform">{record.name}</div>
                             <div className="text-xs text-black/40 font-bold lowercase italic">{record.subtext}</div>
                             {record.type === 'users' && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[9px] font-black px-2 py-0.5 border ${record.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                        KYC_{record.status === 'Active' ? 'VERIFIED' : 'PENDING'}
                                    </span>
                                </div>
                             )}
                         </div>
                      </td>
                       <td className="px-8 py-8">
                         <button 
                            onClick={() => record.type === 'users' && record.status === 'Pending' ? handleOpenKycModal(record) : handleToggleStatus(record.id)}
                            className={`px-4 py-1 border-2 font-black uppercase text-[9px] tracking-widest transition-all ${
                                record.status === 'Active' ? 'bg-black text-white border-black' : 
                                record.status === 'Pending' ? 'bg-white text-black border-black/20 text-black/40 hover:border-black hover:text-black' : 
                                record.status === 'Flagged' ? 'bg-blue-600 text-white border-blue-600' :
                                'bg-red-600 text-white border-red-600'
                            }`}
                         >
                            {record.type === 'users' && record.status === 'Active' ? 'Revoke_KYC' : 
                             record.type === 'users' && record.status === 'Pending' ? 'Inspect_KYC' : 
                             record.status}
                         </button>
                      </td>
                      <td className="px-8 py-8 text-sm italic font-bold text-black/60">
                         {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-8 text-right">
                         <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleOpenEditModal(record)}
                                className="p-3 bg-white border-2 border-black hover:bg-black hover:text-white transition-all shadow-md active:translate-y-1"
                            >
                               <Edit className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDelete(record.id)}
                                className="p-3 bg-white border-2 border-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-md active:translate-y-1"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                         </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                            <div className="text-4xl font-black uppercase text-black/10 italic">Zero_Results_Found</div>
                            <button onClick={() => setSearchTerm('')} className="mt-4 text-xs font-bold underline hover:text-blue-600">Reset Search Protocol</button>
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 bg-gray-50 border-t-2 border-black flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black">Synchronized with Node_Alpha</span>
                </div>
                <div className="flex gap-4">
                    <AdminButton variant="ghost" className="bg-white">Prev_Sector</AdminButton>
                    <AdminButton variant="ghost" className="bg-white">Next_Sector</AdminButton>
                </div>
            </div>
          </div>
        </section>
      </div>

      {/* --- CRUD MODAL --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingRecord ? `Modify ${editingRecord.id}` : `Establish New ${activeTab.slice(0, -1)}`}
      >
        <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Entity Designation</label>
                <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Master Intelligence Unit"
                    className="w-full border-4 border-black p-5 text-xl font-bold bg-gray-50 focus:bg-white focus:outline-none transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Metadata / Subtext</label>
                <input 
                    type="text"
                    required
                    value={formData.subtext}
                    onChange={(e) => setFormData({...formData, subtext: e.target.value})}
                    placeholder="e.g. protocol_id_001"
                    className="w-full border-2 border-black p-4 text-sm font-bold bg-gray-50 focus:bg-white focus:outline-none transition-all"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Operational Protocol</label>
                <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full border-2 border-black p-4 text-sm font-bold bg-gray-50 focus:bg-white focus:outline-none transition-all uppercase tracking-widest"
                >
                    <option value="Active">Active Protocol</option>
                    <option value="Pending">Pending Audit</option>
                    <option value="Flagged">Flagged Signal</option>
                    <option value="Banned">Terminate Node</option>
                </select>
            </div>
            <div className="flex gap-4 pt-4">
                <AdminButton className="flex-1 py-5 text-lg" variant="primary">
                   {editingRecord ? 'Commit Synchronization' : 'Initialize Node'}
                </AdminButton>
                <AdminButton className="py-5" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Abort
                </AdminButton>
            </div>
        </form>
      </Modal>

      {/* --- KYC INSPECTION MODAL --- */}
      <Modal
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        title={`KYC Protocol: ${selectedKyc?.id}`}
      >
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Full Name</label>
                    <p className="text-xl font-black uppercase">{selectedKyc?.name}</p>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40">ID Type</label>
                    <p className="text-xl font-black uppercase">Citizenship (Nepal)</p>
                </div>
            </div>

            <div className="p-10 border-4 border-dashed border-black bg-gray-50 text-center group cursor-zoom-in">
                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center border-2 border-black/5 mb-4 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&h=250&fit=crop" alt="ID Document Mock" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Click to enlarge document node</p>
            </div>

            <div className="flex gap-4 pt-4">
                <AdminButton 
                    className="flex-1 bg-green-600 hover:bg-green-700" 
                    onClick={() => selectedKyc && handleKycAction(selectedKyc.id, 'Approve')}
                >
                    Approve Identity
                </AdminButton>
                <AdminButton 
                    className="flex-1" 
                    variant="danger"
                    onClick={() => selectedKyc && handleKycAction(selectedKyc.id, 'Reject')}
                >
                    Reject Protocol
                </AdminButton>
            </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

