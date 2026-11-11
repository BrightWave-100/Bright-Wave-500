import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqData = [
  {
    id: "faq-1",
    question: "How does the Bright Wave AI integration process work?",
    answer: "We follow our proven Engineering Roadmap. First, we conduct an operational audit to find manual blocks or data silos. Next, we select model aliases (e.g. gemini-3.5-flash) and configure secure, server-side private routes to proxy intelligence prompts without exposing secrets. Then, we connect these prompts to custom WhatsApp flows or enterprise dashboard grids.",
    category: "AI & Automation"
  },
  {
    id: "faq-2",
    question: "Do you build offline-first software systems?",
    answer: "Absolutely. We specialize in software architecture engineered for regional network realities. Our custom inventory ledgers and hospital systems store transaction logs in local IndexedDB or local SQLite tables immediately. When a network connection returns, the system automatically synchronizes delta logs with the master cloud container.",
    category: "Software Development"
  },
  {
    id: "faq-3",
    question: "What are your standard project delivery timelines?",
    answer: "Small discovery audits or basic workflow automations take about 2-3 weeks. Custom ERP systems, offline agricultural synchronizers, and comprehensive corporate portals require between 6 and 12 weeks. We map clear milestones and provide live prototype staging links so you can track progress.",
    category: "Process & Timelines"
  },
  {
    id: "faq-4",
    question: "How do you handle payments and regional money integrations?",
    answer: "We construct secure, modular REST API payment routing modules. Our backends are ready to hook up with MTN Mobile Money, Airtel Money, Flutterwave, Pesapal, Stripe, and global cards. We build secure Webhook receivers that verify payment status before authorizing digital dispatch or invoice logging.",
    category: "Payments & Integration"
  },
  {
    id: "faq-5",
    question: "What support SLA programs do you offer after launch?",
    answer: "Every custom build includes 10 to 90 days of complimentary priority diagnostics. After that, clients can enroll in our active Support SLA plan. This program covers scheduled container security updates, routine database backups, continuous AI model temperature tuning, and priority technical support tickets.",
    category: "Support & SLA"
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#05070A] relative border-t border-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
            Operational FAQs
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Frequently Answered Inquiries
          </h2>
        </div>

        {/* Accordions Stack */}
        <div className="space-y-4">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#00D9FF]/30 bg-[#071A35]/10 shadow-lg shadow-black/50"
                    : "border-gray-950 bg-[#071A35]/5 hover:border-gray-800"
                }`}
              >
                {/* Trigger Button */}
                <button
                  id={`faq-trigger-${faq.id}`}
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex gap-3 items-center">
                    <HelpCircle className="w-5 h-5 text-[#00D9FF] shrink-0" />
                    <span className="font-display font-semibold text-sm sm:text-base text-white tracking-wide">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#00D9FF] transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-left border-t border-gray-900 mt-1">
                        <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed font-light mb-3">
                          {faq.answer}
                        </p>
                        <span className="inline-block bg-gray-900 text-gray-500 font-mono text-[9px] px-2.5 py-0.5 rounded border border-gray-850">
                          CATEGORY: {faq.category}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
