import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const AdminDashboard = () => {
  const { user } = useAppContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error">خطأ: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>لوحة تحكم المسؤول</h1>
        <p>مرحباً {user?.name}</p>
      </div>

      {dashboardData && (
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{dashboardData.statistics.totalUsers}</h3>
                <p>إجمالي المستخدمين</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>{dashboardData.statistics.totalProducts}</h3>
                <p>إجمالي المنتجات</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-content">
                <h3>{dashboardData.statistics.totalOrders}</h3>
                <p>إجمالي الطلبات</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{dashboardData.statistics.totalRatings}</h3>
                <p>إجمالي التقييمات</p>
              </div>
            </div>
          </div>

          {/* Recent Data */}
          <div className="recent-data">
            <div className="recent-section">
              <h2>أحدث الطلبات</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>المستخدم</th>
                      <th>المبلغ</th>
                      <th>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-6)}</td>
                        <td>{order.userId?.name || 'غير محدد'}</td>
                        <td>${order.totalAmount}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="recent-section">
              <h2>أحدث المستخدمين</h2>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>البريد الإلكتروني</th>
                      <th>النوع</th>
                      <th>تاريخ التسجيل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`user-type ${user.isAdmin ? 'admin' : 'user'}`}>
                            {user.isAdmin ? 'مسؤول' : 'مستخدم'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

