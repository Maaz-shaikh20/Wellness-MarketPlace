import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [errorBanner, setErrorBanner] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorBanner("");
    if (validateForm()) {
      setSubmitted(true);
      setErrors({});
    } else {
      setErrorBanner("Please fill in all required fields correctly.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="text-center px-6 py-16 bg-gradient-to-b from-teal-50/40 via-sky-50/20 to-white">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-6">
          📬 Get In Touch
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
          We'd love to hear from <span className="bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">you</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Whether you have a question, feedback, or want to partner with us — our team is here to help.
        </p>
      </section>

      {/* Contact Content Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
        {/* Info Column */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-6">Contact Information</h2>
            <div className="space-y-6">
              {[
                { icon: <Mail size={18} />, label: "Email", value: "mrshaikh131126@gmail.com", colorClass: "text-emerald-600 bg-emerald-50" },
                { icon: <MapPin size={18} />, label: "Location", value: "Solapur, Maharashtra, India", colorClass: "text-sky-600 bg-sky-50" },
                { icon: <Clock size={18} />, label: "Support Hours", value: "Mon–Sat, 9 AM – 7 PM IST", colorClass: "text-amber-600 bg-amber-50" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.colorClass}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg space-y-4">
            <p className="text-sm font-extrabold">Looking to join as a practitioner?</p>
            <p className="text-xs text-slate-400 leading-relaxed">Get verified and start accepting client bookings within 48 hours.</p>
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md"
            >
              Join as Practitioner
            </button>
          </div>
        </div>

        {/* Form Column */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">Message Sent!</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-widest transition-colors shadow-md"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-200/60 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900">Send a Message</h3>
                <p className="text-xs text-slate-400 mt-1">We typically reply within a few hours.</p>
              </div>

              {/* Error Banner */}
              {errorBanner && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  <XCircle size={16} className="mt-0.5 shrink-0 text-rose-600" />
                  <span>{errorBanner}</span>
                </div>
              )}

              {/* Inputs */}
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full px-4 py-3 rounded-2xl border ${
                      errors.name ? "border-rose-300 focus:ring-rose-200" : "border-slate-200 focus:ring-teal-200"
                    } text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white placeholder:text-slate-300`}
                  />
                  {errors.name && <p className="text-xs text-rose-600 font-semibold mt-1.5 pl-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full px-4 py-3 rounded-2xl border ${
                      errors.email ? "border-rose-300 focus:ring-rose-200" : "border-slate-200 focus:ring-teal-200"
                    } text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white placeholder:text-slate-300`}
                  />
                  {errors.email && <p className="text-xs text-rose-600 font-semibold mt-1.5 pl-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-teal-200 text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={e => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    className={`w-full px-4 py-3 rounded-2xl border ${
                      errors.message ? "border-rose-300 focus:ring-rose-200" : "border-slate-200 focus:ring-teal-200"
                    } text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white placeholder:text-slate-300 resize-none`}
                  />
                  {errors.message && <p className="text-xs text-rose-600 font-semibold mt-1.5 pl-1">{errors.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
