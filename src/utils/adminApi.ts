const API_BASE = 'https://localhost:7206/api';

// Функция для получения токена
const getAuthToken = () => localStorage.getItem('token');

// Функция для создания заголовков с токеном
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// PRODUCTS
export const productsAPI = {
  getAll: () => fetch(`${API_BASE}/product/all`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(r => r.json()),
  
  getById: (id: number) => fetch(`${API_BASE}/product/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(r => r.json()),
  
  create: (data: any) => fetch(`${API_BASE}/product`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json()),

  update: (id: number, formData: FormData) => fetch(`${API_BASE}/product/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
    credentials: 'include',
    body: formData
  }).then(r => r.json()),
  
  delete: (id: number) => fetch(`${API_BASE}/product/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(r => r.json()),
};

// USERS
export const usersAPI = {
  getAll: () => fetch(`${API_BASE}/user/all`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(r => r.json()),
  
  getById: (id: number) => fetch(`${API_BASE}/user/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(r => r.json()),
};

// CERTIFICATES
export const certificatesAPI = {
  getAll: () => fetch(`${API_BASE}/certificate/getAll`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(r => r.json()),
  
  getById: (id: number) => fetch(`${API_BASE}/certificate/id?id=${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(r => r.json()),
  
  create: (data: any) => fetch(`${API_BASE}/certificate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  update: (data: any) => fetch(`${API_BASE}/certificate`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  delete: (id: number) => fetch(`${API_BASE}/certificate/id?id=${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(r => r.json()),
};

export const categoriesAPI = {
  getAll: () => fetch(`${API_BASE}/category/all`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  }).then(r => r.json()),
};