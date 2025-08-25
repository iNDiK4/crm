import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  Calendar,
  DollarSign,
  User,
  Building,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Tag,
  Clock,
  TrendingUp,
  Star,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Paperclip,
  MoreHorizontal
} from 'lucide-react';
import { useCrmStore } from '../store/crmStore';
import { useAuthStore } from '../store/authStore';
import { validateDealForm } from '../utils/validation';
import toast from 'react-hot-toast';

const AdvancedDealModal = ({ 
  deal, 
  onClose, 
  currentStages, 
  formatCurrency, 
  getActivityIcon, 
  getActivityColor 
}) => {
  const { updateDeal, addActivity, globalDealFields, addGlobalDealField, removeGlobalDealField, requiredFields, setRequiredFields, addAttachment, removeAttachment } = useCrmStore();
  const { user } = useAuthStore();
  const [editedDeal, setEditedDeal] = useState({ ...deal });
  const [isEditing, setIsEditing] = useState(false);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [errors, setErrors] = useState({});
  const [customFields, setCustomFields] = useState(deal.customFields || deal.fields || {});
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [showAddField, setShowAddField] = useState(false);
  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'note', description: '' });
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [dealScore, setDealScore] = useState(deal.score || 0);
  const actorName = user?.name || 'System';

  // AI-powered deal scoring
  useEffect(() => {
    const calculateDealScore = () => {
      let score = 0;
      
      // Amount factor (0-30 points)
      if (editedDeal.amount > 1000000) score += 30;
      else if (editedDeal.amount > 500000) score += 20;
      else if (editedDeal.amount > 100000) score += 10;
      
      // Probability factor (0-25 points)
      score += Math.round(editedDeal.probability * 0.25);
      
      // Activity factor (0-20 points)
      const recentActivities = editedDeal.activities?.filter(a => 
        new Date(a.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;
      score += Math.min(recentActivities * 5, 20);
      
      // Stage factor (0-15 points)
      const stageIndex = currentStages.findIndex(s => s.id === editedDeal.stage);
      score += Math.round((stageIndex / currentStages.length) * 15);
      
      // Custom fields completeness (0-10 points)
      const filledFields = Object.values(customFields || {}).filter(v => {
        const val = (v && typeof v === 'object' && 'value' in v) ? v.value : v;
        if (val === undefined || val === null) return false;
        const str = String(val);
        return str.trim().length > 0;
      }).length;
      score += Math.min(filledFields * 2, 10);
      
      setDealScore(Math.min(score, 100));
    };
    
    calculateDealScore();
  }, [editedDeal, currentStages, customFields]);

  // Initialize custom fields with global fields when component mounts
  useEffect(() => {
    // Start with existing deal custom fields
    const existingFields = deal.customFields || {};
    
    // Add any global fields that aren't already present
    const mergedFields = { ...existingFields };
    Object.keys(globalDealFields || {}).forEach(fieldName => {
      if (!mergedFields[fieldName]) {
        const globalField = globalDealFields[fieldName];
        mergedFields[fieldName] = {
          value: globalField.defaultValue,
          type: globalField.type
        };
      }
    });
    
    setCustomFields(mergedFields);
  }, [deal, globalDealFields]);

  const fieldTypes = [
    { value: 'text', label: 'Текст' },
    { value: 'number', label: 'Число' },
    { value: 'date', label: 'Дата' },
    { value: 'select', label: 'Список' },
    { value: 'textarea', label: 'Комментарий' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Телефон' },
    { value: 'url', label: 'Ссылка' },
    { value: 'checkbox', label: 'Флажок' },
    { value: 'file', label: 'Файл' }
  ];

  const activityTypes = [
    { value: 'note', label: 'Заметка' },
    { value: 'call', label: 'Звонок' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Встреча' },
    { value: 'task', label: 'Задача' }
  ];

  const handleSave = () => {
    const validation = validateDealForm(editedDeal);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Проверьте правильность заполнения полей');
      return;
    }

    // Enforce required-per-stage custom fields
    const req = requiredFields?.deal?.[editedDeal.stage] || [];
    const missing = req.filter(fieldName => {
      const field = customFields?.[fieldName];
      const val = field && typeof field === 'object' && 'value' in field ? field.value : field;
      return !String(val ?? '').trim();
    });
    if (missing.length) {
      toast.error(`Заполните обязательные поля: ${missing.join(', ')}`);
      return;
    }

    // Normalize positions for custom fields order
    const orderedEntries = Object.entries(customFields).map(([k, v], idx) => {
      const obj = (v && typeof v === 'object') ? v : { value: v, type: 'text' };
      return [k, { ...obj, position: obj.position ?? idx }];
    }).sort((a,b)=> (a[1].position||0)-(b[1].position||0));
    const normalizedFields = Object.fromEntries(orderedEntries);

    const updatedDeal = { 
      ...editedDeal, 
      customFields: normalizedFields, 
      score: dealScore,
      lastActivity: new Date().toISOString().split('T')[0]
    };

    try {
      const result = updateDeal(deal.id, updatedDeal);
      if (result && result.success) {
        toast.success('Сделка сохранена');
        setIsEditing(false);
        setErrors({});
        addActivity('deal', deal.id, { type: 'update', description: 'Изменения сохранены', user: actorName });
      } else {
        toast.error('Ошибка при сохранении сделки');
      }
    } catch (error) {
      console.error('Error saving deal:', error);
      toast.error('Ошибка при сохранении сделки');
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedDeal(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCustomFieldChange = (fieldName, value) => {
    setCustomFields(prev => ({
      ...prev,
      [fieldName]: typeof prev[fieldName] === 'object' 
        ? { ...prev[fieldName], value }
        : { value, type: 'text' }
    }));
  };

  const addCustomField = () => {
    if (!newFieldName.trim()) return;
    
    // Add as global field for all deals
    const result = addGlobalDealField(newFieldName, newFieldType);
    if (result.success) {
      setNewFieldName('');
      setNewFieldType('text');
      setShowAddField(false);
      toast.success('Поле добавлено ко всем сделкам');
    }
  };

  const removeCustomField = (fieldName) => {
    // Remove from all deals globally
    const result = removeGlobalDealField(fieldName);
    if (result.success) {
      toast.success('Поле удалено из всех сделок');
    }
  };

  const addNewActivity = () => {
    if (!newActivity.description.trim()) return;

    const activity = {
      type: newActivity.type,
      description: newActivity.description,
      user: 'Текущий пользователь',
      date: new Date().toISOString().split('T')[0]
    };

    const result = addActivity('deal', deal.id, activity);
    if (result.success) {
      setEditedDeal(prev => ({
        ...prev,
        activities: [...(prev.activities || []), result.data]
      }));
      setNewActivity({ type: 'note', description: '' });
      setShowActivityForm(false);
      toast.success('Активность добавлена');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const renderField = (label, field, type = 'text', options = []) => {
    const error = errors[field];
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {error && <span className="text-red-500 ml-1">*</span>}
        </label>
        {type === 'textarea' ? (
          <textarea
            value={editedDeal[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            disabled={!isEditing}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-200'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
          />
        ) : type === 'select' ? (
          <select
            value={editedDeal[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-200'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={editedDeal[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-200'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
          />
        )}
        {error && (
          <div className="flex items-center space-x-2 mt-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}
      </div>
    );
  };

  const renderCustomField = (fieldName, value) => {
    const def = typeof value === 'object' && value !== null && 'type' in value ? value : { type: 'text', value };
    const error = errors[`custom_${fieldName}`];
    const disabledCls = !isEditing ? 'bg-gray-50' : '';

    return (
      <div key={fieldName} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {fieldName.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <div className="flex items-center space-x-2">
            {isEditing && (
              <>
                <button onClick={() => moveField(fieldName, 'up')} className="text-gray-500 hover:text-gray-700 text-xs">Вверх</button>
                <button onClick={() => moveField(fieldName, 'down')} className="text-gray-500 hover:text-gray-700 text-xs">Вниз</button>
              </>
            )}
            {isEditing && (
              <button
                onClick={() => {
                  const updated = { ...customFields };
                  delete updated[fieldName];
                  setCustomFields(updated);
                  toast.success('Поле удалено');
                }}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {def.type === 'checkbox' ? (
          <input
            type="checkbox"
            checked={def.value || false}
            onChange={(e) => setCustomFields(prev => ({ ...prev, [fieldName]: { ...def, value: e.target.checked } }))}
            disabled={!isEditing}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
        ) : def.type === 'select' ? (
          <select
            value={def.value || ''}
            onChange={(e) => setCustomFields(prev => ({ ...prev, [fieldName]: { ...def, value: e.target.value } }))}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${disabledCls}`}
          >
            {(def.options || []).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : def.type === 'file' ? (
          <div className={`w-full ${!isEditing ? 'opacity-60 pointer-events-none' : ''}`}>
            <input
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                setCustomFields(prev => ({ ...prev, [fieldName]: { ...def, value: { name: file.name, url, size: file.size } } }));
                toast.success('Файл выбран');
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
            {def.value?.name && (
              <div className="text-sm text-gray-600 mt-1">{def.value.name}</div>
            )}
          </div>
        ) : (
          <input
            type={def.type === 'number' ? 'number' : def.type === 'date' ? 'date' : def.type === 'email' ? 'email' : def.type === 'phone' ? 'tel' : def.type === 'url' ? 'url' : 'text'}
            value={def.value || ''}
            onChange={(e) => setCustomFields(prev => ({ ...prev, [fieldName]: { ...def, value: e.target.value } }))}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${disabledCls}`}
          />
        )}
      </div>
    );
  };

  const moveField = (fieldName, direction) => {
    const entries = Object.entries(customFields).map(([k, v]) => [k, { ...(typeof v === 'object' ? v : { value: v, type: 'text' }) }]);
    // ensure positions
    entries.forEach((e, idx) => { if (e[1].position === undefined) e[1].position = idx; });
    entries.sort((a,b)=> (a[1].position||0)-(b[1].position||0));
    const index = entries.findIndex(e => e[0] === fieldName);
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (swapWith < 0 || swapWith >= entries.length) return;
    const tmp = entries[index][1].position;
    entries[index][1].position = entries[swapWith][1].position;
    entries[swapWith][1].position = tmp;
    const next = Object.fromEntries(entries);
    setCustomFields(next);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedDeal.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{editedDeal.title}</h2>
                )}
                <p className="text-gray-600 mt-1">{editedDeal.company}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(dealScore)}`}>
                <Star className="w-4 h-4 inline mr-1" />
                Рейтинг: {dealScore}/100
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                    <Save className="w-4 h-4 inline mr-2" />Сохранить
                  </button>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg">
                    Отмена
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  <Edit3 className="w-4 h-4 inline mr-2" />Редактировать
                </button>
              )}
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Обзор', icon: Eye },
              { id: 'details', label: 'Детали', icon: FileText },
              { id: 'activities', label: 'Активности', icon: MessageSquare },
              { id: 'files', label: 'Файлы', icon: Paperclip }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Название сделки</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedDeal.title || ''}
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          {editedDeal.title || 'Не указано'}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Компания</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedDeal.company || ''}
                          onChange={(e) => handleFieldChange('company', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          {editedDeal.company || 'Не указано'}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Контактное лицо</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedDeal.contact || ''}
                          onChange={(e) => handleFieldChange('contact', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          {editedDeal.contact || 'Не указано'}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Сумма</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedDeal.amount || ''}
                          onChange={(e) => handleFieldChange('amount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          {editedDeal.amount ? `${editedDeal.amount} ₽` : 'Не указано'}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Вероятность (%)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editedDeal.probability || ''}
                          onChange={(e) => handleFieldChange('probability', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          {editedDeal.probability ? `${editedDeal.probability}%` : 'Не указано'}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Ожидаемое закрытие</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedDeal.expectedClose || ''}
                          onChange={(e) => handleFieldChange('expectedClose', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                          {editedDeal.expectedClose ? new Date(editedDeal.expectedClose).toLocaleDateString('ru-RU') : 'Не указано'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Описание</h3>
                  <div className="space-y-2">
                    {isEditing ? (
                      <textarea
                        value={editedDeal.description || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Описание сделки..."
                      />
                    ) : (
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg min-h-[80px]">
                        {editedDeal.description || 'Описание не указано'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Custom Fields */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Дополнительные поля</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Режим: {isEditing ? 'Редактирование' : 'Просмотр'}</span>
                      {isEditing && (
                        <button
                          onClick={() => setShowAddField(true)}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />Добавить поле
                        </button>
                      )}
                      <button
                        onClick={() => setShowRequiredModal(true)}
                        className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
                      >
                        Обязательные поля
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(customFields)
                      .map(([k,v]) => [k, (typeof v === 'object' ? v : { value: v, type: 'text' })])
                      .map((e, idx) => { if (e[1].position === undefined) e[1].position = idx; return e; })
                      .sort((a,b)=> (a[1].position||0)-(b[1].position||0))
                      .map(([fieldName, value]) => renderCustomField(fieldName, value))}
                    {Object.entries(customFields).length === 0 && (
                      <p className="text-gray-500">Нет дополнительных полей. Нажмите "Добавить поле" для создания.</p>
                    )}
                  </div>

                  {showAddField && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <input
                          type="text"
                          placeholder="Название поля"
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          value={newFieldType}
                          onChange={(e) => setNewFieldType(e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          {fieldTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={addCustomField}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          Добавить
                        </button>
                        <button
                          onClick={() => setShowAddField(false)}
                          className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stage Progress */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Прогресс</h3>
                  <div className="space-y-3">
                    {currentStages.map((stage, index) => {
                      const isActive = stage.id === editedDeal.stage;
                      const isCompleted = currentStages.findIndex(s => s.id === editedDeal.stage) >= index;
                      
                      return (
                        <div key={stage.id} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            isActive ? 'bg-blue-500' : isCompleted ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <span className={`text-sm ${
                            isActive ? 'font-medium text-blue-600' : 'text-gray-600'
                          }`}>
                            {stage.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Создана</span>
                      <span className="text-sm font-medium">{new Date(editedDeal.created).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Последняя активность</span>
                      <span className="text-sm font-medium">{new Date(editedDeal.lastActivity).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Активностей</span>
                      <span className="text-sm font-medium">{editedDeal.activities?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Активности</h3>
                <button
                  onClick={() => setShowActivityForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить активность</span>
                </button>
              </div>

              {showActivityForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="space-y-4">
                    <select
                      value={newActivity.type}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {activityTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={newActivity.description}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Описание активности..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={addNewActivity}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Добавить
                      </button>
                      <button
                        onClick={() => setShowActivityForm(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {editedDeal.activities?.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  const activityType = activityTypes.find(t => t.value === activity.type);
                  
                  return (
                    <div key={activity.id || index} className="flex space-x-4 p-4 bg-white rounded-xl border border-gray-100">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        <ActivityIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{activityType?.label}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{activity.user}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-gray-700">{activity.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other tabs content can be added here */}
        </div>
      </div>

      {/* Required fields modal */}
      {showRequiredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Обязательные поля для стадии</h3>
              <button onClick={() => setShowRequiredModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-600">Стадия: {currentStages.find(s=>s.id===editedDeal.stage)?.name}</p>
            <div className="max-h-64 overflow-auto space-y-2">
              {Object.keys(customFields).length === 0 && <div className="text-sm text-gray-500">Нет полей</div>}
              {Object.keys(customFields).map((name) => {
                const checked = (requiredFields?.deal?.[editedDeal.stage] || []).includes(name);
                return (
                  <label key={name} className="flex items-center space-x-2 p-2 border rounded-lg">
                    <input type="checkbox" defaultChecked={checked} onChange={(e)=>{
                      const current = new Set(requiredFields?.deal?.[editedDeal.stage] || []);
                      if (e.target.checked) current.add(name); else current.delete(name);
                      setRequiredFields('deal', editedDeal.stage, Array.from(current));
                    }} />
                    <span className="capitalize">{name}</span>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowRequiredModal(false)} className="px-4 py-2 border rounded-lg">Готово</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedDealModal;
