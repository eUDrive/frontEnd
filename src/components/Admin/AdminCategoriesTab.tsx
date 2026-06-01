import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../api/index';
import './AdminCategoriesTab.css';

interface Category {
  id: number;
  name: string;
  description?: string;
}

export function AdminCategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const categories = await categoriesAPI.getAll();
      setCategories(categories);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
      alert('Ошибка при загрузке категорий');
    }
    setIsLoading(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Заполните название категории');
      return;
    }

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
      };

      if (editingId) {
        await categoriesAPI.update(editingId, categoryData);
        alert('✅ Категория обновлена');
      } else {
        await categoriesAPI.create(categoryData);
        alert('✅ Категория добавлена');
      }

      setFormData({ name: '', description: '' });
      setEditingId(null);
      loadCategories();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Ошибка: ' + (error instanceof Error ? error.message : 'Unknown'));
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Вы уверены? Это удалит категорию.')) return;
    try {
      await categoriesAPI.delete(id);
      alert('✅ Категория удалена');
      loadCategories();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('❌ Ошибка при удалении категории');
    }
  };

  const handleEditCategory = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setEditingId(category.id);
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
  };

  return (
    <div className="admin-tab">
      <h2>🏷️ Управление Категориями</h2>

      <form className="admin-form" onSubmit={handleAddCategory}>
        <div className="form-group">
          <label>Название категории *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Например: Электроника"
            required
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Описание категории"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? '✏️ Обновить' : '➕ Добавить'} категорию
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              ✕ Отменить
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="admin-list">
          <h3>📋 Список категорий ({categories.length})</h3>
          {categories.length === 0 ? (
            <p>Нет категорий</p>
          ) : (
            <div className="admin-cards-grid">
              {categories.map((category) => (
                <div key={category.id} className="admin-card">
                  <div className="admin-card__content">
                    <div className="admin-card__header">
                      <h4 className="admin-card__title">{category.name}</h4>
                      <span className="admin-card__id">ID: {category.id}</span>
                    </div>
                    <p className="admin-card__description">
                      {category.description || 'Нет описания'}
                    </p>
                  </div>
                  <div className="admin-card__footer">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="btn btn-small btn-info"
                    >
                      ✏️ Изменить
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="btn btn-small btn-danger"
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
