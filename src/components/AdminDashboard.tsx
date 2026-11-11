import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Lock, User, BarChart, Users, FileText, Briefcase, MailOpen, Settings, LogOut, CheckCircle, Trash2, 
  Plus, Edit3, X, Loader2, Sparkles, TrendingUp, Info, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioProject, BlogPost, Testimonial, TeamMember, LeadBooking, ContactMessage, DashboardMetrics } from "../types";

interface AdminProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshAll: () => void; // Refresh general site list
}

export default function AdminDashboard({ isOpen, onClose, onRefreshAll }: AdminProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("bw_admin_token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cockpit States
  const [activeTab, setActiveTab] = useState<"metrics" | "leads" | "messages" | "portfolio" | "blog" | "testimonials" | "team" | "settings">("metrics");
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [leads, setLeads] = useState<LeadBooking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  // CMS Form States (Unified Modal)
  const [cmsModalOpen, setCmsModalOpen] = useState(false);
  const [cmsTarget, setCmsTarget] = useState<"portfolio" | "blog" | "testimonial" | "team">("portfolio");
  const [cmsMode, setCmsMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState("");

  // CMS Form fields
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("AI");
  const [projectClient, setProjectClient] = useState("");
  const [projectIndustry, setProjectIndustry] = useState("");
  const [projectChallenge, setProjectChallenge] = useState("");
  const [projectSolution, setProjectSolution] = useState("");
  const [projectImpact, setProjectImpact] = useState("");
  const [projectImage, setProjectImage] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Artificial Intelligence");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");

  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testCompany, setTestCompany] = useState("");
  const [testQuote, setTestQuote] = useState("");
  const [testLogo, setTestLogo] = useState("");

  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teamBio, setTeamBio] = useState("");

  // Fetch metrics & dashboard logs
  const fetchAdminData = async () => {
    if (!token) return;
    try {
      const headers = { Authorization: token };

      const [metricsRes, leadsRes, messagesRes, projectsRes, postsRes, testimonialsRes, teamRes] = await Promise.all([
        fetch("/api/admin/metrics", { headers }),
        fetch("/api/admin/leads", { headers }),
        fetch("/api/admin/messages", { headers }),
        fetch("/api/portfolio"),
        fetch("/api/blog"),
        fetch("/api/testimonials"),
        fetch("/api/team")
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (postsRes.ok) setPosts(await postsRes.json());
      if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
      if (teamRes.ok) setTeam(await teamRes.json());
    } catch (err) {
      console.error("Error fetching administrative resources:", err);
    }
  };

  useEffect(() => {
    if (token && isOpen) {
      fetchAdminData();
    }
  }, [token, isOpen, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        localStorage.setItem("bw_admin_token", data.token);
        fetchAdminData();
      } else {
        const err = await res.json();
        setLoginError(err.error || "Administrative login authorization failed.");
      }
    } catch (err) {
      setLoginError("Could not reach backend administrative authentication server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("bw_admin_token");
    setMetrics(null);
  };

  // Leads CRM functions
  const handleUpdateLeadStatus = async (id: string, currentStatus: string) => {
    const statuses: Array<"new" | "contacted" | "qualified" | "closed"> = ["new", "contacted", "qualified", "closed"];
    const currentIdx = statuses.indexOf(currentStatus as any);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];

    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token!
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Confirm removal of this project lead parameters?")) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: token! }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Message manager functions
  const handleMarkMessageRead = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "unread" ? "read" : "unread";
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Confirm deleting this contact message?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: token! }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // CMS Submission Handler
  const handleCmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let endpoint = "";
    let method = "POST";
    let body = {};

    const headers = {
      "Content-Type": "application/json",
      Authorization: token!
    };

    if (cmsTarget === "portfolio") {
      endpoint = cmsMode === "add" ? "/api/admin/portfolio" : `/api/admin/portfolio/${editId}`;
      method = cmsMode === "add" ? "POST" : "PUT";
      body = {
        title: projectTitle,
        category: projectCategory,
        client: projectClient,
        industry: projectIndustry,
        challenge: projectChallenge,
        solution: projectSolution,
        businessImpact: projectImpact,
        image: projectImage || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
        technologies: ["React", "Express", "Gemini AI"],
        gallery: []
      };
    } else if (cmsTarget === "blog") {
      endpoint = cmsMode === "add" ? "/api/admin/blog" : `/api/admin/blog/${editId}`;
      method = cmsMode === "add" ? "POST" : "PUT";
      body = {
        title: postTitle,
        slug: postTitle.replace(/\s+/g, '-').toLowerCase(),
        category: postCategory,
        excerpt: postExcerpt,
        content: postContent,
        authorName: "Super Admin",
        authorRole: "Executive Hub Team",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        readingTime: "4 min read",
        tags: [postCategory, "Audit", "Uganda"]
      };
    } else if (cmsTarget === "testimonial") {
      endpoint = "/api/admin/testimonials";
      body = {
        name: testName,
        role: testRole,
        company: testCompany,
        quote: testQuote,
        rating: 5,
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
        logoText: testLogo || "MOCK"
      };
    } else if (cmsTarget === "team") {
      endpoint = "/api/admin/team";
      body = {
        name: teamName,
        role: teamRole,
        bio: teamBio,
        category: "Executive",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
      };
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setCmsModalOpen(false);
        fetchAdminData();
        onRefreshAll(); // Trigger reload on general site
        // Reset states
        setProjectTitle("");
        setProjectClient("");
        setProjectIndustry("");
        setProjectChallenge("");
        setProjectSolution("");
        setProjectImpact("");
        setProjectImage("");
        setPostTitle("");
        setPostExcerpt("");
        setPostContent("");
        setTestName("");
        setTestRole("");
        setTestCompany("");
        setTestQuote("");
        setTestLogo("");
        setTeamName("");
        setTeamRole("");
        setTeamBio("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditProject = (p: PortfolioProject) => {
    setCmsTarget("portfolio");
    setCmsMode("edit");
    setEditId(p.id);
    setProjectTitle(p.title);
    setProjectCategory(p.category);
    setProjectClient(p.client);
    setProjectIndustry(p.industry);
    setProjectChallenge(p.challenge);
    setProjectSolution(p.solution);
    setProjectImpact(p.businessImpact);
    setProjectImage(p.image);
    setCmsModalOpen(true);
  };

  const handleDeleteItem = async (target: "portfolio" | "blog" | "testimonials" | "team", id: string) => {
    if (!confirm(`Are you sure you want to delete this resource from database?`)) return;
    try {
      const res = await fetch(`/api/admin/${target}/${id}`, {
        method: "DELETE",
        headers: { Authorization: token! }
      });
      if (res.ok) {
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div id="admin-modal-backdrop" onClick={onClose} className="absolute inset-0 bg-black/92 backdrop-blur-sm" />

      {/* Admin Panel Body Container */}
      <div id="admin-modal-body" className="relative w-full max-w-6xl h-[90vh] bg-[#05070A] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex shimmer-border">
        
        {/* LOGGED OUT STATE: LOGIN ACCESS SCREEN */}
        {!token ? (
          <div className="flex-1 flex flex-col justify-center items-center p-8 max-w-md mx-auto text-center space-y-6">
            <div className="w-14 h-14 bg-[#030712] border border-[#00D9FF]/30 rounded-2xl flex items-center justify-center p-2.5 shadow-lg shadow-[#00D9FF]/10 overflow-hidden">
              <img src="/brightwave-mark.svg" alt="Bright Wave Logo" className="w-full h-full object-contain" />
            </div>
            <div className="text-center">
              <h3 className="font-display font-black text-xl text-white">
                Administrative Authentication
              </h3>
              <p className="font-sans text-xs text-gray-500 font-mono mt-1 uppercase tracking-wider">
                Authorized Executive Staff Only
              </p>
            </div>

            {loginError && (
              <div className="w-full text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex gap-2 items-start text-left">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Admin Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="admin-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                    placeholder="admin@brightwave.ug"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="font-mono text-[9px] text-gray-400 uppercase tracking-widest block font-bold">Administrative Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    id="admin-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-900 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40"
                    placeholder="••••••••••••••"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-900 text-left font-mono text-[9px] text-gray-400">
                <div className="font-bold text-gray-300 uppercase mb-1">ENTERPRISE AUTHENTICATION</div>
                <div>EMAIL: <span className="text-[#00D9FF]">admin@brightwave.ug</span></div>
                <div>AUTHENTICATION: <span className="text-[#00D9FF]">Configured via environment variables</span></div>
              </div>

              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#05070A] font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? "Decrypting Node..." : "Login To Administrative Cockpit"}
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN ACTIVE COCKPIT PANELS */
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Controls Column */}
            <div className="w-56 bg-gray-950 border-r border-gray-900 flex flex-col justify-between p-4">
              <div className="space-y-6">
                <div className="border-b border-gray-900 pb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#030712] border border-[#00D9FF]/30 p-1 flex items-center justify-center shrink-0">
                    <img src="/brightwave-mark.svg" alt="Bright Wave Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-display font-black text-xs text-white tracking-widest uppercase block">
                      BRIGHT WAVE
                    </span>
                    <span className="font-mono text-[8px] text-[#00D9FF] uppercase tracking-widest block">
                      SUPERADMIN COCKPIT
                    </span>
                  </div>
                </div>

                <nav className="space-y-1.5">
                  <button
                    id="admin-tab-metrics-btn"
                    onClick={() => setActiveTab("metrics")}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-xs font-semibold font-sans cursor-pointer transition-colors ${
                      activeTab === "metrics" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <BarChart className="w-4 h-4" />
                    Operational Metrics
                  </button>

                  <button
                    id="admin-tab-leads-btn"
                    onClick={() => setActiveTab("leads")}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-xs font-semibold font-sans cursor-pointer transition-colors ${
                      activeTab === "leads" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Leads Pipeline
                    {leads.filter(l => l.status === "new").length > 0 && (
                      <span className="ml-auto w-4.5 h-4.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">
                        {leads.filter(l => l.status === "new").length}
                      </span>
                    )}
                  </button>

                  <button
                    id="admin-tab-messages-btn"
                    onClick={() => setActiveTab("messages")}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-xs font-semibold font-sans cursor-pointer transition-colors ${
                      activeTab === "messages" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <MailOpen className="w-4 h-4" />
                    Contact Messages
                    {messages.filter(m => m.status === "unread").length > 0 && (
                      <span className="ml-auto w-4.5 h-4.5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px] font-black">
                        {messages.filter(m => m.status === "unread").length}
                      </span>
                    )}
                  </button>

                  <button
                    id="admin-tab-portfolio-btn"
                    onClick={() => setActiveTab("portfolio")}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-xs font-semibold font-sans cursor-pointer transition-colors ${
                      activeTab === "portfolio" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Case Studies CMS
                  </button>

                  <button
                    id="admin-tab-blog-btn"
                    onClick={() => setActiveTab("blog")}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-xs font-semibold font-sans cursor-pointer transition-colors ${
                      activeTab === "blog" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Article CMS
                  </button>

                  <button
                    id="admin-tab-testimonials-btn"
                    onClick={() => setActiveTab("testimonials")}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-xs font-semibold font-sans cursor-pointer transition-colors ${
                      activeTab === "testimonials" ? "bg-[#071A35] text-[#00D9FF]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Testimonials CMS
                  </button>
                </nav>
              </div>

              {/* Logout Action */}
              <button
                id="admin-logout-btn"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 cursor-pointer font-sans"
              >
                <LogOut className="w-4 h-4" />
                Sign Out Cockpit
              </button>
            </div>

            {/* Main Interactive Workspace (Right Column) */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#05070A]">
              {/* Header bar */}
              <div className="border-b border-gray-900 px-8 py-4 flex justify-between items-center bg-gray-950">
                <h4 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">
                  {activeTab === "metrics" && "Operational Performance Analytics"}
                  {activeTab === "leads" && "Consultation Booking CRM Portal"}
                  {activeTab === "messages" && "Contact Message Mailbox Manager"}
                  {activeTab === "portfolio" && "Portfolio Database Content Management"}
                  {activeTab === "blog" && "Insights Bulletin content builder"}
                  {activeTab === "testimonials" && "Testimonials Content Board"}
                </h4>

                <button
                  id="admin-close-btn"
                  onClick={onClose}
                  className="p-1 text-gray-500 hover:text-white border border-gray-900 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic scrollable data pane */}
              <div className="flex-1 overflow-y-auto p-8">
                
                {/* 1. OPERATIONAL METRICS & CHARTS */}
                {activeTab === "metrics" && metrics && (
                  <div className="space-y-8 text-left">
                    {/* Top bento row cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="glass-panel p-6 rounded-2xl border border-gray-900 flex flex-col justify-between">
                        <span className="font-mono text-[9px] text-gray-500 uppercase">Consultations Pipeline</span>
                        <div className="font-display font-black text-3xl text-[#00D9FF] my-2">{metrics.totalLeads}</div>
                        <span className="text-[10px] text-emerald-400 font-medium">+{metrics.newLeads} new uncontacted</span>
                      </div>

                      <div className="glass-panel p-6 rounded-2xl border border-gray-900 flex flex-col justify-between">
                        <span className="font-mono text-[9px] text-gray-500 uppercase">Unread Messages</span>
                        <div className="font-display font-black text-3xl text-[#00D9FF] my-2">{metrics.totalMessages}</div>
                        <span className="text-[10px] text-gray-400 font-medium">Immediate EAT routing logs</span>
                      </div>

                      <div className="glass-panel p-6 rounded-2xl border border-gray-900 flex flex-col justify-between">
                        <span className="font-mono text-[9px] text-gray-500 uppercase">Project Revenue Potential</span>
                        <div className="font-display font-black text-3xl text-[#00D9FF] my-2">${metrics.revenuePotential.toLocaleString()}</div>
                        <span className="text-[10px] text-emerald-400 font-medium">Milestone budgets calculated</span>
                      </div>
                    </div>

                    {/* Styled Mock Analytics Chart */}
                    <div className="glass-panel p-6 rounded-2xl border border-gray-900">
                      <h5 className="font-display font-bold text-xs text-white uppercase tracking-wider mb-6">
                        System Intake Pipeline (Weekly)
                      </h5>
                      <div className="aspect-[21/9] w-full flex items-end justify-between gap-4 pt-10">
                        {[40, 65, 30, 85, 95, 55, 75].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gray-950 rounded-lg overflow-hidden h-40 flex items-end">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                className="w-full bg-gradient-to-t from-[#071A35] to-[#00D9FF]"
                              />
                            </div>
                            <span className="font-mono text-[9px] text-gray-500">Wk {i+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. LEADS CRM TABLE */}
                {activeTab === "leads" && (
                  <div className="space-y-4 text-left">
                    {leads.length === 0 ? (
                      <div className="py-20 text-center text-gray-500">
                        No custom consultations requests logged.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {leads.map((lead) => (
                          <div key={lead.id} className="p-6 rounded-2xl bg-gray-950/60 border border-gray-900 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[#00D9FF]/10 transition-colors">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-display font-bold text-sm text-white">{lead.name}</span>
                                <span className="font-mono text-[9px] text-gray-400">{lead.company}</span>
                                <span className={`font-mono text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                  lead.status === "new" ? "bg-rose-500/10 text-rose-400" :
                                  lead.status === "contacted" ? "bg-amber-500/10 text-amber-400" :
                                  lead.status === "qualified" ? "bg-[#00D9FF]/10 text-[#00D9FF]" :
                                  "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                  {lead.status}
                                </span>
                              </div>
                              <p className="font-sans text-xs text-gray-400 leading-relaxed font-light">{lead.message}</p>
                              <div className="flex gap-4 font-mono text-[9px] text-gray-500">
                                <span>SYSTEM: {lead.service}</span>
                                <span>BUDGET: {lead.budget}</span>
                                <span>EMAIL: {lead.email}</span>
                                {lead.phone && <span>PHONE: {lead.phone}</span>}
                              </div>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              <button
                                id={`crm-update-lead-${lead.id}`}
                                onClick={() => handleUpdateLeadStatus(lead.id, lead.status)}
                                className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-[10px] text-gray-300 font-mono hover:text-[#00D9FF] cursor-pointer"
                              >
                                Cycle Status
                              </button>
                              <button
                                id={`crm-delete-lead-${lead.id}`}
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/20 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. CONTACT MESSAGES */}
                {activeTab === "messages" && (
                  <div className="space-y-4 text-left">
                    {messages.length === 0 ? (
                      <div className="py-20 text-center text-gray-500">
                        No contact messages logged.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div key={msg.id} className="p-6 rounded-2xl bg-gray-950/60 border border-gray-900 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-display font-bold text-sm text-white">{msg.name}</span>
                                <span className="font-mono text-[9px] text-gray-400">{msg.email}</span>
                                <span className={`font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  msg.status === "unread" ? "bg-rose-500/10 text-rose-400" : "bg-gray-900 text-gray-500"
                                }`}>
                                  {msg.status}
                                </span>
                              </div>
                              <h5 className="font-sans font-bold text-xs text-gray-200">{msg.subject}</h5>
                              <p className="font-sans text-xs text-gray-400 leading-relaxed font-light">{msg.message}</p>
                            </div>

                            <div className="flex gap-2 shrink-0">
                              <button
                                id={`msg-toggle-read-${msg.id}`}
                                onClick={() => handleMarkMessageRead(msg.id, msg.status)}
                                className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-[10px] text-gray-300 font-mono hover:text-[#00D9FF] cursor-pointer"
                              >
                                Toggle Read
                              </button>
                              <button
                                id={`msg-delete-${msg.id}`}
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/20 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. PORTFOLIO CMS CRUD */}
                {activeTab === "portfolio" && (
                  <div className="space-y-6 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-display font-semibold text-xs text-gray-400 uppercase tracking-widest">
                        Database Records: {projects.length} Entries
                      </h5>
                      <button
                        id="cms-open-add-project-btn"
                        onClick={() => {
                          setCmsTarget("portfolio");
                          setCmsMode("add");
                          setCmsModalOpen(true);
                        }}
                        className="bg-[#00D9FF] hover:bg-[#00D9FF]/95 text-[#05070A] text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add Case Study
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div key={proj.id} className="p-5 rounded-2xl bg-gray-950/60 border border-gray-900 flex justify-between items-start">
                          <div>
                            <span className="font-mono text-[8px] bg-[#00D9FF]/10 text-[#00D9FF] px-2 py-0.5 rounded border border-[#00D9FF]/20 uppercase">
                              {proj.category}
                            </span>
                            <h5 className="font-display font-bold text-sm text-white mt-2 mb-1">{proj.title}</h5>
                            <span className="font-mono text-[9px] text-gray-500 block">CLIENT: {proj.client}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              id={`cms-edit-project-${proj.id}`}
                              onClick={() => handleOpenEditProject(proj)}
                              className="p-1.5 bg-gray-900 border border-gray-850 text-gray-400 hover:text-white rounded-lg cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              id={`cms-delete-project-${proj.id}`}
                              onClick={() => handleDeleteItem("portfolio", proj.id)}
                              className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/20 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. ARTICLE CMS CRUD */}
                {activeTab === "blog" && (
                  <div className="space-y-6 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-display font-semibold text-xs text-gray-400 uppercase tracking-widest">
                        Articles: {posts.length} entries
                      </h5>
                      <button
                        id="cms-open-add-post-btn"
                        onClick={() => {
                          setCmsTarget("blog");
                          setCmsMode("add");
                          setCmsModalOpen(true);
                        }}
                        className="bg-[#00D9FF] hover:bg-[#00D9FF]/95 text-[#05070A] text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add Insight Post
                      </button>
                    </div>

                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div key={post.id} className="p-5 rounded-2xl bg-gray-950/60 border border-gray-900 flex justify-between items-center">
                          <div>
                            <span className="font-mono text-[8px] text-[#00D9FF] block uppercase tracking-wider">{post.category}</span>
                            <h5 className="font-display font-bold text-sm text-white mt-1">{post.title}</h5>
                            <span className="font-mono text-[9px] text-gray-500 block">PUBLISHED: {post.date}</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              id={`cms-delete-post-${post.id}`}
                              onClick={() => handleDeleteItem("blog", post.id)}
                              className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/20 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. TESTIMONIALS CMS */}
                {activeTab === "testimonials" && (
                  <div className="space-y-6 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-display font-semibold text-xs text-gray-400 uppercase tracking-widest">
                        Testimonials Database: {testimonials.length} Entries
                      </h5>
                      <button
                        id="cms-open-add-testimonial-btn"
                        onClick={() => {
                          setCmsTarget("testimonial");
                          setCmsMode("add");
                          setCmsModalOpen(true);
                        }}
                        className="bg-[#00D9FF] hover:bg-[#00D9FF]/95 text-[#05070A] text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add Testimonial
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {testimonials.map((test) => (
                        <div key={test.id} className="p-5 rounded-2xl bg-gray-950/60 border border-gray-900 flex justify-between items-start">
                          <div>
                            <h5 className="font-display font-bold text-sm text-white mb-1">{test.name}</h5>
                            <span className="block text-xs text-gray-400">{test.role}, {test.company}</span>
                            <p className="font-sans text-xs text-gray-400 leading-relaxed font-light mt-3 line-clamp-3 italic">&ldquo;{test.quote}&rdquo;</p>
                          </div>

                          <button
                            id={`cms-delete-testimonial-${test.id}`}
                            onClick={() => handleDeleteItem("testimonials", test.id)}
                            className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/20 cursor-pointer shrink-0 ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unified CMS Add/Edit Form Overlay Modal */}
      <AnimatePresence>
        {cmsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div id="cms-modal-backdrop" onClick={() => setCmsModalOpen(false)} className="absolute inset-0 bg-black/92 backdrop-blur-sm" />

            <motion.div
              id="cms-modal-body"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full max-w-xl bg-[#05070A] border border-gray-800 rounded-2xl p-8 shadow-2xl max-h-[85vh] overflow-y-auto shimmer-border"
            >
              <button
                id="close-cms-modal-btn"
                onClick={() => setCmsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white border border-gray-850 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-display font-extrabold text-lg text-white mb-6 uppercase tracking-wider text-left">
                {cmsMode === "add" ? `Register New ${cmsTarget}` : `Modify Target ${cmsTarget}`}
              </h4>

              <form onSubmit={handleCmsSubmit} className="space-y-4 text-left">
                {/* 1. PORTFOLIO CASE STUDY FORMS */}
                {cmsTarget === "portfolio" && (
                  <>
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Case Study Title *</label>
                      <input
                        id="cms-project-title"
                        type="text" required value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                        placeholder="e.g. Centenary AI Assistant"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Client Name *</label>
                        <input
                          id="cms-project-client"
                          type="text" required value={projectClient} onChange={(e) => setProjectClient(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Industry *</label>
                        <input
                          id="cms-project-industry"
                          type="text" required value={projectIndustry} onChange={(e) => setProjectIndustry(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">CMS Category</label>
                        <select
                          id="cms-project-category"
                          value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                        >
                          <option value="AI">AI Integration</option>
                          <option value="Software">Custom Software</option>
                          <option value="Automation">Workflow Automation</option>
                          <option value="Data">Data Analytics</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Hero Image URL</label>
                        <input
                          id="cms-project-image"
                          type="text" value={projectImage} onChange={(e) => setProjectImage(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                          placeholder="Unsplash image URL"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Business Challenge *</label>
                      <textarea
                        id="cms-project-challenge"
                        required rows={3} value={projectChallenge} onChange={(e) => setProjectChallenge(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Bright Wave Solution *</label>
                      <textarea
                        id="cms-project-solution"
                        required rows={3} value={projectSolution} onChange={(e) => setProjectSolution(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Business Impact Statement *</label>
                      <textarea
                        id="cms-project-impact"
                        required rows={2} value={projectImpact} onChange={(e) => setProjectImpact(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                  </>
                )}

                {/* 2. BLOG CMS FORMS */}
                {cmsTarget === "blog" && (
                  <>
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Insight Article Title *</label>
                      <input
                        id="cms-post-title"
                        type="text" required value={postTitle} onChange={(e) => setPostTitle(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Article Category</label>
                      <select
                        id="cms-post-category"
                        value={postCategory} onChange={(e) => setPostCategory(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                      >
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                        <option value="Automation">Hyper-Automation</option>
                        <option value="Software Engineering">Software Engineering</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Short Excerpt (Grid View preview) *</label>
                      <textarea
                        id="cms-post-excerpt"
                        required rows={2} value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Article Content *</label>
                      <textarea
                        id="cms-post-content"
                        required rows={8} value={postContent} onChange={(e) => setPostContent(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none resize-none font-sans"
                        placeholder="Utilize markdown paragraphs. Header headings can be prefixed with ## or ###"
                      />
                    </div>
                  </>
                )}

                {/* 3. TESTIMONIAL CMS FORMS */}
                {cmsTarget === "testimonial" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Client Name *</label>
                        <input
                          id="cms-test-name"
                          type="text" required value={testName} onChange={(e) => setTestName(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Designation Role *</label>
                        <input
                          id="cms-test-role"
                          type="text" required value={testRole} onChange={(e) => setTestRole(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Company Name *</label>
                        <input
                          id="cms-test-company"
                          type="text" required value={testCompany} onChange={(e) => setTestCompany(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Mock Logo Text *</label>
                        <input
                          id="cms-test-logo"
                          type="text" required value={testLogo} onChange={(e) => setTestLogo(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                          placeholder="e.g. MTN"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[9px] text-gray-400 uppercase font-bold">Quote Statement *</label>
                      <textarea
                        id="cms-test-quote"
                        required rows={4} value={testQuote} onChange={(e) => setTestQuote(e.target.value)}
                        className="w-full bg-gray-950 border border-gray-900 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                  </>
                )}

                <button
                  id="cms-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00D9FF] hover:bg-[#00D9FF]/95 text-[#05070A] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {loading ? "Writing To Ledger..." : "Commit Changes To Database"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
