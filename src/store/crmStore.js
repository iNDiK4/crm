import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCrmStore = create(
  persist(
    (set, get) => ({
      // Deals state
      deals: [],

      // Global deal fields (like Bitrix24)
      globalDealFields: {},

      // Leads state
      leads: [],

      // Required fields configuration per entity and stage/status
      requiredFields: {
        deal: {}, // { [stageId]: string[] }
        lead: {}  // { [status]: string[] }
      },

      // Funnels state
      funnels: [
        { 
          id: 'sales', 
          name: 'Основная воронка', 
          color: 'from-blue-500 to-purple-600',
          stages: [
            { id: 'new', name: 'Новые лиды', color: 'bg-gray-100 text-gray-800' },
            { id: 'qualified', name: 'Квалифицированные', color: 'bg-blue-100 text-blue-800' },
            { id: 'proposal', name: 'Предложение', color: 'bg-yellow-100 text-yellow-800' },
            { id: 'negotiation', name: 'Переговоры', color: 'bg-orange-100 text-orange-800' },
            { id: 'won', name: 'Выиграны', color: 'bg-green-100 text-green-800' },
            { id: 'lost', name: 'Проиграны', color: 'bg-red-100 text-red-800' }
          ]
        },
        { 
          id: 'partners', 
          name: 'Партнерская воронка', 
          color: 'from-green-500 to-emerald-600',
          stages: [
            { id: 'contact', name: 'Первичный контакт', color: 'bg-gray-100 text-gray-800' },
            { id: 'meeting', name: 'Встреча', color: 'bg-blue-100 text-blue-800' },
            { id: 'agreement', name: 'Соглашение', color: 'bg-green-100 text-green-800' },
            { id: 'active', name: 'Активные', color: 'bg-purple-100 text-purple-800' }
          ]
        }
      ],

      // Loading states
      isLoading: false,
      error: null,

      // Deal actions
      addDeal: (deal) => {
        const { deals } = get();
        const newDeal = {
          ...deal,
          id: Date.now(),
          created: new Date().toISOString().split('T')[0],
          lastActivity: new Date().toISOString().split('T')[0],
          activities: [],
          attachments: deal.attachments || []
        };
        set({ deals: [...deals, newDeal] });
        return { success: true, data: newDeal };
      },

      updateDeal: (id, updates) => {
        const { deals } = get();
        const updatedDeals = deals.map(deal => 
          deal.id === id ? { ...deal, ...updates, lastActivity: new Date().toISOString().split('T')[0] } : deal
        );
        set({ deals: updatedDeals });
        return { success: true };
      },

      deleteDeal: (id) => {
        const { deals } = get();
        const updatedDeals = deals.filter(deal => deal.id !== id);
        set({ deals: updatedDeals });
        return { success: true };
      },

      moveDeal: (dealId, newStage, actor) => {
        const { deals } = get();
        let movedFrom = null;
        const updatedDeals = deals.map(deal => {
          if (deal.id === dealId) {
            movedFrom = deal.stage;
            return { ...deal, stage: newStage, lastActivity: new Date().toISOString().split('T')[0] };
          }
          return deal;
        });
        set({ deals: updatedDeals });
        // log activity
        get().addActivity('deal', dealId, {
          type: 'status_change',
          description: `Перемещено: ${movedFrom} → ${newStage}`,
          user: actor || 'System'
        });
        return { success: true };
      },

      // Lead actions
      addLead: (lead) => {
        const { leads } = get();
        const newLead = {
          ...lead,
          id: Date.now(),
          lastContact: new Date().toISOString().split('T')[0],
          activities: [],
          attachments: lead.attachments || [],
          tags: lead.tags || []
        };
        set({ leads: [...leads, newLead] });
        return { success: true, data: newLead };
      },

      updateLead: (id, updates, actor) => {
        const { leads } = get();
        let prevStatus = null;
        const updatedLeads = leads.map(lead => {
          if (lead.id === id) {
            prevStatus = lead.status;
            return { ...lead, ...updates };
          }
          return lead;
        });
        set({ leads: updatedLeads });
        if (updates && 'status' in updates && updates.status !== prevStatus) {
          get().addActivity('lead', id, {
            type: 'status_change',
            description: `Статус: ${prevStatus || '-'} → ${updates.status}`,
            user: actor || 'System'
          });
        }
        return { success: true };
      },

      deleteLead: (id) => {
        const { leads } = get();
        const updatedLeads = leads.filter(lead => lead.id !== id);
        set({ leads: updatedLeads });
        return { success: true };
      },

      convertLeadToDeal: (leadId) => {
        const { leads, deals } = get();
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return { success: false, error: 'Лид не найден' };

        const newDeal = {
          id: Date.now(),
          title: `Сделка с ${lead.name}`,
          company: lead.company,
          contact: lead.name,
          amount: 0,
          stage: 'new',
          probability: 10,
          expectedClose: new Date().toISOString().split('T')[0],
          created: new Date().toISOString().split('T')[0],
          lastActivity: new Date().toISOString().split('T')[0],
          description: lead.description,
          activities: [...lead.activities],
          fields: {
            source: lead.source,
            budget: lead.budget,
            decisionMaker: lead.name,
            nextStep: '',
            notes: lead.notes
          }
        };

        const updatedLeads = leads.map(l => 
          l.id === leadId ? { ...l, status: 'converted' } : l
        );

        set({ 
          deals: [...deals, newDeal],
          leads: updatedLeads
        });

        return { success: true, data: newDeal };
      },

      // Funnel actions
      updateFunnels: (newFunnels) => {
        set({ funnels: newFunnels });
        return { success: true };
      },

      // Activity actions
      addActivity: (type, itemId, activity) => {
        const { deals, leads } = get();
        const newActivity = {
          ...activity,
          id: Date.now(),
          date: new Date().toISOString().split('T')[0]
        };

        if (type === 'deal') {
          const updatedDeals = deals.map(deal => 
            deal.id === itemId 
              ? { ...deal, activities: [...deal.activities, newActivity], lastActivity: newActivity.date }
              : deal
          );
          set({ deals: updatedDeals });
        } else if (type === 'lead') {
          const updatedLeads = leads.map(lead => 
            lead.id === itemId 
              ? { ...lead, activities: [...lead.activities, newActivity], lastContact: newActivity.date }
              : lead
          );
          set({ leads: updatedLeads });
        }

        return { success: true, data: newActivity };
      },

      // Attachments
      addAttachment: (entity, itemId, attachment) => {
        const newFile = {
          id: Date.now(),
          name: attachment.name,
          url: attachment.url,
          size: attachment.size || 0,
          uploadedAt: new Date().toISOString(),
          uploadedBy: attachment.user || 'System'
        };
        if (entity === 'deal') {
          const { deals } = get();
          const updatedDeals = deals.map(d => d.id === itemId ? {
            ...d,
            attachments: [...(d.attachments || []), newFile]
          } : d);
          set({ deals: updatedDeals });
          get().addActivity('deal', itemId, { type: 'file_add', description: `Файл добавлен: ${newFile.name}`, user: newFile.uploadedBy });
          return { success: true, data: newFile };
        } else if (entity === 'lead') {
          const { leads } = get();
          const updatedLeads = leads.map(l => l.id === itemId ? {
            ...l,
            attachments: [...(l.attachments || []), newFile]
          } : l);
          set({ leads: updatedLeads });
          get().addActivity('lead', itemId, { type: 'file_add', description: `Файл добавлен: ${newFile.name}`, user: newFile.uploadedBy });
          return { success: true, data: newFile };
        }
        return { success: false };
      },

      removeAttachment: (entity, itemId, fileId, actor) => {
        if (entity === 'deal') {
          const { deals } = get();
          const updatedDeals = deals.map(d => d.id === itemId ? {
            ...d,
            attachments: (d.attachments || []).filter(f => f.id !== fileId)
          } : d);
          set({ deals: updatedDeals });
          get().addActivity('deal', itemId, { type: 'file_remove', description: `Файл удален`, user: actor || 'System' });
          return { success: true };
        } else if (entity === 'lead') {
          const { leads } = get();
          const updatedLeads = leads.map(l => l.id === itemId ? {
            ...l,
            attachments: (l.attachments || []).filter(f => f.id !== fileId)
          } : l);
          set({ leads: updatedLeads });
          get().addActivity('lead', itemId, { type: 'file_remove', description: `Файл удален`, user: actor || 'System' });
          return { success: true };
        }
        return { success: false };
      },

      // Required fields config actions
      setRequiredFields: (entity, stageId, fields) => {
        const { requiredFields } = get();
        const updated = {
          ...requiredFields,
          [entity]: {
            ...requiredFields[entity],
            [stageId]: Array.from(new Set(fields))
          }
        };
        set({ requiredFields: updated });
        return { success: true };
      },

      // Error handling
      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Global deal fields actions
      addGlobalDealField: (fieldName, fieldType) => {
        const { globalDealFields, deals } = get();
        
        let defaultValue = '';
        switch (fieldType) {
          case 'checkbox':
            defaultValue = false;
            break;
          case 'number':
            defaultValue = 0;
            break;
          case 'date':
            defaultValue = new Date().toISOString().split('T')[0];
            break;
          default:
            defaultValue = '';
        }

        const newGlobalFields = {
          ...globalDealFields,
          [fieldName]: { type: fieldType, defaultValue }
        };

        // Add field to all existing deals
        const updatedDeals = deals.map(deal => ({
          ...deal,
          customFields: {
            ...deal.customFields,
            [fieldName]: { value: defaultValue, type: fieldType }
          }
        }));

        set({ 
          globalDealFields: newGlobalFields,
          deals: updatedDeals
        });
        
        return { success: true };
      },

      removeGlobalDealField: (fieldName) => {
        const { globalDealFields, deals } = get();
        
        const newGlobalFields = { ...globalDealFields };
        delete newGlobalFields[fieldName];

        // Remove field from all existing deals
        const updatedDeals = deals.map(deal => {
          const newCustomFields = { ...deal.customFields };
          delete newCustomFields[fieldName];
          return {
            ...deal,
            customFields: newCustomFields
          };
        });

        set({ 
          globalDealFields: newGlobalFields,
          deals: updatedDeals
        });
        
        return { success: true };
      }
    }),
    {
      name: 'indik4-crm-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        deals: state.deals,
        leads: state.leads,
        funnels: state.funnels,
        globalDealFields: state.globalDealFields
      })
    }
  )
);

export { useCrmStore };
