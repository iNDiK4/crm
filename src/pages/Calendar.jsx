import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Edit,
  Trash2,
  MoreVertical,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';

const Calendar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Встреча с клиентом',
      description: 'Обсуждение проекта CRM системы',
      start: '2024-01-20T10:00:00',
      end: '2024-01-20T11:30:00',
      type: 'meeting',
      attendees: ['Иван Петров', 'Мария Сидорова'],
      location: 'Офис клиента',
      priority: 'high',
      relatedTo: 'Сделка #1'
    },
    {
      id: 2,
      title: 'Демонстрация продукта',
      description: 'Онлайн презентация для потенциального клиента',
      start: '2024-01-22T14:00:00',
      end: '2024-01-22T15:00:00',
      type: 'demo',
      attendees: ['Алексей Козлов'],
      location: 'Zoom',
      priority: 'medium',
      relatedTo: 'Лид #2'
    },
    {
      id: 3,
      title: 'Планирование недели',
      description: 'Еженедельная встреча команды',
      start: '2024-01-23T09:00:00',
      end: '2024-01-23T10:00:00',
      type: 'internal',
      attendees: ['Вся команда'],
      location: 'Конференц-зал',
      priority: 'low',
      relatedTo: 'Внутреннее'
    }
  ]);

  const eventTypes = [
    { id: 'all', name: 'Все события', color: 'bg-gray-100 text-gray-800' },
    { id: 'meeting', name: 'Встречи', color: 'bg-blue-100 text-blue-800' },
    { id: 'demo', name: 'Демонстрации', color: 'bg-green-100 text-green-800' },
    { id: 'internal', name: 'Внутренние', color: 'bg-purple-100 text-purple-800' }
  ];

  const priorities = [
    { id: 'low', name: 'Низкий', color: 'bg-green-100 text-green-800' },
    { id: 'medium', name: 'Средний', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: 'Высокий', color: 'bg-red-100 text-red-800' }
  ];

  const getEventTypeInfo = (typeKey) => {
    return eventTypes.find(type => type.id === typeKey) || eventTypes[0];
  };

  const getPriorityInfo = (priorityKey) => {
    return priorities.find(priority => priority.id === priorityKey) || priorities[0];
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'demo': return 'bg-green-500';
      case 'internal': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent({ ...event });
    setIsEditingEvent(true);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      const updatedEvents = events.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      );
      setEvents(updatedEvents);
      setSelectedEvent(editingEvent);
      setIsEditingEvent(false);
      setEditingEvent(null);
    }
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const addNewEvent = () => {
    const newEvent = {
      id: Date.now(),
      title: '',
      description: '',
      start: new Date().toISOString().slice(0, 16),
      end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
      type: 'meeting',
      attendees: [],
      location: '',
      priority: 'medium',
      relatedTo: ''
    };
    setEvents([...events, newEvent]);
    setEditingEvent(newEvent);
    setIsEditingEvent(true);
    setIsEventModalOpen(true);
  };

  const currentEvent = isEditingEvent ? editingEvent : selectedEvent;

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get calendar data
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.start).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Календарь</h1>
          <p className="text-gray-600 mt-1">Управление событиями и встречами</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={addNewEvent}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover-lift flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Новое событие</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Сегодня
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
            <div key={index} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const isToday = day && day.toDateString() === new Date().toDateString();
            const isCurrentMonth = day && day.getMonth() === currentDate.getMonth();
            const dayEvents = getEventsForDate(day);

            return (
              <div
                key={index}
                className={`min-h-32 p-2 border border-gray-100 ${
                  isToday ? 'bg-blue-50 border-blue-200' : 'bg-white'
                } ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-2 ${
                      isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                            getEventTypeColor(event.type)
                          } text-white truncate`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayEvents.length - 3} еще
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ближайшие события</h3>
        <div className="space-y-4">
          {events
            .filter(event => new Date(event.start) >= new Date())
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5)
            .map((event) => {
              const eventTypeInfo = getEventTypeInfo(event.type);
              const priorityInfo = getPriorityInfo(event.priority);
              
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(event.start).toLocaleDateString('ru-RU')} {new Date(event.start).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                      {priorityInfo.name}
                    </span>
                    <button 
                      className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEvent(event);
                      }}
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {isEventModalOpen && currentEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditingEvent ? 'Редактирование события' : currentEvent.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {isEditingEvent ? 'Измените информацию о событии' : `${new Date(currentEvent.start).toLocaleDateString('ru-RU')} ${new Date(currentEvent.start).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEventModalOpen(false);
                    setIsEditingEvent(false);
                    setEditingEvent(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {isEditingEvent ? (
                <div className="space-y-6">
                  {/* Edit Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                    <input
                      type="text"
                      value={currentEvent.title}
                      onChange={(e) => setEditingEvent({...currentEvent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                    <textarea
                      value={currentEvent.description}
                      onChange={(e) => setEditingEvent({...currentEvent, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Начало</label>
                      <input
                        type="datetime-local"
                        value={currentEvent.start}
                        onChange={(e) => setEditingEvent({...currentEvent, start: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Окончание</label>
                      <input
                        type="datetime-local"
                        value={currentEvent.end}
                        onChange={(e) => setEditingEvent({...currentEvent, end: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Тип события</label>
                      <select
                        value={currentEvent.type}
                        onChange={(e) => setEditingEvent({...currentEvent, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {eventTypes.filter(t => t.id !== 'all').map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                      <select
                        value={currentEvent.priority}
                        onChange={(e) => setEditingEvent({...currentEvent, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {priorities.map(priority => (
                          <option key={priority.id} value={priority.id}>{priority.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Место проведения</label>
                    <input
                      type="text"
                      value={currentEvent.location}
                      onChange={(e) => setEditingEvent({...currentEvent, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Связано с</label>
                    <input
                      type="text"
                      value={currentEvent.relatedTo}
                      onChange={(e) => setEditingEvent({...currentEvent, relatedTo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Event Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о событии</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                        <p className="text-gray-900">{currentEvent.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Начало</label>
                          <p className="text-gray-900">
                            {new Date(currentEvent.start).toLocaleDateString('ru-RU')} {new Date(currentEvent.start).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Окончание</label>
                          <p className="text-gray-900">
                            {new Date(currentEvent.end).toLocaleDateString('ru-RU')} {new Date(currentEvent.end).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Тип</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeInfo(currentEvent.type).color}`}>
                            {getEventTypeInfo(currentEvent.type).name}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityInfo(currentEvent.priority).color}`}>
                            {getPriorityInfo(currentEvent.priority).name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendees */}
                  {currentEvent.attendees.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Участники</h3>
                      <div className="space-y-2">
                        {currentEvent.attendees.map((attendee, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{attendee}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {currentEvent.location && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Место проведения</h3>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{currentEvent.location}</span>
                      </div>
                    </div>
                  )}

                  {/* Related */}
                  {currentEvent.relatedTo && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Связано с</h3>
                      <p className="text-gray-900">{currentEvent.relatedTo}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {!isEditingEvent && (
                    <button 
                      onClick={() => handleEditEvent(currentEvent)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteEvent(currentEvent.id)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setIsEventModalOpen(false);
                      setIsEditingEvent(false);
                      setEditingEvent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  {isEditingEvent && (
                    <button 
                      onClick={handleSaveEvent}
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

export default Calendar;
