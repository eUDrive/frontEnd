import { useState, useEffect } from 'react';
import { usersAPI } from '../../utils/adminApi';
import './AdminUsersTab.css';

interface User {
  id: number;
  username: string;
  email: string;
}

export function AdminUsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await usersAPI.getAll();
      const userData = response.data || response;
      setUsers(userData);
      setFilteredUsers(userData);
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

  return (
    <div className="admin-tab">
      <h2>👥 Управление Пользователями</h2>

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
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}