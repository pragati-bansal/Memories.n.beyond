import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import ReviewSection from './components/ReviewSection';
import CtaStrip from './components/CtaStrip';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ProductModal from './components/ProductModal';
import CategoryPage from './pages/CategoryPage';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // 'frames' | 'magazines' | 'hampers' | 'addons' | null

  // Synchronize with URL hash routing for direct links & browser back button
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#category/')) {
        const cat = hash.replace('#category/', '').trim().toLowerCase();
        if (['frames', 'magazines', 'hampers', 'addons'].includes(cat)) {
          setActiveCategory(cat);
          return;
        }
      }
      if (hash === '#collection') {
        setActiveCategory('frames');
        return;
      }
      setActiveCategory(null);
    };

    // Check on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToCategory = (catId) => {
    setActiveCategory(catId);
    window.location.hash = `#category/${catId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setActiveCategory(null);
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategoriesOverview = () => {
    navigateToCategory('frames');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col selection:bg-blush selection:text-burgundy-deep">
      {/* Navigation Bar */}
      <Navbar
        onNavigateHome={navigateToHome}
        onNavigateCategories={navigateToCategoriesOverview}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {activeCategory ? (
          /* Dedicated Full Web Page for the chosen Category */
          <CategoryPage
            categoryId={activeCategory}
            onSelectCategory={navigateToCategory}
            onBackToHome={navigateToHome}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        ) : (
          /* Home Page Experience */
          <>
            <HeroSection onNavigateToCategory={navigateToCategory} />
            <HowItWorks />
            <ReviewSection />
            <CtaStrip />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Button */}
      <FloatingWhatsApp />

      {/* Interactive Customization & Checkout Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
