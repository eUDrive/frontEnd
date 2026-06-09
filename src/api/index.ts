/**
 * Unified API client for eUDrive
 * All endpoints use axios HTTP client with automatic Bearer token injection
 */

import { http } from "./http";

// ============================================
// TYPES
// ============================================

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string | number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDescription {
  id?: number;
  description?: string;
  productId?: number;
  descriptionAdvanced?: {
    id?: number;
    h?: number;
    w?: number;
    l?: number;
  };
}

export interface ProductImage {
  id?: number;
  url: string;
  productId?: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string | ProductDescription;
  price: number;
  categoryId: number;
  image?: string;
  stock?: number;
  images?: { id: number; url: string }[];
  status?: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Certificate {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

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
  token?: string;
  Token?: string;
  isSuccess?: boolean;
  IsSuccess?: boolean;
  message?: string;
  Message?: string;
  data?: {
    id: number;
    username: string;
    email: string;
    role?: string | number;
  };
  Data?: {
    id?: number;
    Id?: number;
    username?: string;
    Username?: string;
    email?: string;
    Email?: string;
    role?: string | number;
    Role?: string | number;
  };
}

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  login: async (credentials: LoginRequest) => {
    const res = await http.post<AuthResponse>("/api/auth/login", credentials);
    const token = res.data.token || res.data.Token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return res.data;
  },

  logout: async () => {
    await http.post("/api/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  },

  register: async (userData: RegisterRequest) => {
    const res = await http.post<AuthResponse>("/api/auth/register", userData);
    const token = res.data.token || res.data.Token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return res.data;
  },
};

// ============================================
// PRODUCTS API
// ============================================

export const productsAPI = {
  getAll: async () => {
    const res = await http.get<Product[]>("/api/product/all");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await http.get<Product>(`/api/product/${id}`);
    return res.data;
  },

  create: async (product: any) => {
    const res = await http.post<{ isSuccess: boolean; message: string; data: Product }>("/api/product", product);
    return res.data;
  },

  update: async (id: number, product: any) => {
    const res = await http.put<Product>(`/api/product/${id}`, product);
    return res.data;
  },

  delete: async (id: number) => {
    await http.delete(`/api/product/${id}`);
  },
};

// ============================================
// CATEGORIES API
// ============================================

export const categoriesAPI = {
  getAll: async () => {
    const res = await http.get<Category[]>("/api/category/all");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await http.get<Category>(`/api/category/${id}`);
    return res.data;
  },

  create: async (category: any) => {
    const res = await http.post<Category>("/api/category", category);
    return res.data;
  },

  update: async (id: number, category: any) => {
    const res = await http.put<Category>(`/api/category/${id}`, category);
    return res.data;
  },

  delete: async (id: number) => {
    await http.delete(`/api/category/${id}`);
  },
};

// ============================================
// CERTIFICATES API
// ============================================

export const certificatesAPI = {
  getAll: async () => {
    const res = await http.get<Certificate[]>("/api/certificate/getAll");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await http.get<Certificate>("/api/certificate/id", {
      params: { id },
    });
    return res.data;
  },

  create: async (certificate: any) => {
    const res = await http.post<Certificate>("/api/certificate", certificate);
    return res.data;
  },

  update: async (certificate: any) => {
    const res = await http.put<Certificate>("/api/certificate", certificate);
    return res.data;
  },

  delete: async (id: number) => {
    await http.delete("/api/certificate/id", {
      params: { id },
    });
  },
};

// ============================================
// USERS API
// ============================================

export const usersAPI = {
  getAll: async () => {
    const res = await http.get<User[]>("/api/user/all");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await http.get<User>(`/api/user/${id}`);
    return res.data;
  },

  create: async (user: any) => {
    const res = await http.post<User>("/api/user", user);
    return res.data;
  },

  update: async (id: number, user: any) => {
    const res = await http.put<User>(`/api/user/${id}`, user);
    return res.data;
  },

  delete: async (id: number) => {
    await http.delete(`/api/user/${id}`);
  },

  activate: async (id: number) => {
    const res = await http.put<User>(`/api/user/activate/${id}`, {});
    return res.data;
  },
};

// ============================================
// ORDERS API
// ============================================

export interface CartItemRequest {
  userId: number;
  item: {
    id?: number;
    orderId?: number;
    type: number;
    itemId: number;
    quantity: number;
    priceAtPurchase: number;
    createdAt: string;
  };
  currentPrice: number;
}

export const ordersAPI = {
  addToCart: async (cartItem: CartItemRequest) => {
    const res = await http.post("/api/order/cart/add", cartItem);
    return res.data;
  },

  getUserCart: async (userId: number) => {
    const res = await http.get<Order>(`/api/order/cart/${userId}`);
    return res.data;
  },

  checkout: async (userId: number) => {
    const res = await http.post<Order>(`/api/order/checkout/${userId}`, {});
    return res.data;
  },

  getHistory: async (userId: number) => {
    const res = await http.get<Order[]>(`/api/order/history/${userId}`);
    return res.data;
  },

  removeItem: async (itemId: number) => {
    await http.delete(`/api/order/cart/item/${itemId}`);
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    const res = await http.put<OrderItem>(
      `/api/order/cart/item/${itemId}/quantity`,
      { quantity }
    );
    return res.data;
  },
};

// ============================================
// HEALTH API
// ============================================

export const healthAPI = {
  ping: async () => {
    const res = await http.get("/api/health/ping");
    return res.data;
  },
};

// ============================================
// IMAGES API
// ============================================

export const imagesAPI = {
  getByProductId: async (productId: number) => {
    const res = await http.get<{ id: number; url: string }[]>(`/api/image/product/${productId}/all`);
    return res.data;
  },

  upload: async (productId: number, file: File) => {
    const body = new FormData();
    body.append('productId', productId.toString());
    body.append('file', file);

    // ⚠️ Do NOT set Content-Type — axios must NOT override multipart boundary
    const res = await http.post('/api/image/product/upload', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  delete: async (productId: number, imageId: number) => {
    await http.delete(`/api/image/product/${productId}/${imageId}`);
  },
};
