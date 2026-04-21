import { useState } from 'react';
import type { Car } from '../data/products';
import './AdminPage.css';

function AdminPage() {
  const [formData, setFormData] = useState({
    // Product данные
    brand: '',
    model: '',
    imageFile: null as File | null,
    imagePreview: '',
    category: 'Sport' as 'GT' | 'Touring' | 'Sport',
    pricePerPackage: '',
    
    // ProductDescription данные
    year: new Date().getFullYear(),
    horsePower: '',
    engineVolume: '',
    acceleration: '',
    description: '',
  });

  const [addedCars, setAddedCars] = useState<Car[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'year' || name === 'horsePower' || name === 'pricePerPackage' || name === 'engineVolume') {
      setFormData({ ...formData, [name]: value ? parseInt(value) : '' });
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
      !formData.brand ||
      !formData.model ||
      !formData.horsePower ||
      !formData.pricePerPackage ||
      !formData.imagePreview
    ) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Структура для отправки на backend
    const productData = {
      // Product
      brand: formData.brand,
      model: formData.model,
      imageUrl: formData.imagePreview,
      category: formData.category,
      pricePerPackage: Number(formData.pricePerPackage),
      
      // ProductDescription
      year: formData.year,
      horsePower: Number(formData.horsePower),
      engineVolume: formData.engineVolume ? Number(formData.engineVolume) : null,
      acceleration: formData.acceleration ? Number(formData.acceleration) : null,
      description: formData.description,
    };

    const newCar: Car = {
      id: addedCars.length > 0 ? Math.max(...addedCars.map(c => c.id)) + 1 : 1,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      horsePower: Number(formData.horsePower),
      category: formData.category,
      imageUrl: formData.imagePreview,
      pricePerPackage: Number(formData.pricePerPackage),
      description: formData.description,
    };

    setAddedCars([...addedCars, newCar]);
    setSuccessMessage(`✓ Автомобиль "${newCar.brand} ${newCar.model}" успешно добавлен!`);
    
    // TODO: Отправить productData на backend
    console.log('Данные для отправки на backend:', productData);

    // Очистка формы
    setFormData({
      brand: '',
      model: '',
      imageFile: null,
      imagePreview: '',
      category: 'Sport',
      pricePerPackage: '',
      year: new Date().getFullYear(),
      horsePower: '',
      engineVolume: '',
      acceleration: '',
      description: '',
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
                <label htmlFor="brand">Марка *</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Марка"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="model">Модель *</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Модель"
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
                <label htmlFor="pricePerPackage">Цена за пакет (€) *</label>
                <input
                  type="number"
                  id="pricePerPackage"
                  name="pricePerPackage"
                  value={formData.pricePerPackage}
                  onChange={handleInputChange}
                  placeholder="Цена"
                  required
                />
              </div>
            </div>
            </div>

            <div className="form-subsection">
              <h3 className="subsection-title">📋 Данные описания (ProductDescription)</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="year">Год выпуска</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="2000"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="horsePower">Мощность (л.с.) *</label>
                  <input
                    type="number"
                    id="horsePower"
                    name="horsePower"
                    value={formData.horsePower}
                    onChange={handleInputChange}
                    placeholder="Л.С."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="engineVolume">Объем двигателя (cc)</label>
                  <input
                    type="number"
                    id="engineVolume"
                    name="engineVolume"
                    value={formData.engineVolume}
                    onChange={handleInputChange}
                    placeholder="Объем куб.мм"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="acceleration">Разгон 0-100 (сек)</label>
                  <input
                    type="number"
                    id="acceleration"
                    name="acceleration"
                    value={formData.acceleration}
                    onChange={handleInputChange}
                    placeholder="Разгон 0-100"
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
                  {car.imageUrl && (
                    <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="car-image" />
                  )}
                  <div className="car-info">
                    <h3>{car.brand} {car.model}</h3>
                    <div className="car-details-grid">
                      <p className="detail-item">
                        <span className="detail-label">Год:</span> {car.year}
                      </p>
                      <p className="detail-item">
                        <span className="detail-label">Мощность:</span> {car.horsePower} л.с.
                      </p>
                      <p className="detail-item">
                        <span className="detail-label">Категория:</span> {car.category}
                      </p>
                      <p className="detail-item">
                        <span className="detail-label">Цена:</span> €{car.pricePerPackage}
                      </p>
                    </div>
                    {car.description && <p className="car-description">{car.description}</p>}
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