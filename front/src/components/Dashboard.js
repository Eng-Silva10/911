// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { logout } from '../auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsResponse = await api.get('/dashboard/stats');
      setStats(statsResponse.data);

      const newsResponse = await api.get('/news');
      setNews(newsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
      try {
        await api.delete(`/news/${id}`);
        fetchData(); // Refresh the news list
      } catch (error) {
        console.error('Failed to delete news', error);
      }
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mt-5" style={{ direction: 'rtl' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-tachometer-alt me-2"></i> لوحة التحكم</h2>
        <button className="btn btn-danger rounded-pill px-4" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2"></i> خروج
        </button>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-12">
          <div className="card reports-link p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <i className="fas fa-exclamation-triangle text-warning fa-2x me-3"></i>
                <h4 className="mb-0">البلاغات الجديدة</h4>
              </div>
              <button onClick={() => navigate('/reports')} className="btn btn-warning rounded-pill fw-bold">
                يوجد <span className="badge bg-danger rounded-pill px-3 py-2 ms-2">{stats.reports_count}</span> بلاغ جديد <i className="fas fa-arrow-left ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span><i className="fas fa-newspaper me-2"></i> الأخبار</span>
              <button onClick={() => navigate('/add-news')} className="btn btn-success btn-sm rounded-pill px-3">
                <i className="fas fa-plus-circle me-1"></i> إضافة خبر
              </button>
            </div>
            <div className="card-body">
              {news.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>العنوان</th>
                        <th className="text-center">الحالة</th>
                        <th className="text-center">إدارة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news.map(item => (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td className="text-center">
                            <span className={`badge status-badge bg-${item.status === 'true' ? 'success' : 'danger'}`}>
                              {item.status === 'true' ? 'صحيح' : 'إشاعة'}
                            </span>
                          </td>
                          <td className="text-center">
                            <button onClick={() => navigate(`/edit-news/${item.id}`)} className="btn btn-warning btn-sm mx-1">
                              <i className="fas fa-edit"></i> تعديل
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">
                              <i className="fas fa-trash-alt"></i> حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info text-center">لا يوجد أخبار في قاعدة البيانات.</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <i className="fas fa-chart-line me-2"></i> أكثر الكلمات بحثاً
            </div>
            <div className="card-body">
              {stats.top_searches && stats.top_searches.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {stats.top_searches.map((log) => (
                    <li key={log.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{log.keyword}</span>
                      <span className="badge bg-primary rounded-pill">{log.count} مرة</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-center">لا توجد بيانات بعد.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;