import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import SectionHome from "../components/SectionHome";
import api from "../api/axios";

import wellnessImg from "../assets/images/wellness.jpeg";
import therapyImg from "../assets/images/therapy.jpeg";
import productsImg from "../assets/images/products.jpeg";
import communityImg from "../assets/images/community.jpeg";
import aiImg from "../assets/images/ai-recommendation.jpeg";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  /* ===================== AUTH ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        localStorage.clear();
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  /* ===================== SCROLL TO SECTION ===================== */
  useEffect(() => {
    if (!location.hash) return;

    const sectionId = location.hash.replace("#", "");
    const section = document.getElementById(sectionId);

    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-lg font-medium text-slate-500">
          Preparing your wellness space…
        </p>
      </div>
    );
  }

  /* ===================== HANDLERS ===================== */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const handleEnterSystem = () => {
    navigate("/my-sessions");
  };

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="text-[17px] font-semibold text-slate-900">
        <Navbar
          user={user}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
        />
      </div>

      <main className="pt-24 space-y-32">
        {/* HERO */}
        <SectionHome
          isFirst
          title={`Welcome, ${user?.name || user?.email}`}
          description="A premium wellness ecosystem designed to bring balance, clarity, and calm into your daily life. Connect with trusted practitioners, explore mindful products, receive intelligent insights, and grow within a conscious community — all in one serene space."
          buttonText="Enter Your Space"
          onClick={handleEnterSystem}
          image={wellnessImg}
          bgColor="bg-gradient-to-b from-white to-slate-50"
        />

        {/* THERAPY */}
        <section id="therapy">
          <SectionHome
            title="Neural Therapy & Expert Guidance"
            description="Begin personalized therapy sessions with verified wellness practitioners. Designed to support emotional healing, stress management, and personal growth in a safe, calming environment."
            buttonText="Begin Therapy"
            redirectTo="/book-therapy"
            image={therapyImg}
            reverse
          />
        </section>

        {/* PRODUCTS */}
        <section id="market">
          <SectionHome
            title="Curated Wellness Products"
            description="Discover thoughtfully selected wellness products that support mindful living and long-term balance."
            buttonText="Explore Products"
            redirectTo="/products"
            image={productsImg}
            bgColor="bg-slate-50"
          />
        </section>

        {/* COMMUNITY */}
        <section id="community">
          <SectionHome
            title="The Wellness Collective"
            description="Healing is better together. Join a conscious community where individuals connect through empathy, shared experiences, and personal growth."
            buttonText="Join Community"
            redirectTo="/community"
            image={communityImg}
            reverse
          />
        </section>

        {/* AI */}
        <section id="ai">
          <SectionHome
            title="AI-Powered Wellness Insights"
            description="Understand your wellness patterns through intelligent analysis."
            buttonText="Run Diagnostic"
            redirectTo="/ai-recommendation"
            image={aiImg}
            bgColor="bg-gradient-to-b from-slate-50 to-white"
          />
        </section>
      </main>
    </div>
  );
}
