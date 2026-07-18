import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../api/axios";
import { ArrowLeft, Send, MessageCircle, Wifi, WifiOff, Loader2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/* ─── Format time ──────────────────────────────────────── */
function formatTime(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function formatDateBadge(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── Message bubble ───────────────────────────────────── */
function MessageBubble({ msg, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
        {!isOwn && (
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">
            {msg.senderName}
          </span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? "bg-[#1B3C53] text-white rounded-tr-sm"
              : "bg-white text-slate-800 border border-slate-100 shadow-sm rounded-tl-sm"
          }`}
        >
          {msg.content}
        </div>
        <span className={`text-[10px] text-slate-400 mt-1 ${isOwn ? "mr-1" : "ml-1"}`}>
          {formatTime(msg.sentAt)}
          {isOwn && <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>}
        </span>
      </div>
    </div>
  );
}

/* ─── Date divider ─────────────────────────────────────── */
function DateDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{label}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

/* ─── MAIN COMPONENT ───────────────────────────────────── */
export default function ChatPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages]   = useState([]);
  const [inputText, setInputText] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [sessionInfo, setSession] = useState(null);

  const stompClient  = useRef(null);
  const bottomRef    = useRef(null);
  const inputRef     = useRef(null);

  const user     = JSON.parse(localStorage.getItem("user") || "null");
  const userId   = user?.id;
  const userName = user?.name || "User";

  /* ── Scroll to bottom on new messages ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── Load chat history ── */
  useEffect(() => {
    if (!sessionId) return;
    const loadHistory = async () => {
      try {
        setLoading(true);
        const [histRes, sessRes] = await Promise.all([
          api.get(`/chat/history/${sessionId}`),
          api.get(`/sessions/user/${userId}`).then(r => r.data.find(s => String(s.id) === String(sessionId))),
        ]);
        setMessages(histRes.data || []);
        setSession(sessRes || null);
        // Mark messages as read
        await api.put(`/chat/history/${sessionId}/read?userId=${userId}`).catch(() => {});
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [sessionId, userId]);

  /* ── Connect to WebSocket ── */
  useEffect(() => {
    if (!sessionId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/api/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        // Subscribe to this session's chat topic
        client.subscribe(`/topic/chat/${sessionId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages(prev => {
            // Avoid duplicate if we already have it (optimistic update)
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          // Mark incoming as read immediately if chat is open
          if (msg.senderId !== userId) {
            api.put(`/chat/history/${sessionId}/read?userId=${userId}`).catch(() => {});
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
        setConnected(false);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [sessionId, userId]);

  /* ── Send message ── */
  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text || !connected) return;

    // Optimistic UI update (tempId so we can deduplicate on receipt)
    const tempMsg = {
      id: null,
      sessionId: Number(sessionId),
      senderId: userId,
      senderName: userName,
      content: text,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, tempMsg]);
    setInputText("");

    stompClient.current?.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        sessionId: Number(sessionId),
        senderId: userId,
        senderName: userName,
        content: text,
      }),
    });

    inputRef.current?.focus();
  }, [inputText, connected, sessionId, userId, userName]);

  /* ── Enter key to send ── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ── Group messages by date ── */
  const grouped = [];
  let lastDateLabel = null;
  messages.forEach((msg) => {
    const label = formatDateBadge(msg.sentAt);
    if (label !== lastDateLabel) {
      grouped.push({ type: "date", label });
      lastDateLabel = label;
    }
    grouped.push({ type: "msg", msg });
  });

  return (
    <div className="flex flex-col h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 px-5 py-4 bg-white border-b border-slate-100 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>

        <div className="w-10 h-10 rounded-2xl bg-[#1B3C53] flex items-center justify-center text-white">
          <MessageCircle size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-black text-slate-800 text-sm truncate">
            Session Chat
            {sessionInfo && (
              <span className="font-normal text-slate-400 text-xs ml-2">
                #{sessionId}
              </span>
            )}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {connected ? (
              <><Wifi size={11} className="text-emerald-500" /><span className="text-[10px] font-bold text-emerald-500">Connected</span></>
            ) : (
              <><WifiOff size={11} className="text-rose-400" /><span className="text-[10px] font-bold text-rose-400">Connecting…</span></>
            )}
          </div>
        </div>

        <div className="text-right text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Wellnest Chat
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
            <Loader2 size={24} className="animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest">Loading messages…</p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
              <MessageCircle size={28} className="text-slate-300" />
            </div>
            <div>
              <p className="font-black text-slate-400 text-sm">No messages yet</p>
              <p className="text-xs text-slate-300 mt-1">Start the conversation below ↓</p>
            </div>
          </div>
        ) : (
          <>
            {grouped.map((item, i) =>
              item.type === "date" ? (
                <DateDivider key={`d-${i}`} label={item.label} />
              ) : (
                <MessageBubble
                  key={item.msg.id ?? `tmp-${i}`}
                  msg={item.msg}
                  isOwn={item.msg.senderId === userId}
                />
              )
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* ── Input Bar ── */}
      <div className="px-5 py-4 bg-white border-t border-slate-100">
        {!connected && (
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-2 rounded-xl mb-3">
            <WifiOff size={12} />
            Reconnecting to chat server…
          </div>
        )}
        <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-[#1B3C53] focus-within:ring-1 focus-within:ring-[#1B3C53] transition-all">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            style={{ maxHeight: "120px" }}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none leading-relaxed"
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || !connected}
            className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
              inputText.trim() && connected
                ? "bg-[#1B3C53] text-white hover:bg-slate-700 hover:scale-110 shadow-md"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[9px] font-mono">Enter</kbd> to send · <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[9px] font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
