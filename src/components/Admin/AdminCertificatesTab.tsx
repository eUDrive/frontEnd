import { useState, useEffect } from 'react';
import { certificatesAPI } from '../../api/index';
import './AdminCertificatesTab.css';

interface Certificate {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  createdAt?: string;
  isActive?: boolean;
}

export function AdminCertificatesTab() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    isActive: true,
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setIsLoading(true);
    try {
      const certificates = await certificatesAPI.getAll();
      setCertificates(certificates);
    } catch (error) {
      console.error('Ошибка загрузки сертификатов:', error);
      alert('Ошибка при загрузке сертификатов');
    }
    setIsLoading(false);
  };

  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      const certificateData = {
        id: editingId || 0,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        isActive: formData.isActive,
      };

      if (editingId) {
        await certificatesAPI.update(certificateData);
        alert('Сертификат обновлён');
      } else {
        await certificatesAPI.create(certificateData);
        alert('Сертификат добавлен');
      }

      setFormData({ name: '', description: '', price: '', stock: '', isActive: true });
      setEditingId(null);
      loadCertificates();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении сертификата');
    }
  };

  const handleDeleteCertificate = async (id: number) => {
    if (!confirm('Вы уверены?')) return;
    try {
      await certificatesAPI.delete(id);
      alert('Сертификат удалён');
      loadCertificates();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении сертификата');
    }
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setFormData({
      name: certificate.name,
      description: certificate.description || '',
      price: certificate.price.toString(),
      stock: (certificate.stock || 0).toString(),
      isActive: certificate.isActive !== undefined ? certificate.isActive : true,
    });
    setEditingId(certificate.id);
  };

  return (
    <div className="admin-tab">
      <h2>🎖️ Управление Сертификатами</h2>

      <form className="admin-form" onSubmit={handleAddCertificate}>
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
          <label>Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          <label>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            Активный
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          {editingId ? '✏️ Обновить' : '➕ Добавить'} сертификат
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', stock: '', isActive: true });
          }}>
            Отмена
          </button>
        )}
      </form>

      <div className="certificates-list">
        <h3>Список сертификатов ({certificates.length})</h3>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : certificates.length === 0 ? (
          <p>Сертификатов не найдено</p>
        ) : (
          <div className="admin-cards-grid">
            {certificates.map((cert) => (
              <div key={cert.id} className="admin-card">
                <div className="admin-card__content">
                  <div className="admin-card__header">
                    <h4 className="admin-card__title">{cert.name}</h4>
                    <span className="admin-card__id">ID: {cert.id}</span>
                  </div>
                  <div className="admin-card__details">
                    <p className="admin-card__detail-row">
                      <span className="admin-card__label">Цена:</span>
                      <span className="admin-card__value">${cert.price}</span>
                    </p>
                    <p className="admin-card__detail-row">
                      <span className="admin-card__label">Количество:</span>
                      <span className="admin-card__value">{cert.stock || 0}</span>
                    </p>
                    <p className="admin-card__detail-row">
                      <span className="admin-card__label">Статус:</span>
                      <span className="admin-card__value">
                        {cert.isActive === true ? '✅ Активен' : '❌ Неактивен'}
                      </span>
                    </p>
                    {cert.createdAt && (
                      <p className="admin-card__detail-row">
                        <span className="admin-card__label">Создан:</span>
                        <span className="admin-card__value">
                          {new Date(cert.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </p>
                    )}
                  </div>
                  <p className="admin-card__description">
                    {cert.description || 'Нет описания'}
                  </p>
                </div>
                <div className="admin-card__footer">
                  <button
                    className="btn btn-small btn-info"
                    onClick={() => handleEditCertificate(cert)}
                  >
                    ✏️ Изменить
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDeleteCertificate(cert.id)}
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
