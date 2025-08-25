import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Plus as AddIcon,
  X,
  Edit,
  Trash2
} from 'lucide-react';

const DealsContent = ({
  deals,
  funnels,
  selectedFunnel,
  setSelectedFunnel,
  currentStages,
  searchTerm,
  setSearchTerm,
  handleDealClick,
  handleDragStart,
  handleDragOver,
  handleDrop,
  formatCurrency,
  setIsFunnelSettingsOpen,
  isFunnelSettingsOpen,
  setFunnels
}) => {
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [editingStageId, setEditingStageId] = useState(null);
  const [editingStageName, setEditingStageName] = useState('');

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

  const startEditStage = (stage) => {
    setEditingStageId(stage.id);
    setEditingStageName(stage.name);
  };

  const cancelEditStage = () => {
    setEditingStageId(null);
    setEditingStageName('');
  };

  const saveEditStage = () => {
    if (!editingStageId) return;
    const name = editingStageName.trim();
    if (!name) return;
    const updatedFunnels = funnels.map(funnel =>
      funnel.id === selectedFunnel
        ? {
            ...funnel,
            stages: funnel.stages.map(s => (s.id === editingStageId ? { ...s, name } : s))
          }
        : funnel
    );
    setFunnels(updatedFunnels);
    setEditingStageId(null);
    setEditingStageName('');
  };

  return (
    <>
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
                className="p-4 space-y-3 min-h-[400px] max-h-96 overflow-y-auto border-2 border-dashed border-transparent hover:border-blue-200 transition-all duration-200"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                style={{ 
                  background: stage.deals.length === 0 ? 
                    'linear-gradient(45deg, transparent 25%, rgba(229, 231, 235, 0.1) 25%, rgba(229, 231, 235, 0.1) 50%, transparent 50%, transparent 75%, rgba(229, 231, 235, 0.1) 75%)' : 
                    'transparent',
                  backgroundSize: '20px 20px'
                }}
              >
                {stage.deals.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Перетащите сделку сюда</p>
                  </div>
                )}
                {stage.deals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    className="bg-white rounded-xl p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
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
                        {editingStageId === stage.id ? (
                          <input
                            value={editingStageName}
                            onChange={(e) => setEditingStageName(e.target.value)}
                            className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
                          />
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                            {stage.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {editingStageId === stage.id ? (
                          <>
                            <button
                              onClick={saveEditStage}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={cancelEditStage}
                              className="px-2 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              Отмена
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditStage(stage)}
                            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
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
    </>
  );
};

export default DealsContent;
