import React from "react";
import { Clock, IndianRupee, User } from "lucide-react";

export default function PractitionerCard({ practitioner, isBooked, onCancel }) {
  if (!practitioner) return null;

  return (
    <div className="p-6 text-white space-y-4">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold border-2 border-emerald-500">
          {practitioner.firstName?.[0] || <User size={24} />}
        </div>
        <div>
          <h3 className="text-lg font-extrabold uppercase tracking-tight">
            {practitioner.firstName} {practitioner.lastName}
          </h3>
          <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">
            {practitioner.specialization || "Wellness Expert"}
          </p>
        </div>
      </div>

      {/* Static Details from Session */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <p className="text-xs opacity-70 italic">
          Professional Email: {practitioner.email}
        </p>
      </div>

      {/* Cancel Button - Only shows if session is 'booked' */}
      {isBooked && onCancel && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="w-full mt-4 py-3 bg-[#FF004D] hover:bg-red-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg"
        >
          Cancel Appointment
        </button>
      )}
    </div>
  );
}