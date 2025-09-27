import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Statistics from "./components/Statistics";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import ContactPage from './components/ContactPage';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="font-sans bg-gray-50 text-gray-900">
          <Navbar />
          <Hero />
          <Statistics />
          <HowItWorks />
          <Footer />
        </div>
      )}
    </>
  );

 return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
  }
export default App;
