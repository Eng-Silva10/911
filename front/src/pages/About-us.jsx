import React, { useEffect, useRef, useState } from "react";

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
    --danger-color: #dc3545;
    --success-color: #28a745;
    --warning-color: #ffc107;
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
  
  .fw-bold { font-weight: 700 !important; }
  .text-center { text-align: center !important; }
  .mb-5 { margin-bottom: 3rem !important; }
  .lead { font-size: 1.25rem; font-weight: 300; }
  .text-muted { color: var(--gray-600) !important; }
  .display-5 { font-size: 3rem; font-weight: 300; line-height: 1.2; }
  .me-2 { margin-right: 0.5rem !important; }
  .w-100 { width: 100% !important; }
  .d-flex { display: flex !important; }
  .justify-content-between { justify-content: space-between !important; }
  .align-items-center { align-items: center !important; }
  .text-white { color: var(--white-color) !important; }
  .mb-0 { margin-bottom: 0 !important; }
  .mb-3 { margin-bottom: 1rem !important; }
  .mb-4 { margin-bottom: 1.5rem !important; }
  .text-md-end { text-align: right !important; }
  .justify-content-md-start { justify-content: flex-start !important; }
  .my-4 { margin-top: 1.5rem !important; margin-bottom: 1.5rem !important; }
  .col-lg-4 { flex: 0 0 33.333333%; max-width: 33.333333%; position: relative; width: 100%; padding-right: 15px; padding-left: 15px; }
  .col-md-6 { flex: 0 0 50%; max-width: 50%; position: relative; width: 100%; padding-right: 15px; padding-left: 15px; }
  .col-lg-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
  .col-lg-3 { flex: 0 0 25%; max-width: 25%; }
  .row { display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; }
  .h2 { font-size: 2.5rem; }
  .h3 { font-size: 1.75rem; }
  .h4 { font-size: 1.5rem; }
  .h5 { font-size: 1.25rem; }

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
  .content-section h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
  .content-section p, .content-section li {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--gray-700);
  }

  /* ===================== ABOUT PAGE DESIGN ===================== */
  .section-title {
      font-size: 2.8rem;
      font-weight: 800;
      margin-bottom: 1rem;
      color: var(--dark-color);
  }
  .section-subtitle {
      font-size: 1.25rem;
      color: var(--gray-600);
      max-width: 600px;
      margin: 0 auto 4rem auto;
  }

  /* New Hero Section */
  .hero-section-v3 {
      background: linear-gradient(135deg, var(--light-bg-color) 0%, #e9ecef 100%);
      padding: 100px 0;
      overflow: hidden;
  }
  .hero-content-v3 {
      text-align: right;
  }
  .hero-content-v3 h1 {
      font-size: 3.8rem;
      font-weight: 900;
      line-height: 1.3;
      margin-bottom: 1.5rem;
      color: var(--dark-color);
      animation: slideInUp 0.8s ease-out;
  }
  .hero-content-v3 .lead {
      font-size: 1.4rem;
      max-width: 500px;
      margin-bottom: 2rem;
      color: var(--gray-700);
      animation: slideInUp 0.8s ease-out 0.2s both;
  }
  .hero-cta {
      padding: 15px 35px;
      background: var(--primary-color);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      transition: var(--transition);
      display: inline-block;
      box-shadow: var(--shadow-md);
      animation: slideInUp 0.8s ease-out 0.4s both;
  }
  .hero-cta:hover {
      background: var(--secondary-color);
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
  }
  .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1000px;
  }
  .verification-card {
      background: white;
      padding: 25px;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      width: 350px;
      transform-style: preserve-3d;
      animation: float-right 4s ease-in-out infinite, fadeIn 1s ease-out 0.5s both;
  }
  .verification-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
  }
  .verification-icon {
      font-size: 2.5rem;
      color: var(--success-color);
      margin-left: 15px;
  }
  .verification-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--success-color);
  }
  .verification-bar {
      height: 8px;
      background-color: var(--gray-200);
      border-radius: 5px;
      margin-bottom: 10px;
      overflow: hidden;
  }
  .verification-bar-inner {
      height: 100%;
      width: 95%;
      background-color: var(--success-color);
      border-radius: 5px;
  }
  
  /* Timeline Section */
  .timeline-section {
      padding: 100px 0;
  }
  .timeline-container {
    position: relative;
  }
  .timeline-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      /* للتحكم في سماكة الخط، قم بتغيير قيمة العرض 'width' هنا */
      width: 3px; 
      height: 100%;
      background-color: var(--gray-200);
  }
  .timeline-container::after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      /* للتحكم في سماكة الخط، قم بتغيير قيمة العرض 'width' هنا */
      width: 3px;
      height: 100%;
      background-color: var(--primary-color);
      transform: scaleY(0);
      transform-origin: top;
      transition: transform 1.5s ease-out;
      z-index: 0;
  }
  .fade-in-section.is-visible .timeline-container::after {
      transform: scaleY(1);
  }
  .timeline-item {
      padding: 40px 0;
      position: relative;
  }
  .timeline-content {
      position: relative;
      width: 42%;
      background: var(--white-color);
      padding: 30px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--gray-200);
      /* Add initial state for animation */
      opacity: 0;
      transition: transform 0.8s ease-out, opacity 0.8s ease-out;
  }
  .fade-in-section.is-visible .timeline-content {
      opacity: 1;
      transform: translateX(0) !important;
  }
  .timeline-item:nth-child(odd) .timeline-content {
      float: right;
      margin-right: 8%;
      transform: translateX(50px);
  }
  .timeline-item:nth-child(even) .timeline-content {
      float: left;
      margin-left: 8%;
      transform: translateX(-50px);
  }
  .timeline-item::after {
      content: '';
      display: block;
      clear: both;
  }
  .timeline-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      border: 5px solid var(--white-color);
      box-shadow: 0 0 0 3px var(--primary-color);
      z-index: 1;
  }
  .timeline-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--primary-color);
  }
  .timeline-text {
      font-size: 1.1rem;
      color: var(--gray-700);
  }

  /* Tech, Values, and Team Grids */
  .tech-grid, .values-grid-v2, .team-grid-v2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-top: 4rem;
  }

  @media (min-width: 992px) {
    .tech-grid, .values-grid-v2, .team-grid-v2 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Tech Section */
  .tech-section {
      padding: 100px 0;
      background-color: var(--light-bg-color);
  }
  .tech-card {
      background: var(--white-color);
      padding: 30px;
      border-radius: var(--radius-md);
      border: 1px solid var(--gray-200);
      transition: var(--transition);
  }
  .tech-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
  }
  .tech-icon {
      font-size: 2.5rem;
      color: var(--secondary-color);
      margin-bottom: 1rem;
  }
  .tech-card h4 {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
  }
  
  /* Values Section v2 */
  .values-section-v2 {
      padding: 100px 0;
  }
  .value-card-v2 {
      background: var(--white-color);
      padding: 40px 30px;
      border-radius: var(--radius-md);
      border: 1px solid var(--gray-200);
      transition: var(--transition);
  }
  .value-card-v2:hover {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-md);
  }
  .value-icon-v2 {
      font-size: 3rem;
      color: var(--primary-color);
      margin-bottom: 1.5rem;
  }
  .value-card-v2 h4 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
  }

  /* Team Section v2 */
  .team-section-v2 {
      padding: 100px 0;
      background-color: var(--light-bg-color);
  }
  .team-card-v2 {
      background-color: var(--white-color);
      border-radius: var(--radius-md);
      text-align: center;
      padding: 30px;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
      border: 1px solid var(--gray-200);
  }
  .team-card-v2:hover {
      transform: translateY(-10px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary-color);
  }
  .team-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0 auto 1.5rem auto;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      border: 4px solid var(--white-color);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  .team-card-v2 h4 {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
  }
  .team-role {
      color: var(--secondary-color);
      font-weight: 600;
      margin-bottom: 1rem;
  }

  /* CTA Section */
  .cta-section {
    padding: 100px 0;
    background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
    color: white;
    text-align: center;
  }
  .cta-title {
    font-size: 2.8rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
  }
  .cta-subtitle {
    font-size: 1.3rem;
    max-width: 600px;
    margin: 0 auto 2.5rem;
    opacity: 0.9;
  }
  .cta-btn {
    background: var(--white-color);
    color: var(--primary-color);
    border: none;
    padding: 18px 40px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 1.1rem;
    transition: var(--transition);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-decoration: none;
  }
  .cta-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.25);
    background: var(--gray-200);
  }
  
  /* Animation utilities */
  .fade-in-section {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  }
  .fade-in-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @keyframes slideInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
  }
  @keyframes float-right {
    0% { transform: translateY(0px) rotateX(10deg) rotateY(10deg); }
    50% { transform: translateY(-20px) rotateX(10deg) rotateY(10deg); }
    100% { transform: translateY(0px) rotateX(10deg) rotateY(10deg); }
  }
  @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
  }
  
  /* Responsive Adjustments for new design */
  @media (max-width: 991px) {
      .hero-content-v3 { text-align: center; margin-bottom: 3rem; }
      .hero-content-v3 .lead { margin: 0 auto 2rem auto; }
  }
  @media (max-width: 768px) {
      .about-page { padding-top: 70px; }
      .section-title { font-size: 2.2rem; }
      .hero-section-v3 { padding: 60px 0; }
      .hero-content-v3 h1 { font-size: 2.8rem; }
      .hero-content-v3 .lead { font-size: 1.2rem; }
      
      .timeline-container::before, .timeline-container::after { 
        left: auto;
        right: 20px;
        transform: translateX(0);
      }
      .timeline-item:nth-child(odd) .timeline-content,
      .timeline-item:nth-child(even) .timeline-content {
          width: calc(100% - 65px);
          float: none;
          margin-right: 50px;
          margin-left: 0;
          transform: translateX(0);
      }
      .timeline-icon { 
        left: auto;
        right: 20px;
        transform: translate(50%, -50%);
      }
      .cta-title { font-size: 2.2rem; }
      .cta-subtitle { font-size: 1.1rem; }
  }
`;

/**
 * Custom hook to detect when an element is in the viewport.
 */
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, options]);

    return [ref, isVisible];
};

/**
 * A wrapper component to apply fade-in animation to its children when they scroll into view.
 */
const AnimatedSection = ({ children }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.15 });
    return (
        <div ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
            {children}
        </div>
    );
};

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
                    <div className="col-lg-2 col-md-6 mb-4">
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
 * AboutPage Component - NEW DESIGN
 * This component renders the entire "About Us" page with a story-driven timeline layout.
 */
const AboutPage = () => {
  return (
    <main className="about-page" dir="rtl">
        <section className="hero-section-v3">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div className="hero-content-v3">
                            <h1>نبني الثقة في العصر الرقمي</h1>
                            <p className="lead">
                                في عالم مليء بالمعلومات، مهمتنا هي توفير أداة قوية وموثوقة لكل مصري للتمييز بين الحقيقة والشائعات.
                            </p>
                            <a href="#" className="hero-cta">ابدأ التحقق الآن</a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="hero-visual">
                            <div className="verification-card">
                                <div className="verification-header">
                                    <i className="fas fa-check-circle verification-icon"></i>
                                    <span className="verification-title">خبر موثوق</span>
                                </div>
                                <p className="text-muted small">مصدر الخبر: وكالة الأنباء الرسمية</p>
                                <div className="verification-bar">
                                    <div className="verification-bar-inner"></div>
                                </div>
                                <p className="font-weight-bold mb-0">نسبة الدقة: 95%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

      <AnimatedSection>
        <section className="timeline-section">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-title">رحلتنا نحو الحقيقة</h2>
                    <p className="section-subtitle">من فكرة إلى مبادرة وطنية رائدة.</p>
                </div>
                <div className="timeline-container">
                    <div className="timeline-item">
                        <div className="timeline-icon"><i className="fas fa-lightbulb"></i></div>
                        <div className="timeline-content">
                            <h3 className="timeline-title">الفكرة</h3>
                            <p className="timeline-text">بدأت "صادق" كمبادرة لمواجهة التحدي المتزايد للمعلومات المضللة التي تؤثر على مجتمعنا، بهدف إنشاء مرجع موثوق للتحقق من الأخبار.</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-icon"><i className="fas fa-cogs"></i></div>
                        <div className="timeline-content">
                            <h3 className="timeline-title">التطوير</h3>
                            <p className="timeline-text">عكف فريق من أفضل الخبراء المصريين على بناء بنية تحتية تكنولوجية متطورة، تعتمد على الذكاء الاصطناعي لتحليل البيانات بدقة وسرعة.</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-icon"><i className="fas fa-rocket"></i></div>
                        <div className="timeline-content">
                            <h3 className="timeline-title">الانطلاق</h3>
                            <p className="timeline-text">تم إطلاق المنصة رسميًا تحت إشراف وزارة الاتصالات وتقنية المعلومات، لتصبح متاحة لجميع المواطنين كأداة وطنية لتعزيز الوعي.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </AnimatedSection>
      
      <AnimatedSection>
        <section className="tech-section">
            <div className="container text-center">
                <h2 className="section-title">محركنا التكنولوجي</h2>
                <p className="section-subtitle">نستخدم أحدث التقنيات لتقديم تحليل دقيق وموثوق لكل خبر.</p>
                <div className="tech-grid">
                    <div className="tech-card">
                        <div className="tech-icon"><i className="fas fa-brain"></i></div>
                        <h4>الذكاء الاصطناعي</h4>
                        <p className="text-muted">نماذج متقدمة تحلل السياق والمصدر للكشف عن الأنماط المضللة.</p>
                    </div>
                     <div className="tech-card">
                        <div className="tech-icon"><i className="fas fa-database"></i></div>
                        <h4>تحليل البيانات الضخمة</h4>
                        <p className="text-muted">نقارن المعلومات مع قاعدة بيانات واسعة من المصادر الموثوقة في لحظات.</p>
                    </div>
                     <div className="tech-card">
                        <div className="tech-icon"><i className="fas fa-language"></i></div>
                        <h4>معالجة اللغات الطبيعية</h4>
                        <p className="text-muted">نفهم الفروق الدقيقة في اللغة العربية لتحليل المحتوى بعمق أكبر.</p>
                    </div>
                     <div className="tech-card">
                        <div className="tech-icon"><i className="fas fa-shield-alt"></i></div>
                        <h4>الأمان والخصوصية</h4>
                        <p className="text-muted">نضمن حماية بيانات المستخدمين وسرية عمليات البحث بأعلى المعايير.</p>
                    </div>
                </div>
            </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="values-section-v2">
            <div className="container text-center">
                <h2 className="section-title">قيمنا الأساسية</h2>
                <p className="section-subtitle">المبادئ التي توجه كل قرار نتخذه وكل تقنية نطورها.</p>
                <div className="values-grid-v2">
                    <div className="value-card-v2">
                        <div className="value-icon-v2"><i className="fas fa-shield-halved"></i></div>
                        <h4>النزاهة والموضوعية</h4>
                        <p className="text-muted">نلتزم بالحياد التام في تحليل الأخبار، وعرض الحقائق كما هي دون تحيز.</p>
                    </div>
                    <div className="value-card-v2">
                        <div className="value-icon-v2"><i className="fas fa-handshake-angle"></i></div>
                        <h4>تمكين المجتمع</h4>
                        <p className="text-muted">نؤمن بأن تزويد المواطنين بأدوات المعرفة هو أساس بناء مجتمع واعٍ وقوي.</p>
                    </div>
                    <div className="value-card-v2">
                        <div className="value-icon-v2"><i className="fas fa-lightbulb"></i></div>
                        <h4>الابتكار المستمر</h4>
                        <p className="text-muted">نسعى دائمًا لتطوير تقنياتنا لمواكبة التحديات المتغيرة في عالم المعلومات.</p>
                    </div>
                    <div className="value-card-v2">
                        <div className="value-icon-v2"><i className="fas fa-balance-scale"></i></div>
                        <h4>الشفافية والمساءلة</h4>
                        <p className="text-muted">نعمل بوضوح تام في منهجياتنا ونتائجنا، ونرحب دائمًا بالمراجعة والتدقيق.</p>
                    </div>
                </div>
            </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="team-section-v2">
          <div className="container text-center">
            <h2 className="section-title">العقول وراء صادق</h2>
            <p className="section-subtitle">فريق من الخبراء المتخصصين يعمل بشغف لخدمة الحقيقة.</p>
            <div className="team-grid-v2">
                <div className="team-card-v2">
                    <div className="team-avatar"><i className="fas fa-user-tie"></i></div>
                    <h4>د. أحمد محمد</h4>
                    <p className="team-role">مدير المنصة</p>
                </div>
                <div className="team-card-v2">
                    <div className="team-avatar"><i className="fas fa-user-gear"></i></div>
                    <h4>م. سارة عبدالله</h4>
                    <p className="team-role">مطورة رئيسية</p>
                </div>
                <div className="team-card-v2">
                    <div className="team-avatar"><i className="fas fa-user-magnifying-glass"></i></div>
                    <h4>أ. محمد خالد</h4>
                    <p className="team-role">أخصائي تحليل المحتوى</p>
                </div>
                <div className="team-card-v2">
                    <div className="team-avatar"><i className="fas fa-headset"></i></div>
                    <h4>ن. نادية حسن</h4>
                    <p className="team-role">مديرة الدعم الفني</p>
                </div>
            </div>
          </div>
        </section>
      </AnimatedSection>
      
      <AnimatedSection>
        <section className="cta-section">
            <div className="container">
                <h2 className="cta-title">هل أنت مستعد للتحقق من الخبر ؟</h2>
                <p className="cta-subtitle">انضم إلى آلاف المستخدمين الذين يعتمدون على صادق للحصول على معلومات دقيقة وموثوقة.</p>
                <a href="#" className="cta-btn">ابدأ الآن</a>
            </div>
        </section>
      </AnimatedSection>
    </main>
  );
};


/**
 * Main App Component
 * This is the root component that renders the full page layout including Header, AboutPage, and Footer.
 */
export default function App() {
    return (
        <>
            <style>{appStyles}</style>
            <Header />
            <AboutPage />
            <Footer />
        </>
    );
}
