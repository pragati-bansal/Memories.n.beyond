import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit3,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles,
  Package,
  Layers,
  RotateCcw,
  Search,
  ArrowRight,
  Eye,
  ShieldAlert,
  Tag,
  IndianRupee,
  LogOut,
  Filter,
  Star,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { uploadCustomerPhoto } from '../lib/supabaseClient';
import { logger } from '../lib/logger';
import { newProductSubmissionSchema, getFirstZodErrorMessage } from '../lib/validation';
import ImageWithFallback from './ImageWithFallback';

const CATEGORIES = [
  { id: 'frames', label: 'Frames', defaultTag: 'Custom Frame' },
  { id: 'magazines', label: 'Magazines', defaultTag: 'Photo Magazine' },
  { id: 'hampers', label: 'Hampers', defaultTag: 'Luxury Hamper' },
  { id: 'addons', label: 'Add ons', defaultTag: 'Handmade Add-on' },
  { id: 'general', label: 'Generalised Gifts', defaultTag: 'Curated Combo' },
];

const PRESET_SIZES = [
  { size: '4x4', label: '4x4 in (Mini Square)' },
  { size: '5x7', label: '5x7 in (Tabletop)' },
  { size: 'A4', label: 'A4 Size (8.3 x 11.7 in)' },
  { size: '18x24', label: '18x24 in (Grand)' },
  { size: 'Standard', label: 'Standard Single Size' },
];

// Category based image limit helper: Magazines allows 15 images; all others allow 5 images
const getImageLimit = (categoryId) => (categoryId === 'magazines' ? 15 : 5);

// Admin Passcode: change here or set VITE_ADMIN_PIN in your .env file
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || 'admin123';

export default function AdminModal({ isOpen, onClose }) {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToOriginalProducts,
  } = useProducts();

  // Auth State & Rate Limiting
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return Number(sessionStorage.getItem('mnb_admin_failed_attempts') || 0);
  });
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Check and update lockout countdown
  useEffect(() => {
    const lockoutEnd = Number(sessionStorage.getItem('mnb_admin_lockout_until') || 0);
    const now = Date.now();
    if (lockoutEnd > now) {
      setLockoutTimer(Math.ceil((lockoutEnd - now) / 1000));
    }

    const interval = setInterval(() => {
      const activeLockout = Number(sessionStorage.getItem('mnb_admin_lockout_until') || 0);
      const remaining = Math.ceil((activeLockout - Date.now()) / 1000);
      if (remaining > 0) {
        setLockoutTimer(remaining);
      } else {
        setLockoutTimer(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Navigation State: 'list' | 'form' | 'settings'
  const [activeTab, setActiveTab] = useState('list');
  
  // Edit mode tracking
  const [editingProductId, setEditingProductId] = useState(null);

  // Search & Filter in list view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('frames');
  const [tag, setTag] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState(['5x7', 'A4']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  
  // Multi-Image State
  const [imageMode, setImageMode] = useState('file'); // 'file' | 'url'
  const [imagesList, setImagesList] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Customization Options
  const [requiresPhoto, setRequiresPhoto] = useState(true);
  const [maxPhotos, setMaxPhotos] = useState(4);
  const [requiresText, setRequiresText] = useState(true);
  const [requiresDate, setRequiresDate] = useState(false);
  const [detailsText, setDetailsText] = useState('');

  // Notifications & Confirmations
  const [feedbackMsg, setFeedbackMsg] = useState({ text: '', type: 'success' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const fileInputRef = useRef(null);

  const showToast = (text, type = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => {
      setFeedbackMsg({ text: '', type: 'success' });
    }, 3200);
  };

  // PIN authentication handler with Rate Limiting (max 5 attempts -> 30s cooldown)
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    if (pinInput.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError('');
      setPinInput('');
      setFailedAttempts(0);
      sessionStorage.removeItem('mnb_admin_failed_attempts');
      sessionStorage.removeItem('mnb_admin_lockout_until');
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      sessionStorage.setItem('mnb_admin_failed_attempts', String(nextAttempts));

      if (nextAttempts >= 5) {
        const cooldownMs = nextAttempts >= 10 ? 60000 : 30000;
        const lockoutUntil = Date.now() + cooldownMs;
        sessionStorage.setItem('mnb_admin_lockout_until', String(lockoutUntil));
        setLockoutTimer(Math.ceil(cooldownMs / 1000));
        setPinError(`Too many failed attempts. Locked out for ${Math.ceil(cooldownMs / 1000)} seconds.`);
      } else {
        const remaining = 5 - nextAttempts;
        setPinError(`Incorrect PIN. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining before temporary lockout.`);
      }
    }
  };

  // Reset form to empty values for "Add New Product"
  const initEmptyForm = () => {
    setEditingProductId(null);
    setTitle('');
    setCategory('frames');
    setTag('');
    setPrice('');
    setDescription('');
    setSelectedSizes(['5x7', 'A4']);
    setCustomSizeInput('');
    setImagesList([]);
    setUrlInput('');
    setRequiresPhoto(true);
    setMaxPhotos(4);
    setRequiresText(true);
    setRequiresDate(false);
    setDetailsText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveTab('form');
  };

  // Pre-fill form for "Edit Product"
  const startEditProduct = (product) => {
    setEditingProductId(product.id || product.slug);
    setTitle(product.title || '');
    const cat = product.category || 'frames';
    setCategory(cat);
    setTag(product.tag || '');
    setPrice(product.price ? String(product.price) : '');
    setDescription(product.description || '');
    
    // Extract sizes
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      setSelectedSizes(product.sizes.map((s) => s.size || s));
    } else {
      setSelectedSizes(['Standard']);
    }

    const currentImgs =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images.filter(Boolean)
        : product.imageUrl || product.image_url
        ? [product.imageUrl || product.image_url]
        : [];

    setImagesList(currentImgs);
    setUrlInput('');

    // Customization options
    setRequiresPhoto(product.customization_options?.requires_photo ?? true);
    setMaxPhotos(product.customization_options?.max_photos ?? 4);
    setRequiresText(product.customization_options?.requires_text ?? true);
    setRequiresDate(product.customization_options?.requires_date ?? false);

    // Details bullet points
    if (Array.isArray(product.details) && product.details.length > 0) {
      setDetailsText(product.details.join('\n'));
    } else {
      setDetailsText('');
    }

    setActiveTab('form');
  };

  // Handle Category Select with dynamic image limit enforcement
  const handleCategorySelect = (newCategory) => {
    setCategory(newCategory);
    const matched = CATEGORIES.find((c) => c.id === newCategory);
    if (matched && !tag) setTag(matched.defaultTag);

    const maxLimit = getImageLimit(newCategory);
    if (imagesList.length > maxLimit) {
      setImagesList((prev) => prev.slice(0, maxLimit));
      showToast(
        `⚠️ Switched to ${matched?.label || newCategory}: maximum limit is ${maxLimit} images. Extra images were trimmed.`,
        'info'
      );
    }
  };

  // Handle Multiple Image Files Selection
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxLimit = getImageLimit(category);
    const currentCount = imagesList.length;
    const availableSlots = maxLimit - currentCount;

    if (availableSlots <= 0) {
      showToast(
        `⚠️ Limit reached! Maximum ${maxLimit} images allowed for ${
          category === 'magazines' ? 'Magazines (Page Previews)' : 'this category'
        }.`,
        'error'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    let filesToProcess = files;
    if (files.length > availableSlots) {
      showToast(
        `⚠️ Only ${availableSlots} more image${availableSlots > 1 ? 's' : ''} allowed (Max ${maxLimit} for ${
          category === 'magazines' ? 'Magazines' : 'this category'
        }). Uploading first ${availableSlots}.`,
        'info'
      );
      filesToProcess = files.slice(0, availableSlots);
    }

    // Immediate local preview for all selected files
    const previewPromises = filesToProcess.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    const newPreviews = await Promise.all(previewPromises);
    setImagesList((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Upload to Supabase in background if configured
    try {
      setIsUploading(true);
      const uploadPromises = filesToProcess.map((file) => uploadCustomerPhoto(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      setImagesList((prev) => {
        const updated = [...prev];
        uploadedUrls.forEach((url, idx) => {
          if (url && typeof url === 'string' && url.startsWith('http')) {
            const targetIdx = currentCount + idx;
            if (targetIdx < updated.length) {
              updated[targetIdx] = url;
            }
          }
        });
        return updated;
      });
    } catch (err) {
      logger.warn('AdminModal', 'Supabase upload skipped or failed, using local Data URL preview', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Add Image via URL input
  const handleAddUrl = (e) => {
    e?.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    const maxLimit = getImageLimit(category);
    if (imagesList.length >= maxLimit) {
      showToast(
        `⚠️ Limit reached! Maximum ${maxLimit} images allowed for ${
          category === 'magazines' ? 'Magazines' : 'this category'
        }.`,
        'error'
      );
      return;
    }

    setImagesList((prev) => [...prev, trimmed]);
    setUrlInput('');
    showToast('Image URL added!');
  };

  // Remove specific image
  const handleRemoveImage = (indexToRemove) => {
    setImagesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Set selected image as Primary Cover (move to index 0)
  const handleSetCover = (index) => {
    if (index === 0) return;
    setImagesList((prev) => {
      const selected = prev[index];
      const remaining = prev.filter((_, idx) => idx !== index);
      return [selected, ...remaining];
    });
    showToast('⭐ Primary cover image updated!');
  };

  // Move image position
  const handleMoveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= imagesList.length) return;
    setImagesList((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  // Toggle Size selection
  const toggleSize = (sizeKey) => {
    if (selectedSizes.includes(sizeKey)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== sizeKey));
      }
    } else {
      setSelectedSizes([...selectedSizes, sizeKey]);
    }
  };

  // Add Custom Size
  const handleAddCustomSize = (e) => {
    e.preventDefault();
    const trimmed = customSizeInput.trim();
    if (trimmed && !selectedSizes.includes(trimmed)) {
      setSelectedSizes([...selectedSizes, trimmed]);
      setCustomSizeInput('');
    }
  };

  // Handle Save (Add or Update)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a product title.');
      return;
    }

    if (imagesList.length === 0) {
      alert('Please upload or add at least one product image.');
      return;
    }

    const maxLimit = getImageLimit(category);
    const finalImages = imagesList.slice(0, maxLimit);
    const finalImage =
      finalImages[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80';
    const numPrice = Number(price) || 299;
    const finalTag = tag.trim() || CATEGORIES.find((c) => c.id === category)?.defaultTag || 'Handmade Keepsake';

    // Format sizes
    const sizesArray = selectedSizes.map((s) => {
      const matched = PRESET_SIZES.find((ps) => ps.size === s);
      return {
        size: s,
        label: matched ? matched.label : `${s} Format`,
        price: numPrice,
      };
    });

    // Parse bullet details
    const parsedDetails = detailsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const productPayload = {
      title: title.trim(),
      category,
      tag: finalTag,
      price: numPrice,
      description: description.trim() || 'Artisan handcrafted memory keepsake tailored specifically for your special moments.',
      sizes: sizesArray,
      images: finalImages,
      imageUrl: finalImage,
      image_url: finalImage,
      requires_photo: requiresPhoto,
      max_photos: maxPhotos,
      requires_text: requiresText,
      requires_date: requiresDate,
      details: parsedDetails.length > 0 ? parsedDetails : undefined,
    };

    // Strict validation for new or edited product submissions
    const validation = newProductSubmissionSchema.safeParse(productPayload);
    if (!validation.success) {
      const errMsg = getFirstZodErrorMessage(validation.error, 'Please check product form inputs.');
      showToast(`⚠️ ${errMsg}`, 'error');
      logger.warn('AdminModal', 'Product validation failed', errMsg);
      return;
    }

    const validPayload = validation.data;

    if (editingProductId) {
      // Edit existing product
      updateProduct(editingProductId, validPayload);
      showToast(`✨ "${validPayload.title}" updated successfully!`);
    } else {
      // Add new product
      addProduct(validPayload);
      showToast(`🎉 "${validPayload.title}" added to catalogue!`);
    }

    setActiveTab('list');
    setEditingProductId(null);
  };

  // Delete product
  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    showToast('🗑️ Product deleted from catalogue.', 'info');
  };

  // Reset to original factory data
  const handleResetToDefault = () => {
    resetToOriginalProducts();
    setShowResetConfirm(false);
    showToast('🔄 Catalogue reset to original 12+ factory products.', 'info');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput('');
    setPinError('');
  };

  // Filtered product list for manager view
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-burgundy-deep/75 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative bg-paper rounded-3xl shadow-craft-modal border border-burgundy/20 max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col z-10 my-auto"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 bg-cream-deep/70 border-b border-burgundy/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-burgundy shadow-xs">
                {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-burgundy-deep flex items-center gap-2">
                  <span>Memories n Beyond Admin</span>
                  {isAuthenticated && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-burgundy text-cream px-2 py-0.5 rounded-full">
                      Product Editor
                    </span>
                  )}
                </h3>
                <p className="text-xs text-ink-soft">
                  {isAuthenticated
                    ? 'Full control: Edit, delete, add products & update pricing across entire store'
                    : 'Restricted administrative access'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 rounded-full hover:bg-blush text-ink-soft hover:text-burgundy transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-cream hover:bg-blush text-burgundy-deep flex items-center justify-center transition-transform hover:scale-110"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          {!isAuthenticated ? (
            /* =================== PIN ENTRY SCREEN =================== */
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-blush/80 border border-burgundy/15 flex items-center justify-center text-burgundy mb-5 shadow-craft-soft">
                <Lock className="w-8 h-8" />
              </div>

              <h4 className="font-serif text-2xl font-bold text-burgundy-deep mb-2">
                Enter Admin Passcode
              </h4>
              <p className="text-xs sm:text-sm text-ink-soft max-w-sm mb-6">
                Please enter your administrative PIN to unlock full catalogue management (edit, delete, add products).
              </p>

              <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-4">
                <div>
                  <input
                    type="password"
                    autoFocus
                    disabled={lockoutTimer > 0}
                    placeholder={lockoutTimer > 0 ? `Locked (${lockoutTimer}s)` : "Enter Admin PIN"}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError('');
                    }}
                    className={`w-full text-center tracking-widest text-lg font-bold px-4 py-3 rounded-2xl border outline-none text-burgundy-deep transition-all shadow-inner ${
                      lockoutTimer > 0
                        ? 'bg-cream/40 border-rose-300 opacity-60 cursor-not-allowed text-rose-deep'
                        : 'bg-cream border border-burgundy/20 focus:border-burgundy focus:ring-2 focus:ring-blush-deep/30'
                    }`}
                  />
                  {pinError && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-deep font-semibold justify-center mt-2 text-center">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{pinError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={lockoutTimer > 0}
                  className={`w-full py-3 rounded-2xl font-bold text-sm shadow-craft-soft transition-all flex items-center justify-center gap-2 ${
                    lockoutTimer > 0
                      ? 'bg-burgundy/50 text-cream/70 cursor-not-allowed'
                      : 'bg-burgundy hover:bg-burgundy-deep text-cream hover:shadow-craft-lg cursor-pointer'
                  }`}
                >
                  <Unlock className="w-4 h-4" />
                  <span>
                    {lockoutTimer > 0
                      ? `Locked (Retry in ${lockoutTimer}s)`
                      : 'Unlock Admin Panel'}
                  </span>
                </button>
              </form>
            </div>
          ) : (
            /* =================== AUTHENTICATED DASHBOARD =================== */
            <div className="flex-1 overflow-y-auto">
              {/* Navigation Tabs Bar */}
              <div className="px-6 pt-3 border-b border-burgundy/10 bg-paper sticky top-0 z-20 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setActiveTab('list');
                    }}
                    className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                      activeTab === 'list'
                        ? 'border-burgundy text-burgundy bg-cream/70'
                        : 'border-transparent text-ink-soft hover:text-burgundy-deep'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>All Products ({products.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={initEmptyForm}
                    className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                      activeTab === 'form' && !editingProductId
                        ? 'border-burgundy text-burgundy bg-cream/70'
                        : 'border-transparent text-ink-soft hover:text-burgundy-deep'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>

                  {editingProductId && activeTab === 'form' && (
                    <button
                      type="button"
                      className="px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 border-burgundy text-burgundy bg-cream/70"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Editing Item</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`px-3 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                      activeTab === 'settings'
                        ? 'border-burgundy text-burgundy bg-cream/70'
                        : 'border-transparent text-ink-soft hover:text-burgundy-deep'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Data</span>
                  </button>
                </div>

                <div className="text-xs font-bold text-burgundy-deep pb-2 hidden sm:block">
                  Total Active: {products.length} Items
                </div>
              </div>

              {/* Toast Feedback Notification */}
              {feedbackMsg.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mx-6 mt-4 p-3.5 rounded-2xl bg-blush/90 border border-burgundy/20 text-burgundy-deep font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-burgundy shrink-0" />
                  <span>{feedbackMsg.text}</span>
                </motion.div>
              )}

              {/* ================= TAB 1: ALL PRODUCTS MANAGEMENT LIST ================= */}
              {activeTab === 'list' && (
                <div className="p-6 sm:p-8 space-y-4">
                  {/* Search and Category Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-cream/50 p-3 rounded-2xl border border-burgundy/10">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                      <input
                        type="text"
                        placeholder="Search products by title or tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-paper border border-burgundy/15 text-xs text-burgundy-deep outline-none focus:border-burgundy"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-burgundy text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryFilter('all')}
                        className={`text-[11px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                          selectedCategoryFilter === 'all'
                            ? 'bg-burgundy text-cream shadow-xs'
                            : 'bg-paper text-ink-soft border border-burgundy/10 hover:border-burgundy/30'
                        }`}
                      >
                        All ({products.length})
                      </button>
                      {CATEGORIES.map((c) => {
                        const count = products.filter((p) => p.category === c.id).length;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCategoryFilter(c.id)}
                            className={`text-[11px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all ${
                              selectedCategoryFilter === c.id
                                ? 'bg-burgundy text-cream shadow-xs'
                                : 'bg-paper text-ink-soft border border-burgundy/10 hover:border-burgundy/30'
                            }`}
                          >
                            {c.label} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Product Cards Grid with Edit & Delete */}
                  {filteredProducts.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center">
                      <Package className="w-10 h-10 text-burgundy/50 mb-2" />
                      <p className="text-sm font-bold text-burgundy-deep">
                        No products found matching "{searchQuery}"
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategoryFilter('all');
                        }}
                        className="mt-3 text-xs font-bold text-burgundy hover:underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {filteredProducts.map((item) => {
                        const isConfirming = deleteConfirmId === item.id;
                        const itemImages =
                          Array.isArray(item.images) && item.images.length > 0
                            ? item.images.filter(Boolean)
                            : item.imageUrl || item.image_url
                            ? [item.imageUrl || item.image_url]
                            : [];
                        const displayImg = itemImages[0] || item.imageUrl || item.image_url;
                        const imageCount = itemImages.length;

                        return (
                          <div
                            key={item.id || item.slug}
                            className="bg-cream/60 hover:bg-cream rounded-2xl p-3.5 border border-burgundy/15 flex gap-3.5 items-start justify-between shadow-xs transition-all"
                          >
                            {/* Product Thumbnail & Details */}
                            <div className="flex gap-3 items-start flex-1 min-w-0">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-blush shrink-0 border border-burgundy/10 shadow-xs flex items-center justify-center relative">
                                {displayImg ? (
                                  <ImageWithFallback
                                    src={displayImg}
                                    alt={item.title ? `${item.title} catalogue thumbnail` : 'Catalogue thumbnail'}
                                    gradient={item.gradient || 'linear-gradient(150deg,#FFE5EC,#FB6F92 55%,#881337)'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-burgundy">MnB</span>
                                )}
                                {imageCount > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-burgundy-deep/90 text-cream text-[8px] font-bold px-1.5 py-0.2 rounded-tl-md">
                                    {imageCount} {item.category === 'magazines' ? 'p.' : 'imgs'}
                                  </span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                  <span className="text-[9px] uppercase font-bold tracking-wider text-rose-deep bg-blush/80 px-2 py-0.2 rounded-full">
                                    {item.category}
                                  </span>
                                  {item.tag && (
                                    <span className="text-[9px] text-ink-soft font-semibold truncate">
                                      {item.tag}
                                    </span>
                                  )}
                                </div>

                                <h5 className="font-serif text-sm font-bold text-burgundy-deep truncate">
                                  {item.title}
                                </h5>

                                <div className="font-bold text-xs text-burgundy mt-0.5">
                                  ₹{item.price}
                                </div>

                                <div className="text-[10px] text-ink-soft truncate mt-0.5">
                                  Sizes: {item.sizes?.map((s) => s.size || s).join(', ') || 'Standard'}
                                </div>
                              </div>
                            </div>

                            {/* Actions Column: Edit & Delete */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              {isConfirming ? (
                                <div className="flex flex-col gap-1 items-end">
                                  <span className="text-[9px] font-bold text-burgundy">Delete?</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(item.id)}
                                      className="px-2 py-0.5 rounded-lg bg-burgundy text-cream text-[10px] font-bold shadow-xs hover:bg-burgundy-deep"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeleteConfirmId(null)}
                                      className="px-2 py-0.5 rounded-lg bg-paper text-ink-soft text-[10px] font-semibold border border-burgundy/15"
                                    >
                                      No
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => startEditProduct(item)}
                                    className="p-1.5 rounded-xl bg-paper hover:bg-blush text-burgundy-deep border border-burgundy/15 transition-all text-xs flex items-center gap-1 font-semibold"
                                    title="Edit Product"
                                  >
                                    <Edit3 className="w-3.5 h-3.5 text-burgundy" />
                                    <span className="text-[10px]">Edit</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(item.id)}
                                    className="p-1.5 rounded-xl bg-paper hover:bg-rose-50 text-rose-deep border border-burgundy/15 transition-all"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-burgundy" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 2: PRODUCT EDITOR (ADD & EDIT) ================= */}
              {activeTab === 'form' && (
                <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-burgundy/10">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-burgundy-deep flex items-center gap-2">
                        {editingProductId ? (
                          <>
                            <Edit3 className="w-4 h-4 text-burgundy" />
                            <span>Edit Product: {title || 'Untitled'}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 text-burgundy" />
                            <span>Add New Product to Catalogue</span>
                          </>
                        )}
                      </h4>
                      <p className="text-xs text-ink-soft">
                        {editingProductId
                          ? 'Modifications will immediately update the customer-facing catalogue and pricing.'
                          : 'New product will be instantly added to your live store.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingProductId(null);
                        setActiveTab('list');
                      }}
                      className="text-xs font-semibold text-ink-soft hover:text-burgundy underline"
                    >
                      Cancel &amp; Return to List
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Basic Details */}
                    <div className="space-y-4">
                      {/* Product Title */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                          Product Title <span className="text-rose-deep">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. B&W Pop-up Frame, Forever Flower Bouquet"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-cream border border-burgundy/20 focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-sm text-burgundy-deep transition-all"
                        />
                      </div>

                      {/* Category Selector */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                          Category <span className="text-rose-deep">*</span>
                        </label>
                        <select
                          value={category}
                          onChange={(e) => handleCategorySelect(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-cream border border-burgundy/20 focus:border-burgundy outline-none text-sm font-semibold text-burgundy-deep transition-all"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label} (Max {getImageLimit(cat.id)} images)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Short Tagline */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                          Short Tagline / Badge
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. B&W POP-UP, 4x4 Mini Popup, Curated Combo"
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-cream border border-burgundy/20 focus:border-burgundy outline-none text-sm text-burgundy-deep transition-all"
                        />
                      </div>

                      {/* Base Price */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                          Base Price (₹) <span className="text-rose-deep">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-burgundy font-bold text-sm">
                            ₹
                          </span>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="399"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-cream border border-burgundy/20 focus:border-burgundy outline-none text-sm font-bold text-burgundy-deep transition-all"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                          Product Description
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Monochrome minimalist elegance with 3D pop-up photo cutouts, waterproof archival matte prints..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-cream border border-burgundy/20 focus:border-burgundy outline-none text-xs sm:text-sm text-burgundy-deep transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Right Column: Sizes, Images & Highlights */}
                    <div className="space-y-4">
                      {/* Available Sizes Selector */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1.5">
                          Available Sizes / Formats
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {PRESET_SIZES.map((ps) => {
                            const isSelected = selectedSizes.includes(ps.size);
                            return (
                              <button
                                key={ps.size}
                                type="button"
                                onClick={() => toggleSize(ps.size)}
                                className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-all flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-burgundy text-cream border-burgundy shadow-xs'
                                    : 'bg-cream text-ink-soft border-burgundy/15 hover:border-burgundy/40'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                                <span>{ps.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom size input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add custom size (e.g. 8x10, A3)"
                            value={customSizeInput}
                            onChange={(e) => setCustomSizeInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomSize(e);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-cream border border-burgundy/15 text-xs text-burgundy-deep outline-none focus:border-burgundy"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomSize}
                            className="px-3 py-1.5 rounded-xl bg-blush text-burgundy font-bold text-xs hover:bg-blush-deep transition-colors"
                          >
                            + Add Size
                          </button>
                        </div>
                      </div>

                      {/* Multi-Image Upload / URL Management */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-burgundy-deep flex items-center gap-1.5">
                              <span>Product Images ({imagesList.length}/{getImageLimit(category)})</span>
                              <span className="text-rose-deep">*</span>
                            </label>
                            <span className="text-[10px] text-ink-soft block font-normal">
                              {category === 'magazines'
                                ? '📖 Magazines: Up to 15 images (for page-by-page previews)'
                                : '📷 Max 5 images (1st image is Primary Cover)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-cream rounded-lg p-0.5 border border-burgundy/10 text-[10px] font-bold">
                            <button
                              type="button"
                              onClick={() => setImageMode('file')}
                              className={`px-2 py-0.5 rounded transition-all ${
                                imageMode === 'file' ? 'bg-burgundy text-cream shadow-xs' : 'text-ink-soft hover:text-burgundy'
                              }`}
                            >
                              Upload Files
                            </button>
                            <button
                              type="button"
                              onClick={() => setImageMode('url')}
                              className={`px-2 py-0.5 rounded transition-all ${
                                imageMode === 'url' ? 'bg-burgundy text-cream shadow-xs' : 'text-ink-soft hover:text-burgundy'
                              }`}
                            >
                              Add URL
                            </button>
                          </div>
                        </div>

                        {imageMode === 'file' ? (
                          <div>
                            <input
                              type="file"
                              multiple
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              id="admin-product-file-edit"
                              disabled={imagesList.length >= getImageLimit(category)}
                            />
                            <label
                              htmlFor="admin-product-file-edit"
                              className={`w-full border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all group ${
                                imagesList.length >= getImageLimit(category)
                                  ? 'opacity-60 cursor-not-allowed border-burgundy/20 bg-cream/40'
                                  : 'border-burgundy/25 hover:border-burgundy/50 bg-cream/70 hover:bg-cream cursor-pointer'
                              }`}
                            >
                              <Upload className="w-6 h-6 text-burgundy mb-1 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold text-burgundy-deep">
                                {imagesList.length >= getImageLimit(category)
                                  ? `Category limit reached (Max ${getImageLimit(category)} images)`
                                  : `Click to select images (Multiple supported)`}
                              </span>
                              <span className="text-[10px] text-ink-soft text-center mt-0.5">
                                {category === 'magazines'
                                  ? 'Select up to 15 pages • First image will be magazine cover'
                                  : 'Select up to 5 photos • First image will be primary cover'}
                              </span>
                              {isUploading && (
                                <span className="text-[10px] text-rose-deep font-bold animate-pulse mt-1">
                                  Uploading images in background...
                                </span>
                              )}
                            </label>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddUrl(e);
                                }
                              }}
                              disabled={imagesList.length >= getImageLimit(category)}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-cream border border-burgundy/20 focus:border-burgundy outline-none text-xs text-burgundy-deep transition-all disabled:opacity-50"
                            />
                            <button
                              type="button"
                              onClick={handleAddUrl}
                              disabled={!urlInput.trim() || imagesList.length >= getImageLimit(category)}
                              className="px-3.5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-deep disabled:opacity-50 text-cream font-bold text-xs transition-colors whitespace-nowrap"
                            >
                              + Add URL
                            </button>
                          </div>
                        )}

                        {/* Live Multiple Images Preview & Management Grid */}
                        {imagesList.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-ink-soft">
                              <span className="font-semibold text-burgundy-deep flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-burgundy" />
                                <span>Images Preview ({imagesList.length}/{getImageLimit(category)})</span>
                              </span>
                              <span className="text-[10px] text-ink-soft">
                                ⭐ Click "Cover" to set main thumbnail
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1.5 bg-cream/50 rounded-2xl border border-burgundy/15">
                              {imagesList.map((img, idx) => {
                                const isCover = idx === 0;
                                return (
                                  <div
                                    key={idx}
                                    className={`relative rounded-xl overflow-hidden border transition-all bg-paper shadow-xs flex flex-col justify-between group ${
                                      isCover ? 'border-burgundy ring-2 ring-burgundy/25' : 'border-burgundy/15'
                                    }`}
                                  >
                                    <div className="h-20 w-full bg-blush/20 flex items-center justify-center overflow-hidden">
                                      <ImageWithFallback
                                        src={img}
                                        alt={`Product upload preview ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>

                                    {/* Cover / Page Indicator Badge */}
                                    <div className="absolute top-1 left-1 flex items-center gap-1">
                                      {isCover ? (
                                        <span className="bg-burgundy text-cream text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                                          <Star className="w-2.5 h-2.5 fill-cream text-cream" />
                                          <span>Cover</span>
                                        </span>
                                      ) : (
                                        <span className="bg-burgundy-deep/80 text-cream text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                                          {category === 'magazines' ? `P.${idx + 1}` : `#${idx + 1}`}
                                        </span>
                                      )}
                                    </div>

                                    {/* Remove Image (x) Button */}
                                    <div className="absolute top-1 right-1 flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="bg-burgundy/85 hover:bg-rose-deep text-cream p-1 rounded-full shadow-xs transition-colors cursor-pointer"
                                        title="Remove Image"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>

                                    {/* Bottom Controls: Make Cover & Reorder */}
                                    <div className="p-1 bg-paper/95 border-t border-burgundy/10 flex items-center justify-between gap-1 text-[10px]">
                                      {!isCover ? (
                                        <button
                                          type="button"
                                          onClick={() => handleSetCover(idx)}
                                          className="text-[9px] font-bold text-burgundy hover:text-burgundy-deep hover:underline truncate"
                                        >
                                          Make Cover
                                        </button>
                                      ) : (
                                        <span className="text-[9px] font-bold text-emerald-800">Primary</span>
                                      )}

                                      <div className="flex items-center gap-0.5 ml-auto">
                                        {idx > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => handleMoveImage(idx, idx - 1)}
                                            className="px-1 py-0.5 hover:bg-blush rounded text-burgundy font-bold text-[10px]"
                                            title="Move Left"
                                          >
                                            &larr;
                                          </button>
                                        )}
                                        {idx < imagesList.length - 1 && (
                                          <button
                                            type="button"
                                            onClick={() => handleMoveImage(idx, idx + 1)}
                                            className="px-1 py-0.5 hover:bg-blush rounded text-burgundy font-bold text-[10px]"
                                            title="Move Right"
                                          >
                                            &rarr;
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Key Features Bullet Points */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-deep mb-1">
                          Key Features (One per line)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Layered 3D pop-up depth with precision laser cutouts&#10;Includes sturdy tabletop stand and wall mounting hooks"
                          value={detailsText}
                          onChange={(e) => setDetailsText(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-cream border border-burgundy/15 text-xs text-burgundy-deep outline-none focus:border-burgundy resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customization Options Bar */}
                  <div className="p-4 rounded-2xl bg-cream/70 border border-burgundy/15 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs font-bold text-burgundy-deep uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-burgundy" />
                      <span>Customization Options:</span>
                    </span>

                    <div className="flex items-center gap-4 flex-wrap">
                      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requiresPhoto}
                          onChange={(e) => setRequiresPhoto(e.target.checked)}
                          className="accent-burgundy rounded"
                        />
                        <span>Requires Photo</span>
                      </label>

                      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requiresText}
                          onChange={(e) => setRequiresText(e.target.checked)}
                          className="accent-burgundy rounded"
                        />
                        <span>Requires Text</span>
                      </label>

                      <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft cursor-pointer">
                        <input
                          type="checkbox"
                          checked={requiresDate}
                          onChange={(e) => setRequiresDate(e.target.checked)}
                          className="accent-burgundy rounded"
                        />
                        <span>Requires Date</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProductId(null);
                        setActiveTab('list');
                      }}
                      className="px-5 py-2.5 rounded-full border border-burgundy/20 text-xs font-bold text-burgundy-deep hover:bg-cream transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-7 py-2.5 rounded-full bg-burgundy hover:bg-burgundy-deep text-cream text-xs sm:text-sm font-bold shadow-craft-soft hover:shadow-craft-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {editingProductId ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save &amp; Update Product</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add Product to Catalogue</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ================= TAB 3: SETTINGS & SAFE RESET ================= */}
              {activeTab === 'settings' && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-burgundy-deep">
                      Admin Settings &amp; Safety Fallbacks
                    </h4>
                    <p className="text-xs text-ink-soft">
                      Manage global catalogue state and safety resets.
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-cream/70 border border-burgundy/15 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-blush flex items-center justify-center text-burgundy shrink-0">
                        <RotateCcw className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-serif text-base font-bold text-burgundy-deep">
                          Restore Factory Original Products
                        </h5>
                        <p className="text-xs text-ink-soft leading-relaxed mt-1">
                          If any product data was mistakenly deleted or modified, you can instantly restore the complete original set of 12+ factory products (including all original frames, prices ₹399/₹299, tags, and images).
                        </p>
                      </div>
                    </div>

                    {showResetConfirm ? (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-burgundy">
                          <ShieldAlert className="w-4 h-4" />
                          <span>Are you sure? This will replace your current catalogue with the factory defaults.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleResetToDefault}
                            className="px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-deep text-cream text-xs font-bold shadow-xs transition-all"
                          >
                            Yes, Reset Everything
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowResetConfirm(false)}
                            className="px-4 py-2 rounded-xl bg-paper border border-burgundy/15 text-ink-soft text-xs font-semibold hover:bg-cream transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(true)}
                        className="px-5 py-2.5 rounded-full border border-burgundy text-burgundy hover:bg-burgundy hover:text-cream text-xs font-bold transition-all flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Original Products</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
