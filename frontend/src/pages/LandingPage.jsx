import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Heart, Star, CheckCircle } from "lucide-react";

const FEATURES = [
  {
    emoji: "🧘",
    color: "#5B21B6",
    bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
    title: "Alternative Therapies",
    desc: "Book verified Ayurveda, Acupuncture, Physiotherapy & Chiropractic sessions with certified practitioners.",
  },
  {
    emoji: "🛍️",
    color: "#0369a1",
    bg: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
    title: "Wellness Products",
    desc: "Shop a curated marketplace of organic herbs, supplements & holistic wellness products.",
  },
  {
    emoji: "🤖",
    color: "#059669",
    bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
    title: "AI-Powered Insights",
    desc: "Get personalized therapy & product recommendations powered by our intelligent AI engine.",
  },
  {
    emoji: "💬",
    color: "#b45309",
    bg: "linear-gradient(135deg,#fef3c7,#fde68a)",
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
    accent: "#7c3aed",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer",
    text: "The AI recommendation suggested acupuncture for my chronic back pain — absolute game changer. I've tried 3 sessions and feel incredible.",
    rating: 5,
    initials: "RM",
    accent: "#0369a1",
  },
  {
    name: "Ananya Iyer",
    role: "Certified Nutritionist",
    text: "As a practitioner on Wellnest, I grew my client base by 3x in just 2 months. The platform is beautifully designed and very easy to use.",
    rating: 5,
    initials: "AI",
    accent: "#059669",
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
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fff", color: "#0f172a", overflowX: "hidden" }}>

      {/* ─────────── NAV ─────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 2rem",
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>🌿</div>
            <span style={{ fontSize: "1.15rem", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", textTransform: "uppercase", fontStyle: "italic" }}>Wellnest</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/login")} style={{ padding: "9px 22px", borderRadius: 100, background: "transparent", border: "1.5px solid rgba(15,23,42,0.18)", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", cursor: "pointer", transition: "all 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(15,23,42,0.05)"}
              onMouseOut={e => e.currentTarget.style.background = "transparent"}>
              Sign In
            </button>
            <button onClick={() => navigate("/signup")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 22px", borderRadius: 100, background: "#0f172a", border: "none", fontSize: "0.85rem", fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(15,23,42,0.25)", transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.35)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.25)"; }}>
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─────────── HERO ─────────── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80"
          alt="wellness"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.60) 55%, rgba(15,23,42,0.35) 100%)" }} />
        {/* Teal accent glow */}
        <div style={{ position: "absolute", top: "20%", right: "8%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "120px 2rem 80px", width: "100%" }}>
          <div style={{ maxWidth: 680 }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 100, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", fontSize: "0.75rem", fontWeight: 700, color: "#34d399", marginBottom: 28, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              <Sparkles size={13} /> India's Premier Wellness Marketplace
            </div>

            <h1 style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.04em", color: "#fff", marginBottom: 22 }}>
              Your Path to<br />
              <span style={{ background: "linear-gradient(135deg, #34d399 0%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Holistic Healing
              </span>
            </h1>

            <p style={{ fontSize: "1.1rem", fontWeight: 400, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 44, maxWidth: 520 }}>
              Discover verified alternative therapists, shop organic wellness products, and get AI-powered health insights — all in one beautiful platform.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
              <button onClick={() => navigate("/signup")} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 34px", borderRadius: 100, background: "linear-gradient(135deg,#10b981,#0ea5e9)", border: "none", fontSize: "1rem", fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 8px 28px rgba(16,185,129,0.45)", transition: "all 0.25s", letterSpacing: "-0.01em" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(16,185,129,0.55)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 28px rgba(16,185,129,0.45)"; }}>
                Start Free Today <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate("/login")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 100, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.3)", fontSize: "0.95rem", fontWeight: 700, color: "#fff", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.25s" }}
                onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
                onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}>
                Sign In
              </button>
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[
                { icon: <ShieldCheck size={15} />, text: "Verified Practitioners" },
                { icon: <Leaf size={15} />, text: "Natural Products" },
                { icon: <Heart size={15} />, text: "12,000+ Clients" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", fontWeight: 600 }}>
                  <span style={{ color: "#34d399" }}>{t.icon}</span> {t.text}
                </div>
              ))}
            </div>
          </div>

          {/* Floating glass card — right side */}
          <div style={{ position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 28, padding: "32px 28px", minWidth: 260, maxWidth: 300, display: "none" }} className="hero-glass-card">
            {[{ label: "Ayurveda Sessions", count: "2.4k+" }, { label: "Acupuncture", count: "1.1k+" }, { label: "Physiotherapy", count: "3.2k+" }].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem", fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: "#34d399", fontSize: "0.95rem", fontWeight: 800 }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── STATS ─────────── */}
      <section style={{ background: "#0f172a", padding: "0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "0 2rem" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "48px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ fontSize: "2.6rem", fontWeight: 900, letterSpacing: "-0.05em", background: "linear-gradient(135deg,#34d399,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section style={{ padding: "100px 2rem", background: "linear-gradient(180deg,#f8fafc 0%,#fff 100%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#059669", marginBottom: 14 }}>
              <Sparkles size={13} /> How It Works
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", marginBottom: 14 }}>
              Simple. Fast. <span style={{ background: "linear-gradient(135deg,#059669,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Effective.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i} style={{ position: "relative", padding: "40px 36px", borderRadius: 28, background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", transition: "all 0.3s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(15,23,42,0.1)"; e.currentTarget.style.borderColor = "#bae6fd"; }}
                onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                <div style={{ fontSize: "3rem", fontWeight: 900, letterSpacing: "-0.06em", color: "#f1f5f9", marginBottom: 16, lineHeight: 1 }}>{h.step}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>{h.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.65 }}>{h.desc}</p>
                {i < 2 && (
                  <div style={{ position: "absolute", top: "50%", right: -20, transform: "translateY(-50%)", zIndex: 2 }}>
                    <ArrowRight size={18} color="#cbd5e1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section style={{ padding: "100px 2rem", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#059669", marginBottom: 14 }}>
              <Sparkles size={13} /> What We Offer
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", marginBottom: 14 }}>
              Everything for your <span style={{ background: "linear-gradient(135deg,#059669,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>wellness journey</span>
            </h2>
            <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>A complete ecosystem designed to connect you with the best alternative therapies and wellness products.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 20, padding: "32px 28px", borderRadius: 24, border: "1px solid #e2e8f0", background: "#fff", transition: "all 0.3s", cursor: "default" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(15,23,42,0.1)"; e.currentTarget.style.borderColor = "#bae6fd"; }}
                onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 16, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>{f.emoji}</div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── TESTIMONIALS ─────────── */}
      <section style={{ padding: "100px 2rem", background: "linear-gradient(160deg,#f0fdf4 0%,#f0f9ff 100%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#f59e0b", marginBottom: 14 }}>
              <Star size={13} /> Testimonials
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a" }}>
              Loved by <span style={{ background: "linear-gradient(135deg,#059669,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>thousands</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 28, padding: "36px 30px", display: "flex", flexDirection: "column", gap: 20, transition: "all 0.3s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(15,23,42,0.09)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 3 }}>
                  {[...Array(t.rating)].map((_, j) => <span key={j} style={{ color: "#f59e0b", fontSize: "1rem" }}>★</span>)}
                </div>
                {/* Quote */}
                <p style={{ fontSize: "0.95rem", color: "#374151", lineHeight: 1.75, fontStyle: "italic", flexGrow: 1 }}>"{t.text}"</p>
                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>{t.initials}</div>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{t.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>{t.role}</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <CheckCircle size={18} color={t.accent} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA BANNER ─────────── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1400&q=80"
          alt="cta bg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(5,150,105,0.93) 0%,rgba(14,165,233,0.9) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "100px 2rem", maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 16, lineHeight: 1.1 }}>
            Ready to Transform Your Health?
          </h2>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", marginBottom: 44, lineHeight: 1.7 }}>
            Join 12,000+ people already healing naturally. Free to sign up, no credit card required.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/signup")} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", borderRadius: 100, background: "#fff", border: "none", fontSize: "1rem", fontWeight: 800, color: "#059669", cursor: "pointer", boxShadow: "0 8px 28px rgba(0,0,0,0.2)", transition: "all 0.25s" }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,0.28)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.2)"; }}>
              Create Free Account <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate("/login")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 100, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.5)", fontSize: "0.95rem", fontWeight: 700, color: "#fff", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.25s" }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}>
              Already have an account
            </button>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer style={{ background: "#0f172a", padding: "60px 2rem 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48, marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
                <span style={{ fontSize: "1.05rem", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", textTransform: "uppercase", fontStyle: "italic" }}>Wellnest</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.75, maxWidth: 220 }}>India's premier marketplace for alternative therapies and holistic wellness products.</p>
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
              <div key={i}>
                <h4 style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", marginBottom: 18 }}>{col.heading}</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.links.map((l, j) => (
                    <li
                      key={j}
                      onClick={() => navigate(l.route)}
                      style={{ fontSize: "0.85rem", color: "#475569", cursor: "pointer", transition: "color 0.2s" }}
                      onMouseOver={e => e.currentTarget.style.color = "#e2e8f0"}
                      onMouseOut={e => e.currentTarget.style.color = "#475569"}
                    >
                      {l.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: "0.8rem", color: "#334155" }}>© 2025 Wellnest. All rights reserved.</p>
            <p style={{ fontSize: "0.8rem", color: "#334155" }}>Made with ❤️ for holistic wellness</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (min-width: 1100px) {
          .hero-glass-card { display: block !important; }
        }
      `}</style>
    </div>
  );
}
