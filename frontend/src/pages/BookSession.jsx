import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Info,
  CheckCircle2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16]; // 9am–4pm
const HOUR_LABELS = {
  9: "9:00 AM", 10: "10:00 AM", 11: "11:00 AM", 12: "12:00 PM",
  13: "1:00 PM", 14: "2:00 PM", 15: "3:00 PM", 16: "4:00 PM",
};
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

/* ─── Calendar helpers ─────────────────────────────────── */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function toLocalDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function parseHour(isoStr) {
  return new Date(isoStr).getHours();
}

/* ─── Slot button ──────────────────────────────────────── */
function SlotButton({ hour, booked, selected, past, onClick }) {
  const label = HOUR_LABELS[hour];
  const unavailable = booked || past;
  return (
    <button
      onClick={() => !unavailable && onClick(hour)}
      disabled={unavailable}
      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-xs font-bold transition-all duration-200
        ${unavailable
          ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
          : selected
          ? "bg-[#1B3C53] border-[#1B3C53] text-white shadow-lg scale-105"
          : "bg-white border-slate-200 text-slate-700 hover:border-[#1B3C53] hover:shadow-md hover:scale-[1.03]"
        }`}
    >
      <Clock size={12} className="mb-1 opacity-60" />
      {label}
      {booked && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-400 border-2 border-white" title="Already booked" />
      )}
    </button>
  );
}

/* ─── Mini Calendar ────────────────────────────────────── */
function MiniCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const todayStr = toLocalDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
          <ChevronLeft size={16} className="text-slate-500" />
        </button>
        <span className="text-sm font-black uppercase tracking-wide text-slate-800">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateStr = toLocalDateStr(viewYear, viewMonth, day);
          const isPast = dateStr < todayStr;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          return (
            <button
              key={day}
              onClick={() => !isPast && onSelectDate(dateStr)}
              disabled={isPast}
              className={`aspect-square rounded-xl text-xs font-bold transition-all duration-150
                ${isPast ? "text-slate-200 cursor-not-allowed" :
                  isSelected ? "bg-[#1B3C53] text-white shadow-md scale-105" :
                  isToday ? "border-2 border-[#1B3C53] text-[#1B3C53]" :
                  "hover:bg-slate-100 text-slate-700"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────────── */
export default function BookSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [therapy, setTherapy]           = useState(null);
  const [practitioner, setPractitioner] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState(null);
  const [bookedHours, setBookedHours]   = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [showToast, setShowToast]       = useState(false);

  const user   = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  const today    = new Date();
  const todayStr = toLocalDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  /* ── Load therapy + practitioner ── */
  useEffect(() => {
    api.get("/therapies").then(res => {
      const found = res.data.find(t => String(t.id) === String(id));
      setTherapy(found);
      if (found?.practitionerId) {
        api.get(`/practitioners/${found.practitionerId}`)
          .then(pRes => setPractitioner(pRes.data))
          .catch(() => {});
      }
    }).catch(console.error);
  }, [id]);

  /* ── Load available slots when date changes ── */
  const loadSlots = useCallback(async (date, practitionerId) => {
    if (!date || !practitionerId) return;
    setSlotsLoading(true);
    setSelectedHour(null);
    try {
      const res = await api.get(
        `/sessions/available-slots?practitionerId=${practitionerId}&date=${date}`
      );
      // The endpoint returns AVAILABLE slots as LocalDateTime ISO strings
      // We invert: bookedHours = all HOURS − available
      const availableHours = (res.data || []).map(parseHour);
      const booked = HOURS.filter(h => !availableHours.includes(h));
      setBookedHours(booked);
    } catch {
      // fallback: no slots blocked
      setBookedHours([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (therapy?.practitionerId && selectedDate) {
      loadSlots(selectedDate, therapy.practitionerId);
    }
  }, [selectedDate, therapy, loadSlots]);

  /* ── Past-hour check ── */
  const isPastHour = (hour) => {
    if (selectedDate !== todayStr) return false;
    return hour <= new Date().getHours();
  };

  /* ── Confirm booking ── */
  const handleConfirm = async () => {
    if (!selectedDate || selectedHour === null) return;
    const dateTime = `${selectedDate}T${String(selectedHour).padStart(2, "0")}:00:00`;
    try {
      setLoading(true);
      await api.post("/sessions/book", {
        therapyId: therapy.id,
        practitionerId: therapy.practitionerId,
        userId,
        dateTime,
        notes: therapy.name,
      });
      try {
        await api.post("/notifications", {
          userId,
          type: "SESSION",
          message: `New Session Confirmed: ${therapy.name} on ${selectedDate} at ${HOUR_LABELS[selectedHour]}`,
          status: "UNREAD",
        });
      } catch {}
      setShowToast(true);
      setTimeout(() => navigate("/my-sessions"), 1600);
    } catch {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!therapy) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading…</p>
        </div>
      </div>
    );
  }

  const availableCount = HOURS.filter(h => !bookedHours.includes(h) && !isPastHour(h)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8 flex items-start md:items-center justify-center">

      {/* Toast */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
        <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl">
          <CheckCircle2 size={20} />
          <p className="text-sm font-bold">Session booked successfully!</p>
        </div>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">

        {/* ── LEFT: Therapy Info ────────────── */}
        <div className="lg:col-span-2 p-8 bg-[#1B3C53] text-white flex flex-col gap-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div>
            <span className="inline-block mb-3 text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full">
              {therapy.category}
            </span>
            <h1 className="text-3xl font-black leading-tight mb-2">{therapy.name}</h1>
            {therapy.description && (
              <p className="text-sm text-white/60 leading-relaxed">{therapy.description}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-white/80">
              <Clock size={16} className="text-blue-300 shrink-0" />
              <span className="text-sm font-medium">{therapy.duration} min session</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <ShieldCheck size={16} className="text-emerald-300 shrink-0" />
              <span className="text-sm font-medium">Verified practitioner</span>
            </div>
            {practitioner?.clinicAddress && (
              <div className="flex items-start gap-3 p-3 bg-white/10 rounded-2xl">
                <MapPin size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Clinic</p>
                  <p className="text-sm font-semibold">{practitioner.clinicAddress}</p>
                </div>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Session Fee</p>
            <p className="text-4xl font-black">₹{therapy.price}</p>
          </div>
        </div>

        {/* ── RIGHT: Calendar + Slots ───────── */}
        <div className="lg:col-span-3 p-8 space-y-8 overflow-y-auto max-h-screen">

          {/* Section label */}
          <div>
            <div className="flex items-center gap-2 text-[#1B3C53] mb-1">
              <Calendar size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Step 1 — Select Date</span>
            </div>
            <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>

          {/* Time slots */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#1B3C53]">
                <Clock size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Step 2 — Select Time</span>
              </div>
              {selectedDate && !slotsLoading && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {availableCount} slot{availableCount !== 1 ? "s" : ""} available
                </span>
              )}
            </div>

            {!selectedDate ? (
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-100 rounded-3xl text-slate-300">
                <Calendar size={28} className="mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Pick a date first</p>
              </div>
            ) : slotsLoading ? (
              <div className="flex items-center justify-center py-10 gap-3 text-slate-400">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm font-semibold">Checking availability…</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {HOURS.map(hour => (
                  <SlotButton
                    key={hour}
                    hour={hour}
                    booked={bookedHours.includes(hour)}
                    selected={selectedHour === hour}
                    past={isPastHour(hour)}
                    onClick={setSelectedHour}
                  />
                ))}
              </div>
            )}

            {/* Legend */}
            {selectedDate && !slotsLoading && (
              <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1B3C53]" />Selected</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-white border-2 border-slate-200" />Available</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-100" />Booked / Past</span>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            {selectedDate && selectedHour !== null && (
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Selected Appointment</p>
                <p className="font-black text-indigo-800 text-sm">
                  {new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  {" "}at {HOUR_LABELS[selectedHour]}
                </p>
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={loading || !selectedDate || selectedHour === null}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                ${loading || !selectedDate || selectedHour === null
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-[#1B3C53] text-white hover:bg-slate-700 shadow-lg shadow-slate-900/20 hover:scale-[1.02]"
                }`}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" />Processing…</> : "Confirm Booking →"}
            </button>

            <p className="flex items-start gap-2 text-xs text-slate-400">
              <Info size={13} className="mt-0.5 shrink-0" />
              Booking is instant. You&apos;ll receive a confirmation email and it will appear in your session dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
