import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Sparkles,
  Loader2,
  Trash2,
  Check,
} from 'lucide-react';
import { uploadCustomerPhoto, createOrderRecord } from '../lib/supabaseClient';

export default function ProductModal({ product, onClose }) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customText, setCustomText] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); // [{ name, url, file }]
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

  // Keyboard close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'];

  const customOpts = product.customization_options || {
    requires_photo: true,
    max_photos: 5,
    requires_text: true,
    text_placeholder: 'Custom text or name',
    requires_date: false,
  };

  // Handle Multi-file Upload to Supabase Storage
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const uploadPromises = files.map(async (file) => {
        const publicUrl = await uploadCustomerPhoto(file);
        return {
          name: file.name,
          url: publicUrl,
        };
      });

      const newUploaded = await Promise.all(uploadPromises);
      setUploadedFiles((prev) => [...prev, ...newUploaded]);
    } catch (err) {
      console.error('File upload failed:', err);
      setUploadError('Failed to upload some images. Please check Supabase storage permissions or try again.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemovePhoto = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Build WhatsApp Message & Record in Supabase
  const handleProceedToWhatsApp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadedUrls = uploadedFiles.map((f) => f.url);

      // Save order to Supabase orders table
      await createOrderRecord({
        customer_name: customerName.trim() || 'Valued Customer',
        phone_number: phoneNumber.trim() || 'Not Provided',
        product_id: product.id && product.id.length > 10 ? product.id : null,
        custom_notes: customText.trim(),
        event_date: eventDate || null,
        uploaded_images: uploadedUrls,
        order_status: 'pending',
      });

      // Construct formatted WhatsApp message
      const lines = [
        `🌸 *NEW CUSTOM ORDER REQUEST* 🌸`,
        `*Product:* ${product.title} (₹${product.price})`,
      ];

      if (customerName.trim()) {
        lines.push(`*Name:* ${customerName.trim()}`);
      }
      if (phoneNumber.trim()) {
        lines.push(`*Phone:* ${phoneNumber.trim()}`);
      }
      if (customText.trim()) {
        lines.push(`*Custom Text/Notes:* "${customText.trim()}"`);
      }
      if (eventDate) {
        lines.push(`*Occasion/Event Date:* ${eventDate}`);
      }
      if (uploadedUrls.length > 0) {
        lines.push(`*Customer Photos (${uploadedUrls.length}):*`);
        uploadedUrls.forEach((url, i) => lines.push(`  ${i + 1}. ${url}`));
      }

      lines.push(`\nPlease confirm my order details and share next steps. Thank you!`);

      const messageText = lines.join('\n');
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

      // Open WhatsApp chat in new window
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      onClose();
    } catch (error) {
      console.error('Error proceeding with order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-burgundy-deep/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative bg-paper rounded-3xl shadow-craft-modal border border-burgundy/15 max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col z-10 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-cream/90 hover:bg-cream text-burgundy-deep flex items-center justify-center shadow-craft-soft transition-all hover:scale-110"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content Grid */}
          <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-12 flex-grow">
            {/* Left Column: Visual Gallery & Details */}
            <div className="md:col-span-5 bg-gradient-to-br from-blush via-blush-deep/50 to-cream p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-burgundy/10">
              <div className="space-y-4">
                {/* Main Image Frame Preview */}
                <div className="w-full aspect-[4/5] bg-paper rounded-2xl p-3 shadow-craft-lg border border-burgundy/10 overflow-hidden flex items-center justify-center">
                  <div
                    className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center"
                    style={{ background: product.gradient || '#F6DEDA' }}
                  >
                    <img
                      src={images[activeImageIndex] || images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Thumbnails if multiple images exist */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-burgundy scale-105 shadow-craft-sm'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Key Points / Features */}
              <div className="mt-6 pt-6 border-t border-burgundy/10 space-y-2.5">
                <span className="text-xs font-bold text-rose-deep uppercase tracking-wider block">
                  Crafted with Care
                </span>
                <ul className="text-xs text-ink-soft space-y-2">
                  {(product.details || [
                    'Personalized photo prints with archival inks',
                    'Customizable engraving or printed gift note',
                    'Safely bubble-wrapped in gift-ready craft packaging',
                    'Shipped PAN India with live parcel tracking',
                  ]).map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Customization Form & WhatsApp CTA */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-rose-deep uppercase tracking-wider block mb-1">
                  {product.tag || 'Personalized Gift'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-burgundy-deep mb-2">
                  {product.title}
                </h2>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-serif text-2xl font-bold text-burgundy">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-ink-soft font-semibold">
                    (Includes personalization &amp; packaging)
                  </span>
                </div>

                {/* Customization Form */}
                <form onSubmit={handleProceedToWhatsApp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer Name */}
                    <div>
                      <label className="block text-xs font-bold text-ink-soft mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Maya Sharma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/15 bg-cream/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-ink-soft mb-1">
                        WhatsApp Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/15 bg-cream/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                      />
                    </div>
                  </div>

                  {/* Custom Text / Engraving */}
                  <div>
                    <label className="block text-xs font-bold text-ink-soft mb-1">
                      Custom Text / Engraving / Wish
                    </label>
                    <textarea
                      rows={2}
                      placeholder={customOpts.text_placeholder || 'Enter names, anniversary date, or personal quote...'}
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/15 bg-cream/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy resize-none"
                    />
                  </div>

                  {/* Occasion Date (if applicable) */}
                  <div>
                    <label className="block text-xs font-bold text-ink-soft mb-1">
                      Event / Occasion Date (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-burgundy/15 bg-cream/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                      />
                      <Calendar className="w-4 h-4 text-ink-soft/60 absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Supabase Photo Uploader */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-ink-soft mb-1.5 flex items-center justify-between">
                      <span>Upload Your Photos</span>
                      <span className="text-[11px] text-rose-deep font-normal">
                        Direct Supabase Storage
                      </span>
                    </label>

                    <label className="border-2 border-dashed border-burgundy/20 hover:border-burgundy/50 bg-cream/40 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                      {isUploading ? (
                        <div className="flex items-center gap-2 text-burgundy text-xs font-semibold py-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Uploading to Supabase...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-center sm:text-left">
                          <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-burgundy group-hover:scale-110 transition-transform">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-burgundy block">
                              Click to choose photos from device
                            </span>
                            <span className="text-[11px] text-ink-soft">
                              PNG, JPG, HEIC up to 15MB each
                            </span>
                          </div>
                        </div>
                      )}
                    </label>

                    {uploadError && (
                      <p className="text-xs text-rose-deep mt-1.5">{uploadError}</p>
                    )}

                    {/* Uploaded Photos Thumbnails List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploadedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative group w-14 h-14 rounded-lg overflow-hidden border border-burgundy/15 shadow-sm"
                          >
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute inset-0 bg-burgundy-deep/70 text-cream opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                              aria-label="Remove image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button to WhatsApp */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-burgundy hover:bg-burgundy-deep text-cream py-3.5 px-6 rounded-2xl font-bold text-sm shadow-craft-soft hover:shadow-craft-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Preparing WhatsApp Checkout...</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4" />
                          <span>Order &amp; Customize on WhatsApp</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-ink-soft/80 mt-2">
                      No online payment required now. Review details &amp; finalize delivery on WhatsApp!
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
