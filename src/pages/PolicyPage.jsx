import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Video,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Gift,
  Zap,
  Tag,
  Sparkles,
  MapPin,
  MessageCircle,
} from 'lucide-react';

export default function PolicyPage({ onBack, onNavigateCategories }) {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919368606771';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Sticky Sub-Header with Back Button & Breadcrumbs */}
      <div className="bg-cream-deep/70 border-b border-burgundy/10 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paper border border-burgundy/15 text-burgundy-deep font-semibold text-xs hover:bg-burgundy hover:text-cream transition-all shadow-craft-soft cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>

          <div className="text-xs text-ink-soft flex items-center gap-1.5">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-burgundy transition-colors cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="font-bold text-burgundy-deep">Return &amp; Cancellation Policy</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blush border border-rose/30 text-rose-deep text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-burgundy" />
            <span>Official Store Policy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-deep leading-tight mb-4">
            Return &amp; Cancellation Policy
          </h1>
          <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
            At Memories n Beyond, every order is prepared with care, especially our customized and personalized products. Please read our policy before placing your order.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">

        {/* 1. Cancellation Section */}
        <section className="bg-paper rounded-3xl border border-burgundy/15 p-6 sm:p-8 shadow-craft-soft">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-burgundy/10">
            <div className="w-10 h-10 rounded-2xl bg-blush flex items-center justify-center text-burgundy shadow-sm shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-burgundy-deep">
                Cancellation
              </h2>
              <p className="text-xs text-ink-soft">
                Order modification and cancellation criteria.
              </p>
            </div>
          </div>

          <ul className="space-y-3.5 text-xs sm:text-sm text-ink leading-relaxed">
            <li className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60 border border-burgundy/10">
              <Clock className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
              <span>
                Orders can be cancelled only within <strong>3 days</strong> of placing the order, and <strong>only if the order has not yet been processed</strong>.
              </span>
            </li>

            <li className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60 border border-burgundy/10">
              <XCircle className="w-4 h-4 text-rose-deep shrink-0 mt-0.5" />
              <span>
                Once an order has been processed, cancellation will <strong>not be accepted</strong>.
              </span>
            </li>

            <li className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                After 3 days of placing the order, <strong>no cancellation requests will be accepted</strong>, irrespective of the order status.
              </span>
            </li>
          </ul>
        </section>

        {/* 2. Returns & Replacement Section */}
        <section className="bg-paper rounded-3xl border border-burgundy/15 p-6 sm:p-8 shadow-craft-soft">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-burgundy/10">
            <div className="w-10 h-10 rounded-2xl bg-blush flex items-center justify-center text-burgundy shadow-sm shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-burgundy-deep">
                Returns &amp; Replacement
              </h2>
              <p className="text-xs text-ink-soft">
                Guidelines for damaged, defective, or incorrect deliveries.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-ink leading-relaxed">
            
            {/* 7-Day Window */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60 border border-burgundy/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Returns/replacements are accepted only within <strong>7 days</strong> of delivery.
              </span>
            </div>

            {/* MANDATORY UNBOXING VIDEO NOTICE (High Visibility Box) */}
            <div className="rounded-2xl bg-rose-50/80 border-2 border-rose-300 p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-burgundy-deep font-bold text-sm sm:text-base">
                <Video className="w-5 h-5 text-burgundy shrink-0" />
                <span>Mandatory Unboxing Video Requirement</span>
              </div>

              <div className="p-3 bg-burgundy text-cream rounded-xl text-xs sm:text-sm font-bold text-center tracking-wide shadow-sm">
                ⚠️ No unboxing video = No return/replacement.
              </div>

              <ul className="space-y-2 text-xs text-burgundy-deep/90 pl-1">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy shrink-0 mt-1.5" />
                  <span>A clear, continuous, and unedited unboxing video is mandatory for any return/replacement request.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy shrink-0 mt-1.5" />
                  <span>The unboxing video must be one continuous recording from the unopened package until the product is fully revealed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy shrink-0 mt-1.5" />
                  <span>Videos with cuts, edits, pauses, or multiple clips will <strong>not be considered valid</strong>, regardless of the length of the video.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy shrink-0 mt-1.5" />
                  <span>The video must clearly show the package, shipping label, and product.</span>
                </li>
              </ul>
            </div>

            {/* No Monetary Refunds Policy */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60 border border-burgundy/10">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>No monetary refunds</strong> will be provided. If the issue is verified and approved, only a <strong>replacement</strong> of the product will be offered.
              </span>
            </div>

            {/* Customized Product Rule */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60 border border-burgundy/10">
              <XCircle className="w-4 h-4 text-rose-deep shrink-0 mt-0.5" />
              <span>
                Customized/personalized products are <strong>not eligible</strong> for return or replacement due to change of mind, personal preference, or incorrect details provided by the customer.
              </span>
            </div>

            {/* Damaged or Defective Notification */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60 border border-burgundy/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                In case of a damaged, defective, or incorrect product, contact us within <strong>7 days</strong> with your order details, unboxing video, and clear photos/videos of the issue.
              </span>
            </div>

            {/* Packaging Storage */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60 border border-burgundy/10">
              <ShieldCheck className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
              <span>
                Please keep the original product and packaging safely until your request has been reviewed and resolved.
              </span>
            </div>

            {/* Subject to Verification */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-cream/60 border border-burgundy/10">
              <CheckCircle2 className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
              <span>
                All replacement requests are subject to verification and approval by Memories n Beyond.
              </span>
            </div>

          </div>
        </section>

        {/* 3. Shipping & Delivery Timelines Reminder */}
        <section className="bg-paper rounded-3xl border border-burgundy/15 p-6 sm:p-8 shadow-craft-soft">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-burgundy/10">
            <div className="w-10 h-10 rounded-2xl bg-blush flex items-center justify-center text-burgundy shadow-sm shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-burgundy-deep">
                Shipping &amp; Delivery Timelines
              </h2>
              <p className="text-xs text-ink-soft">
                PAN India &amp; Meerut priority timelines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-cream/70 border border-burgundy/10 space-y-1">
              <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free Shipping (PAN India)</span>
              </div>
              <div className="font-serif text-lg font-bold text-burgundy">
                10-14 Days
              </div>
              <p className="text-[11px] text-ink-soft">Delivery across India at zero extra cost.</p>
            </div>

            <div className="p-4 rounded-2xl bg-cream/70 border border-burgundy/10 space-y-1">
              <div className="text-xs font-bold text-burgundy-deep flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-burgundy" />
                <span>Delivery within Meerut</span>
              </div>
              <div className="font-serif text-lg font-bold text-burgundy">
                5 Days
              </div>
              <p className="text-[11px] text-ink-soft">Fast local hand-off within Meerut city.</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Next Day Delivery</span>
              </div>
              <div className="font-serif text-lg font-bold text-amber-900">
                ₹200/- Extra
              </div>
              <p className="text-[11px] text-amber-950 font-medium">Applicable on Meerut residents only.</p>
            </div>
          </div>
        </section>

        {/* Agreement Note Banner */}
        <div className="p-5 rounded-2xl bg-blush/40 border border-burgundy/20 text-center text-xs sm:text-sm text-burgundy-deep font-semibold">
          ✨ By placing an order, you acknowledge and agree to the above policy.
        </div>

        {/* Contact Support on WhatsApp */}
        <div className="rounded-3xl bg-burgundy text-cream p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-craft-modal">
          <div>
            <h3 className="font-serif text-2xl font-bold text-cream mb-1">
              Need to submit a replacement request?
            </h3>
            <p className="text-xs text-cream/80 max-w-lg">
              Contact our team with your order details and continuous unboxing video directly on WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="bg-cream hover:bg-white text-burgundy-deep font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-sm cursor-pointer"
            >
              ← Back to Store
            </button>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                "Hi Memories n Beyond! I want to discuss a return/replacement request with my order details and unboxing video."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-paper hover:bg-cream text-burgundy font-bold px-5 py-2.5 rounded-full text-xs transition-all flex items-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
