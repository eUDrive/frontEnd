import { useState } from 'react';
import { AdminProductsTab } from '../components/Admin/AdminProductsTab';
import { AdminUsersTab } from '../components/Admin/AdminUsersTab';
import { AdminCertificatesTab } from '../components/Admin/AdminCertificatesTab';
import { AdminCategoriesTab } from '../components/Admin/AdminCategoriesTab';
import './AdminPage.css';

type TabType = 'products' | 'categories' | 'certificates' | 'users';

function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('products');

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">🛠️ Админ-панель eUDrive</h1>

        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Продукты
          </button>
          <button
            className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            🏷️ Категории
          </button>
          <button
            className={`tab-button ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            🎖️ Сертификаты
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Пользователи
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'products' && <AdminProductsTab />}
          {activeTab === 'categories' && <AdminCategoriesTab />}
          {activeTab === 'certificates' && <AdminCertificatesTab />}
          {activeTab === 'users' && <AdminUsersTab />}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
