import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Clock, 
  Mail, 
  Phone, 
  MessageSquare, 
  Bell,
  Calendar,
  Target,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react';
import { useCrmStore } from '../store/crmStore';
import toast from 'react-hot-toast';

const WorkflowAutomation = () => {
  const { deals, leads, addActivity } = useCrmStore();
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Автоматический follow-up для новых лидов',
      description: 'Отправляет welcome email через 1 час после создания лида',
      trigger: 'lead_created',
      actions: [
        { type: 'wait', duration: '1 hour' },
        { type: 'send_email', template: 'welcome_lead' }
      ],
      isActive: true,
      stats: { triggered: 45, completed: 42 }
    },
    {
      id: 2,
      name: 'Напоминание о звонке',
      description: 'Создает задачу для звонка, если лид не контактировал 3 дня',
      trigger: 'lead_no_contact_3_days',
      actions: [
        { type: 'create_task', title: 'Позвонить лиду', priority: 'high' },
        { type: 'notify_manager' }
      ],
      isActive: true,
      stats: { triggered: 23, completed: 20 }
    },
    {
      id: 3,
      name: 'Автоматическая квалификация',
      description: 'Переводит лид в статус "квалифицированный" при достижении 80+ баллов',
      trigger: 'lead_score_80_plus',
      actions: [
        { type: 'update_status', status: 'qualified' },
        { type: 'assign_to_sales' },
        { type: 'create_task', title: 'Провести демо' }
      ],
      isActive: false,
      stats: { triggered: 12, completed: 11 }
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: '',
    actions: []
  });

  const triggerOptions = [
    { value: 'lead_created', label: 'Создан новый лид' },
    { value: 'deal_created', label: 'Создана новая сделка' },
    { value: 'lead_score_changed', label: 'Изменился рейтинг лида' },
    { value: 'deal_stage_changed', label: 'Изменилась стадия сделки' },
    { value: 'no_activity_days', label: 'Нет активности N дней' },
    { value: 'email_opened', label: 'Открыт email' },
    { value: 'form_submitted', label: 'Отправлена форма' }
  ];

  const actionOptions = [
    { value: 'send_email', label: 'Отправить email', icon: Mail },
    { value: 'create_task', label: 'Создать задачу', icon: CheckCircle },
    { value: 'update_status', label: 'Изменить статус', icon: Target },
    { value: 'assign_user', label: 'Назначить пользователя', icon: Users },
    { value: 'send_notification', label: 'Отправить уведомление', icon: Bell },
    { value: 'schedule_call', label: 'Запланировать звонок', icon: Phone },
    { value: 'wait', label: 'Ожидание', icon: Clock }
  ];

  const toggleWorkflow = (id) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ));
    const workflow = workflows.find(w => w.id === id);
    toast.success(`Воркфлоу "${workflow.name}" ${workflow.isActive ? 'отключен' : 'включен'}`);
  };

  const duplicateWorkflow = (workflow) => {
    const newWorkflow = {
      ...workflow,
      id: Math.max(...workflows.map(w => w.id)) + 1,
      name: `${workflow.name} (копия)`,
      stats: { triggered: 0, completed: 0 }
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    toast.success('Воркфлоу скопирован');
  };

  const deleteWorkflow = (id) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    toast.success('Воркфлоу удален');
  };

  const getActionIcon = (actionType) => {
    const action = actionOptions.find(a => a.value === actionType);
    return action ? action.icon : CheckCircle;
  };

  const getSuccessRate = (stats) => {
    if (stats.triggered === 0) return 0;
    return Math.round((stats.completed / stats.triggered) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Автоматизация</h2>
          <p className="text-gray-600 mt-1">Настройте автоматические процессы для повышения эффективности</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Создать воркфлоу</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Активные воркфлоу</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{workflows.filter(w => w.isActive).length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Выполнено сегодня</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {workflows.reduce((sum, w) => sum + w.stats.completed, 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Средняя эффективность</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(workflows.reduce((sum, w) => sum + getSuccessRate(w.stats), 0) / workflows.length)}%
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Время экономии</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">24ч</p>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workflow.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workflow.isActive ? 'Активен' : 'Отключен'}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{workflow.description}</p>
                
                {/* Workflow Steps */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Триггер: {triggerOptions.find(t => t.value === workflow.trigger)?.label}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center space-x-1">
                    {workflow.actions.map((action, index) => {
                      const Icon = getActionIcon(action.type);
                      return (
                        <div key={index} className="flex items-center space-x-1">
                          <div className="p-1 bg-gray-100 rounded">
                            <Icon className="w-3 h-3 text-gray-600" />
                          </div>
                          {index < workflow.actions.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Play className="w-4 h-4" />
                    <span>Запущено: {workflow.stats.triggered}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Завершено: {workflow.stats.completed}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>Эффективность: {getSuccessRate(workflow.stats)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleWorkflow(workflow.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    workflow.isActive
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {workflow.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => duplicateWorkflow(workflow)}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteWorkflow(workflow.id)}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Templates */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Готовые шаблоны</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
            <div className="flex items-center space-x-3 mb-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium">Email-последовательность</h4>
            </div>
            <p className="text-sm text-gray-600">Серия писем для nurturing лидов</p>
          </div>
          
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
            <div className="flex items-center space-x-3 mb-2">
              <Phone className="w-5 h-5 text-green-500" />
              <h4 className="font-medium">Напоминания о звонках</h4>
            </div>
            <p className="text-sm text-gray-600">Автоматические напоминания менеджерам</p>
          </div>
          
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <h4 className="font-medium">Скоринг лидов</h4>
            </div>
            <p className="text-sm text-gray-600">Автоматическая оценка качества лидов</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowAutomation;
