const API_BASE = 'https://localhost:7206/api'; // Измените на ваш URL

// Функция для получения токена
const getAuthToken = () => localStorage.getItem('authToken');

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
    credentials: 'include'
  }).then(r => r.json()),
  
  getById: (id: number) => fetch(`${API_BASE}/product/${id}`, {
    credentials: 'include'
  }).then(r => r.json()),
  
  create: (data: any) => fetch(`${API_BASE}/product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  update: (id: number, data: any) => fetch(`${API_BASE}/product/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  delete: (id: number) => fetch(`${API_BASE}/product/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then(r => r.json()),
};

// USERS
export const usersAPI = {
  getAll: () => fetch(`${API_BASE}/user/all`, {
    credentials: 'include'
  }).then(r => r.json()),
  
  getById: (id: number) => fetch(`${API_BASE}/user/${id}`, {
    credentials: 'include'
  }).then(r => r.json()),
};

// CERTIFICATES
export const certificatesAPI = {
  getAll: () => fetch(`${API_BASE}/certificate/getAll`, {
    credentials: 'include'
  }).then(r => r.json()),
  
  getById: (id: number) => fetch(`${API_BASE}/certificate/id?id=${id}`, {
    credentials: 'include'
  }).then(r => r.json()),
  
  create: (data: any) => fetch(`${API_BASE}/certificate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  update: (data: any) => fetch(`${API_BASE}/certificate`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(r => r.json()),
  
  delete: (id: number) => fetch(`${API_BASE}/certificate/id?id=${id}`, {
    method: 'DELETE',
    credentials: 'include'
  }).then(r => r.json()),
};