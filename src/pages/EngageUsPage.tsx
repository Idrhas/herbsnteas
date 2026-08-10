import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import FormField from "../components/ui/FormField";
import styles from "./EngageUsPage.module.css";

type ProductInterest = "herbal-teas" | "other-teas" | "accessories";

/* ── B2C form state ───────────────────────────────────────────── */
interface B2CForm {
  name: string;
  email: string;
  flavours: string[];
  goals: string[];
  format: string;
  notes: string;
}

const B2C_DEFAULTS: B2CForm = {
  name: "", email: "", flavours: [], goals: [], format: "", notes: "",
};

/* ── B2B form state ───────────────────────────────────────────── */
interface B2BForm {
  company: string;
  contact: string;
  email: string;
  phone: string;
  businessType: string;
  interests: ProductInterest[];
  quantity: string;
  frequency: string;
  requirements: string;
}

const B2B_DEFAULTS: B2BForm = {
  company: "", contact: "", email: "", phone: "",
  businessType: "", interests: [], quantity: "",
  frequency: "", requirements: "",
};

const FORMSPREE = import.meta.env.VITE_FORMSPREE_ENDPOINT ?? "";

async function submitToFormspree(payload: Record<string, unknown>): Promise<void> {
  if (!FORMSPREE) throw new Error("Form endpoint not configured.");
  const res = await fetch(FORMSPREE, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Submission failed (${res.status})`);
}

export default function EngageUsPage() {
  const [searchParams] = useSearchParams();
  const initialInterest = searchParams.get("interest") as ProductInterest | null;

  /* B2C */
  const [b2cForm, setB2cForm] = useState<B2CForm>(B2C_DEFAULTS);
  const [b2cErrors, setB2cErrors] = useState<Partial<B2CForm>>({});
  const [b2cStatus, setB2cStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const b2cFormRef = useRef<HTMLElement>(null);

  /* B2B */
  const [b2bForm, setB2bForm] = useState<B2BForm>({
    ...B2B_DEFAULTS,
    interests: initialInterest ? [initialInterest] : [],
  });
  const [b2bErrors, setB2bErrors] = useState<Partial<Record<keyof B2BForm, string>>>({});
  const [b2bStatus, setB2bStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const b2bFormRef = useRef<HTMLElement>(null);

  // Pre-populate B2B interest from URL param
  useEffect(() => {
    if (initialInterest) {
      setB2bForm((f) => ({ ...f, interests: [initialInterest] }));
      b2bFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [initialInterest]);

  // Hash-based scroll for nav links
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, []);

  /* ── B2C helpers ─────────────────────────────────────────────── */
  function setB2c<K extends keyof B2CForm>(key: K, value: B2CForm[K]) {
    setB2cForm((f) => ({ ...f, [key]: value }));
    setB2cErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateB2C(): boolean {
    const errs: Partial<B2CForm> = {};
    if (!b2cForm.name.trim())                       errs.name  = "Name is required.";
    if (!b2cForm.email.trim())                      errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b2cForm.email)) errs.email = "Enter a valid email address.";
    setB2cErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleB2CSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateB2C()) return;
    setB2cStatus("sending");
    try {
      await submitToFormspree({ type: "b2c-custom-blend", ...b2cForm });
      setB2cStatus("success");
      setB2cForm(B2C_DEFAULTS);
    } catch {
      setB2cStatus("error");
    }
  }

  function openCurationForm() {
    setB2c("notes", "I'd like a curated tea selection — ");
    b2cFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ── B2B helpers ─────────────────────────────────────────────── */
  function setB2b<K extends keyof B2BForm>(key: K, value: B2BForm[K]) {
    setB2bForm((f) => ({ ...f, [key]: value }));
    setB2bErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validateB2B(): boolean {
    const errs: Partial<Record<keyof B2BForm, string>> = {};
    if (!b2bForm.company.trim())       errs.company   = "Company name is required.";
    if (!b2bForm.contact.trim())       errs.contact   = "Contact name is required.";
    if (!b2bForm.email.trim())         errs.email     = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b2bForm.email)) errs.email = "Enter a valid email address.";
    if (b2bForm.interests.length === 0) errs.interests = "Select at least one product category." as never;
    setB2bErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleB2BSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateB2B()) return;
    setB2bStatus("sending");
    try {
      await submitToFormspree({ type: "b2b-quote-request", ...b2bForm });
      setB2bStatus("success");
      setB2bForm(B2B_DEFAULTS);
    } catch {
      setB2bStatus("error");
    }
  }

  function openSourcingForm() {
    setB2b("requirements", "Specialised sourcing enquiry — ");
    b2bFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Engage Us introduction">
        <div className="container">
          <p className={styles.heroEyebrow}>Engage Us</p>
          <h1 className={styles.heroTitle}>
            There's more than one way<br />to work with us.
          </h1>
          <p className={styles.heroSub}>
            Whether you're looking for something personal or building a tea programme
            for your business — we're set up for both. Tell us what you need.
          </p>
        </div>
      </section>

      {/* ── "Looking for something specific?" ───────────────────── */}
      <section id="custom" className={styles.pathways} aria-labelledby="pathways-heading">
        <div className="container">
          <h2 id="pathways-heading" className={styles.pathwaysTitle}>
            Looking for something specific?
          </h2>
          <div className={styles.pathwayCards}>
            <button className={styles.pathwayCard} onClick={openCurationForm}>
              <span className={styles.pathwayIcon} aria-hidden="true">🌿</span>
              <span className={styles.pathwayLabel}>Custom Blend</span>
              <span className={styles.pathwayDesc}>Tell us your taste. We'll put together a blend for you.</span>
            </button>
            <button
              className={styles.pathwayCard}
              onClick={() => b2bFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              <span className={styles.pathwayIcon} aria-hidden="true">📦</span>
              <span className={styles.pathwayLabel}>Bulk Order</span>
              <span className={styles.pathwayDesc}>Wholesale quantities, regular supply, or one-off large orders.</span>
            </button>
            <button className={styles.pathwayCard} onClick={openCurationForm}>
              <span className={styles.pathwayIcon} aria-hidden="true">🎁</span>
              <span className={styles.pathwayLabel}>Gift or Curated Collection</span>
              <span className={styles.pathwayDesc}>A thoughtful selection — for someone else or for yourself.</span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          B2C — For Individuals
      ══════════════════════════════════════════════════════════ */}
      <section id="individuals" className={styles.b2cSection} aria-labelledby="b2c-heading" ref={b2cFormRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.sectionEyebrow}>For Individuals</p>
              <h2 id="b2c-heading" className={styles.sectionTitle}>
                Tea that fits the way you drink it.
              </h2>
              <p className={styles.sectionSub}>
                Whether you know exactly what you want or you'd like us to put something together
                for you — you're in the right place. We can build a custom blend, curate a
                selection based on your taste, or help you put together a gift.
              </p>
            </div>
            {/* Quick CTAs */}
            <div className={styles.b2cQuickLinks}>
              <a href="/teas" className={styles.quickLink}>Browse All Teas →</a>
              <a href="/teas?category=gift-set" className={styles.quickLink}>Build a Gift Set →</a>
              <button className={styles.quickLinkBtn} onClick={openCurationForm}>
                Get a Curated Selection →
              </button>
            </div>
          </div>

          {/* Custom Blend Form */}
          <div className={styles.formWrapper}>
            <div className={styles.formMeta}>
              <h3 className={styles.formTitle}>Get Your Custom Blend</h3>
              <p className={styles.formDesc}>
                Tell us about your taste and how you drink tea. We'll come back to you
                within 2–3 business days with a recommendation.
              </p>
            </div>

            {b2cStatus === "success" ? (
              <div className={styles.successMsg} role="status" aria-live="polite">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>
                  <p className={styles.successTitle}>We've got your request.</p>
                  <p>We'll be in touch within 2–3 business days with a blend tailored to you.</p>
                </div>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleB2CSubmit} noValidate aria-label="Custom blend request form">
                <div className={styles.formRow}>
                  <FormField id="b2c-name"  type="text"  label="Your Name"      value={b2cForm.name}  onChange={(v) => setB2c("name", v)}  required error={b2cErrors.name} />
                  <FormField id="b2c-email" type="email" label="Email Address"  value={b2cForm.email} onChange={(v) => setB2c("email", v)} required error={b2cErrors.email} />
                </div>

                <FormField
                  id="b2c-flavours"
                  type="checkboxGroup"
                  label="Flavour Preferences"
                  options={[
                    { value: "floral",  label: "Floral"  },
                    { value: "earthy",  label: "Earthy"  },
                    { value: "spicy",   label: "Spicy"   },
                    { value: "fruity",  label: "Fruity"  },
                    { value: "herbal",  label: "Herbal"  },
                  ]}
                  selected={b2cForm.flavours}
                  onChange={(v) => setB2c("flavours", v)}
                />

                <FormField
                  id="b2c-goals"
                  type="checkboxGroup"
                  label="What draws you to herbal tea?"
                  options={[
                    { value: "relaxation", label: "Relaxation" },
                    { value: "digestion",  label: "Digestion"  },
                    { value: "energy",     label: "Energy"     },
                    { value: "immunity",   label: "Immunity"   },
                    { value: "sleep",      label: "Sleep"      },
                  ]}
                  selected={b2cForm.goals}
                  onChange={(v) => setB2c("goals", v)}
                />

                <FormField
                  id="b2c-format"
                  type="radioGroup"
                  label="Preferred Format"
                  options={[
                    { value: "loose-leaf", label: "Loose Leaf" },
                    { value: "tea-bags",   label: "Tea Bags"   },
                    { value: "both",       label: "Either"     },
                  ]}
                  value={b2cForm.format}
                  onChange={(v) => setB2c("format", v)}
                />

                <FormField
                  id="b2c-notes"
                  type="textarea"
                  label="Additional Notes"
                  value={b2cForm.notes}
                  onChange={(v) => setB2c("notes", v)}
                  placeholder="Anything else we should know — occasion, who it's for, allergies, etc."
                  maxLength={500}
                  rows={4}
                />

                {b2cStatus === "error" && (
                  <p className={styles.errorMsg} role="alert" aria-live="assertive">
                    Something went wrong. Please try again or email us directly at&nbsp;
                    <a href="mailto:hello@herbsnteas.com">hello@herbsnteas.com</a>.
                  </p>
                )}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={b2cStatus === "sending"}
                  aria-disabled={b2cStatus === "sending"}
                >
                  {b2cStatus === "sending" ? "Sending…" : "Send My Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          B2B — For Businesses
      ══════════════════════════════════════════════════════════ */}
      <section id="businesses" className={styles.b2bSection} aria-labelledby="b2b-heading" ref={b2bFormRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.sectionEyebrow}>For Businesses</p>
              <h2 id="b2b-heading" className={styles.sectionTitle}>
                Supply, gifting, and hospitality programmes.
              </h2>
              <p className={styles.sectionSub}>
                We supply hotels, restaurants, cafés, offices, retailers, event planners,
                distributors, and corporate organisations. Whether you need a regular bulk
                supply, a branded tea programme, or a corporate gift — talk to us.
              </p>
            </div>
          </div>

          {/* Trust signals */}
          <div className={styles.trustSignals} aria-label="Our credentials">
            {[
              { icon: "🌱", label: "Grown in Benin" },
              { icon: "🔍", label: "Traceable Origin" },
              { icon: "📦", label: "Bulk-Ready" },
              { icon: "🏷️", label: "Custom Labelling Available" },
            ].map(({ icon, label }) => (
              <div key={label} className={styles.trustItem}>
                <span className={styles.trustIcon} aria-hidden="true">{icon}</span>
                <span className={styles.trustLabel}>{label}</span>
              </div>
            ))}
          </div>

          {/* Services overview */}
          <div className={styles.services} aria-label="B2B services">
            {[
              {
                icon: "🫖",
                title: "Bulk Tea Supply",
                desc: "Regular wholesale supply to hospitality, retail, and food service businesses. One-time or recurring.",
              },
              {
                icon: "🎁",
                title: "Corporate Gifting",
                desc: "Branded or unbranded gift sets for clients, staff, or events. Minimum quantities apply.",
              },
              {
                icon: "🏨",
                title: "Hospitality Tea Programmes",
                desc: "Curated tea menus for hotels and restaurants — from selection to service guidance.",
              },
              {
                icon: "🔧",
                title: "Custom & Private-Label Tea",
                desc: "Custom blends or private-label products developed specifically for your business.",
              },
            ].map((s) => (
              <div key={s.title} className={styles.serviceCard}>
                <span className={styles.serviceIcon} aria-hidden="true">{s.icon}</span>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceDesc}>{s.desc}</p>
                <button
                  className={styles.serviceLink}
                  onClick={() => document.getElementById("b2b-quote")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Request a Quote →
                </button>
              </div>
            ))}
          </div>

          {/* Specialised sourcing */}
          <div className={styles.sourcingBand}>
            <div className={styles.sourcingContent}>
              <h3 className={styles.sourcingTitle}>Specialised Tea Sourcing</h3>
              <p className={styles.sourcingDesc}>
                Looking for a specific herb, volume, or processing method? We source directly
                from farms in Benin and can work to spec — custom volumes, seasonal harvests,
                or specific botanical varieties. Talk to us about what you need.
              </p>
            </div>
            <button className={styles.sourcingCta} onClick={openSourcingForm}>
              Start a Sourcing Enquiry
            </button>
          </div>

          {/* Quote form */}
          <div id="b2b-quote" className={styles.formWrapper}>
            <div className={styles.formMeta}>
              <h3 className={styles.formTitle} id="quote-heading">Request a Quote</h3>
              <p className={styles.formDesc}>
                Fill in what you can. We'll follow up within 1–2 business days to discuss
                your requirements and provide pricing.
              </p>
            </div>

            {b2bStatus === "success" ? (
              <div className={styles.successMsg} role="status" aria-live="polite">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>
                  <p className={styles.successTitle}>Quote request received.</p>
                  <p>We'll be in touch within 1–2 business days.</p>
                </div>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleB2BSubmit} noValidate aria-labelledby="quote-heading">
                <div className={styles.formRow}>
                  <FormField id="b2b-company" type="text"  label="Company Name"  value={b2bForm.company} onChange={(v) => setB2b("company", v)} required error={b2bErrors.company} />
                  <FormField id="b2b-contact" type="text"  label="Contact Name"  value={b2bForm.contact} onChange={(v) => setB2b("contact", v)} required error={b2bErrors.contact} />
                </div>
                <div className={styles.formRow}>
                  <FormField id="b2b-email"   type="email" label="Email Address" value={b2bForm.email}   onChange={(v) => setB2b("email", v)}   required error={b2bErrors.email} />
                  <FormField id="b2b-phone"   type="tel"   label="Phone Number"  value={b2bForm.phone}   onChange={(v) => setB2b("phone", v)} />
                </div>

                <FormField
                  id="b2b-btype"
                  type="select"
                  label="Business Type"
                  value={b2bForm.businessType}
                  onChange={(v) => setB2b("businessType", v)}
                  options={[
                    { value: "hotel",        label: "Hotel" },
                    { value: "restaurant",   label: "Restaurant" },
                    { value: "cafe",         label: "Café" },
                    { value: "office",       label: "Office" },
                    { value: "retailer",     label: "Retailer" },
                    { value: "event",        label: "Event Planner" },
                    { value: "distributor",  label: "Distributor" },
                    { value: "other",        label: "Other" },
                  ]}
                />

                <FormField
                  id="b2b-interests"
                  type="checkboxGroup"
                  label="Product Interest"
                  required
                  options={[
                    { value: "herbal-teas",  label: "Herbal Teas"  },
                    { value: "other-teas",   label: "Other Teas"   },
                    { value: "accessories",  label: "Accessories"  },
                  ]}
                  selected={b2bForm.interests}
                  onChange={(v) => setB2b("interests", v as ProductInterest[])}
                  error={(b2bErrors as Record<string, string>).interests}
                />

                <div className={styles.formRow}>
                  <FormField id="b2b-qty"  type="text" label="Estimated Quantity / Volume" value={b2bForm.quantity} onChange={(v) => setB2b("quantity", v)} placeholder="e.g. 500 boxes/month" />
                  <FormField
                    id="b2b-freq"
                    type="radioGroup"
                    label="Delivery Frequency"
                    options={[
                      { value: "one-time",  label: "One-Time"  },
                      { value: "monthly",   label: "Monthly"   },
                      { value: "quarterly", label: "Quarterly" },
                    ]}
                    value={b2bForm.frequency}
                    onChange={(v) => setB2b("frequency", v)}
                  />
                </div>

                <FormField
                  id="b2b-requirements"
                  type="textarea"
                  label="Additional Requirements"
                  value={b2bForm.requirements}
                  onChange={(v) => setB2b("requirements", v)}
                  placeholder="Tell us more about what you need — packaging preferences, lead times, custom labelling, etc."
                  maxLength={1000}
                  rows={5}
                />

                {b2bStatus === "error" && (
                  <p className={styles.errorMsg} role="alert" aria-live="assertive">
                    Something went wrong. Please try again or email us at&nbsp;
                    <a href="mailto:hello@herbsnteas.com">hello@herbsnteas.com</a>.
                  </p>
                )}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={b2bStatus === "sending"}
                  aria-disabled={b2bStatus === "sending"}
                >
                  {b2bStatus === "sending" ? "Sending…" : "Submit Quote Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
