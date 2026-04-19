import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TherapyCard from "../components/TherapyCard";
import { Stethoscope, Plus, Layers, Activity, ArrowLeft } from "lucide-react";
import PractitionerNavbar from "../components/PractitionerNavbar";

export default function PractitionerTherapies() {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTherapies();
  }, []);

  const fetchTherapies = async () => {
    try {
      setLoading(true);
      const user = await api.get("/users/me");
      const res = await api.get(`/therapies/practitioner/${user.data.id}`);
      setTherapies(res.data);
    } catch (error) {
      console.error("Error fetching therapies", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTherapy = async (id) => {
    if (!window.confirm("Are you sure you want to delete this therapy record?")) return;
    try {
      await api.delete(`/therapies/${id}`);
      setTherapies((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      alert("Failed to delete the therapy record.");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#EFECE3] text-[#1B3C53] font-sans overflow-hidden">
      
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]">
        <div
          className="absolute inset-0 bg-repeat animate-mesh-pan"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
            backgroundSize: "150px",
          }}
        />
      </div>

      {/* Navbar */}
      <PractitionerNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-16">

        {/* Back Button */}
        <button
          onClick={() => navigate("/practitioner/home")}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full font-bold text-[12px] uppercase hover:bg-red-600 shadow-md active:scale-95"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Header Section */}
        <header className="border-b-2 border-dashed border-[#1B3C53]/10 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-10 h-1 bg-[#FF004D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF004D]">
                Clinical Inventory
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase italic">
              YOUR THER<span className="text-blue-500">APIES</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/practitioner/therapies/create")}
            className="flex items-center gap-3 px-6 py-3 bg-[#1B3C53] text-white rounded-full font-bold text-[12px] uppercase tracking-[0.15em] hover:bg-[#FF004D] shadow-md active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Add New Therapy
          </button>
        </header>

        {/* Stats Bar */}
        <div className="flex gap-10 overflow-x-auto no-scrollbar pb-4 border-b border-[#1B3C53]/5">
          <div className="flex items-center gap-3 shrink-0">
            <Layers size={14} className="opacity-40" />
            <span className="text-[10px] font-black uppercase tracking-widest">Total: {therapies.length}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Activity size={14} className="text-green-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Active Status</span>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-40 animate-pulse">
            <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Loading Therapies...</span>
          </div>
        ) : therapies.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center border-2 border-dashed border-[#1B3C53]/10 rounded-[2rem]">
            <Stethoscope size={48} strokeWidth={1} className="opacity-20" />
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic">Inventory Empty</h3>
              <p className="text-xs opacity-50 uppercase tracking-widest font-sans">
                No therapy sessions have been initialized yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapies.map((t, index) => (
              <div
                key={t.id}
                className="group relative animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <TherapyCard therapy={t} onDelete={() => deleteTherapy(t.id)} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Animations */}
      <style jsx>{`
        @keyframes mesh-pan { from { background-position: 0 0; } to { background-position: 150px 150px; } }
        .animate-mesh-pan { animation: mesh-pan 60s linear infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
