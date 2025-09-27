import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    
    setIsSearching(true);
    
    const API_URL = `http://127.0.0.1:8000/api/search`; 

    try {
        const response = await axios.get(API_URL, {
            params: { q: query }
        });
        
        // redirect to the search results page with the results data
        navigate('/results', { state: { query, results: response.data } });

    } catch (error) {
        console.error('Error fetching data from API:', error);
        alert('عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى التأكد من أن خادم Laravel يعمل.');
    } finally {
        setIsSearching(false);
    }
  };

  return (
    <main>
      <section className="hero-section" id="home" aria-labelledby="hero-title">
        <div className="container text-center hero-content">
          <h1 className="hero-title mb-3" id="hero-title">
            <i className="fas fa-question-square me-3" aria-hidden="true"></i>
            منصة صادق
          </h1>
          <p className="hero-subtitle mb-4">تحقق من صحة الأخبار والمعلومات بتقنيات الذكاء الاصطناعي المتطورة</p>
          <div className="government-badge" role="region" aria-label="بيان رسمي">
            <i className="fas fa-star me-2" aria-hidden="true"></i>
            منصة رسمية تابعة للحكومة المصرية
          </div>
        </div>
      </section>

      <section className="container" aria-labelledby="search-heading">
        <div className="search-container shadow-lg-custom">
          <div className="text-center mb-4">
            <h2 className="h3 mb-3 fw-bold" id="search-heading"><i className="fas fa-magnifying-glass me-2" aria-hidden="true"></i> تحقق من الخبر الآن</h2>
            <p className="text-muted">أدخل عنوان الخبر أو النص المراد التحقق من صحته</p>
          </div>
          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-9">
                <label htmlFor="search-input" className="visually-hidden">أدخل الخبر هنا</label>
                <input
                  type="text"
                  id="search-input"
                  className="form-control search-input"
                  placeholder="اكتب عنوان الخبر أو النص المراد التحقق منه..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                  disabled={isSearching}
                />
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn search-btn w-100" disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search me-2" aria-hidden="true"></i>تحقق الآن
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="fas fa-lock me-1" aria-hidden="true"></i>
              جميع عمليات البحث آمنة ومشفرة
            </small>
          </div>
        </div>
      </section>

      {/* Other sections of the homepage */}
      {/* ... يمكنك نسخ باقي الأقسام هنا */}
    </main>
  );
};

export default Home;