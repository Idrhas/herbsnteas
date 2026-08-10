import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <p className={styles.brandName}>Herbs &amp; Teas</p>
          <p className={styles.tagline}>
            Planted in Benin Republic. Carefully selected. Good for slow mornings and long conversations.
          </p>
          <div className={styles.social} aria-label="Social media links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://wa.me/234000000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Business">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4l16 16M4 20L20 4"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Nav columns */}
        <nav className={styles.navColumns} aria-label="Footer navigation">
          <div className={styles.navCol}>
            <p className={styles.colHeading}>Teas</p>
            <ul>
              <li><Link to="/teas">All Teas</Link></li>
              <li><Link to="/teas?category=herbal-tea">Herbal Teas</Link></li>
              <li><Link to="/teas?category=other-tea">Green &amp; Black Tea</Link></li>
              <li><Link to="/teas?category=gift-set">Gift Sets</Link></li>
              <li><Link to="/teas?category=accessory">Accessories</Link></li>
            </ul>
          </div>
          <div className={styles.navCol}>
            <p className={styles.colHeading}>Engage Us</p>
            <ul>
              <li><Link to="/engage-us#individuals">For Individuals</Link></li>
              <li><Link to="/engage-us#businesses">For Businesses</Link></li>
              <li><Link to="/engage-us#quote">Request a Quote</Link></li>
              <li><Link to="/engage-us#custom">Custom Tea</Link></li>
            </ul>
          </div>
          <div className={styles.navCol}>
            <p className={styles.colHeading}>Company</p>
            <ul>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>&copy; {year} Herbs &amp; Teas. All rights reserved.</p>
        <p className={styles.origin}>Rooted in Benin Republic.</p>
      </div>
    </footer>
  );
}
