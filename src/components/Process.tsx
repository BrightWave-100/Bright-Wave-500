import { motion } from "motion/react";
import { 
  Eye, Compass, Layers, Code, CheckSquare, CloudLightning, GraduationCap, LifeBuoy
} from "lucide-react";

const processSteps = [
  {
    phase: "01",
    name: "Discovery & Audit",
    icon: <Eye className="w-5 h-5 text-[#00D9FF]" />,
    description: "We audit your legacy processes, inspect physical paper workflows, map software dependencies, and document immediate business constraints.",
    deliverable: "Strategic Process Map & Scope Outline"
  },
  {
    phase: "02",
    name: "AI & Tech Strategy",
    icon: <Compass className="w-5 h-5 text-[#00D9FF]" />,
    description: "We architect the target software systems, select models (e.g. Gemini), design DB schemas, and draft payment/SMS gateways.",
    deliverable: "Architecture Plan & Data Security Protocol"
  },
  {
    phase: "03",
    name: "UX & Product Design",
    icon: <Layers className="w-5 h-5 text-[#00D9FF]" />,
    description: "We create pixel-perfect Interactive prototypes, mapping out clean user interfaces, touch targets, and typography layouts.",
    deliverable: "Figma High-Fidelity Design Prototypes"
  },
  {
    phase: "04",
    name: "Robust Development",
    icon: <Code className="w-5 h-5 text-emerald-400" />,
    description: "Our engineers build secure, modular full-stack systems. We implement offline-first sync registries and build private LLM models.",
    deliverable: "Production Codebase & API Integrations"
  },
  {
    phase: "05",
    name: "Surgical Quality Testing",
    icon: <CheckSquare className="w-5 h-5 text-[#00D9FF]" />,
    description: "We execute deep automated checks, WCAG accessibility validations, simulated connection drops, and load capacity audits.",
    deliverable: "Lighthouse Audit Certificate & Test Registry"
  },
  {
    phase: "06",
    name: "Safe Container Deployment",
    icon: <CloudLightning className="w-5 h-5 text-[#00D9FF]" />,
    description: "We build isolated Docker containers, launch server nodes behind NGINX proxies, and coordinate stable cloud integrations.",
    deliverable: "Live Cloud Service & Domain Ingress"
  },
  {
    phase: "07",
    name: "Empowering Team Training",
    icon: <GraduationCap className="w-5 h-5 text-[#00D9FF]" />,
    description: "We conduct hands-on developer walk-throughs, host administrative dashboard instruction labs, and share screen-record tutorials.",
    deliverable: "Staff Training Labs & Operational Manuals"
  },
  {
    phase: "08",
    name: "Ongoing Active Support",
    icon: <LifeBuoy className="w-5 h-5 text-emerald-400" />,
    description: "We monitor systems, apply server security patches, manage database backups, and continuously adjust AI models for performance.",
    deliverable: "Dedicated Support Slack & Priority Ticketing"
  }
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-[#05070A] relative border-t border-gray-900 overflow-hidden">
      {/* Wave Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] bg-[#00D9FF]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
            Proven Delivery
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-6">
            The Bright Wave Engineering Roadmap
          </h2>
          <p className="font-sans text-gray-400 text-base leading-relaxed font-light">
            We follow a structured, modern delivery framework to take your project from conceptual business goals to highly reliable production code.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative mt-12 max-w-4xl mx-auto">
          {/* Vertical Center Connection Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00D9FF]/40 via-[#071A35]/30 to-gray-950 -translate-x-1/2 z-0" />

          {/* Timeline Nodes */}
          <div className="space-y-12">
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center justify-between z-10 w-full">
                  {/* Left block for even items (only shown on md/lg desktop) */}
                  <div className={`hidden md:block w-[44%] text-right ${isEven ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="glass-panel p-6 rounded-2xl border border-gray-900 shimmer-border inline-block max-w-md"
                      >
                        <span className="font-mono text-xs text-[#00D9FF] font-semibold tracking-wider block mb-1">
                          PHASE {step.phase}
                        </span>
                        <h3 className="font-display font-bold text-lg text-white mb-2">
                          {step.name}
                        </h3>
                        <p className="font-sans text-xs text-gray-400 leading-relaxed mb-4 font-light text-right">
                          {step.description}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-[#00D9FF]/5 border border-[#00D9FF]/20 px-3 py-1 rounded-full text-[10px] text-[#00D9FF] font-mono">
                          DELIVERABLE: {step.deliverable}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Node Connector Bullet (Static center/left) */}
                  <div className="absolute left-6 md:left-1/2 w-10 h-10 -translate-x-1/2 bg-[#05070A] border-2 border-gray-900 rounded-full flex items-center justify-center shadow-lg shadow-black/80 group z-20">
                    <div className="w-7 h-7 bg-gray-950 rounded-full flex items-center justify-center border border-[#00D9FF]/20 group-hover:border-[#00D9FF]/50 transition-colors">
                      {step.icon}
                    </div>
                  </div>

                  {/* Right block for odd items (or mobile left) */}
                  <div className={`w-full md:w-[44%] pl-16 md:pl-0 text-left ${!isEven ? "md:opacity-100" : "md:opacity-0 md:pointer-events-none"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: 25 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="glass-panel p-6 rounded-2xl border border-gray-900 shimmer-border max-w-md"
                    >
                      <span className="font-mono text-xs text-[#00D9FF] font-semibold tracking-wider block mb-1">
                        PHASE {step.phase}
                      </span>
                      <h3 className="font-display font-bold text-lg text-white mb-2">
                        {step.name}
                      </h3>
                      <p className="font-sans text-xs text-gray-400 leading-relaxed mb-4 font-light text-left">
                        {step.description}
                      </p>
                      <div className="inline-flex items-center gap-2 bg-[#00D9FF]/5 border border-[#00D9FF]/20 px-3 py-1 rounded-full text-[10px] text-[#00D9FF] font-mono">
                        DELIVERABLE: {step.deliverable}
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
