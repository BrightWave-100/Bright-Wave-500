import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, X, Send, Sparkles, Cpu, HelpCircle, Calendar, Calculator, CornerDownLeft, Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "model",
      text: "Hello! I am the Bright Wave AI Assistant. I can help you explore our custom software engineering, AI solutions, business automation, enterprise cloud systems, and project pricing. How can I assist your business today?"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "faq" | "quote" | "book">("chat");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Quote generator state
  const [quoteService, setQuoteService] = useState("AI");
  const [quoteScale, setQuoteScale] = useState("Growth");
  const [quoteConnectivity, setQuoteConnectivity] = useState("Online");

  const calculateQuote = () => {
    let base = 2500;
    if (quoteService === "Software") base = 5000;
    if (quoteService === "Automation") base = 3500;
    if (quoteService === "Mobile") base = 4500;
    if (quoteService === "Data") base = 3000;

    const multiplier = quoteScale === "Enterprise" ? 2.2 : quoteScale === "Custom" ? 3.5 : 1.0;
    const offlineAdd = quoteConnectivity === "Offline-First" ? 1800 : 0;

    return Math.round(base * multiplier + offlineAdd);
  };

  const handleFAQClick = (question: string) => {
    setActiveTab("chat");
    handleSendMessage(question);
  };

  const cleanText = (raw: string): string => {
    if (!raw) return "";
    return raw
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^[*\-_=$/\s]{3,}\s*$/gm, "")
      .replace(/\${2,}/g, "")
      .replace(/\/{3,}/g, "")
      .replace(/#{2,}/g, "")
      .trim();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Map history for context
      const history = messages.slice(-5).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history })
      });

      if (res.ok) {
        const data = await res.json();
        const modelMsg: Message = {
          id: `model-${Date.now()}`,
          role: "model",
          text: cleanText(data.text)
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        const err = await res.json();
        const modelMsg: Message = {
          id: `model-err-${Date.now()}`,
          role: "model",
          text: `Error from server: ${err.error || "Failed to process chat session."}`
        };
        setMessages((prev) => [...prev, modelMsg]);
      }
    } catch (error) {
      const modelMsg: Message = {
        id: `model-err-${Date.now()}`,
        role: "model",
        text: "I am experiencing network connectivity limits with our server. Please leave a contact form in our contact section below."
      };
      setMessages((prev) => [...prev, modelMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="ai-assistant-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="relative group w-14 h-14 bg-gradient-to-r from-[#00D9FF] to-[#071A35] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#00D9FF]/20 hover:shadow-[#00D9FF]/40 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          {isOpen ? <X className="w-6 h-6 animate-spin" /> : <MessageSquare className="w-6 h-6" />}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-950/90 border border-gray-900 text-[10px] text-gray-300 px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono">
            Talk to AI Concierge
          </span>
        </button>
      </div>

      {/* Floating Chat Container Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-panel"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-full max-w-[380px] h-[550px] bg-[#05070A] border border-gray-800 rounded-2xl shadow-2xl z-40 overflow-hidden flex flex-col justify-between shimmer-border text-left"
          >
            {/* Header */}
            <div className="bg-gray-950 border-b border-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#030712] flex items-center justify-center border border-[#00D9FF]/25 p-1 overflow-hidden">
                  <img src="/brightwave-mark.svg" alt="Bright Wave Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-white leading-none mb-1">
                    Bright Wave AI
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[8px] text-gray-500 font-semibold tracking-wider uppercase">
                      Gemini-3.5-Flash Proxy Active
                    </span>
                  </div>
                </div>
              </div>
              <button
                id="close-ai-assistant-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-500 hover:text-white border border-gray-900 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In-app navigation shortcuts */}
            <div className="bg-gray-950 border-b border-gray-900 px-3 py-2 flex gap-1 justify-between text-[10px] font-mono">
              <button
                id="assistant-tab-chat"
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  activeTab === "chat" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Chat
              </button>
              <button
                id="assistant-tab-faq"
                onClick={() => setActiveTab("faq")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  activeTab === "faq" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400"
                }`}
              >
                <HelpCircle className="w-3 h-3" />
                FAQs
              </button>
              <button
                id="assistant-tab-quote"
                onClick={() => setActiveTab("quote")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  activeTab === "quote" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400"
                }`}
              >
                <Calculator className="w-3 h-3" />
                Quote
              </button>
              <button
                id="assistant-tab-book"
                onClick={() => setActiveTab("book")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  activeTab === "book" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400"
                }`}
              >
                <Calendar className="w-3 h-3" />
                Book
              </button>
            </div>

            {/* Chat Body & Modes Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === "chat" && (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`rounded-xl p-3.5 max-w-[85%] text-xs leading-relaxed font-sans ${
                          msg.role === "user"
                            ? "bg-[#071A35] border border-[#00D9FF]/20 text-white"
                            : "bg-gray-950 border border-gray-900 text-gray-300"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-2 text-gray-500 font-mono text-[10px] pl-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00D9FF]" />
                      <span>Concierge is typing...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </>
              )}

              {activeTab === "faq" && (
                <div className="space-y-3">
                  <h5 className="font-display font-semibold text-xs text-white uppercase tracking-wider mb-2">
                    Quick AI Shortcuts
                  </h5>
                  <button
                    id="faq-short-1"
                    onClick={() => handleFAQClick("Can you explain how your custom offline-first ERP system works?")}
                    className="w-full text-left p-3 rounded-lg bg-gray-950 hover:bg-[#071A35]/20 border border-gray-900 hover:border-[#00D9FF]/20 transition-all text-xs text-gray-300 font-sans font-light"
                  >
                    🚀 Explain Offline-First Sync
                  </button>
                  <button
                    id="faq-short-2"
                    onClick={() => handleFAQClick("How do you integrate with MTN Mobile Money & Airtel Money?")}
                    className="w-full text-left p-3 rounded-lg bg-gray-950 hover:bg-[#071A35]/20 border border-gray-900 hover:border-[#00D9FF]/20 transition-all text-xs text-gray-300 font-sans font-light"
                  >
                    💳 Tell me about mobile money payments
                  </button>
                  <button
                    id="faq-short-3"
                    onClick={() => handleFAQClick("What does the Document AI patient records engine do?")}
                    className="w-full text-left p-3 rounded-lg bg-gray-950 hover:bg-[#071A35]/20 border border-gray-900 hover:border-[#00D9FF]/20 transition-all text-xs text-gray-300 font-sans font-light"
                  >
                    📄 Explain Document AI hospital scan
                  </button>
                </div>
              )}

              {activeTab === "quote" && (
                <div className="space-y-4 text-xs font-sans">
                  <h5 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                    Instant Budget Estimator
                  </h5>

                  <div className="space-y-1.5">
                    <label className="block text-gray-400 font-mono text-[9px] uppercase font-semibold">Primary Target System</label>
                    <select
                      id="quote-target-system"
                      value={quoteService}
                      onChange={(e) => setQuoteService(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-900 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="AI">AI Assistant &amp; Models</option>
                      <option value="Automation">WhatsApp Workflow Automator</option>
                      <option value="Software">Bespoke ERP Enterprise</option>
                      <option value="Web">Premium E-commerce / Web</option>
                      <option value="Mobile">Native Mobile Apps</option>
                      <option value="Data">Dashboards &amp; Power BI</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-gray-400 font-mono text-[9px] uppercase font-semibold">Company Scope scale</label>
                    <select
                      id="quote-company-scope"
                      value={quoteScale}
                      onChange={(e) => setQuoteScale(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-900 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Growth">Growth Mode SME</option>
                      <option value="Enterprise">Regional Enterprise</option>
                      <option value="Custom">Custom Core Scale</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-gray-400 font-mono text-[9px] uppercase font-semibold">Local Connectivity Node</label>
                    <select
                      id="quote-connectivity-node"
                      value={quoteConnectivity}
                      onChange={(e) => setQuoteConnectivity(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-900 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Online">Standard Cloud Ingress (Online Only)</option>
                      <option value="Offline-First">Bespoke Offline-First Sync Registry</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl bg-[#00D9FF]/5 border border-[#00D9FF]/15 text-center mt-4">
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest">Estimated Project Price</span>
                    <span className="font-display font-black text-2xl text-[#00D9FF] block mt-1">
                      {calculateQuote() === 2500 ? "$2,500 - $3,500" : `$${calculateQuote().toLocaleString()} - $${(calculateQuote() * 1.35).toLocaleString()}`}
                    </span>
                    <button
                      id="confirm-estimated-quote-btn"
                      onClick={() => handleFAQClick(`I evaluated your Estimator and got a quote range of $${calculateQuote().toLocaleString()}. I want to book a free scoping session.`)}
                      className="w-full bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#05070A] text-[10px] font-bold py-2 rounded-lg mt-3 transition-colors cursor-pointer"
                    >
                      Lock In This Quote
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "book" && (
                <div className="space-y-3.5 text-center py-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <Calendar className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </div>
                  <h5 className="font-display font-bold text-sm text-white">
                    Book Free Scoping Audit
                  </h5>
                  <p className="font-sans text-xs text-gray-400 leading-relaxed font-light max-w-xs mx-auto mb-4">
                    Instantly request a 30-minute operational analysis map session with an elite Bright Wave systems developer.
                  </p>
                  <button
                    id="book-via-assistant-cta"
                    onClick={() => {
                      setIsOpen(false);
                      const element = document.getElementById("contact");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="bg-[#00D9FF] hover:bg-[#00D9FF]/95 text-[#05070A] text-xs font-semibold px-6 py-3 rounded-lg shadow-md shadow-[#00D9FF]/10 transition-all cursor-pointer font-sans"
                  >
                    Go To Booking Page
                  </button>
                </div>
              )}
            </div>

            {/* Input Footer Panel (only active for Chat Tab) */}
            {activeTab === "chat" && (
              <div className="bg-gray-950 border-t border-gray-900 p-3.5 flex gap-2">
                <input
                  id="assistant-chat-input"
                  type="text"
                  placeholder="Ask about AI, sync ledgers, pricing..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-gray-950 border border-gray-900 rounded-xl px-4 text-xs font-sans text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF]/40"
                />
                <button
                  id="send-assistant-chat-btn"
                  onClick={() => handleSendMessage()}
                  className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 hover:bg-[#00D9FF] text-[#00D9FF] hover:text-[#05070A] border border-[#00D9FF]/20 flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
