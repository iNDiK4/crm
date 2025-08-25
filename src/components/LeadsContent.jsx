import React from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Target,
  Mail,
  Phone,
  Star
} from 'lucide-react';

const LeadsContent = ({
  leads,
  statuses,
  sources,
  selectedStatus,
  setSelectedStatus,
  selectedSource,
  setSelectedSource,
  searchTerm,
  setSearchTerm,
  handleLeadClick,
  getStatusInfo,
  getSourceInfo,
  getScoreColor
}) => {
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <>
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
                        // handleEditLead(lead);
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
    </>
  );
};

export default LeadsContent;
