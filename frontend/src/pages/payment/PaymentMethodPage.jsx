import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  Smartphone,
  CreditCard,
  ArrowRight
} from "lucide-react";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const token = localStorage.getItem("token");
  const orderId = state?.orderId;

  if (!token || !orderId) {
    navigate("/login", { replace: true });
    return null;
  }

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/payments/initiate",
        {
          orderId,
          paymentMethod: "UPI",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/payment-result", {
          state: { paymentId: response.data },
          });

    } catch (error) {
      alert("Payment initiation failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-14">
      <div className="max-w-4xl mx-auto space-y-14">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 hover:text-black"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {/* HEADER */}
        <section className="text-center space-y-3">
          <h1 className="text-5xl font-extrabold">
            Choose Payment Method
          </h1>
          <p className="text-slate-500">
            Complete your order securely
          </p>
        </section>

        {/* PAYMENT OPTIONS */}
        <section className="bg-slate-50 rounded-3xl p-8 space-y-6">

          <h2 className="font-bold text-lg flex items-center gap-2">
            <Wallet size={18} />
            Available Methods
          </h2>

          {/* UPI */}
          <div className="flex items-center justify-between bg-white rounded-2xl border p-5 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Smartphone className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-semibold">UPI</p>
                <p className="text-xs text-slate-500">
                  Pay using Google Pay, PhonePe, Paytm
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white text-xs font-bold uppercase hover:bg-slate-900 transition"
            >
              Pay <ArrowRight size={14} />
            </button>
          </div>

          {/* CARD (DISABLED UI) */}
          <div className="flex items-center justify-between bg-white/50 rounded-2xl border p-5 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <CreditCard className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-semibold">Card</p>
                <p className="text-xs text-slate-500">
                  Credit / Debit Cards (Coming Soon)
                </p>
              </div>
            </div>

            <span className="text-xs font-bold uppercase text-slate-400">
              Disabled
            </span>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <p className="text-center text-xs text-slate-400">
          Payments are processed via a simulated gateway for demo purposes
        </p>
      </div>
    </div>
  );
}
