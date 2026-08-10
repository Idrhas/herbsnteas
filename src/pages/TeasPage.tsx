import { useState, useMemo, lazy, Suspense, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import type { Product, ProductCategory } from "../types";
import productsData from "../data/products.json";
import ProductCard from "../components/ui/ProductCard";
import styles from "./TeasPage.module.css";

const ProductDetailModal = lazy(() => import("../components/ui/ProductDetailModal"));

const products = productsData as Product[];

type FilterCategory = ProductCategory | "all";

const FILTERS: { value: FilterCategory; label: string }[] = [
  { value: "all",        label: "All" },
  { value: "herbal-tea", label: "Herbal Teas" },
  { value: "other-tea",  label: "Other Teas" },
  { value: "gift-set",   label: "Gift Sets" },
  { value: "accessory",  label: "Accessories" },
];

export default function TeasPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") as FilterCategory) ?? "all";

  const [activeFilter, setActiveFilter] = useState<FilterCategory>(initialCategory);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync filter if query param changes (nav link clicks)
  useEffect(() => {
    const cat = searchParams.get("category") as FilterCategory | null;
    setActiveFilter(cat ?? "all");
  }, [searchParams]);

  // Search
  useEffect(() => {
    if (search.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const q = search.toLowerCase();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
    setSearchResults(results);
    setShowSearchDropdown(true);
  }, [search]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const featured   = useMemo(() => products.filter((p) => p.featured && p.inStock), []);
  const herbalTeas = useMemo(() => filteredProducts.filter((p) => p.category === "herbal-tea"), [filteredProducts]);
  const otherTeas  = useMemo(() => filteredProducts.filter((p) => p.category === "other-tea"),  [filteredProducts]);
  const giftSets   = useMemo(() => filteredProducts.filter((p) => p.category === "gift-set"),   [filteredProducts]);
  const accessories = useMemo(() => filteredProducts.filter((p) => p.category === "accessory"), [filteredProducts]);

  function openDetail(product: Product) {
    setSelectedProduct(product);
  }

  function closeDetail() {
    setSelectedProduct(null);
  }

  return (
    <>
      <main>
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className={styles.hero} aria-label="Teas hero">
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={`container ${styles.heroContent}`}>
            <p className={styles.heroEyebrow}>Herbal Teas from Benin Republic</p>
            <h1 className={styles.heroHeadline}>
              Good tea starts long<br />before the kettle.
            </h1>
            <p className={styles.heroSub}>
              Planted and harvested in Benin. Dried carefully. Made for mornings,
              evenings, and everything in between.
            </p>
            <div className={styles.heroCtas}>
              <a href="#herbal-teas" className={styles.heroCtaPrimary}>
                Explore Herbal Teas
              </a>
              <Link to="/engage-us" className={styles.heroCtaOutline}>
                Work With Us
              </Link>
            </div>
          </div>
        </section>

        {/* ── Search + Filter bar ─────────────────────────────────── */}
        <div className={styles.controlsBar}>
          <div className="container">
            <div className={styles.controls}>
              {/* Category filters */}
              <div className={styles.filters} role="group" aria-label="Filter teas by category">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    className={`${styles.filterBtn} ${activeFilter === f.value ? styles.filterActive : ""}`}
                    onClick={() => setActiveFilter(f.value)}
                    aria-pressed={activeFilter === f.value}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className={styles.searchWrapper} role="search">
                <label htmlFor="product-search" className="sr-only">Search teas</label>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  id="product-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 150)}
                  placeholder="Search teas, herbs, gifts…"
                  className={styles.searchInput}
                  autoComplete="off"
                />
                {showSearchDropdown && searchResults.length > 0 && (
                  <ul className={styles.searchDropdown} role="listbox" aria-label="Search suggestions">
                    {searchResults.map((p) => (
                      <li key={p.id} role="option">
                        <button
                          className={styles.searchResult}
                          onMouseDown={() => { openDetail(p); setSearch(""); setShowSearchDropdown(false); }}
                        >
                          <span className={styles.searchResultName}>{p.name}</span>
                          <span className={styles.searchResultType}>{p.teaType ?? p.category}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {showSearchDropdown && searchResults.length === 0 && (
                  <p className={styles.searchEmpty}>No teas found for "{search}"</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Featured teas — editorial layout ───────────────────── */}
        {activeFilter === "all" && featured.length > 0 && (
          <section className={styles.featured} aria-labelledby="featured-heading">
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2 id="featured-heading" className={styles.sectionTitle}>Featured Teas</h2>
                <p className={styles.sectionSub}>A selection of what we're proud of right now.</p>
              </div>
              {/* Asymmetric editorial layout — first card large, rest in a row */}
              <div className={styles.featuredGrid}>
                {featured.slice(0, 1).map((p) => (
                  <article
                    key={p.id}
                    className={styles.featuredHero}
                    onClick={() => openDetail(p)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${p.name}`}
                    onKeyDown={(e) => { if (e.key === "Enter") openDetail(p); }}
                  >
                    <div className={styles.featuredHeroImg}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className={styles.featuredHeroImgEl}
                        loading="eager"
                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                      />
                    </div>
                    <div className={styles.featuredHeroBody}>
                      {p.teaType && <p className={styles.featuredEyebrow}>{p.teaType}</p>}
                      <h3 className={styles.featuredName}>{p.name}</h3>
                      <p className={styles.featuredDesc}>{p.description}</p>
                      <p className={styles.featuredOrigin}>{p.origin}</p>
                      <button className={styles.featuredCta} onClick={(e) => { e.stopPropagation(); openDetail(p); }}>
                        Discover This Tea
                      </button>
                    </div>
                  </article>
                ))}
                {featured.length > 1 && (
                  <div className={styles.featuredRow}>
                    {featured.slice(1, 4).map((p) => (
                      <ProductCard key={p.id} product={p} onOpenDetail={openDetail} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Herbal Tea Spotlight ────────────────────────────────── */}
        {(activeFilter === "all" || activeFilter === "herbal-tea") && (
          <section id="herbal-teas" className={styles.spotlight} aria-labelledby="spotlight-heading">
            <div className="container">
              <div className={styles.spotlightInner}>
                {/* Image side */}
                <div className={styles.spotlightImage} aria-hidden="true">
                  <div className={styles.spotlightImgBg}>
                    <span className={styles.spotlightImgIcon}>🌿</span>
                  </div>
                </div>
                {/* Content side */}
                <div className={styles.spotlightContent}>
                  <p className={styles.spotlightEyebrow}>Herbal Teas — Locally Sourced from Benin Republic</p>
                  <h2 id="spotlight-heading" className={styles.spotlightTitle}>
                    From the soil of Benin<br />to your cup.
                  </h2>
                  <div className={styles.spotlightBody}>
                    <p>
                      Our herbal teas begin with plants grown in Benin Republic — moringa, hibiscus,
                      lemon verbena, bitter leaf, and more. Each herb is chosen for how it tastes and
                      where it comes from. Not for how it photographs.
                    </p>
                    <p>
                      The journey is simple: plant, tend, harvest at the right moment, dry carefully,
                      and pack without fuss. No additives. No artificial flavours. What ends up in your
                      cup is what grew in the ground.
                    </p>
                    <p>
                      These are teas for everyday life — a slow morning, a quiet afternoon, something
                      warm after dinner. West African herbal tea, grown with care and made to be enjoyed.
                    </p>
                  </div>
                  <a href="#herbal-grid" className={styles.spotlightCta}>Browse Herbal Teas</a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Herbal Teas grid ────────────────────────────────────── */}
        {herbalTeas.length > 0 && (
          <section id="herbal-grid" className={styles.productSection} aria-labelledby="herbal-heading">
            <div className="container">
              <h2 id="herbal-heading" className={styles.sectionTitle}>Herbal Teas</h2>
              <p className={styles.sectionSub}>
                Tisanes and infusions grown and dried in Benin Republic — caffeine-free and naturally flavourful.
              </p>
              <div className={styles.productGrid}>
                {herbalTeas.map((p) => (
                  <ProductCard key={p.id} product={p} onOpenDetail={openDetail} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Origin Story ────────────────────────────────────────── */}
        {activeFilter === "all" && (
          <section className={styles.origin} aria-labelledby="origin-heading">
            <div className="container">
              <div className={styles.originInner}>
                <div className={styles.originContent}>
                  <p className={styles.originEyebrow}>Our Origin — Teas from Benin Republic</p>
                  <h2 id="origin-heading" className={styles.originTitle}>
                    Rooted in Benin.<br />Crafted for every cup.
                  </h2>
                  <p className={styles.originBody}>
                    Benin Republic has the soil, the climate, and the botanical heritage. Our teas are grown
                    by farmers who have worked this land for generations. We source
                    directly — no middlemen, no mystery. The herbs are dried in small batches during
                    the right season, which is why each cup tastes the way it does.
                  </p>
                  <p className={styles.originBody}>
                    This is not "African-inspired." This is from Africa — specifically from Benin Republic,
                    specifically from people who know these plants by name, season, and smell.
                  </p>
                </div>
                <div className={styles.originImage} aria-hidden="true">
                  <img
                    src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&h=700&q=80"
                    alt="Herbal tea farm in Benin Republic"
                    className={styles.originImgEl}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Other Teas grid ─────────────────────────────────────── */}
        {otherTeas.length > 0 && (
          <section className={styles.productSection} aria-labelledby="other-heading">
            <div className="container">
              <h2 id="other-heading" className={styles.sectionTitle}>Other Teas</h2>
              <p className={styles.sectionSub}>Green, black, and specialty blends.</p>
              <div className={styles.productGrid}>
                {otherTeas.map((p) => (
                  <ProductCard key={p.id} product={p} onOpenDetail={openDetail} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Gift Sets — horizontal scroll ───────────────────────── */}
        {giftSets.length > 0 && (
          <section className={styles.giftSection} aria-labelledby="gifts-heading">
            <div className="container">
              <div className={styles.sectionHeader}>
                <div>
                  <h2 id="gifts-heading" className={styles.sectionTitle}>Gift Sets &amp; Collections</h2>
                  <p className={styles.sectionSub}>Curated selections. Good for giving, better for keeping.</p>
                </div>
                <Link to="/engage-us#individuals" className={styles.sectionLink}>
                  Build a custom gift →
                </Link>
              </div>
              <div className={styles.horizontalScroll} role="list">
                {giftSets.map((p) => (
                  <div key={p.id} className={styles.hScrollItem} role="listitem">
                    <ProductCard product={p} onOpenDetail={openDetail} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Accessories grid ────────────────────────────────────── */}
        {accessories.length > 0 && (
          <section className={styles.productSection} aria-labelledby="accessories-heading">
            <div className="container">
              <h2 id="accessories-heading" className={styles.sectionTitle}>Accessories</h2>
              <p className={styles.sectionSub}>Mugs, infusers, teapots, and the things that make tea time better.</p>
              <div className={styles.productGrid}>
                {accessories.map((p) => (
                  <ProductCard key={p.id} product={p} onOpenDetail={openDetail} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── B2B CTA band ────────────────────────────────────────── */}
        <section className={styles.b2bBand} aria-label="Business enquiries">
          <div className="container">
            <div className={styles.b2bInner}>
              <div>
                <h2 className={styles.b2bTitle}>Buying for your business?</h2>
                <p className={styles.b2bSub}>
                  Hotels, cafés, offices, and retailers — we supply teas in bulk, curate
                  hospitality programmes, and handle corporate gifting.
                </p>
              </div>
              <Link to="/engage-us#businesses" className={styles.b2bCta}>
                Get a Quote
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Product detail modal */}
      <Suspense fallback={null}>
        <ProductDetailModal product={selectedProduct} onClose={closeDetail} />
      </Suspense>
    </>
  );
}
