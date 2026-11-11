import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Testimonial } from "../types";

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (loading) {
    return (
      <div className="py-24 bg-[#05070A] flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section id="testimonials" className="py-24 bg-[#05070A] relative border-t border-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
            Executive Voice
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-8">
            Verified Enterprise Feedback
          </h2>
          <div className="max-w-2xl mx-auto glass-panel p-10 rounded-2xl border border-gray-900 shimmer-border">
            <Quote className="w-10 h-10 text-[#00D9FF]/30 mx-auto mb-4" />
            <p className="font-sans text-gray-300 text-sm sm:text-base leading-relaxed font-light mb-4">
              Verified client reviews, formal system deployment evaluations, and executive case study interviews are published periodically following non-disclosure clearance.
            </p>
            <p className="font-mono text-xs text-[#00D9FF] font-semibold">
              Client case studies available upon executive request during scoping consultations.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const current = items[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-[#05070A] relative border-t border-gray-900 overflow-hidden">
      {/* Background illumination circles */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#00D9FF]/2 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#071A35]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
            Executive Voice
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Trusted by Leaders of Africa&apos;s Industries
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="max-w-3xl mx-auto relative px-4 sm:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-8 sm:p-12 rounded-2xl border border-gray-900 text-left relative shimmer-border"
            >
              {/* Massive quotation icon mark */}
              <Quote className="absolute top-8 right-10 w-16 h-16 text-[#00D9FF]/5 pointer-events-none" />

              {/* Rating stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="font-sans text-gray-200 text-base sm:text-lg leading-relaxed mb-8 font-light italic">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author Info row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-900 pt-6">
                <div className="flex items-center gap-4">
                  {/* Photo avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-900 border border-gray-800 shrink-0">
                    <img src={current.photoUrl} alt={current.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="block font-display font-bold text-sm text-white">
                      {current.name}
                    </span>
                    <span className="block font-sans text-xs text-gray-400 font-light">
                      {current.role}, {current.company}
                    </span>
                  </div>
                </div>

                {/* Company Logo mock badge */}
                <div className="inline-flex items-center gap-2 bg-[#00D9FF]/5 border border-[#00D9FF]/15 rounded-lg px-3.5 py-1.5 font-mono text-xs text-[#00D9FF] font-semibold self-start sm:self-auto">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {current.logoText}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider controller arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              id="prev-testimonial-btn"
              onClick={handlePrev}
              className="p-3 rounded-lg border border-gray-800 hover:border-gray-600 hover:text-[#00D9FF] bg-[#05070A]/85 backdrop-blur-md transition-all cursor-pointer text-gray-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-gray-500 tracking-wider">
              {currentIndex + 1} / {items.length}
            </span>
            <button
              id="next-testimonial-btn"
              onClick={handleNext}
              className="p-3 rounded-lg border border-gray-800 hover:border-gray-600 hover:text-[#00D9FF] bg-[#05070A]/85 backdrop-blur-md transition-all cursor-pointer text-gray-400"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
