import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Server, Layers, Cpu, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle canvas animation of neural net and intelligence waves
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Handle resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Nodes array
    const nodeCount = 45;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      });
    }

    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing background gradients
      ctx.fillStyle = "#05070A";
      ctx.fillRect(0, 0, width, height);

      // Draw ambient grid
      ctx.strokeStyle = "rgba(0, 217, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw intelligence wave curves
      phase += 0.005;
      ctx.beginPath();
      ctx.lineWidth = 2;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, "rgba(7, 26, 53, 0.4)");
      gradient.addColorStop(0.5, "rgba(0, 217, 255, 0.3)");
      gradient.addColorStop(1, "rgba(7, 26, 53, 0.4)");
      ctx.strokeStyle = gradient;

      for (let x = 0; x < width; x += 5) {
        const yOffset = Math.sin(x * 0.003 + phase) * 60 + Math.cos(x * 0.001 + phase * 1.5) * 30;
        const y = height * 0.65 + yOffset;
        if (x === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Second overlay wave
      ctx.beginPath();
      ctx.lineWidth = 1;
      const gradient2 = ctx.createLinearGradient(0, 0, width, 0);
      gradient2.addColorStop(0, "rgba(0, 217, 255, 0.02)");
      gradient2.addColorStop(0.5, "rgba(0, 217, 255, 0.15)");
      gradient2.addColorStop(1, "rgba(0, 217, 255, 0.02)");
      ctx.strokeStyle = gradient2;

      for (let x = 0; x < width; x += 5) {
        const yOffset = Math.sin(x * 0.002 - phase * 0.8) * 45 + Math.cos(x * 0.004 + phase) * 15;
        const y = height * 0.7 + yOffset;
        if (x === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 3. Draw neural net nodes and connect them
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Boundary checks
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Attract toward mouse slightly
        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const distToMouse = Math.hypot(dx, dy);
        if (distToMouse < 250) {
          node.x += (dx / distToMouse) * 0.15;
          node.y += (dy / distToMouse) * 0.15;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 217, 255, 0.5)";
        ctx.fill();
      });

      // Connect nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.13;
            ctx.strokeStyle = `rgba(0, 217, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-[#05070A]"
    >
      {/* Background Interactive Canvas */}
      <canvas
        ref={canvasRef}
        id="hero-canvas"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Decorative Radial Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#00D9FF]/10 to-[#071A35]/30 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Headline Content */}
        <div className="lg:col-span-7 text-left flex flex-col items-start">
          {/* Animated Uganda Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 border border-[#00D9FF]/20 bg-[#071A35]/40 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-6 font-mono text-xs text-[#00D9FF] tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
            UGANDA&apos;S PREMIER AI &amp; SOFTWARE FIRM
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-6"
          >
            Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] via-[#00A3FF] to-[#071A35]">Intelligent Software</span> for Africa&apos;s Future
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-gray-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl font-light"
          >
            Bright Wave helps African enterprises and high-growth companies automate operations, build secure offline-first custom software, deploy custom AI assistants, and cut operational overhead by up to 70%.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-6"
          >
            <button
              id="hero-primary-cta"
              onClick={() => onNavigate("contact")}
              className="group relative overflow-hidden bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#05070A] font-bold px-8 py-4 rounded-lg flex items-center justify-center gap-3 shadow-xl shadow-[#00D9FF]/25 hover:shadow-[#00D9FF]/45 transition-all cursor-pointer font-sans text-sm tracking-wide"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button
              id="hero-secondary-cta"
              onClick={() => onNavigate("portfolio")}
              className="group border border-gray-800 hover:border-[#00D9FF]/40 bg-gray-900/40 backdrop-blur-sm text-white hover:text-[#00D9FF] px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer font-sans text-sm font-semibold"
            >
              <Play className="w-4 h-4 fill-white group-hover:fill-[#00D9FF] group-hover:text-[#00D9FF] transition-colors" />
              Explore Case Studies
            </button>
          </motion.div>

          {/* Conversion Micro-Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-gray-400"
          >
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Free 30-Min Architecture Audit
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <CheckCircle className="w-3.5 h-3.5 text-[#00D9FF]" />
              Proposal Within 24 Hours
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <CheckCircle className="w-3.5 h-3.5 text-[#00D9FF]" />
              100% Code &amp; IP Ownership
            </span>
          </motion.div>
        </div>

        {/* Right Dashboard Graphics */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-[440px] aspect-[4/3] relative"
          >
            {/* Primary Glassmorphic Card (Main Node Panel) */}
            <div className="absolute inset-0 rounded-2xl glass-panel p-6 border border-[#00D9FF]/15 shadow-2xl flex flex-col justify-between overflow-hidden shimmer-border">
              {/* Card Background Glow */}
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#00D9FF]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-gray-800/80 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-ping" />
                  <span className="font-mono text-xs text-gray-400 tracking-wider uppercase">
                    Core Intelligence Node
                  </span>
                </div>
                <img src="/brightwave-mark.svg" alt="Bright Wave Logo" className="w-5 h-5 object-contain" />
              </div>

              {/* Graphical bars */}
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div>
                  <div className="flex justify-between text-xs font-mono text-gray-300 mb-1.5">
                    <span>AI Model Inferences</span>
                    <span className="text-[#00D9FF] font-semibold">99.2% Accurate</span>
                  </div>
                  <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "94%" }}
                      transition={{ duration: 1.5, delay: 0.6 }}
                      className="h-full bg-gradient-to-r from-[#00D9FF] to-[#071A35] rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-gray-300 mb-1.5">
                    <span>Workflow Stream</span>
                    <span className="text-emerald-400 font-semibold">Live System Sync</span>
                  </div>
                  <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "88%" }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-[#071A35] rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-800/80 pt-4 mt-4 font-mono text-[10px] text-gray-400">
                <span>REGION: KAMPALA / EAST-AFRICA</span>
                <span className="text-[#00D9FF]">ONLINE</span>
              </div>
            </div>

            {/* Floating Metric 1 (Operational Efficiency Upgrade) */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-10 -left-12 bg-gray-950/90 border border-gray-800 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xl shadow-black/80 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center border border-[#00D9FF]/20">
                <Server className="w-5 h-5 text-[#00D9FF]" />
              </div>
              <div>
                <span className="block font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                  Automation
                </span>
                <span className="block text-sm font-semibold font-display text-white">
                  +82% Processing Velocity
                </span>
              </div>
            </motion.div>

            {/* Floating Metric 2 (Transactions processed or uptime) */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -right-8 bg-gray-950/90 border border-[#00D9FF]/15 rounded-xl p-3.5 flex items-center gap-3.5 shadow-xl shadow-black/80 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="block font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
                  Client Trust
                </span>
                <span className="block text-sm font-semibold font-display text-white">
                  99.8% System SLA
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Animated Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" onClick={() => onNavigate("trust")}>
        <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">
          EXPLORE BRIGHT WAVE
        </span>
        <div className="w-6 h-10 border border-gray-700 rounded-full p-1 flex justify-center">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-[#00D9FF] rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
