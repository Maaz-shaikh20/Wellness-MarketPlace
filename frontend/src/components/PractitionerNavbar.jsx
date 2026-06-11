import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Stethoscope,
  PlusSquare,
  CalendarClock,
  ShoppingBag,
  PackagePlus,
  MessageCircle,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Shield,
  Menu,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard",        path: "/practitioner/home" },
  { icon: Stethoscope,     label: "My Therapies",     path: "/practitioner/therapies" },
  { icon: PlusSquare,      label: "Create Therapy",   path: "/practitioner/therapies/create" },
  { icon: CalendarClock,   label: "Session Queue",    path: "/practitioner/sessions" },
  { icon: ShoppingBag,     label: "Products",         path: "/practitioner/products" },
  { icon: PackagePlus,     label: "Add Product",      path: "/practitioner/products/create" },
  { icon: MessageCircle,   label: "Community",        path: "/practitioner/community" },
];

export default function PractitionerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const practitioner = JSON.parse(localStorage.getItem("practitioner")) || {};
  const firstName = practitioner?.name?.split(" ")[0] || "Doctor";
  const initials = (practitioner?.name || "DR")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isVerified = practitioner?.verified;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ─── TOP BAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className="h-full bg-[#0A1628] border-b border-white/[0.06] flex items-center justify-between px-5 md:px-8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">

          {/* Left: Logo + Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Brand */}
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate("/practitioner/home")}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Shield size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white font-black text-lg tracking-tight hidden sm:block">
                Wellnest <span className="text-blue-400 font-medium text-sm">Pro</span>
              </span>
            </div>
          </div>

          {/* Center: Nav Pills (desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-2 py-1.5">
            {NAV_LINKS.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold tracking-wide transition-all ${
                  isActive(path)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Right: Status + Profile */}
          <div className="flex items-center gap-3">
            {/* Verified badge */}
            <span
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                isVerified
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
              {isVerified ? "Verified" : "Pending"}
            </span>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-black shadow">
                  {initials}
                </div>
                <span className="text-white text-[12px] font-bold hidden sm:block">Dr. {firstName}</span>
                <ChevronDown
                  size={13}
                  className={`text-white/40 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0F1E35] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-white font-bold text-sm">{practitioner?.name || "Practitioner"}</p>
                    <p className="text-white/40 text-[11px] truncate">{practitioner?.email || ""}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/practitioner/profile"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-white/70 hover:text-white hover:bg-white/[0.06] transition font-medium"
                    >
                      <User size={14} /> My Profile
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/practitioner/sessions"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-white/70 hover:text-white hover:bg-white/[0.06] transition font-medium"
                    >
                      <CalendarClock size={14} /> Session Queue
                    </button>
                  </div>
                  <div className="border-t border-white/[0.06] py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[12px] text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition font-medium"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE SLIDE-DOWN MENU ─── */}
      {mobileOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#0A1628] border-b border-white/[0.06] shadow-2xl md:hidden">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ icon: Icon, label, path }) => (
              <button
                key={path}
                onClick={() => { setMobileOpen(false); navigate(path); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                  isActive(path)
                    ? "bg-blue-600 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
            <div className="border-t border-white/[0.06] pt-2 mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click-outside to close profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </>
  );
}
