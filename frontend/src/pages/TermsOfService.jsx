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

export default function TermsOfService() {
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
          <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", marginTop: 8, marginBottom: 12 }}>Terms of Service</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Last updated: June 20, 2025</p>
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
          For any questions about these Terms, contact us at <strong>legal@wellnest.in</strong>.
        </Section>

        <div style={{ marginTop: 48, padding: "24px 28px", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7 }}>
            Questions about our terms? Email us at <strong style={{ color: "#0f172a" }}>legal@wellnest.in</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
