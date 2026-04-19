import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Navbar({ user, onLogout, onProfileClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false); // Hamburger menu state

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    if (user?.id) fetchUnreadCount();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get(`/notifications/user/${user.id}`);
      const unread = res.data.filter(n => n.status === "UNREAD").length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Could not fetch notification count", err);
    }
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/home") {
      navigate("/home");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      localStorage.clear();
      navigate("/login");
    }
  };

  const navItems = [
    { label: "Therapy", id: "therapy" },
    { label: "Market", id: "market" },
    { label: "Diagnostics", id: "ai" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <nav
        className={`mx-auto max-w-7xl rounded-[2.5rem] transition-all duration-500 border ${
          isScrolled 
            ? "py-3 shadow-2xl shadow-slate-200/50 bg-white/90 border-slate-200" 
            : "py-5 bg-white/40 border-white/20 shadow-sm"
        } backdrop-blur-2xl`}
      >
        <div className="flex items-center justify-between px-8">

          {/* LOGO */}
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
              <span className="text-xl">🌿</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
              Wellnest
            </span>
          </Link>

          {/* NAV ITEMS (optional for desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-white/50 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3 relative">

            {/* HAMBURGER MENU - visible on all screens */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                    <button 
                      onClick={() => { setMenuOpen(false); onProfileClick?.(); }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/activity"); }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                    >
                      My Activity
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="block w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* DESKTOP BUTTONS (optional) */}
            {user && (
              <>
                {/* NOTIFICATIONS */}
                <button
                  onClick={() => navigate("/notifications")}
                  className={`relative p-3 rounded-2xl transition-all duration-500 border-2 ${
                    location.pathname === "/notifications"
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                    : "bg-white border-slate-100 text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-swing" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[8px] font-bold text-white items-center justify-center">
                        {unreadCount}
                      </span>
                    </span>
                  )}
                </button>
              </>
            )}

            {!user && (
              <Link
                to="/login"
                className="px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Get Started
              </Link>
            )}

          </div>
        </div>
      </nav>
    </div>
  );
}