import { useState } from "react";
import { 
  ShoppingBag, GraduationCap, HeartPulse, Building2, HardHat, Factory, Sprout, Home, Landmark, Users, CreditCard,
  ArrowRight, ShieldCheck, AlertCircle, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const industriesData = [
  {
    id: "ind-agri",
    name: "Agriculture",
    icon: <Sprout className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "Scattered smallholders, erratic supply networks, manual inventory logs, and dispatch delays waste fresh produce.",
    solution: "Offline-first distribution ERPs with localized SMS alerts, predictive ML cash forecasting, and automated inventory sync.",
    impact: "Boosts produce dispatch speed by 40% and coordinates rural delivery networks seamlessly.",
    accent: "from-green-500/10 to-emerald-500/5"
  },
  {
    id: "ind-health",
    name: "Healthcare",
    icon: <HeartPulse className="w-5 h-5 text-emerald-400" />,
    challenge: "Extreme paperwork backlog, illegible medical history, and slow emergency triage endanger lives.",
    solution: "Secure, compliant Document AI engines that digitize physical charts coupled with automated triage AI assistants.",
    impact: "Reduces clinical file retrieval time by 82% and expands outpatient capacity.",
    accent: "from-emerald-500/10 to-[#00D9FF]/5"
  },
  {
    id: "ind-finance",
    name: "Financial Services",
    icon: <CreditCard className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "Executive boards lack real-time visibility into thousands of rural agent banking nodes, delaying macro decisions.",
    solution: "Secure real-time transaction streaming dashboards with automated cash-out forecasting ML algorithms.",
    impact: "Minimizes agent cashout downtime by 91% and saves thousands in idle cash allocation.",
    accent: "from-[#00D9FF]/10 to-indigo-500/5"
  },
  {
    id: "ind-retail",
    name: "Retail & E-commerce",
    icon: <ShoppingBag className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "High checkout abandonment on web-shops; slow response on social chat networks.",
    solution: "End-to-end official WhatsApp commerce automation with mobile payments and invoice dispatch.",
    impact: "Drives customer checkout up by 34% and automates 92% of tracking queries.",
    accent: "from-[#00D9FF]/10 to-purple-500/5"
  },
  {
    id: "ind-ngo",
    name: "NGOs",
    icon: <Users className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "Inefficient field survey aggregation, delayed grant reporting, and disconnected target statistics.",
    solution: "Unified cloud data portals, custom localized reporting frameworks, and offline survey aggregators.",
    impact: "Accelerates international donor report preparation and enhances data collection integrity.",
    accent: "from-blue-500/10 to-cyan-500/5"
  },
  {
    id: "ind-edu",
    name: "Education",
    icon: <GraduationCap className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "Disorganized student records, chaotic manual booking registers, and manual tuition logging.",
    solution: "Student information systems with built-in MTN / Airtel Money tuition automated checkout.",
    impact: "Eliminated tuition double-entry mistakes and speeded up enrollment by 70%.",
    accent: "from-amber-500/10 to-orange-500/5"
  },
  {
    id: "ind-hospitality",
    name: "Hospitality",
    icon: <Building2 className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "Double booking errors, slow booking confirmations, and poor off-hours guest services.",
    solution: "Custom booking engines synced with WhatsApp reservation AI bots and dynamic pricing engines.",
    impact: "Boosts room occupancy rate and eliminates human catalog booking overlap.",
    accent: "from-rose-500/10 to-pink-500/5"
  },
  {
    id: "ind-const",
    name: "Construction",
    icon: <HardHat className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "Theft of raw inventory, misaligned supplier logistics, and poor project cost tracking.",
    solution: "ERP materials ledger tracks dispatches instantly, coupled with automatic budget overflow alerts.",
    impact: "Reduces inventory leakage by 15% and guarantees projects stay on budget.",
    accent: "from-yellow-500/10 to-amber-500/5"
  },
  {
    id: "ind-manuf",
    name: "Manufacturing",
    icon: <Factory className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "Machine downtime bottlenecks, paper machine logs, and disorganized inventory pipelines.",
    solution: "Predictive maintenance schedules coupled with barcode tracking systems on custom inventory dashboards.",
    impact: "Minimizes assembly-line bottleneck pauses and automates parts restocking.",
    accent: "from-cyan-500/10 to-blue-500/5"
  },
  {
    id: "ind-realestate",
    name: "Real Estate",
    icon: <Home className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "Chaotic tenant rental tracing, unlogged maintenance requests, and manual ledger reconciliation.",
    solution: "Tenant dashboard portal with automatic rent collection alerts and integrated maintenance routing.",
    impact: "Saves hours in monthly accounts management and keeps tenant collections at 98.7%.",
    accent: "from-violet-500/10 to-purple-500/5"
  },
  {
    id: "ind-gov",
    name: "Government",
    icon: <Landmark className="w-5 h-5 text-[#00D9FF]" />,
    challenge: "Siloed physical document folders, zero public tracking transparency, and cyber security threats.",
    solution: "High-security digital record archives, custom citizen portals, and strict cryptographic access controls.",
    impact: "Guarantees ultimate document security and cuts public service wait times in half.",
    accent: "from-indigo-500/10 to-sky-500/5"
  }
];

export default function Industries() {
  const [activeTab, setActiveTab] = useState(industriesData[0].id);

  const selectedIndustry = industriesData.find(i => i.id === activeTab) || industriesData[0];

  return (
    <section id="industries" className="py-24 bg-[#05070A] relative border-t border-gray-900">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-radial-glow opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-6 text-left">
            <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
              Sectors of Impact
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Designed for Africa&apos;s Economic Sectors
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="font-sans text-gray-400 text-lg leading-relaxed font-light text-left">
              Whether you are an agro-distributor in Kasese, an NGO in Kampala, or a financial network across Kenya and Tanzania, our software is engineered for your unique environment.
            </p>
          </div>
        </div>

        {/* Tab Selection Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Industry Selection Buttons (Left/Top) */}
          <div className="lg:col-span-5 flex flex-wrap lg:flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {industriesData.map((ind) => (
              <button
                id={`industry-tab-${ind.id}`}
                key={ind.id}
                onClick={() => setActiveTab(ind.id)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border text-left transition-all duration-300 w-full cursor-pointer ${
                  activeTab === ind.id
                    ? "bg-[#071A35]/30 border-[#00D9FF]/40 shadow-md shadow-[#00D9FF]/5 text-white"
                    : "bg-transparent border-gray-950 hover:bg-[#071A35]/10 hover:border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                <div className={`p-2 rounded-lg transition-all ${
                  activeTab === ind.id ? "bg-[#00D9FF]/20" : "bg-gray-900"
                }`}>
                  {ind.icon}
                </div>
                <span className="font-display font-medium text-sm tracking-wide">
                  {ind.name}
                </span>
              </button>
            ))}
          </div>

          {/* Solution Explanation Panel (Right) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndustry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl glass-panel p-8 h-full border border-[#00D9FF]/10 flex flex-col justify-between shimmer-border relative bg-gradient-to-br ${selectedIndustry.accent}`}
              >
                {/* Background lighting */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D9FF]/5 rounded-full blur-2xl pointer-events-none" />

                <div className="text-left space-y-6">
                  {/* Title & Icon Header */}
                  <div className="flex items-center gap-4 border-b border-gray-800/80 pb-5">
                    <div className="w-12 h-12 rounded-xl bg-gray-950 flex items-center justify-center border border-[#00D9FF]/20">
                      {selectedIndustry.icon}
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-gray-400 tracking-widest uppercase">
                        INDUSTRY FOCUS
                      </span>
                      <h3 className="font-display font-bold text-2xl text-white">
                        {selectedIndustry.name}
                      </h3>
                    </div>
                  </div>

                  {/* Challenge block */}
                  <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 mt-1 shrink-0 border border-rose-500/20">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-sm text-gray-300 mb-1">
                        The Core Challenge
                      </h4>
                      <p className="font-sans text-sm text-gray-400 leading-relaxed font-light">
                        {selectedIndustry.challenge}
                      </p>
                    </div>
                  </div>

                  {/* Bright Wave Solution */}
                  <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] mt-1 shrink-0 border border-[#00D9FF]/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-sm text-[#00D9FF] mb-1">
                        Bright Wave Solution
                      </h4>
                      <p className="font-sans text-sm text-gray-300 leading-relaxed font-light">
                        {selectedIndustry.solution}
                      </p>
                    </div>
                  </div>

                  {/* business impact */}
                  <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-1 shrink-0 border border-emerald-500/20">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-sm text-emerald-400 mb-1">
                        Business Impact
                      </h4>
                      <p className="font-sans text-sm text-gray-300 leading-relaxed font-semibold">
                        {selectedIndustry.impact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-8 mt-6 border-t border-gray-800/80">
                  <button
                    id={`industry-consult-btn-${selectedIndustry.id}`}
                    onClick={() => {
                      const element = document.getElementById("contact");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="group flex items-center gap-2 text-xs font-semibold text-[#00D9FF] hover:text-white transition-colors cursor-pointer"
                  >
                    Discuss agricultural / enterprise automation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
