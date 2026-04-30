const API_BASE_URL = 'https://localhost:7206/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  message: string;
  data?: {
    id: number;
    username: string;
    email: string;
  };
}

async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

export const authAPI = {
  login: (credentials: LoginRequest) =>
    apiCall<AuthResponse>('/auth/login', 'POST', credentials),

  register: (userData: RegisterRequest) =>
    apiCall<AuthResponse>('/auth/register', 'POST', userData),

  logout: () =>
    apiCall<AuthResponse>('/auth/logout', 'POST'),
};