import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const specializationsOptions = [
  "physiotherapy",
  "acupuncture",
  "ayurveda",
  "chiropractic",
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState(
    specializationsOptions[0]
  );
  const [clinicAddress, setClinicAddress] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  /* ===== Upload Certificate States ===== */
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [driveLink, setDriveLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        const userData = res.data;

        setUser(userData);
        setBio(userData.bio || "");

        if (userData.role === "PRACTITIONER") {
          const practitionerRes = await api.get(
            `/practitioners/user/${userData.id}`
          );

          const practitionerData = practitionerRes.data;
          setBio(practitionerData.bio || "");
          setSpecialization(
            practitionerData.specialization || specializationsOptions[0]
          );
          setClinicAddress(practitionerData.clinicAddress || "");
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  /* ================= HELPERS ================= */
  const showSuccessPopup = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  /* ================= SUBMITS ================= */
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.put(`/users/${user.id}`, { bio });
      showSuccessPopup("Profile updated successfully!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save patient profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePractitionerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await api.put(`/practitioners/user/${user.id}`, {
        bio,
        specialization,
        clinicAddress,
      });

      showSuccessPopup("Profile updated successfully!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save practitioner profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= UPLOAD CERTIFICATE ================= */
  const handleCertificateUpload = async () => {
    if (!driveLink.trim()) {
      setUploadError("Please paste a valid Google Drive link");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const res = await api.post(
        `/practitioners/user/${user.id}/upload-certificate`,
        { driveLink }
      );

      showSuccessPopup(res.data.message || "Documents submitted successfully");
      setShowUploadModal(false);
      setDriveLink("");
    } catch (err) {
      setUploadError(
        err.response?.data?.message || "Failed to upload documents"
      );
    } finally {
      setUploading(false);
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  const { name, email, role } = user;

  return (
    <div className="min-h-screen flex bg-white relative">
      {/* SUCCESS POPUP */}
      {successMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {successMsg}
        </div>
      )}

      {/* FORM */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 bg-gradient-to-br from-cyan-50 to-blue-200">
        <form
          onSubmit={
            role === "PATIENT"
              ? handlePatientSubmit
              : handlePractitionerSubmit
          }
          className="w-full max-w-lg border-4 border-teal-400 shadow-2xl rounded-xl p-8 bg-white space-y-6"
        >
          <h2 className="text-2xl font-extrabold text-center">
            Complete Your Profile
          </h2>

          {error && (
            <div className="p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {/* USER INFO */}
          <div>
            <label className="text-xs font-medium">Full Name</label>
            <input readOnly value={name} className="w-full px-3 py-2 rounded bg-slate-200" />
          </div>

          <div>
            <label className="text-xs font-medium">Email</label>
            <input readOnly value={email} className="w-full px-3 py-2 rounded bg-slate-200" />
          </div>

          {/* ROLE SPECIFIC */}
          {role === "PATIENT" ? (
            <textarea
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded border"
              placeholder="Tell us about your goals..."
            />
          ) : (
            <>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 rounded border"
                placeholder="About you..."
              />

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">📍 Clinic Address *</label>
                <input
                  type="text"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  placeholder="e.g. 12 Wellness Lane, Bandra West, Mumbai 400050"
                  className="w-full px-4 py-3 rounded border border-indigo-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <p className="text-xs text-indigo-500 mt-1">Shown to patients when they book sessions</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {specializationsOptions.map((spec) => (
                  <label key={spec} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      checked={specialization === spec}
                      onChange={() => setSpecialization(spec)}
                    />
                    <span className="capitalize">{spec}</span>
                  </label>
                ))}
              </div>

              {/* VERIFICATION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Verification Status
                </label>

                <div className="flex justify-between items-center bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
                  <span className="font-semibold text-yellow-800">
                    ❌ Not Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Upload Documents
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  Upload certificates or license documents for admin verification
                </p>
              </div>
            </>
          )}

          <button
            disabled={saving}
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* ===== UPLOAD MODAL ===== */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">Upload Documents</h3>

            {uploadError && (
              <p className="text-red-600 text-sm">{uploadError}</p>
            )}

            <input
              type="text"
              placeholder="Paste Google Drive link here"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCertificateUpload}
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {uploading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}