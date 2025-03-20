import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { authAPI } from '../api/apiService';
import socialAuthAPI from '../api/socialAuthService';

// Import will be resolved at runtime
let useUserStore = null;

// Function to get userStore (prevents circular dependency)
const getUserStore = () => {
  if (!useUserStore) {
    // useUserStore = require('./userStore').default;
    import('./userStore').then((module) => {
      useUserStore = module.default; 
    });
    
  }
  return useUserStore;
};

const useAuthStore = create(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // Use the real API call to authenticate the user
          const response = await authAPI.login(email, password);
          
          set((state) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = {
              id: response.user_id || response.id,
              email: response.user_email || email,
              name: response.user_display_name || response.display_name || email,
              token: response.token,
            };
          });

          // Load user data into userStore if available
          const userStore = getUserStore();
          if (userStore) {
            userStore.getState().fetchUserData();
          }

          return true;
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = error.response?.data?.message || error.message || 'Failed to login';
          });

          return false;
        }
      },

      setUser: (user) => {
        set((state) => {
          state.isAuthenticated = true;
          state.user = user;
        });
      },

      register: async (userData) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // Use the real API call to register the user
          const response = await authAPI.register(userData);
          
          set((state) => {
            state.isLoading = false;
          });

          return true;
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = error.response?.data?.message || error.message || 'Failed to register';
          });

          return false;
        }
      },

      // Social login with Google
      loginWithGoogle: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // Get the Google auth URL
          const authUrl = await socialAuthAPI.getGoogleAuthUrl();
          
          // Open the auth URL in a new window
          window.location.href = authUrl;
          
          return true;
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = error.response?.data?.message || error.message || 'Failed to initiate Google login';
          });

          return false;
        }
      },

      // Social login with GitHub
      loginWithGithub: async () => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // Get the GitHub auth URL
          const authUrl = await socialAuthAPI.getGithubAuthUrl();
          // alert(authUrl);
          // Open the auth URL in a new window
          window.location.href = authUrl;
          
          return true;
        } catch (error) {
          set((state) => {
            state.isLoading = false;
            state.error = error.response?.data?.message || error.message || 'Failed to initiate GitHub login';
          });

          return false;
        }
      },

      validateToken: async () => {
        const token = localStorage.getItem('auth-token');
        if (!token) return false;

        set((state) => {
          state.isLoading = true;
        });

        try { 
          
          // If token is valid, fetch user data
          const userStore = getUserStore();
          // console.log('userStore', userStore);
          
          if (userStore) {
            await userStore.getState().fetchUserData();
          }
          
          set((state) => {
            state.isLoading = false;
            state.isAuthenticated = true;
          });
          
          return true;
        } catch (error) {
          console.log('error', error);
          set((state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
          });
          
          return false;
        }
      },

      logout: () => {
        // Call the API logout function
        authAPI.logout();
        
        // Clear user data from userStore
        const userStore = getUserStore();
        if (userStore) {
          userStore.getState().clearUserData();
        }
        
        // Clear auth state
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
        });
      },

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },
    })),
    {
      name: 'auth-storage',
      partialize: (state) => {
        // console.log('partialize', state);
        return {
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }
      },
    }
  )
);

export default useAuthStore; 