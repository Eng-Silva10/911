// src/components/EditNews.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../App.css';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState({
    title: '',
    description: '',
    news_link: '',
    status: 'pending'
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news for editing', error);
      }
    };
    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    setNews({
      ...news,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/news/${id}`, news);
      navigate('/');
    } catch (error) {
      console.error('Failed to update news', error);
    }
  };

  return (
    <div className="container mt-5" style={{ direction: 'rtl' }}>
      <div className="admin-header d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-edit me-2"></i> تعديل الخبر</h2>
        <button onClick={() => navigate('/')} className="btn btn-outline-light rounded-pill px-4">
          <i className="fas fa-arrow-right-to-bracket me-2"></i> العودة للوحة التحكم
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="form-container p-5 rounded shadow">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">عنوان الخبر</label>
                <input type="text" name="title" value={news.title} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">الوصف</label>
                <textarea name="description" value={news.description || ''} onChange={handleChange} className="form-control" rows="4"></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">رابط المصدر</label>
                <input type="url" name="news_link" value={news.news_link || ''} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-4">
                <label className="form-label">الحالة</label>
                <select name="status" value={news.status} onChange={handleChange} className="form-select">
                  <option value="pending">⏳ جاري المراجعة</option>
                  <option value="true">✅ خبر صحيح</option>
                  <option value="false">❌ إشاعة</option>
                </select>
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success px-4 rounded-pill">
                  <i className="fas fa-save me-2"></i> حفظ التعديلات
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

export default EditNews;