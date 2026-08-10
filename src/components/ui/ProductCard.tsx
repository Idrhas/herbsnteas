import { useNavigate } from "react-router-dom";
import type { Product } from "../../types";
import ProductImage from "./ProductImage";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

function formatPrice(price: number | null, currency: string): string {
  if (price === null) return "Request Price";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
}

function getCta(product: Product): string {
  if (!product.inStock) return "Notify Me";
  if (product.price === null) return "Learn More";
  return "Shop Now";
}

export default function ProductCard({ product, onOpenDetail }: Props) {
  const navigate = useNavigate();

  function handleCta(e: React.MouseEvent) {
    e.stopPropagation();
    if (!product.inStock) {
      // Notify Me — could open a small form; for now navigate to contact
      navigate("/contact");
      return;
    }
    if (product.price === null) {
      navigate(`/engage-us?interest=${product.category}`);
      return;
    }
    onOpenDetail(product);
  }

  return (
    <article
      className={styles.card}
      onClick={() => onOpenDetail(product)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpenDetail(product); }}
    >
      <div className={styles.imageWrapper}>
        <ProductImage
          src={product.imageUrl}
          alt={`${product.name} — ${product.origin}`}
          category={product.category}
          name={product.name}
        />
        {!product.inStock && (
          <span className={styles.outOfStock} aria-label="Out of stock">Out of Stock</span>
        )}
        {product.featured && product.inStock && (
          <span className={styles.featuredBadge} aria-label="Featured product">Featured</span>
        )}
      </div>

      <div className={styles.body}>
        {product.teaType && (
          <p className={styles.teaType}>{product.teaType}</p>
        )}
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description.slice(0, 100)}{product.description.length > 100 ? "…" : ""}</p>

        <div className={styles.footer}>
          <p className={styles.price} aria-label={`Price: ${formatPrice(product.price, product.currency)}`}>
            {formatPrice(product.price, product.currency)}
          </p>
          <button
            className={`${styles.cta} ${!product.inStock ? styles.ctaNotify : ""}`}
            onClick={handleCta}
            aria-label={`${getCta(product)}: ${product.name}`}
          >
            {getCta(product)}
          </button>
        </div>
      </div>
    </article>
  );
}
