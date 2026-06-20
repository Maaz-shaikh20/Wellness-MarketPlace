import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Clock, CheckCircle } from "lucide-react";

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fff", color: "#0f172a", minHeight: "100vh" }}>
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

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "64px 2rem 48px", background: "linear-gradient(160deg,#f0fdf4 0%,#f0f9ff 100%)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", fontSize: "0.72rem", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
          📬 Get In Touch
        </div>
        <h1 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 14 }}>
          We'd love to <span style={{ background: "linear-gradient(135deg,#059669,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>hear from you</span>
        </h1>
        <p style={{ color: "#475569", fontSize: "1rem", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          Whether you have a question, feedback, or want to partner with us — our team is here to help.
        </p>
      </section>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 2rem 100px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48, alignItems: "start" }}>

        {/* Left — info */}
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 900, marginBottom: 24, letterSpacing: "-0.02em" }}>Contact Information</h2>
          {[
            { icon: <Mail size={18} />, label: "Email", value: "mrshaikh131126@gmail.com", color: "#059669", bg: "#d1fae5" },
            { icon: <MapPin size={18} />, label: "Location", value: "Solapur, Maharashtra, India", color: "#0369a1", bg: "#e0f2fe" },
            { icon: <Clock size={18} />, label: "Support Hours", value: "Mon–Sat, 9 AM – 7 PM IST", color: "#b45309", bg: "#fef3c7" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f172a" }}>{item.value}</p>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 36, padding: "24px", borderRadius: 20, background: "#0f172a" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: 6 }}>Looking to join as a practitioner?</p>
            <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>Get verified and start accepting bookings within 48 hours.</p>
            <button onClick={() => navigate("/signup")} style={{ padding: "10px 20px", borderRadius: 100, background: "linear-gradient(135deg,#10b981,#0ea5e9)", border: "none", color: "#fff", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer" }}>
              Join as Practitioner
            </button>
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: "#f8fafc", borderRadius: 28, padding: "40px 36px", border: "1px solid #e2e8f0" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <CheckCircle size={28} color="#059669" />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 900, marginBottom: 10 }}>Message Sent!</h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7 }}>Thanks for reaching out. Our team will get back to you within 24 hours.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} style={{ marginTop: 24, padding: "10px 24px", borderRadius: 100, background: "#0f172a", border: "none", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, marginBottom: 4 }}>Send a Message</h3>
              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
                { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                { key: "subject", label: "Subject", type: "text", placeholder: "How can we help?" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #e2e8f0", fontSize: "0.88rem", background: "#fff", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s" }}
                    onFocus={e => e.target.style.borderColor = "#34d399"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b", marginBottom: 6 }}>Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us more..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #e2e8f0", fontSize: "0.88rem", background: "#fff", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#34d399"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>
              <button type="submit" style={{ padding: "14px", borderRadius: 14, background: "#0f172a", border: "none", color: "#fff", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}
                onMouseOver={e => e.currentTarget.style.background = "#1e293b"}
                onMouseOut={e => e.currentTarget.style.background = "#0f172a"}>
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
