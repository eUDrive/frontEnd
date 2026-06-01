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

  // ── Change product status ────────────────────────────────────────────────────
  const handleChangeStatus = async (productId: number, newStatus: number) => {
    try {
      await productsAPI.update(productId, { status: newStatus });
      alert('✅ Статус продукта обновлён');
      loadProducts();
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      alert('❌ Ошибка при обновлении статуса');
    }
  };

  // ── Delete product image ──────────────────────────────────────────────────────
  const handleDeleteImage = async (productId: number, imageId: number) => {
    if (!confirm('Вы уверены в удалении этого изображения?')) return;
    try {
      await imagesAPI.delete(productId, imageId);
      alert('✅ Изображение удалено');
      loadProducts();
    } catch (error) {
      console.error('Ошибка удаления изображения:', error);
      alert('❌ Ошибка при удалении изображения');
    }
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
          <div className="admin-cards-grid">
            {products.map((product) => (
              <div key={product.id} className="admin-card">
                {product.images && product.images.length > 0 && (
                  <div className="admin-card__images-gallery">
                    <div className="admin-card__main-image">
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                      />
                      {product.images[0].id && (
                        <button
                          className="admin-card__image-delete-btn"
                          onClick={() => handleDeleteImage(product.id, product.images![0].id!)}
                          title="Удалить изображение"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {product.images.length > 1 && (
                      <div className="admin-card__thumbnail-list">
                        {product.images.slice(0, 3).map((img, idx) => (
                          <div
                            key={idx}
                            className="admin-card__thumbnail-wrapper"
                          >
                            <img
                              src={img.url}
                              alt={`${product.name} ${idx + 1}`}
                              className="admin-card__thumbnail"
                            />
                            {img.id && (
                              <button
                                className="admin-card__thumbnail-delete-btn"
                                onClick={() => handleDeleteImage(product.id, img.id!)}
                                title="Удалить изображение"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        {product.images.length > 3 && (
                          <div className="admin-card__thumbnail-more">
                            +{product.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="admin-card__content">
                  <div className="admin-card__header">
                    <h4 className="admin-card__title">{product.name}</h4>
                    <span className="admin-card__id">ID: {product.id}</span>
                  </div>
                  <div className="admin-card__details">
                    <p className="admin-card__detail-row">
                      <span className="admin-card__label">Цена:</span>
                      <span className="admin-card__value">${product.price}</span>
                    </p>
                    <p className="admin-card__detail-row">
                      <span className="admin-card__label">Количество:</span>
                      <span className="admin-card__value">{product.stock}</span>
                    </p>
                    <p className="admin-card__detail-row">
                      <span className="admin-card__label">Категория:</span>
                      <span className="admin-card__value">
                        {categories.find((c) => c.id === product.categoryId)?.name || 'Unknown'}
                      </span>
                    </p>
                    <p className="admin-card__detail-row">
                      <span className="admin-card__label">Статус:</span>
                      <select
                        className="admin-card__status-select"
                        value={product.status || 0}
                        onChange={(e) => handleChangeStatus(product.id, parseInt(e.target.value))}
                      >
                        <option value={0}>✅ Активен</option>
                        <option value={1}>⚠️ Неактивен</option>
                        <option value={2}>🔒 Продан</option>
                      </select>
                    </p>
                    {product.images && product.images.length > 0 && (
                      <p className="admin-card__detail-row">
                        <span className="admin-card__label">Фото:</span>
                        <span className="admin-card__value">{product.images.length}</span>
                      </p>
                    )}
                  </div>
                  <p className="admin-card__description">
                    {typeof product.description === 'string'
                      ? product.description
                      : (product.description as any)?.description || 'Нет описания'}
                  </p>
                </div>
                <div className="admin-card__footer">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
