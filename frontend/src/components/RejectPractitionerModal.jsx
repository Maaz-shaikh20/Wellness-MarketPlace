import { useState } from "react";
import api from "../api/axios";

const RejectPractitionerModal = ({ practitionerId, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Please enter rejection reason");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/admin/practitioner/${practitionerId}/reject`, {
        reason: reason,
      });
      onSuccess();
      onClose();
    } catch (error) {
      alert("Rejection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">
          Reject Practitioner
        </h2>

        <textarea
          className="w-full border rounded p-2 mb-4 text-black bg-white"
          rows="4"
          placeholder="Enter rejection reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
            disabled={loading}
          >
            Cancel
          </button>

         <button
          onClick={handleReject}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-60"
          disabled={loading}
         >
          {loading ? "Rejecting..." : "Reject"}
         </button>

        </div>
      </div>
    </div>
  );
};

export default RejectPractitionerModal;
