import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#fff", color: "#0f172a", minHeight: "100vh" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid #f1f5f9", padding: "0 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🌿</div>
            <span style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.04em", textTransform: "uppercase", fontStyle: "italic" }}>Wellnest</span>
          </div>
          <div style={{ width: 90 }} />
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 2rem 100px" }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em" }}>Legal</span>
          <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", marginTop: 8, marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Last updated: June 20, 2025</p>
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
          If you have questions about this Privacy Policy, please contact us at <strong>privacy@wellnest.in</strong>.
        </Section>

        <div style={{ marginTop: 48, padding: "24px 28px", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7 }}>
            By using Wellnest, you agree to this Privacy Policy. For questions, reach us at <strong style={{ color: "#0f172a" }}>privacy@wellnest.in</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
