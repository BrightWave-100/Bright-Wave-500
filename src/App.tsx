import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Trust from "./components/Trust";
import Services from "./components/Services";
import Industries from "./components/Industries";
import Process from "./components/Process";
import Portfolio from "./components/Portfolio";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [adminOpen, setAdminOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Scroll to custom section target
  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Automated viewport tracker for active nav links
  useEffect(() => {
    const sections = ["home", "services", "industries", "portfolio", "process", "pricing", "blog", "contact"];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRefreshAll = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="bg-[#05070A] min-h-screen text-white relative">
      {/* Background Grid Accent overlay across the whole site */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02] bg-[linear-gradient(rgba(0,217,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Atmospheric Glowing Elements */}
      <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#071A35] rounded-full blur-[120px] opacity-40 pointer-events-none z-0" />
      <div className="fixed bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-[#00D9FF] rounded-full blur-[150px] opacity-10 pointer-events-none z-0" />

      {/* Primary Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={navigateToSection}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Assembly Stream */}
      <main className="relative z-10">
        <Hero onNavigate={navigateToSection} />
        
        <Trust key={`trust-${refreshTrigger}`} />
        
        <Services key={`services-${refreshTrigger}`} />
        
        <Industries key={`industries-${refreshTrigger}`} />
        
        <Process key={`process-${refreshTrigger}`} />
        
        <Portfolio key={`portfolio-${refreshTrigger}`} />
        
        <Pricing key={`pricing-${refreshTrigger}`} />
        
        <Testimonials key={`testimonials-${refreshTrigger}`} />
        
        <FAQ key={`faq-${refreshTrigger}`} />
        
        <Blog key={`blog-${refreshTrigger}`} />
        
        <Contact key={`contact-${refreshTrigger}`} />
      </main>

      {/* Footer Branding Column */}
      <Footer onNavigate={navigateToSection} />

      {/* Immersive Floating AI Concierge bot */}
      <AIAssistant />

      {/* Secure Administration Control Center Panel */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onRefreshAll={handleRefreshAll}
      />
    </div>
  );
}
