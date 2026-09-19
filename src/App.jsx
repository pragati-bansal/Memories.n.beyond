import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProductGrid from './components/ProductGrid';
import HowItWorks from './components/HowItWorks';
import ReviewSection from './components/ReviewSection';
import CtaStrip from './components/CtaStrip';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ProductModal from './components/ProductModal';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="min-h-screen bg-cream flex flex-col selection:bg-blush selection:text-burgundy-deep">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <HeroSection />
        <ProductGrid onSelectProduct={(product) => setSelectedProduct(product)} />
        <HowItWorks />
        <ReviewSection />
        <CtaStrip />
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
