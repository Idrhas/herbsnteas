import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import styles from "./Nav.module.css";

const TEAS_LINKS = [
  { label: "All Teas", to: "/teas" },
  { label: "Herbal Teas", to: "/teas?category=herbal-tea" },
  { label: "Green Tea", to: "/teas?category=other-tea&type=green" },
  { label: "Black Tea", to: "/teas?category=other-tea&type=black" },
  { label: "Specialty Teas", to: "/teas?category=other-tea&type=specialty" },
  { label: "Accessories", to: "/teas?category=accessory" },
  { label: "Gifts", to: "/teas?category=gift-set" },
];

const ENGAGE_LINKS = [
  { label: "For Individuals", to: "/engage-us#individuals" },
  { label: "For Businesses", to: "/engage-us#businesses" },
  { label: "Custom Tea", to: "/engage-us#custom" },
  { label: "Request a Quote", to: "/engage-us#quote" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [teasOpen, setTeasOpen] = useState(false);
  const [engageOpen, setEngageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setTeasOpen(false);
        setEngageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function closeAll() {
    setMenuOpen(false);
    setTeasOpen(false);
    setEngageOpen(false);
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`} ref={menuRef}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={closeAll} aria-label="Herbs & Teas — Home">
          <span className={styles.logoText}>Herbs&nbsp;&amp;&nbsp;Teas</span>
          <span className={styles.logoSub}>Rooted in Benin</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {/* Teas dropdown */}
          <div className={styles.dropdownWrapper}>
            <button
              className={styles.navItem}
              aria-expanded={teasOpen}
              aria-haspopup="true"
              onMouseEnter={() => { setTeasOpen(true); setEngageOpen(false); }}
              onMouseLeave={() => setTeasOpen(false)}
              onClick={() => { setTeasOpen((v) => !v); setEngageOpen(false); }}
              onKeyDown={(e) => { if (e.key === "Escape") setTeasOpen(false); }}
            >
              Teas
              <svg className={styles.chevron} aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </button>
            {teasOpen && (
              <ul
                className={styles.dropdown}
                role="menu"
                onMouseEnter={() => setTeasOpen(true)}
                onMouseLeave={() => setTeasOpen(false)}
              >
                {TEAS_LINKS.map((l) => (
                  <li key={l.label} role="none">
                    <Link to={l.to} className={styles.dropdownItem} role="menuitem" onClick={closeAll}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Engage Us dropdown */}
          <div className={styles.dropdownWrapper}>
            <button
              className={styles.navItem}
              aria-expanded={engageOpen}
              aria-haspopup="true"
              onMouseEnter={() => { setEngageOpen(true); setTeasOpen(false); }}
              onMouseLeave={() => setEngageOpen(false)}
              onClick={() => { setEngageOpen((v) => !v); setTeasOpen(false); }}
              onKeyDown={(e) => { if (e.key === "Escape") setEngageOpen(false); }}
            >
              Engage Us
              <svg className={styles.chevron} aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </button>
            {engageOpen && (
              <ul
                className={styles.dropdown}
                role="menu"
                onMouseEnter={() => setEngageOpen(true)}
                onMouseLeave={() => setEngageOpen(false)}
              >
                {ENGAGE_LINKS.map((l) => (
                  <li key={l.label} role="none">
                    <Link to={l.to} className={styles.dropdownItem} role="menuitem" onClick={closeAll}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <NavLink to="/contact" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`} onClick={closeAll}>
            Contact
          </NavLink>
        </nav>

        <div className={styles.navRight}>
          <Link to="/engage-us#quote" className={styles.ctaBtn} onClick={closeAll}>
            Get a Quote
          </Link>
          {/* Hamburger */}
          <button
            className={styles.hamburger}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} aria-hidden="true" />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} aria-hidden="true" />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Navigation menu"
      >
        <nav aria-label="Mobile navigation">
          <p className={styles.mobileSection}>Teas</p>
          <ul>
            {TEAS_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className={styles.mobileLink} onClick={closeAll}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <p className={styles.mobileSection}>Engage Us</p>
          <ul>
            {ENGAGE_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className={styles.mobileLink} onClick={closeAll}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <ul>
            <li>
              <Link to="/contact" className={styles.mobileLink} onClick={closeAll}>Contact</Link>
            </li>
          </ul>
          <Link to="/engage-us#quote" className={styles.mobileCta} onClick={closeAll}>
            Get a Quote
          </Link>
        </nav>
        {/* Fallback if JS fails — always-visible links */}
        <noscript>
          <ul className={styles.fallbackLinks}>
            <li><a href="/teas">Teas</a></li>
            <li><a href="/engage-us">Engage Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </noscript>
      </div>

      {/* Mobile menu backdrop */}
      {menuOpen && (
        <div className={styles.backdrop} onClick={closeAll} aria-hidden="true" />
      )}
    </header>
  );
}
