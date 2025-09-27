import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';
import AboutPage from './pages/About-us';
import ContactPage from './pages/Contact';
import Faq from './pages/faq';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddNews from './components/AddNews';
import EditNews from './components/EditNews';
import Reports from './components/Reports';
import { isAuthenticated } from './auth';
import Report from './pages/report';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css'; 

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/report" element={<Report />} />
        <Route path="/dashboard" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-news" element={<PrivateRoute><AddNews /></PrivateRoute>} />
        <Route path="/edit-news/:id" element={<PrivateRoute><EditNews /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
