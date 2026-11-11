import { useState, useEffect } from "react";
import { 
  Building, Briefcase, TrendingUp, Layers, Check, X, ShieldCheck, Play, ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioProject } from "../types";

export default function Portfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch from Express API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ["All", "AI", "Software", "Automation", "Data"];

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-[#05070A] relative border-t border-gray-900">
      {/* Background glow curves */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#00D9FF]/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#071A35]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 mb-16">
          <div className="text-left">
            <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
              Proven Case Studies
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Crafting Excellence in Motion
            </h2>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-950 border border-gray-900 p-1.5 rounded-xl">
            {categories.map((cat) => (
              <button
                id={`portfolio-cat-filter-${cat}`}
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider font-sans cursor-pointer transition-all ${
                  activeCategory === cat
                    ? "bg-[#071A35] border border-[#00D9FF]/20 text-white shadow-md shadow-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-gray-950 animate-pulse border border-gray-900" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedProject(project)}
                  className="glass-panel rounded-2xl overflow-hidden border border-gray-900 hover:border-[#00D9FF]/25 cursor-pointer flex flex-col group shimmer-border"
                >
                  {/* Hero image with dark mask */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-950">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 left-4">
                      <span className="font-mono text-[9px] font-semibold tracking-widest uppercase bg-[#00D9FF]/20 text-[#00D9FF] px-3 py-1 rounded-full border border-[#00D9FF]/30 backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-8 text-left flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-3 font-mono text-[10px] text-gray-400 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3 h-3 text-gray-500" />
                          {project.client}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3 h-3 text-gray-500" />
                          {project.industry}
                        </span>
                      </div>
                      <h3 className="font-display font-extrabold text-xl text-white mb-4 group-hover:text-[#00D9FF] transition-colors leading-tight">
                        {project.title}
                      </h3>
                      <p className="font-sans text-xs text-gray-400 leading-relaxed font-light mb-6 line-clamp-3">
                        {project.challenge}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-900 pt-5 mt-auto">
                      <span className="text-xs text-[#00D9FF] font-semibold group-hover:text-white transition-colors flex items-center gap-1.5 font-sans">
                        See Engineering Study
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="font-mono text-[8px] text-gray-400 bg-gray-900 border border-gray-800/80 px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Case Study Detail overlay modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              id="portfolio-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            <motion.div
              id="portfolio-modal-body"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl bg-[#05070A] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto shimmer-border"
            >
              {/* Close Button */}
              <button
                id="close-portfolio-modal-btn"
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-white border border-gray-800 rounded-lg bg-[#05070A]/85 backdrop-blur-md hover:border-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Hero Image panel */}
              <div className="relative aspect-[21/9] bg-gray-950">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] to-transparent" />
                <div className="absolute bottom-6 left-8 text-left">
                  <span className="font-mono text-[9px] font-semibold bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedProject.category} STUDY
                  </span>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-3 leading-tight">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Modal Details Grid */}
              <div className="p-8 sm:p-10 text-left grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left panel details */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Challenge */}
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#00D9FF] tracking-wider uppercase mb-2">
                      The Challenge
                    </h4>
                    <p className="font-sans text-sm text-gray-300 leading-relaxed font-light">
                      {selectedProject.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div>
                    <h4 className="font-display font-bold text-sm text-emerald-400 tracking-wider uppercase mb-2">
                      The Bright Wave Solution
                    </h4>
                    <p className="font-sans text-sm text-gray-300 leading-relaxed font-light">
                      {selectedProject.solution}
                    </p>
                  </div>

                  {/* Business impact */}
                  <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4">
                    <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display font-bold text-sm text-emerald-400 uppercase tracking-wider mb-1">
                        Commercial Impact
                      </h4>
                      <p className="font-sans text-sm text-gray-200 leading-relaxed font-semibold">
                        {selectedProject.businessImpact}
                      </p>
                    </div>
                  </div>

                  {/* Screen gallery mockup if available */}
                  <div>
                    <h4 className="font-display font-bold text-xs text-gray-400 uppercase tracking-wider mb-4">
                      Screenshots &amp; Visual Interfaces
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProject.gallery?.map((img, i) => (
                        <div key={i} className="aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                          <img src={img} alt="Interface mock" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="aspect-video rounded-lg border-2 border-dashed border-gray-850 bg-gray-950/40 flex flex-col justify-center items-center text-center p-4">
                        <Play className="w-5 h-5 text-[#00D9FF] mb-2 fill-[#00D9FF]/20" />
                        <span className="font-mono text-[9px] text-gray-500 block">DEMONSTRATION VIDEO</span>
                        <span className="font-sans text-[10px] text-gray-400 block font-light">Available in full discovery package</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right metadata index panel */}
                <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-gray-900 lg:pl-8">
                  <div>
                    <h4 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Client</h4>
                    <span className="font-sans text-sm text-white font-medium block">{selectedProject.client}</span>
                  </div>

                  <div>
                    <h4 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Industry Sector</h4>
                    <span className="font-sans text-sm text-white font-medium block">{selectedProject.industry}</span>
                  </div>

                  <div>
                    <h4 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Technologies Deployed</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies.map((tech) => (
                        <span key={tech} className="font-mono text-[9px] text-gray-300 bg-gray-950 border border-gray-800 px-2.5 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-900">
                    <button
                      id="close-modal-and-consult-btn"
                      onClick={() => {
                        setSelectedProject(null);
                        const element = document.getElementById("contact");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="w-full bg-[#00D9FF] hover:bg-[#00D9FF]/95 text-[#05070A] font-semibold text-xs py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-md shadow-[#00D9FF]/10 transition-all cursor-pointer"
                    >
                      Inquire on this system build
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
