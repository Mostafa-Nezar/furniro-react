import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/admin/users?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, isAdmin) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAdmin })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const updatedUser = await response.json();
      setUsers(users.map(u => u._id === userId ? updatedUser : u));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="admin-users">
        <div className="loading">جاري تحميل المستخدمين...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users">
        <div className="error">خطأ: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>إدارة المستخدمين</h1>
        <p>إجمالي المستخدمين: {pagination.total}</p>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>النوع</th>
              <th>تاريخ التسجيل</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => (
              <tr key={userItem._id}>
                <td>{userItem.name}</td>
                <td>{userItem.email}</td>
                <td>
                  <select
                    value={userItem.isAdmin ? 'admin' : 'user'}
                    onChange={(e) => updateUserRole(userItem._id, e.target.value === 'admin')}
                    className="role-select"
                    disabled={userItem._id === user?._id}
                  >
                    <option value="user">مستخدم</option>
                    <option value="admin">مسؤول</option>
                  </select>
                </td>
                <td>{new Date(userItem.createdAt).toLocaleDateString('ar-EG')}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => deleteUser(userItem._id)}
                      className="delete-btn"
                      disabled={userItem._id === user?._id}
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            السابق
          </button>
          
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.pages}
            className="pagination-btn"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

