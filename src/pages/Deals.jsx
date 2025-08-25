import React, { useState } from 'react';
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
  Plus as AddIcon
} from 'lucide-react';

const Deals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunnel, setSelectedFunnel] = useState('sales');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [isFunnelSettingsOpen, setIsFunnelSettingsOpen] = useState(false);
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [draggedDeal, setDraggedDeal] = useState(null);

  // Воронки продаж с возможностью редактирования
  const [funnels, setFunnels] = useState([
    { 
      id: 'sales', 
      name: 'Основная воронка', 
      color: 'from-blue-500 to-purple-600',
      stages: [
        { id: 'new', name: 'Новые лиды', color: 'bg-gray-100 text-gray-800', deals: [] },
        { id: 'qualified', name: 'Квалифицированные', color: 'bg-blue-100 text-blue-800', deals: [] },
        { id: 'proposal', name: 'Предложение', color: 'bg-yellow-100 text-yellow-800', deals: [] },
        { id: 'negotiation', name: 'Переговоры', color: 'bg-orange-100 text-orange-800', deals: [] },
        { id: 'won', name: 'Выиграны', color: 'bg-green-100 text-green-800', deals: [] },
        { id: 'lost', name: 'Проиграны', color: 'bg-red-100 text-red-800', deals: [] }
      ]
    },
    { 
      id: 'partners', 
      name: 'Партнерская воронка', 
      color: 'from-green-500 to-emerald-600',
      stages: [
        { id: 'contact', name: 'Первичный контакт', color: 'bg-gray-100 text-gray-800', deals: [] },
        { id: 'meeting', name: 'Встреча', color: 'bg-blue-100 text-blue-800', deals: [] },
        { id: 'agreement', name: 'Соглашение', color: 'bg-green-100 text-green-800', deals: [] },
        { id: 'active', name: 'Активные', color: 'bg-purple-100 text-purple-800', deals: [] }
      ]
    }
  ]);

  // Mock deals data
  const [deals, setDeals] = useState([
    {
      id: 1,
      title: 'Разработка CRM системы',
      company: 'ООО "Технологии будущего"',
      contact: 'Иван Петров',
      amount: 2500000,
      stage: 'negotiation',
      probability: 75,
      expectedClose: '2024-02-15',
      created: '2024-01-10',
      lastActivity: '2024-01-15',
      description: 'Разработка корпоративной CRM системы с интеграцией',
      activities: [
        { id: 1, type: 'call', date: '2024-01-15', description: 'Звонок с клиентом', user: 'Иван Петров' },
        { id: 2, type: 'meeting', date: '2024-01-12', description: 'Встреча в офисе', user: 'Мария Сидорова' },
        { id: 3, type: 'email', date: '2024-01-10', description: 'Отправлено коммерческое предложение', user: 'Алексей Козлов' }
      ],
      fields: {
        source: 'Веб-сайт',
        budget: '2,500,000 ₽',
        decisionMaker: 'Иван Петров',
        nextStep: 'Подписание договора',
        notes: 'Клиент заинтересован в быстром запуске проекта'
      }
    },
    {
      id: 2,
      title: 'Маркетинговые услуги',
      company: 'ООО "Инновации"',
      contact: 'Мария Сидорова',
      amount: 850000,
      stage: 'proposal',
      probability: 60,
      expectedClose: '2024-02-28',
      created: '2024-01-05',
      lastActivity: '2024-01-12',
      description: 'Комплексные маркетинговые услуги для запуска продукта',
      activities: [
        { id: 1, type: 'meeting', date: '2024-01-12', description: 'Презентация услуг', user: 'Мария Сидорова' },
        { id: 2, type: 'email', date: '2024-01-08', description: 'Отправлено предложение', user: 'Елена Воробьева' }
      ],
      fields: {
        source: 'Рекомендации',
        budget: '850,000 ₽',
        decisionMaker: 'Мария Сидорова',
        nextStep: 'Согласование бюджета',
        notes: 'Клиент рассматривает несколько предложений'
      }
    }
  ]);

  // Распределяем сделки по стадиям
  const currentFunnel = funnels.find(f => f.id === selectedFunnel);
  const currentStages = currentFunnel ? currentFunnel.stages.map(stage => ({
    ...stage,
    deals: deals.filter(deal => deal.stage === stage.id)
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
      const updatedDeals = deals.map(deal => 
        deal.id === draggedDeal.id ? { ...deal, stage: targetStage.id } : deal
      );
      setDeals(updatedDeals);
    }
    setDraggedDeal(null);
  };

  // Funnel management
  const addNewStage = () => {
    if (newStageName.trim()) {
      const newStage = {
        id: `stage_${Date.now()}`,
        name: newStageName,
        color: 'bg-gray-100 text-gray-800',
        deals: []
      };
      
      const updatedFunnels = funnels.map(funnel => 
        funnel.id === selectedFunnel 
          ? { ...funnel, stages: [...funnel.stages, newStage] }
          : funnel
      );
      setFunnels(updatedFunnels);
      setNewStageName('');
      setIsAddingStage(false);
    }
  };

  const deleteStage = (stageId) => {
    const updatedFunnels = funnels.map(funnel => 
      funnel.id === selectedFunnel 
        ? { ...funnel, stages: funnel.stages.filter(stage => stage.id !== stageId) }
        : funnel
    );
    setFunnels(updatedFunnels);
  };

  const addNewDeal = () => {
    const newDeal = {
      id: Date.now(),
      title: 'Новая сделка',
      company: '',
      contact: '',
      amount: 0,
      stage: currentStages[0]?.id || 'new',
      probability: 10,
      expectedClose: new Date().toISOString().split('T')[0],
      created: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      description: '',
      activities: [],
      fields: {
        source: '',
        budget: '',
        decisionMaker: '',
        nextStep: '',
        notes: ''
      }
    };
    setDeals([...deals, newDeal]);
    setSelectedDeal(newDeal);
    setIsDealModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Сделки</h1>
          <p className="text-gray-600 mt-1">Канбан-доска и управление сделками</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsFunnelSettingsOpen(true)}
            className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <SettingsIcon className="w-5 h-5 text-gray-600" />
            <span>Настройки воронки</span>
          </button>
          <button 
            onClick={addNewDeal}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover-lift flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Новая сделка</span>
          </button>
        </div>
      </div>

      {/* Funnel Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Воронка продаж</label>
            <select
              value={selectedFunnel}
              onChange={(e) => setSelectedFunnel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {funnels.map(funnel => (
                <option key={funnel.id} value={funnel.id}>{funnel.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Поиск сделок</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию, компании..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {currentStages.map((stage, index) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              {/* Stage Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                      {stage.name}
                    </span>
                    <span className="text-sm text-gray-500">({stage.deals.length})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => {
                        setIsAddingStage(true);
                        setNewStageName('');
                      }}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <AddIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Deals List */}
              <div 
                className="p-2 space-y-2 max-h-96 overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {stage.deals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleDealClick(deal)}
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{deal.title}</h3>
                        <p className="text-xs text-gray-600">{deal.company}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(deal.amount)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {deal.probability}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{deal.contact}</span>
                        <span>{new Date(deal.expectedClose).toLocaleDateString('ru-RU')}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${deal.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Funnel Settings Modal */}
      {isFunnelSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Настройки воронки</h2>
                <button
                  onClick={() => setIsFunnelSettingsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Стадии воронки</h3>
                <div className="space-y-3">
                  {currentStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                          {stage.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 rounded-lg hover:bg-gray-200 transition-colors">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button 
                          onClick={() => deleteStage(stage.id)}
                          className="p-1 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isAddingStage && (
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Добавить новую стадию</h4>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Название стадии"
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={addNewStage}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Добавить
                    </button>
                    <button
                      onClick={() => setIsAddingStage(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {!isAddingStage && (
                <button
                  onClick={() => setIsAddingStage(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  + Добавить стадию
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deal Detail Modal */}
      {isDealModalOpen && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDeal.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedDeal.company}</p>
                </div>
                <button
                  onClick={() => setIsDealModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex h-96">
              {/* Left Column - Deal Info */}
              <div className="flex-1 p-6 border-r border-gray-100 overflow-y-auto">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Сумма</label>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedDeal.amount)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Вероятность</label>
                        <p className="text-lg font-bold text-gray-900">{selectedDeal.probability}%</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Контакт</label>
                        <p className="text-gray-900">{selectedDeal.contact}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ожидаемое закрытие</label>
                        <p className="text-gray-900">{new Date(selectedDeal.expectedClose).toLocaleDateString('ru-RU')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительные поля</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedDeal.fields).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {key === 'source' ? 'Источник' : 
                             key === 'budget' ? 'Бюджет' : 
                             key === 'decisionMaker' ? 'Принимающий решение' : 
                             key === 'nextStep' ? 'Следующий шаг' : 
                             key === 'notes' ? 'Заметки' : key}
                          </span>
                          <span className="text-sm text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Описание</h3>
                    <p className="text-gray-700">{selectedDeal.description}</p>
                  </div>
                </div>
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
                    {selectedDeal.activities.map((activity, index) => {
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
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Отмена
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
