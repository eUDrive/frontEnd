import { useState } from 'react';
import type { Car } from '../data/products';
import './AdminPage.css';

function AdminPage() {
  const [formData, setFormData] = useState({
    // Product данные
    name: '',
    imageFile: null as File | null,
    imagePreview: '',
    category: 'Sport' as 'GT' | 'Touring' | 'Sport',
    price: '',
    stock: '1',
    
    // ProductDescription данные
    description: '',
    height: '',
    width: '',
    length: '',
  });

  const [addedCars, setAddedCars] = useState<Car[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'stock' || name === 'height' || name === 'width' || name === 'length') {
      setFormData({ ...formData, [name]: value ? parseFloat(value) : '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.imagePreview
    ) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Структура для отправки на backend
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      status: "Active",
      description: formData.description,
      images: [
        {
          url: formData.imagePreview,
        }
      ],
      descriptionAdvanced: {
        h: formData.height ? Number(formData.height) : 0,
        w: formData.width ? Number(formData.width) : 0,
        l: formData.length ? Number(formData.length) : 0,
      }
    };

    const newCar: Car = {
      id: addedCars.length > 0 ? Math.max(...addedCars.map(c => c.id)) + 1 : 1,
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      images: [
        {
          id: 1,
          url: formData.imagePreview,
          productId: 0
        }
      ],
      description: formData.description ? {
        id: 1,
        description: formData.description,
        descriptionAdvanced: {
          id: 1,
          h: formData.height ? Number(formData.height) : 0,
          w: formData.width ? Number(formData.width) : 0,
          l: formData.length ? Number(formData.length) : 0,
        }
      } : undefined,
      status: "Active"
    };

    setAddedCars([...addedCars, newCar]);
    setSuccessMessage(`✓ Автомобиль "${newCar.name}" успешно добавлен!`);
    
    // TODO: Отправить productData на backend
    console.log('Данные для отправки на backend:', productData);

    // Очистка формы
    setFormData({
      name: '',
      imageFile: null,
      imagePreview: '',
      category: 'Sport',
      price: '',
      stock: '1',
      description: '',
      height: '',
      width: '',
      length: '',
    });

    // Скрыть сообщение через 3 секунды
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(addedCars, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cars_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleDeleteCar = (id: number) => {
    setAddedCars(addedCars.filter(car => car.id !== id));
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Админ-панель eUDrive</h1>
        <p className="admin-subtitle">Управление автомобилями</p>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Добавить новый автомобиль</h2>
            
            <div className="form-subsection">
              <h3 className="subsection-title">📦 Данные продукта (Product)</h3>
              <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Название продукта *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Название"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Категория</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Sport">Sport</option>
                  <option value="GT">GT</option>
                  <option value="Touring">Touring</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Цена ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Цена"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Количество в наличии</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Количество"
                  min="0"
                />
              </div>
            </div>
            </div>

            <div className="form-subsection">
              <h3 className="subsection-title">📋 Данные производительности (Performance Specs)</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="height">Мощность (л.с.)</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="Horsepower"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="width">Вес (kg)</label>
                  <input
                    type="number"
                    id="width"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    placeholder="Weight"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="length">Разгон 0-100 (сек × 10)</label>
                  <input
                    type="number"
                    id="length"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    placeholder="Acceleration time in tenths"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Опишите особенности автомобиля..."
                rows={4}
              ></textarea>
            </div>

            <div className="form-group full-width image-upload">
              <label htmlFor="image">Загрузить изображение *</label>
              <div className="upload-area">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {formData.imagePreview && (
                  <div className="image-preview">
                    <img src={formData.imagePreview} alt="Preview" />
                    <p>{formData.imageFile?.name}</p>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Добавить автомобиль
            </button>
          </div>
        </form>

        {addedCars.length > 0 && (
          <div className="cars-list-section">
            <div className="section-header">
              <h2>Добавленные автомобили ({addedCars.length})</h2>
              <button className="btn btn-secondary" onClick={handleExport}>
                📥 Экспортировать JSON
              </button>
            </div>

            <div className="cars-grid">
              {addedCars.map((car) => (
                <div key={car.id} className="car-card">
                  {car.images && car.images.length > 0 && (
                    <img src={car.images[0].url} alt={car.name} className="car-image" />
                  )}
                  <div className="car-info">
                    <h3>{car.name}</h3>
                    <div className="car-details-grid">
                      <p className="detail-item">
                        <span className="detail-label">Цена:</span> ${car.price}
                      </p>
                      <p className="detail-item">
                        <span className="detail-label">Количество:</span> {car.stock}
                      </p>
                      <p className="detail-item">
                        <span className="detail-label">Категория:</span> {car.category}
                      </p>
                      <p className="detail-item">
                        <span className="detail-label">Статус:</span> {car.status}
                      </p>
                    </div>
                    {car.description && <p className="car-description">{car.description.description}</p>}
                    {car.description?.descriptionAdvanced && (
                      <div className="car-dimensions">
                        <p>Мощность: {car.description.descriptionAdvanced.h} л.с. | Вес: {car.description.descriptionAdvanced.w} kg | 0-100: {(car.description.descriptionAdvanced.l / 10).toFixed(1)}s</p>
                      </div>
                    )}
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleDeleteCar(car.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
