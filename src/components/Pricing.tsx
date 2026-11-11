import { Check, Info, ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface PricingTier {
  name: string;
  badge: string;
  pricePrefix?: string;
  price: string;
  timeline: string;
  description: string;
  popular: boolean;
  cta: string;
  deliverables: string[];
  accent: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "AI Launch",
    badge: "Best for Small Businesses",
    pricePrefix: "Starting from",
    price: "$800",
    timeline: "2–3 Weeks",
    description: "Perfect for businesses looking to automate customer interactions, improve response times, and reduce repetitive work using AI.",
    popular: false,
    cta: "Book Free Consultation",
    deliverables: [
      "AI-powered WhatsApp assistant",
      "Customer enquiry automation",
      "Mobile Money integration",
      "Lead capture automation",
      "Business knowledge base",
      "Admin training",
      "Full source code ownership",
      "14 days post-launch support",
    ],
    accent: "border-gray-900 bg-[#071A35]/10 hover:border-[#00D9FF]/30"
  },
  {
    name: "Growth Engine",
    badge: "Most Popular",
    pricePrefix: "Starting from",
    price: "$2,500",
    timeline: "4–6 Weeks",
    description: "Designed for growing businesses that need smarter operations, improved customer management, and scalable digital systems.",
    popular: true,
    cta: "Book Growth Consultation",
    deliverables: [
      "Everything in AI Launch",
      "Business dashboard",
      "Customer management",
      "Automated invoices",
      "Payment automation",
      "Multi-user admin system",
      "Offline-first support where appropriate",
      "Priority support",
    ],
    accent: "border-[#00D9FF]/40 bg-[#071A35]/25 shadow-xl shadow-[#00D9FF]/5 ring-1 ring-[#00D9FF]/20"
  },
  {
    name: "Enterprise Solutions",
    badge: "Enterprise",
    pricePrefix: undefined,
    price: "Custom Quote",
    timeline: "Project Based",
    description: "Enterprise software and AI systems built for organizations with complex operations, multiple departments, and long-term digital transformation goals.",
    popular: false,
    cta: "Schedule Enterprise Consultation",
    deliverables: [
      "Enterprise software",
      "AI automation",
      "ERP integrations",
      "Secure cloud deployment",
      "Staff training",
      "Dedicated project management",
      "Long-term maintenance",
    ],
    accent: "border-gray-900 bg-[#071A35]/10 hover:border-[#00D9FF]/30"
  },
  {
    name: "Innovation Lab",
    badge: "Strategy",
    pricePrefix: undefined,
    price: "Let's Talk",
    timeline: "Custom Roadmap",
    description: "For organizations exploring new technology ideas, AI initiatives, research projects, or digital transformation strategies.",
    popular: false,
    cta: "Book Strategy Session",
    deliverables: [
      "AI strategy consulting",
      "Technology roadmap",
      "Proof of concept",
      "Architecture design",
      "Technical audits",
      "Innovation workshops",
      "Long-term advisory",
    ],
    accent: "border-gray-900 bg-[#071A35]/10 hover:border-[#00D9FF]/30"
  }
];

export default function Pricing() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[#05070A] relative border-t border-gray-900">
      {/* Background radial illumination */}
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-[#00D9FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
            Transparent Investment
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-6">
            Transparent, Value-Driven Investment
          </h2>
          <p className="font-sans text-gray-400 text-base sm:text-lg leading-relaxed font-light">
            Every business is different, so every solution we build is carefully tailored to your goals. Our pricing is transparent, milestone-based, and designed to deliver measurable business value without hidden costs.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {pricingTiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between text-left relative group transition-all duration-300 shimmer-border ${tier.accent}`}
            >
              {/* Popular Floating Badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00D9FF] to-[#0088A8] text-[#05070A] text-[10px] font-black tracking-widest uppercase py-1 px-4 rounded-full shadow-lg shadow-[#00D9FF]/20">
                  Most Popular
                </div>
              )}

              {/* Card Header & Content */}
              <div className="flex-1 flex flex-col">
                {/* Badge Tag */}
                <div className="mb-3">
                  <span className={`inline-block font-mono text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                    tier.popular 
                      ? "bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40" 
                      : "bg-gray-900 text-gray-300 border border-gray-800"
                  }`}>
                    {tier.badge}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-xl text-white mb-2">
                  {tier.name}
                </h3>
                
                <p className="font-sans text-xs text-gray-400 leading-relaxed font-light mb-6 min-h-[48px]">
                  {tier.description}
                </p>

                {/* Price block */}
                <div className="border-y border-gray-900/80 py-4 mb-6">
                  {tier.pricePrefix && (
                    <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                      {tier.pricePrefix}
                    </span>
                  )}
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    {tier.price}
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#00D9FF] mt-2">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{tier.timeline}</span>
                  </div>
                </div>

                {/* Deliverables checklist */}
                <div className="mb-8 flex-1">
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-semibold block mb-3">
                    Deliverables
                  </span>
                  <ul className="space-y-2.5">
                    {tier.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-xs text-gray-300 font-sans">
                        <Check className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
                        <span className="font-light text-gray-300 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <button
                id={`pricing-tier-btn-${tier.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={scrollToContact}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase font-sans cursor-pointer transition-all flex items-center justify-center gap-2 mt-auto ${
                  tier.popular
                    ? "bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#05070A] shadow-md shadow-[#00D9FF]/20"
                    : "bg-gray-950 hover:bg-gray-900 text-white border border-gray-800 hover:border-gray-700"
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Tailored Scope Professional Note */}
        <div className="mt-12 p-6 rounded-2xl bg-[#071A35]/30 border border-gray-900 text-center max-w-4xl mx-auto shadow-inner">
          <p className="font-sans text-xs sm:text-sm text-gray-300 font-light leading-relaxed italic">
            "Every project is uniquely scoped to your business objectives. Final investment depends on project complexity, integrations, timeline, and ongoing support. Schedule a free consultation to receive a tailored proposal."
          </p>
        </div>

        {/* Trust Indicators Section */}
        <div className="mt-12 pt-10 border-t border-gray-900">
          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 sm:gap-x-10 text-xs sm:text-sm font-sans text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D9FF] shrink-0" />
              <span className="font-medium">Free Initial Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D9FF] shrink-0" />
              <span className="font-medium">Transparent Milestone Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D9FF] shrink-0" />
              <span className="font-medium">100% Source Code Ownership</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D9FF] shrink-0" />
              <span className="font-medium">No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00D9FF] shrink-0" />
              <span className="font-medium">Ongoing Support Available</span>
            </div>
          </div>
        </div>

        {/* Regional Multi-Channel Payment Readiness Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-gray-950/60 border border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          <div className="flex gap-3.5 items-center max-w-2xl">
            <div className="w-9 h-9 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center border border-[#00D9FF]/20 shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00D9FF]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs sm:text-sm text-white">
                Frictionless East African & Global Payment Integration
              </h4>
              <p className="font-sans text-xs text-gray-400 font-light mt-0.5">
                Native support for MTN Mobile Money, Airtel Money, Flutterwave, Pesapal, Visa, Mastercard, and international bank transfers.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] text-gray-400 font-semibold tracking-wider">
            <span className="bg-gray-900 px-2.5 py-1 rounded border border-gray-800">MTN MOMO</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded border border-gray-800">AIRTEL MONEY</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded border border-gray-800">PESAPAL</span>
            <span className="bg-gray-900 px-2.5 py-1 rounded border border-gray-800">FLUTTERWAVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

