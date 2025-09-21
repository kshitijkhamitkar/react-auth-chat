import axios from 'axios';

// Debug: Log environment variables
console.log('🔍 Environment Variables Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('🚀 Final API_URL being used:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 90000, // Increased to 90 seconds for Render cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token and debug
api.interceptors.request.use(
  (config) => {
    console.log('📤 Making API request:');
    console.log('  URL:', config.baseURL + config.url);
    console.log('  Method:', config.method?.toUpperCase());
    console.log('  Data:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and debug
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response received:');
    console.log('  Status:', response.status);
    console.log('  Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:');
    console.error('  Status:', error.response?.status);
    console.error('  Data:', error.response?.data);
    console.error('  Message:', error.message);
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timed out - backend might be sleeping');
      console.error('💡 Try again in a few seconds, or visit the backend health endpoint first');
      console.error('🔗 Backend health: ' + API_URL.replace('/api', '/health'));
    }
    
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized - removing token and redirecting');
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error - backend might be sleeping or unavailable');
      console.error('  Backend URL:', API_URL);
      console.error('💡 If this is the first request, try visiting the backend health endpoint first');
    }
    
    return Promise.reject(error);
  }
);

export default api;