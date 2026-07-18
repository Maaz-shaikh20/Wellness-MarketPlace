import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Navbar({ user, onLogout, onProfileClick, manualCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { cartCount } = useCart();

  const displayCount = manualCount !== undefined ? manualCount : unreadCount;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Poll for unread notifications every 30 seconds
  useEffect(() => {
    if (!user?.id) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get(`/notifications/${user.id}/unread`);
      setUnreadCount(res.data.length);
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
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                    <button
                      onClick={() => { setMenuOpen(false); onProfileClick?.(); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/activity"); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
                      </svg>
                      My Cart
                      {cartCount > 0 && (
                        <span className="ml-auto text-[10px] font-black bg-teal-500 text-white rounded-full px-2 py-0.5">{cartCount}</span>
                      )}
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/activity?tab=orders"); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Order History
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/progress"); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold hover:bg-violet-50 transition-colors text-violet-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Progress Tracker
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* DESKTOP BUTTONS (optional) */}
            {user && (
              <>
                {/* CART ICON */}
                <button
                  onClick={() => navigate("/activity")}
                  className={`relative p-3 rounded-2xl transition-all duration-500 border-2 ${
                    location.pathname === "/activity"
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                    : "bg-white border-slate-100 text-slate-900 hover:border-slate-300"
                  }`}
                  title="View Cart"
                >
                  {/* Shopping bag icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
                  </svg>

                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500 text-[8px] font-bold text-white items-center justify-center">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    </span>
                  )}
                </button>

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

                  {displayCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[8px] font-bold text-white items-center justify-center">
                        {displayCount}
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