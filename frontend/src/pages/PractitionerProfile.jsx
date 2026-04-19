import { useState } from "react";
import PractitionerNavbar from "../components/PractitionerNavbar";
import api from "../api/axios";
import { Pencil, Save, X, MapPin, Stethoscope, FileText, Star, CheckCircle, Clock } from "lucide-react";

export default function PractitionerProfile() {
  const [practitioner, setPractitioner] = useState(() =>
    JSON.parse(localStorage.getItem("practitioner"))
  );
  const user = JSON.parse(localStorage.getItem("user"));

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  // Edit form state
  const [form, setForm] = useState({
    specialization: practitioner?.specialization || "",
    bio: practitioner?.bio || "",
    clinicAddress: practitioner?.clinicAddress || "",
  });

  if (!practitioner) {
    return (
      <>
        <PractitionerNavbar />
        <div className="mt-32 text-center text-gray-600">
          Practitioner data not found. Please log out and log in again.
        </div>
      </>
    );
  }

  const userId = practitioner.userId || user?.id;

  const handleEdit = () => {
    setForm({
      specialization: practitioner.specialization || "",
      bio: practitioner.bio || "",
      clinicAddress: practitioner.clinicAddress || "",
    });
    setSaveError("");
    setSaveSuccess("");
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setSaveError("");
    setSaveSuccess("");
  };

  const handleSave = async () => {
    if (!form.specialization.trim()) {
      setSaveError("Specialization is required.");
      return;
    }
    if (!form.clinicAddress.trim()) {
      setSaveError("Clinic address is required.");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      await api.put(`/practitioners/user/${userId}`, {
        specialization: form.specialization,
        bio: form.bio,
        clinicAddress: form.clinicAddress,
      });

      // Update localStorage with new values
      const updated = {
        ...practitioner,
        specialization: form.specialization,
        bio: form.bio,
        clinicAddress: form.clinicAddress,
        verified: false, // reset as per backend logic
      };
      localStorage.setItem("practitioner", JSON.stringify(updated));
      setPractitioner(updated);

      setSaveSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PractitionerNavbar />

      <div className="mt-28 max-w-3xl mx-auto px-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#1B3C53]">
              Practitioner Profile
            </h1>
            <p className="text-gray-500 mt-1">
              {editMode ? "Update your professional details" : "View your professional details"}
            </p>
          </div>

          {!editMode && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1B3C53] text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md"
            >
              <Pencil size={15} /> Edit Profile
            </button>
          )}
        </div>

        {/* Success Banner */}
        {saveSuccess && !editMode && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold">
            <CheckCircle size={16} /> {saveSuccess}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Top Identity Bar */}
          <div className="bg-[#1B3C53] px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {practitioner.name || "Dr. Practitioner"}
              </h2>
              <p className="text-blue-200 text-sm mt-0.5">{practitioner.email}</p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                practitioner.verified
                  ? "bg-green-400 text-green-900"
                  : "bg-yellow-400 text-yellow-900"
              }`}
            >
              {practitioner.verified ? "✓ Verified" : "⏳ Pending"}
            </span>
          </div>

          <div className="p-8 space-y-6">
            {/* ===================== VIEW MODE ===================== */}
            {!editMode && (
              <>
                {/* Specialization */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Stethoscope size={20} className="text-[#1B3C53] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Specialization</p>
                    <p className="font-semibold text-[#1B3C53] text-lg capitalize">
                      {practitioner.specialization || <span className="text-gray-400 italic font-normal">Not set</span>}
                    </p>
                  </div>
                </div>

                {/* Clinic Address */}
                <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <MapPin size={20} className="text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Clinic Address</p>
                    <p className="font-semibold text-[#1B3C53] text-base">
                      {practitioner.clinicAddress || <span className="text-gray-400 italic font-normal">No address provided — click Edit Profile to add</span>}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <FileText size={20} className="text-[#1B3C53] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Bio</p>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {practitioner.bio || <span className="text-gray-400 italic">No bio provided</span>}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Star size={20} className="text-yellow-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Rating</p>
                    <p className="font-semibold text-[#1B3C53]">{practitioner.rating ?? "0.0"} / 5.0</p>
                  </div>
                </div>

                {/* Practitioner ID */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Practitioner ID: <span className="font-mono font-bold text-gray-600">{practitioner.id}</span>
                  </p>
                  {!practitioner.verified && (
                    <div className="mt-3 flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm">
                      <Clock size={15} />
                      Your profile is pending admin verification. You can update your details while waiting.
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ===================== EDIT MODE ===================== */}
            {editMode && (
              <div className="space-y-5">
                {saveError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
                    {saveError}
                  </div>
                )}

                {/* Specialization */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    <Stethoscope size={14} /> Specialization *
                  </label>
                  <input
                    type="text"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    placeholder="e.g. Yoga Therapy, Acupuncture, Naturopathy..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3C53] text-sm"
                  />
                </div>

                {/* Clinic Address */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    <MapPin size={14} className="text-indigo-500" /> Clinic Address *
                  </label>
                  <input
                    type="text"
                    value={form.clinicAddress}
                    onChange={(e) => setForm({ ...form, clinicAddress: e.target.value })}
                    placeholder="e.g. 12 Wellness Lane, Bandra West, Mumbai 400050"
                    className="w-full px-4 py-3 border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-indigo-50/40"
                  />
                  <p className="mt-1 text-xs text-indigo-500">
                    This address will be shown to patients when they book sessions and in notifications.
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    <FileText size={14} /> Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Tell patients about your approach, experience, and what makes your practice unique..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3C53] text-sm resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1B3C53] text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
                  >
                    <Save size={15} />
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                  >
                    <X size={15} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
