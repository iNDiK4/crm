import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Users,
  Activity,
  Award,
  Lightbulb,
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useCrmStore } from '../store/crmStore';

const AIInsights = () => {
  const { deals, leads } = useCrmStore();
  const [insights, setInsights] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    generateAIInsights();
  }, [deals, leads]);

  const generateAIInsights = () => {
    // Анализ конверсии
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
    const convertedLeads = leads.filter(l => l.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(1) : 0;

    // Анализ сделок
    const totalDeals = deals.length;
    const wonDeals = deals.filter(d => d.stage === 'won').length;
    const lostDeals = deals.filter(d => d.stage === 'lost').length;
    const winRate = totalDeals > 0 ? (wonDeals / totalDeals * 100).toFixed(1) : 0;

    // Средний размер сделки
    const wonDealAmounts = deals.filter(d => d.stage === 'won').map(d => d.amount);
    const avgDealSize = wonDealAmounts.length > 0 ? 
      wonDealAmounts.reduce((sum, amount) => sum + amount, 0) / wonDealAmounts.length : 0;

    // Прогноз продаж
    const activeDealsPipeline = deals
      .filter(d => !['won', 'lost'].includes(d.stage))
      .reduce((sum, deal) => sum + (deal.amount * deal.probability / 100), 0);

    setInsights({
      conversionRate,
      winRate,
      avgDealSize,
      activeDealsPipeline,
      totalLeads,
      qualifiedLeads,
      totalDeals,
      wonDeals
    });

    // Генерация рекомендаций
    const newRecommendations = [];

    // Рекомендации по лидам
    const oldLeads = leads.filter(l => {
      const daysSinceContact = Math.floor((new Date() - new Date(l.lastContact)) / (1000 * 60 * 60 * 24));
      return daysSinceContact > 7 && l.status !== 'lost';
    });

    if (oldLeads.length > 0) {
      newRecommendations.push({
        type: 'urgent',
        icon: Clock,
        title: 'Требуют внимания',
        description: `${oldLeads.length} лидов без контакта более 7 дней`,
        action: 'Связаться с лидами',
        priority: 'high'
      });
    }

    // Рекомендации по сделкам
    const stalledDeals = deals.filter(d => {
      const daysSinceUpdate = Math.floor((new Date() - new Date(d.lastActivity)) / (1000 * 60 * 60 * 24));
      return daysSinceUpdate > 14 && !['won', 'lost'].includes(d.stage);
    });

    if (stalledDeals.length > 0) {
      newRecommendations.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Застывшие сделки',
        description: `${stalledDeals.length} сделок без активности более 2 недель`,
        action: 'Активировать сделки',
        priority: 'medium'
      });
    }

    // Рекомендации по высокоприоритетным лидам
    const highScoreLeads = leads.filter(l => l.score >= 80 && l.status === 'qualified');
    if (highScoreLeads.length > 0) {
      newRecommendations.push({
        type: 'opportunity',
        icon: Target,
        title: 'Горячие лиды',
        description: `${highScoreLeads.length} лидов готовы к конверсии`,
        action: 'Конвертировать в сделки',
        priority: 'high'
      });
    }

    setRecommendations(newRecommendations);

    // Прогнозы
    const monthlyTrend = calculateMonthlyTrend();
    setPredictions({
      nextMonthRevenue: activeDealsPipeline * 0.3, // Примерная конверсия 30%
      trend: monthlyTrend,
      bestPerformingSource: getBestPerformingSource(),
      optimalContactTime: getOptimalContactTime()
    });
  };

  const calculateMonthlyTrend = () => {
    // Упрощенный расчет тренда на основе последних сделок
    const lastMonthDeals = deals.filter(d => {
      const dealDate = new Date(d.createdAt);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return dealDate >= lastMonth && d.stage === 'won';
    });

    const prevMonthDeals = deals.filter(d => {
      const dealDate = new Date(d.createdAt);
      const prevMonth = new Date();
      prevMonth.setMonth(prevMonth.getMonth() - 2);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return dealDate >= prevMonth && dealDate < lastMonth && d.stage === 'won';
    });

    const lastMonthRevenue = lastMonthDeals.reduce((sum, d) => sum + d.amount, 0);
    const prevMonthRevenue = prevMonthDeals.reduce((sum, d) => sum + d.amount, 0);

    if (prevMonthRevenue === 0) return 'stable';
    const change = ((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
    
    if (change > 10) return 'up';
    if (change < -10) return 'down';
    return 'stable';
  };

  const getBestPerformingSource = () => {
    const sourceStats = {};
    leads.forEach(lead => {
      if (!sourceStats[lead.source]) {
        sourceStats[lead.source] = { total: 0, converted: 0 };
      }
      sourceStats[lead.source].total++;
      if (lead.status === 'converted') {
        sourceStats[lead.source].converted++;
      }
    });

    let bestSource = 'website';
    let bestRate = 0;
    Object.entries(sourceStats).forEach(([source, stats]) => {
      const rate = stats.total > 0 ? stats.converted / stats.total : 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestSource = source;
      }
    });

    return bestSource;
  };

  const getOptimalContactTime = () => {
    // Упрощенный анализ времени контакта
    return '10:00-12:00';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down': return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AI Аналитика</h2>
        </div>
        <p className="text-purple-100">
          Искусственный интеллект анализирует ваши данные и предоставляет персонализированные рекомендации
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            {getTrendIcon(predictions.trend)}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{insights.conversionRate}%</h3>
          <p className="text-sm text-gray-600">Конверсия лидов</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{insights.winRate}%</h3>
          <p className="text-sm text-gray-600">Процент выигрыша</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(insights.avgDealSize)}</h3>
          <p className="text-sm text-gray-600">Средняя сделка</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <Zap className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(insights.activeDealsPipeline)}</h3>
          <p className="text-sm text-gray-600">Прогноз продаж</p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-gray-900">Рекомендации AI</h3>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div key={index} className={`p-4 rounded-xl border-2 ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <p className="text-sm mb-3">{rec.description}</p>
                    <button className="inline-flex items-center space-x-2 text-sm font-medium hover:underline">
                      <span>{rec.action}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Predictions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Прогнозы</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Выручка след. месяца</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(predictions.nextMonthRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Лучший источник</span>
              <span className="font-semibold capitalize">{predictions.bestPerformingSource}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Оптимальное время звонков</span>
              <span className="font-semibold">{predictions.optimalContactTime}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium">Обзвонить горячих лидов</p>
                <p className="text-sm text-gray-600">{leads.filter(l => l.score >= 80).length} лидов</p>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <Mail className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Отправить follow-up</p>
                <p className="text-sm text-gray-600">Старые контакты</p>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium">Запланировать встречи</p>
                <p className="text-sm text-gray-600">Квалифицированные лиды</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
