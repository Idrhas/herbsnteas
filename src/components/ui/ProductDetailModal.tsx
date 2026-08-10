import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types";
import ProductImage from "./ProductImage";
import styles from "./ProductDetailModal.module.css";

interface Props {
  product: Product | null;
  onClose: () => void;
}

function formatPrice(price: number | null, currency: string): string {
  if (price === null) return "Request Price";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductDetailModal({ product, onClose }: Props) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard close
  useEffect(() => {
    if (!product) return;
    closeBtnRef.current?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  function handleQuote() {
    onClose();
    navigate(`/engage-us?interest=${product!.category}`);
  }

  return (
    <div
      className={styles.overlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${product.name}`}
    >
      <div className={styles.panel} ref={panelRef}>
        {/* Close */}
        <button
          ref={closeBtnRef}
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close product details"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.inner}>
          {/* Image */}
          <div className={styles.imageWrapper}>
            <ProductImage
              src={product.imageUrl}
              alt={`${product.name} — ${product.origin}`}
              category={product.category}
              name={product.name}
            />
            {!product.inStock && (
              <span className={styles.badge}>Out of Stock</span>
            )}
          </div>

          {/* Content */}
          <div className={styles.content}>
            {product.teaType && (
              <p className={styles.teaType}>{product.teaType}</p>
            )}
            <h2 className={styles.name}>{product.name}</h2>

            <p className={styles.price}>
              {formatPrice(product.price, product.currency)}
            </p>

            <p className={styles.description}>{product.description}</p>

            {product.origin && (
              <div className={styles.meta}>
                <p className={styles.metaLabel}>Origin</p>
                <p className={styles.metaValue}>{product.origin}</p>
              </div>
            )}

            {product.ingredients && (
              <div className={styles.meta}>
                <p className={styles.metaLabel}>Ingredients</p>
                <p className={styles.metaValue}>{product.ingredients}</p>
              </div>
            )}

            {product.brewingInstructions && (
              <div className={styles.meta}>
                <p className={styles.metaLabel}>Brewing</p>
                <p className={styles.metaValue}>{product.brewingInstructions}</p>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className={styles.meta}>
                <p className={styles.metaLabel}>Available Sizes</p>
                <div className={styles.variants}>
                  {product.variants.map((v) => (
                    <span key={v.size} className={styles.variantTag}>
                      {v.size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button className={styles.quoteBtn} onClick={handleQuote}>
              {product.price === null ? "Request a Quote" : "Get a Quote"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
