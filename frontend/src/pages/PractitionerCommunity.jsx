import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  CheckCircle,
  User,
  Loader2,
  Stethoscope
} from "lucide-react";

export default function PractitionerCommunity() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]); // all questions
  const [answers, setAnswers] = useState({});
  const [loadingAnswers, setLoadingAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});
  const [practitionerAnswer, setPractitionerAnswer] = useState({});

  const token = localStorage.getItem("token");

  /* ================= FETCH ALL QUESTIONS FOR PRACTITIONER ================= */
const fetchForumData = async () => {
  if (!token) return;

  try {
    // Fetch unanswered + answered questions concurrently
    const [unansweredRes, answeredRes] = await Promise.all([
      api.get("/forum/unanswered", { headers: { Authorization: `Bearer ${token}` } }),
      api.get("/forum/answered", { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    // Mark answered/unanswered for UI
    const unanswered = unansweredRes.data.map(q => ({ ...q, answered: false }));
    const answered = answeredRes.data.map(q => ({ ...q, answered: true }));

    // Merge and sort newest first
    setQuestions([...unanswered, ...answered].sort((a, b) => b.id - a.id));
  } catch (err) {
    console.error("Fetch error:", err.message);
    alert("Failed to load forum data for practitioners.");
  }
};


  /* ================= POST ANSWER ================= */
  const handleSubmitAnswer = async (questionId) => {
    const text = practitionerAnswer[questionId];
    if (!text || !text.trim()) return;

    try {
      setIsSubmitting((prev) => ({ ...prev, [questionId]: true }));
      await api.post(
        "/forum/answer",
        { questionId, answer: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Instead of removing the question, mark it as answered
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, answered: true } : q
        )
      );

      // Optional: immediately add your answer to the answers list
      setAnswers((prev) => ({
        ...prev,
        [questionId]: [
          ...(prev[questionId] || []),
          { id: Date.now(), practitioner: { name: "You" }, answer: text }
        ]
      }));

      setPractitionerAnswer((prev) => ({ ...prev, [questionId]: "" }));
      alert("Professional guidance submitted.");
    } catch (err) {
      alert("Failed to submit answer");
      console.error("Submit answer error:", err.message);
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  /* ================= FETCH EXISTING ANSWERS ================= */
  const fetchAnswers = async (questionId) => {
    if (answers[questionId]) {
      // Hide answers if already fetched
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
      return;
    }

    try {
      setLoadingAnswers((prev) => ({ ...prev, [questionId]: true }));
      const res = await api.get(`/forum/answers/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers((prev) => ({ ...prev, [questionId]: res.data }));
    } catch (err) {
      console.error("Fetch answers error:", err.message);
    } finally {
      setLoadingAnswers((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  useEffect(() => {
    fetchForumData();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-14 max-w-5xl mx-auto space-y-14">
      <button
        onClick={() => navigate("/practitioner/home")}
        className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </button>

      <section className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Stethoscope className="text-[#FF004D]" size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF004D]">Practitioner Portal</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-[#1B3C53]">Forum Inquiries</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Review patient concerns and provide verified medical guidance to the community.
        </p>
      </section>

      {/* QUESTIONS FEED */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-black uppercase italic text-[#1B3C53]">Pending Questions</h2>
          <span className="bg-[#1B3C53] px-3 py-1 rounded-full text-[10px] font-bold text-white">
            {questions.length} New
          </span>
        </div>

        {questions.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">All patient inquiries are currently handled. 🌱</p>
          </div>
        )}

        <div className="grid gap-8">
          {questions.map((q) => (
            <div key={q.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1B3C53]">{q.user?.name || "Anonymous Patient"}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Inquiry #{q.id}</p>
                </div>
              </div>

              <p className="text-lg font-medium text-[#1B3C53] mb-8 leading-relaxed italic">
                "{q.content}"
              </p>

              {/* ANSWER INPUT */}
              <div className="space-y-4 mb-6">
                <textarea
                  placeholder="Provide your professional advice..."
                  value={practitionerAnswer[q.id] || ""}
                  onChange={(e) => setPractitionerAnswer(prev => ({ ...prev, [q.id]: e.target.value }))}
                  disabled={q.answered}
                  className="w-full rounded-2xl border-none bg-slate-50 p-5 text-sm focus:ring-2 focus:ring-[#1B3C53] min-h-[100px]"
                />
                <button
                  onClick={() => handleSubmitAnswer(q.id)}
                  disabled={isSubmitting[q.id] || !practitionerAnswer[q.id] || q.answered}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B3C53] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#FF004D] transition-all disabled:opacity-50"
                >
                  {isSubmitting[q.id] ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                  Submit Guidance
                </button>
              </div>

              {/* VIEW OTHER RESPONSES */}
              <button
                onClick={() => fetchAnswers(q.id)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-[#1B3C53] transition-all"
              >
                {loadingAnswers[q.id] ? <Loader2 className="animate-spin" size={12} /> : <MessageCircle size={12} />}
                {answers[q.id] ? "Hide Other Responses" : "View Other Responses"}
              </button>

              {answers[q.id] && (
                <div className="mt-6 space-y-4 border-t pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  {answers[q.id].length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No other practitioners have responded yet.</p>
                  ) : (
                    answers[q.id].map((a) => (
                      <div key={a.id} className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-800">
                            {a.practitioner.name} (Verified Pro)
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">{a.answer}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
