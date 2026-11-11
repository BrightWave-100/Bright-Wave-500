import React, { useState } from "react";
import { 
  Mail, MessageSquare, Phone, MapPin, Calendar, Clock, ArrowRight, CheckCircle2, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Contact() {
  // Form submission states
  const [formType, setFormType] = useState<"lead" | "message">("lead");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Lead Form State
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadService, setLeadService] = useState("AI");
  const [leadBudget, setLeadBudget] = useState("$5,000 - $10,000");
  const [leadMsg, setLeadMsg] = useState("");

  // Message Form State
  const [msgName, setMsgName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgText, setMsgText] = useState("");

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          company: leadCompany,
          phone: leadPhone,
          service: leadService,
          budget: leadBudget,
          message: leadMsg,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        // Reset inputs
        setLeadName("");
        setLeadEmail("");
        setLeadCompany("");
        setLeadPhone("");
        setLeadMsg("");
      } else {
        const err = await res.json();
        setErrorMessage(err.error || "Failed to log consultation request.");
      }
    } catch (err) {
      setErrorMessage("Network error connecting to the Bright Wave server.");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: msgName,
          email: msgEmail,
          subject: msgSubject,
          message: msgText,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        // Reset inputs
        setMsgName("");
        setMsgEmail("");
        setMsgSubject("");
        setMsgText("");
      } else {
        const err = await res.json();
        setErrorMessage(err.error || "Failed to submit message.");
      }
    } catch (err) {
      setErrorMessage("Network error connecting to the Bright Wave server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#05070A] relative border-t border-gray-900">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#00D9FF]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-left max-w-3xl mb-16">
          <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
            Contact Gateway
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-6">
            Let&apos;s Accelerate Your Future Together
          </h2>
          <p className="font-sans text-gray-400 text-base leading-relaxed font-light max-w-2xl">
            Book a free custom consultation mapping session with our engineering labs or leave a corporate message. We respond within 12 business hours.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left panel: Info & styled Map placeholder */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contact Info Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gray-950/60 border border-gray-900 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center border border-[#00D9FF]/20 shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-[#00D9FF]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white mb-0.5">Corporate Email</h4>
                  <a href="mailto:intelligence@brightwave.ug" className="font-sans text-xs text-[#00D9FF] hover:underline font-light block">
                    intelligence@brightwave.ug
                  </a>
                  <span className="font-mono text-[9px] text-gray-500 block mt-1">SECURE ENCRYPTED MAILBOX</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gray-950/60 border border-gray-900 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white mb-0.5">WhatsApp Workspace</h4>
                  <a href="https://wa.me/256781132887" target="_blank" rel="noreferrer" className="font-sans text-xs text-emerald-400 hover:underline font-light block">
                    +256 781 132 887
                  </a>
                  <span className="font-mono text-[9px] text-gray-500 block mt-1">INSTANT RECEPTION ROUTING</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gray-950/60 border border-gray-900 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center border border-[#00D9FF]/20 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-[#00D9FF]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white mb-0.5">Phone Line</h4>
                  <a href="tel:+256781132887" className="font-sans text-xs text-gray-300 hover:underline font-light block">
                    +256 781 132 887
                  </a>
                  <span className="font-mono text-[9px] text-gray-500 block mt-1">DIRECT INTAKE LINE</span>
                </div>
              </div>
            </div>

            {/* Styled Kampala Vector Map Placeholder */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-950 border border-gray-900 p-6 flex flex-col justify-between">
              {/* Map abstract background lines drawing */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,50 Q100,100 200,50 T400,100" fill="none" stroke="#00D9FF" strokeWidth="2" />
                  <path d="M50,0 Q120,80 100,150 T200,300" fill="none" stroke="#00D9FF" strokeWidth="1.5" />
                  <path d="M0,150 L400,200" fill="none" stroke="#00D9FF" strokeWidth="1" />
                  <circle cx="180" cy="110" r="25" fill="none" stroke="#00D9FF" strokeWidth="1" strokeDasharray="3" />
                </svg>
              </div>

              <div className="relative z-10 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-rose-500 animate-bounce" />
                <div className="text-left">
                  <span className="block font-display font-bold text-sm text-white">Bright Wave Headquarters</span>
                  <span className="block text-xs text-gray-400 font-light">Remote • Kampala, Uganda</span>
                </div>
              </div>

              {/* Office hours */}
              <div className="relative z-10 flex justify-between items-center bg-gray-950/90 border border-gray-900 rounded-lg p-3.5 mt-8 text-left">
                <div className="flex gap-2.5 items-center text-xs font-sans text-gray-400">
                  <Clock className="w-4 h-4 text-[#00D9FF]" />
                  <span>Mon - Fri (08:30 - 18:00 EAT)</span>
                </div>
                <span className="bg-[#00D9FF]/10 text-[#00D9FF] font-mono text-[8px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded">
                  OPEN
                </span>
              </div>
            </div>
          </div>

          {/* Right panel: Active Form Block */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl border border-gray-900 p-8 sm:p-10 text-left shimmer-border">
              {/* Tab Selector inside Card */}
              <div className="flex gap-2 mb-8 border-b border-gray-950 pb-5">
                <button
                  id="tab-select-lead-form"
                  onClick={() => {
                    setFormType("lead");
                    setSubmitted(false);
                    setErrorMessage("");
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    formType === "lead"
                      ? "bg-[#071A35] border border-[#00D9FF]/20 text-[#00D9FF]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Book Free Consultation
                </button>
                <button
                  id="tab-select-msg-form"
                  onClick={() => {
                    setFormType("message");
                    setSubmitted(false);
                    setErrorMessage("");
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    formType === "message"
                      ? "bg-[#071A35] border border-[#00D9FF]/20 text-[#00D9FF]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Leave Message
                </button>
              </div>

              {/* Success / Error Notification */}
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-10"
                  >
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="font-display font-black text-2xl text-white mb-2">
                      Gateway Sync Successful
                    </h3>
                    <p className="font-sans text-sm text-gray-400 leading-relaxed font-light max-w-md mb-8">
                      {formType === "lead"
                        ? "Your consultation booking parameters have been successfully logged to the Bright Wave active lead pipeline. An analyst will contact you within 12 business hours."
                        : "Thank you for reaching out to Bright Wave. Your communication has been dispatched to our administrative inbox."}
                    </p>
                    <button
                      id="reset-form-submission-btn"
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-semibold text-[#00D9FF] border border-[#00D9FF]/20 hover:border-[#00D9FF]/50 px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Submit another request
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form">
                    {errorMessage && (
                      <div className="mb-6 flex gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-xs text-rose-400 items-start">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Consultation Booking Form (Lead) */}
                    {formType === "lead" ? (
                      <form onSubmit={handleLeadSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label htmlFor="lead-name" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Your Name *</label>
                            <input
                              id="lead-name"
                              type="text"
                              required
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                              placeholder="e.g. Robert Atwine"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="lead-email" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Business Email *</label>
                            <input
                              id="lead-email"
                              type="email"
                              required
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                              placeholder="robert@yourfirm.ug"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label htmlFor="lead-company" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Company Name</label>
                            <input
                              id="lead-company"
                              type="text"
                              value={leadCompany}
                              onChange={(e) => setLeadCompany(e.target.value)}
                              className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                              placeholder="e.g. Nile Agro Grains"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="lead-phone" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Phone Contact</label>
                            <input
                              id="lead-phone"
                              type="tel"
                              value={leadPhone}
                              onChange={(e) => setLeadPhone(e.target.value)}
                              className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                              placeholder="+256 781 132 887"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label htmlFor="lead-service" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Primary Target System</label>
                            <select
                              id="lead-service"
                              value={leadService}
                              onChange={(e) => setLeadService(e.target.value)}
                              className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                            >
                              <option value="AI">AI Integration &amp; Assistants</option>
                              <option value="Automation">WhatsApp &amp; Workflow Automation</option>
                              <option value="Software">Bespoke Enterprise Software / ERP</option>
                              <option value="Web">Premium Web Design / E-commerce</option>
                              <option value="Mobile">Native Mobile Applications</option>
                              <option value="Data">Data Dashboards &amp; Power BI</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="lead-budget" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Project Budget Scale</label>
                            <select
                              id="lead-budget"
                              value={leadBudget}
                              onChange={(e) => setLeadBudget(e.target.value)}
                              className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                            >
                              <option value="Under $5,000">Under $5,000</option>
                              <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                              <option value="$10,000 - $30,000">$10,000 - $30,000</option>
                              <option value="Above $30,000">Above $30,000</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="lead-message" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Inquiry Parameters &amp; Objectives *</label>
                          <textarea
                            id="lead-message"
                            required
                            rows={4}
                            value={leadMsg}
                            onChange={(e) => setLeadMsg(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40 resize-none"
                            placeholder="Briefly state your current process, operational bottlenecks, and what you wish to accomplish."
                          />
                        </div>

                        <button
                          id="submit-lead-form-btn"
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#05070A] font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-[#00D9FF]/15 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                        >
                          {loading ? "Registering Study..." : "Book Free Scoping Session"}
                          <ArrowRight className="w-4.5 h-4.5" />
                        </button>
                      </form>
                    ) : (
                      /* General Message Form */
                      <form onSubmit={handleMessageSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label htmlFor="msg-name" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Your Name *</label>
                            <input
                              id="msg-name"
                              type="text"
                              required
                              value={msgName}
                              onChange={(e) => setMsgName(e.target.value)}
                              className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                              placeholder="e.g. Denis Mugoya"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label htmlFor="msg-email" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Email Address *</label>
                            <input
                              id="msg-email"
                              type="email"
                              required
                              value={msgEmail}
                              onChange={(e) => setMsgEmail(e.target.value)}
                              className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                              placeholder="denis@ngo-alliance.org"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="msg-subject" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Subject *</label>
                          <input
                            id="msg-subject"
                            type="text"
                            required
                            value={msgSubject}
                            onChange={(e) => setMsgSubject(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                            placeholder="NGO Portal Partnership Proposal"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="msg-text" className="font-mono text-[9px] text-gray-400 uppercase tracking-wider block font-semibold">Message Text *</label>
                          <textarea
                            id="msg-text"
                            required
                            rows={5}
                            value={msgText}
                            onChange={(e) => setMsgText(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40 resize-none"
                            placeholder="Write your message details here..."
                          />
                        </div>

                        <button
                          id="submit-msg-form-btn"
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gray-950 hover:bg-gray-900 text-white border border-gray-800 font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                        >
                          {loading ? "Sending..." : "Send Message"}
                          <ArrowRight className="w-4.5 h-4.5" />
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
