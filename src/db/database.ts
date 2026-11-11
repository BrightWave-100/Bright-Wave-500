import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: "admin" | "editor" | "user";
  refresh_token?: string | null;
  reset_token?: string | null;
  reset_token_expiry?: number | null;
  created_at: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  service: string;
  budget: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "closed";
  created_at: string;
}

export interface BlogPostRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  readingTime: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioRecord {
  id: string;
  title: string;
  category: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  businessImpact: string;
  image: string;
  technologies: string[];
  gallery: string[];
  created_at: string;
  updated_at: string;
}

export interface TestimonialRecord {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  photoUrl: string;
  logoText: string;
  created_at: string;
}

export interface MessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  user_id?: string;
  user_email?: string;
  action: string;
  resource: string;
  ip: string;
  details?: string;
  timestamp: string;
}

export interface DBData {
  users: UserRecord[];
  leads: LeadRecord[];
  blog_posts: BlogPostRecord[];
  portfolio_items: PortfolioRecord[];
  testimonials: TestimonialRecord[];
  messages: MessageRecord[];
  audit_logs: AuditLogRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "brightwave_db.json");

class DatabaseEngine {
  private data: DBData = {
    users: [],
    leads: [],
    blog_posts: [],
    portfolio_items: [],
    testimonials: [],
    messages: [],
    audit_logs: []
  };

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
        // Ensure all required collections exist
        if (!this.data.users) this.data.users = [];
        if (!this.data.leads) this.data.leads = [];
        if (!this.data.blog_posts) this.data.blog_posts = [];
        if (!this.data.portfolio_items) this.data.portfolio_items = [];
        if (!this.data.testimonials) this.data.testimonials = [];
        if (!this.data.messages) this.data.messages = [];
        if (!this.data.audit_logs) this.data.audit_logs = [];
      } else {
        this.seedInitialData();
      }
    } catch (err) {
      console.error("Failed to initialize persistent database, seeding defaults:", err);
      this.seedInitialData();
    }
  }

  private seedInitialData() {
    const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "BrightWaveAdmin2026!", 12);

    this.data = {
      users: [
        {
          id: "usr_admin_001",
          email: process.env.ADMIN_EMAIL || "admin@brightwave.ug",
          password_hash: adminPasswordHash,
          name: "Bright Wave Executive Admin",
          role: "admin",
          created_at: new Date().toISOString()
        }
      ],
      leads: [],
      portfolio_items: [
        {
          id: "proj_1",
          title: "Bright Wave Intelligence Engine",
          category: "AI",
          client: "Bright Wave Demonstration Project",
          industry: "Enterprise AI & Automation",
          challenge: "Demonstrating high-performance localized LLM orchestration and real-time streaming workflow automation for enterprise operational contexts.",
          solution: "Engineered an offline-resilient AI proxy architecture with prompt caching, structured output validation, and automatic endpoint failover.",
          businessImpact: "Demonstrates up to 80% acceleration in query processing and operational turnaround time.",
          image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='100%' height='100%' fill='%2305070A'/><circle cx='400' cy='250' r='180' fill='%2300D9FF' fill-opacity='0.05'/><path d='M300 250 L500 250 M400 150 L400 350' stroke='%2300D9FF' stroke-width='3' stroke-opacity='0.3'/><text x='400' y='240' font-family='sans-serif' font-size='22' font-weight='bold' fill='%2300D9FF' text-anchor='middle'>BRIGHT WAVE INTELLIGENCE ENGINE</text><text x='400' y='275' font-family='sans-serif' font-size='14' fill='%2394A3B8' text-anchor='middle'>Enterprise AI System Demonstration Project</text></svg>",
          technologies: ["Gemini AI", "TypeScript", "Express", "Node.js"],
          gallery: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "proj_2",
          title: "Bright Wave Offline-First ERP Blueprint",
          category: "Software",
          client: "Bright Wave Demonstration Project",
          industry: "Supply Chain & Operations",
          challenge: "Demonstrating transactional integrity and ACID compliance across distributed operational units experiencing frequent network disruption.",
          solution: "Engineered a local file-backed persistent store with background synchronization protocols and atomic write locks.",
          businessImpact: "Guarantees 100% operational business continuity during remote network outages.",
          image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='100%' height='100%' fill='%2305070A'/><rect x='200' y='120' width='400' height='260' rx='16' fill='%23071A35' stroke='%2300D9FF' stroke-opacity='0.2' stroke-width='2'/><text x='400' y='240' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23FFFFFF' text-anchor='middle'>OFFLINE-FIRST ERP BLUEPRINT</text><text x='400' y='275' font-family='sans-serif' font-size='14' fill='%2300D9FF' text-anchor='middle'>System Architecture Demonstration</text></svg>",
          technologies: ["TypeScript", "Express", "REST API", "PWA"],
          gallery: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      blog_posts: [
        {
          id: "post_1",
          slug: "deploying-enterprise-ai-low-bandwidth",
          title: "Deploying Enterprise AI Systems in Low-Bandwidth Environments",
          category: "Artificial Intelligence",
          excerpt: "An engineering breakdown of offline-capable AI architectures, prompt caching strategies, and localized edge sync engines.",
          content: "Operating enterprise software in regional markets with fluctuating network reliability requires a fundamental departure from traditional cloud-only patterns.\n\nAt Bright Wave, we architect systems with local fallback caches, queue-based retry mechanisms, and structured validation to ensure continuous operational uptime.",
          authorName: "Bright Wave Team",
          authorRole: "Engineering & AI Labs",
          authorImage: "/brightwave-mark.svg",
          readingTime: "4 min read",
          tags: ["AI", "Enterprise", "Engineering", "East Africa"],
          published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      testimonials: [],
      messages: [],
      audit_logs: [
        {
          id: "audit_001",
          user_email: "system",
          action: "INITIALIZE_DATABASE",
          resource: "database",
          ip: "127.0.0.1",
          details: "Initialized persistent enterprise database schema.",
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.saveData();
  }

  public saveData() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving database to file:", err);
    }
  }

  // Getters
  public getUsers(): UserRecord[] { return this.data.users; }
  public getLeads(): LeadRecord[] { return this.data.leads; }
  public getBlogPosts(): BlogPostRecord[] { return this.data.blog_posts; }
  public getPortfolioItems(): PortfolioRecord[] { return this.data.portfolio_items; }
  public getTestimonials(): TestimonialRecord[] { return this.data.testimonials; }
  public getMessages(): MessageRecord[] { return this.data.messages; }
  public getAuditLogs(): AuditLogRecord[] { return this.data.audit_logs; }

  // User Operations
  public findUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: Omit<UserRecord, "id" | "created_at">): UserRecord {
    const newUser: UserRecord = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<UserRecord>): UserRecord | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.saveData();
    return user;
  }

  // Lead Operations
  public addLead(lead: Omit<LeadRecord, "id" | "status" | "created_at">): LeadRecord {
    const newLead: LeadRecord = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: "new",
      created_at: new Date().toISOString()
    };
    this.data.leads.unshift(newLead);
    this.saveData();
    return newLead;
  }

  public updateLeadStatus(id: string, status: LeadRecord["status"]): LeadRecord | undefined {
    const lead = this.data.leads.find(l => l.id === id);
    if (!lead) return undefined;
    lead.status = status;
    this.saveData();
    return lead;
  }

  public deleteLead(id: string): boolean {
    const idx = this.data.leads.findIndex(l => l.id === id);
    if (idx === -1) return false;
    this.data.leads.splice(idx, 1);
    this.saveData();
    return true;
  }

  // Message Operations
  public addMessage(msg: Omit<MessageRecord, "id" | "status" | "created_at">): MessageRecord {
    const newMsg: MessageRecord = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: "unread",
      created_at: new Date().toISOString()
    };
    this.data.messages.unshift(newMsg);
    this.saveData();
    return newMsg;
  }

  public updateMessageStatus(id: string, status: MessageRecord["status"]): MessageRecord | undefined {
    const msg = this.data.messages.find(m => m.id === id);
    if (!msg) return undefined;
    msg.status = status;
    this.saveData();
    return msg;
  }

  public deleteMessage(id: string): boolean {
    const idx = this.data.messages.findIndex(m => m.id === id);
    if (idx === -1) return false;
    this.data.messages.splice(idx, 1);
    this.saveData();
    return true;
  }

  // Portfolio Operations
  public addPortfolioItem(item: Omit<PortfolioRecord, "id" | "created_at" | "updated_at">): PortfolioRecord {
    const newItem: PortfolioRecord = {
      ...item,
      id: `proj_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.portfolio_items.unshift(newItem);
    this.saveData();
    return newItem;
  }

  public updatePortfolioItem(id: string, updates: Partial<PortfolioRecord>): PortfolioRecord | undefined {
    const item = this.data.portfolio_items.find(p => p.id === id);
    if (!item) return undefined;
    Object.assign(item, updates, { updated_at: new Date().toISOString() });
    this.saveData();
    return item;
  }

  public deletePortfolioItem(id: string): boolean {
    const idx = this.data.portfolio_items.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.portfolio_items.splice(idx, 1);
    this.saveData();
    return true;
  }

  // Blog Operations
  public addBlogPost(post: Omit<BlogPostRecord, "id" | "created_at" | "updated_at">): BlogPostRecord {
    const newPost: BlogPostRecord = {
      ...post,
      id: `post_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.blog_posts.unshift(newPost);
    this.saveData();
    return newPost;
  }

  public deleteBlogPost(id: string): boolean {
    const idx = this.data.blog_posts.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.blog_posts.splice(idx, 1);
    this.saveData();
    return true;
  }

  // Testimonials
  public addTestimonial(test: Omit<TestimonialRecord, "id" | "created_at">): TestimonialRecord {
    const newTest: TestimonialRecord = {
      ...test,
      id: `test_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.data.testimonials.unshift(newTest);
    this.saveData();
    return newTest;
  }

  public deleteTestimonial(id: string): boolean {
    const idx = this.data.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.data.testimonials.splice(idx, 1);
    this.saveData();
    return true;
  }

  // Audit Logs
  public addAuditLog(log: Omit<AuditLogRecord, "id" | "timestamp">): AuditLogRecord {
    const newLog: AuditLogRecord = {
      ...log,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString()
    };
    this.data.audit_logs.unshift(newLog);
    // Keep max 500 audit logs
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs = this.data.audit_logs.slice(0, 500);
    }
    this.saveData();
    return newLog;
  }
}

export const db = new DatabaseEngine();
