import React, { useState, useEffect } from 'react';
import { 
  X, Edit3, Save, Plus, Trash2, Calendar, User, Building, Phone, Mail, MessageSquare,
  FileText, Tag, Clock, TrendingUp, Star, AlertCircle, CheckCircle, Eye, Target, Zap, Award, Activity, Paperclip
} from 'lucide-react';
import { useCrmStore } from '../store/crmStore';
import { useAuthStore } from '../store/authStore';
import { validateLeadForm } from '../utils/validation';
import toast from 'react-hot-toast';

const AdvancedLeadModal = ({ lead, onClose, getStatusInfo, getSourceInfo, getActivityIcon, getActivityColor }) => {
  const { updateLead, addActivity, convertLeadToDeal, requiredFields, setRequiredFields, addAttachment, removeAttachment } = useCrmStore();
  const { user } = useAuthStore();
  const [editedLead, setEditedLead] = useState({ ...lead });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [errors, setErrors] = useState({});
  const [customFields, setCustomFields] = useState(lead.customFields || {});
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [showAddField, setShowAddField] = useState(false);
  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [newActivity, setNewActivity] = useState({ type: 'note', description: '' });
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [leadScore, setLeadScore] = useState(lead.score || 0);
  const actorName = user?.name || 'System';

  useEffect(() => {
    const calculateLeadScore = () => {
      let score = 0;
      const contactFields = [editedLead.name, editedLead.email, editedLead.phone, editedLead.company];
      const filledContactFields = contactFields.filter(field => field && field.trim()).length;
      score += Math.round((filledContactFields / contactFields.length) * 25);
      
      const recentActivities = editedLead.activities?.filter(a => 
        new Date(a.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;
      score += Math.min(recentActivities * 5, 20);
      
      if (editedLead.status === 'qualified') score += 20;
      else if (editedLead.status === 'contacted') score += 10;
      else if (editedLead.status === 'new') score += 5;
      
      setLeadScore(Math.min(score, 100));
    };
    calculateLeadScore();
  }, [editedLead]);

  const statusOptions = [
    { value: 'new', label: 'Новый' },
    { value: 'contacted', label: 'Связались' },
    { value: 'qualified', label: 'Квалифицированный' },
    { value: 'converted', label: 'Конвертированный' },
    { value: 'lost', label: 'Потерянный' }
  ];

  const sourceOptions = [
    { value: 'website', label: 'Веб-сайт' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'conference', label: 'Конференция' },
    { value: 'recommendation', label: 'Рекомендации' },
    { value: 'advertising', label: 'Реклама' }
  ];

  const handleSave = () => {
    const validation = validateLeadForm(editedLead);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Проверьте правильность заполнения полей');
      return;
    }

    // Enforce required-per-status custom fields
    const req = requiredFields?.lead?.[editedLead.status] || [];
    const missing = req.filter(fieldName => {
      const field = customFields?.[fieldName];
      const val = field && typeof field === 'object' && 'value' in field ? field.value : field;
      return !String(val ?? '').trim();
    });
    if (missing.length) {
      toast.error(`Заполните обязательные поля: ${missing.join(', ')}`);
      return;
    }

    // Normalize positions/types for custom fields
    const orderedEntries = Object.entries(customFields).map(([k,v], idx) => {
      const obj = (v && typeof v === 'object') ? v : { value: v, type: 'text' };
      return [k, { ...obj, position: obj.position ?? idx }];
    }).sort((a,b)=> (a[1].position||0)-(b[1].position||0));
    const normalizedFields = Object.fromEntries(orderedEntries);

    const updatedLead = { 
      ...editedLead, 
      customFields: normalizedFields, 
      score: leadScore,
      lastContact: new Date().toISOString().split('T')[0]
    };
    const result = updateLead(lead.id, updatedLead, actorName);
    if (result.success) {
      toast.success('Лид сохранен');
      setIsEditing(false);
      setErrors({});
      addActivity('lead', lead.id, { type: 'update', description: 'Изменения сохранены', user: actorName });
    }
  };

  const handleConvertToDeal = () => {
    const result = convertLeadToDeal(lead.id);
    if (result.success) {
      toast.success('Лид конвертирован в сделку');
      onClose();
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedLead(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

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

  const addCustomField = () => {
    if (!newFieldName.trim()) return;
    setCustomFields(prev => ({
      ...prev,
      [newFieldName]: { value: '', type: newFieldType, position: Object.keys(prev).length }
    }));
    setNewFieldName('');
    setNewFieldType('text');
    setShowAddField(false);
    toast.success('Поле добавлено');
  };

  const getLeadScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
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
        {type === 'select' ? (
          <select
            value={editedLead[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : ''}`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={editedLead[field] || ''}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : ''}`}
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

  const moveField = (fieldName, direction) => {
    const entries = Object.entries(customFields).map(([k, v]) => [k, { ...(typeof v === 'object' ? v : { value: v, type: 'text' }) }]);
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

  const renderCustomField = (fieldName, value) => {
    const def = typeof value === 'object' && value !== null && 'type' in value ? value : { type: 'text', value };
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
        ) : def.type === 'textarea' ? (
          <textarea
            value={def.value || ''}
            onChange={(e) => setCustomFields(prev => ({ ...prev, [fieldName]: { ...def, value: e.target.value } }))}
            disabled={!isEditing}
            rows={3}
            className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${disabledCls}`}
          />
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{editedLead.name}</h2>
                <p className="text-gray-600 mt-1">{editedLead.company} • {editedLead.position}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getLeadScoreColor(leadScore)}`}>
                <Target className="w-4 h-4 inline mr-1" />
                Рейтинг: {leadScore}/100
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {editedLead.status === 'qualified' && (
                <button
                  onClick={handleConvertToDeal}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Конвертировать</span>
                </button>
              )}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('Имя', 'name')}
                  {renderField('Компания', 'company')}
                  {renderField('Email', 'email', 'email')}
                  {renderField('Телефон', 'phone', 'tel')}
                  {renderField('Статус', 'status', 'select', statusOptions)}
                  {renderField('Источник', 'source', 'select', sourceOptions)}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Дополнительные поля</h3>
                  <div className="flex items-center space-x-2">
                    {isEditing && (
                      <button
                        onClick={() => setShowAddField(true)}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg"
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
                
                <div className="space-y-4 mb-4">
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
                  <div className="mb-4 p-4 border rounded-lg bg-white">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        placeholder="Название поля"
                        value={newFieldName}
                        onChange={(e) => setNewFieldName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        {fieldTypes.map(ft => (
                          <option key={ft.value} value={ft.value}>{ft.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={addCustomField} className="px-3 py-1 bg-green-500 text-white rounded-lg">
                        Добавить
                      </button>
                      <button onClick={() => setShowAddField(false)} className="px-3 py-1 border rounded-lg">
                        Отмена
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Оценка лида</h3>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${getLeadScoreColor(leadScore)}`}>
                    {leadScore}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">из 100 баллов</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Файлы</h3>
                  <label className="px-3 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
                    Загрузить файл
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const url = URL.createObjectURL(f);
                        addAttachment('lead', lead.id, { name: f.name, url, size: f.size, user: actorName });
                        toast.success('Файл загружен');
                      }}
                    />
                  </label>
                </div>
                <div className="space-y-3">
                  {(lead.attachments || []).length === 0 && (
                    <p className="text-gray-500">Файлы не прикреплены</p>
                  )}
                  {(lead.attachments || []).map(file => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{file.name}</div>
                        <div className="text-xs text-gray-500">{Math.round((file.size||0)/1024)} KB • {new Date(file.uploadedAt).toLocaleString('ru-RU')}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a href={file.url} target="_blank" rel="noreferrer" className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50">Открыть</a>
                        <button onClick={() => removeAttachment('lead', lead.id, file.id, actorName)} className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50">Удалить</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Последний контакт</span>
                    <span className="text-sm font-medium">{new Date(editedLead.lastContact).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Активностей</span>
                    <span className="text-sm font-medium">{editedLead.activities?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Required fields modal */}
      {showRequiredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Обязательные поля для статуса</h3>
              <button onClick={() => setShowRequiredModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-600">Статус: {statusOptions.find(s=>s.value===editedLead.status)?.label}</p>
            <div className="max-h-64 overflow-auto space-y-2">
              {Object.keys(customFields).length === 0 && <div className="text-sm text-gray-500">Нет полей</div>}
              {Object.keys(customFields).map((name) => {
                const checked = (requiredFields?.lead?.[editedLead.status] || []).includes(name);
                return (
                  <label key={name} className="flex items-center space-x-2 p-2 border rounded-lg">
                    <input type="checkbox" defaultChecked={checked} onChange={(e)=>{
                      const current = new Set(requiredFields?.lead?.[editedLead.status] || []);
                      if (e.target.checked) current.add(name); else current.delete(name);
                      setRequiredFields('lead', editedLead.status, Array.from(current));
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

export default AdvancedLeadModal;
