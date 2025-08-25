import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  Tag,
  Edit,
  Trash2,
  MoreVertical,
  X,
  Save,
  Star
} from 'lucide-react';

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Mock tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Подготовить коммерческое предложение',
      description: 'Создать детальное КП для клиента ООО "Технологии будущего"',
      status: 'in_progress',
      priority: 'high',
      assignee: 'Иван Петров',
      dueDate: '2024-01-25',
      created: '2024-01-15',
      tags: ['Продажи', 'КП'],
      relatedTo: 'Сделка #1',
      timeEstimate: '4 часа',
      timeSpent: '2 часа'
    },
    {
      id: 2,
      title: 'Провести демонстрацию продукта',
      description: 'Онлайн демонстрация CRM системы для потенциального клиента',
      status: 'pending',
      priority: 'medium',
      assignee: 'Мария Сидорова',
      dueDate: '2024-01-22',
      created: '2024-01-16',
      tags: ['Демо', 'Встреча'],
      relatedTo: 'Лид #2',
      timeEstimate: '2 часа',
      timeSpent: '0 часов'
    },
    {
      id: 3,
      title: 'Анализ конкурентов',
      description: 'Исследование конкурентных преимуществ и недостатков',
      status: 'completed',
      priority: 'low',
      assignee: 'Алексей Козлов',
      dueDate: '2024-01-20',
      created: '2024-01-10',
      tags: ['Анализ', 'Исследование'],
      relatedTo: 'Проект #3',
      timeEstimate: '8 часов',
      timeSpent: '8 часов'
    }
  ]);

  const statuses = [
    { id: 'all', name: 'Все статусы', color: 'bg-gray-100 text-gray-800' },
    { id: 'pending', name: 'Ожидает', color: 'bg-yellow-100 text-yellow-800', count: tasks.filter(t => t.status === 'pending').length },
    { id: 'in_progress', name: 'В работе', color: 'bg-blue-100 text-blue-800', count: tasks.filter(t => t.status === 'in_progress').length },
    { id: 'completed', name: 'Завершено', color: 'bg-green-100 text-green-800', count: tasks.filter(t => t.status === 'completed').length },
    { id: 'cancelled', name: 'Отменено', color: 'bg-red-100 text-red-800', count: tasks.filter(t => t.status === 'cancelled').length }
  ];

  const priorities = [
    { id: 'all', name: 'Все приоритеты', color: 'bg-gray-100 text-gray-800' },
    { id: 'low', name: 'Низкий', color: 'bg-green-100 text-green-800' },
    { id: 'medium', name: 'Средний', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'Высокий', color: 'bg-red-100 text-red-800' }
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusInfo = (statusKey) => {
    return statuses.find(status => status.id === statusKey) || statuses[0];
  };

  const getPriorityInfo = (priorityKey) => {
    return priorities.find(priority => priority.id === priorityKey) || priorities[0];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in_progress': return 'text-blue-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask({ ...task });
    setIsEditingTask(true);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = () => {
    if (editingTask) {
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id ? editingTask : task
      );
      setTasks(updatedTasks);
      setSelectedTask(editingTask);
      setIsEditingTask(false);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  const addNewTask = () => {
    const newTask = {
      id: Date.now(),
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      assignee: '',
      dueDate: new Date().toISOString().split('T')[0],
      created: new Date().toISOString().split('T')[0],
      tags: [],
      relatedTo: '',
      timeEstimate: '',
      timeSpent: '0 часов'
    };
    setTasks([...tasks, newTask]);
    setEditingTask(newTask);
    setIsEditingTask(true);
    setIsTaskModalOpen(true);
  };

  const currentTask = isEditingTask ? editingTask : selectedTask;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Задачи</h1>
          <p className="text-gray-600 mt-1">Управление задачами и проектами</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={addNewTask}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover-lift flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Новая задача</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего задач</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{tasks.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">В работе</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {tasks.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Завершено</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Просрочено</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Поиск задач</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию, описанию, исполнителю..."
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
              {statuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Приоритет</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>{priority.name}</option>
              ))}
            </select>
          </div>

          <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const statusInfo = getStatusInfo(task.status);
          const priorityInfo = getPriorityInfo(task.priority);
          const StatusIcon = getStatusIcon(task.status);
          const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
          
          return (
            <div
              key={task.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover-lift cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                        {priorityInfo.name}
                      </span>
                      <button 
                        className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task);
                        }}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{task.assignee}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{task.timeEstimate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{task.relatedTo}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="ml-4 flex flex-col items-center space-y-2">
                  <StatusIcon className={`w-6 h-6 ${getStatusColor(task.status)}`} />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {isTaskModalOpen && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditingTask ? 'Редактирование задачи' : currentTask.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {isEditingTask ? 'Измените информацию о задаче' : `Исполнитель: ${currentTask.assignee}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsTaskModalOpen(false);
                    setIsEditingTask(false);
                    setEditingTask(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {isEditingTask ? (
                <div className="space-y-6">
                  {/* Edit Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                    <input
                      type="text"
                      value={currentTask.title}
                      onChange={(e) => setEditingTask({...currentTask, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                    <textarea
                      value={currentTask.description}
                      onChange={(e) => setEditingTask({...currentTask, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Исполнитель</label>
                      <input
                        type="text"
                        value={currentTask.assignee}
                        onChange={(e) => setEditingTask({...currentTask, assignee: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Срок выполнения</label>
                      <input
                        type="date"
                        value={currentTask.dueDate}
                        onChange={(e) => setEditingTask({...currentTask, dueDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                      <select
                        value={currentTask.status}
                        onChange={(e) => setEditingTask({...currentTask, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {statuses.filter(s => s.id !== 'all').map(status => (
                          <option key={status.id} value={status.id}>{status.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                      <select
                        value={currentTask.priority}
                        onChange={(e) => setEditingTask({...currentTask, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {priorities.filter(p => p.id !== 'all').map(priority => (
                          <option key={priority.id} value={priority.id}>{priority.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Связано с</label>
                    <input
                      type="text"
                      value={currentTask.relatedTo}
                      onChange={(e) => setEditingTask({...currentTask, relatedTo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Оценка времени</label>
                      <input
                        type="text"
                        value={currentTask.timeEstimate}
                        onChange={(e) => setEditingTask({...currentTask, timeEstimate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Затрачено времени</label>
                      <input
                        type="text"
                        value={currentTask.timeSpent}
                        onChange={(e) => setEditingTask({...currentTask, timeSpent: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Task Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о задаче</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                        <p className="text-gray-900">{currentTask.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Исполнитель</label>
                          <p className="text-gray-900">{currentTask.assignee}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Срок выполнения</label>
                          <p className="text-gray-900">{new Date(currentTask.dueDate).toLocaleDateString('ru-RU')}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(currentTask.status).color}`}>
                            {getStatusInfo(currentTask.status).name}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityInfo(currentTask.priority).color}`}>
                            {getPriorityInfo(currentTask.priority).name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Tracking */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Учет времени</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Оценка времени</p>
                        <p className="text-lg font-bold text-gray-900">{currentTask.timeEstimate}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Затрачено времени</p>
                        <p className="text-lg font-bold text-gray-900">{currentTask.timeSpent}</p>
                      </div>
                    </div>
                  </div>

                  {/* Related */}
                  {currentTask.relatedTo && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Связано с</h3>
                      <p className="text-gray-900">{currentTask.relatedTo}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {currentTask.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Теги</h3>
                      <div className="flex flex-wrap gap-1">
                        {currentTask.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {!isEditingTask && (
                    <button 
                      onClick={() => handleEditTask(currentTask)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteTask(currentTask.id)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setIsTaskModalOpen(false);
                      setIsEditingTask(false);
                      setEditingTask(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  {isEditingTask && (
                    <button 
                      onClick={handleSaveTask}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                      Сохранить
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

export default Tasks;
