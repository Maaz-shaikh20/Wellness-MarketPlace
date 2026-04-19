import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PractitionerNavbar from "../components/PractitionerNavbar";
import { Plus, Trash2, Edit3, Clock, Tag, CreditCard, Activity, ArrowUpRight, ArrowLeft } from "lucide-react";

export default function ManageTherapies() {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Get practitioner from localStorage
  const practitioner = JSON.parse(localStorage.getItem("practitioner"));
  const practitionerId = practitioner?.id;

  useEffect(() => {
    if (!practitionerId) {
      setError("Practitioner session expired. Please login again.");
      setLoading(false);
      return;
    }
    fetchTherapies();
  }, [practitionerId]);

  const fetchTherapies = async () => {
    try {
      const res = await api.get(`/therapies/practitioner/${practitionerId}`);
      setTherapies(res.data);
    } catch (err) {
      console.error("FETCH THERAPIES ERROR:", err);
      setError("Failed to synchronize inventory.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (therapyId) => {
    if (!window.confirm("Are you sure you want to archive this therapy?")) return;
    try {
      await api.delete(`/therapies/${therapyId}`);
      setTherapies((prev) => prev.filter((t) => t.id !== therapyId));
    } catch (err) {
      console.error("DELETE THERAPY ERROR:", err);
      alert("System failed to delete the record.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3]">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-[#1B3C53]/10 rounded-full" />
          <div className="absolute top-0 w-16 h-16 border-t-2 border-[#FF004D] rounded-full animate-spin" />
        </div>
        <span className="mt-6 tracking-[0.5em] uppercase text-[10px] font-black text-[#1B3C53] animate-pulse">
          Syncing Inventory
        </span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#EFECE3] text-[#1B3C53] font-sans selection:bg-[#FF004D] selection:text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div 
          className="absolute inset-0 bg-repeat animate-mesh-pan" 
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundSize: '150px' }} 
        />
      </div>

      <PractitionerNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* --- TOP LEFT BACK BUTTON --- */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/practitioner/home")}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={14} strokeWidth={3} />
            Back to Dashboard
          </button>
        </div>

        {/* Header Block */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-[#FF004D]" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#FF004D]">
                Clinical Catalog
              </span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic">
              YOUR <br />
              <span className="text-blue-500">SERVICES</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/practitioner/therapies/create")}
            className="group flex items-center gap-4 px-10 py-7 bg-[#1B3C53] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FF004D] transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Create Entry
          </button>
        </section>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 border-y border-[#1B3C53]/10 py-8">
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase opacity-40">Active Records</p>
                <p className="text-2xl font-bold">{therapies.length}</p>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase opacity-40">Avg Duration</p>
                <p className="text-2xl font-bold">~60 Mins</p>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black uppercase opacity-40">Status</p>
                <p className="text-2xl font-bold text-green-600 flex items-center gap-2">Live <Activity size={18}/></p>
            </div>
        </div>

        {error ? (
          <div className="p-10 border-2 border-dashed border-[#FF004D]/20 rounded-[3rem] text-center">
            <p className="text-[#FF004D] font-black uppercase tracking-widest">{error}</p>
          </div>
        ) : therapies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-white/30 rounded-[4rem] border border-white/50 shadow-inner">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#1B3C53]/20 flex items-center justify-center">
                <Plus size={32} className="opacity-20" />
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-bold uppercase italic mb-2">Inventory is empty</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-40">Initialize your first service program</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {therapies.map((therapy, index) => (
              <div
                key={therapy.id}
                className="group relative animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <article className="h-full bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-[#1B3C53]/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                  
                  {/* Image wrapper */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={therapy.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80"}
                      alt={therapy.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md border border-black/5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                           {therapy.category || "General"}
                        </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-3xl font-black uppercase italic leading-none tracking-tighter group-hover:text-blue-600 transition-colors">
                            {therapy.name}
                        </h2>
                        <ArrowUpRight className="opacity-0 group-hover:opacity-20 transition-opacity" size={24} />
                    </div>
                    
                    <p className="text-xs font-medium opacity-50 mb-8 line-clamp-3 leading-relaxed">
                      {therapy.description}
                    </p>

                    <div className="mt-auto space-y-6">
                        <div className="flex items-center justify-between py-4 border-y border-dashed border-[#1B3C53]/10">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-blue-500" />
                                <span className="text-[11px] font-black uppercase">{therapy.duration}m</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard size={16} className="text-[#FF004D]" />
                                <span className="text-[11px] font-black uppercase">₹{therapy.price}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate(`/practitioner/therapies/edit/${therapy.id}`)}
                                className="flex-1 flex items-center justify-center gap-3 py-5 bg-[#1B3C53] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                            >
                                <Edit3 size={14} />
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(therapy.id)}
                                className="px-6 flex items-center justify-center bg-white border-2 border-[#FF004D]/10 text-[#FF004D] rounded-2xl font-black text-[10px] uppercase hover:bg-[#FF004D] hover:text-white transition-all shadow-md active:scale-95"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes mesh-pan { from { background-position: 0 0; } to { background-position: 150px 150px; } }
        .animate-mesh-pan { animation: mesh-pan 60s linear infinite; }
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
      `}</style>
    </div>
  );
}