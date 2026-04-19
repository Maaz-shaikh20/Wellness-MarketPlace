import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import axios from "axios"; // ✅ Import standard axios for external/direct calls

export default function AiRecommendation() {
  const [symptom, setSymptom] = useState("");
  const [history, setHistory] = useState([]);
  const [fdaResults, setFdaResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || { id: 1, name: "User" };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/recommendations/user/${user.id}`);
      setHistory(res.data);
    } catch (err) {
      console.error("History fetch failed", err);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptom) return;
    setLoading(true);
    try {
      await api.post("/recommendations", { userId: user.id, symptom });
      setSymptom("");
      fetchHistory(); 
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFdaSearch = async () => {
    if (!searchQuery) return;
    setSearching(true);
    try {
      /** * ✅ FIX: Since your backend is at http://localhost:8080/external
       * and your 'api' instance adds '/api' automatically, we call the 
       * full URL or use a relative path that breaks out of the prefix.
       */
      const res = await api.get(`http://localhost:8080/external/openfda/search?query=${searchQuery}`);
      setFdaResults(res.data.results || []);
    } catch (err) {
      console.error("FDA Search failed", err);
      setFdaResults([]); // Reset on error
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100">
      <Navbar user={user} />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* SECTION: AI ENGINE & HISTORY */}
        <div className="lg:col-span-7 space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-6">
               <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Active_Neural_Engine</span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-8">
              Symptom_<span className="text-slate-300">Analysis</span>
            </h1>
            
            <form onSubmit={handleAnalyze} className="relative group">
              <input 
                type="text"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="Describe your symptoms (e.g. Knee inflammation)"
                className="w-full px-10 py-8 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white focus:outline-none transition-all text-xl font-bold shadow-sm"
              />
              <button 
                type="submit"
                disabled={loading || !symptom}
                className="absolute right-4 top-4 bottom-4 px-12 bg-slate-900 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all disabled:bg-slate-200"
              >
                {loading ? "Processing..." : "Run Analysis"}
              </button>
            </form>
          </section>

          <section className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-4">Previous_Clinical_Insights</h3>
            <div className="grid gap-6">
              {history.map((rec) => (
                <div key={rec.id} className="p-10 rounded-[2.5rem] border-2 border-slate-50 bg-white hover:border-slate-900/10 hover:shadow-2xl hover:shadow-slate-200 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-slate-900 group-hover:bg-emerald-500 transition-colors"></div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                      {new Date(rec.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                      {rec.sourceAPI}
                    </span>
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                    "{rec.symptom}"
                  </h4>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Recommended Therapy</p>
                    <p className="text-xl font-bold text-slate-800">{rec.suggestedTherapy}</p>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                  <p className="text-slate-400 font-bold italic">No history found. Start your first analysis above.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* SECTION: FDA REFERENCE SIDEBAR */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl shadow-slate-400/30 overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-black uppercase italic mb-2">FDA_Reference</h2>
              <p className="text-slate-400 text-xs font-medium mb-8">Access clinical pharmacology and microbiology data.</p>
              
              <div className="flex gap-3 mb-10">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search substance..."
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:bg-white/20 transition-all"
                />
                <button 
                  onClick={handleFdaSearch}
                  disabled={searching}
                  className="p-4 bg-white text-slate-900 rounded-2xl hover:bg-emerald-400 transition-all"
                >
                  {searching ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                </button>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {fdaResults.map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                    <p className="text-[10px] font-black text-emerald-400 uppercase mb-4 tracking-[0.2em]">Clinical_pharmacology</p>
                    <h5 className="text-lg font-black text-white mb-4 leading-tight">
                      {/* Extract product name safely */}
                      {item.spl_product_data_elements?.[0]?.split(' ')[0] || "Unknown Substance"}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium mb-6 line-clamp-6">
                      {/* FDA results are often arrays, so we take the first element */}
                      {item.clinical_pharmacology?.[0] || item.description?.[0] || "No description available."}
                    </p>
                    <div className="pt-6 border-t border-white/10">
                       <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Microbiology Notes</p>
                       <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-4">
                         {item.microbiology?.[0] || "No clinical microbiology data available."}
                       </p>
                    </div>
                  </div>
                ))}
                {!searching && fdaResults.length === 0 && (
                  <div className="text-center py-20 opacity-30">
                    <div className="text-4xl mb-4">🔬</div>
                    <p className="text-xs font-bold uppercase tracking-widest">Awaiting_Input</p>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
}