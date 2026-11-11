import { motion } from "motion/react";
import { Award, Zap, Smile, Clock } from "lucide-react";

export default function Trust() {
  const stats = [
    {
      id: "stat-1",
      number: "48+",
      label: "Intelligent Projects Built",
      icon: <Award className="w-5 h-5 text-[#00D9FF]" />,
      desc: "Custom AI instances, localized natural language tools, and offline-first ERP enterprise architectures successfully deployed.",
    },
    {
      id: "stat-2",
      number: "120+",
      label: "Businesses Served",
      icon: <Zap className="w-5 h-5 text-[#00D9FF]" />,
      desc: "Empowering regional manufacturing leaders, agro-distributors, modern hospital systems, and NGOs across Africa.",
    },
    {
      id: "stat-3",
      number: "99.4%",
      label: "Satisfaction Rate",
      icon: <Smile className="w-5 h-5 text-emerald-400" />,
      desc: "Demonstrating deep commitment to premium product craftsmanship, responsive design, and post-launch maintenance.",
    },
    {
      id: "stat-4",
      number: "25k+",
      label: "Hours Automated Yearly",
      icon: <Clock className="w-5 h-5 text-[#00D9FF]" />,
      desc: "Replacing error-prone paper workflows and administrative tasks with robust backend triggers and API pipelines.",
    },
  ];

  const highlights = [
    {
      title: "Fixed-Fee & Timeline Guarantee",
      desc: "Zero budget overruns or hidden surprise bills. Every engagement includes milestone-based deliverables with defined SLAs and a 24-hour proposal commitment.",
    },
    {
      title: "Built For Regional Infrastructure",
      desc: "We engineer systems specifically for African market realities—offline-first local state sync, low-bandwidth optimization, and native MTN/Airtel Mobile Money triggers.",
    },
    {
      title: "100% Code & IP Ownership",
      desc: "You retain total intellectual property ownership of all custom source code, trained model embeddings, Docker container scripts, and database schemas with zero vendor lock-in.",
    },
  ];

  return (
    <section id="trust" className="py-24 bg-[#05070A] border-t border-gray-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 text-left">
            <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
              Corporate Trust
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-6">
              Why African Businesses Choose Bright Wave
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="font-sans text-gray-400 text-lg leading-relaxed font-light">
              We bridge the gap between complex artificial intelligence algorithms and practical everyday business problems. Our custom software is secure, modular, beautifully designed, and guaranteed to increase your operational efficiency.
            </p>
          </div>
        </div>

        {/* Highlight pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {highlights.map((h, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="p-6 rounded-xl bg-[#071A35]/10 border border-gray-900 flex flex-col gap-4 text-left"
            >
              <h3 className="font-display font-bold text-lg text-[#00D9FF]">
                {h.title}
              </h3>
              <p className="font-sans text-sm text-gray-400 leading-relaxed font-light">
                {h.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Numerical metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="glass-panel p-6 rounded-2xl flex flex-col items-start gap-4 text-left border border-gray-900 shimmer-border"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                  {stat.number}
                </span>
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-sm text-white mb-2">
                  {stat.label}
                </h3>
                <p className="font-sans text-xs text-gray-400 leading-relaxed font-light">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
