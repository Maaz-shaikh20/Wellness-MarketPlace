import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

/* ---- Symptom keyword detector ---- */
// Returns true when the query looks like a body symptom or medical condition
// rather than a pharmaceutical drug/substance name.
const SYMPTOM_KEYWORDS = [
  "pain", "ache", "aches", "press", "pressure", "tightness", "fever", "fatigue",
  "nausea", "vomiting", "dizziness", "headache", "rash", "swelling", "bloating",
  "cramp", "cramps", "stress", "anxiety", "depression", "insomnia", "cough",
  "cold", "flu", "infection", "inflammation", "shortness", "breathlessness",
  "palpitation", "discomfort", "numbness", "tingling", "weakness", "fatigue",
  "bruise", "sprain", "strain", "burn", "itch", "itching", "sore", "soreness"
];

function looksLikeSymptom(query) {
  if (!query) return false;
  const lower = query.toLowerCase();
  return SYMPTOM_KEYWORDS.some((kw) => lower.includes(kw));
}

/* ---- Confirm Modal ---- */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-black text-slate-900 mb-3">Are you sure?</h3>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-all"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AiRecommendation() {
  const [symptom, setSymptom] = useState("");
  const [history, setHistory] = useState([]);
  const [fdaResults, setFdaResults] = useState([]);
  const [fdaSearched, setFdaSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [fdaError, setFdaError] = useState("");
  const [clearingAll, setClearingAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const navigate = useNavigate();

  // FIX #19: If user is not in localStorage, redirect to /login immediately.
  // The old code defaulted to { id: 1 } which could expose another user's recommendations.
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
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
    if (!symptom.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/recommendations", { userId: user.id, symptom: symptom.trim() });
      setSymptom("");
      await fetchHistory();
    } catch (err) {
      console.error("Analysis failed", err);
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFdaSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setFdaError("");
    setFdaSearched(false);
    try {
      const res = await api.get(`/external/openfda/search?query=${encodeURIComponent(searchQuery.trim())}`);
      // res.data is now a proper JSON object (Map) — .results is an array
      const results = res.data?.results || [];
      setFdaResults(results);
      setFdaSearched(true);
    } catch (err) {
      console.error("FDA Search failed", err);
      setFdaResults([]);
      setFdaSearched(true);
      setFdaError("No results found for this substance, or the FDA database is temporarily unavailable.");
    } finally {
      setSearching(false);
    }
  };

  const handleDeleteOne = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/recommendations/${id}`);
      setHistory(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    setClearingAll(true);
    setShowClearConfirm(false);
    try {
      await api.delete(`/recommendations/user/${user.id}/all`);
      setHistory([]);
    } catch (err) {
      console.error("Clear all failed", err);
    } finally {
      setClearingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100">
      {showClearConfirm && (
        <ConfirmModal
          message="This will permanently delete all your past wellness recommendations. This action cannot be undone."
          onConfirm={handleClearAll}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
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
              Symptom <span className="text-slate-300">Analysis</span>
            </h1>

            <form onSubmit={handleAnalyze} className="relative group">
              <input
                type="text"
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="Describe your symptoms (e.g. Knee inflammation)"
                className="w-full px-10 py-8 rounded-[2.5rem] bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white focus:outline-none transition-all text-xl font-bold shadow-sm pr-52"
              />
              <button
                type="submit"
                disabled={loading || !symptom.trim()}
                className="absolute right-4 top-4 bottom-4 px-12 bg-slate-900 text-white rounded-[1.8rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Run Analysis"}
              </button>
            </form>

            {/* Error message */}
            {error && (
              <div className="mt-4 px-6 py-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-bold">
                {error}
              </div>
            )}
          </section>

          {/* History Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Past Wellness Insights
                {history.length > 0 && (
                  <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[9px]">
                    {history.length}
                  </span>
                )}
              </h3>

              {history.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={clearingAll}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 border border-rose-200 hover:bg-rose-50 transition-all disabled:opacity-50"
                >
                  {clearingAll ? (
                    <div className="w-3 h-3 border-2 border-rose-400/30 border-t-rose-500 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                  Clear All
                </button>
              )}
            </div>

            <div className="grid gap-6">
              {history.map((rec) => (
                <div
                  key={rec.id}
                  className="p-10 rounded-[2.5rem] border-2 border-slate-50 bg-white hover:border-slate-900/10 hover:shadow-2xl hover:shadow-slate-200 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-slate-900 group-hover:bg-emerald-500 transition-colors"></div>

                  <div className="flex justify-between items-start mb-6">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                      {new Date(rec.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {rec.sourceAPI}
                      </span>
                      {/* Delete individual recommendation */}
                      <button
                        onClick={() => handleDeleteOne(rec.id)}
                        disabled={deletingId === rec.id}
                        title="Delete this recommendation"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-40"
                      >
                        {deletingId === rec.id ? (
                          <div className="w-4 h-4 border-2 border-rose-300/30 border-t-rose-400 rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <h4 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                    &ldquo;{rec.symptom}&rdquo;
                  </h4>

                  {/* Urgent symptom warning banner */}
                  {(() => {
                    const urgent = ["chest pain", "chest tightness", "heart", "palpitation", "shortness of breath", "breathlessness"];
                    const isUrgent = urgent.some(k => rec.symptom.toLowerCase().includes(k));
                    return isUrgent ? (
                      <div className="flex items-start gap-3 mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                        <span className="text-rose-500 text-lg leading-none mt-0.5">⚠️</span>
                        <p className="text-rose-700 text-xs font-bold leading-relaxed">
                          Chest-related symptoms may require urgent medical attention. Please consult a qualified physician alongside any alternative therapy.
                        </p>
                      </div>
                    ) : null;
                  })()}

                  {/* Therapy recommendation — split on '—' to separate advice from safety note */}
                  {(() => {
                    const parts = rec.suggestedTherapy.split("—");
                    const therapy = parts[0].trim();
                    const safetyNote = parts[1]?.trim();
                    return (
                      <div className="space-y-3">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black uppercase text-emerald-600 mb-2">Recommended Therapy</p>
                          <p className="text-xl font-bold text-slate-800 leading-snug">{therapy}</p>
                        </div>
                        {safetyNote && (
                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Clinical Note</p>
                            <p className="text-sm font-medium text-amber-800">{safetyNote}</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
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
              <p className="text-slate-400 text-xs font-medium mb-8">Look up pharmaceutical drug labels by drug name (e.g. <span className="text-emerald-400 font-bold">ibuprofen</span>, <span className="text-emerald-400 font-bold">aspirin</span>). Not for symptom queries.</p>

              <div className="flex gap-3 mb-10">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFdaSearch()}
                  placeholder="Drug name (e.g. ibuprofen, aspirin)"
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:bg-white/20 transition-all"
                />
                <button
                  onClick={handleFdaSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="p-4 bg-white text-slate-900 rounded-2xl hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  {searching
                    ? <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  }
                </button>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
                {fdaResults.map((item, idx) => {
                  // Build display name — never fall back to a UUID
                  const brandName   = item.openfda?.brand_name?.[0] || null;
                  const genericName = item.openfda?.generic_name?.[0] || null;
                  const substanceName = item.openfda?.substance_name?.[0] || null;
                  const displayName = brandName || genericName || substanceName || "Unnamed Product";
                  // Show generic name as subtitle only when brand name is the primary label
                  const subtitle = brandName && (genericName || substanceName)
                    ? (genericName || substanceName)
                    : null;
                  const manufacturer = item.openfda?.manufacturer_name?.[0] || null;
                  const indications = item.indications_and_usage?.[0]
                    || item.purpose?.[0]
                    || item.description?.[0]
                    || item.clinical_pharmacology?.[0]
                    || "No indications data available for this drug.";
                  const warnings = item.warnings?.[0]
                    || item.warnings_and_cautions?.[0]
                    || null;

                  return (
                    <div key={idx} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-emerald-400 uppercase mb-3 tracking-[0.2em]">FDA Drug Label</p>
                      <h5 className="text-lg font-black text-white mb-1 leading-tight">
                        {displayName}
                      </h5>
                      {subtitle && (
                        <p className="text-xs text-slate-300 mb-1 italic">{subtitle}</p>
                      )}
                      {manufacturer && (
                        <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-widest">{manufacturer}</p>
                      )}
                      <div className="mt-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Indications &amp; Usage</p>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-6">
                          {indications}
                        </p>
                      </div>
                      {warnings && (
                        <div className="pt-5 mt-5 border-t border-white/10">
                          <p className="text-[10px] font-bold text-amber-400 uppercase mb-2">⚠ Warnings</p>
                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-4">
                            {warnings}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Error state */}
                {!searching && fdaSearched && fdaError && (
                  <div className="text-center py-12">
                    <div className="text-3xl mb-3">⚠️</div>
                    <p className="text-xs font-bold text-rose-400 leading-relaxed">{fdaError}</p>
                  </div>
                )}

                {/* No results — searched but empty */}
                {!searching && fdaSearched && !fdaError && fdaResults.length === 0 && (
                  looksLikeSymptom(searchQuery) ? (
                    // Smart message: query looks like a symptom, not a drug name
                    <div className="py-10 px-6 rounded-[2rem] bg-amber-500/10 border border-amber-400/20">
                      <div className="text-2xl mb-3">💊</div>
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-2">
                        Symptom_Detected
                      </p>
                      <p className="text-sm font-bold text-white leading-snug mb-3">
                        &ldquo;{searchQuery}&rdquo; looks like a symptom, not a drug name.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        The FDA Reference looks up pharmaceutical labels by drug name.
                        Try searching the active ingredient or brand name instead —
                        e.g. <span className="text-emerald-400 font-bold">aspirin</span>,{" "}
                        <span className="text-emerald-400 font-bold">ibuprofen</span>,{" "}
                        <span className="text-emerald-400 font-bold">nitroglycerin</span>.
                      </p>
                    </div>
                  ) : (
                    // Generic no-results (drug name typed but not found in FDA db)
                    <div className="text-center py-12 opacity-60">
                      <div className="text-3xl mb-3">🔍</div>
                      <p className="text-xs font-bold uppercase tracking-widest">No_Results_Found</p>
                      <p className="text-[11px] text-slate-400 mt-2">Try a different substance name (e.g. ibuprofen, aspirin)</p>
                    </div>
                  )
                )}

                {/* Awaiting input */}
                {!searching && !fdaSearched && (
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