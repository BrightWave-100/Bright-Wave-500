import React, { useState, useEffect } from "react";
import { 
  Search, BookOpen, Clock, Tag, User, ArrowRight, X, Mail, Send, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost } from "../types";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const categories = ["All", "Artificial Intelligence", "Automation", "Software Engineering"];

  // Filter posts by category and search
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const listPosts = filteredPosts.filter(p => p.id !== selectedPost?.id);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubmitted(true);
      setNewsletterEmail("");
    }
  };

  return (
    <section id="blog" className="py-24 bg-[#05070A] relative border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div className="text-left">
            <span className="font-mono text-xs text-[#00D9FF] tracking-widest uppercase block mb-3 font-medium">
              Bright Insights
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Intelligence in Motion Bulletin
            </h2>
          </div>

          {/* Search bar input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              id="blog-search-input"
              type="text"
              placeholder="Search concepts or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-950/60 border border-gray-900 rounded-xl py-3 pl-11 pr-4 text-xs font-sans text-white focus:outline-none focus:border-[#00D9FF]/40 transition-colors"
            />
          </div>
        </div>

        {/* Featured Article Banner Card (only show if loading completed and no search is active) */}
        {!loading && featuredPost && !searchTerm && selectedCategory === "All" && (
          <motion.div
            id="featured-blog-post-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setSelectedPost(featuredPost)}
            className="glass-panel rounded-2xl border border-gray-900 overflow-hidden mb-16 cursor-pointer hover:border-[#00D9FF]/20 transition-all grid grid-cols-1 lg:grid-cols-12 shimmer-border text-left"
          >
            <div className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[300px] bg-gray-950">
              <img
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'><rect width='100%' height='100%' fill='%2305070A'/><rect x='100' y='100' width='1000' height='600' rx='24' fill='%23071A35' stroke='%2300D9FF' stroke-opacity='0.2' stroke-width='3'/><text x='600' y='380' font-family='sans-serif' font-size='32' font-weight='bold' fill='%2300D9FF' text-anchor='middle'>BRIGHT WAVE INSIGHTS</text><text x='600' y='430' font-family='sans-serif' font-size='18' fill='%2394A3B8' text-anchor='middle'>Intelligence In Motion Technical Report</text></svg>"
                alt={featuredPost.title}
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute top-4 left-4">
                <span className="font-mono text-[9px] font-bold bg-[#00D9FF] text-[#05070A] px-3.5 py-1 rounded-full">
                  FEATURED ARTICLE
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4 font-mono text-[9px] text-gray-400">
                  <span className="bg-gray-900 border border-gray-850 px-2.5 py-1 rounded text-[#00D9FF]">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {featuredPost.readingTime}
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl text-white tracking-tight leading-tight hover:text-[#00D9FF] transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed font-light line-clamp-4">
                  {featuredPost.excerpt}
                </p>
              </div>

              {/* Author & CTA footer */}
              <div className="flex items-center justify-between border-t border-gray-900 pt-6 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-900 shrink-0">
                    <img src={featuredPost.authorImage} alt={featuredPost.authorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-white">{featuredPost.authorName}</span>
                    <span className="block text-[9px] text-gray-500">{featuredPost.authorRole}</span>
                  </div>
                </div>

                <span className="text-xs text-[#00D9FF] font-semibold flex items-center gap-1 cursor-pointer">
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 justify-start">
          {categories.map((cat) => (
            <button
              id={`blog-category-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider font-sans cursor-pointer transition-all ${
                selectedCategory === cat
                  ? "bg-[#071A35] border border-[#00D9FF]/20 text-[#00D9FF]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Regular Blog Card List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-gray-950 border border-gray-900 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedPost(post)}
                  className="glass-panel rounded-2xl overflow-hidden border border-gray-900 hover:border-[#00D9FF]/20 cursor-pointer flex flex-col justify-between shimmer-border text-left"
                >
                  <div className="p-8">
                    {/* Category metadata */}
                    <div className="flex items-center justify-between font-mono text-[9px] text-gray-500 mb-4">
                      <span className="text-[#00D9FF] uppercase tracking-wider">{post.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-600" />
                        {post.readingTime}
                      </span>
                    </div>

                    <h4 className="font-display font-extrabold text-lg text-white mb-3 line-clamp-2 leading-tight">
                      {post.title}
                    </h4>

                    <p className="font-sans text-xs text-gray-400 leading-relaxed font-light mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Author / Date info footer */}
                  <div className="px-8 pb-8 pt-4 border-t border-gray-950 mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6.5 h-6.5 rounded-full overflow-hidden bg-gray-900 shrink-0">
                        <img src={post.authorImage} alt={post.authorName} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-300 font-sans font-medium">{post.authorName}</span>
                    </div>
                    <span className="font-mono text-[9px] text-gray-500">{post.date}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Newsletter Box */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-gray-900 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shimmer-border">
          <div className="lg:col-span-7">
            <div className="flex gap-3 items-center mb-4">
              <div className="w-10 h-10 bg-[#00D9FF]/10 rounded-xl flex items-center justify-center border border-[#00D9FF]/20">
                <Mail className="w-5 h-5 text-[#00D9FF]" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-white">
                Subscribe to Africa&apos;s AI Insights
              </h3>
            </div>
            <p className="font-sans text-xs sm:text-sm text-gray-400 leading-relaxed font-light max-w-xl">
              Receive premium audits, technical case studies, and localized natural language processing research papers written by our expert labs direct to your inbox once a month. No spam, ever.
            </p>
          </div>

          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {newsletterSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="block font-sans font-bold text-sm">Success!</span>
                    <span className="block font-sans text-xs text-emerald-400/80 font-light">You are now enrolled in our newsletter pipeline.</span>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2.5">
                  <input
                    id="newsletter-email-input"
                    type="email"
                    required
                    placeholder="Enter your business email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-gray-950 border border-gray-900 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF]/40"
                  />
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    className="bg-[#00D9FF] hover:bg-[#00D9FF]/90 text-[#05070A] font-bold text-xs px-6 rounded-xl flex items-center gap-2 shadow-md shadow-[#00D9FF]/10 cursor-pointer"
                  >
                    Subscribe
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Complete Article detail view modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              id="blog-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-black/92 backdrop-blur-sm"
            />

            <motion.div
              id="blog-modal-body"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl bg-[#05070A] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto shimmer-border"
            >
              {/* Close Button */}
              <button
                id="close-blog-modal-btn"
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 z-10 p-2 text-gray-400 hover:text-white border border-gray-850 rounded-lg bg-[#05070A]/85 backdrop-blur-md hover:border-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cover layout */}
              <div className="relative aspect-[21/9] bg-gray-950 border-b border-gray-900">
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] to-transparent opacity-80" />
                <div className="absolute bottom-6 left-8 right-8 text-left">
                  <span className="font-mono text-[9px] font-semibold bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 px-3 py-1 rounded-full uppercase">
                    {selectedPost.category}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-3 leading-tight">
                    {selectedPost.title}
                  </h3>
                </div>
              </div>

              {/* Article content block */}
              <div className="p-8 sm:p-10 text-left">
                {/* Author profile row */}
                <div className="flex items-center justify-between border-b border-gray-900 pb-5 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-900 shrink-0">
                      <img src={selectedPost.authorImage} alt={selectedPost.authorName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-white">{selectedPost.authorName}</span>
                      <span className="block text-[10px] text-gray-500">{selectedPost.authorRole}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedPost.readingTime}
                    </span>
                    <span>•</span>
                    <span>PUBLISHED: {selectedPost.date}</span>
                  </div>
                </div>

                {/* Main markdown content simulated body */}
                <div className="prose prose-invert max-w-none text-gray-300 font-sans text-sm sm:text-base leading-relaxed font-light space-y-6">
                  {/* Splits paragraphs and replaces with tags to simulate clean editorial markdown */}
                  {selectedPost.content.split("\n\n").map((para, pIdx) => {
                    if (para.startsWith("## ")) {
                      return <h4 key={pIdx} className="font-display font-bold text-lg sm:text-xl text-white mt-8 mb-2">{para.replace("## ", "")}</h4>;
                    }
                    if (para.startsWith("### ")) {
                      return <h5 key={pIdx} className="font-display font-semibold text-base text-[#00D9FF] mt-6 mb-2">{para.replace("### ", "")}</h5>;
                    }
                    if (para.startsWith("- ") || para.startsWith("1. ")) {
                      return (
                        <ul key={pIdx} className="list-disc pl-6 space-y-2 text-sm text-gray-400">
                          {para.split("\n").map((li, lIdx) => (
                            <li key={lIdx}>{li.replace(/^(- |\d+\.\s)/, "")}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={pIdx} className="text-gray-300">{para}</p>;
                  })}
                </div>

                {/* Post tags */}
                <div className="flex flex-wrap gap-2 border-t border-gray-900 pt-6 mt-10">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 bg-gray-950 border border-gray-900 px-3 py-1 rounded text-[10px] font-mono text-gray-400">
                      <Tag className="w-3 h-3 text-gray-600" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
