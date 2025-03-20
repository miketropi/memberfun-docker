import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { usersAPI } from '../api/apiService';

const useUserStore = create(
  immer((set, get) => ({
    userData: null,
    isLoading: false,
    error: null,

    // Fetch user data
    fetchUserData: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Fetch user data from the WordPress API
        const response = await usersAPI.getCurrentUser();
        console.log('response', response);
        set((state) => {
          state.userData = {
            id: response.id,
            name: response.name,
            email: response.email || '',
            username: response.username,
            avatar: response.avatar_urls?.['96'] || '',
            memberSince: response.registered_date || new Date().toISOString(),
            membershipType: response.roles?.[0] || 'subscriber',
            membershipStatus: 'Active', // This might need to come from a custom field
            // Map other fields as needed from the WordPress user object
            activityStats: {
              logins: 0,
              documentsViewed: 0,
              messagesReceived: 0,
            }
          };
          state.isLoading = false;
        });

        return true;
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error.response?.data?.message || error.message || 'Failed to fetch user data';
        });

        return false;
      }
    },

    // Update user data
    updateUserData: async (updatedData) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Update user data via the WordPress API
        const userId = get().userData?.id;
        if (!userId) throw new Error('User ID not found');
        
        const response = await usersAPI.updateUser(userId, updatedData);
        
        set((state) => {
          state.userData = {
            ...state.userData,
            name: response.name,
            email: response.email || state.userData.email,
            username: response.username,
            avatar: response.avatar_urls?.['96'] || state.userData.avatar,
            // Update other fields as needed
          };
          state.isLoading = false;
        });

        return true;
      } catch (error) {
        set((state) => {
          state.isLoading = false;
          state.error = error.response?.data?.message || error.message || 'Failed to update user data';
        });

        return false;
      }
    },

    // Clear user data (e.g., on logout)
    clearUserData: () => {
      set((state) => {
        state.userData = null;
      });
    },

    // Clear error
    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);

export default useUserStore; 