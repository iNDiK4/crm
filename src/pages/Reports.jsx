import React, { useState } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Calendar as CalendarIcon,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');

  // Mock data for reports
  const salesData = [
    { month: 'Янв', value: 1200000, deals: 15, conversion: 75 },
    { month: 'Фев', value: 1800000, deals: 22, conversion: 82 },
    { month: 'Мар', value: 1500000, deals: 18, conversion: 78 },
    { month: 'Апр', value: 2200000, deals: 28, conversion: 85 },
    { month: 'Май', value: 1900000, deals: 24, conversion: 80 },
    { month: 'Июн', value: 2500000, deals: 32, conversion: 88 }
  ];

  const leadsData = [
    { month: 'Янв', new: 45, qualified: 32, converted: 15, lost: 8 },
    { month: 'Фев', new: 52, qualified: 38, converted: 22, lost: 10 },
    { month: 'Мар', new: 48, qualified: 35, converted: 18, lost: 9 },
    { month: 'Апр', new: 65, qualified: 45, converted: 28, lost: 12 },
    { month: 'Май', new: 58, qualified: 42, converted: 24, lost: 11 },
    { month: 'Июн', new: 72, qualified: 52, converted: 32, lost: 15 }
  ];

  const performanceData = [
    { name: 'Иван Петров', deals: 12, value: 1800000, conversion: 85 },
    { name: 'Мария Сидорова', deals: 8, value: 1200000, conversion: 78 },
    { name: 'Алексей Козлов', deals: 15, value: 2200000, conversion: 92 },
    { name: 'Елена Воробьева', deals: 10, value: 1500000, conversion: 80 },
    { name: 'Дмитрий Смирнов', deals: 6, value: 900000, conversion: 75 }
  ];

  const funnelData = [
    { stage: 'Новые лиды', count: 72, conversion: 100 },
    { stage: 'Квалифицированные', count: 52, conversion: 72 },
    { stage: 'Предложение', count: 38, conversion: 53 },
    { stage: 'Переговоры', count: 28, conversion: 39 },
    { stage: 'Выиграны', count: 22, conversion: 31 },
    { stage: 'Проиграны', count: 15, conversion: 21 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const currentMonthData = salesData[salesData.length - 1];
  const previousMonthData = salesData[salesData.length - 2];
  const salesGrowth = calculateGrowth(currentMonthData.value, previousMonthData.value);
  const dealsGrowth = calculateGrowth(currentMonthData.deals, previousMonthData.deals);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Отчеты</h1>
          <p className="text-gray-600 mt-1">Аналитика и отчеты по продажам</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="quarter">Квартал</option>
            <option value="year">Год</option>
          </select>
          <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
            <Download className="w-5 h-5 text-gray-600" />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общие продажи</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(currentMonthData.value)}</p>
              <div className="flex items-center space-x-1 mt-2">
                {salesGrowth >= 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(salesGrowth).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs прошлый месяц</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Количество сделок</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentMonthData.deals}</p>
              <div className="flex items-center space-x-1 mt-2">
                {dealsGrowth >= 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${dealsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(dealsGrowth).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs прошлый месяц</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Конверсия</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentMonthData.conversion}%</p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">+2.5%</span>
                <span className="text-sm text-gray-500">vs прошлый месяц</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Новые лиды</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{leadsData[leadsData.length - 1].new}</p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">+12.3%</span>
                <span className="text-sm text-gray-500">vs прошлый месяц</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'sales', name: 'Продажи', icon: DollarSign },
              { id: 'leads', name: 'Лиды', icon: Users },
              { id: 'performance', name: 'Производительность', icon: Target },
              { id: 'funnel', name: 'Воронка', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedReport === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Sales Report */}
          {selectedReport === 'sales' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Динамика продаж</h3>
                  <div className="space-y-4">
                    {salesData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{item.month}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(item.value)}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(item.value / Math.max(...salesData.map(d => d.value))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Конверсия по месяцам</h3>
                  <div className="space-y-4">
                    {salesData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{item.month}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-bold text-gray-900">{item.conversion}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.conversion}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leads Report */}
          {selectedReport === 'leads' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика лидов</h3>
                  <div className="space-y-4">
                    {leadsData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">{item.month}</span>
                          <span className="text-sm font-bold text-gray-900">{item.new} лидов</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-green-600 font-medium">{item.qualified}</div>
                            <div className="text-gray-500">Квалифицированные</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-600 font-medium">{item.converted}</div>
                            <div className="text-gray-500">Конвертированные</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-600 font-medium">{item.lost}</div>
                            <div className="text-gray-500">Потерянные</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Конверсия лидов</h3>
                  <div className="space-y-4">
                    {leadsData.map((item, index) => {
                      const conversionRate = ((item.converted / item.new) * 100).toFixed(1);
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">{item.month}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-bold text-gray-900">{conversionRate}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${conversionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Report */}
          {selectedReport === 'performance' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Производительность менеджеров</h3>
                <div className="space-y-4">
                  {performanceData.map((person, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{person.name}</h4>
                          <p className="text-sm text-gray-600">{person.deals} сделок</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(person.value)}</p>
                          <p className="text-xs text-gray-500">Объем продаж</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{person.conversion}%</p>
                          <p className="text-xs text-gray-500">Конверсия</p>
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${person.conversion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Funnel Report */}
          {selectedReport === 'funnel' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Воронка продаж</h3>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                          <p className="text-sm text-gray-600">{stage.count} элементов</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{stage.conversion}%</p>
                          <p className="text-xs text-gray-500">Конверсия</p>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${stage.conversion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
