import { useState } from "react";
import { Cpu, RefreshCw, Code, Globe, Smartphone, BarChart3, CheckCircle, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const servicesData = [
  {
    id: "serv-ai",
    category: "AI",
    title: "Artificial Intelligence",
    icon: <Cpu className="w-6 h-6 text-[#00D9FF]" />,
    description: "Architect and deploy secure custom generative models, computer vision systems, and machine learning models built specifically for regional operational needs.",
    features: [
      "Gemini & Custom AI assistants",
      "Knowledge base retrieval systems (RAG)",
      "High-accuracy conversational bots",
      "Localized Voice AI & speech routing",
      "Secure OCR & Document AI engines",
      "Predictive Machine Learning models",
      "Computer Vision sorting & surveillance",
    ],
    deepDive: "Our AI systems leverage the Google Gemini API on secure backend servers. We don't just supply standard templates; we fine-tune embeddings and context documents using Retrieval-Augmented Generation (RAG) to build complete private corporate brains. Perfect for automating customer desks, scanning legal files, or auditing medical charts."
  },
  {
    id: "serv-auto",
    category: "Automation",
    title: "Hyper-Automation",
    icon: <RefreshCw className="w-6 h-6 text-[#00D9FF]" />,
    description: "Strip out slow administrative bottlenecks by replacing manual data entries, paper invoices, and copy-paste processes with robust automation triggers.",
    features: [
      "WhatsApp Business API Automation",
      "Multi-system workflow stream setup",
      "CRM pipeline automatic logging",
      "Transactional email & alert automation",
      "Bulk invoice & payment triggers",
      "Business process orchestration",
    ],
    deepDive: "Conversational commerce is the core driver of modern commerce. We develop direct bridges to the WhatsApp Business API, linking chat menus directly to your inventory ledgers, CRM databases, and billing endpoints. This allows complete end-to-end purchasing, customer checkout, and automatic delivery notifications on WhatsApp."
  },
  {
    id: "serv-soft",
    category: "Software",
    title: "Custom Enterprise Software",
    icon: <Code className="w-6 h-6 text-[#00D9FF]" />,
    description: "Design and build durable, secure, and offline-first software applications built specifically to optimize core business operations.",
    features: [
      "Bespoke Enterprise ERP Platforms",
      "Multi-district inventory trackers",
      "Digital Hospital management grids",
      "School administrative ledgers",
      "High-speed point-of-sale (POS)",
      "Custom double-entry accounting tools",
    ],
    deepDive: "Most standard software breaks under weak network signals. We specialize in offline-first engineering, storing system data in secure local caches before synchronizing delta logs with the Cloud. This ensures your teams keep executing orders, managing hospital patients, and recording retail sales regardless of connection."
  },
  {
    id: "serv-web",
    category: "Web Engineering",
    title: "Premium Web Experiences",
    icon: <Globe className="w-6 h-6 text-[#00D9FF]" />,
    description: "Craft stunning, high-performance websites and online booking platforms designed for fluid usability, absolute responsiveness, and high conversion.",
    features: [
      "Corporate brand portfolios",
      "High-speed landing page systems",
      "Fluid e-commerce platforms",
      "Interactive booking & reserve portals",
      "Private subscriber member hubs",
      "Custom Jamstack headless web apps",
    ],
    deepDive: "A corporate website is your premier digital asset. We write lightweight, highly accessible codebases styled with custom Tailwind CSS, obtaining perfect performance scores. Every interface communicates quality, utilizing elegant negative space, luxury typography, and smooth layouts."
  },
  {
    id: "serv-mob",
    category: "Mobile Applications",
    title: "Native Mobile Engineering",
    icon: <Smartphone className="w-6 h-6 text-[#00D9FF]" />,
    description: "Engineer lightweight, fast, and feature-rich native and cross-platform mobile apps for Android and iOS systems.",
    features: [
      "Custom Android applications",
      "iOS Swift mobile engineering",
      "High-efficiency Flutter cross-apps",
      "Regional offline maps & GPS caching",
      "Biometric secure authentication",
      "Local push notification campaigns",
    ],
    deepDive: "We build ultra-low footprint mobile apps tailored to preserve device storage and battery. By integrating offline caching and seamless background synchronization, we create mobile experiences that empower field agents, logistics dispatchers, and everyday consumers across Africa."
  },
  {
    id: "serv-data",
    category: "Data & Analytics",
    title: "Data Systems & BI",
    icon: <BarChart3 className="w-6 h-6 text-[#00D9FF]" />,
    description: "Convert cluttered transactional tables into interactive dashboards, deep forecasting trends, and clean business intelligence.",
    features: [
      "Real-time corporate dashboards",
      "Advanced streaming log analytics",
      "Automated PDF reporting builders",
      "Power BI & Tableau API sync",
      "Cashflow & supply forecasting ML",
      "Unified data lakes pipelines",
    ],
    deepDive: "Cluttered spreadsheets delay macro decisions. We build real-time dashboard systems that ingest data from legacy ERPs, SMS aggregators, and payment gateways. We represent data elegantly using custom D3/Recharts visualizations, allowing your executive board to see performance and spot trends instantly."
  },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<typeof servicesData[0] | null>(null);

  return (
    <section id="services" className="py-24 bg-[#05070A] relative border-t border-gray-900">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#071A35]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
            Core Capabilities
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-6">
            Elite AI and Software Services
          </h2>
          <p className="font-sans text-gray-400 text-lg leading-relaxed font-light">
            We provide full-stack technical delivery with absolute precision. Every line of code, database query, and animation is custom-crafted to accelerate your growth.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass-panel p-8 rounded-2xl flex flex-col justify-between items-start text-left group hover:border-[#00D9FF]/30 transition-all duration-300 shimmer-border"
            >
              <div className="w-full">
                {/* Icon Circle */}
                <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[#00D9FF] transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-sm text-gray-400 leading-relaxed font-light mb-6">
                  {service.description}
                </p>

                {/* Feature Bullets */}
                <ul className="flex flex-col gap-2.5 mb-8">
                  {service.features.slice(0, 4).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300 font-sans">
                      <CheckCircle className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
                      <span className="font-light">{feat}</span>
                    </li>
                  ))}
                  {service.features.length > 4 && (
                    <li className="text-xs text-gray-500 font-mono italic pl-6">
                      + {service.features.length - 4} more specialized capabilities
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Button */}
              <button
                id={`learn-more-btn-${service.id}`}
                onClick={() => setSelectedService(service)}
                className="group/btn flex items-center gap-2 text-xs font-semibold text-[#00D9FF] hover:text-white transition-colors cursor-pointer mt-auto"
              >
                Learn More
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal / Drawer with custom overlay */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div
              id="service-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              id="service-modal-body"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-[#05070A] border border-gray-800 rounded-2xl shadow-2xl p-8 overflow-hidden max-h-[85vh] overflow-y-auto shimmer-border text-left"
            >
              <button
                id="close-service-modal-btn"
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white border border-gray-800 rounded-lg hover:border-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 border-b border-gray-800 pb-5 mb-6">
                <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
                  {selectedService.icon}
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#00D9FF] tracking-widest uppercase block mb-0.5">
                    {selectedService.category} SERVICES
                  </span>
                  <h3 className="font-display font-bold text-2xl text-white">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-display font-semibold text-sm text-[#00D9FF] uppercase tracking-wider mb-2">
                    Design &amp; Architecture Overview
                  </h4>
                  <p className="font-sans text-sm text-gray-300 leading-relaxed font-light">
                    {selectedService.deepDive}
                  </p>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm text-[#00D9FF] uppercase tracking-wider mb-3">
                    Full Capabilities Included
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs text-gray-300 font-sans">
                        <CheckCircle className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
                        <span className="font-light">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-800 pt-6 mt-8">
                <button
                  id="modal-book-consult-btn"
                  onClick={() => {
                    setSelectedService(null);
                    const element = document.getElementById("contact");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#05070A] text-xs font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md shadow-[#00D9FF]/10 transition-all cursor-pointer"
                >
                  Consult on this service
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
