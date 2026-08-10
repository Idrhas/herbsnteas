import { useState } from "react";
import FormField from "../components/ui/FormField";
import styles from "./ContactPage.module.css";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const DEFAULTS: ContactForm = { name: "", email: "", subject: "", message: "" };

const FORMSPREE = import.meta.env.VITE_FORMSPREE_ENDPOINT ?? "";

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(DEFAULTS);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const isDisabled =
    !form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim();

  function set<K extends keyof ContactForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<ContactForm> = {};
    if (!form.name.trim())    errs.name    = "Name is required.";
    if (!form.email.trim())   errs.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.subject.trim()) errs.subject = "Subject is required.";
    if (!form.message.trim()) errs.message = "Message is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      if (!FORMSPREE) throw new Error("No endpoint");
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ type: "contact", ...form }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setStatus("success");
      setForm(DEFAULTS);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Contact page header">
        <div className="container">
          <p className={styles.heroEyebrow}>Contact</p>
          <h1 className={styles.heroTitle}>We'd like to hear from you.</h1>
          <p className={styles.heroSub}>
            General enquiries, business conversations, feedback — use the form
            or reach out directly. We read everything.
          </p>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────── */}
      <section className={styles.body} aria-label="Contact details and form">
        <div className="container">
          <div className={styles.grid}>

            {/* Left — contact info */}
            <aside className={styles.info} aria-label="Contact information">
              <div className={styles.infoGroup}>
                <h2 className={styles.infoTitle}>Get in touch</h2>

                <div className={styles.contactItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 9.78 19.79 19.79 0 0 1 1 1.15 2 2 0 0 1 3 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 14.9v2.02z"/>
                  </svg>
                  <div>
                    <p className={styles.contactLabel}>Phone</p>
                    <a href="tel:+234000000000" className={styles.contactValue}>+234 000 000 0000</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <div>
                    <p className={styles.contactLabel}>Email</p>
                    <a href="mailto:hello@herbsnteas.com" className={styles.contactValue}>hello@herbsnteas.com</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <p className={styles.contactLabel}>Location</p>
                    <p className={styles.contactValue}>Benin City, Edo State, Nigeria</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className={styles.socialGroup}>
                <p className={styles.socialTitle}>Follow us</p>
                <div className={styles.socialLinks}>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                    </svg>
                    Instagram
                  </a>
                  <a href="https://wa.me/234000000000" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp Business">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter / X">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4l16 16M4 20L20 4"/>
                    </svg>
                    Twitter / X
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                    Facebook
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <div className={styles.mapWrapper} aria-label="Map showing Benin City, Edo State, Nigeria">
                <div className={styles.mapPlaceholder}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <p>Benin City, Edo State, Nigeria</p>
                  <a
                    href="https://maps.google.com/?q=Benin+City,+Edo+State,+Nigeria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLink}
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </aside>

            {/* Right — form */}
            <div className={styles.formWrapper}>
              <h2 className={styles.formTitle}>Send us a message</h2>

              {status === "success" ? (
                <div className={styles.successMsg} role="status" aria-live="polite">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <div>
                    <p className={styles.successTitle}>Message received.</p>
                    <p>Thanks for reaching out — we'll get back to you shortly. If it's urgent, call or WhatsApp us directly.</p>
                  </div>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Contact form">
                  <div className={styles.formRow}>
                    <FormField id="ct-name"  type="text"  label="Full Name"      value={form.name}    onChange={(v) => set("name", v)}    required error={errors.name} />
                    <FormField id="ct-email" type="email" label="Email Address"  value={form.email}   onChange={(v) => set("email", v)}   required error={errors.email} />
                  </div>
                  <FormField id="ct-subject" type="text"     label="Subject"  value={form.subject} onChange={(v) => set("subject", v)} required error={errors.subject} maxLength={100} />
                  <FormField id="ct-message" type="textarea" label="Message"  value={form.message} onChange={(v) => set("message", v)} required error={errors.message} maxLength={1000} rows={6} />

                  {status === "error" && (
                    <p className={styles.errorMsg} role="alert" aria-live="assertive">
                      Something went wrong. Please try again or email us directly at&nbsp;
                      <a href="mailto:hello@herbsnteas.com">hello@herbsnteas.com</a>.
                    </p>
                  )}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isDisabled || status === "sending"}
                    aria-disabled={isDisabled || status === "sending"}
                  >
                    {status === "sending" ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
