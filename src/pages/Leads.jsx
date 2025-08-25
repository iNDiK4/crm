import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Target,
  Mail,
  Phone,
  Star,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  X,
  Save,
  Plus as PlusIcon,
  User,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isEditingLead, setIsEditingLead] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  // Mock leads data with state management
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'Александр Иванов',
      company: 'ООО "Инновационные решения"',
      email: 'alex.ivanov@innovations.ru',
      phone: '+7 (999) 123-45-67',
      position: 'Генеральный директор',
      source: 'website',
      status: 'new',
      score: 85,
      budget: '500,000 - 1,000,000 ₽',
      timeline: '1-3 месяца',
      description: 'Интересуется CRM системой для автоматизации продаж',
      notes: 'Клиент готов к демонстрации продукта',
      lastContact: '2024-01-15',
      nextAction: '2024-01-20',
      tags: ['VIP', 'Горячий лид'],
      activities: [
        { id: 1, type: 'email', date: '2024-01-15', description: 'Отправлено приветственное письмо', user: 'Иван Петров' },
        { id: 2, type: 'call', date: '2024-01-14', description: 'Первичный звонок', user: 'Мария Сидорова' }
      ]
    },
    {
      id: 2,
      name: 'Елена Петрова',
      company: 'Стартап "Технологии будущего"',
      email: 'elena.petrova@techfuture.com',
      phone: '+7 (999) 234-56-78',
      position: 'CTO',
      source: 'linkedin',
      status: 'qualified',
      score: 92,
      budget: '1,000,000 - 2,000,000 ₽',
      timeline: '3-6 месяцев',
      description: 'Ищет решение для масштабирования бизнеса',
      notes: 'Очень заинтересована в облачных решениях',
      lastContact: '2024-01-16',
      nextAction: '2024-01-22',
      tags: ['Стартап', 'Высокий бюджет'],
      activities: [
        { id: 1, type: 'meeting', date: '2024-01-16', description: 'Встреча в офисе', user: 'Алексей Козлов' },
        { id: 2, type: 'email', date: '2024-01-13', description: 'Отправлено коммерческое предложение', user: 'Елена Воробьева' }
      ]
    }
  ]);

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

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

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

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead({ ...lead });
    setIsEditingLead(true);
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = () => {
    if (editingLead) {
      const updatedLeads = leads.map(lead => 
        lead.id === editingLead.id ? editingLead : lead
      );
      setLeads(updatedLeads);
      setSelectedLead(editingLead);
      setIsEditingLead(false);
      setEditingLead(null);
    }
  };

  const handleDeleteLead = (leadId) => {
    const updatedLeads = leads.filter(lead => lead.id !== leadId);
    setLeads(updatedLeads);
    setIsLeadModalOpen(false);
    setSelectedLead(null);
  };

  const handleAddActivity = (leadId, activity) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, activities: [...lead.activities, { ...activity, id: Date.now() }] }
        : lead
    );
    setLeads(updatedLeads);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(updatedLeads.find(l => l.id === leadId));
    }
  };

  const addNewLead = () => {
    const newLead = {
      id: Date.now(),
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
      lastContact: new Date().toISOString().split('T')[0],
      nextAction: new Date().toISOString().split('T')[0],
      tags: [],
      activities: []
    };
    setLeads([...leads, newLead]);
    setEditingLead(newLead);
    setIsEditingLead(true);
    setIsLeadModalOpen(true);
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

  const currentLead = isEditingLead ? editingLead : selectedLead;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Лиды</h1>
          <p className="text-gray-600 mt-1">Управление лидами и потенциальными клиентами</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={addNewLead}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover-lift flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Новый лид</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statuses.map((status, index) => (
          <div
            key={status.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover-lift cursor-pointer"
            onClick={() => setSelectedStatus(status.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{status.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{status.count}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.color}`}>
                <Target className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Поиск лидов</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени, компании, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Все статусы</option>
              {statuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Источник</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Все источники</option>
              {sources.map(source => (
                <option key={source.id} value={source.id}>{source.name}</option>
              ))}
            </select>
          </div>

          <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLeads.map((lead, index) => {
          const statusInfo = getStatusInfo(lead.status);
          const sourceInfo = getSourceInfo(lead.source);
          
          return (
            <div
              key={lead.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover-lift cursor-pointer"
              onClick={() => handleLeadClick(lead)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                    <p className="text-sm text-gray-600">{lead.position}</p>
                    <p className="text-sm text-gray-500">{lead.company}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {lead.tags.includes('VIP') && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    <button 
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLead(lead);
                      }}
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{lead.phone}</span>
                  </div>
                </div>

                {/* Score and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </span>
                    <span className="text-xs text-gray-500">баллов</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.name}
                  </span>
                </div>

                {/* Budget and Timeline */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Бюджет:</span>
                    <span className="text-gray-900 font-medium">{lead.budget}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Срок:</span>
                    <span className="text-gray-900 font-medium">{lead.timeline}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {lead.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Next Action */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Следующее действие:</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(lead.nextAction).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lead Detail Modal */}
      {isLeadModalOpen && currentLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditingLead ? 'Редактирование лида' : currentLead.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {isEditingLead ? 'Измените информацию о лиде' : `${currentLead.position} в ${currentLead.company}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsLeadModalOpen(false);
                    setIsEditingLead(false);
                    setEditingLead(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex h-96">
              {/* Left Column - Lead Info */}
              <div className="flex-1 p-6 border-r border-gray-100 overflow-y-auto">
                {isEditingLead ? (
                  <div className="space-y-6">
                    {/* Edit Form */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                        <input
                          type="text"
                          value={currentLead.name}
                          onChange={(e) => setEditingLead({...currentLead, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                        <input
                          type="text"
                          value={currentLead.company}
                          onChange={(e) => setEditingLead({...currentLead, company: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={currentLead.email}
                          onChange={(e) => setEditingLead({...currentLead, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                        <input
                          type="text"
                          value={currentLead.phone}
                          onChange={(e) => setEditingLead({...currentLead, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                        <input
                          type="text"
                          value={currentLead.position}
                          onChange={(e) => setEditingLead({...currentLead, position: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Оценка</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentLead.score}
                          onChange={(e) => setEditingLead({...currentLead, score: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                      <textarea
                        value={currentLead.description}
                        onChange={(e) => setEditingLead({...currentLead, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{currentLead.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{currentLead.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lead Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Детали лида</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Источник</label>
                          <p className="text-gray-900">{getSourceInfo(currentLead.source).name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(currentLead.status).color}`}>
                            {getStatusInfo(currentLead.status).name}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Бюджет</label>
                          <p className="text-gray-900">{currentLead.budget}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Срок</label>
                          <p className="text-gray-900">{currentLead.timeline}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Оценка</label>
                          <p className={`font-bold ${getScoreColor(currentLead.score)}`}>{currentLead.score} баллов</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Описание</h3>
                      <p className="text-gray-700">{currentLead.description}</p>
                    </div>

                    {/* Notes */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Заметки</h3>
                      <p className="text-gray-700">{currentLead.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Timeline */}
              <div className="w-96 p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Таймлайн</h3>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <PlusIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {currentLead.activities.map((activity, index) => {
                      const ActivityIcon = getActivityIcon(activity.type);
                      return (
                        <div
                          key={activity.id}
                          className="flex space-x-3"
                        >
                          <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                            <ActivityIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">{activity.user}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {new Date(activity.date).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {!isEditingLead && (
                    <button 
                      onClick={() => handleEditLead(currentLead)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteLead(currentLead.id)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setIsLeadModalOpen(false);
                      setIsEditingLead(false);
                      setEditingLead(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  {isEditingLead ? (
                    <button 
                      onClick={handleSaveLead}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                      Сохранить
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                      Создать сделку
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
