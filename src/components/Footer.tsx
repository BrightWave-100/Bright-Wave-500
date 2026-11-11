import { Cpu, Github, Linkedin, Twitter, MessageSquare, ArrowUpRight } from "lucide-react";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const socialLinks = [
    { icon: <Linkedin className="w-4 h-4" />, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Twitter className="w-4 h-4" />, url: "https://twitter.com", label: "Twitter" },
    { icon: <Github className="w-4 h-4" />, url: "https://github.com", label: "GitHub" },
    { icon: <MessageSquare className="w-4 h-4" />, url: "https://wa.me/256781132887", label: "WhatsApp" },
  ];

  const serviceLinks = [
    { label: "Artificial Intelligence", id: "services" },
    { label: "Hyper-Automation", id: "services" },
    { label: "Enterprise Software", id: "services" },
    { label: "Web Engineering", id: "services" },
    { label: "Native Mobile Apps", id: "services" },
    { label: "Data & Analytics", id: "services" },
  ];

  const resourceLinks = [
    { label: "Corporate Blog", id: "blog" },
    { label: "Milestone Process", id: "process" },
    { label: "Budget Packages", id: "pricing" },
    { label: "Industries Served", id: "industries" },
    { label: "Free Scoping Session", id: "contact" },
  ];

  return (
    <footer className="bg-[#05070A] border-t border-gray-950 pt-20 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16 text-left">
        {/* Company Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("home")}>
            <div className="w-9 h-9 bg-[#030712] border border-[#00D9FF]/30 rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
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
              <span className="text-[9px] text-[#00D9FF] font-mono tracking-widest block -mt-1 font-medium">
                INTELLIGENCE IN MOTION
              </span>
            </div>
          </div>

          <p className="font-sans text-xs text-gray-400 leading-relaxed font-light max-w-sm">
            Bright Wave is Uganda&apos;s premier Artificial Intelligence and Software Engineering company, empowering African businesses through pixel-perfect layouts, automation, and offline-first software.
          </p>

          <div className="flex gap-2.5">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="w-8 h-8 rounded-lg bg-gray-950 border border-gray-900 flex items-center justify-center text-gray-500 hover:text-[#00D9FF] hover:border-[#00D9FF]/20 transition-all cursor-pointer"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Services Column */}
        <div className="lg:col-span-2.5 space-y-4">
          <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">
            Capabilities
          </h4>
          <ul className="space-y-2.5">
            {serviceLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  id={`footer-serv-link-${idx}`}
                  onClick={() => onNavigate(link.id)}
                  className="font-sans text-xs text-gray-400 hover:text-[#00D9FF] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Column */}
        <div className="lg:col-span-2.5 space-y-4">
          <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">
            Resources
          </h4>
          <ul className="space-y-2.5">
            {resourceLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  id={`footer-res-link-${idx}`}
                  onClick={() => onNavigate(link.id)}
                  className="font-sans text-xs text-gray-400 hover:text-[#00D9FF] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Hub Location column */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">
            Contact
          </h4>
          <ul className="space-y-2.5 font-sans text-xs text-gray-400 font-light">
            <li>Remote • Kampala, Uganda</li>
            <li>+256 781 132 887</li>
            <li className="pt-2 border-t border-gray-950">
              <a href="mailto:intelligence@brightwave.ug" className="text-[#00D9FF] hover:underline flex items-center gap-1">
                E-mail Intake
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Corporate bottom credit links bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-gray-950 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] text-gray-500">
        <div className="flex gap-2">
          <span>&copy; {new Date().getFullYear()} BRIGHT WAVE UGANDA LTD.</span>
          <span>•</span>
          <span>ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-gray-400">PRIVACY PROTOCOL</a>
          <a href="#terms" className="hover:text-gray-400">TERMS OF OPERATION</a>
          <span className="text-[#00D9FF]">KAMPALA, UGANDA</span>
        </div>
      </div>
    </footer>
  );
}
