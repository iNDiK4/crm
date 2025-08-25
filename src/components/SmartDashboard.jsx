import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  MessageSquare,
  Award,
  Activity,
  Eye
} from 'lucide-react';
import { useCrmStore } from '../store/crmStore';
import { Link } from 'react-router-dom';

const SmartDashboard = () => {
  const { deals, leads } = useCrmStore();
  const [insights, setInsights] = useState({});
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    generateSmartInsights();
  }, [deals, leads]);

  const generateSmartInsights = () => {
    // Базовая статистика
    const totalDeals = deals.length;
    const wonDeals = deals.filter(d => d.stage === 'won').length;
    const totalRevenue = deals.filter(d => d.stage === 'won').reduce((sum, d) => sum + (d.amount || 0), 0);
    const pipelineValue = deals.filter(d => !['won', 'lost'].includes(d.stage))
      .reduce((sum, d) => sum + ((d.amount || 0) * (d.probability || 0) / 100), 0);

    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
    const hotLeads = leads.filter(l => (l.score || 0) >= 80).length;

    // Тренды (упрощенный расчет)
    const thisMonthDeals = deals.filter(d => {
      if (!d.created) return false;
      const dealDate = new Date(d.created);
      const thisMonth = new Date();
      return dealDate.getMonth() === thisMonth.getMonth() && 
             dealDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    const lastMonthDeals = deals.filter(d => {
      if (!d.created) return false;
      const dealDate = new Date(d.created);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return dealDate.getMonth() === lastMonth.getMonth() && 
             dealDate.getFullYear() === lastMonth.getFullYear();
    }).length;

    const dealsTrend = lastMonthDeals > 0 ? 
      ((thisMonthDeals - lastMonthDeals) / lastMonthDeals * 100).toFixed(1) : 0;

    setInsights({
      totalDeals,
      wonDeals,
      totalRevenue,
      pipelineValue,
      totalLeads,
      qualifiedLeads,
      hotLeads,
      dealsTrend,
      winRate: totalDeals > 0 ? (wonDeals / totalDeals * 100).toFixed(1) : 0,
      conversionRate: totalLeads > 0 ? (qualifiedLeads / totalLeads * 100).toFixed(1) : 0
    });

    // Генерация быстрых действий
    const actions = [];
    
    if (hotLeads > 0) {
      actions.push({
        icon: Target,
        title: 'Горячие лиды',
        description: `${hotLeads} лидов готовы к конверсии`,
        action: 'Обработать',
        color: 'bg-red-100 text-red-800',
        priority: 'high'
      });
    }

    const stalledDeals = deals.filter(d => {
      if (!d.lastActivity) return false;
      const daysSinceUpdate = Math.floor((new Date() - new Date(d.lastActivity)) / (1000 * 60 * 60 * 24));
      return daysSinceUpdate > 14 && !['won', 'lost'].includes(d.stage);
    }).length;

    if (stalledDeals > 0) {
      actions.push({
        icon: Clock,
        title: 'Застывшие сделки',
        description: `${stalledDeals} сделок требуют внимания`,
        action: 'Активировать',
        color: 'bg-yellow-100 text-yellow-800',
        priority: 'medium'
      });
    }

    const oldLeads = leads.filter(l => {
      if (!l.lastContact) return false;
      const daysSinceContact = Math.floor((new Date() - new Date(l.lastContact)) / (1000 * 60 * 60 * 24));
      return daysSinceContact > 7 && l.status !== 'lost';
    }).length;

    if (oldLeads > 0) {
      actions.push({
        icon: Phone,
        title: 'Требуют контакта',
        description: `${oldLeads} лидов без связи >7 дней`,
        action: 'Связаться',
        color: 'bg-blue-100 text-blue-800',
        priority: 'medium'
      });
    }

    setQuickActions(actions);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend) => {
    const trendValue = parseFloat(trend);
    if (trendValue > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trendValue < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (trend) => {
    const trendValue = parseFloat(trend);
    if (trendValue > 0) return 'text-green-600';
    if (trendValue < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Brain className="w-6 h-6" />
              <h2 className="text-xl font-bold">AI Рекомендации</h2>
            </div>
            <p className="text-purple-100 mb-4">
              На основе анализа ваших данных мы выявили возможности для роста продаж
            </p>
            <Link 
              to="/analytics"
              className="inline-flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              <span>Подробная аналитика</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Zap className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            {getTrendIcon(insights.dealsTrend)}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(insights.totalRevenue)}</h3>
          <p className="text-sm text-gray-600 mb-2">Общая выручка</p>
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-medium ${getTrendColor(insights.dealsTrend)}`}>
              {insights.dealsTrend > 0 ? '+' : ''}{insights.dealsTrend}%
            </span>
            <span className="text-xs text-gray-500">к прошлому месяцу</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(insights.pipelineValue)}</h3>
          <p className="text-sm text-gray-600 mb-2">Прогноз продаж</p>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-green-600">
              {insights.winRate}%
            </span>
            <span className="text-xs text-gray-500">процент выигрыша</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{insights.totalLeads}</h3>
          <p className="text-sm text-gray-600 mb-2">Всего лидов</p>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-purple-600">
              {insights.conversionRate}%
            </span>
            <span className="text-xs text-gray-500">конверсия</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{insights.hotLeads}</h3>
          <p className="text-sm text-gray-600 mb-2">Горячие лиды</p>
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-orange-600">
              {insights.qualifiedLeads}
            </span>
            <span className="text-xs text-gray-500">квалифицированных</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">Требуют внимания</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                      <button className="text-sm font-medium text-blue-600 hover:underline flex items-center space-x-1">
                        <span>{action.action}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Производительность</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Сделки в работе</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {deals.filter(d => !['won', 'lost'].includes(d.stage)).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Активные лиды</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {leads.filter(l => !['converted', 'lost'].includes(l.status)).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Задач на сегодня</span>
              </div>
              <span className="text-lg font-bold text-gray-900">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <Link 
              to="/crm"
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Обзвонить лидов</p>
                <p className="text-sm text-gray-600">Запланированные звонки</p>
              </div>
            </Link>
            <Link 
              to="/crm"
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Отправить предложения</p>
                <p className="text-sm text-gray-600">Готовые к отправке</p>
              </div>
            </Link>
            <Link 
              to="/analytics"
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Eye className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium">Просмотреть аналитику</p>
                <p className="text-sm text-gray-600">AI рекомендации</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDashboard;
