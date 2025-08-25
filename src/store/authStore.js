import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Имитация API запроса
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Простая проверка для демо
          if (email === 'admin@indik4.com' && password === 'admin123') {
            const user = {
              id: 1,
              name: 'Администратор',
              email: email,
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              role: 'admin',
              permissions: ['all'],
              loginTime: new Date().toISOString()
            };
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            
            return { success: true };
          } else {
            set({ 
              isLoading: false, 
              error: 'Неверные учетные данные' 
            });
            return { success: false, error: 'Неверные учетные данные' };
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: 'Произошла ошибка при входе' 
          });
          return { success: false, error: 'Произошла ошибка при входе' };
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },
      
      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          set({
            user: updatedUser
          });
          return { success: true };
        }
        return { success: false, error: 'Пользователь не найден' };
      },
      
      checkAuth: () => {
        const { user } = get();
        if (user) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'indik4-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export { useAuthStore };
