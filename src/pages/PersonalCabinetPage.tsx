import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './PersonalCabinetPage.css';
import { ordersAPI, productsAPI } from '../api/index';

export const PersonalCabinetPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings' | 'help'>('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'orders') {
      setOrdersLoading(true);
      const loadOrders = async () => {
        try {
          const userOrders = await ordersAPI.getHistory(user.id);
          
          // Загружаем информацию о товарах для каждого заказа
          const ordersWithDetails = await Promise.all(
            userOrders.map(async (order: any) => {
              const itemsWithDetails = await Promise.all(
                order.orderItems?.map(async (item: any) => {
                  try {
                    // Получаем информацию о товаре
                    const product = await productsAPI.getById(item.itemId);
                    return {
                      ...item,
                      product: product,
                    };
                  } catch (error) {
                    console.error('Ошибка загрузки товара:', error);
                    return item;
                  }
                }) || []
              );
              
              return {
                ...order,
                orderItems: itemsWithDetails,
              };
            })
          );
          
          setOrders(ordersWithDetails);
        } catch (error) {
          console.error('Ошибка загрузки заказов:', error);
          setOrders([]);
        } finally {
          setOrdersLoading(false);
        }
      };
      loadOrders();
    }
  }, [activeTab]);

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
                  {ordersLoading ? (
                      <p>Загрузка заказов...</p>
                  ) : orders.length === 0 ? (
                      <div className="empty-state">
                          <div className="empty-icon">📦</div>
                          <p>У вас нет заказов</p>
                          <button className="btn btn-primary" onClick={() => navigate('/catalog')}>
                              Перейти в каталог
                          </button>
                      </div>
                  ) : (
                      <div className="orders-list">
                          {orders.map((order: any) => (
                              <div key={order.id} className="order-card">
                                  <div className="order-header">
                                      <div>
                                          <h4>Заказ #{order.id}</h4>
                                          <p className="order-date">
                                              {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                                                  year: 'numeric',
                                                  month: 'long',
                                                  day: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                              })}
                                          </p>
                                      </div>
                                      <div className="order-total">
                                          <span className="total-amount">{order.totalPrice.toLocaleString('ru-RU')} $</span>
                                          <span className="order-status">✅ Завершён</span>
                                      </div>
                                  </div>
                                  
                                  <div className="order-items-grid">
                                      {order.orderItems?.map((item: any) => (
                                          <div key={item.id} className="order-item">
                                              <div className="order-item-image">
                                                  {item.product?.images?.[0]?.url ? (
                                                      <img 
                                                          src={item.product.images[0].url} 
                                                          alt={item.product?.name || 'Товар'}
                                                      />
                                                  ) : (
                                                      <div className="no-image">📦</div>
                                                  )}
                                              </div>
                                              <div className="order-item-info">
                                                  <h5>{item.product?.name || `Товар #${item.itemId}`}</h5>
                                                  <p className="item-quantity">Кол-во: {item.quantity} шт.</p>
                                                  <p className="item-price">{(item.priceAtPurchase * item.quantity).toLocaleString('ru-RU')} $</p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
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
