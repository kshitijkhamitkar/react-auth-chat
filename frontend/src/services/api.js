import axios from 'axios';

// Debug: Log environment variables
console.log('🔍 Environment Variables Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('All REACT_APP_ vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));

// Use environment variable or fallback to local
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🚀 Final API_URL being used:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout for Render cold starts
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
    console.error('  Full error:', error);
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timed out - backend might be sleeping');
    }
    
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized - removing token and redirecting');
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error - check if backend is running and accessible');
      console.error('  Backend URL:', API_URL);
    }
    
    return Promise.reject(error);
  }
);

export default api;