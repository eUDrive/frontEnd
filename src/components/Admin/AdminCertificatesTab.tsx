import { useState, useEffect } from 'react';
import { certificatesAPI } from '../../utils/adminApi';
import './AdminCertificatesTab.css';

interface Certificate {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  isActive: boolean;
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
      const response = await certificatesAPI.getAll();
      setCertificates(response.data || response);
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
      const newCertificate = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        isActive: formData.isActive,
      };

      if (editingId) {
        await certificatesAPI.update({ ...newCertificate, id: editingId });
        alert('Сертификат обновлён');
      } else {
        await certificatesAPI.create(newCertificate);
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
      description: certificate.description,
      price: certificate.price.toString(),
      stock: certificate.stock.toString(),
      isActive: certificate.isActive,
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
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Статус</th>
                <th>Создан</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr key={cert.id}>
                  <td>{cert.id}</td>
                  <td>{cert.name}</td>
                  <td>${cert.price}</td>
                  <td>{cert.stock}</td>
                  <td>{cert.isActive ? '✅ Активен' : '❌ Неактивен'}</td>
                  <td>{new Date(cert.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-small btn-info" onClick={() => handleEditCertificate(cert)}>
                      ✏️ Изменить
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDeleteCertificate(cert.id)}>
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