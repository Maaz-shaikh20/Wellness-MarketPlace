import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ClipboardList,
  PlusCircle,
  CalendarCheck,
  LogOut,
  User,
  Menu,
} from "lucide-react";

export default function PractitionerNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const practitioner = JSON.parse(localStorage.getItem("practitioner")) || {};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <div
          className="text-2xl font-black text-[#1B3C53] cursor-pointer hover:text-[#FF004D] transition"
          onClick={() => navigate("/practitioner/home")}
        >
          Wellnest
        </div>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          <button
            onClick={() => navigate("/practitioner/therapies")}
            className="flex items-center gap-2 text-[#1B3C53] hover:text-[#FF004D] transition font-semibold"
          >
            <ClipboardList size={18} />
            Manage Therapies
          </button>

          <button
            onClick={() => navigate("/practitioner/therapies/create")}
            className="flex items-center gap-2 text-[#1B3C53] hover:text-[#FF004D] transition font-semibold"
          >
            <PlusCircle size={18} />
            Create Therapy
          </button>

          <button
            onClick={() => navigate("/practitioner/sessions")}
            className="flex items-center gap-2 text-[#1B3C53] hover:text-[#FF004D] transition font-semibold"
          >
            <CalendarCheck size={18} />
            View Sessions
          </button>
        </div>

        {/* DROPDOWN MENU */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B3C53] text-white font-semibold hover:bg-[#163042] transition"
          >
            <Menu size={18} />
            Dr. {practitioner?.name?.split(" ")[0] || "User"}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/practitioner/profile");
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/practitioner/sessions");
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100"
              >
                <CalendarCheck size={16} />
                My Sessions
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
