import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight
} from "lucide-react";

export default function PaymentResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const paymentId = state?.paymentId;

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId || !token) {
      navigate("/login", { replace: true });
      return;
    }

    axios
      .get(
        `http://localhost:8080/api/payments/status/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => setStatus(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [paymentId, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-slate-400">Checking payment status…</p>
      </div>
    );
  }

  if (!status) return null;

  const isSuccess = status.paymentStatus === "SUCCESS";
  const isFailed = status.paymentStatus === "FAILED";

  return (
    <div className="min-h-screen bg-white px-6 py-16 flex items-center justify-center">
      <div className="max-w-lg w-full bg-slate-50 rounded-3xl p-10 text-center space-y-8 shadow-lg">

        {/* ICON */}
        <div className="flex justify-center">
          {isSuccess && (
            <CheckCircle size={72} className="text-green-600" />
          )}
          {isFailed && (
            <XCircle size={72} className="text-red-500" />
          )}
          {!isSuccess && !isFailed && (
            <Clock size={72} className="text-yellow-500" />
          )}
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-extrabold">
          {isSuccess && "Payment Successful"}
          {isFailed && "Payment Failed"}
          {!isSuccess && !isFailed && "Payment Pending"}
        </h1>

        {/* DETAILS */}
        <div className="space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {status.paymentStatus}
          </p>
          <p>
            <span className="font-semibold">Amount Paid:</span>{" "}
            ₹{status.amount}
          </p>
        </div>

        {/* ACTION */}
        <button
          onClick={() => navigate("/home", { replace: true })}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-slate-900 transition"
        >
          Go to Home <ArrowRight size={14} />
        </button>

        {/* NOTE */}
        <p className="text-xs text-slate-400">
          This is a simulated payment for demo purposes
        </p>
      </div>
    </div>
  );
}
