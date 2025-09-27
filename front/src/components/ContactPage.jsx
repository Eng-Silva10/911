import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // هنا يمكنك إضافة كود إرسال البيانات إلى الخادم
      // مثال:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData)
      // });
      
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // إخفاء رسالة النجاح بعد 5 ثوانٍ
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page bg-light" dir="rtl">
      <style jsx>{`
        :root {
          --primary-color: #1e3c72;
          --secondary-color: #2a5298;
          --dark-color: #1a1a1a;
          --light-bg-color: #f0f2f5;
          --white-color: #ffffff;
          --danger-color: #c41e3a;
          --d: #2c333e;
        }
        
        html, body {
          font-family: 'Cairo', sans-serif;
          box-sizing: border-box;
          direction: rtl;
          background-color: var(--light-bg-color);
          overflow-x: hidden;
        }

        /* Navbar & Footer Styles */
        .navbar {
          background: rgba(26, 26, 26, 0.9) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          padding: 1rem;
        }
        .navbar-logo { 
          width: 40px; 
          height: 40px; 
          border-radius: 50%; 
          overflow: hidden; 
        }
        .navbar-logo img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
        }
        .navbar-nav .nav-link { 
          transition: all 0.3s ease; 
          font-weight: 500; 
          color: rgba(255, 255, 255, 0.8) !important;
          padding: 8px 15px;
          border-radius: 8px;
        }
        .navbar-nav .nav-link:hover { 
          color: #fff !important; 
          background: rgba(255, 255, 255, 0.2); 
        }
        
        .footer { 
          background: var(--d); 
          color: #fff; 
          padding: 60px 0; 
        }
        .logo-placeholder { 
          width: 70px; 
          height: 70px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin-left: 10px; 
          overflow: hidden; 
        }
        .logo-placeholder img { 
          width: 100%; 
          height: 100%; 
          object-fit: contain; 
        }
        .footer-links a { 
          color: rgba(255, 255, 255, 0.8); 
          text-decoration: none; 
          display: block; 
          padding: 5px 0; 
          transition: color 0.3s ease; 
        }
        .footer-links a:hover { 
          color: var(--secondary-color); 
        }
        .footer .text-muted { 
          color: rgba(255, 255, 255, 0.6) !important; 
        }
        .social-links a { 
          display: inline-block; 
          width: 40px; 
          height: 40px; 
          background: #333; 
          color: #fff; 
          text-align: center; 
          line-height: 40px; 
          border-radius: 50%; 
          margin: 0 5px; 
          transition: all 0.3s ease; 
        }
        .social-links a:hover { 
          background: var(--secondary-color); 
          transform: translateY(-3px); 
        }
        
        /* Contact Form Styles */
        .contact-card {
          background: #fff;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .form-control:focus {
          border-color: #2a5298;
          box-shadow: 0 0 0 0.2rem rgba(42, 82, 152, 0.25);
        }
        .submit-btn {
          background: linear-gradient(45deg, var(--secondary-color), var(--primary-color));
          border: none;
          color: white;
          font-weight: 600;
          padding: 12px 30px;
          border-radius: 50px;
          transition: all 0.3s ease;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(42, 82, 152, 0.3);
        }
        .alert-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 20px;
        }
      `}</style>

      <header>
        <nav className="navbar navbar-expand-lg navbar-dark" role="navigation" aria-label="القائمة الرئيسية">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} aria-label="العودة للصفحة الرئيسية">
              <div className="d-flex align-items-center">
                <div className="navbar-logo me-2">
                  <img src="/assets/uploads/logo1.png" alt="شعار منصة صادق، دائرة زرقاء تحتوي على حرف ص باللون الأبيض." />
                </div>
                <span className="fw-bold fs-4">صادق</span>
              </div>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="تبديل قائمة التنقل">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>الرئيسية</a></li>
                <li className="nav-item"><a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/#about'); }}>حول المنصة</a></li>
                <li className="nav-item"><a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/#features'); }}>المميزات</a></li>
                <li className="nav-item"><a className="nav-link active" href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>اتصل بنا</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="container mt-5 py-5">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="contact-card" role="form">
                <h1 className="mb-4 text-center">
                  <i className="fas fa-headset text-primary me-2" aria-hidden="true"></i>
                  اتصل بنا
                </h1>
                <p className="lead text-muted text-center">
                  نحن هنا لخدمتك. لا تتردد في التواصل معنا لأي استفسارات أو مقترحات.
                </p>

                {submitSuccess && (
                  <div className="alert-success">
                    تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت ممكن.
                  </div>
                )}

                {submitError && (
                  <div className="alert-danger">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">اسمك الكامل:</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">البريد الإلكتروني:</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">عنوان الرسالة:</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="form-label">رسالتك:</label>
                    <textarea 
                      className="form-control" 
                      id="message" 
                      name="message" 
                      rows="5" 
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2" aria-hidden="true"></i>إرسال الرسالة
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer mt-5" role="contentinfo">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="logo-placeholder me-3">
                    <img src="/assets/uploads/logo1.png" alt="شعار منصة صادق" />
                  </div>
                  <div>
                    <h5 className="mb-0">منصة صادق</h5>
                    <small className="text-muted">الحكومة المصرية</small>
                  </div>
                </div>
                <p className="text-muted">منصة رسمية تابعة للحكومة المصرية لمكافحة الأخبار الكاذبة والمعلومات المضللة باستخدام أحدث تقنيات الذكاء الاصطناعي.</p>
                <div className="social-links">
                  <a href="#" aria-label="صفحة فيسبوك"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" aria-label="حساب تويتر"><i className="fab fa-twitter"></i></a>
                  <a href="#" aria-label="حساب انستغرام"><i className="fab fa-instagram"></i></a>
                  <a href="#" aria-label="صفحة لينكدإن"><i className="fab fa-linkedin-in"></i></a>
                </div>
              </div>
              <div className="col-md-2">
                <h6 className="fw-bold mb-3">روابط سريعة</h6>
                <div className="footer-links">
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>الرئيسية</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/#about'); }}>حول المنصة</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/#features'); }}>المميزات</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>اتصل بنا</a>
                </div>
              </div>
              <div className="col-md-3">
                <h6 className="fw-bold mb-3">الخدمات</h6>
                <div className="footer-links">
                  <a href="#">كشف الأخبار الكاذبة</a>
                  <a href="#">تحليل المحتوى</a>
                  <a href="#">التقارير</a>
                  <a href="#">الإحصائيات</a>
                </div>
              </div>
              <div className="col-md-3">
                <h6 className="fw-bold mb-3">معلومات قانونية</h6>
                <div className="footer-links">
                  <a href="#">سياسة الخصوصية</a>
                  <a href="#">شروط الاستخدام</a>
                  <a href="#">إخلاء المسؤولية</a>
                  <a href="#">الأسئلة الشائعة</a>
                </div>
              </div>
            </div>
            <hr className="my-4" style={{ borderColor: '#333' }} />
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0 text-muted">
                  <i className="fas fa-copyright me-1" aria-hidden="true"></i>
                  2024 جميع الحقوق محفوظة - الحكومة المصرية
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <p className="mb-0 text-muted">
                  <i className="fas fa-shield-alt me-1" aria-hidden="true"></i>
                  منصة آمنة ومعتمدة رسمياً
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;