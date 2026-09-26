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
import PolicyPage from './pages/PolicyPage';
import AdminPage from './pages/AdminPage';
import { useProducts } from './hooks/useProducts';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null); // 'frames' | 'magazines' | 'hampers' | 'addons' | 'general' | null
  const [isPolicyView, setIsPolicyView] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  // Dynamic real-time products hook from Supabase
  const { products: dynamicProducts, isUsingSupabase, refreshProducts } = useProducts();

  // Synchronize with URL hash & path routing for direct links, /admin & browser back button
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash || '';
      const pathname = window.location.pathname || '';
      const search = window.location.search || '';

      const isAdmin =
        hash.toLowerCase().includes('admin') ||
        pathname.toLowerCase().includes('admin') ||
        search.toLowerCase().includes('admin');

      if (isAdmin) {
        setIsAdminView(true);
        setIsPolicyView(false);
        setActiveCategory(null);
        return;
      }

      if (hash.startsWith('#category/')) {
        const cat = hash.replace('#category/', '').trim().toLowerCase();
        if (['frames', 'magazines', 'hampers', 'addons', 'general'].includes(cat)) {
          setActiveCategory(cat);
          setIsPolicyView(false);
          setIsAdminView(false);
          return;
        }
      }
      if (hash === '#collection') {
        setActiveCategory('frames');
        setIsPolicyView(false);
        setIsAdminView(false);
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
        setIsAdminView(false);
        return;
      }

      setActiveCategory(null);
      setIsPolicyView(false);
      setIsAdminView(false);
    };

    // Check on mount
    handleRouteChange();

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const navigateToCategory = (catId) => {
    setIsAdminView(false);
    setIsPolicyView(false);
    setActiveCategory(catId);
    window.location.hash = `#category/${catId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setIsAdminView(false);
    setIsPolicyView(false);
    setActiveCategory(null);
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setIsPolicyView(false);
    setActiveCategory(null);
    setIsAdminView(true);
    window.location.hash = '#admin';
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

  if (isAdminView) {
    return (
      <AdminPage onBackToStore={navigateToHome} />
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col selection:bg-blush selection:text-burgundy-deep">
      {/* Navigation Bar */}
      <Navbar
        onNavigateHome={navigateToHome}
        onNavigateCategories={navigateToCategoriesOverview}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
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
            allProducts={dynamicProducts}
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
      <Footer onNavigateAdmin={navigateToAdmin} />

      {/* Floating Action Button */}
      <FloatingWhatsApp />

      {/* Interactive Customization & Checkout Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenCancellationPolicy={openCancellationPolicy}
        />
      )}
    </div>
  );
}
