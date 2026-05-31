import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, imagesAPI, type Product as APIProduct } from '../../api/index';
import './AdminProductsTab.css';
import { ImageUploader, type ImageEntry } from './ImageUploader';

interface Category {
  id: number;
  name: string;
}

interface Product extends APIProduct {
  status?: string | number;
}

interface FormData {
  name: string;
  price: string;
  stock: string;
  categoryId: string;
  description: string;
  images: ImageEntry[];
}

const EMPTY_FORM: FormData = {
  name: '',
  price: '',
  stock: '',
  categoryId: '1',
  description: '',
  images: [],
};

// ── Upload a single image file to the backend ────────────────────────────────
async function uploadImageFile(productId: number, file: File): Promise<void> {
  await imagesAPI.upload(productId, file);
}

export function AdminProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      alert('Ошибка при загрузке продуктов');
    }
    setIsLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const resetForm = () => {
    // Release object URLs to free browser memory
    formData.images.forEach((img) => {
      if (img.file) URL.revokeObjectURL(img.preview);
    });
    setFormData(EMPTY_FORM);
    setEditingId(null);
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Заполните обязательные поля');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        description: formData.description || '',
      };

      let productId: number;

      if (editingId) {
        await productsAPI.update(editingId, payload);
        productId = editingId;
      } else {
        // productsAPI.create must return the created product with its id
        const created = await productsAPI.create(payload);
        productId = created.data?.id;
        console.log('Create response:', created); // ← what does backend return?
        if (!created.isSuccess) {
            throw new Error(created.message || 'Ошибка создания продукта');
        }

        productId = created.data.id;
        console.log('Product id:', productId); // ← is this a real number?
      }

      // Upload only newly picked files (entries that have a File object)
      const pendingFiles = formData.images.filter((img) => img.file instanceof File);
      console.log('Pending files:', pendingFiles.length, pendingFiles.map(f => f.file!.name)); // ← are files here?


      if (pendingFiles.length > 0) {
        for (const img of pendingFiles) {
            console.log('Uploading:', img.file!.name, img.file!.size + 'bytes');
          await uploadImageFile(productId, img.file!);
        }
      }

      alert(editingId ? '✅ Продукт обновлён' : '✅ Продукт добавлен');
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('❌ Ошибка:', error);
      alert('❌ Ошибка: ' + (error instanceof Error ? error.message : 'Unknown'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
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

  // ── Edit — populate form with existing data ───────────────────────────────────
  const handleEditProduct = (product: Product) => {
    const desc =
      typeof product.description === 'string'
        ? product.description
        : (product.description as any)?.description || '';

    // Existing server images become ImageEntry with isExisting=true and no File
    const existingImages: ImageEntry[] = (product.images || []).map((img) => ({
        id: img.id,          // keep the id in case you need to delete specific images later
        preview: img.url,    // img.url is always a string from ImageDto
        isExisting: true,
    }));

    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: (product.stock || 0).toString(),
      categoryId: product.categoryId.toString(),
      description: desc,
      images: existingImages,
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
              categories.map((cat) => (
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

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? '⏳ Сохранение...' : editingId ? '✏️ Обновить' : '➕ Добавить'} продукт
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
            disabled={isSubmitting}
          >
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
                    {categories.find((c) => c.id === product.categoryId)?.name || 'Unknown'}
                  </td>
                  <td>{product.status}</td>
                  <td>
                    <button
                      className="btn btn-small btn-info"
                      onClick={() => handleEditProduct(product)}
                    >
                      ✏️ Изменить
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
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
