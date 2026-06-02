const API_BASE_URL = '/api';

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
  token: string;
  isSuccess?: boolean;
  message?: string;
  data?: {
    id: number;
    username: string;
    email: string;
    role?: number | string;
  };
}

async function apiCall<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown,
  includeAuth: boolean = true
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Only add Authorization header if we have a token and it's not login/register
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
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
  login: async (credentials: LoginRequest) => {
    const response = await apiCall<AuthResponse>('/auth/login', 'POST', credentials, false);
    console.log('Backend login response:', response);
    
    // Сохранить токен в localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      console.log('✅ Token saved to localStorage');
    }
    
    // Преобразовать ответ в единый формат
    return {
      isSuccess: true,
      token: response.token,
      message: 'Login successful',
      data: response.data,
    };
  },

  register: async (userData: RegisterRequest) => {
    const response = await apiCall<AuthResponse>('/auth/register', 'POST', userData, false);
    console.log('Backend register response:', response);
    
    // Сохранить токен в localStorage если бэкенд его вернул
    if (response.token) {
      localStorage.setItem('token', response.token);
      console.log('✅ Token saved to localStorage');
    }
    
    return {
      isSuccess: true,
      token: response.token,
      message: 'Registration successful',
      data: response.data,
    };
  },

  logout: () => {
    localStorage.removeItem('token');
    console.log('✅ Logged out');
    return apiCall<AuthResponse>('/auth/logout', 'POST');
  },
};
