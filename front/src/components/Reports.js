// src/components/Reports.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/reports/${id}/status`, { status });
      fetchReports(); // Refresh the reports list
    } catch (error) {
      console.error('Failed to update report status', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البلاغ؟')) {
      try {
        await api.delete(`/reports/${id}`);
        fetchReports(); // Refresh the reports list
      } catch (error) {
        console.error('Failed to delete report', error);
      }
    }
  };

  return (
    <div className="container mt-5" style={{ direction: 'rtl' }}>
      <div className="admin-header d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-exclamation-triangle me-2"></i> إدارة البلاغات</h2>
        <button onClick={() => navigate('/')} className="btn btn-outline-light rounded-pill px-4">
          <i className="fas fa-arrow-right-to-bracket me-2"></i> العودة للوحة التحكم
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {reports.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>م</th>
                    <th>العنوان</th>
                    <th>الوصف</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.title}</td>
                      <td>{report.description}</td>
                      <td className={`text-${report.status === 'pending' ? 'warning' : report.status === 'true' ? 'success' : 'danger'}`}>
                        {report.status === 'pending' ? 'جاري المراجعة' : report.status === 'true' ? 'صحيح' : 'إشاعة'}
                      </td>
                      <td>
                        <button onClick={() => handleUpdateStatus(report.id, 'true')} className="btn btn-success btn-sm mx-1">
                          ✅ صحيح
                        </button>
                        <button onClick={() => handleUpdateStatus(report.id, 'false')} className="btn btn-danger btn-sm mx-1">
                          ❌ إشاعة
                        </button>
                        <button onClick={() => handleUpdateStatus(report.id, 'pending')} className="btn btn-warning btn-sm mx-1">
                          ⏳ مراجعة
                        </button>
                        <button onClick={() => handleDelete(report.id)} className="btn btn-secondary btn-sm">
                          🗑 حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info text-center">لا يوجد بلاغات في قاعدة البيانات.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;