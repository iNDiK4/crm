import React, { useState } from 'react';
import { 
  X, 
  Edit, 
  Trash2, 
  Plus as PlusIcon,
  Phone,
  Mail,
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const DealModal = ({ 
  deal, 
  onClose, 
  funnels, 
  currentStages, 
  formatCurrency, 
  getActivityIcon, 
  getActivityColor,
  onSave 
}) => {
  const [selectedStage, setSelectedStage] = useState(deal.stage);
  const [selectedFunnel, setSelectedFunnel] = useState('sales');
  const [showStageSelector, setShowStageSelector] = useState(false);
  const [showFunnelSelector, setShowFunnelSelector] = useState(false);
  const [editedDeal, setEditedDeal] = useState({ ...deal });
  const [isEditing, setIsEditing] = useState(false);

  const currentStage = currentStages.find(stage => stage.id === selectedStage);
  const currentFunnel = funnels.find(f => f.id === selectedFunnel);

  const handleSave = () => {
    const updatedDeal = {
      ...editedDeal,
      stage: selectedStage,
      lastActivity: new Date().toISOString().split('T')[0]
    };
    
    if (onSave) {
      onSave(updatedDeal);
    }
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFieldChange = (field, value) => {
    setEditedDeal(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{deal.title}</h2>
              <p className="text-gray-600 mt-1">{deal.company}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Прогресс сделки</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFunnelSelector(!showFunnelSelector)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {currentFunnel?.name}
                {showFunnelSelector ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />}
              </button>
            </div>
          </div>
          
          {/* Funnel Selector Dropdown */}
          {showFunnelSelector && (
            <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="space-y-2">
                {funnels.map(funnel => (
                  <button
                    key={funnel.id}
                    onClick={() => {
                      setSelectedFunnel(funnel.id);
                      setShowFunnelSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedFunnel === funnel.id 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {funnel.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stage Progress */}
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {currentFunnel?.stages.map((stage, index) => {
              const isActive = stage.id === selectedStage;
              const isCompleted = currentFunnel.stages.findIndex(s => s.id === selectedStage) >= index;
              
              return (
                <div key={stage.id} className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedStage(stage.id);
                      setShowStageSelector(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : isCompleted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-sm font-medium">{stage.name}</span>
                    {isActive && <ChevronDown className="w-4 h-4" />}
                  </button>
                  {index < currentFunnel.stages.length - 1 && (
                    <div className={`w-8 h-0.5 ${isCompleted ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  )}
                </div>
              );
            })}
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
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(deal.amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Вероятность</label>
                    <p className="text-lg font-bold text-gray-900">{deal.probability}%</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Контакт</label>
                    <p className="text-gray-900">{deal.contact}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ожидаемое закрытие</label>
                    <p className="text-gray-900">{new Date(deal.expectedClose).toLocaleDateString('ru-RU')}</p>
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительные поля</h3>
                <div className="space-y-3">
                  {Object.entries(deal.fields).map(([key, value]) => (
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
                <p className="text-gray-700">{deal.description}</p>
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
                {deal.activities.map((activity, index) => {
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
              <button 
                onClick={handleEdit}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealModal;
