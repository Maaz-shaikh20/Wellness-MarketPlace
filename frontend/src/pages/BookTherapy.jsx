import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Filter,
  Clock,
  CreditCard,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  MapPin,
} from "lucide-react";

export default function BookTherapy() {
  const [therapies, setTherapies] = useState([]);
  const [practitionerMap, setPractitionerMap] = useState({}); // { practitionerId -> profile }
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/therapies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const list = res.data;
        setTherapies(list);

        // Fetch all unique practitioner profiles in parallel
        const uniqueIds = [...new Set(list.map((t) => t.practitionerId).filter(Boolean))];
        const profiles = await Promise.all(
          uniqueIds.map((pid) =>
            axios
              .get(`http://localhost:8080/api/practitioners/${pid}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((r) => ({ id: pid, data: r.data }))
              .catch(() => ({ id: pid, data: null }))
          )
        );

        const map = {};
        profiles.forEach(({ id, data }) => { if (data) map[id] = data; });
        setPractitionerMap(map);
      })
      .catch((err) => console.error("Failed to load therapies", err));
  }, []);

  const categories = ["All", ...new Set(therapies.map((t) => t.category))];

  const filtered = therapies.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white text-[#1B3C53] overflow-x-hidden">

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      {/* Soft Background Accents */}
      <div className="fixed top-0 right-0 w-[420px] h-[420px] bg-blue-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[360px] h-[360px] bg-rose-200/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">

        {/* Header */}
        <header className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 text-[#FF004D] mb-4">
            <Sparkles size={16} />
            <span className="text-xs font-semibold tracking-widest uppercase">
              Therapy Discovery
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Select Your <span className="text-[#FF004D]">Therapy</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Explore personalized therapy options designed to support healing,
            clarity, and emotional balance — guided by trusted professionals.
          </p>
        </header>

        {/* Search */}
        <div className="relative max-w-2xl mb-16">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            placeholder="Search therapies or categories"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full py-5 pl-14 pr-8 text-sm font-medium focus:border-[#FF004D] focus:ring-0 outline-none shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-20 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-2 mr-2 text-slate-500">
            <Filter size={14} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Filter
            </span>
          </div>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition ${
                activeCategory === cat
                  ? "bg-[#1B3C53] text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((therapy) => (
              <div
                key={therapy.id}
                onClick={() => navigate(`/book-session/${therapy.id}`)}
                className="group cursor-pointer bg-white border border-slate-200 rounded-[2.5rem] p-5 transition hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-60 w-full overflow-hidden rounded-[2rem] mb-6 bg-slate-200">
                  <img
                    src={therapy.imageUrl}
                    alt={therapy.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B3C53]/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-6">
                    <span className="text-white text-xs font-semibold flex items-center gap-2">
                      Book Session <ArrowRight size={14} />
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="px-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-bold text-xl tracking-tight mb-2">
                        {therapy.name}
                      </h2>
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#FF004D] bg-rose-50 px-2 py-0.5 rounded">
                        {therapy.category}
                      </span>
                    </div>
                    <Sparkles
                      size={18}
                      className="text-[#FF004D] opacity-70"
                    />
                  </div>

                  {/* Clinic Address */}
                  {practitionerMap[therapy.practitionerId]?.clinicAddress && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={13} className="text-indigo-500 shrink-0" />
                      <span className="text-xs font-medium truncate">
                        {practitionerMap[therapy.practitionerId].clinicAddress.length > 45
                          ? practitionerMap[therapy.practitionerId].clinicAddress.substring(0, 45) + "…"
                          : practitionerMap[therapy.practitionerId].clinicAddress}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 bg-[#1B3C53] text-white px-4 py-2 rounded-xl text-sm font-semibold">
                      <CreditCard size={14} />
                      ₹{therapy.price}
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-semibold">
                      <Clock size={14} />
                      {therapy.duration} min
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-slate-300 rounded-3xl text-slate-500">
            <p className="text-sm font-semibold tracking-widest uppercase">
              No therapies found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
