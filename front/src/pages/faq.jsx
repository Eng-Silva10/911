import React, { useState, useEffect, useRef } from "react";

// Styles used by the component. In a larger app, this would be in a separate CSS file.
const appStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
  :root {
    --primary-color: #1e3c72;
    --secondary-color: #2a5298;
    --dark-color: #1a1a1a;
    --light-bg-color: #f8f9fa;
    --white-color: #ffffff;
    --success-color: #28a745;
    --gray-100: #f8f9fa;
    --gray-200: #e9ecef;
    --gray-300: #dee2e6;
    --gray-600: #6c757d;
    --gray-700: #495057;
    --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
    --shadow-lg: 0 10px 30px rgba(0,0,0,0.1);
    --shadow-xl: 0 20px 40px rgba(0,0,0,0.12);
    --radius-md: 1rem;
    --radius-lg: 1.5rem;
    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  html, body {
    font-family: 'Cairo', sans-serif;
    box-sizing: border-box;
    direction: rtl;
    background-color: var(--white-color);
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
    line-height: 1.6;
  }
  *, *::before, *::after {
    box-sizing: inherit;
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
  
  .row { display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; }
  .col-lg-7, .col-lg-5, .col-md-6, .col-lg-4, .col-lg-2, .col-lg-3, .col-lg-8 { 
    position: relative; 
    width: 100%; 
    padding-right: 15px; 
    padding-left: 15px; 
  }
  @media (min-width: 768px) {
    .col-md-6 { flex: 0 0 50%; max-width: 50%; }
  }
  @media (min-width: 992px) {
    .col-lg-7 { flex: 0 0 58.333333%; max-width: 58.333333%; }
    .col-lg-5 { flex: 0 0 41.666667%; max-width: 41.666667%; }
    .col-lg-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .col-lg-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
    .col-lg-3 { flex: 0 0 25%; max-width: 25%; }
    .col-lg-8 { flex: 0 0 66.666667%; max-width: 66.666667%; }
  }

  /* ===================== HEADER STYLES ===================== */
 .navbar {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1000;
  position: fixed;
  top: 0;
  width: 100%;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 0.9rem 0;
  border-bottom: 1px solid transparent;
}
.navbar.scrolled {
  background: rgba(255, 255, 255, 0.9);
  padding: 0.6rem 0;
  box-shadow: 0 2px 15px rgba(0,0,0,0.08);
  border-bottom: 1px solid var(--gray-200);
}
.navbar.hidden {
  transform: translateY(-100%);
}
.navbar-brand-container {
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
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
  margin-left: 12px;
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
.navbar-brand {
  color: var(--dark-color) !important;
  font-size: 1.4rem !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}
.navbar.scrolled .navbar-brand {
  font-size: 1.2rem !important;
  color: var(--primary-color) !important;
}
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 15px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.navbar-nav .nav-link {
  font-weight: 600;
  color: var(--gray-700);
  padding: 8px 5px;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
  cursor: pointer;
  background: none;
}
.navbar-nav .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary-color);
    transition: width 0.3s ease-out;
}
.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.active {
  color: var(--primary-color) !important;
  transform: none;
  box-shadow: none;
}
.navbar-nav .nav-link:hover::after,
.navbar-nav .nav-link.active::after {
    width: 100%;
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
}
.navbar-toggler:focus { box-shadow: none; }
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
.navbar-toggler.active .navbar-toggler-icon { background-color: transparent; }
.navbar-toggler.active .navbar-toggler-icon::before { transform: rotate(45deg); top: 0; }
.navbar-toggler.active .navbar-toggler-icon::after { transform: rotate(-45deg); top: 0; }

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
    transform: translateY(-10px);
    opacity: 0;
    visibility: hidden;
    transition: transform 0.4s ease, opacity 0.4s ease, visibility 0.4s;
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
  .navbar-nav .nav-link {
    text-align: center;
    padding: 12px 20px;
    width: 100%;
  }
  .navbar-nav .nav-link:hover, .navbar-nav .nav-link.active {
      background: var(--gray-100);
      border-radius: 8px;
  }
  .navbar-nav .nav-link::after {
      display: none;
  }
}
@media (min-width: 992px) {
  .navbar-collapse {
    display: flex !important;
    flex-basis: auto;
  }
  .navbar-nav {
    flex-direction: row;
    margin-right: auto;
    gap: 25px;
  }
  .navbar-toggler { display: none; }
}

  /* ===================== FOOTER STYLES ===================== */
  .footer { 
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: #fff; 
    padding: 90px 0 50px;
    position: relative;
    overflow: hidden;
  }
  .logo-placeholder { 
    width: 90px; 
    height: 90px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    margin-left: 20px; 
    overflow: hidden;
    border-radius: 22px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  }
  .logo-placeholder img { 
    width: 100%; 
    height: 100%; 
    object-fit: contain;
    padding: 18px;
  }
  .footer-links { list-style: none; padding: 0; }
  .footer-links a { 
    color: rgba(255, 255, 255, 0.85); 
    text-decoration: none; 
    display: block; 
    padding: 10px 0; 
    transition: var(--transition); 
    cursor: pointer;
    font-weight: 400;
    font-size: 1.1rem;
    position: relative;
  }
  .footer-links a::before {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 2px;
    background: var(--secondary-color);
    transition: var(--transition);
  }
  .footer-links a:hover { 
    color: #fff;
    transform: translateX(-8px);
    padding-right: 15px;
  }
  .footer-links a:hover::before {
    width: 15px;
  }
  .footer .text-muted { 
    color: rgba(255, 255, 255, 0.7) !important; 
  }
  .social-links a { 
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 45px; 
    height: 45px; 
    background: rgba(255,255,255,0.12);
    color: #fff; 
    text-align: center; 
    border-radius: 50%; 
    margin: 0 8px; 
    transition: var(--transition);
    font-size: 1.2rem;
    border: 1px solid rgba(255,255,255,0.15);
    text-decoration: none;
  }
  .social-links a:hover { 
    background: var(--secondary-color); 
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  }

  /* ===================== GENERIC PAGE STYLES ===================== */
  .page-container {
    padding-top: 80px;
  }
  .page-hero {
    padding: 80px 0;
    background-color: var(--light-bg-color);
    text-align: center;
  }
  .page-hero h1 {
    font-size: 3rem;
    font-weight: 800;
    color: var(--dark-color);
    margin-bottom: 1rem;
  }
  .page-hero p {
    font-size: 1.25rem;
    color: var(--gray-600);
    max-width: 600px;
    margin: 0 auto;
  }
  .content-section {
    padding: 100px 0;
  }

  /* ===================== FAQ PAGE STYLES ===================== */
  .faq-accordion {
      max-width: 800px;
      margin: 0 auto;
  }
  .faq-item {
      background-color: var(--white-color);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
      overflow: hidden;
  }
  .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      cursor: pointer;
      background-color: var(--white-color);
  }
  .faq-question h3 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--dark-color);
  }
  .faq-icon {
      font-size: 1.2rem;
      color: var(--primary-color);
      transition: transform 0.3s ease;
  }
  .faq-item.active .faq-icon {
      transform: rotate(180deg);
  }
  .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease-out, padding 0.5s ease-out;
  }
  .faq-answer p {
      margin: 0;
      padding: 0 20px 20px;
      color: var(--gray-700);
      line-height: 1.8;
  }
  .faq-item.active .faq-answer {
      max-height: 300px; /* Adjust as needed */
  }

  /* ===================== AI WIDGET STYLES ===================== */
  .ai-widget-container {
      position: fixed;
      bottom: 25px;
      left: 25px;
      z-index: 1500;
  }
  .ai-widget-button {
      background: var(--primary-color);
      color: white;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      box-shadow: var(--shadow-lg);
      cursor: pointer;
      transition: var(--transition);
  }
  .ai-widget-button:hover {
      transform: scale(1.1);
      background: var(--secondary-color);
  }
  .ai-widget-chat-window {
      position: absolute;
      bottom: 80px;
      left: 0;
      width: 350px;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateY(20px);
      visibility: hidden;
      transition: opacity 0.3s, transform 0.3s, visibility 0.3s;
  }
  .ai-widget-chat-window.show {
      opacity: 1;
      transform: translateY(0);
      visibility: visible;
  }
  .ai-widget-header {
      padding: 15px;
      background: var(--primary-color);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  .ai-widget-header h3 {
      margin: 0;
      font-size: 1.2rem;
  }
  .ai-widget-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.8;
  }
  .ai-widget-close:hover {
      opacity: 1;
  }
  .ai-chat-box {
    height: 300px;
    overflow-y: auto;
    padding: 15px;
    background-color: var(--light-bg-color);
  }
  .chat-message {
      margin-bottom: 1rem;
      padding: 10px 15px;
      border-radius: 12px;
      max-width: 80%;
      line-height: 1.5;
  }
  .user-message {
      background: var(--primary-color);
      color: white;
      margin-right: auto;
      border-bottom-right-radius: 0;
  }
  .assistant-message {
      background: var(--gray-200);
      color: var(--dark-color);
      margin-left: auto;
      border-bottom-left-radius: 0;
  }
  .ai-widget-input-group {
      display: flex;
      padding: 15px;
      border-top: 1px solid var(--gray-200);
  }
`;

/**
 * Header Component
 */
const Header = ({ activePage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 80);
        setHidden(currentScrollY > lastScrollY.current && currentScrollY > 200);
        lastScrollY.current = currentScrollY;
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}>
                <div className="container">
                    <a href="/" className="navbar-brand-container">
                        <div className="navbar-logo">
                            <img src="https://sadq.rf.gd/assets/uploads/logo.png" alt="شعار صادق" />
                        </div>
                        <span className="navbar-brand">صادق</span>
                    </a>
                    <button
                        className={`navbar-toggler ${isOpen ? 'active' : ''}`}
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`navbar-collapse ${isOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav">
                            <li><a href="/" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>الرئيسية</a></li>
                            <li><a href="/about" className={`nav-link ${activePage === 'about' ? 'active' : ''}`}>من نحن</a></li>
                            <li><a href="/contact" className={`nav-link ${activePage === 'contact' ? 'active' : ''}`}>تواصل معنا</a></li>
                            <li><a href="/faq" className={`nav-link ${activePage === 'faq' ? 'active' : ''}`}>الأسئلة الشائعة</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

/**
 * Footer Component
 */
const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-4 text-center text-md-end">
                        <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
                            <div className="logo-placeholder">
                                <img src="https://sadq.rf.gd/assets/uploads/logo.png" alt="شعار صادق" />
                            </div>
                            <h3 className="h4 text-white mb-0">صادق</h3>
                        </div>
                        <p className="text-muted">منصة حكومية مصرية لمكافحة الأخبار الكاذبة والمعلومات المضللة.</p>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-4">s
                        <h5 className="text-white mb-3">روابط سريعة</h5>
                        <ul className="footer-links">
                            <li><a href="/">الرئيسية</a></li>
                            <li><a href="/about">من نحن</a></li>
                           <li><a href="/contact">تواصل معنا</a></li>
                           <li><a href="/faq">اسئلة شائعة</a></li>
                           <li><a href="/privacy">الخصوصية</a></li>
                           <li><a href="/terms">شروط الاستخدام</a></li>



                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h5 className="text-white mb-3">تواصل معنا</h5>
                        <p className="text-muted"><i className="fas fa-map-marker-alt me-2"></i> وزارة الاتصالات، القاهرة</p>
                        <p className="text-muted"><i className="fas fa-phone me-2"></i> 155</p>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4 text-center">
                        <h5 className="text-white mb-3">تابعنا</h5>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
                <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <div className="text-center text-muted">
                    <p>&copy; {new Date().getFullYear()} منصة صادق. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
};

/**
 * AI Assistant Widget Component
 */
const AIAssistantWidget = ({ callGeminiAPI }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleAsk = async () => {
        if (!question.trim() || isLoading) return;

        const newHistory = [...chatHistory, { role: 'user', text: question }];
        setChatHistory(newHistory);
        setQuestion('');
        setIsLoading(true);

        const context = `
            أنت 'مساعد صادق' الذكي. أجب على أسئلة المستخدمين باللغة العربية وبشكل مختصر ومباشر بناءً على المعلومات المتوفرة في هذا السياق فقط. إذا كان الجواب غير موجود، قل بأدب 'لا أملك هذه المعلومة، يمكنك استخدام نموذج التواصل لمزيد من الاستفسارات'.
            
            --- معلومات حول منصة صادق ---

            **س: ما هي منصة صادق؟**
            ج: منصة 'صادق' هي مبادرة حكومية مصرية رسمية تابعة لوزارة الاتصالات وتقنية المعلومات. هدفها الرئيسي هو مكافحة الأخبار الكاذبة والشائعات.

            **س: كيف تعمل المنصة؟**
            ج: تعمل المنصة عبر استخدام تقنيات الذكاء الاصطناعي المتقدمة، مثل معالجة اللغات الطبيعية وتحليل البيانات الضخمة، لمقارنة الأخبار مع قاعدة بيانات واسعة من المصادر الموثوقة وتقديم تقييم فوري لمدى مصداقيتها.

            **س: هل استخدام المنصة مجاني؟**
            ج: نعم، خدمة التحقق من الأخبار عبر منصة صادق مجانية تمامًا لجميع المستخدمين.

            **س: ما هي نسبة دقة النتائج؟**
            ج: تصل دقة النتائج إلى 95%، ونحن نعمل باستمرار على تحسين نماذجنا لزيادة هذه النسبة.

            **س: هل بياناتي آمنة عند استخدام المنصة؟**
            ج: نعم، نضمن حماية بيانات المستخدمين وسرية عمليات البحث بأعلى معايير الأمان والخصوصية. نحن لا نشارك بيانات البحث مع أي طرف ثالث.

            **س: من هم القائمون على المنصة؟**
            ج: فريق من الخبراء المصريين المتخصصين في الذكاء الاصطناعي، تحليل البيانات، وخبراء الإعلام، يعملون تحت إشراف وزارة الاتصالات وتقنية المعلومات.

            **س: ما نوع الأخبار التي يمكنني التحقق منها؟**
            ج: يمكنك التحقق من الأخبار السياسية, الاقتصادية, الاجتماعية, الصحية, وأي أخبار عامة أخرى. المنصة مصممة للتعامل مع مجموعة واسعة من المواضيع.

            **س: كيف يمكنني التواصل مع الدعم الفني؟**
            ج: يمكنك التواصل معنا عبر البريد الإلكتروني support@sadeq.gov.eg أو عبر الخط الساخن 155.
        `;
        const prompt = `${context}\n\n**سؤال المستخدم:** ${question}`;
        
        try {
            const response = await callGeminiAPI(prompt);
            setChatHistory(prev => [...prev, { role: 'assistant', text: response }]);
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'assistant', text: 'عذرًا، حدث خطأ ما. يرجى المحاولة مرة أخرى.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-widget-container">
            <div className={`ai-widget-chat-window ${isOpen ? 'show' : ''}`}>
                <div className="ai-widget-header">
                    <h3>✨ المساعد الذكي</h3>
                    <button onClick={() => setIsOpen(false)} className="ai-widget-close">&times;</button>
                </div>
                <div className="ai-chat-box" ref={chatBoxRef}>
                    {chatHistory.length === 0 && <div className="assistant-message">مرحباً! كيف يمكنني مساعدتك اليوم بخصوص منصة صادق؟</div>}
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                            {msg.text}
                        </div>
                    ))}
                    {isLoading && <div className="chat-message assistant-message">يفكر...</div>}
                </div>
                <div className="ai-widget-input-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="اسأل عن منصة صادق..."
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAsk()}
                    />
                    <button className="btn-submit" style={{width: 'auto', padding: '0 20px'}} onClick={handleAsk} disabled={isLoading}>
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
            <button className="ai-widget-button" onClick={() => setIsOpen(!isOpen)}>
                <i className="fas fa-comment-dots"></i>
            </button>
        </div>
    );
};


/**
 * FAQPage Component
 */
const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqData = [
        { q: "ما هي منصة صادق؟", a: "منصة 'صادق' هي مبادرة حكومية مصرية رسمية تابعة لوزارة الاتصالات وتقنية المعلومات. هدفها الرئيسي هو مكافحة الأخبار الكاذبة والشائعات عبر استخدام تقنيات الذكاء الاصطناعي." },
        { q: "كيف تعمل المنصة؟", a: "تعمل المنصة عبر استخدام تقنيات الذكاء الاصطناعي المتقدمة، مثل معالجة اللغات الطبيعية وتحليل البيانات الضخمة، لمقارنة الأخبار مع قاعدة بيانات واسعة من المصادر الموثوقة وتقديم تقييم فوري لمدى مصداقيتها." },
        { q: "هل استخدام المنصة مجاني؟", a: "نعم، خدمة التحقق من الأخبار عبر منصة صادق مجانية تمامًا لجميع المستخدمين." },
        { q: "ما هي نسبة دقة النتائج؟", a: "تصل دقة النتائج إلى 95%، ونحن نعمل باستمرار على تحسين نماذجنا لزيادة هذه النسبة." },
        { q: "هل بياناتي آمنة عند استخدام المنصة؟", a: "نعم، نضمن حماية بيانات المستخدمين وسرية عمليات البحث بأعلى معايير الأمان والخصوصية. نحن لا نشارك بيانات البحث مع أي طرف ثالث." },
        { q: "ما نوع الأخبار التي يمكنني التحقق منها؟", a: "يمكنك التحقق من الأخبار السياسية, الاقتصادية, الاجتماعية, الصحية, وأي أخبار عامة أخرى. المنصة مصممة للتعامل مع مجموعة واسعة من المواضيع." },
        { q: "كيف يمكنني التواصل مع الدعم الفني؟", a: "يمكنك التواصل معنا عبر البريد الإلكتروني support@sadeq.gov.eg أو عبر الخط الساخن 155." },
    ];

    const toggleFAQ = index => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <main className="page-container">
            <section className="page-hero">
                <div className="container">
                    <h1>الأسئلة الشائعة</h1>
                    <p>نجيب هنا على أكثر الأسئلة شيوعًا حول منصة صادق وكيفية عملها.</p>
                </div>
            </section>
            <section className="content-section">
                <div className="container">
                    <div className="faq-accordion">
                        {faqData.map((faq, index) => (
                            <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                                <div className="faq-question" onClick={() => toggleFAQ(index)}>
                                    <h3>{faq.q}</h3>
                                    <i className="fas fa-chevron-down faq-icon"></i>
                                </div>
                                <div className="faq-answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};


// Placeholder components for other pages
const HomePage = () => <div className="page-container"><div className="container" style={{height: '100vh'}}><h1>الصفحة الرئيسية</h1></div></div>;
const AboutPage = () => <div className="page-container"><div className="container" style={{height: '100vh'}}><h1>من نحن</h1></div></div>;
const ContactPage = () => <div className="page-container"><div className="container" style={{height: '100vh'}}><h1>تواصل معنا</h1></div></div>;
const PrivacyPage = () => <div className="page-container"><div className="container" style={{height: '100vh'}}><h1>سياسة الخصوصية</h1></div></div>;
const TermsPage = () => <div className="page-container"><div className="container" style={{height: '100vh'}}><h1>شروط الخدمة</h1></div></div>;
const DisclaimerPage = () => <div className="page-container"><div className="container" style={{height: '100vh'}}><h1>إخلاء المسؤولية</h1></div></div>;

/**
 * Main App Component
 * This is the root component that renders the full page layout and handles navigation.
 */
export default function App() {
    const [currentPage, setCurrentPage] = useState('faq');

    // Gemini API call function with exponential backoff
    const callGeminiAPI = async (prompt) => {
        const apiKey = "AIzaSyAa5JrLqaOPYXZ-AuvzOQZxC4zevpF1QAs"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
        };

        let response;
        let retries = 3;
        let delay = 1000;

        while (retries > 0) {
            try {
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const result = await response.json();
                    return result.candidates[0].content.parts[0].text;
                }
            } catch (error) {
                console.error("API call failed:", error);
            }
            
            retries--;
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
        
        throw new Error("Gemini API request failed after multiple retries.");
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home': return <HomePage />;
            case 'about': return <AboutPage />;
            case 'contact': return <ContactPage callGeminiAPI={callGeminiAPI} />;
            case 'faq': return <FAQPage />;
            case 'privacy': return <PrivacyPage />;
            case 'terms': return <TermsPage />;
            case 'disclaimer': return <DisclaimerPage />;
            default: return <HomePage />;
        }
    };

    return (
        <>
            <style>{appStyles}</style>
            <Header onNavClick={setCurrentPage} activePage={currentPage} />
            {renderPage()}
            <Footer onNavClick={setCurrentPage} />
            <AIAssistantWidget callGeminiAPI={callGeminiAPI} />
        </>
    );
}
