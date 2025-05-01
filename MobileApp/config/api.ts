import { Platform } from 'react-native';

// Your computer's local IP address
const LOCAL_IP = '192.168.6.23';

// Get the appropriate base URL based on the environment
const getBaseUrl = () => {
  if (__DEV__) {
    // In development, use the local IP address
    return `http://${LOCAL_IP}:8000`;
  }
  
  // For production, use your deployed API URL
  return 'http://your-production-api.com';
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  SENTIMENT: `${API_BASE_URL}/api/sentiment/`,
  AI_REPORT: `${API_BASE_URL}/api/aireport/`,
};

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 second timeout
}; 