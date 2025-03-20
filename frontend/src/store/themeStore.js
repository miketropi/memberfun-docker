import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';

const useThemeStore = create(
  persist(
    (set) => ({
      // Initial state
      theme: 'light', // 'light' or 'dark'
      
      // Actions
      setTheme: (theme) => 
        set(
          produce((state) => {
            state.theme = theme;
          })
        ),
      
      toggleTheme: () => 
        set(
          produce((state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
          })
        ),
    }),
    {
      name: 'theme-storage', // unique name for localStorage
    }
  )
);

export default useThemeStore; 