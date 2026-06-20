import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, Heart, ShieldCheck, Users } from "lucide-react";

const TEAM = [
  { initials: "MS", name: "Maaz Shaikh", role: "Founder & Full Stack Developer", email: "mrshaikh131126@gmail.com", accent: "#0f172a" },
  { initials: "AP", name: "Arfein Patel", role: "Co-Founder & Full Stack Developer", email: "arfeinpatel@gmail.com", accent: "#0ea5e9" },
  { initials: "PJ", name: "Parvez Jamadar", role: "Co-Founder & Full Stack Developer", email: "md.parvezjamadar786@gmail.com", accent: "#d97706" },
  { initials: "AK", name: "Affan Khan", role: "Co-Founder & Full Stack Developer", email: "maakhan2109@gmail.com", accent: "#059669" },
];

const VALUES = [
  { icon: <Leaf size={22} />, colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100", title: "Natural First", desc: "We believe in the power of holistic and alternative therapies to heal body and mind." },
  { icon: <ShieldCheck size={22} />, colorClass: "text-sky-600 bg-sky-50 border-sky-100", title: "Verified & Trusted", desc: "Every practitioner on our platform is manually verified with credentials and reviews." },
  { icon: <Heart size={22} />, colorClass: "text-rose-600 bg-rose-50 border-rose-100", title: "Client-Centered", desc: "Our platform is built around the client's journey — from discovery to recovery." },
  { icon: <Users size={22} />, colorClass: "text-amber-600 bg-amber-50 border-amber-100", title: "Community-Driven", desc: "A growing community of healers and seekers, united by a passion for wellness." },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-base">🌿</div>
            <span className="font-black text-base tracking-tighter text-slate-900 uppercase italic">Wellnest</span>
          </div>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center px-6 py-20 bg-gradient-to-b from-teal-50/40 via-sky-50/20 to-white">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-6">
          🌿 Our Story
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
          We're building the future<br />of <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">holistic wellness</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Wellnest was born from a simple belief — that everyone deserves access to quality alternative therapies and wellness products, guided by trusted professionals.
        </p>
      </section>

      {/* MISSION */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Our Mission</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We connect people seeking natural healing with India's best alternative therapy practitioners — from Ayurveda and Acupuncture to Physiotherapy and Chiropractic care.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our platform makes it easy to discover, compare, and book verified practitioners while also shopping a curated range of wellness products — all backed by our AI recommendation engine.
            </p>
          </div>
          <div className="bg-gradient-to-br from-teal-50/50 to-sky-50/50 border border-slate-100 rounded-3xl p-8 space-y-4">
            {[
              { num: "500+", label: "Verified Practitioners" },
              { num: "12K+", label: "Happy Clients" },
              { num: "98%", label: "Satisfaction Rate" },
              { num: "2023", label: "Founded" }
            ].map((s, i) => (
              <div key={i} className={`flex justify-between items-center py-3.5 ${i < 3 ? "border-b border-slate-200/60" : ""}`}>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</span>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight">{s.num}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-6 py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">What We Stand For</h2>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-bold">Our Core Philosophy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="flex gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${v.colorClass}`}>
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="px-6 py-20 max-w-5xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Meet the Team</h2>
          <p className="text-sm text-slate-500 leading-relaxed mt-2">Passionate builders committed to making wellness accessible for everyone.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          {TEAM.map((t, i) => (
            <div
              key={i}
              className="text-center p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-4 right-4">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                  i === 0 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {i === 0 ? "Founder" : "Co-Founder"}
                </span>
              </div>
              
              <div className="my-6">
                <div
                  style={{ backgroundColor: t.accent, boxShadow: `0 8px 24px ${t.accent}30` }}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-extrabold text-lg mx-auto mb-4"
                >
                  {t.initials}
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">{t.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4 leading-snug">{t.role}</p>
              </div>

              <a
                href={`mailto:${t.email}`}
                className="text-[10px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-slate-50 py-1.5 px-3 rounded-full border border-slate-100 truncate block"
              >
                {t.email}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white px-6 py-20 text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%) pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to join us?</h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">Start your wellness journey with Wellnest today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-bold text-sm transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
