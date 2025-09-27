import React, { useState } from "react";

const ReportNewsPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    news_link: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear notification when user starts typing
    if (notification.show) {
      setNotification({ show: false, type: '', message: '' });
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      showNotification('يرجى إدخال عنوان الخبر', 'error');
      return false;
    }
    if (!formData.description.trim()) {
      showNotification('يرجى إدخال وصف للخبر ولماذا تعتقد أنه يحتاج للتحقق', 'error');
      return false;
    }
    if (formData.news_link.trim() && !isValidUrl(formData.news_link)) {
      showNotification('يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://', 'warning');
      return false;
    }
    return true;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ show: false, type: '', message: '' });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const params = new URLSearchParams();
      params.append('title', formData.title);
      if (formData.news_link) params.append('news_link', formData.news_link);
      params.append('description', formData.description);

      const response = await fetch(`/api/reports?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      const result = await response.json();

      if (response.ok) {
        showNotification('تم إرسال بلاغك بنجاح! سيقوم فريق التحقق بمراجعة الخبر.', 'success');
        setFormData({ title: '', news_link: '', description: '' });
      } else if (response.status === 409) {
        showNotification('تم الإبلاغ عن هذا الخبر مسبقًا. شكرًا لك!', 'info');
      } else {
        showNotification(result.message || 'حدث خطأ أثناء إرسال البلاغ. يرجى المحاولة مرة أخرى.', 'error');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      showNotification('فشل الاتصال بالخادم. تأكد من تشغيل Laravel أو حاول لاحقًا.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
        
        :root {
          --primary-color: #1e3c72;
          --secondary-color: #2a5298;
          --dark-color: #1a1a1a;
          --light-bg-color: #f8f9fa;
          --white-color: #ffffff;
          --danger-color: #dc3545;
          --success-color: #28a745;
          --warning-color: #ffc107;
          --info-color: #17a2b8;
          --gray-100: #f8f9fa;
          --gray-200: #e9ecef;
          --gray-300: #dee2e6;
          --gray-400: #ced4da;
          --gray-500: #adb5bd;
          --gray-600: #6c757d;
          --gray-700: #495057;
          --gray-800: #343a40;
          --gray-900: #212529;
          --shadow-sm: 0 2px 10px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
          --shadow-lg: 0 10px 30px rgba(0,0,0,0.1);
          --shadow-xl: 0 20px 40px rgba(0,0,0,0.12);
          --radius-sm: 0.5rem;
          --radius-md: 1rem;
          --radius-lg: 1.5rem;
          --radius-xl: 2rem;
          --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        body {
          font-family: 'Cairo', sans-serif;
          background-color: var(--light-bg-color);
          margin: 0;
          padding: 0;
          scroll-behavior: smooth;
          line-height: 1.6;
        }
        
        /* Header Styles */
        .navbar {
          background: rgba(255, 255, 255, 0.87);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          z-index: 1000;
          position: fixed;
          top: 0;
          width: 100%;
          transition: all 0.4s ease;
          padding: 0.9rem 0;
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.95);
          padding: 0.6rem 0;
          box-shadow: 0 4px 25px rgba(0,0,0,0.1);
        }

        .navbar.hidden {
          transform: translateY(-100%);
          transition: transform 0.5s ease;
        }

        .container {
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
          margin-right: auto;
          margin-left: auto;
        }

        @media (min-width: 576px) { .container { max-width: 540px; } }
        @media (min-width: 768px) { .container { max-width: 720px; } }
        @media (min-width: 992px) { .container { max-width: 960px; } }
        @media (min-width: 1200px) { .container { max-width: 1140px; } }

        .navbar-brand {
          color: var(--dark-color) !important;
          font-size: 1.4rem !important;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .navbar.scrolled .navbar-brand {
          font-size: 1.2rem !important;
          color: var(--primary-color) !important;
        }

        .navbar-logo {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          margin-left: 0.5rem;
        }

        .navbar.scrolled .navbar-logo {
          width: 35px;
          height: 35px;
        }

        .navbar-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-link {
          font-weight: 500;
          color: var(--dark-color);
          padding: 8px 18px;
          border-radius: 10px;
          transition: all 0.3s ease;
          position: relative;
          text-decoration: none;
          display: inline-block;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--primary-color) !important;
          background: rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .navbar-toggler {
          border: none;
          outline: none;
          padding: 6px 10px;
          transition: all 0.3s ease;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .navbar-toggler:focus {
          box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.3);
        }

        .navbar-toggler-icon {
          width: 24px;
          height: 2px;
          background-color: var(--dark-color);
          position: relative;
          display: inline-block;
          transition: all 0.4s ease;
        }

        .navbar-toggler-icon::before,
        .navbar-toggler-icon::after {
          content: "";
          position: absolute;
          width: 24px;
          height: 2px;
          background-color: var(--dark-color);
          left: 0;
          transition: all 0.4s ease;
        }

        .navbar-toggler-icon::before { top: -7px; }
        .navbar-toggler-icon::after { top: 7px; }

        .navbar-toggler.active .navbar-toggler-icon {
          background-color: transparent;
        }

        .navbar-toggler.active .navbar-toggler-icon::before {
          transform: rotate(45deg);
          top: 0;
        }

        .navbar-toggler.active .navbar-toggler-icon::after {
          transform: rotate(-45deg);
          top: 0;
        }

        @media (max-width: 991px) {
          .navbar-collapse {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 20px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
            border-radius: 0 0 15px 15px;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s ease;
            z-index: 1000;
          }
          
          .navbar-collapse.show {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          
          .navbar-nav {
            flex-direction: column;
            gap: 15px;
          }
          
          .nav-link {
            text-align: right;
            padding: 12px 20px;
            width: 100%;
          }
        }

        @media (min-width: 992px) {
          .navbar-collapse {
            display: flex !important;
            flex-basis: auto;
            position: static;
            background: transparent;
            padding: 0;
            box-shadow: none;
            border-radius: 0;
            transform: none;
            opacity: 1;
            visibility: visible;
          }
          
          .navbar-nav {
            flex-direction: row;
            margin-right: auto;
            gap: 10px;
          }
          
          .navbar-toggler {
            display: none;
          }
        }

        /* Advanced Notification System */
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1050;
          transform: translateX(120%);
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .notification-container.show {
          transform: translateX(0);
        }

        .notification {
          padding: 1.2rem 1.5rem;
          border-radius: var(--radius-lg);
          color: white;
          font-weight: 600;
          box-shadow: var(--shadow-xl);
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 320px;
          position: relative;
          overflow: hidden;
        }

        .notification::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }

        .notification.success {
          background: linear-gradient(135deg, #28a745, #20c997);
        }

        .notification.success::before {
          background: #155724;
        }

        .notification.error {
          background: linear-gradient(135deg, #dc3545, #e06b8e);
        }

        .notification.error::before {
          background: #721c24;
        }

        .notification.warning {
          background: linear-gradient(135deg, #ffc107, #ffca2c);
          color: #212529;
        }

        .notification.warning::before {
          background: #856404;
        }

        .notification.info {
          background: linear-gradient(135deg, #17a2b8, #34c3d3);
        }

        .notification.info::before {
          background: #0c5460;
        }

        .notification-icon {
          font-size: 1.4rem;
          min-width: 24px;
        }

        .notification-close {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .notification-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Advanced Report Form Styles */
        .report-container {
          max-width: 800px;
          margin: 140px auto 80px;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          flex: 1;
          position: relative;
        }
        
        .report-header {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: white;
          padding: 3rem 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .report-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .back-btn {
          position: absolute;
          top: 25px;
          right: 25px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: none;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.1) rotate(90deg);
        }
        
        .report-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .report-header p {
          font-size: 1.2rem;
          opacity: 0.95;
          max-width: 650px;
          margin: 0 auto;
          font-weight: 300;
        }
        
        .report-form {
          padding: 3rem;
          background: linear-gradient(to bottom, #ffffff, #f8f9fa);
        }
        
        .form-group {
          margin-bottom: 1.8rem;
          position: relative;
        }
        
        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--dark-color);
          margin-bottom: 0.8rem;
          font-size: 1.15rem;
        }
        
        .form-input,
        .form-textarea {
          width: 100%;
          padding: 1.2rem 1.5rem;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          font-size: 1.05rem;
          font-family: 'Cairo', sans-serif;
          transition: all 0.3s ease;
          background: white;
          position: relative;
        }
        
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(30, 60, 114, 0.15);
          transform: translateY(-2px);
        }
        
        .form-textarea {
          min-height: 180px;
          resize: vertical;
          line-height: 1.7;
        }
        
        .submit-btn {
          background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
          color: white;
          border: none;
          padding: 1.2rem 2.5rem;
          border-radius: var(--radius-xl);
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.5px;
          box-shadow: 0 10px 30px rgba(30, 60, 114, 0.3);
        }
        
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: 0.6s;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 0 15px 40px rgba(30, 60, 114, 0.4);
        }
        
        .submit-btn:hover::before {
          left: 100%;
        }
        
        .submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 5px 20px rgba(30, 60, 114, 0.2);
        }
        
        .required {
          color: var(--danger-color);
          font-size: 1.2rem;
        }
        
        .optional {
          color: var(--gray-600);
          font-size: 0.95rem;
          font-weight: 400;
        }
        
        .form-hint {
          font-size: 0.9rem;
          color: var(--gray-600);
          margin-top: 0.5rem;
          display: block;
        }
        
        /* Footer Styles */
        .footer { 
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          color: #fff; 
          padding: 60px 0 40px;
          position: relative;
          overflow: hidden;
          margin-top: auto;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }
        
        .footer-logo-container {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .footer-logo {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          overflow: hidden;
          margin-left: 1rem;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        }
        
        .footer-brand {
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .footer-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin-bottom: 2rem;
        }
        
        .footer-heading {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.5rem;
        }
        
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 50px;
          height: 3px;
          background: var(--secondary-color);
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-link {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          display: block;
          padding: 0.5rem 0;
          transition: var(--transition);
          cursor: pointer;
          font-weight: 400;
          font-size: 1rem;
          position: relative;
        }
        
        .footer-link::before {
          content: '';
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 2px;
          background: var(--secondary-color);
          transition: var(--transition);
        }
        
        .footer-link:hover {
          color: #fff;
          transform: translateX(-8px);
          padding-right: 15px;
        }
        
        .footer-link:hover::before {
          width: 15px;
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          background: rgba(255,255,255,0.12);
          color: #fff;
          text-align: center;
          border-radius: 50%;
          transition: var(--transition);
          font-size: 1.2rem;
          border: 1px solid rgba(255,255,255,0.15);
          text-decoration: none;
        }
        
        .social-link:hover {
          background: var(--secondary-color);
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        }
        
        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .report-header {
            padding: 2.2rem 1.8rem;
          }
          
          .report-header h1 {
            font-size: 2rem;
          }
          
          .report-form {
            padding: 2.2rem 1.8rem;
          }
          
          .back-btn {
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
          }
          
          .notification {
            min-width: 280px;
            padding: 1rem 1.2rem;
          }
        }
        
        @media (max-width: 480px) {
          .report-container {
            margin: 120px auto 60px;
            margin-left: 10px;
            margin-right: 10px;
          }
          
          .report-header h1 {
            font-size: 1.8rem;
          }
          
          .report-header p {
            font-size: 1.1rem;
          }
          
          .notification {
            min-width: 250px;
            right: 10px;
            top: 10px;
          }
        }
      `}</style>

      {/* Advanced Notification System */}
      <div className={`notification-container ${notification.show ? 'show' : ''}`}>
        <div className={`notification ${notification.type}`}>
          <button 
            className="notification-close"
            onClick={() => setNotification({ show: false, type: '', message: '' })}
            aria-label="إغلاق الإشعار"
          >
            ×
          </button>
          <div className="notification-icon">
            {notification.type === 'success' && <i className="fas fa-check-circle"></i>}
            {notification.type === 'error' && <i className="fas fa-exclamation-triangle"></i>}
            {notification.type === 'warning' && <i className="fas fa-exclamation-circle"></i>}
            {notification.type === 'info' && <i className="fas fa-info-circle"></i>}
          </div>
          <div className="notification-message">
            {notification.message}
          </div>
        </div>
      </div>

      {/* Header */}
      <header id="mainHeader">
        <nav className="navbar" role="navigation" aria-label="القائمة الرئيسية">
          <div className="container">
            <a className="navbar-brand" href="/" aria-label="العودة للصفحة الرئيسية">
              <div className="navbar-logo">
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="21" cy="21" r="21" fill="url(#navGradient)" />
                  <path 
                    d="M14 21L19 26L29 16" 
                    stroke="white" 
                    strokeWidth="4" 
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e3c72" />
                      <stop offset="100%" stopColor="#2a5298" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span>صادق</span>
            </a>
            
            <button 
              className={`navbar-toggler ${isMenuOpen ? 'active' : ''}`} 
              type="button" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isMenuOpen}
              aria-controls="navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="/">الرئيسية</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">حول المنصة</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#features">المميزات</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">اتصل بنا</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="report-container">
        <div className="report-header">
          <button className="back-btn" onClick={handleBackToHome} aria-label="العودة إلى الصفحة الرئيسية">
            <i className="fas fa-arrow-right"></i>
          </button>
          <h1>الإبلاغ عن خبر</h1>
          <p>ساعدنا في مكافحة الأخبار الكاذبة والمعلومات المضللة</p>
        </div>

        <div className="report-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                عنوان الخبر <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="أدخل عنوان الخبر الذي تريد الإبلاغ عنه"
                required
                aria-required="true"
              />
              <small className="form-hint">يجب أن يكون العنوان واضحًا ومختصرًا</small>
            </div>

            <div className="form-group">
              <label htmlFor="news_link" className="form-label">
                رابط الخبر <span className="optional">(اختياري)</span>
              </label>
              <input
                type="url"
                id="news_link"
                name="news_link"
                className="form-input"
                value={formData.news_link}
                onChange={handleChange}
                placeholder="https://example.com/news-article"
                aria-describedby="link-help"
              />
              <small id="link-help" className="form-hint">إذا كان لديك رابط للخبر، أدخله هنا. وإلا فاترك الحقل فارغًا.</small>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                وصف المشكلة <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="لماذا تعتقد أن هذا الخبر يحتاج للتحقق؟ ما هي الأسباب التي تجعلك تشك في صحته؟"
                required
                aria-required="true"
              />
              <small className="form-hint">كلما كان الوصف أكثر تفصيلًا، كان التحقق أكثر دقة</small>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري معالجة البلاغ...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  إرسال البلاغ
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo-container">
                <div className="footer-logo">
                  <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="35" cy="35" r="35" fill="url(#footerGradient)" />
                    <path 
                      d="M20 35L28 43L44 27" 
                      stroke="white" 
                      strokeWidth="5" 
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e3c72" />
                        <stop offset="100%" stopColor="#2a5298" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h4 className="footer-brand">منصة صادق</h4>
                  <p className="text-muted mb-0">الحكومة المصرية</p>
                </div>
              </div>
              <p className="footer-description">
                منصة رسمية تابعة للحكومة المصرية لمكافحة الأخبار الكاذبة والمعلومات المضللة وتعزيز الثقة في المعلومات.
              </p>
              <div className="social-links">
                <a href="#" aria-label="صفحة فيسبوك" className="social-link">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="حساب تويتر" className="social-link">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="حساب إنستغرام" className="social-link">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" aria-label="قناة يوتيوب" className="social-link">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            
            <div className="footer-col">
              <h5 className="footer-heading">روابط سريعة</h5>
              <ul className="footer-links">
                <li><a href="/" className="footer-link">الرئيسية</a></li>
                <li><a href="#about" className="footer-link">حول المنصة</a></li>
                <li><a href="#features" className="footer-link">المميزات</a></li>
                <li><a href="#contact" className="footer-link">اتصل بنا</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h5 className="footer-heading">الخدمات</h5>
              <ul className="footer-links">
                <li><a href="/" className="footer-link">كشف الأخبار الكاذبة</a></li>
                <li><a href="#features" className="footer-link">تحليل المحتوى</a></li>
                <li><a href="#about" className="footer-link">الإحصائيات</a></li>
                <li><a href="#contact" className="footer-link">طلب دعم فني</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h5 className="footer-heading">معلومات الاتصال</h5>
              <ul className="footer-links">
                <li><i className="fas fa-phone-alt me-2"></i> 16000</li>
                <li><i className="fas fa-envelope me-2"></i> info@sadeq.gov.eg</li>
                <li><i className="fas fa-map-marker-alt me-2"></i> القاهرة، مصر</li>
                <li><i className="fas fa-clock me-2"></i> خدمة 24/7</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>
              <i className="fas fa-copyright me-1"></i> 2024 جميع الحقوق محفوظة - الحكومة المصرية
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReportNewsPage;