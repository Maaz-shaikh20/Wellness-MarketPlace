import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PractitionerNavbar from "../components/PractitionerNavbar";
import api from "../api/axios";
import {
  Activity, Calendar, Stethoscope, ShoppingBag, PackagePlus,
  MessageSquare, ArrowUpRight, TrendingUp, Users, CheckCircle,
  Clock, Star, PlusSquare, CalendarClock,
} from "lucide-react";

/* ── Stat Card ── */
const StatCard = ({ label, value, icon: Icon, color, delay }) => (
  <div
    className="opacity-0 animate-rise"
    style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
  >
    <div className={`relative overflow-hidden rounded-3xl p-6 border border-white/[0.06] bg-[#0F1E35] shadow-lg group hover:scale-[1.02] transition-all duration-300`}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl -translate-y-8 translate-x-8 ${color}`} />
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${color} bg-opacity-20 border border-white/10`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-white/40 text-[11px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-white text-3xl font-black">{value ?? "—"}</p>
    </div>
  </div>
);

/* ── Action Card ── */
const ActionCard = ({ title, desc, btnText, link, icon: Icon, accent, delay }) => {
  const navigate = useNavigate();
  return (
    <div
      className="opacity-0 animate-rise"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="group h-full relative overflow-hidden rounded-3xl bg-[#0F1E35] border border-white/[0.07] p-7 flex flex-col hover:border-white/20 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-400">
        {/* Glow accent */}
        <div className={`absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.07] blur-3xl -translate-y-10 translate-x-10 ${accent}`} />

        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${accent} bg-opacity-20 border border-white/10`}>
          <Icon size={22} className="text-white" />
        </div>

        {/* Text */}
        <h3 className="text-white text-xl font-black tracking-tight mb-2">{title}</h3>
        <p className="text-white/40 text-sm leading-relaxed flex-grow">{desc}</p>

        {/* Button */}
        <button
          onClick={() => navigate(link)}
          className={`mt-6 w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 text-white border border-white/10 hover:border-white/20 hover:bg-white/[0.08] group-hover:shadow-lg`}
        >
          {btnText}
          <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default function PractitionerHome() {
  const [practitioner, setPractitioner] = useState(null);
  const [stats, setStats] = useState({ sessions: null, therapies: null, rating: null });
  const navigate = useNavigate();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("practitioner"));
    if (!stored) { setPractitioner({ name: "Practitioner", id: 1 }); return; }
    setPractitioner(stored);

    // Fetch live stats
    if (stored.id) {
      Promise.all([
        api.get(`/sessions/practitioner/${stored.id}`).catch(() => ({ data: [] })),
        api.get(`/therapies/practitioner/${stored.id}`).catch(() => ({ data: [] })),
      ]).then(([sessRes, therapyRes]) => {
        const sessions = sessRes.data || [];
        const therapies = therapyRes.data || [];
        setStats({
          sessions: sessions.filter(s => s.status === "BOOKED").length,
          accepted: sessions.filter(s => s.status === "ACCEPTED").length,
          therapies: therapies.length,
          rating: stored.rating?.toFixed(1) ?? "0.0",
        });
      });
    }
  }, []);

  if (!practitioner) return null;

  const firstName = practitioner.name?.split(" ")[0] || "Doctor";

  return (
    <div className="min-h-screen bg-[#060F1E] text-white font-sans">
      <PractitionerNavbar />

      <main className="max-w-7xl mx-auto px-5 md:px-8 pt-24 pb-20">

        {/* ── Hero Header ── */}
        <header
          className="opacity-0 animate-rise mb-12 mt-4"
          style={{ animationFillMode: "forwards" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-blue-400 text-[11px] font-black uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-blue-500" />
                Practitioner Portal
              </p>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                {greeting},<br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Dr. {firstName}.
                </span>
              </h1>
              <p className="mt-4 text-white/40 text-base max-w-lg">
                Here's an overview of your practice today. Manage your sessions, therapies, and products from one place.
              </p>
            </div>

            {/* Status card */}
            <div className="shrink-0 bg-[#0F1E35] border border-white/[0.07] rounded-3xl px-7 py-5 space-y-2">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Account Status</p>
              <div className={`flex items-center gap-2 text-sm font-black ${practitioner.verified ? "text-emerald-400" : "text-amber-400"}`}>
                {practitioner.verified
                  ? <><CheckCircle size={16} /> Verified Practitioner</>
                  : <><Clock size={16} /> Pending Verification</>
                }
              </div>
              <p className="text-white/30 text-[11px]">ID: #{practitioner.id}</p>
            </div>
          </div>
        </header>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          <StatCard label="Pending Requests" value={stats.sessions} icon={Calendar}   color="bg-amber-500"   delay={50} />
          <StatCard label="Upcoming Sessions" value={stats.accepted} icon={TrendingUp} color="bg-emerald-500" delay={100} />
          <StatCard label="Active Therapies"  value={stats.therapies} icon={Stethoscope} color="bg-blue-500" delay={150} />
          <StatCard label="Rating"            value={stats.rating ? `${stats.rating}★` : null} icon={Star} color="bg-purple-500" delay={200} />
        </div>

        {/* ── Section: Clinical Services ── */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-6 rounded-full bg-blue-500" />
            <h2 className="text-white/50 text-[11px] font-black uppercase tracking-widest">Clinical Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ActionCard
              title="Manage Therapies"
              desc="Review your active therapy listings, update pricing, duration, and service descriptions."
              btnText="Open Services"
              link="/practitioner/therapies"
              icon={Stethoscope}
              accent="bg-blue-600"
              delay={250}
            />
            <ActionCard
              title="Create Therapy"
              desc="List a new healthcare program or specialized therapy service on the marketplace."
              btnText="Add New Service"
              link="/practitioner/therapies/create"
              icon={PlusSquare}
              accent="bg-indigo-500"
              delay={300}
            />
            <ActionCard
              title="Session Queue"
              desc="Accept or decline incoming appointment requests and manage your schedule."
              btnText="View Queue"
              link="/practitioner/sessions"
              icon={CalendarClock}
              accent="bg-emerald-600"
              delay={350}
            />
          </div>
        </section>

        {/* ── Section: Products & Community ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-6 rounded-full bg-purple-500" />
            <h2 className="text-white/50 text-[11px] font-black uppercase tracking-widest">Products & Community</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ActionCard
              title="Products Catalog"
              desc="Audit your wellness product catalog, adjust descriptions, and track your listings."
              btnText="Inventory Hub"
              link="/practitioner/products"
              icon={ShoppingBag}
              accent="bg-rose-500"
              delay={400}
            />
            <ActionCard
              title="Add New Product"
              desc="Expand your pharmacy or wellness shop by listing new healthcare products."
              btnText="List Product"
              link="/practitioner/products/create"
              icon={PackagePlus}
              accent="bg-orange-500"
              delay={450}
            />
            <ActionCard
              title="Community Forum"
              desc="Answer patient questions, share expertise, and engage with the wellness community."
              btnText="Open Forum"
              link="/practitioner/community"
              icon={MessageSquare}
              accent="bg-teal-500"
              delay={500}
            />
          </div>
        </section>
      </main>

      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-rise { animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
