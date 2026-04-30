import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './PersonalCabinetPage.css';

export const PersonalCabinetPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings' | 'help'>('profile');

  if (!user) {
    return (
      <div className="cabinet-page">
        <div className="cabinet-empty">
          <h2>Требуется вход</h2>
          <p>Пожалуйста, войдите в аккаунт для доступа к личному кабинету</p>
          <button className="btn btn-primary" onClick={() => navigate('/auth')}>
            Вернуться к входу
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="cabinet-page">
      <div className="cabinet-container">
        {/* Header */}
        <div className="cabinet-header">
          <div className="cabinet-header-content">
            <div className="cabinet-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <span>{user.username.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="cabinet-header-info">
              <h1>Добро пожаловать, {user.username}!</h1>
              <p className="cabinet-email">{user.email}</p>
              {user.provider && (
                <p className="cabinet-provider">Поставщик: {user.provider}</p>
              )}
            </div>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Выход
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="cabinet-tabs">
          <button
            className={`cabinet-tab ${activeTab === 'profile' ? 'cabinet-tab--active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="tab-icon">👤</span>
            Профиль
          </button>
          <button
            className={`cabinet-tab ${activeTab === 'orders' ? 'cabinet-tab--active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="tab-icon">📦</span>
            Заказы
          </button>
          <button
            className={`cabinet-tab ${activeTab === 'settings' ? 'cabinet-tab--active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="tab-icon">⚙️</span>
            Параметры
          </button>
          <button
            className={`cabinet-tab ${activeTab === 'help' ? 'cabinet-tab--active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            <span className="tab-icon">❓</span>
            Помощь
          </button>
        </div>

        {/* Content */}
        <div className="cabinet-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="cabinet-section">
              <h2>Информация профиля</h2>
              <div className="profile-card">
                <div className="profile-field">
                  <label>Полное имя</label>
                  <p>{user.username}</p>
                </div>
                <div className="profile-field">
                  <label>E-mail адрес</label>
                  <p>{user.email}</p>
                </div>
                <div className="profile-field">
                  <label>ID пользователя</label>
                  <p className="user-id">{user.id}</p>
                </div>
              </div>
              <button className="btn btn-secondary btn-edit">
                Редактировать профиль
              </button>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="cabinet-section">
              <h2>История заказов</h2>
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <p>У вас нет заказов</p>
                <button className="btn btn-primary" onClick={() => navigate('/catalog')}>
                  Перейти в каталог
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="cabinet-section">
              <h2>Параметры аккаунта</h2>
              <div className="settings-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Уведомления</h3>
                    <p>Управляйте уведомлениями по электронной почте</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Двухфакторная аутентификация</h3>
                    <p>Добавьте дополнительный уровень безопасности</p>
                  </div>
                  <button className="btn btn-small">Включить</button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Приватность</h3>
                    <p>Управляйте вашей приватностью</p>
                  </div>
                  <button className="btn btn-small">Управлять</button>
                </div>
              </div>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === 'help' && (
            <div className="cabinet-section">
              <h2>Помощь и поддержка</h2>
              <div className="help-items">
                <div className="help-item">
                  <h3>Часто задаваемые вопросы</h3>
                  <p>Найдите ответы на общие вопросы</p>
                  <a href="#faq" className="help-link">Перейти к FAQ →</a>
                </div>
                <div className="help-item">
                  <h3>Связаться с поддержкой</h3>
                  <p>Наша команда готова помочь вам</p>
                  <a href="#contact" className="help-link">Отправить сообщение →</a>
                </div>
                <div className="help-item">
                  <h3>Документация</h3>
                  <p>Прочитайте нашу документацию</p>
                  <a href="#docs" className="help-link">Просмотр документов →</a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
