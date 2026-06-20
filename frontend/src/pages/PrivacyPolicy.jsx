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

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mt-2 mb-3">Privacy Policy</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Last updated: June 20, 2025</p>
        </div>

        <Section title="1. Information We Collect">
          We collect information you provide directly to us, such as your name, email address, and profile information when you create an account. We also collect usage data, booking history, and preferences to improve your experience.
        </Section>

        <Section title="2. How We Use Your Information">
          We use your information to provide, maintain, and improve our services; process bookings and transactions; send you notifications and updates; and personalize your wellness recommendations using our AI engine.
        </Section>

        <Section title="3. Sharing Your Information">
          We do not sell your personal information. We share your information only with practitioners you book sessions with, payment processors for transaction handling, and service providers who assist us in operating our platform.
        </Section>

        <Section title="4. Data Security">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit using TLS/SSL.
        </Section>

        <Section title="5. Cookies">
          We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyze how our platform is used. You can control cookie settings through your browser preferences.
        </Section>

        <Section title="6. Your Rights">
          You have the right to access, correct, or delete your personal data at any time. You may also request a copy of your data or opt out of marketing communications by contacting us at privacy@wellnest.in.
        </Section>

        <Section title="7. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
        </Section>

        <Section title="8. Contact Us">
          If you have questions about this Privacy Policy, please contact us at <strong className="text-slate-900">privacy@wellnest.in</strong>.
        </Section>

        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed">
          <p>
            By using Wellnest, you agree to this Privacy Policy. For questions, reach us at <strong className="text-slate-900">privacy@wellnest.in</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
