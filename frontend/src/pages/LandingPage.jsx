import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Heart, Star, CheckCircle } from "lucide-react";

const FEATURES = [
  {
    emoji: "🧘",
    colorClass: "bg-purple-50 border-purple-100 text-purple-700",
    title: "Alternative Therapies",
    desc: "Book verified Ayurveda, Acupuncture, Physiotherapy & Chiropractic sessions with certified practitioners.",
  },
  {
    emoji: "🛍️",
    colorClass: "bg-sky-50 border-sky-100 text-sky-700",
    title: "Wellness Products",
    desc: "Shop a curated marketplace of organic herbs, supplements & holistic wellness products.",
  },
  {
    emoji: "🤖",
    colorClass: "bg-emerald-50 border-emerald-100 text-emerald-700",
    title: "AI-Powered Insights",
    desc: "Get personalized therapy & product recommendations powered by our intelligent AI engine.",
  },
  {
    emoji: "💬",
    colorClass: "bg-amber-50 border-amber-100 text-amber-700",
    title: "Wellness Community",
    desc: "Join thousands of members. Share your journey, ask questions, and grow together.",
  },
];

const STATS = [
  { value: "500+", label: "Verified Practitioners" },
  { value: "12K+", label: "Happy Clients" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "50+", label: "Therapy Types" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Yoga & Wellness Enthusiast",
    text: "Wellnest completely transformed my health journey. Found the perfect Ayurveda practitioner within minutes. The whole experience was seamless!",
    rating: 5,
    initials: "PS",
    accent: "bg-purple-600",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer",
    text: "The AI recommendation suggested acupuncture for my chronic back pain — absolute game changer. I've tried 3 sessions and feel incredible.",
    rating: 5,
    initials: "RM",
    accent: "bg-sky-600",
  },
  {
    name: "Ananya Iyer",
    role: "Certified Nutritionist",
    text: "As a practitioner on Wellnest, I grew my client base by 3x in just 2 months. The platform is beautifully designed and very easy to use.",
    rating: 5,
    initials: "AI",
    accent: "bg-emerald-600",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create Your Account", desc: "Sign up in 30 seconds. No credit card required." },
  { step: "02", title: "Discover Therapies", desc: "Browse practitioners & products tailored to your needs." },
  { step: "03", title: "Book & Heal", desc: "Book sessions, shop products, and start your wellness journey." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed?.role === "PRACTITIONER") navigate("/practitioner/home", { replace: true });
        else if (parsed?.role === "ADMIN") navigate("/admin", { replace: true });
        else navigate("/home", { replace: true });
      } catch {}
    }
  }, [navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">

      {/* ─────────── NAV ─────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-100 py-3 shadow-sm" : "bg-transparent py-5"
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-base shadow-md">🌿</div>
            <span className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">Wellnest</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                scrolled ? "text-slate-700 hover:bg-slate-50 border border-slate-200" : "text-white hover:bg-white/10 border border-white/20"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest shadow-md transition-all hover:-translate-y-0.5"
            >
              Get Started <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-slate-950 px-6 py-24 overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80"
          alt="wellness"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 pointer-events-none"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent pointer-events-none" />
        {/* Teal glow */}
        <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div className="space-y-6 max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              <Sparkles size={12} /> India's Premier Wellness Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
              Your Path to<br />
              <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                Holistic Healing
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Discover verified alternative therapists, shop organic wellness products, and get AI-powered health insights — all in one beautiful platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
              >
                Start Free Today <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/20 hover:border-white/40 hover:bg-white/10 text-white text-sm font-bold backdrop-blur-sm transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-white/10">
              {[
                { icon: <ShieldCheck size={14} />, text: "Verified Practitioners" },
                { icon: <Leaf size={14} />, text: "Natural Products" },
                { icon: <Heart size={14} />, text: "12,000+ Clients" },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                  <span className="text-emerald-400">{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>
          </div>

          {/* Floating glass card — right side */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4 shadow-2xl hidden lg:block w-80 justify-self-end">
            <h3 className="text-white text-xs font-black uppercase tracking-wider border-b border-white/10 pb-2">Active Sessions</h3>
            {[{ label: "Ayurveda Sessions", count: "2.4k+" }, { label: "Acupuncture", count: "1.1k+" }, { label: "Physiotherapy", count: "3.2k+" }].map((item, i) => (
              <div key={i} className={`flex justify-between items-center py-2 ${i < 2 ? "border-b border-white/5" : ""}`}>
                <span className="text-slate-300 text-xs font-semibold">{item.label}</span>
                <span className="text-emerald-400 text-xs font-extrabold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── STATS ─────────── */}
      <section className="bg-slate-950 border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-y divide-white/5 md:divide-y-0 md:divide-x divide-white/5">
          {STATS.map((s, i) => (
            <div key={i} className="text-center md:first:pl-0 pt-6 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent tracking-tight mb-1">{s.value}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-black uppercase tracking-widest text-emerald-700">
              <Sparkles size={11} /> How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple. Fast. <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">Effective.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i} className="relative p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 space-y-4">
                <div className="text-4xl font-black text-slate-100 tracking-tighter leading-none">{h.step}</div>
                <h3 className="text-base font-extrabold text-slate-900">{h.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-black uppercase tracking-widest text-emerald-700">
              <Sparkles size={11} /> What We Offer
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything for your <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">wellness journey</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              A complete ecosystem designed to connect you with the best alternative therapies and wellness products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex gap-5 p-6 bg-white border border-slate-100 rounded-2xl hover:shadow-md hover:border-emerald-100 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl border ${f.colorClass}`}>
                  {f.emoji}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── TESTIMONIALS ─────────── */}
      <section className="py-24 px-6 bg-gradient-to-b from-teal-50/30 to-sky-50/30 border-y border-slate-100">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-[10px] font-black uppercase tracking-widest text-amber-700 border border-amber-100">
              <Star size={11} className="fill-amber-500 text-amber-500" /> Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Loved by <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">thousands</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-all duration-300 space-y-6 shadow-sm">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed flex-grow">"{t.text}"</p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className={`w-10 h-10 rounded-full ${t.accent} text-white flex items-center justify-center text-xs font-black`}>
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 truncate">{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">{t.role}</p>
                  </div>
                  <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA BANNER ─────────── */}
      <section className="relative px-6 py-24 bg-slate-950 text-center overflow-hidden">
        {/* BG Image overlay */}
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=80"
          alt="cta bg"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 to-sky-950/90 pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Transform Your Health?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Join 12,000+ people already healing naturally. Free to sign up, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-emerald-700 font-black text-xs uppercase tracking-widest transition-all shadow-lg"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-bold text-xs transition-all"
            >
              Already have an account
            </button>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="bg-slate-950 text-white px-6 py-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 pb-12 border-b border-white/5">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white text-sm">🌿</div>
                <span className="text-base font-black tracking-tighter text-white uppercase italic">Wellnest</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
                India's premier marketplace for alternative therapies and holistic wellness products.
              </p>
            </div>
            {/* Links */}
            {[
              {
                heading: "Platform",
                links: [
                  { label: "Browse Therapies", route: "/login" },
                  { label: "Wellness Products", route: "/login" },
                  { label: "AI Insights", route: "/login" },
                  { label: "Community", route: "/login" },
                ],
              },
              {
                heading: "For Practitioners",
                links: [
                  { label: "Join as Practitioner", route: "/signup" },
                  { label: "Manage Sessions", route: "/login" },
                  { label: "Upload Certificates", route: "/login" },
                  { label: "Analytics", route: "/login" },
                ],
              },
              {
                heading: "Company",
                links: [
                  { label: "About Us", route: "/about" },
                  { label: "Privacy Policy", route: "/privacy" },
                  { label: "Terms of Service", route: "/terms" },
                  { label: "Contact", route: "/contact" },
                ],
              },
            ].map((col, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{col.heading}</h4>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  {col.links.map((l, j) => (
                    <li key={j}>
                      <button onClick={() => navigate(l.route)} className="hover:text-white transition-colors text-left">
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-600">
            <p>© 2025 Wellnest. All rights reserved.</p>
            <p>Made with ❤️ for holistic wellness</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
