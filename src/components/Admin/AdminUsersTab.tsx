import { useState, useEffect } from 'react';
import { usersAPI } from '../../api/index';
import { http } from '../../api/http';
import './AdminUsersTab.css';

interface User {
  id: number;
  username: string;
  email: string;
  isActive?: boolean;
  createdAt?: string;
}

export function AdminUsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isActive: true,
  });
  const [searchId, setSearchId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const users = await usersAPI.getAll();
      setUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      alert('Ошибка при загрузке пользователей');
    }
    setIsLoading(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchId(value);

    if (value === '') {
      setFilteredUsers(users);
    } else {
      const userId = parseInt(value);
      const filtered = users.filter(user => user.id === userId);
      setFilteredUsers(filtered);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      if (editingId) {
        const userData = {
          id: editingId,
          username: formData.username,
          email: formData.email,
          isActive: formData.isActive,
        };
        await usersAPI.update(editingId, userData);
        alert('Пользователь обновлён');
      } else {
        if (!formData.password) {
          alert('Заполните пароль для нового пользователя');
          return;
        }
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };
        await usersAPI.create(userData);
        alert('Пользователь добавлен');
      }

      setFormData({ username: '', email: '', password: '', isActive: true });
      setEditingId(null);
      loadUsers();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении пользователя');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Вы уверены в удалении пользователя?')) return;
    try {
      await usersAPI.delete(id);
      alert('Пользователь удалён');
      loadUsers();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении пользователя');
    }
  };

  const handleEditUser = (user: User) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
    setEditingId(user.id);
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      // Send isActive in the request body
      await http.put(`/api/user/activate/${id}`, { id, isActive: !currentStatus });
      alert(currentStatus ? 'Пользователь деактивирован' : 'Пользователь активирован');
      loadUsers();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при изменении статуса');
    }
  };

  return (
    <div className="admin-tab">
      <h2>👥 Управление Пользователями</h2>

      <form className="admin-form" onSubmit={handleAddUser}>
        <div className="form-group">
          <label>Имя пользователя</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            placeholder="john_doe"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="user@example.com"
          />
        </div>

        {!editingId && (
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingId}
              placeholder="Пароль для нового пользователя"
            />
          </div>
        )}

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
          {editingId ? '✏️ Обновить' : '➕ Добавить'} пользователя
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary" onClick={() => {
            setEditingId(null);
            setFormData({ username: '', email: '', password: '', isActive: true });
          }}>
            Отмена
          </button>
        )}
      </form>

      <div className="search-section">
        <input
          type="number"
          placeholder="Поиск по ID пользователя..."
          value={searchId}
          onChange={handleSearch}
          className="search-input"
        />
        <button onClick={loadUsers} className="btn btn-secondary">
          🔄 Обновить
        </button>
      </div>

      <div className="users-list">
        <h3>Список пользователей ({filteredUsers.length})</h3>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : filteredUsers.length === 0 ? (
          <p>Пользователей не найдено</p>
        ) : (
          <div className="admin-cards-grid">
            {filteredUsers.map((user) => (
              <div key={user.id} className="admin-card">
                <div className="admin-card__content">
                  <div className="admin-card__header">
                    <h4 className="admin-card__title">{user.username}</h4>
                    <span className="admin-card__id">ID: {user.id}</span>
                  </div>
                  <div className="admin-card__details">
                    <p className="admin-card__detail-row">
                      <span className="admin-card__label">Email:</span>
                      <span className="admin-card__value" title={user.email}>
                        {user.email.length > 20
                          ? user.email.substring(0, 20) + '...'
                          : user.email}
                      </span>
                    </p>
                    <p className="admin-card__detail-row">
                      <span className="admin-card__label">Статус:</span>
                      <span className="admin-card__value">
                        {user.isActive ? '✅ Активен' : '⚠️ Неактивен'}
                      </span>
                    </p>
                    {user.createdAt && (
                      <p className="admin-card__detail-row">
                        <span className="admin-card__label">Создан:</span>
                        <span className="admin-card__value">
                          {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="admin-card__footer">
                  <button
                    className={`btn btn-small ${
                      user.isActive ? 'btn-success' : 'btn-warning'
                    }`}
                    onClick={() =>
                      handleToggleActive(
                        user.id,
                        user.isActive !== undefined ? user.isActive : true
                      )
                    }
                  >
                    {user.isActive ? '✅ Активен' : '⚠️ Неактивен'}
                  </button>
                  <button
                    className="btn btn-small btn-info"
                    onClick={() => handleEditUser(user)}
                  >
                    ✏️ Изменить
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
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
