import React, { useEffect, useRef, useState } from "react";

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
    --radius-xl: 2rem;
    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  html, body {
    font-family: 'Cairo', sans-serif;
    box-sizing: border-box;
    direction: rtl;
    background-color: var(--light-bg-color);
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
  .me-2 { margin-right: 0.5rem !important; }
  .me-3 { margin-right: 1rem !important; }
  .w-100 { width: 100% !important; }
  .d-flex { display: flex !important; }
  .justify-content-between { justify-content: space-between !important; }
  .align-items-center { align-items: center !important; }
  .text-white { color: var(--white-color) !important; }
  .mb-0 { margin-bottom: 0 !important; }
  .mb-3 { margin-bottom: 1rem !important; }
  .mb-4 { margin-bottom: 1.5rem !important; }
  .mt-4 { margin-top: 1.5rem !important; }
  .ms-auto { margin-left: auto !important; }
  .h2 { font-size: 2rem; }
  .h3 { font-size: 1.75rem; }
  .h4 { font-size: 1.5rem; }
  .col-md-9 { flex: 0 0 75%; max-width: 75%; }
  .col-md-3 { flex: 0 0 25%; max-width: 25%; }
  .col-lg-10 { flex: 0 0 83.333333%; max-width: 83.333333%; }
  .justify-content-center { justify-content: center !important; }
  .row { display: flex; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; }
  /* ================= Header/Navbar ================= */
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
.navbar-logo {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
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
  gap: 10px;
}
.navbar-nav .nav-link {
  font-weight: 500;
  color: var(--dark-color);
  padding: 8px 18px;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
}
.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.active {
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
}
.navbar-toggler:focus {
  box-shadow: none;
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
  .navbar-nav .nav-link {
    text-align: center;
    padding: 12px 20px;
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
  .hero-section { 
        background: linear-gradient(rgba(30, 60, 114, 0.8), rgba(30, 60, 114, 0.8)), url('https://sadq.rf.gd/assets/uploads/banner.png') center/cover no-repeat;
        color: var(--white-color); 
        padding: 180px 0 200px; 
        position: relative; 
        overflow: hidden; 
        margin-top: 45px;
      }
  .hero-content { position: relative; z-index: 5; }
  .hero-title { 
    font-size: 3.8rem; 
    font-weight: 900; 
    line-height: 1.2; 
    text-shadow: 0 6px 20px rgba(0,0,0,0.25);
    margin-bottom: 1.8rem;
    letter-spacing: -1.2px;
    animation: fadeInDown 1s ease-out;
  }
  .hero-subtitle { 
    font-size: 1.5rem; 
    font-weight: 400; 
    opacity: 0.97;
    max-width: 750px;
    margin: 0 auto 2.5rem;
    line-height: 1.8;
    animation: fadeInUp 1s ease-out 0.3s both;
  }
  .government-badge {
    background: linear-gradient(45deg, #c41e3a, #dc3545);
    color: #fff;
    padding: 12px 30px;
    border-radius: 50px;
    display: inline-block;
    margin-top: 30px;
    font-weight: 700;
    letter-spacing: 0.7px;
    box-shadow: 0 8px 25px rgba(196, 30, 58, 0.4);
    animation: pulse 3s infinite;
    font-size: 1.2rem;
    border: 2px solid rgba(255,255,255,0.25);
    animation: fadeInUp 1s ease-out 0.6s both;
  }
  @keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220,53,69,0.5); }
    70% { transform: scale(1.03); box-shadow: 0 0 0 20px rgba(220,53,69,0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220,53,69,0); }
  }
  .search-container {
    background: var(--white-color);
    border-radius: var(--radius-xl);
    padding: 55px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.18);
    margin-top: -110px;
    position: relative;
    z-index: 10;
    border: 1px solid var(--gray-200);
    transition: var(--transition);
    animation: fadeInUp 1s ease-out 0.9s both;
  }
  .search-container:hover {
    transform: translateY(-8px);
    box-shadow: 0 35px 70px rgba(0,0,0,0.22);
  }
  .search-input {
    border: 2px solid var(--gray-200);
    border-radius: 50px;
    padding: 20px 28px;
    font-size: 1.15rem;
    transition: var(--transition);
    font-weight: 500;
    color: var(--gray-800);
  }
  .search-input:focus {
    border-color: var(--secondary-color);
    box-shadow: 0 0 0 0.4rem rgba(42,82,152,0.18);
    outline: none;
  }
  .search-input::placeholder {
    color: var(--gray-500);
    font-weight: 400;
  }
  .search-btn {
    border-radius: 50px;
    padding: 20px 40px;
    background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
    border: none;
    color: #fff;
    font-weight: 700;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
    font-size: 1.15rem;
    letter-spacing: 0.7px;
    box-shadow: 0 10px 30px rgba(30, 60, 114, 0.35);
  }
  .search-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(30, 60, 114, 0.45);
  }
  .search-btn:hover::after {
    opacity: 1;
  }
  .search-btn::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 20px;
    height: 200%;
    background: rgba(255,255,255,0.4);
    transform: rotate(30deg);
    transition: all 0.8s;
    opacity: 0;
  }
  .search-btn:disabled {
    opacity: 0.7;
    transform: none;
    box-shadow: none;
    cursor: not-allowed;
  }
  .feature-card, .stat-card {
    background: var(--white-color);
    border-radius: var(--radius-lg);
    padding: 45px 35px;
    text-align: center;
    box-shadow: var(--shadow-lg);
    transition: var(--transition);
    height: 100%;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--gray-200);
  }
  .feature-card:hover, .stat-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
  }
  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: 0.6s;
  }
  .feature-card:hover::before {
    left: 100%;
  }
  .feature-icon {
    width: 95px;
    height: 95px;
    background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 30px;
    color: #fff;
    font-size: 38px;
    box-shadow: 0 12px 30px rgba(30, 60, 114, 0.35);
    transition: var(--transition);
    border: 5px solid rgba(255,255,255,0.25);
  }
  .feature-card:hover .feature-icon {
    transform: scale(1.12) rotate(8deg);
  }
  .stat-number {
    font-size: 4rem;
    font-weight: 800;
    color: var(--secondary-color);
    display: block;
    margin-bottom: 0.6rem;
    line-height: 1;
  }
  .stats-section { 
    background: linear-gradient(135deg, #f0f4f8, #e6eef5);
    position: relative;
    overflow: hidden;
  }
  .step-icon {
    width: 85px;
    height: 85px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    margin: 0 auto 1.8rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.18);
    transition: var(--transition);
    border: 4px solid rgba(255,255,255,0.35);
  }
  .step-card:hover .step-icon {
    transform: scale(1.12) rotate(8deg);
  }
  .step-1 .step-icon { 
    background: linear-gradient(135deg, #1e3c72, #2a5298); 
    box-shadow: 0 10px 30px rgba(30, 60, 114, 0.45);
  }
  .step-2 .step-icon { 
    background: linear-gradient(135deg, #21a367, #28b87d); 
    box-shadow: 0 10px 30px rgba(33, 163, 103, 0.45);
  }
  .step-3 .step-icon { 
    background: linear-gradient(135deg, #d39e00, #ffc107); 
    box-shadow: 0 10px 30px rgba(211, 158, 0, 0.45);
  }
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
    display: inline-block; 
    width: 45px; 
    height: 45px; 
    background: rgba(255,255,255,0.12);
    color: #fff; 
    text-align: center; 
    line-height: 50px; 
    border-radius: 50%; 
    margin: 1 8px; 
    transition: var(--transition);
    font-size: 1.2rem;
    border: 1px solid rgba(255,255,255,0.15);
  }
  .social-links a:hover { 
    background: var(--secondary-color); 
    transform: translateY(-5px) rotate(0deg);
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  }
  #loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #1e3c72, #2a5298);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    flex-direction: column;
    text-align: center;
  }
  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 35px;
    position: relative;
  }
  .loading-logo {
    width: 170px;
    height: auto;
    margin-bottom: 30px;
    animation: float 3.5s ease-in-out infinite;
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-25px); }
    100% { transform: translateY(0px); }
  }
  .progress-bar {
    width: 380px;
    height: 10px;
    background: rgba(255,255,255,0.25);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 18px rgba(0,0,0,0.12);
  }
  .progress {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #fff, #e0e0e0);
    animation: load 2s ease-in-out forwards;
    border-radius: 12px;
  }
  .loading-text {
    position: absolute;
    bottom: -70px;
    opacity: 0;
    font-size: 2rem;
    font-weight: 800;
    color: #fff;
    text-shadow: 0 3px 12px rgba(0,0,0,0.25);
    animation: swipeUp 1.2s ease-out 0.8s forwards;
  }
  @keyframes swipeUp {
    0% { transform: translateY(0); opacity: 0; }
    100% { transform: translateY(-95px); opacity: 1; }
  }
  @keyframes load {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  /* Search Results Page Styles */
  .search-results-page {
      padding: 150px 0 90px;
      min-height: 80vh;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  }
  .ai-answer-card {
    background: #fff;
    border-radius: var(--radius-lg);
    padding: 40px;
    box-shadow: var(--shadow-lg);
    border-left: 7px solid var(--primary-color);
  }
  .ai-answer-card h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 1.5rem;
  }
  .ai-answer-text {
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--gray-700);
    white-space: pre-wrap;
  }
  .ai-source-warning {
    background-color: #fff3cd;
    border-color: #ffeeba;
    color: #856404;
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    margin-top: 2rem;
    border: 1px solid transparent;
  }
  .references-section {
    margin-top: 2.5rem;
  }
  .references-section h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  .references-list {
    list-style: none;
    padding: 0;
  }
  .references-list li {
    background: var(--white-color);
    padding: 15px;
    border-radius: var(--radius-md);
    margin-bottom: 10px;
    border: 1px solid var(--gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .reference-title {
    flex-grow: 1;
  }
  .reference-link {
    margin-right: 15px;
    padding: 8px 15px;
    background-color: var(--light-bg-color);
    border: 1px solid var(--gray-300);
    color: var(--primary-color);
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: var(--transition);
  }
  .reference-link:hover {
      background-color: var(--gray-200);
  }
  .searching-state {
    background: linear-gradient(135deg, var(--white-color), #f8f9fa);
    border-radius: var(--radius-lg);
    padding: 90px 45px;
    text-align: center;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--gray-200);
  }
  .searching-state .spinner-border {
    width: 3.5rem;
    height: 3.5rem;
    border-width: 0.35rem;
    margin-bottom: 35px;
  }
  .searching-state h3 {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 25px;
  }
  .searching-state p {
    font-size: 1.25rem;
    color: var(--gray-600);
    max-width: 650px;
    margin: 0 auto;
    line-height: 1.75;
  }
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .spinner-border {
    display: inline-block;
    width: 1.3rem;
    height: 1.3rem;
    vertical-align: text-bottom;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border 0.75s linear infinite;
  }
  @keyframes spinner-border {
    to { transform: rotate(360deg); }
  }
  .page-transition {
    opacity: 0;
    transform: translateY(25px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .page-transition.active {
    opacity: 1;
    transform: translateY(0);
  }
  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: var(--white-color);
    border: none;
    padding: 14px 28px;
    border-radius: 50px;
    font-weight: 600;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
    font-size: 1.05rem;
    cursor: pointer;
  }
  .btn-back:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  }
  .custom-alert {
    position: fixed;
    top: 110px;
    left: 50%;
    transform: translateX(-50%);
    padding: 1.4rem 2.2rem;
    border-radius: var(--radius-md);
    color: #fff;
    background: linear-gradient(135deg, var(--danger-color), #a71d2a);
    box-shadow: 0 12px 35px rgba(220, 53, 69, 0.35);
    z-index: 1050;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
    width: 90%;
    max-width: 650px;
    text-align: center;
    font-weight: 600;
    font-size: 1.15rem;
    border: 1px solid rgba(255,255,255,0.15);
  }
  .custom-alert.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-12px);
  }
  .no-results-card {
    background: #fff;
    border-radius: var(--radius-lg);
    padding: 50px 40px;
    text-align: center;
    box-shadow: var(--shadow-lg);
    border-top: 7px solid var(--warning-color);
  }
  .no-results-card i.fa-search-minus {
    font-size: 4rem;
    color: var(--warning-color);
    margin-bottom: 1.5rem;
  }
  .no-results-card h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 1rem;
  }
  .no-results-card p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--gray-700);
    max-width: 500px;
    margin: 0 auto 2rem auto;
  }
  .btn-report {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: linear-gradient(135deg, var(--warning-color), #ffcd39);
    color: var(--dark-color);
    border: none;
    padding: 14px 28px;
    border-radius: 50px;
    font-weight: 700;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
    font-size: 1.05rem;
    cursor: pointer;
  }
  .btn-report:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    background: linear-gradient(135deg, #ffcd39, var(--warning-color));
  }
`;

const AiSearchResultsPage = ({ query, result, onBack, isSearching }) => {
  if (isSearching) {
    return (
      <main className="search-results-page" id="main-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="searching-state">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">جارى التحقق...</span>
                </div>
                <h3>جاري تحليل طلبك...</h3>
                <p>يستخدم الذكاء الاصطناعي لفهم سؤالك والبحث في قاعدة البيانات لتقديم إجابة دقيقة.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="search-results-page" id="main-content">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h1 className="h2 fw-bold mb-0">نتيجة البحث الذكي</h1>
              <button onClick={onBack} className="btn-back" aria-label="العودة إلى صفحة البحث">
                <i className="fas fa-arrow-right"></i> سؤال جديد
              </button>
            </div>
            <div className="bg-white rounded-lg p-4 mb-5 shadow-sm">
              <p className="lead text-muted mb-0">
                سؤالك: <strong className="text-dark">"{query}"</strong>
              </p>
            </div>
            {result && result.answer ? (
              <div className="ai-answer-card">
                <h2><i className="fas fa-magic-wand-sparkles me-3"></i>إجابة  صادق</h2>
                <p className="ai-answer-text">{result.answer}</p>
                {result.source === 'ai' && (
                  <div className="ai-source-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>تنبيه:</strong> هذه المعلومات من الذكاء الاصطناعي وقد تحتمل الخطأ.
                  </div>
                )}
                {result.source === 'database' && result.references && Object.keys(result.references).length > 0 && (
                  <div className="references-section">
                    <h3><i className="fas fa-book-open me-2"></i> المصدر الرئيسي</h3>
                    <ul className="references-list">
                      {/* Get the first reference only */}
                      {Object.entries(result.references).slice(0, 1).map(([url, title]) => (
                        <li key={url}>
                          <span className="reference-title">{title}</span>
                          {url && url !== '#' && <a href={url} target="_blank" rel="noopener noreferrer" className="reference-link">المصدر</a>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-results-card">
                 <i className="fas fa-search-minus"></i>
                 <h2>لم يتم العثور على الخبر</h2>
                 <p>لم نتمكن من العثور على معلومات بخصوص هذا الخبر في قاعدة بياناتنا. يمكنكم المساعدة بالإبلاغ عنه ليقوم فريقنا بالتحقق منه.</p>
                 <button onClick={() => alert('سيتم إضافة صفحة الإبلاغ قريبًا!')} className="btn-report">
                    <i className="fas fa-flag me-2"></i> الإبلاغ عن الخبر
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const CustomAlert = ({ message, show }) => {
  return (
    <div className={`custom-alert ${show ? 'show' : ''}`} role="alert">
      <i className="fas fa-exclamation-triangle me-2"></i>
      {message}
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');
  const [query, setQuery] = useState('');
  const [aiSearchResult, setAiSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const header = document.getElementById("mainHeader");
    const handleScroll = () => {
      if (!header) return;
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
      if (window.scrollY < lastScrollY) {
        header.classList.remove("hidden");
      } else if (window.scrollY > 200) {
        header.classList.add("hidden");
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showAlert = (message) => {
    setAlert({ show: true, message });
    setTimeout(() => setAlert({ show: false, message: '' }), 4500);
  };

  // --- دالة البحث المعدلة لحل جميع المشاكل ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    setPage('results');

    try {
      // ⚠️ نستخدم المسار النسبي /api/search
      // ⚠️ سيتم إعادة توجيهه تلقائيًا إلى http://127.0.0.1:8000/api/search عبر setupProxy.js
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      // --- التحقق من أن الاستجابة هي JSON ---
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format. Expected JSON.");
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.source === 'ai') {
        setAiSearchResult({ answer: null, source: 'not_found', references: [] });
      } else {
        setAiSearchResult(data);
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
      // عرض رسالة خطأ واضحة
      showAlert('❌ فشل الاتصال بالخادم. يرجى التأكد من: 1. تشغيل خادم الـ API على http://127.0.0.1:8000 2. وجود ملف setupProxy.js في مجلد src 3. إعادة تشغيل npm start');
      setAiSearchResult({ answer: null, source: 'error', references: [] });
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const handleScrollAnimations = () => {
      const elements = document.querySelectorAll('.feature-card, .stat-card, .step-card');
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          element.style.animation = 'fadeInUp 0.8s ease-out both';
        }
      });
    };

    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations(); 
    return () => window.removeEventListener('scroll', handleScrollAnimations);
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  if (loading) {
    return (
      <div id="loading-screen" role="status" aria-live="polite" aria-label="شاشة تحميل محتمى الصفحة">
        <div className="loading-content">
          <div className="loading-logo">
            <svg width="170" height="170" viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="85" cy="85" r="80" fill="url(#gradient)" />
              <path 
                d="M55 85L75 105L115 65" 
                stroke="white" 
                strokeWidth="12" 
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeDasharray: 130, strokeDashoffset: 130, animation: 'dash 1.2s ease-in-out forwards 0.5s' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3c72" />
                  <stop offset="100%" stopColor="#2a5298" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <span className="loading-text">
            منصة صادق
          </span>
        </div>
        <style>{`
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ backgroundColor: "var(--light-bg-color)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{appStyles}</style>
      <CustomAlert message={alert.message} show={alert.show} />
      <header id="mainHeader" ref={headerRef}>
        <nav className="navbar" role="navigation" aria-label="القائمة الرئيسية">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#" aria-label="العودة للصفحة الرئيسية" onClick={(e) => { e.preventDefault(); setPage('home'); setIsMenuOpen(false); }}>
              <div className="d-flex align-items-center">
                <div className="navbar-logo me-2">
                  <img src="https://sadq.rf.gd/assets/uploads/logo1.png" alt="شعار منصة صادق" />
                </div>
                <span className="fw-bold">صادق</span>
              </div>
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
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#home" onClick={(e) => { e.preventDefault(); setPage('home'); setIsMenuOpen(false); }}>الرئيسية</a></li>
                <li className="nav-item"><a className="nav-link" href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }}>حول المنصة</a></li>
                <li className="nav-item"><a className="nav-link" href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }}>المميزات</a></li>
                <li className="nav-item"><a className="nav-link" href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }}>اتصل بنا</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className={`page-transition ${page === 'home' ? 'active' : ''}`} style={{ flex: 1, display: page === 'home' ? 'block' : 'none' }}>
        <main>
          <section className="hero-section" id="home" aria-labelledby="hero-title">
            <div className="container text-center hero-content">
              <h1 className="hero-title" id="hero-title">
                منصة صادق
              </h1>
              <p className="hero-subtitle">
                تحقق من صحة الأخبار والمعلومات باستخدام تقنيات الذكاء الاصطناعي المتقدمة والمعومات الموثوقة
              </p>
              <div className="government-badge pulse" role="region" aria-label="بيان رسمي">
                <i className="fas fa-star me-2"></i>
                منصة رسمية تابعة للحكومة المصرية
              </div>
            </div>
          </section>

          <section className="container" aria-labelledby="search-heading">
            <div className="search-container shadow-xl">
              <div className="text-center mb-5">
                <h2 className="h3 mb-3 fw-bold" id="search-heading">
                  <i className="fas fa-magnifying-glass me-3"></i> اسأل بذكاء، واحصل على إجابة
                </h2>
                <p className="text-muted lead">أدخل سؤالك أو الخبر المراد التحقق منه...</p>
              </div>
              <form onSubmit={handleSearch}>
                <div className="row g-4">
                  <div className="col-md-9">
                    <label htmlFor="search-input" className="visually-hidden">أدخل الخبر هنا</label>
                    <input
                      type="text"
                      id="search-input"
                      className="form-control search-input"
                      placeholder="مثال: ما هي آخر قرارات البنك المركزي؟"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      required
                      disabled={isSearching}
                    />
                  </div>
                  <div className="col-md-3">
                    <button 
                      type="submit" 
                      className="btn search-btn w-100"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          جاري البحث...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search me-2"></i>ابحث
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="fas fa-lock me-2"></i>
                  جميع عمليات البحث آمنة ومشفرة ومدعومة بتقنيات الأمان المتقدمة
                </small>
              </div>
            </div>
          </section>

          <section className="section-padding" id="features" aria-labelledby="features-heading">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold" id="features-heading">مميزات المنصة</h2>
                <p className="lead text-muted">تقنيات متقدمة لضمان دقة المعلومات وموضوعيتها</p>
              </div>
              <div className="row g-5">
                <div className="col-md-4">
                  <div className="feature-card rounded-lg h-100">
                    <div className="feature-icon"><i className="fas fa-robot"></i></div>
                    <h4 className="fw-bold">الذكاء الاصطناعي</h4>
                    <p className="text-muted mt-3">تحليل متقدم باستخدام خوارزميات الذكاء الاصطناعي المتقدمة للكشف عن الأخبار المضللة والتحقق من صحتها</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card rounded-lg h-100">
                    <div className="feature-icon"><i className="fas fa-bolt"></i></div>
                    <h4 className="fw-bold">سرعة فائقة</h4>
                    <p className="text-muted mt-3">نتائج فورية خلال ثوان مع تحليل شامل للمحتوى ومساءل المعلومات</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card rounded-lg h-100">
                    <div className="feature-icon"><i className="fas fa-certificate"></i></div>
                    <h4 className="fw-bold">موثوقية عالية</h4>
                    <p className="text-muted mt-3">دقة تصل إلى 95% في كشف الأخبار الكاذبة والمعلومات المضللة مع تقارير مفصلة</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="stats-section section-padding-sm" id="about" aria-labelledby="stats-heading">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold" id="stats-heading">إحصائيات المنصة</h2>
                <p className="lead text-muted">أرقام توضح ثقة الجمهور في المنصة وفعاليتها</p>
              </div>
              <div className="row g-4">
                <div className="col-md-3 col-6">
                  <div className="stat-card rounded-lg">
                    <span className="stat-number">250K+</span>
                    <p className="text-muted fw-bold">خبر تم التحقق منه</p>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="stat-card rounded-lg">
                    <span className="stat-number">95%</span>
                    <p className="text-muted fw-bold">دقة النتائج</p>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="stat-card rounded-lg">
                    <span className="stat-number">500K+</span>
                    <p className="text-muted fw-bold">مستخدم نشط</p>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="stat-card rounded-lg">
                    <span className="stat-number">24/7</span>
                    <p className="text-muted fw-bold">خدمة متواصلة</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section-padding bg-white" aria-labelledby="how-it-works-heading">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold" id="how-it-works-heading">كيف تعمل المنصة؟</h2>
                <p className="lead text-muted">خطوات بسيطة وسهلة للتحقق من صحة الأخبار والمعلومات</p>
              </div>
              <div className="row g-5">
                <div className="col-md-4 text-center step-card">
                  <div className="step-1">
                    <div className="step-icon">1</div>
                  </div>
                  <h4 className="mt-4 fw-bold">أدخل النص</h4>
                  <p className="text-muted mt-3">اكتب عنوان الخبر أو النص المراد التحقق منه في مربع البحث</p>
                </div>
                <div className="col-md-4 text-center step-card">
                  <div className="step-2">
                    <div className="step-icon">2</div>
                  </div>
                  <h4 className="mt-4 fw-bold">التحليل الذكي</h4>
                  <p className="text-muted mt-3">يقوم النظام بتحليل النص باستخدام خوارزميات الذكاء الاصطناعي المتقدمة</p>
                </div>
                <div className="col-md-4 text-center step-card">
                  <div className="step-3">
                    <div className="step-icon">3</div>
                  </div>
                  <h4 className="mt-4 fw-bold">النتيجة الفورىة</h4>
                  <p className="text-muted mt-3">احصل على تقرير مفصل حول مدى صحة الخبر مع التوضيحات اللازمة</p>
                </div>
              </div>
            </div>
          </section>

          <section className="section-padding bg-light" id="contact" aria-labelledby="contact-heading">
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold" id="contact-heading">تواصل معنا</h2>
                <p className="lead text-muted">نحن هنا لمساعدتك في أي استفسار أو ملاحظة</p>
              </div>
              <div className="row g-4 justify-content-center">
                <div className="col-md-4">
                  <div className="feature-card rounded-lg h-100">
                    <i className="fas fa-phone-alt text-primary fs-1 mb-4"></i>
                    <h5 className="fw-bold">الهاتف</h5>
                    <p className="text-muted fs-5">16000</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card rounded-lg h-100">
                    <i className="fas fa-envelope text-success fs-1 mb-4"></i>
                    <h5 className="fw-bold">البريد الإلكتروني</h5>
                    <p className="text-muted fs-5">info@sadeq.gov.eg</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card rounded-lg h-100">
                    <i className="fas fa-map-marker-alt text-danger fs-1 mb-4"></i>
                    <h5 className="fw-bold">العنوان</h5>
                    <p className="text-muted fs-5">القاهرة، الحكومة المصرية</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className={`page-transition ${page === 'results' ? 'active' : ''}`} style={{ display: page === 'results' ? 'block' : 'none' }}>
        <AiSearchResultsPage 
          query={query} 
          result={aiSearchResult} 
          onBack={() => setPage('home')} 
          isSearching={isSearching}
        />
      </div>

      <footer className="footer mt-auto" role="contentinfo">
        <div className="footer-wave"></div>
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4 col-md-12">
              <div className="d-flex align-items-center mb-4">
                <div className="logo-placeholder me-4">
                  <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="45" cy="45" r="45" fill="url(#footerGradient)" />
                    <path 
                      d="M30 45L40 55L60 35" 
                      stroke="white" 
                      strokeWidth="6" 
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
                  <h4 className="mb-2">منصة صادق</h4>
                  <p className="text-muted mb-0">الحكومة المصرية</p>
                </div>
              </div>
              <p className="text-muted lead">
                منصة رسمية تابعة للحكومة المصرية لمكافحة الأخبار الكاذبة والمعلومات المضللة وتعزيز الثقة في المعلومات.
              </p>
            </div>
            <div className="col-lg-2 col-md-4 col-6">
              <h5 className="fw-bold mb-4">روابط سريعة</h5>
              <div className="footer-links">
                <a href="#home" onClick={(e) => { e.preventDefault(); setPage('home'); }}>الرئيسية</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>حول المنصة</a>
                <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>المميزات</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>اتصل بنا</a>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-6">
              <h5 className="fw-bold mb-4">الخدمات</h5>
              <div className="footer-links">
                <a href="#search-heading" onClick={(e) => { e.preventDefault(); document.querySelector('.search-container')?.scrollIntoView({ behavior: 'smooth' }); }}>كشف الأخبار الكاذبة</a>
                <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>تحليل المحتوى</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>الإحصائيات</a>
              </div>
            </div>
            <div className="col-lg-3 col-md-4">
              <h5 className="fw-bold mb-4">تابعنا</h5>
              <div className="social-links mb-4">
                <a href="#" aria-label="صفحة فيسبوك"><i className="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="حساب تويتر"><i className="fab fa-twitter"></i></a>
                <a href="#" aria-label="حساب انستغرام"><i className="fab fa-instagram"></i></a>
                <a href="#" aria-label="قناة يوتيوب"><i className="fab fa-youtube"></i></a>
              </div>
              <p className="text-muted small">
                <i className="fas fa-copyright me-1"></i> 2024 جميع الحقوق محفوظة - الحكومة المصرية
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}