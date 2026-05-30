# API Integration Guide

## Overview

Все API вызовы используют унифицированный HTTP клиент (`axios`) с автоматическим добавлением JWT токена.

## File Structure

- `src/api/http.ts` - HTTP клиент с Axios конфигурацией
- `src/api/index.ts` - Все API методы (главный файл)
- `src/api/auth.ts` - Legacy (используй `authAPI` из `index.ts`)

## Usage

### Импорт

```typescript
import { 
  authAPI, 
  productsAPI, 
  categoriesAPI,
  certificatesAPI,
  usersAPI,
  ordersAPI,
  healthAPI 
} from '../api/index';
```

### Примеры

#### Authentication
```typescript
// Login
const response = await authAPI.login({ email: 'user@mail.com', password: 'pass' });
console.log(response.token); // JWT токен сохранен в localStorage автоматически

// Logout
await authAPI.logout();

// Register
const response = await authAPI.register({ 
  username: 'john', 
  email: 'john@mail.com', 
  password: 'pass123' 
});
```

#### Products
```typescript
// Получить все продукты
const products = await productsAPI.getAll();

// Получить по ID
const product = await productsAPI.getById(1);

// Создать (админ)
const newProduct = await productsAPI.create({
  name: 'Tesla Model 3',
  price: 45000,
  categoryId: 1,
  description: 'Electric car'
});

// Обновить (админ)
const updated = await productsAPI.update(1, {
  name: 'Tesla Model 3 Updated',
  price: 46000,
  categoryId: 1
});

// Удалить (админ)
await productsAPI.delete(1);
```

#### Categories
```typescript
const categories = await categoriesAPI.getAll();
const category = await categoriesAPI.getById(1);
const newCat = await categoriesAPI.create({ name: 'Electric Cars' });
const updated = await categoriesAPI.update(1, { name: 'EV Cars' });
await categoriesAPI.delete(1);
```

#### Certificates
```typescript
const certificates = await certificatesAPI.getAll();
const cert = await certificatesAPI.getById(1);
const newCert = await certificatesAPI.create({
  name: 'Premium Package',
  price: 999,
  description: 'One year premium'
});
const updated = await certificatesAPI.update(1, {
  name: 'Premium Plus',
  price: 1299
});
await certificatesAPI.delete(1);
```

#### Users (Admin Only)
```typescript
const users = await usersAPI.getAll();
const user = await usersAPI.getById(1);
const newUser = await usersAPI.create({
  username: 'admin',
  email: 'admin@mail.com',
  role: 'Admin'
});
const updated = await usersAPI.update(1, { username: 'admin2' });
await usersAPI.delete(1);

// Активировать пользователя
const activated = await usersAPI.activate(1);
```

#### Orders
```typescript
// Создать заказ из корзины
const order = await ordersAPI.createOrder([
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 }
]);

// Получить корзину пользователя
const cartItems = await ordersAPI.getUserCart(userId);

// Оформить заказ (checkout)
const completedOrder = await ordersAPI.checkout(userId);

// История заказов
const orders = await ordersAPI.getHistory(userId);

// Удалить товар из корзины
await ordersAPI.removeItem(itemId);

// Обновить количество
const updated = await ordersAPI.updateQuantity(itemId, 5);
```

#### Health Check
```typescript
const status = await healthAPI.ping();
```

## Error Handling

```typescript
try {
  const products = await productsAPI.getAll();
} catch (error) {
  if (error.response?.status === 401) {
    console.log('Unauthorized - token expired');
    // Token удалится автоматически (http.ts interceptor)
  } else if (error.response?.status === 403) {
    console.log('Access denied');
  } else if (error.response?.status === 404) {
    console.log('Not found');
  } else {
    console.error('Error:', error.message);
  }
}
```

## Authorization

- JWT токен **автоматически** добавляется ко всем запросам (если есть в localStorage)
- При `401` ошибке токен удаляется и страница перезагружается
- Admin endpoints требуют роль `Admin` в JWT токене

## Types

Все типы определены в `src/api/index.ts`:
- `User`, `Product`, `Category`, `Certificate`, `Order`, `OrderItem`
- `LoginRequest`, `RegisterRequest`, `AuthResponse`

## Migration from Old API

**Старые файлы:**
- `src/utils/api.ts` → используй `src/api/index.ts`
- `src/utils/adminApi.ts` → используй `src/api/index.ts`

**Компоненты уже обновлены:**
- ✅ AdminProductsTab.tsx
- ✅ AdminUsersTab.tsx
- ✅ AdminCertificatesTab.tsx
- ✅ AuthContext.tsx
