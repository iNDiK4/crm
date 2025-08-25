import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Star,
  Edit,
  Trash2,
  MoreVertical,
  X,
  Save
} from 'lucide-react';

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Mock contacts data
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Иван Петров',
      email: 'ivan.petrov@company.ru',
      phone: '+7 (999) 123-45-67',
      position: 'Генеральный директор',
      company: 'ООО "Технологии будущего"',
      department: 'Руководство',
      address: 'г. Москва, ул. Тверская, д. 1',
      birthday: '1985-03-15',
      notes: 'Ключевой контакт для переговоров',
      tags: ['VIP', 'Руководитель'],
      deals: 3,
      totalValue: 2500000
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      email: 'maria.sidorova@innovations.com',
      phone: '+7 (999) 234-56-78',
      position: 'CTO',
      company: 'Стартап "Инновации"',
      department: 'IT',
      address: 'г. Санкт-Петербург, Невский пр., д. 50',
      birthday: '1990-07-22',
      notes: 'Технический эксперт, интересуется новыми технологиями',
      tags: ['Технический', 'Стартап'],
      deals: 2,
      totalValue: 1800000
    }
  ]);

  const companies = [
    { id: 'all', name: 'Все компании', count: contacts.length },
    { id: 'tech', name: 'ООО "Технологии будущего"', count: contacts.filter(c => c.company.includes('Технологии')).length },
    { id: 'startup', name: 'Стартап "Инновации"', count: contacts.filter(c => c.company.includes('Инновации')).length }
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = selectedCompany === 'all' || 
                          (selectedCompany === 'tech' && contact.company.includes('Технологии')) ||
                          (selectedCompany === 'startup' && contact.company.includes('Инновации'));
    
    return matchesSearch && matchesCompany;
  });

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact({ ...contact });
    setIsEditingContact(true);
    setIsContactModalOpen(true);
  };

  const handleSaveContact = () => {
    if (editingContact) {
      const updatedContacts = contacts.map(contact => 
        contact.id === editingContact.id ? editingContact : contact
      );
      setContacts(updatedContacts);
      setSelectedContact(editingContact);
      setIsEditingContact(false);
      setEditingContact(null);
    }
  };

  const handleDeleteContact = (contactId) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    setContacts(updatedContacts);
    setIsContactModalOpen(false);
    setSelectedContact(null);
  };

  const addNewContact = () => {
    const newContact = {
      id: Date.now(),
      name: '',
      email: '',
      phone: '',
      position: '',
      company: '',
      department: '',
      address: '',
      birthday: '',
      notes: '',
      tags: [],
      deals: 0,
      totalValue: 0
    };
    setContacts([...contacts, newContact]);
    setEditingContact(newContact);
    setIsEditingContact(true);
    setIsContactModalOpen(true);
  };

  const currentContact = isEditingContact ? editingContact : selectedContact;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Контакты</h1>
          <p className="text-gray-600 mt-1">Управление контактами и клиентами</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={addNewContact}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover-lift flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Новый контакт</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего контактов</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{contacts.length}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активные сделки</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contacts.reduce((sum, contact) => sum + contact.deals, 0)}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Star className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общая стоимость</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0
                }).format(contacts.reduce((sum, contact) => sum + contact.totalValue, 0))}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Building className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Компаний</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(contacts.map(c => c.company)).size}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Поиск контактов</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени, email, компании..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Компания</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover-lift cursor-pointer"
            onClick={() => handleContactClick(contact)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.position}</p>
                  <p className="text-sm text-gray-500">{contact.company}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {contact.tags.includes('VIP') && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  <button 
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditContact(contact);
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
                  <span className="text-sm text-gray-600">{contact.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{contact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{contact.department}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{contact.deals}</p>
                  <p className="text-xs text-gray-500">сделок</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                      minimumFractionDigits: 0
                    }).format(contact.totalValue)}
                  </p>
                  <p className="text-xs text-gray-500">стоимость</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {contact.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Detail Modal */}
      {isContactModalOpen && currentContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditingContact ? 'Редактирование контакта' : currentContact.name}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {isEditingContact ? 'Измените информацию о контакте' : `${currentContact.position} в ${currentContact.company}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsContactModalOpen(false);
                    setIsEditingContact(false);
                    setEditingContact(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96">
              {isEditingContact ? (
                <div className="space-y-6">
                  {/* Edit Form */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                      <input
                        type="text"
                        value={currentContact.name}
                        onChange={(e) => setEditingContact({...currentContact, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={currentContact.email}
                        onChange={(e) => setEditingContact({...currentContact, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                      <input
                        type="text"
                        value={currentContact.phone}
                        onChange={(e) => setEditingContact({...currentContact, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                      <input
                        type="text"
                        value={currentContact.position}
                        onChange={(e) => setEditingContact({...currentContact, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                      <input
                        type="text"
                        value={currentContact.company}
                        onChange={(e) => setEditingContact({...currentContact, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Отдел</label>
                      <input
                        type="text"
                        value={currentContact.department}
                        onChange={(e) => setEditingContact({...currentContact, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                    <input
                      type="text"
                      value={currentContact.address}
                      onChange={(e) => setEditingContact({...currentContact, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
                    <input
                      type="date"
                      value={currentContact.birthday}
                      onChange={(e) => setEditingContact({...currentContact, birthday: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
                    <textarea
                      value={currentContact.notes}
                      onChange={(e) => setEditingContact({...currentContact, notes: e.target.value})}
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
                        <span className="text-gray-900">{currentContact.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{currentContact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{currentContact.department}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{currentContact.address}</span>
                      </div>
                      {currentContact.birthday && (
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {new Date(currentContact.birthday).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-gray-900">{currentContact.deals}</p>
                        <p className="text-sm text-gray-600">Активных сделок</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-gray-900">
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            minimumFractionDigits: 0
                          }).format(currentContact.totalValue)}
                        </p>
                        <p className="text-sm text-gray-600">Общая стоимость</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {currentContact.notes && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Заметки</h3>
                      <p className="text-gray-700">{currentContact.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {!isEditingContact && (
                    <button 
                      onClick={() => handleEditContact(currentContact)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteContact(currentContact.id)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      setIsContactModalOpen(false);
                      setIsEditingContact(false);
                      setEditingContact(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  {isEditingContact && (
                    <button 
                      onClick={handleSaveContact}
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

export default Contacts;
