import { useState } from 'react';
import { AdminProductsTab } from '../components/Admin/AdminProductsTab';
import { AdminUsersTab } from '../components/Admin/AdminUsersTab';
import { AdminCertificatesTab } from '../components/Admin/AdminCertificatesTab';
import './AdminPage.css';

type TabType = 'products' | 'users' | 'certificates';

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
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Пользователи
          </button>
          <button
            className={`tab-button ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            🎖️ Сертификаты
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'products' && <AdminProductsTab />}
          {activeTab === 'users' && <AdminUsersTab />}
          {activeTab === 'certificates' && <AdminCertificatesTab />}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
