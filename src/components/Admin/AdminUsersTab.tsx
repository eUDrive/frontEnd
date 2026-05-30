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
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя пользователя</th>
                <th>Email</th>
                <th>Статус</th>
                <th>Создан</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className={`btn btn-small ${user.isActive ? 'btn-success' : 'btn-warning'}`}
                      onClick={() => handleToggleActive(user.id, user.isActive !== undefined ? user.isActive : true)}
                    >
                      {user.isActive ? '✅ Активен' : '⚠️ Неактивен'}
                    </button>
                  </td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '-'}</td>
                  <td>
                    <button className="btn btn-small btn-info" onClick={() => handleEditUser(user)}>
                      ✏️ Изменить
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDeleteUser(user.id)}>
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
