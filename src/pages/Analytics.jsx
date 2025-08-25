import React, { useState } from 'react';
import { BarChart3, Brain, Zap, TrendingUp, Users, DollarSign, Target, Activity } from 'lucide-react';
import AIInsights from '../components/AIInsights';
import WorkflowAutomation from '../components/WorkflowAutomation';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('insights');

  const tabs = [
    { id: 'insights', label: 'AI Аналитика', icon: Brain },
    { id: 'automation', label: 'Автоматизация', icon: Zap },
    { id: 'reports', label: 'Отчеты', icon: BarChart3 }
  ];

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Детальные отчеты</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Отчет по продажам</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Анализ продаж по периодам, менеджерам и источникам</p>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Создать отчет →
            </button>
          </div>

          <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Конверсия лидов</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Анализ воронки продаж и конверсии на каждом этапе</p>
            <button className="text-green-600 text-sm font-medium hover:underline">
              Создать отчет →
            </button>
          </div>

          <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Активность команды</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Производительность и активность менеджеров</p>
            <button className="text-purple-600 text-sm font-medium hover:underline">
              Создать отчет →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Аналитика и Автоматизация</h1>
              <p className="text-gray-600">Используйте AI для анализа данных и автоматизации процессов</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {tabs.map(tab => {
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
            <div className="pb-8">
              {activeTab === 'insights' && <AIInsights />}
              {activeTab === 'automation' && <WorkflowAutomation />}
              {activeTab === 'reports' && renderReports()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
