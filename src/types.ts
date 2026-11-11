export interface ServiceItem {
  id: string;
  category: "AI" | "Automation" | "Software" | "Web" | "Mobile" | "Data";
  title: string;
  description: string;
  features: string[];
  iconName: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  iconName: string;
  challenge: string;
  solution: string;
  businessImpact: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  technologies: string[];
  businessImpact: string;
  image: string;
  gallery: string[];
  videoUrl?: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  photoUrl: string;
  logoText: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
}

export interface LeadBooking {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  message: string;
  service: string;
  budget: string;
  status: "new" | "contacted" | "qualified" | "closed";
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  category: "Executive" | "Engineering" | "Design" | "AI Labs";
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  totalMessages: number;
  totalProjects: number;
  totalPosts: number;
  revenuePotential: number;
}
