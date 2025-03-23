import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/wp-json',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);

      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Clear auth data and redirect to login
        localStorage.removeItem('auth-token');
        // In a real app, you might want to redirect to login page
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Auth API
const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/jwt-auth/v1/token', {
        username: email,
        password,
      });
      
      // Store the token
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      // WordPress doesn't have a built-in registration endpoint in the REST API
      // You'll need a custom endpoint or plugin like "WP User Manager" or "JWT Auth"
      // This is an example assuming you have a custom endpoint
      const response = await api.post('/wp/v2/users/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  validateToken: async () => {
    try {
      const response = await api.post('/jwt-auth/v1/token/validate');
      return response.data;
    } catch (error) {
      // Clear token if invalid
      localStorage.removeItem('auth-token');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth-token');
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/wp/v2/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Users API
const usersAPI = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/wp/v2/users/me?context=edit');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/wp/v2/users/${userId}`, { user_data: userData });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Posts API
const postsAPI = {
  getPosts: async (params = {}) => {
    try {
      const response = await api.get('/wp/v2/posts', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPost: async (id) => {
    try {
      const response = await api.get(`/wp/v2/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await api.post('/wp/v2/posts', postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await api.put(`/wp/v2/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await api.delete(`/wp/v2/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Seminars API
const seminarsAPI = {
  getSeminar: async (seminarId) => {
    try {
      const response = await api.get(`/memberfun/v1/seminars/${seminarId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSeminars: async (params = {}) => {
    try {
      const response = await api.get('/memberfun/v1/seminars', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUpcomingSeminars: async (params = {}) => {
    try {
      const response = await api.get('/memberfun/v1/seminars/upcoming', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSeminarsByHost: async (hostId, params = {}) => {
    try {
      const response = await api.get(`/memberfun/v1/seminars/by-host/${hostId}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCalendarData: async (params = {}) => {
    try {
      const response = await api.get('/memberfun/v1/seminars/calendar', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportToIcal: async (seminarId) => {
    try {
      const response = await api.get(`/memberfun/v1/seminars/${seminarId}/ical`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Additional methods for registration functionality
  registerForSeminar: async (seminarId, userData = {}) => {
    try {
      const response = await api.post(`/memberfun/v1/seminars/${seminarId}/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelRegistration: async (seminarId) => {
    try {
      const response = await api.delete(`/memberfun/v1/seminars/${seminarId}/register`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRegisteredSeminars: async () => {
    try {
      const response = await api.get('/memberfun/v1/seminars/registered');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addRating: async (seminarId, ratingData) => {
    try {
      const response = await api.post(`/memberfun/v1/seminars/${seminarId}/rating`, ratingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRatings: async (seminarId) => {
    try {
      const response = await api.get(`/memberfun/v1/seminars/${seminarId}/ratings`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Comments API
const commentsAPI = {
  // Get comments with filtering options
  getComments: async (params = {}) => {
    try {
      const response = await api.get('/memberfun/v1/comments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new comment
  createComment: async (commentData) => {
    try {
      const response = await api.post('/memberfun/v1/comments', commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an existing comment
  updateComment: async (commentId, content) => {
    try {
      const response = await api.put(`/memberfun/v1/comments/${commentId}`, {
        content
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      await api.delete(`/memberfun/v1/comments/${commentId}`);
      return true; // Returns true if deletion was successful (204 status)
    } catch (error) {
      throw error;
    }
  }
};

// Points System API
const pointsAPI = {
  // Get user points
  getUserPoints: async (userId) => {
    try {
      const response = await api.get(`/memberfun/v1/points/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user rank
  getUserRank: async (userId) => {
    try {
      const response = await api.get(`/memberfun/v1/points/user/${userId}/rank`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserPointsAndRank: async (userId) => {
    try {
      const response = await api.get(`/memberfun/v1/points/user/${userId}/points-and-rank`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user transactions with pagination
  getUserTransactions: async (userId, options = {}) => {
    try {
      const { perPage = 20, page = 1, type = '' } = options;
      const response = await api.get(`/memberfun/v1/points/user/${userId}/transactions`, {
        params: {
          per_page: perPage,
          page,
          type
        }
      });
      
      return {
        transactions: response.data,
        pagination: {
          total: parseInt(response.headers['x-wp-total']),
          totalPages: parseInt(response.headers['x-wp-totalpages']),
          currentPage: page
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Add points (Admin only)
  addPoints: async (userId, points, note = '') => {
    try {
      const response = await api.post('/memberfun/v1/points/add', {
        user_id: userId,
        points,
        note
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Deduct points (Admin only)
  deductPoints: async (userId, points, note = '', allowNegative = false) => {
    try {
      const response = await api.post('/memberfun/v1/points/deduct', {
        user_id: userId,
        points,
        note,
        allow_negative: allowNegative
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Export all APIs
export { api, authAPI, usersAPI, postsAPI, seminarsAPI, commentsAPI, pointsAPI }; 