import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  DollarSign, 
  Calendar, 
  User, 
  Building,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  FileText,
  Tag,
  Settings,
  Plus as PlusIcon,
  X,
  Save,
  ArrowRight,
  ArrowLeft,
  Settings as SettingsIcon,
  Plus as AddIcon,
  Target,
  Star,
  Briefcase
} from 'lucide-react';
import DealsContent from '../components/DealsContent';
import LeadsContent from '../components/LeadsContent';
import AdvancedDealModal from '../components/AdvancedDealModal';
import AdvancedLeadModal from '../components/AdvancedLeadModal';
import { useCrmStore } from '../store/crmStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const CRM = () => {
  const { user } = useAuthStore();
  const actorName = user?.name || 'System';
  const { 
    deals, 
    leads, 
    funnels, 
    updateDeal, 
    moveDeal, 
    addDeal, 
    addLead,
    updateFunnels 
  } = useCrmStore();
  
  const [activeTab, setActiveTab] = useState('deals'); // 'deals' или 'leads'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunnel, setSelectedFunnel] = useState('sales');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Save/restore modal state on page refresh
  useEffect(() => {
    const savedDealId = localStorage.getItem('openDealId');
    if (savedDealId && deals.length > 0) {
      const deal = deals.find(d => d.id === parseInt(savedDealId));
      if (deal) {
        setSelectedDeal(deal);
        setIsDealModalOpen(true);
      }
    }
  }, [deals]);

  useEffect(() => {
    if (isDealModalOpen && selectedDeal) {
      localStorage.setItem('openDealId', selectedDeal.id.toString());
    } else {
      localStorage.removeItem('openDealId');
    }
  }, [isDealModalOpen, selectedDeal]);
  const [isFunnelSettingsOpen, setIsFunnelSettingsOpen] = useState(false);
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');


  const statuses = [
    { id: 'new', name: 'Новые', color: 'bg-gray-100 text-gray-800', count: leads.filter(l => l.status === 'new').length },
    { id: 'contacted', name: 'Связались', color: 'bg-blue-100 text-blue-800', count: leads.filter(l => l.status === 'contacted').length },
    { id: 'qualified', name: 'Квалифицированные', color: 'bg-yellow-100 text-yellow-800', count: leads.filter(l => l.status === 'qualified').length },
    { id: 'converted', name: 'Конвертированные', color: 'bg-green-100 text-green-800', count: leads.filter(l => l.status === 'converted').length },
    { id: 'lost', name: 'Потерянные', color: 'bg-red-100 text-red-800', count: leads.filter(l => l.status === 'lost').length }
  ];

  const sources = [
    { id: 'website', name: 'Веб-сайт', count: leads.filter(l => l.source === 'website').length },
    { id: 'linkedin', name: 'LinkedIn', count: leads.filter(l => l.source === 'linkedin').length },
    { id: 'conference', name: 'Конференция', count: leads.filter(l => l.source === 'conference').length },
    { id: 'recommendation', name: 'Рекомендации', count: leads.filter(l => l.source === 'recommendation').length },
    { id: 'advertising', name: 'Реклама', count: leads.filter(l => l.source === 'advertising').length }
  ];

  // Фильтрация сделок по строке поиска
  const filteredDeals = deals.filter(d => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (d.title || '').toLowerCase().includes(q) ||
      (d.company || '').toLowerCase().includes(q) ||
      (d.contact || '').toLowerCase().includes(q)
    );
  });

  // Распределяем сделки по стадиям (с учетом фильтра)
  const currentFunnel = funnels.find(f => f.id === selectedFunnel);
  const currentStages = currentFunnel ? currentFunnel.stages.map(stage => ({
    ...stage,
    deals: filteredDeals.filter(deal => deal.stage === stage.id)
  })) : [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return Phone;
      case 'meeting': return User;
      case 'email': return Mail;
      default: return MessageSquare;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call': return 'text-blue-500';
      case 'meeting': return 'text-green-500';
      case 'email': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
    setIsDealModalOpen(true);
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== targetStage.id) {
      const result = moveDeal(draggedDeal.id, targetStage.id, actorName);
      if (result.success) {
        toast.success(`Сделка перемещена в "${targetStage.name}"`);
      }
    }
    setDraggedDeal(null);
  };

  const getStatusInfo = (statusKey) => {
    return statuses.find(status => status.id === statusKey) || statuses[0];
  };

  const getSourceInfo = (sourceKey) => {
    return sources.find(source => source.id === sourceKey) || sources[0];
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const addNewDeal = () => {
    const newDeal = {
      title: 'Новая сделка',
      company: '',
      contact: '',
      amount: 0,
      stage: currentStages[0]?.id || 'new',
      probability: 10,
      expectedClose: new Date().toISOString().split('T')[0],
      description: '',
      fields: {
        source: '',
        budget: '',
        decisionMaker: '',
        nextStep: '',
        notes: ''
      }
    };
    const result = addDeal(newDeal);
    if (result.success) {
      setSelectedDeal(result.data);
      setIsDealModalOpen(true);
    }
  };

  const addNewLead = () => {
    const newLead = {
      name: '',
      company: '',
      email: '',
      phone: '',
      position: '',
      source: 'website',
      status: 'new',
      score: 50,
      budget: '',
      timeline: '',
      description: '',
      notes: '',
      nextAction: new Date().toISOString().split('T')[0],
      tags: []
    };
    const result = addLead(newLead);
    if (result.success) {
      setSelectedLead(result.data);
      setIsLeadModalOpen(true);
    }
  };

  const handleSaveDeal = (updatedDeal) => {
    const result = updateDeal(updatedDeal.id, updatedDeal);
    if (result.success) {
      toast.success('Сделка сохранена');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-600 mt-1">Управление лидами и сделками</p>
        </div>
        <div className="flex items-center space-x-4">
          {activeTab === 'deals' && (
            <button 
              onClick={() => setIsFunnelSettingsOpen(true)}
              className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <SettingsIcon className="w-5 h-5 text-gray-600" />
              <span>Настройки воронки</span>
            </button>
          )}
          <button 
            onClick={activeTab === 'deals' ? addNewDeal : addNewLead}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover-lift flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{activeTab === 'deals' ? 'Новая сделка' : 'Новый лид'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('deals')}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'deals'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Сделки</span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Лиды</span>
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'deals' ? (
        <DealsContent 
          deals={deals}
          funnels={funnels}
          selectedFunnel={selectedFunnel}
          setSelectedFunnel={setSelectedFunnel}
          currentStages={currentStages}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleDealClick={handleDealClick}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          formatCurrency={formatCurrency}
          setIsFunnelSettingsOpen={setIsFunnelSettingsOpen}
          isFunnelSettingsOpen={isFunnelSettingsOpen}
          setFunnels={updateFunnels}
        />
      ) : (
        <LeadsContent 
          leads={leads}
          statuses={statuses}
          sources={sources}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleLeadClick={handleLeadClick}
          getStatusInfo={getStatusInfo}
          getSourceInfo={getSourceInfo}
          getScoreColor={getScoreColor}
        />
      )}

      {/* Deal Detail Modal */}
      {isDealModalOpen && selectedDeal && (
        <AdvancedDealModal 
          deal={selectedDeal}
          onClose={() => setIsDealModalOpen(false)}
          currentStages={currentStages}
          formatCurrency={formatCurrency}
          getActivityIcon={getActivityIcon}
          getActivityColor={getActivityColor}
        />
      )}

      {/* Lead Detail Modal */}
      {isLeadModalOpen && selectedLead && (
        <AdvancedLeadModal 
          lead={selectedLead}
          onClose={() => setIsLeadModalOpen(false)}
          getStatusInfo={getStatusInfo}
          getSourceInfo={getSourceInfo}
          getScoreColor={getScoreColor}
          getActivityIcon={getActivityIcon}
          getActivityColor={getActivityColor}
        />
      )}
    </div>
  );
};

export default CRM;
