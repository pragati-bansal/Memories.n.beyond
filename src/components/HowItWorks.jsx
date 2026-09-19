import React from 'react';
import { Gift, Image as ImageIcon, Truck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '1',
      icon: Gift,
      title: 'Choose your gift',
      description:
        'Pick a frame, bouquet, or keepsake box that fits the occasion — or tell us what you have in mind.',
    },
    {
      num: '2',
      icon: ImageIcon,
      title: 'Send photos & custom text',
      description:
        'Share your pictures and the words you want engraved or printed, straight over WhatsApp.',
    },
    {
      num: '3',
      icon: Truck,
      title: 'Delivered to your doorstep',
      description:
        'We craft, pack, and ship it to any address in India, tracked from our workshop to your door.',
    },
  ];

  return (
    <section id="custom" className="py-20 sm:py-28 bg-cream-deep/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-bold text-rose-deep uppercase tracking-wider block mb-2">
            The Crafting Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-burgundy-deep mb-4 leading-tight">
            From your camera roll to their doorstep
          </h2>
          <p className="text-base text-ink-soft">
            Three simple steps, and we handle the rest — printing, assembly, and luxury packaging included.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative bg-paper rounded-3xl p-8 border border-burgundy/10 shadow-craft-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-5xl font-bold text-blush-deep/60 leading-none">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-blush/60 flex items-center justify-center text-burgundy">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-burgundy-deep mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-burgundy/20 z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
