import api from './api';
import { AxiosError } from 'axios';

// Helper function to extract error message from axios error
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || error.message || 'Unknown error';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown error';
};

// Get auth configuration (strategy and OAuth config if applicable)
// Endpoint: GET /api/auth/config
// Response: { strategy: 'email' | 'pythagora_oauth', oauth?: { authorizeUrl, clientId, redirectUri, scope } }
export const getAuthConfig = async () => {
  try {
    const response = await api.get('/api/auth/config');
    return response.data;
  } catch (error) {
    console.error('Error fetching auth config:', error);
    throw new Error(getErrorMessage(error));
  }
};

// Description: Login user functionality (email/password)
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: User fields spread at root level + { accessToken: string, refreshToken: string }
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(getErrorMessage(error));
  }
};

// Description: Register user functionality
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string }
// Response: { email: string }
export const register = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/register', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Description: Logout
// Endpoint: POST /api/auth/logout
// Request: {}
// Response: { success: boolean, message: string }
export const logout = async () => {
  try {
    return await api.post('/api/auth/logout');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
