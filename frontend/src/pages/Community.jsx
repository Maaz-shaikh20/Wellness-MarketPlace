import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  CheckCircle,
  User,
  Loader2
} from "lucide-react";

export default function Community() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]); // stores all questions
  const [answers, setAnswers] = useState({});
  const [loadingAnswers, setLoadingAnswers] = useState({});
  const [isPosting, setIsPosting] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH ALL QUESTIONS ================= */
  /* ================= FETCH ALL QUESTIONS ================= */
const fetchForumData = async () => {
  if (!token) return;

  try {
    let res;

    // Detect role: simple check (you can adjust based on your auth system)
    const userRole = localStorage.getItem("role"); // e.g., 'USER' or 'PRACTITIONER'

    if (userRole === "PRACTITIONER") {
      // Fetch unanswered + answered questions and merge
      const [unansweredRes, answeredRes] = await Promise.all([
        api.get("/forum/unanswered", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/forum/answered", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      // Mark unanswered/answered for frontend UI
      const unanswered = unansweredRes.data.map(q => ({ ...q, answered: false }));
      const answered = answeredRes.data.map(q => ({ ...q, answered: true }));

      res = [...unanswered, ...answered].sort((a, b) => b.id - a.id); // newest first
    } else {
      // Regular user → fetch their own questions
      res = await api.get("/forum/my-questions", { headers: { Authorization: `Bearer ${token}` } });
      res = res.data.map(q => ({ ...q, answered: q.answered || false }));
    }

    setQuestions(res);
  } catch (err) {
    console.error("Fetch error:", err.message);
    alert("Failed to load forum data");
  }
};


  /* ================= ASK QUESTION ================= */
  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    if (!token) {
      alert("You must be logged in to post a question");
      navigate("/login");
      return;
    }

    try {
      setIsPosting(true);
      const res = await api.post(
        "/forum/ask",
        { content: question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestions((prev) => [res.data, ...prev]); // prepend new question
      setQuestion("");
      alert("Question posted successfully");
    } catch (err) {
      alert("Failed to post question");
      console.error("Post question error:", err.message);
    } finally {
      setIsPosting(false);
    }
  };

  /* ================= FETCH ANSWERS ================= */
  const fetchAnswers = async (questionId) => {
    if (answers[questionId]) {
      // toggle hide answers
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
      alert("Failed to load answers");
    } finally {
      setLoadingAnswers((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  useEffect(() => {
    fetchForumData();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 py-14 max-w-5xl mx-auto space-y-14">
      {/* Back Button */}
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Home
      </button>

      {/* Page Header */}
      <section className="text-center space-y-3">
        <h1 className="text-5xl font-black tracking-tight text-[#1B3C53]">Community</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Share your concerns and receive professional guidance from verified practitioners.
        </p>
      </section>

      {/* Ask Question */}
      <section className="bg-[#F8FAFC] rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-4">
        <h2 className="font-bold text-lg flex items-center gap-2 text-[#1B3C53]">
          <MessageCircle size={18} className="text-[#FF004D]" />
          Ask the Community
        </h2>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., I feel stressed and anxious lately. What should I do?"
          className="w-full rounded-2xl border-none bg-white p-5 text-sm shadow-inner focus:ring-2 focus:ring-[#1B3C53] min-h-[120px]"
        />

        <button
          onClick={handleAskQuestion}
          disabled={isPosting}
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#1B3C53] text-white text-xs font-black uppercase tracking-widest hover:bg-[#FF004D] transition-all disabled:opacity-50"
        >
          {isPosting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
          {isPosting ? "Posting..." : "Post Question"}
        </button>
      </section>

      {/* Questions Feed */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-black uppercase italic text-[#1B3C53]">Recent Discussions</h2>
          <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500">
            {questions.filter(q => !q.answered).length} Open
          </span>
        </div>

        {questions.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No active discussions. Be the first to ask! 🌱</p>
          </div>
        )}

        <div className="grid gap-6">
          {questions.map((q) => (
            <div key={q.id} className="group bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-xl hover:border-transparent transition-all duration-300">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-full flex items-center justify-center text-[#1B3C53]">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B3C53]">{q.user?.name || "Anonymous User"}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      {q.answered ? "Answered" : "Open Question"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <p className="text-lg font-medium text-[#1B3C53] mb-6 leading-relaxed">
                "{q.content}"
              </p>

              {/* View/Hide Answers */}
              <button
                onClick={() => fetchAnswers(q.id)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#FF004D] hover:gap-3 transition-all"
              >
                {loadingAnswers[q.id] ? <Loader2 className="animate-spin" size={14} /> : <MessageCircle size={14} />}
                {answers[q.id] ? "Hide Conversation" : "View Answers"}
              </button>

              {/* Answers Section */}
              {answers[q.id] && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  {answers[q.id].length === 0 ? (
                    <div className="bg-slate-50 p-6 rounded-2xl text-center">
                      <p className="text-sm text-slate-400 italic">
                        No professional answers yet. Practitioners are notified.
                      </p>
                    </div>
                  ) : (
                    answers[q.id].map((a) => (
                      <div key={a.id} className="relative bg-[#F0FDF4] border border-emerald-100 p-6 rounded-[1.5rem] ml-4">
                        <div className="absolute -left-3 top-6 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white border-4 border-white">
                          <CheckCircle size={12} />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-black uppercase tracking-widest text-emerald-700">
                            {a.practitioner.name}
                          </span>
                          <span className="bg-emerald-200/50 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase">
                            Verified Pro
                          </span>
                        </div>
                        <p className="text-[#1B3C53] text-sm leading-relaxed">{a.answer}</p>
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
