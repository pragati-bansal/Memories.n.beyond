import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  UploadCloud,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Image as ImageIcon,
  LogOut,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  supabase,
  isSupabaseConfigured,
  uploadProductImage,
  insertProductToSupabase,
  deleteProductFromSupabase,
  fetchProductsFromSupabase,
} from '../lib/supabaseClient';
import { initialProducts } from '../data/initialProducts';

const DEFAULT_PIN = 'admin123';
const PIN_STORAGE_KEY = 'm_b_admin_session_auth';

const CATEGORIES = [
  { id: 'frames', label: '1. Frames' },
  { id: 'magazines', label: '2. Magazines' },
  { id: 'hampers', label: '3. Hampers' },
  { id: 'addons', label: '4. Add ons' },
  { id: 'general', label: '5. Generalised Gifts' },
];

export default function AdminPage({ onBackToStore }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Product Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('frames');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Status & List States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [productsList, setProductsList] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const fileInputRef = useRef(null);

  // Check persisted session authentication
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(PIN_STORAGE_KEY);
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch products once authenticated
  const loadAdminProducts = async () => {
    setIsLoadingProducts(true);
    try {
      if (isSupabaseConfigured) {
        const rows = await fetchProductsFromSupabase();
        setProductsList(rows || []);
      } else {
        setProductsList([]);
      }
    } catch (err) {
      console.error('Failed to load products for admin:', err);
      setFeedback({
        type: 'error',
        message: 'Could not fetch products from Supabase. ' + (err.message || ''),
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminProducts();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem(PIN_STORAGE_KEY, 'true');
      setPinError('');
    } else {
      setPinError('Incorrect PIN code. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(PIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (!title.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a product title.' });
      return;
    }
    if (!price || Number(price) <= 0) {
      setFeedback({ type: 'error', message: 'Please specify a valid price in ₹.' });
      return;
    }
    if (!imageFile && !imagePreview) {
      setFeedback({ type: 'error', message: 'Please select a product image.' });
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = '';

      if (imageFile) {
        setFeedback({ type: 'info', message: 'Uploading image to Supabase Storage...' });
        finalImageUrl = await uploadProductImage(imageFile);
      } else if (imagePreview) {
        finalImageUrl = imagePreview;
      }

      setFeedback({ type: 'info', message: 'Saving product details to database...' });
      await insertProductToSupabase({
        title,
        price: Number(price),
        category,
        description,
        image_url: finalImageUrl,
      });

      // Reset form
      setTitle('');
      setPrice('');
      setCategory('frames');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setFeedback({
        type: 'success',
        message: `Product "${title}" published successfully to Supabase!`,
      });

      await loadAdminProducts();
    } catch (err) {
      console.error('Error creating product:', err);
      setFeedback({
        type: 'error',
        message: 'Failed to create product: ' + (err.message || 'Unknown error'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, prodTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${prodTitle}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await deleteProductFromSupabase(id);
      setFeedback({
        type: 'success',
        message: `Product "${prodTitle}" deleted successfully.`,
      });
      await loadAdminProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setFeedback({
        type: 'error',
        message: 'Failed to delete product: ' + (err.message || ''),
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Seed default items helper for quick initial setup
  const handleSeedDefaults = async () => {
    const confirmSeed = window.confirm(
      'This will batch upload default products into your Supabase `products` table. Proceed?'
    );
    if (!confirmSeed) return;

    setIsSeeding(true);
    setFeedback({ type: 'info', message: 'Seeding initial products to Supabase...' });
    try {
      let count = 0;
      for (const p of initialProducts) {
        const imageUrl = p.images?.[0] || '';
        await insertProductToSupabase({
          title: p.title,
          price: p.price,
          category: p.category,
          description: p.description,
          image_url: typeof imageUrl === 'string' && imageUrl.startsWith('http') ? imageUrl : '',
        });
        count++;
      }
      setFeedback({
        type: 'success',
        message: `Successfully seeded ${count} products into Supabase!`,
      });
      await loadAdminProducts();
    } catch (err) {
      console.error('Error seeding products:', err);
      setFeedback({
        type: 'error',
        message: 'Seeding error: ' + (err.message || ''),
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // ================= 1. PIN AUTHENTICATION PROMPT =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-paper rounded-3xl p-8 border border-burgundy/15 shadow-craft-modal">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-burgundy-deep">
              Admin Access
            </h1>
            <p className="text-xs text-ink-soft mt-1">
              Enter your admin PIN to access the product management dashboard.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                Security PIN Code
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: admin123)"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-burgundy/20 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-burgundy text-burgundy-deep font-mono tracking-widest text-center text-lg"
              />
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-burgundy text-cream font-bold text-sm hover:bg-burgundy-deep transition-all shadow-craft-soft flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-burgundy/10 text-center">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-xs font-semibold text-rose-deep hover:text-burgundy-deep inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. AUTHENTICATED DASHBOARD =================
  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Top Header Bar */}
      <header className="bg-cream-deep/80 border-b border-burgundy/15 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-full bg-paper border border-burgundy/15 text-burgundy-deep font-bold text-xs hover:bg-burgundy hover:text-cream transition-all inline-flex items-center gap-1.5 shadow-craft-soft"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
            <div className="h-5 w-px bg-burgundy/15 hidden sm:block" />
            <div>
              <h1 className="font-serif text-lg font-bold text-burgundy-deep leading-tight">
                Catalogue Manager
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-deep">
                Memories n Beyond / Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                isSupabaseConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local Fallback'}</span>
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-paper border border-burgundy/15 text-burgundy font-bold text-xs hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all inline-flex items-center gap-1.5 shadow-craft-soft"
              title="Lock Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock / Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Feedback Alert Banner */}
        {feedback.message && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all ${
              feedback.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : feedback.type === 'info'
                ? 'bg-sky-50 border-sky-200 text-sky-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'error' ? (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback({ type: '', message: '' })}
              className="text-xs underline opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section 1: Product Upload Form */}
        <div className="bg-paper rounded-3xl p-6 sm:p-8 border border-burgundy/15 shadow-craft-modal">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 pb-4 border-b border-burgundy/10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h2 className="font-serif text-xl font-bold text-burgundy-deep">
                  Add New Product
                </h2>
              </div>
              <p className="text-xs text-ink-soft mt-1">
                Upload image to Supabase bucket <code className="bg-cream px-1.5 py-0.5 rounded text-burgundy font-mono text-[11px]">product-images</code> and insert into <code className="bg-cream px-1.5 py-0.5 rounded text-burgundy font-mono text-[11px]">products</code> table.
              </p>
            </div>

            {productsList.length === 0 && isSupabaseConfigured && (
              <button
                type="button"
                onClick={handleSeedDefaults}
                disabled={isSeeding}
                className="px-3.5 py-2 rounded-full bg-blush/60 hover:bg-blush text-burgundy-deep text-xs font-bold transition-all border border-burgundy/20 inline-flex items-center gap-1.5 shadow-craft-soft"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-deep" />
                <span>{isSeeding ? 'Seeding catalogue...' : 'Seed Default Catalogue (15 Items)'}</span>
              </button>
            )}
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Text fields */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Vintage Heart Floral Frame"
                    className="w-full px-4 py-2.5 rounded-xl border border-burgundy/20 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-burgundy text-burgundy-deep text-sm"
                  />
                </div>

                {/* Price & Category in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 499"
                      className="w-full px-4 py-2.5 rounded-xl border border-burgundy/20 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-burgundy text-burgundy-deep text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-burgundy/20 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-burgundy text-burgundy-deep text-sm font-semibold cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the keepsake, materials, handcrafting details, and packaging..."
                    className="w-full px-4 py-2.5 rounded-xl border border-burgundy/20 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-burgundy text-burgundy-deep text-sm leading-relaxed"
                  />
                </div>
              </div>

              {/* Right Column: Image Upload & Live Preview */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                  Product Image *
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] ${
                    imagePreview
                      ? 'border-burgundy/40 bg-paper'
                      : 'border-burgundy/25 bg-cream/40 hover:bg-cream/70 hover:border-burgundy/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="w-32 h-40 rounded-xl overflow-hidden shadow-craft-soft border border-burgundy/15 relative group">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs text-rose-deep font-semibold">
                        {imageFile?.name || 'Selected image'}
                      </div>
                      <span className="text-[11px] text-ink-soft bg-paper px-3 py-1 rounded-full border border-burgundy/15">
                        Click to change image
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-burgundy-deep">
                        Click to select image file
                      </div>
                      <div className="text-xs text-ink-soft max-w-xs">
                        JPG, PNG, or WebP. The file will be uploaded automatically to Supabase storage.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-burgundy/10 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full bg-burgundy text-cream font-bold text-sm hover:bg-burgundy-deep transition-all shadow-craft-soft disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Publishing to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Publish Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Manage Existing Products List */}
        <div className="bg-paper rounded-3xl p-6 sm:p-8 border border-burgundy/15 shadow-craft-modal">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 pb-4 border-b border-burgundy/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-xl font-bold text-burgundy-deep">
                Live Supabase Products ({productsList.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={loadAdminProducts}
              disabled={isLoadingProducts}
              className="px-3 py-1.5 rounded-full bg-paper border border-burgundy/15 text-burgundy-deep font-semibold text-xs hover:bg-cream transition-all inline-flex items-center gap-1.5 shadow-craft-soft self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
              <span>Refresh List</span>
            </button>
          </div>

          {isLoadingProducts ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 mx-auto text-burgundy animate-spin" />
              <p className="text-sm font-semibold text-ink-soft">
                Loading products from Supabase...
              </p>
            </div>
          ) : productsList.length === 0 ? (
            <div className="py-16 text-center space-y-3 border-2 border-dashed border-burgundy/15 rounded-2xl bg-cream/30">
              <Package className="w-10 h-10 mx-auto text-rose-deep opacity-60" />
              <h3 className="font-serif text-base font-bold text-burgundy-deep">
                No products found in Supabase table
              </h3>
              <p className="text-xs text-ink-soft max-w-md mx-auto">
                Use the form above to add your first product, or click "Seed Default Catalogue" to populate all 15 default showcase items.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productsList.map((prod) => {
                const isDeleting = deletingId === prod.id;
                return (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl border border-burgundy/10 bg-cream/20 hover:bg-cream/50 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-blush/40 border border-burgundy/10 shrink-0 flex items-center justify-center">
                        {prod.image_url ? (
                          <img
                            src={prod.image_url}
                            alt={prod.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-rose-deep opacity-50" />
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-burgundy/10 text-burgundy inline-block mb-1">
                          {prod.category}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-burgundy-deep truncate">
                          {prod.title}
                        </h4>
                        <div className="font-bold text-sm text-burgundy mt-0.5">
                          ₹{prod.price}
                        </div>
                        <p className="text-[11px] text-ink-soft line-clamp-2 mt-1 leading-snug">
                          {prod.description || 'No description'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-burgundy/10 flex items-center justify-between">
                      <span className="text-[10px] text-ink-soft font-mono">
                        ID: {String(prod.id).slice(0, 8)}...
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id, prod.title)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 text-xs font-bold transition-all inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
