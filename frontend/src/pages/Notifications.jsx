import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get current user from local storage
  const user = JSON.parse(localStorage.getItem("user")) || { id: 1 };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/notifications/${user.id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (note) => {
    try {
      if (note.status === "UNREAD") {
        await api.put(`/notifications/${note.id}/read`);
        setNotifications(prev =>
          prev.map(n =>
            n.id === note.id ? { ...n, status: "READ" } : n
          )
        );
      }

      // ✅ NAVIGATION RULE
      if (note.type === "SESSION") {
        navigate("/my-sessions");
      }
    } catch (err) {
      console.error("Failed to process notification", err);
    }
  };

  const unreadCount = notifications.filter(n => n.status === "UNREAD").length;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar user={user} manualCount={unreadCount} />

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")} // Redirects to Home.jsx
          className="mb-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold uppercase tracking-wide transition"
        >
          ← Back
        </button>
        <div className="flex items-end justify-between mb-12 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">
                Communication_Hub
              </span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">
              Inbound_<span className="text-slate-300">Alerts</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Unread_Count
            </p>
            <p className="text-4xl font-light text-slate-900">
              {unreadCount}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center animate-pulse text-slate-300 font-bold uppercase tracking-widest">
              Syncing_Data...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map(note => (
              <div
                key={note.id}
                onClick={() => handleNotificationClick(note)}
                className={`cursor-pointer group relative p-8 rounded-[2rem] border-2 transition-all duration-500 ${
                  note.status === "UNREAD"
                    ? "bg-slate-50 border-slate-100 shadow-lg shadow-slate-100"
                    : "bg-white border-transparent opacity-60"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-full ${
                    note.status === "UNREAD"
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />

                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                        {note.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p
                      className={`text-lg font-bold leading-snug ${
                        note.status === "UNREAD"
                          ? "text-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {note.message}
                    </p>
                  </div>

                  {note.status === "UNREAD" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNotificationClick(note);
                      }}
                      className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
              <p className="text-slate-300 font-bold italic uppercase tracking-widest text-sm">
                No_Active_Notifications
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
