import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

/**
 * Branded loading screen.
 * Stays visible for a minimum of 1 second, maximum 5 seconds.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.screen} role="status" aria-live="polite" aria-label="Loading">
      <div className={styles.content}>
        <p className={styles.brand}>Herbs &amp; Teas</p>
        <p className={styles.sub}>Rooted in Benin</p>
        <div className={styles.bar} aria-hidden="true">
          <div className={styles.progress} />
        </div>
      </div>
    </div>
  );
}
