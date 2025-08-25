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

const LeadModal = ({ 
  lead, 
  onClose, 
  getStatusInfo, 
  getSourceInfo, 
  getScoreColor, 
  getActivityIcon, 
  getActivityColor 
}) => {
  const [selectedStatus, setSelectedStatus] = useState(lead.status);
  const [showStatusSelector, setShowStatusSelector] = useState(false);

  const statuses = [
    { id: 'new', name: 'Новые', color: 'bg-gray-100 text-gray-800' },
    { id: 'contacted', name: 'Связались', color: 'bg-blue-100 text-blue-800' },
    { id: 'qualified', name: 'Квалифицированные', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'converted', name: 'Конвертированные', color: 'bg-green-100 text-green-800' },
    { id: 'lost', name: 'Потерянные', color: 'bg-red-100 text-red-800' }
  ];

  const currentStatus = statuses.find(s => s.id === selectedStatus);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-gray-600 mt-1">{lead.position} в {lead.company}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Status Progress Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Статус лида</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowStatusSelector(!showStatusSelector)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${currentStatus?.color}`}
              >
                {currentStatus?.name}
                {showStatusSelector ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />}
              </button>
            </div>
          </div>
          
          {/* Status Selector Dropdown */}
          {showStatusSelector && (
            <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="space-y-2">
                {statuses.map(status => (
                  <button
                    key={status.id}
                    onClick={() => {
                      setSelectedStatus(status.id);
                      setShowStatusSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${status.color} ${
                      selectedStatus === status.id 
                        ? 'ring-2 ring-blue-500' 
                        : 'hover:opacity-80'
                    }`}
                  >
                    {status.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status Progress */}
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {statuses.map((status, index) => {
              const isActive = status.id === selectedStatus;
              const isCompleted = statuses.findIndex(s => s.id === selectedStatus) >= index;
              
              return (
                <div key={status.id} className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedStatus(status.id);
                      setShowStatusSelector(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                        : isCompleted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-sm font-medium">{status.name}</span>
                    {isActive && <ChevronDown className="w-4 h-4" />}
                  </button>
                  {index < statuses.length - 1 && (
                    <div className={`w-8 h-0.5 ${isCompleted ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex h-96">
          {/* Left Column - Lead Info */}
          <div className="flex-1 p-6 border-r border-gray-100 overflow-y-auto">
            <div className="space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{lead.phone}</span>
                  </div>
                </div>
              </div>

              {/* Lead Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Детали лида</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Источник</label>
                    <p className="text-gray-900">{getSourceInfo(lead.source).name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(lead.status).color}`}>
                      {getStatusInfo(lead.status).name}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Бюджет</label>
                    <p className="text-gray-900">{lead.budget}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Срок</label>
                    <p className="text-gray-900">{lead.timeline}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Оценка</label>
                    <p className={`font-bold ${getScoreColor(lead.score)}`}>{lead.score} баллов</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Описание</h3>
                <p className="text-gray-700">{lead.description}</p>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Заметки</h3>
                <p className="text-gray-700">{lead.notes}</p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
                {lead.activities.map((activity, index) => {
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
              <button 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200">
                Создать сделку
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadModal;
