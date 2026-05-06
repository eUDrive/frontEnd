import { useState, useEffect } from 'react';
import { productsAPI } from '../../utils/adminApi';
import './AdminProductsTab.css';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: any;
  images: any[];
  status: string;
}

export function AdminProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '', price: '', stock: '', category: 'Sport',
    description: '', images: [] as any[]
  });

  // Загрузить продукты при монтировании
  useEffect(() => {
    loadProducts();
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
        category: formData.category,
        description: formData.description,
        images: formData.images,
      };

      if (editingId) {
        await productsAPI.update(editingId, { ...newProduct, id: editingId });
        alert('Продукт обновлён');
      } else {
        await productsAPI.create(newProduct);
        alert('Продукт добавлен');
      }

      setFormData({ name: '', price: '', stock: '', category: 'Sport', description: '', images: [] });
      setEditingId(null);
      loadProducts();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении продукта');
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
      category: product.category,
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
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="Sport">Sport</option>
            <option value="GT">GT</option>
            <option value="Touring">Touring</option>
          </select>
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editingId ? '✏️ Обновить' : '➕ Добавить'} продукт
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', price: '', stock: '', category: 'Sport', description: '', images: [] });
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
                  <td>{product.category}</td>
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