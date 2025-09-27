// src/components/AddNews.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css';

const AddNews = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('true');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/news', { title, description, status });
      navigate('/');
    } catch (error) {
      console.error('Failed to add news', error);
    }
  };

  return (
    <div className="container mt-5" style={{ direction: 'rtl' }}>
      <div className="admin-header d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-plus-circle me-2"></i> إضافة خبر جديد</h2>
        <button onClick={() => navigate('/')} className="btn btn-outline-light rounded-pill px-4">
          <i className="fas fa-arrow-right-to-bracket me-2"></i> العودة للوحة التحكم
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="form-container p-5 rounded shadow">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">العنوان</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">الوصف</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows="5"></textarea>
              </div>
              <div className="mb-4">
                <label className="form-label">الحالة</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
                  <option value="true">✅ صحيح</option>
                  <option value="false">❌ إشاعة</option>
                </select>
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success px-4 rounded-pill">
                  <i className="fas fa-save me-2"></i> حفظ
                </button>
                <button type="button" onClick={() => navigate('/')} className="btn btn-secondary px-4 rounded-pill">
                  <i className="fas fa-times me-2"></i> إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNews;