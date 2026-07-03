'use client';

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCategories, Category } from "@/api/categories";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Support", href: "/help" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/news" },
];

export function Footer() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.categories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      toast.success("Thank you for subscribing to our newsletter!");
    }
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/saudihorizon", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/saudihorizon", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/saudihorizon", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/saudihorizon", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  // Use top 6 categories for the footer
  const footerCategories = categories.slice(0, 6);

  return (
    <footer ref={footerRef} className="bg-charcoal pt-24 pb-8 border-t border-white/5 relative z-10">
      <div className="container-premium">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-wider text-white font-display">
                SAUDI <span className="text-gold">HORIZON</span>
              </span>
              <p className="text-[10px] text-white/40 tracking-[0.2em] mt-1">شركة الأفق السعودية</p>
            </Link>
            <p className="text-body-md text-white/60 mb-8 leading-relaxed">
              Your trusted partner for all heavy equipment spare parts.
              ANC brand specialist for engine, turbocharger, electrical, and hydraulic parts.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gold hover:text-navy transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-bold mb-8 text-white">Company</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-md text-white/60 hover:text-gold transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-[1px] bg-gold mr-0 group-hover:mr-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Product Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-bold mb-8 text-white">Our Products</h4>
            <ul className="space-y-4">
              {footerCategories.length > 0 ? (
                footerCategories.map((category) => (
                  <li key={category.name}>
                    <Link
                      href={`/products?category=${encodeURIComponent(category.name)}`}
                      className="text-body-md text-white/60 hover:text-gold transition-colors flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-[1px] bg-gold mr-0 group-hover:mr-3 transition-all duration-300" />
                      {category.name.replace(' GROUP', '')}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/products" className="text-body-md text-white/60 hover:text-gold transition-colors">Engine Parts</Link></li>
                  <li><Link href="/products" className="text-body-md text-white/60 hover:text-gold transition-colors">Hydraulic Systems</Link></li>
                  <li><Link href="/products" className="text-body-md text-white/60 hover:text-gold transition-colors">Transmission</Link></li>
                </>
              )}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-bold mb-8 text-white">Get In Touch</h4>

            {/* Contact Info */}
            <div className="space-y-5 mb-10">
              <a href="tel:+966570196677" className="flex items-center gap-4 text-body-md text-white/60 hover:text-gold transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <span>+966 57 019 6677</span>
              </a>
              <a href="mailto:salehma@saudihorizon.online" className="flex items-center gap-4 text-body-md text-white/60 hover:text-gold transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <span>salehma@saudihorizon.online</span>
              </a>
              <div className="flex items-start gap-4 text-body-md text-white/60">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <span className="leading-relaxed">
                  Al-Noor Mall, Omar bin Al-Khattab Street, Riyadh, KSA
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-body-sm text-white/60 mb-5 leading-relaxed">
                Stay updated with our latest stock arrivals.
              </p>
              {subscribed ? (
                <div className="p-4 rounded-lg bg-gold/10 border border-gold/20">
                  <p className="text-gold font-semibold text-sm">Welcome to our inner circle!</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Engineering your inbox..."
                    className="flex-1 bg-white/5 border border-white/10 px-5 py-4 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-all text-body-md pr-14"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 bg-gold text-navy w-10 h-10 rounded-md flex items-center justify-center hover:bg-yellow transition-all active:scale-95"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <p className="text-body-sm text-white/30">
              © 2026 Saudi Horizon Co.
            </p>
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            <p className="text-[10px] text-white/20 tracking-widest hidden md:block">PROFESSIONAL INDUSTRIAL SOLUTIONS</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/privacy" className="text-body-sm text-white/40 hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-body-sm text-white/40 hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-body-sm text-white/40 hover:text-gold transition-colors">
              Cookie Policy
            </Link>
            <Link href="/contact" className="text-body-sm text-white/40 hover:text-gold transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
