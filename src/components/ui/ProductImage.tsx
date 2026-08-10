import { useState } from "react";
import styles from "./ProductImage.module.css";
import type { ProductCategory } from "../../types";

interface Props {
  src: string;
  alt: string;
  category: ProductCategory;
  name: string;
}

const CATEGORY_ICONS: Record<ProductCategory, string> = {
  "herbal-tea":  "🌿",
  "other-tea":   "🍵",
  "gift-set":    "🎁",
  "accessory":   "☕",
};

/**
 * Displays a product image with a graceful placeholder fallback.
 * The placeholder matches brand colours and can be replaced by real photography
 * without any layout changes.
 */
export default function ProductImage({ src, alt, category, name }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    return (
      <div className={styles.placeholder} aria-label={alt} role="img">
        <span className={styles.icon} aria-hidden="true">{CATEGORY_ICONS[category]}</span>
        <span className={styles.placeholderName}>{name}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={styles.image}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
