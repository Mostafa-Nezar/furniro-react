import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Furniro Admin</h2>
          <p>مرحباً {user?.name}</p>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            لوحة التحكم
          </button>
          
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            إدارة المستخدمين
          </button>
          
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="nav-icon">📦</span>
            إدارة المنتجات
          </button>
          
          <button
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon">🛒</span>
            إدارة الطلبات
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <h1>
            {activeTab === 'dashboard' && 'لوحة التحكم'}
            {activeTab === 'users' && 'إدارة المستخدمين'}
            {activeTab === 'products' && 'إدارة المنتجات'}
            {activeTab === 'orders' && 'إدارة الطلبات'}
          </h1>
        </div>
        
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

