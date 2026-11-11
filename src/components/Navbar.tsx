import { useState, useEffect } from "react";
import { Menu, X, Cpu, ArrowRight, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ activeSection, onNavigate, onOpenAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Industries", id: "industries" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Process", id: "process" },
    { label: "Pricing", id: "pricing" },
    { label: "Blog", id: "blog" },
    { label: "Contact", id: "contact" },
  ];

  const handleItemClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#05070A]/85 backdrop-blur-md border-b border-[#00D9FF]/10 py-4 shadow-lg shadow-black/50"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            id="navbar-logo-btn"
            onClick={() => handleItemClick("home")}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00D9FF] to-[#0072FF] rounded-lg blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-10 h-10 bg-[#030712] border border-[#00D9FF]/30 rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
                <img
                  src="/brightwave-mark.svg"
                  alt="Bright Wave Official Logo"
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-lg tracking-wide text-white block">
                BRIGHT WAVE
              </span>
              <span className="text-[10px] text-[#00D9FF] font-mono tracking-widest block -mt-1 font-medium">
                INTELLIGENCE IN MOTION
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                id={`nav-link-${item.id}`}
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative font-sans text-sm tracking-wide font-medium cursor-pointer transition-colors duration-300 ${
                  activeSection === item.id
                    ? "text-[#00D9FF]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#00D9FF]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              id="navbar-admin-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-full px-3.5 py-1.5 transition-all cursor-pointer font-mono"
            >
              <Shield className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00D9FF]" />
              Admin Portal
            </button>
            <button
              id="navbar-cta-btn"
              onClick={() => handleItemClick("contact")}
              className="relative group overflow-hidden bg-gradient-to-r from-[#00D9FF] to-[#071A35] text-white font-sans text-sm font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-[#00D9FF]/20 transition-all cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                Consult Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            id="mobile-menu-trigger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-fullscreen-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#030712]/98 backdrop-blur-lg flex flex-col justify-between pt-20 pb-10 px-8 lg:hidden"
          >
            <div className="flex flex-col gap-6 mt-4">
              {/* Mobile Drawer Brand Logo Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-800/80">
                <div className="w-10 h-10 bg-[#030712] border border-[#00D9FF]/30 rounded-lg flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                  <img
                    src="/brightwave-mark.svg"
                    alt="Bright Wave Official Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-display font-bold text-base tracking-wide text-white block">
                    BRIGHT WAVE
                  </span>
                  <span className="text-[9px] text-[#00D9FF] font-mono tracking-widest block -mt-0.5 font-medium">
                    INTELLIGENCE IN MOTION
                  </span>
                </div>
              </div>

              {navItems.map((item, index) => (
                <motion.button
                  id={`mobile-nav-link-${item.id}`}
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-left font-display font-semibold text-2xl tracking-wide ${
                    activeSection === item.id ? "text-[#00D9FF]" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-4 border-t border-gray-800/80 pt-8"
            >
              <button
                id="mobile-navbar-admin-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center justify-center gap-2 w-full text-sm text-gray-300 bg-gray-900/60 border border-gray-800 rounded-lg py-3 hover:text-white font-mono"
              >
                <Shield className="w-4 h-4" />
                Administrative Access
              </button>
              <button
                id="mobile-navbar-cta-btn"
                onClick={() => handleItemClick("contact")}
                className="w-full bg-[#00D9FF] text-[#05070A] font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-[#00D9FF]/20"
              >
                Book Free Consultation
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
