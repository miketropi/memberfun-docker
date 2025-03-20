import { api } from './apiService';

// Social Authentication API
const socialAuthAPI = {
  // Get the authorization URL for Google OAuth
  getGoogleAuthUrl: async () => {
    try {
      const response = await api.get('/memberfun/v1/auth/google/');
      return response.data.authUrl;
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  },

  // Get the authorization URL for GitHub OAuth
  getGithubAuthUrl: async () => {
    try {
      const response = await api.get('/memberfun/v1/auth/github/');
      // alert(JSON.stringify(response.data.auth_url));
      return response.data.auth_url;
    } catch (error) {
      // alert(JSON.stringify(error));
      console.error('Error getting GitHub auth URL:', error);
      throw error;
    }
  },

  // Handle the OAuth callback and exchange code for token
  handleSocialAuth: async (provider, code) => {
    try {
      // alert(`/memberfun/v1/auth/${provider}/callback`) 
      const response = await api.get(`/memberfun/v1/auth/${provider}/callback`, { code });
      
      // Store the token
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error handling ${provider} auth:`, error);
      throw error;
    }
  },
};

export default socialAuthAPI; 