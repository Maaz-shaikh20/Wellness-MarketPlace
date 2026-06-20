import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-base font-extrabold text-slate-900 tracking-tight mb-3">{title}</h2>
      <div className="text-sm text-slate-500 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function TermsOfService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-base">🌿</div>
            <span className="font-black text-base tracking-tighter text-slate-900 uppercase italic">Wellnest</span>
          </div>

          <div className="w-20 hidden sm:block" />
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 pb-24">
        <div className="mb-10 border-b border-slate-100 pb-8">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Legal</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mt-2 mb-3">Terms of Service</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Last updated: June 20, 2025</p>
        </div>

        <Section title="1. Acceptance of Terms">
          By accessing or using Wellnest, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
        </Section>

        <Section title="2. Use of the Platform">
          Wellnest provides a marketplace connecting clients with alternative therapy practitioners and wellness products. You agree to use the platform only for lawful purposes and in accordance with these terms.
        </Section>

        <Section title="3. User Accounts">
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account.
        </Section>

        <Section title="4. Practitioner Verification">
          While we verify practitioner credentials, Wellnest does not provide medical advice or diagnosis. Always consult a qualified healthcare professional before beginning any therapy. Wellnest is not liable for outcomes of sessions booked through the platform.
        </Section>

        <Section title="5. Payments & Refunds">
          All payments are processed securely through our payment partners. Refund policies are set by individual practitioners. Wellnest facilitates payments but is not responsible for disputes between clients and practitioners.
        </Section>

        <Section title="6. Intellectual Property">
          All content on Wellnest, including logos, text, images, and software, is the property of Wellnest or its licensors and is protected by applicable intellectual property laws.
        </Section>

        <Section title="7. Limitation of Liability">
          Wellnest is provided "as is" without any warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
        </Section>

        <Section title="8. Changes to Terms">
          We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.
        </Section>

        <Section title="9. Contact">
          For any questions about these Terms, contact us at <strong className="text-slate-900">legal@wellnest.in</strong>.
        </Section>

        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
          <p>
            Questions about our terms? Email us at <strong className="text-slate-900">legal@wellnest.in</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
