import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import ReviewSection from './components/ReviewSection';
import CtaStrip from './components/CtaStrip';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ProductModal from './components/ProductModal';
import AdminModal from './components/AdminModal';
import CategoryPage from './pages/CategoryPage';
import PolicyPage from './pages/PolicyPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import { ProductProvider } from './context/ProductContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // 'frames' | 'magazines' | 'hampers' | 'addons' | 'general' | null
  const [isPolicyView, setIsPolicyView] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Synchronize with URL hash routing for direct links & browser back button
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash.startsWith('#admin')) {
        setIsAdminOpen(true);
        return;
      }
      if (hash.startsWith('#category/')) {
        const cat = hash.replace('#category/', '').trim().toLowerCase();
        if (['frames', 'magazines', 'hampers', 'addons', 'general'].includes(cat)) {
          setActiveCategory(cat);
          setIsPolicyView(false);
          return;
        }
      }
      if (hash === '#collection') {
        setActiveCategory('frames');
        setIsPolicyView(false);
        return;
      }
      if (
        hash === '#policy/cancellation' ||
        hash === '#cancellation-policy' ||
        hash === '#policy' ||
        hash === '#return-policy'
      ) {
        setIsPolicyView(true);
        setActiveCategory(null);
        return;
      }
      setActiveCategory(null);
      setIsPolicyView(false);
    };

    // Check on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  /**
   * Redirect to the standalone /admin-login page.
   * Uses a real path navigation so it's fully separate from the public site.
   */
  const navigateToAdminLogin = () => {
    window.location.href = '/admin-login';
  };

  const navigateToCategory = (catId) => {
    setIsPolicyView(false);
    setActiveCategory(catId);
    window.location.hash = `#category/${catId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setIsPolicyView(false);
    setActiveCategory(null);
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategoriesOverview = () => {
    navigateToCategory('frames');
  };

  const openCancellationPolicy = () => {
    setSelectedProduct(null);
    setIsPolicyView(true);
    window.location.hash = '#policy/cancellation';
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <ErrorBoundary>
          {isPolicyView ? (
            /* Dedicated Detailed Return & Cancellation Policy Section */
            <PolicyPage
              onBack={() => {
                if (activeCategory) {
                  navigateToCategory(activeCategory);
                } else {
                  navigateToHome();
                }
              }}
              onNavigateCategories={navigateToCategoriesOverview}
            />
          ) : activeCategory ? (
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
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Button */}
      <FloatingWhatsApp />

      {/* Interactive Customization & Checkout Modal */}
      {selectedProduct && (
        <ErrorBoundary>
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onOpenCancellationPolicy={openCancellationPolicy}
          />
        </ErrorBoundary>
      )}

      {/*
        Protected Admin Dashboard — only mount when the admin is actively
        trying to open the panel. This prevents the session check from
        firing on every normal page load and accidentally redirecting
        visitors to the login page.
      */}
      {isAdminOpen && (
        <ErrorBoundary>
          <ProtectedAdminRoute onUnauthenticated={navigateToAdminLogin}>
            <AdminModal
              isOpen={isAdminOpen}
              onClose={() => {
                setIsAdminOpen(false);
                if (window.location.hash === '#admin') {
                  window.location.hash = activeCategory ? `#category/${activeCategory}` : '#home';
                }
              }}
            />
          </ProtectedAdminRoute>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ProductProvider>
      <AppContent />
    </ProductProvider>
  );
}
