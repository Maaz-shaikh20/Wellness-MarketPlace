import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, Heart, ShieldCheck, Users } from "lucide-react";

const TEAM = [
  { initials: "MS", name: "Maaz Shaikh", role: "Founder & Full Stack Developer", email: "mrshaikh131126@gmail.com", accent: "#7c3aed" },
  { initials: "AP", name: "Arfein Patel", role: "Co-Founder & Full Stack Developer", email: "arfeinpatel@gmail.com", accent: "#0369a1" },
  { initials: "PJ", name: "Parvez Jamadar", role: "Co-Founder & Full Stack Developer", email: "md.parvezjamadar786@gmail.com", accent: "#b45309" },
  { initials: "AK", name: "Affan Khan", role: "Co-Founder & Full Stack Developer", email: "maakhan2109@gmail.com", accent: "#059669" },
];

const VALUES = [
  { icon: <Leaf size={22} />, color: "#059669", bg: "#d1fae5", title: "Natural First", desc: "We believe in the power of holistic and alternative therapies to heal body and mind." },
  { icon: <ShieldCheck size={22} />, color: "#0369a1", bg: "#e0f2fe", title: "Verified & Trusted", desc: "Every practitioner on our platform is manually verified with credentials and reviews." },
  { icon: <Heart size={22} />, color: "#e11d48", bg: "#ffe4e6", title: "Client-Centered", desc: "Our platform is built around the client's journey — from discovery to recovery." },
  { icon: <Users size={22} />, color: "#b45309", bg: "#fef3c7", title: "Community-Driven", desc: "A growing community of healers and seekers, united by a passion for wellness." },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fff", color: "#0f172a", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid #f1f5f9", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🌿</div>
            <span style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.04em", textTransform: "uppercase", fontStyle: "italic" }}>Wellnest</span>
          </div>
          <button onClick={() => navigate("/signup")} style={{ padding: "8px 20px", borderRadius: 100, background: "#0f172a", color: "#fff", border: "none", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "80px 2rem 60px", background: "linear-gradient(160deg,#f0fdf4 0%,#f0f9ff 100%)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", fontSize: "0.72rem", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
          🌿 Our Story
        </div>
        <h1 style={{ fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
          We're building the future<br />of <span style={{ background: "linear-gradient(135deg,#059669,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>holistic wellness</span>
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#475569", lineHeight: 1.75, maxWidth: 580, margin: "0 auto" }}>
          Wellnest was born from a simple belief — that everyone deserves access to quality alternative therapies and wellness products, guided by trusted professionals.
        </p>
      </section>

      {/* MISSION */}
      <section style={{ padding: "80px 2rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 18 }}>Our Mission</h2>
            <p style={{ color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
              We connect people seeking natural healing with India's best alternative therapy practitioners — from Ayurveda and Acupuncture to Physiotherapy and Chiropractic care.
            </p>
            <p style={{ color: "#475569", lineHeight: 1.8 }}>
              Our platform makes it easy to discover, compare, and book verified practitioners while also shopping a curated range of wellness products — all backed by our AI recommendation engine.
            </p>
          </div>
          <div style={{ background: "linear-gradient(135deg,#f0fdf4,#f0f9ff)", borderRadius: 28, padding: "40px 36px", border: "1px solid #e2e8f0" }}>
            {[{ num: "500+", label: "Verified Practitioners" }, { num: "12K+", label: "Happy Clients" }, { num: "98%", label: "Satisfaction Rate" }, { num: "2023", label: "Founded" }].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 3 ? "1px solid #e2e8f0" : "none" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a" }}>{s.num}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: "80px 2rem", background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", textAlign: "center", marginBottom: 48 }}>What We Stand For</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ display: "flex", gap: 18, padding: "28px 24px", borderRadius: 20, background: "#fff", border: "1px solid #e2e8f0" }}>
                <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: 14, background: v.bg, display: "flex", alignItems: "center", justifyContent: "center", color: v.color }}>{v.icon}</div>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: 6 }}>{v.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.65 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ padding: "80px 2rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>Meet the Team</h2>
          <p style={{ color: "#64748b", marginBottom: 48 }}>Passionate builders committed to making wellness accessible for everyone.</p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {TEAM.map((t, i) => (
              <div key={i} style={{ textAlign: "center", padding: "32px 28px", borderRadius: 24, border: `1.5px solid ${i === 0 ? t.accent + "44" : "#e2e8f0"}`, minWidth: 200, background: i === 0 ? `linear-gradient(135deg, ${t.accent}08, #fff)` : "#fff", position: "relative", overflow: "hidden" }}>
                {i === 0 && (
                  <div style={{ position: "absolute", top: 12, right: 12, fontSize: "0.65rem", fontWeight: 800, color: t.accent, background: t.accent + "15", padding: "3px 10px", borderRadius: 100, letterSpacing: "0.06em", textTransform: "uppercase" }}>Founder</div>
                )}
                {i > 0 && (
                  <div style={{ position: "absolute", top: 12, right: 12, fontSize: "0.65rem", fontWeight: 800, color: "#64748b", background: "#f1f5f9", padding: "3px 10px", borderRadius: 100, letterSpacing: "0.06em", textTransform: "uppercase" }}>Co-Founder</div>
                )}
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 800, color: "#fff", margin: "0 auto 16px", boxShadow: `0 4px 16px ${t.accent}40` }}>{t.initials}</div>
                <p style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: 4 }}>{t.name}</p>
                <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 10 }}>{t.role}</p>
                <a href={`mailto:${t.email}`} style={{ fontSize: "0.72rem", color: t.accent, fontWeight: 700, textDecoration: "none", background: t.accent + "12", padding: "4px 12px", borderRadius: 100, display: "inline-block" }}>{t.email}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0f172a", padding: "60px 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", marginBottom: 14, letterSpacing: "-0.03em" }}>Ready to join us?</h2>
        <p style={{ color: "#64748b", marginBottom: 32 }}>Start your wellness journey with Wellnest today.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => navigate("/signup")} style={{ padding: "13px 30px", borderRadius: 100, background: "linear-gradient(135deg,#10b981,#0ea5e9)", border: "none", color: "#fff", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer" }}>Create Free Account</button>
          <button onClick={() => navigate("/login")} style={{ padding: "13px 28px", borderRadius: 100, background: "transparent", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>Sign In</button>
        </div>
      </section>
    </div>
  );
}
