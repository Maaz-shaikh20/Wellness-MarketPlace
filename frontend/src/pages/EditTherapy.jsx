import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PractitionerNavbar from "../components/PractitionerNavbar";
import api from "../api/axios";
import { Save, ArrowLeft, Image as ImageIcon, Clock, CreditCard, Activity, Info, Layout } from "lucide-react";

export default function EditTherapy() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapy();
  }, []);

  const fetchTherapy = async () => {
    try {
      const res = await api.get(`/therapies/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load therapy");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/therapies/${id}`, {
        name: form.name,
        description: form.description,
        price: form.price,
        duration: form.duration,
        imageUrl: form.imageUrl,
      });
      navigate("/practitioner/therapies");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3]">
        <div className="w-16 h-16 border-2 border-[#1B3C53]/10 border-t-[#FF004D] rounded-full animate-spin mb-6" />
        <span className="tracking-[0.5em] uppercase text-[10px] font-black text-[#1B3C53]">Reconfiguring Node</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#EFECE3] text-[#1B3C53] font-sans selection:bg-[#FF004D] selection:text-white">
      {/* Background Mesh Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]">
        <div className="absolute inset-0 bg-repeat animate-mesh-pan" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundSize: '150px' }} />
      </div>

      <PractitionerNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* Editorial Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-[#1B3C53]/10 pb-12">
          <div className="space-y-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:gap-4 transition-all"
            >
              <ArrowLeft size={14} /> Back to Catalog
            </button>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic">
              MODIFY <br />
              <span className="text-blue-600">RECORDS</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 px-6 py-4 bg-white/50 rounded-2xl border border-[#1B3C53]/5 shadow-sm">
             <div className="w-3 h-3 bg-[#FF004D] rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest">Editing ID: {id}</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Form Content: Left Side */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Service Identity */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Info size={16} className="text-blue-500" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Identity & Details</h2>
                </div>
                
                <div className="space-y-4">
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Therapy Name"
                        className="w-full bg-white/60 border-2 border-[#1B3C53]/5 focus:border-blue-500 focus:bg-white outline-none rounded-3xl p-6 text-2xl font-bold transition-all shadow-sm"
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the clinical process..."
                        rows="5"
                        className="w-full bg-white/60 border-2 border-[#1B3C53]/5 focus:border-blue-500 focus:bg-white outline-none rounded-3xl p-6 font-medium text-sm leading-relaxed transition-all shadow-sm"
                    />
                </div>
              </div>

              {/* Technical Parameters */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <Layout size={16} className="text-[#FF004D]" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">System Parameters</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:scale-110 transition-transform" size={20} />
                        <input
                            name="duration"
                            value={form.duration}
                            onChange={handleChange}
                            type="number"
                            placeholder="Duration"
                            className="w-full bg-white/60 border-2 border-[#1B3C53]/5 focus:border-blue-500 outline-none rounded-3xl p-6 pl-16 font-bold text-lg transition-all"
                        />
                    </div>
                    <div className="relative group">
                        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FF004D] group-focus-within:scale-110 transition-transform" size={20} />
                        <input
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            type="number"
                            placeholder="Price"
                            className="w-full bg-white/60 border-2 border-[#1B3C53]/5 focus:border-[#FF004D] outline-none rounded-3xl p-6 pl-16 font-bold text-lg transition-all"
                        />
                    </div>
                </div>

                <div className="relative group">
                    <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        placeholder="Asset URL (Image)"
                        className="w-full bg-white/60 border-2 border-[#1B3C53]/5 focus:border-blue-500 outline-none rounded-3xl p-6 pl-16 font-mono text-xs opacity-60 focus:opacity-100 transition-all"
                    />
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit"
                className="group relative w-full py-8 bg-[#1B3C53] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:bg-[#FF004D] transition-all active:scale-95 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-4">
                  <Save size={20} strokeWidth={3} />
                  Synchronize Data
                </div>
              </button>
            </form>
          </div>

          {/* Live Preview: Right Side */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">Live Manifest</h2>
                    <Activity size={14} className="text-green-500 animate-pulse" />
                </div>

                <div className="p-4 rounded-[3.5rem] border-2 border-dashed border-[#1B3C53]/10 bg-white/20">
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-[#1B3C53]/5">
                        <div className="h-64 overflow-hidden relative group">
                            <img 
                                src={form.imageUrl || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"} 
                                alt="Preview" 
                                className="w-full h-full object-cover grayscale brightness-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1B3C53]/80 via-transparent to-transparent opacity-40" />
                        </div>
                        
                        <div className="p-10 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-4xl font-black uppercase italic leading-none tracking-tighter">
                                    {form.name || "UNNAMED_NODE"}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Clinical Protocol</p>
                            </div>

                            <p className="text-xs font-medium opacity-50 line-clamp-3 leading-relaxed">
                                {form.description || "Waiting for node descriptions to be defined by the practitioner..."}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-[#1B3C53]/5">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-blue-500" />
                                    <span className="text-[11px] font-black uppercase">{form.duration || "0"} MINS</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard size={16} className="text-[#FF004D]" />
                                    <span className="text-[11px] font-black uppercase">₹{form.price || "0.00"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-blue-50/50 border border-blue-100/50 rounded-3xl">
                    <p className="text-[10px] leading-relaxed font-bold text-blue-800/60 uppercase italic">
                        Note: All modifications made to this node will be synchronized across the patient-facing portal instantly upon commitment.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes mesh-pan { from { background-position: 0 0; } to { background-position: 150px 150px; } }
        .animate-mesh-pan { animation: mesh-pan 60s linear infinite; }
      `}</style>
    </div>
  );
}