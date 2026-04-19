import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Info,
  CheckCircle2,
  MapPin
} from "lucide-react";

const TIME_SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

export default function BookSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [therapy, setTherapy] = useState(null);
  const [practitioner, setPractitioner] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/therapies", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const found = res.data.find(t => String(t.id) === String(id));
        setTherapy(found);
        if (found?.practitionerId) {
          // Fetch practitioner profile to get clinic address
          axios
            .get(`http://localhost:8080/api/practitioners/${found.practitionerId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            .then(pRes => setPractitioner(pRes.data))
            .catch(() => {});
        }
      })
      .catch(err => console.error(err));
  }, [id, token]);

  if (!therapy)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-semibold tracking-wide">
          Loading session details…
        </p>
      </div>
    );

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;

    const dateTime = `${selectedDate}T${selectedSlot}:00`;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/sessions/book",
        {
          therapyId: therapy.id,
          practitionerId: therapy.practitionerId,
          userId,
          dateTime,
          notes: therapy.name
        },
        config
      );

      try {
        await axios.post(
          "http://localhost:8080/api/notifications",
          {
            userId,
            type: "SESSION",
            message: `New Session Confirmed: ${therapy.name} on ${selectedDate} at ${selectedSlot}`,
            status: "UNREAD"
          },
          config
        );
      } catch {}

      setShowToast(true);
      setTimeout(() => navigate("/my-sessions"), 1500);
    } catch {
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      {/* Toast */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 transition-all ${
          showToast ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white border border-green-200 shadow-lg px-6 py-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="text-green-600" size={20} />
          <p className="text-sm font-semibold text-gray-700">
            Session booked successfully
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left */}
        <div className="p-10 bg-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <span className="inline-block mb-4 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {therapy.category}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {therapy.name}
          </h1>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Clock size={18} />
              <span className="font-medium">{therapy.duration} minutes</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <ShieldCheck size={18} />
              <span className="text-sm">
                Secure & private digital session
              </span>
            </div>

            {practitioner?.clinicAddress && (
              <div className="flex items-start gap-3 text-gray-700 mt-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <MapPin size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-0.5">Clinic Location</p>
                  <span className="text-sm font-medium text-gray-800">{practitioner.clinicAddress}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="p-10 space-y-8">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={16} /> Select Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Clock size={16} /> Select Time Slot
            </label>
            <div className="grid grid-cols-3 gap-3">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 rounded-xl text-sm font-semibold border transition ${
                    selectedSlot === slot
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">
                Total Fee
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{therapy.price}
              </span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading || !selectedDate || !selectedSlot}
              className={`w-full py-4 rounded-xl font-semibold transition ${
                loading || !selectedDate || !selectedSlot
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loading ? "Processing…" : "Confirm Session"}
            </button>

            <div className="flex items-start gap-2 text-xs text-gray-500">
              <Info size={14} />
              Confirmation is instant and visible in your session dashboard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
