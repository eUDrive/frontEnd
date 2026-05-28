import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../../utils/adminApi';
import './AdminProductsTab.css';
import { ImageUploader } from './ImageUploader';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  description?: any;
  images: any[];
  status: string;
}

export function AdminProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);  // ← ДОБАВЬ
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '', 
    price: '', 
    stock: '', 
    categoryId: '1', 
    description: '', 
    images: [] as any[]
  });

  // Загрузить продукты и категории при монтировании
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data || response);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      alert('Ошибка при загрузке продуктов');
    }
    setIsLoading(false);
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response);
      console.log('Категории загружены:', response);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      const newProduct = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        description: formData.description || '',
        images: formData.images.map(img => ({
          url: img.url,
          productId: 0
        }))
      };

      console.log('📤 Отправляю продукт:', newProduct.name);

      if (editingId) {
        await productsAPI.update(editingId, { ...newProduct, id: editingId });
        alert('✅ Продукт обновлён');
      } else {
        await productsAPI.create(newProduct);
        alert('✅ Продукт добавлен');
      }

      setFormData({ name: '', price: '', stock: '', categoryId: '1', description: '', images: [] });
      setEditingId(null);
      loadProducts();
    } catch (error) {
      console.error('❌ Ошибка:', error);
      alert('❌ Ошибка: ' + (error instanceof Error ? error.message : 'Unknown'));
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Вы уверены?')) return;
    try {
      await productsAPI.delete(id);
      alert('Продукт удалён');
      loadProducts();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении продукта');
    }
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      categoryId: product.categoryId.toString(),
      description: product.description?.description || '',
      images: product.images,
    });
    setEditingId(product.id);
  };

  return (
    <div className="admin-tab">
      <h2>📦 Управление Продуктами</h2>

      <form className="admin-form" onSubmit={handleAddProduct}>
        <div className="form-group">
          <label>Название</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Цена ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Количество</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Категория</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            {categories.length === 0 ? (
              <option>Загрузка категорий...</option>
            ) : (
              categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <ImageUploader
            images={formData.images}
            onImagesChange={(images) => setFormData({ ...formData, images })}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editingId ? '✏️ Обновить' : '➕ Добавить'} продукт
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', price: '', stock: '', categoryId: '1', description: '', images: [] });
          }}>
            Отмена
          </button>
        )}
      </form>

      <div className="products-list">
        <h3>Список продуктов ({products.length})</h3>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : products.length === 0 ? (
          <p>Продуктов не найдено</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Категория</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    {categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                  </td>
                  <td>{product.status}</td>
                  <td>
                    <button className="btn btn-small btn-info" onClick={() => handleEditProduct(product)}>
                      ✏️ Изменить
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDeleteProduct(product.id)}>
                      🗑️ Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}