import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PractitionerNavbar from "../components/PractitionerNavbar";
import wellnessImg from "../assets/images/wellness.jpeg";
import therapyImg from "../assets/images/therapy.jpeg";
import communityImg from "../assets/images/community.jpeg";
import manageProduct from "../assets/images/manageproduct.png";
import createProduct from "../assets/images/createproduct.png";
import { 
  ArrowUpRight, 
  Activity, 
  Calendar, 
  Stethoscope, 
  ArrowLeft, 
  ShoppingBag, 
  PackagePlus,
  MessageSquare 
} from "lucide-react";

export default function PractitionerHome() {
  const [practitioner, setPractitioner] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPractitioner = JSON.parse(localStorage.getItem("practitioner"));
    if (!storedPractitioner) {
      setPractitioner({ name: "Practitioner", id: 1 });
      return;
    }
    setPractitioner(storedPractitioner);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const DashboardCard = ({ title, desc, btnText, link, img, icon: Icon, delay }) => (
    <div
      className="group relative animate-fade-in opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-6 flex flex-col h-full shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
        
        {/* Image Container */}
        <div className="relative h-48 mb-6 overflow-hidden rounded-2xl">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md">
            <Icon className="text-blue-500" size={18} />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-grow space-y-2">
          <h3 className="text-2xl font-black italic uppercase tracking-tight group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{desc}</p>
        </div>

        {/* Navigation Button */}
        <button
          onClick={() => navigate(link)}
          className="mt-6 flex items-center justify-between w-full px-6 py-4 bg-[#1B3C53] text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-md active:scale-95"
        >
          {btnText} <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );

  if (!practitioner) return null;

  return (
    <div className="relative min-h-screen bg-[#FDFDFD] text-gray-900 font-sans">
      <PractitionerNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 space-y-16">

        {/* Hero Header */}
        <header className="border-b-2 border-dashed border-gray-200 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-1.5 bg-[#FF004D]" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#FF004D]">
              Verified Practitioner Portal
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
            Welcome Dr. <br />
            <span className="text-blue-600">
              {practitioner.name?.split(" ")[0] || user?.name?.split(" ")[0] || "Practitioner"}
            </span>
          </h1>
        </header>

        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* THERAPY SECTION */}
          <DashboardCard
            title="Manage Therapies"
            desc="Review your active clinical services, update pricing, or modify therapy descriptions."
            btnText="Services List"
            link="/practitioner/therapies"
            img={wellnessImg}
            icon={Activity}
            delay={100}
          />

          <DashboardCard
            title="Create Therapy"
            desc="Deploy a new healthcare program or specialized therapy service to the platform."
            btnText="Add Service"
            link="/practitioner/therapies/create"
            img={therapyImg}
            icon={Stethoscope}
            delay={200}
          />

          {/* COMMUNITY SECTION */}
          <DashboardCard
            title="Community Forum"
            desc="Respond to patient inquiries, share expertise, and engage with the wellness community."
            btnText="Open Forum"
            link="/practitioner/community"
            img={communityImg}
            icon={MessageSquare}
            delay={300}
          />

          {/* PRODUCT SECTION */}
          <DashboardCard
            title="Manage Products"
            desc="Audit your wellness product catalog, track sales performance, and adjust stock."
            btnText="Inventory Hub"
            link="/practitioner/products"
            img={manageProduct}
            icon={ShoppingBag}
            delay={400}
          />

          <DashboardCard
            title="Add New Product"
            desc="Expand your pharmacy or wellness shop by listing new healthcare products."
            btnText="List Product"
            link="/practitioner/products/create"
            img={createProduct}
            icon={PackagePlus}
            delay={500}
          />

          {/* SESSIONS SECTION */}
          <DashboardCard
            title="Practitioner Sessions"
            desc="Manage your upcoming appointments and access historical patient consultation logs."
            btnText="View Schedule"
            link="/practitioner/sessions"
            img={therapyImg}
            icon={Calendar}
            delay={600}
          />

        </div>
      </main>

      <style>{`
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(40px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
      `}</style>
    </div>
  );
}
