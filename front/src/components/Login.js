import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // login, dashboard, news, add-news, edit-news, reports
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loginData, setLoginData] = useState({
    employee_id: '',
    password: ''
  });
  
  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    url: '',
    status: true
  });
  
  const [editNews, setEditNews] = useState({
    id: '',
    title: '',
    description: '',
    url: '',
    status: true
  });

  const [reportsData, setReportsData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [deviceStats, setDeviceStats] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null); // New state for selected report
  const modalRef = useRef(null);

  // Employee Login
  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const params = new URLSearchParams(loginData).toString();
      const response = await fetch(`http://127.0.0.1:8000/sadik/login?${params}`);
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('employee_data', JSON.stringify(data.employee));
        setEmployeeData(data.employee);
        setIsLoggedIn(true);
        setSuccess(data.message);
        loadDashboardData();
        setCurrentView('dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('❌ خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Employee Logout
  const logout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/sadik/logout');
    } catch (err) {
      console.log('Logout error (ignored)');
    } finally {
      localStorage.removeItem('employee_data');
      setIsLoggedIn(false);
      setEmployeeData(null);
      setCurrentView('login');
      setLoginData({
        employee_id: '',
        password: ''
      });
    }
  };

  // Load Dashboard Data, News, and Reports
  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const statsResponse = await fetch('http://127.0.0.1:8000/sadik/admin-dashboard');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.stats);
        setRecentLogs(statsData.recent_logs || []);
        // Simulate advanced device stats
        const simulatedDeviceStats = [
            { name: 'كمبيوتر', count: 15 },
            { name: 'جوال', count: 42 },
            { name: 'جهاز لوحي', count: 8 },
        ];
        setDeviceStats(simulatedDeviceStats);
      }
      const newsResponse = await fetch('http://127.0.0.1:8000/sadik/news');
      const newsData = await newsResponse.json();
      if (newsData.success) {
        setNewsData(newsData.news || []);
      }
      // Updated reports endpoint
      const reportsResponse = await fetch('http://127.0.0.1:8000/admin/reports');
      const reportsData = await reportsResponse.json();
      if (reportsData.success) {
          setReportsData(reportsData.reports || []);
      }
    } catch (err) {
      setError('❌ خطأ في تحميل بيانات لوحة التحكم');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to simulate AI embedding generation
  const generateEmbedding = async (text) => {
    const uniqueId = crypto.randomUUID();
    console.log("Simulating embedding for:", text);
    console.log("Generated embedding:", uniqueId);
    return uniqueId;
  };

  // Add New News (Updated to GET)
  const addNews = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const embedding = await generateEmbedding(`${newNews.title} ${newNews.description}`);
      const newsPayload = {
        ...newNews,
        author: employeeData.name,
        employee_id: employeeData.employee_id,
        status: newNews.status ? 1 : 0,
        embedding: embedding
      };
      const params = new URLSearchParams(newsPayload).toString();
      const response = await fetch(`http://127.0.0.1:8000/sadik/add-news?${params}`);
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        setNewNews({
          title: '',
          description: '',
          url: '',
          status: true
        });
        loadDashboardData();
        setCurrentView('news');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('❌ خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update News (Updated to GET)
  const updateNews = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const updatedNewsPayload = {
        news_id: editNews.id, 
        title: editNews.title,
        description: editNews.description,
        url: editNews.url,
        status: editNews.status ? 1 : 0
      };
      const params = new URLSearchParams(updatedNewsPayload).toString();
      const response = await fetch(`http://127.0.0.1:8000/sadik/update-news?${params}`);
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        loadDashboardData();
        setCurrentView('news');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('❌ خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete News (Updated to GET)
  const confirmDeleteNews = (newsId) => {
    setNewsToDelete(newsId);
    setShowConfirmModal(true);
  };
  const executeDeleteNews = async () => {
    setShowConfirmModal(false);
    if (!newsToDelete) return;
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const params = new URLSearchParams({ news_id: newsToDelete }).toString();
      const response = await fetch(`http://127.0.0.1:8000/sadik/delete-news?${params}`);
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        loadDashboardData();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('❌ خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setIsLoading(false);
      setNewsToDelete(null);
    }
  };

  // Load News Details for Edit
  const loadNewsForEdit = async (newsId) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`http://127.0.0.1:8000/sadik/news/${newsId}`);
      const data = await response.json();
      if (data.success) {
        setEditNews({
          id: data.news.id,
          title: data.news.title,
          description: data.news.description,
          url: data.news.url || '',
          status: data.news.status === 1
        });
        setCurrentView('edit-news');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('❌ خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Report Status (Updated to GET with query params)
  const executeUpdateReportStatus = async (reportId, newStatus, updatedTitle, updatedDescription) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const params = new URLSearchParams({ 
        report_id: reportId, 
        status: newStatus,
        title: updatedTitle,
        description: updatedDescription
      }).toString();

      const response = await fetch(`http://127.0.0.1:8000/admin/reports/${reportId}/status?${params}`);
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
        loadDashboardData();
        setCurrentView('reports');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('❌ خطأ في الاتصال بالخادم');
      console.error(err);
    } finally {
      setIsLoading(false);
      setSelectedReport(null);
    }
  };

  // Check login status on load
  useEffect(() => {
    const savedEmployee = localStorage.getItem('employee_data');
    if (savedEmployee) {
      const parsedData = JSON.parse(savedEmployee);
      setEmployeeData(parsedData);
      setIsLoggedIn(true);
      setCurrentView('dashboard');
      loadDashboardData();
    }
  }, []);

  // Login Form Component
  const LoginForm = () => (
    <div className="d-flex justify-content-center align-items-center vh-100 p-4 custom-bg-light font-sans text-right">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3 shadow-lg p-5 w-100"
        style={{ maxWidth: '450px' }}
      >
        <div className="position-relative">
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="fs-1 mb-3 mx-auto d-flex justify-content-center align-items-center text-white"
              style={{ width: '80px', height: '80px', borderRadius: '1.5rem', backgroundColor: '#0A2558' }}
            >
              <i className="fas fa-shield-alt"></i>
            </motion.div>
            <h1 className="h3 fw-bold text-dark-blue-900 mb-2">
              نظام صادق المتقدم
            </h1>
            <p className="text-muted">لوحة التحكم الإدارية الذكية</p>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="alert alert-danger d-flex align-items-center gap-2"
              >
                <div><i className="fas fa-exclamation-triangle"></i></div>
                <div className="flex-grow-1">
                  <p className="mb-0">❌ {error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="btn-close"
                ></button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="alert alert-success d-flex align-items-center gap-2"
              >
                <div><i className="fas fa-check-circle"></i></div>
                <div className="flex-grow-1">
                  <p className="mb-0">✅ {success}</p>
                </div>
                <button
                  onClick={() => setSuccess('')}
                  className="btn-close"
                ></button>
              </motion.div>
            )}
          </AnimatePresence>
          <form onSubmit={login} className="mt-4">
            <div className="mb-3">
              <label className="form-label text-dark-blue-900 d-flex align-items-center gap-2">
                <i className="fas fa-user"></i>
                رقم الموظف أو البريد الإلكتروني
              </label>
              <input
                type="text"
                name="employee_id"
                value={loginData.employee_id}
                onChange={(e) => setLoginData({
                  ...loginData,
                  employee_id: e.target.value
                })}
                className="form-control"
                placeholder="أدخل رقم الموظف أو البريد الإلكتروني"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-dark-blue-900 d-flex align-items-center gap-2">
                <i className="fas fa-lock"></i>
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={(e) => setLoginData({
                  ...loginData,
                  password: e.target.value
                })}
                className="form-control"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 custom-btn-blue"
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="fas fa-sign-in-alt"></i>
              )}
              {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </motion.button>
          </form>
          <div className="mt-4 pt-3 border-top border-secondary-subtle text-center">
            <p className="text-muted-dark fs-small">© 2025 نظام صادق - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Main Dashboard Layout
  const Dashboard = () => (
    <div className="min-vh-100 custom-bg-light font-sans text-right">
      <header className="bg-white sticky-top shadow-sm py-3 border-bottom border-secondary-subtle">
        <div className="container-fluid px-5">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="fs-2 text-white p-2 rounded-3 custom-bg-blue"
              >
                <i className="fas fa-shield-alt"></i>
              </motion.div>
              <div>
                <h1 className="h4 fw-bold text-dark-blue-900 mb-0">
                  نظام صادق المتقدم
                </h1>
                <p className="text-muted mb-0">لوحة التحكم الإدارية الذكية</p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-2 border border-secondary-subtle"
              >
                <div className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold" style={{ width: '40px', height: '40px', backgroundColor: '#0A2558' }}>
                  {employeeData?.name?.charAt(0) || 'A'}
                </div>
                <div className="text-right">
                  <div className="fw-medium text-dark-blue-900">{employeeData?.name || 'المستخدم'}</div>
                  <div className="text-muted fs-small">{employeeData?.role || 'موظف'}</div>
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={logout}
                className="btn btn-light-blue-100 btn-circle"
                title="تسجيل الخروج"
              >
                <i className="fas fa-sign-out-alt"></i>
              </motion.button>
            </div>
          </div>
        </div>
      </header>
      <div className="container-fluid px-5 py-4">
        <div className="row g-4">
          <div className="col-lg-3">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="card shadow-sm p-4 rounded-3"
            >
              <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
                <h2 className="h5 fw-bold text-dark-blue-900 mb-2">القائمة الرئيسية</h2>
                <p className="text-muted">إدارة النظام بسهولة</p>
              </div>
              <nav className="list-group list-group-flush">
                {[
                  { view: 'dashboard', text: 'لوحة التحكم', icon: 'fas fa-tachometer-alt', isActive: currentView === 'dashboard' },
                  { view: 'news', text: 'إدارة الأخبار', icon: 'fas fa-newspaper', isActive: currentView.includes('news') },
                  { view: 'reports', text: 'البلاغات', icon: 'fas fa-bug', isActive: currentView === 'reports' }
                ].map((item) => (
                  <motion.button
                    key={item.view}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentView(item.view);
                      if (item.view === 'dashboard' || item.view === 'reports') loadDashboardData();
                    }}
                    className={`btn text-end py-3 px-3 rounded-2 fw-medium ${
                      item.isActive 
                        ? 'text-white custom-bg-blue shadow-sm' 
                        : 'text-secondary-dark bg-transparent'
                    }`}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <i className={item.icon}></i>
                      <span>{item.text}</span>
                    </div>
                  </motion.button>
                ))}
              </nav>
              <div className="mt-5 pt-3 border-top border-secondary-subtle text-center">
                <div className="fs-small text-muted mb-1">نسخة 3.0</div>
                <div className="fs-small text-muted">© 2025 صادق</div>
              </div>
            </motion.div>
          </div>
          <div className="col-lg-9">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="alert alert-danger d-flex align-items-center gap-2 mb-4 shadow-sm"
                >
                  <i className="fas fa-exclamation-triangle"></i>
                  <div className="flex-grow-1">
                    <p className="mb-0">❌ {error}</p>
                  </div>
                  <button
                    onClick={() => setError('')}
                    className="btn-close"
                  ></button>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="alert alert-success d-flex align-items-center gap-2 mb-4 shadow-sm"
                >
                  <i className="fas fa-check-circle"></i>
                  <div className="flex-grow-1">
                    <p className="mb-0">✅ {success}</p>
                  </div>
                  <button
                    onClick={() => setSuccess('')}
                    className="btn-close"
                  ></button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              key={currentView}
              variants={{
                initial: { opacity: 0, x: 50 },
                in: { opacity: 1, x: 0 },
                out: { opacity: 0, x: -50 }
              }}
              initial="initial"
              animate="in"
              exit="out"
              transition={{ duration: 0.3 }}
              className="min-height-content"
            >
              {isLoading && <LoadingOverlay />} {/* Loading Overlay */}
              
              {/* Dashboard View */}
              {currentView === 'dashboard' && !isLoading && (
                <DashboardView stats={stats} recentLogs={recentLogs} loadDashboardData={loadDashboardData} />
              )}
              {/* News Management View */}
              {currentView === 'news' && !isLoading && (
                <NewsManagementView
                  newsData={newsData}
                  setCurrentView={setCurrentView}
                  loadNewsForEdit={loadNewsForEdit}
                  confirmDeleteNews={confirmDeleteNews}
                />
              )}
              {/* Reports View */}
              {currentView === 'reports' && !isLoading && (
                <ReportsView
                  reportsData={reportsData}
                  executeUpdateReportStatus={executeUpdateReportStatus}
                  setSelectedReport={setSelectedReport}
                />
              )}
              {/* Add News View */}
              {currentView === 'add-news' && !isLoading && (
                <NewsForm
                  title="إضافة خبر جديد"
                  formData={newNews}
                  setFormData={setNewNews}
                  onSubmit={addNews}
                  isAdding={true}
                  onCancel={() => setCurrentView('news')}
                />
              )}
              {/* Edit News View */}
              {currentView === 'edit-news' && !isLoading && (
                <NewsForm
                  title="تعديل الخبر"
                  formData={editNews}
                  setFormData={setEditNews}
                  onSubmit={updateNews}
                  isAdding={false}
                  onCancel={() => setCurrentView('news')}
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmModal
            message="هل أنت متأكد من حذف هذا الخبر؟"
            onConfirm={executeDeleteNews}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Report Details Modal */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailsModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
            executeUpdateReportStatus={executeUpdateReportStatus}
          />
        )}
      </AnimatePresence>

    </div>
  );

  // Loading Overlay Component
  const LoadingOverlay = () => (
    <div className="d-flex justify-content-center align-items-center vh-100 p-4 font-sans text-right"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(248, 249, 250, 0.9)',
        zIndex: 1000,
      }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{ width: '4rem', height: '4rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="h5 fw-bold text-dark-blue-900 mt-3">جاري تحميل البيانات...</p>
      </div>
    </div>
  );

  // Reusable News Form Component
  const NewsForm = ({ title, formData, setFormData, onSubmit, isAdding, onCancel }) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="card shadow-sm p-5 rounded-3"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 fw-bold text-dark-blue-900 d-flex align-items-center gap-2">
            <i className="fas fa-plus-circle"></i>
            {title}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="btn btn-light btn-circle"
          >
            <i className="fas fa-times"></i>
          </motion.button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="mb-3">
            <label className="form-label text-muted-dark">عنوان الخبر</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted-dark">وصف الخبر</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="form-control"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted-dark">رابط الصورة (اختياري)</label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-check mb-4 d-flex align-items-center gap-2">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              className="form-check-input"
            />
            <label className="form-check-label text-muted-dark">نشر الخبر</label>
          </div>
          <div className="d-flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn btn-primary flex-grow-1 custom-btn-blue"
            >
              {isAdding ? 'إضافة الخبر' : 'تحديث الخبر'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onCancel}
              className="btn btn-light flex-grow-1"
            >
              إلغاء
            </motion.button>
          </div>
        </form>
      </motion.div>
    );
  };

  // Custom Confirmation Modal
  const ConfirmModal = ({ message, onConfirm, onCancel }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <motion.div
          initial={{ scale: 0.8, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: -50 }}
          className="modal-content rounded-3 text-center p-4"
        >
          <div className="modal-body p-4">
            <div className="fs-1 mb-3"><i className="fas fa-exclamation-triangle"></i></div>
            <h3 className="h5 fw-bold text-dark-blue-900">تأكيد الإجراء</h3>
            <p className="text-muted">{message}</p>
          </div>
          <div className="modal-footer d-flex justify-content-center border-0 p-0 pt-3 gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="btn btn-danger flex-grow-1"
            >
              تأكيد الحذف
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="btn btn-light flex-grow-1"
            >
              إلغاء
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // Dashboard View Component
  const DashboardView = ({ stats, recentLogs, loadDashboardData }) => (
    <div className="space-y-4">
      <div className="d-flex justify-content-between align-items-center">
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="h4 fw-bold text-dark-blue-900 d-flex align-items-center gap-2"
        >
          <i className="fas fa-tachometer-alt"></i>
          لوحة التحكم الشاملة
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadDashboardData}
          className="btn btn-light-blue-100 btn-circle"
          title="تحديث البيانات"
        >
          <i className="fas fa-sync-alt"></i>
        </motion.button>
      </div>
      <div className="row g-4">
        {[
          { icon: 'fas fa-users', title: 'إجمالي الموظفين', value: stats?.total_employees || 0, color: 'from-blue-700 to-blue-900', trend: '↑ 12% عن الشهر الماضي' },
          { icon: 'fas fa-newspaper', title: 'إجمالي الأخبار', value: stats?.total_news || 0, color: 'from-blue-700 to-blue-900', trend: '↑ 8% عن الشهر الماضي' },
          { icon: 'fas fa-key', title: 'سجل تسجيل الدخول', value: stats?.total_login_logs || 0, color: 'from-blue-700 to-blue-900', trend: '↑ 5% عن الشهر الماضي' }
        ].map((stat, index) => (
          <div key={stat.title} className="col-md-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card shadow-sm p-4 rounded-3 h-100"
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="fs-2 text-white p-2 rounded-2 custom-bg-blue">
                  <i className={stat.icon}></i>
                </div>
                <div>
                  <h3 className="h6 fw-bold text-muted mb-0">{stat.title}</h3>
                  <div className="fs-small text-muted">{stat.trend}</div>
                </div>
              </div>
              <div className="h3 fw-bold text-dark-blue-900 mb-0">
                {stat.value}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-lg-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="card shadow-sm p-4 rounded-3 h-100"
          >
            <h3 className="h5 fw-bold text-dark-blue-900 mb-3 d-flex align-items-center gap-2">
              <i className="fas fa-chart-bar"></i>
              تحليلات النظام
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'الموظفين', value: stats?.total_employees || 0 },
                    { name: 'الأخبار', value: stats?.total_news || 0 },
                    { name: 'تسجيلات الدخول', value: stats?.total_login_logs || 0 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="#1e40af" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
        <div className="col-lg-6">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="card shadow-sm p-4 rounded-3 h-100"
          >
            <h3 className="h5 fw-bold text-dark-blue-900 mb-3 d-flex align-items-center gap-2">
              <i className="fas fa-history"></i>
              أحدث تسجيلات الدخول
            </h3>
            <div className="list-group overflow-auto" style={{ maxHeight: '300px' }}>
              {recentLogs.length > 0 ? (
                recentLogs.slice(0, 5).map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="list-group-item d-flex justify-content-between align-items-center bg-light border-0 rounded-2 mb-2 p-3"
                  >
                    <div>
                      <p className="fw-semibold text-dark-blue-900 mb-1">
                        {log.success ? <i className="fas fa-check-circle text-success"></i> : <i className="fas fa-times-circle text-danger"></i>}
                        {log.success ? ' تسجيل دخول ناجح' : ' فشل تسجيل الدخول'}
                      </p>
                      <p className="text-muted fs-small mb-0">
                        {log.employee_id} - {new Date(log.created_at).toLocaleString('ar-EG')}
                      </p>
                    </div>
                    <div className="text-muted fs-small">
                      IP: {log.ip_address}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-muted p-4">
                  <i className="fas fa-inbox d-block mb-2 text-primary fs-3"></i>
                  لا توجد سجلات تسجيل دخول حديثة.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  // News Management View Component
  const NewsManagementView = ({ newsData, setCurrentView, loadNewsForEdit, confirmDeleteNews }) => (
    <div className="space-y-4">
      <div className="d-flex justify-content-between align-items-center">
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="h4 fw-bold text-dark-blue-900 d-flex align-items-center gap-2"
        >
          <i className="fas fa-newspaper"></i>
          إدارة الأخبار
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView('add-news')}
          className="btn btn-primary custom-btn-blue shadow-sm"
        >
          <i className="fas fa-plus me-2"></i>
          إضافة خبر جديد
        </motion.button>
      </div>
      <div className="card shadow-sm p-4 rounded-3">
        <h3 className="h5 fw-bold text-dark-blue-900 mb-3 d-flex align-items-center gap-2">
          <i className="fas fa-list"></i>
          قائمة الأخبار
        </h3>
        {newsData.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover text-right">
              <thead>
                <tr className="bg-light text-muted text-uppercase fw-semibold">
                  <th className="py-3 px-2">العنوان</th>
                  <th className="py-3 px-2">الوصف</th>
                  <th className="py-3 px-2">الحالة</th>
                  <th className="py-3 px-2">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {newsData.map((news) => (
                  <tr key={news.id}>
                    <td className="py-3 px-2 text-wrap" style={{ maxWidth: '250px' }}>{news.title}</td>
                    <td className="py-3 px-2 text-wrap" style={{ maxWidth: '400px' }}>{news.description}</td>
                    <td className="py-3 px-2">
                      <span className={`badge rounded-pill ${news.status === 1 ? 'bg-success' : 'bg-warning'}`}>
                        {news.status === 1 ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-start">
                      <div className="d-flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => loadNewsForEdit(news.id)}
                          className="btn btn-sm btn-outline-primary rounded-circle"
                          title="تعديل"
                        >
                          <i className="fas fa-edit"></i>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => confirmDeleteNews(news.id)}
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          title="حذف"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted p-4">
            <i className="fas fa-box-open d-block mb-2 text-primary fs-3"></i>
            لا توجد أخبار لإدارتها.
          </div>
        )}
      </div>
    </div>
  );

  // Reports View Component (Updated)
  const ReportsView = ({ reportsData, executeUpdateReportStatus, setSelectedReport }) => (
    <div className="space-y-4">
      <div className="d-flex justify-content-between align-items-center">
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="h4 fw-bold text-dark-blue-900 d-flex align-items-center gap-2"
        >
          <i className="fas fa-bug"></i>
          إدارة البلاغات
        </motion.h2>
      </div>
      <div className="row g-4">
        {/* Reports Table */}
        <div className="col-lg-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="card shadow-sm p-4 rounded-3 h-100"
          >
            <h3 className="h5 fw-bold text-dark-blue-900 mb-4 d-flex align-items-center gap-2">
              <i className="fas fa-list-alt"></i>
              قائمة البلاغات
            </h3>
            {reportsData.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover text-right">
                  <thead>
                    <tr className="bg-light text-muted text-uppercase fw-semibold">
                      <th className="py-3 px-2">العنوان</th>
                      <th className="py-3 px-2">الجهاز</th>
                      <th className="py-3 px-2">المتصفح</th>
                      <th className="py-3 px-2">نظام التشغيل</th>
                      <th className="py-3 px-2">IP</th>
                      <th className="py-3 px-2">الحالة</th>
                      <th className="py-3 px-2">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportsData.map((report) => (
                      <tr key={report.id}>
                        <td className="py-3 px-2 text-wrap" style={{ maxWidth: '200px' }}>{report.title}</td>
                        <td className="py-3 px-2">{report.device_info}</td>
                        <td className="py-3 px-2">{report.browser_info}</td>
                        <td className="py-3 px-2">{report.os_info}</td>
                        <td className="py-3 px-2">{report.ip_address}</td>
                        <td className="py-3 px-2">
                          <StatusBadge status={report.status} />
                        </td>
                        <td className="py-3 px-2 text-start">
                          <div className="d-flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedReport(report)}
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              title="عرض التفاصيل والإجراءات"
                            >
                              <i className="fas fa-ellipsis-h"></i>
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted p-4">
                <i className="fas fa-inbox d-block mb-2 text-primary fs-3"></i>
                لا توجد بلاغات حالية.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'pending': { icon: 'fa-hourglass-half', text: 'قيد المراجعة', color: 'bg-warning' },
      'verified': { icon: 'fa-check-circle', text: 'تم التحقق', color: 'bg-success' },
      'rejected': { icon: 'fa-times-circle', text: 'مرفوض', color: 'bg-danger' },
    };
    const config = statusConfig[status] || {};
    return (
      <span className={`badge rounded-pill ${config.color} text-white d-flex align-items-center justify-content-center gap-1`}>
        <i className={`fas ${config.icon}`}></i>
        <span>{config.text}</span>
      </span>
    );
  };

  // New Report Details Modal Component
  const ReportDetailsModal = ({ report, onClose, executeUpdateReportStatus }) => {
    const [editedTitle, setEditedTitle] = useState(report.title);
    const [editedDescription, setEditedDescription] = useState(report.description);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal d-block"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <motion.div
            initial={{ scale: 0.8, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: -50 }}
            className="modal-content rounded-3 p-4"
          >
            <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="modal-title fw-bold text-dark-blue-900 d-flex align-items-center gap-2">
                <i className="fas fa-info-circle"></i>
                تفاصيل البلاغ
              </h5>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="btn btn-light btn-circle"
              >
                <i className="fas fa-times"></i>
              </motion.button>
            </div>
            <div className="modal-body pt-3">
              <p className="text-muted text-center">قم بمراجعة البلاغ وتعديله قبل اتخاذ الإجراء المناسب.</p>
              
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h6 className="card-title fw-bold d-flex align-items-center gap-2"><i className="fas fa-laptop-code text-primary"></i> معلومات الجهاز</h6>
                      <ul className="list-unstyled mb-0">
                        <li><span className="fw-semibold">الجهاز:</span> {report.device_info}</li>
                        <li><span className="fw-semibold">المتصفح:</span> {report.browser_info}</li>
                        <li><span className="fw-semibold">نظام التشغيل:</span> {report.os_info}</li>
                        <li><span className="fw-semibold">IP:</span> {report.ip_address}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h6 className="card-title fw-bold d-flex align-items-center gap-2"><i className="fas fa-clock text-primary"></i> وقت البلاغ</h6>
                      <p className="card-text">
                        <span className="fw-semibold">التاريخ:</span> {new Date(report.created_at).toLocaleDateString('ar-EG')}
                      </p>
                      <p className="card-text">
                        <span className="fw-semibold">الوقت:</span> {new Date(report.created_at).toLocaleTimeString('ar-EG')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted-dark fw-bold">عنوان البلاغ</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted-dark fw-bold">وصف البلاغ</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                ></textarea>
              </div>

            </div>
            <div className="modal-footer d-flex justify-content-between border-0 pt-3 gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="btn btn-light"
              >
                <i className="fas fa-times me-2"></i>
                إلغاء
              </motion.button>
              <div className="d-flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => executeUpdateReportStatus(report.id, 'verified', editedTitle, editedDescription)}
                  className="btn btn-success d-flex align-items-center gap-2"
                >
                  <i className="fas fa-check"></i>
                  تأكيد الخبر
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => executeUpdateReportStatus(report.id, 'rejected', editedTitle, editedDescription)}
                  className="btn btn-danger d-flex align-items-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  رفض الخبر
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <div>
      {/* Bootstrap and Custom CSS */}
      <style>
        {`
          @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
          :root {
            --bs-blue-100: #e0e9f2;
            --bs-blue-700: #1e40af;
            --bs-blue-800: #1d3a98;
            --bs-blue-900: #0a2558;
          }
          .font-sans {
            font-family: 'Cairo', sans-serif !important;
          }
          .custom-bg-light {
            background-color: #f8f9fa;
          }
          .custom-bg-blue {
            background-color: var(--bs-blue-700);
          }
          .custom-btn-blue {
            background-color: var(--bs-blue-700);
            border-color: var(--bs-blue-700);
            color: white;
          }
          .custom-btn-blue:hover {
            background-color: var(--bs-blue-800);
            border-color: var(--bs-blue-800);
          }
          .text-dark-blue-900 {
            color: var(--bs-blue-900);
          }
          .text-muted-dark {
            color: #6c757d;
          }
          .fs-small {
            font-size: 0.8rem;
          }
          .btn-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            border: none;
            background-color: var(--bs-blue-100);
            color: var(--bs-blue-700);
            transition: all 0.3s ease;
          }
          .btn-circle:hover {
            background-color: var(--bs-blue-700);
            color: white;
            transform: scale(1.1);
          }
          .min-height-content {
            min-height: calc(100vh - 150px);
          }
          .form-control:focus {
            box-shadow: 0 0 0 0.25rem rgba(30, 64, 175, 0.25);
            border-color: #1e40af;
          }
        `}
      </style>
      {isLoggedIn ? <Dashboard /> : <LoginForm />}
    </div>
  );
}
