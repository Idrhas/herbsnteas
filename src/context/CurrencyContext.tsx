/**
 * CurrencyContext
 *
 * Detects the visitor's country via a free IP-geolocation API (ipapi.co),
 * resolves the appropriate display currency, and applies a 100% markup
 * (i.e. 2× the NGN price) for all non-NGN currencies using live exchange
 * rates from the Open Exchange Rates compatible endpoint (exchangerate-api.com
 * free tier, no key required for NGN base).
 *
 * Fallback chain:
 *   1. IP geolocation  →  country code  →  currency
 *   2. navigator.language region hint    →  currency
 *   3. Default: NGN (no conversion, no markup)
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ─── Country → Currency map (extend as needed) ──────────────────────────────
const COUNTRY_CURRENCY: Record<string, string> = {
  // United Kingdom
  GB: "GBP",
  // Eurozone countries
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR",
  AT: "EUR", PT: "EUR", FI: "EUR", IE: "EUR", GR: "EUR", LU: "EUR",
  CY: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", MT: "EUR", SK: "EUR",
  SI: "EUR", HR: "EUR",
  // United States & territories
  US: "USD",
  // Canada
  CA: "CAD",
  // Australia
  AU: "AUD",
  // Switzerland
  CH: "CHF",
  // Japan
  JP: "JPY",
  // China
  CN: "CNY",
  // India
  IN: "INR",
  // UAE
  AE: "AED",
  // Saudi Arabia
  SA: "SAR",
  // South Africa
  ZA: "ZAR",
  // Ghana
  GH: "GHS",
  // Kenya
  KE: "KES",
  // Nigeria — base currency, no markup
  NG: "NGN",
  // Benin Republic (CFA)
  BJ: "XOF",
};

// Locale hints derived from navigator.language (e.g. "en-GB" → "GB")
function regionFromNavigatorLanguage(): string | null {
  try {
    const lang = navigator.language; // e.g. "en-GB", "fr-FR"
    const parts = lang.split("-");
    if (parts.length >= 2) return parts[parts.length - 1].toUpperCase();
  } catch {
    /* ignore */
  }
  return null;
}

// ─── Types ───────────────────────────────────────────────────────────────────
export interface CurrencyInfo {
  currency: string;        // ISO 4217 code
  locale: string;          // BCP 47 locale for Intl formatting
  rate: number;            // NGN → target currency exchange rate
  markup: number;          // multiplier applied on top (2 for non-NGN, 1 for NGN)
  isNGN: boolean;
  loading: boolean;
  countryCode: string | null;
}

// Well-known fallback locales per currency
const CURRENCY_LOCALE: Record<string, string> = {
  NGN: "en-NG",
  GBP: "en-GB",
  EUR: "de-DE",
  USD: "en-US",
  CAD: "en-CA",
  AUD: "en-AU",
  CHF: "de-CH",
  JPY: "ja-JP",
  CNY: "zh-CN",
  INR: "en-IN",
  AED: "ar-AE",
  SAR: "ar-SA",
  ZAR: "en-ZA",
  GHS: "en-GH",
  KES: "sw-KE",
  XOF: "fr-BJ",
};

const DEFAULT_STATE: CurrencyInfo = {
  currency: "NGN",
  locale: "en-NG",
  rate: 1,
  markup: 1,
  isNGN: true,
  loading: true,
  countryCode: null,
};

// ─── Context ─────────────────────────────────────────────────────────────────
const CurrencyContext = createContext<CurrencyInfo>(DEFAULT_STATE);

export function useCurrency() {
  return useContext(CurrencyContext);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a NGN price to the target currency, applying the 100% markup for
 * non-NGN visitors (i.e. the displayed price = NGN_price × rate × markup).
 */
export function convertPrice(
  ngnPrice: number | null,
  info: CurrencyInfo
): number | null {
  if (ngnPrice === null) return null;
  return ngnPrice * info.rate * info.markup;
}

/**
 * Format a converted price using Intl.NumberFormat.
 */
export function formatConvertedPrice(
  ngnPrice: number | null,
  info: CurrencyInfo
): string {
  if (ngnPrice === null) return "Request Price";
  if (info.loading) {
    // Show NGN while loading
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(ngnPrice);
  }
  const converted = convertPrice(ngnPrice, info)!;
  const maxFrac = ["JPY", "KRW"].includes(info.currency) ? 0 : 2;
  return new Intl.NumberFormat(info.locale, {
    style: "currency",
    currency: info.currency,
    maximumFractionDigits: maxFrac,
  }).format(converted);
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<CurrencyInfo>(DEFAULT_STATE);

  useEffect(() => {
    let cancelled = false;

    async function detectAndFetch() {
      // ── Step 1: detect country ──────────────────────────────────────────
      let countryCode: string | null = null;

      try {
        const geoRes = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(4000),
        });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          countryCode = geoData.country_code ?? null;
        }
      } catch {
        // API timed out or blocked — fall back to navigator
      }

      if (!countryCode) {
        countryCode = regionFromNavigatorLanguage();
      }

      const targetCurrency = countryCode
        ? (COUNTRY_CURRENCY[countryCode] ?? "NGN")
        : "NGN";

      // Nigerian visitors: no conversion, no markup
      if (targetCurrency === "NGN" || !countryCode) {
        if (!cancelled) {
          setInfo({
            currency: "NGN",
            locale: "en-NG",
            rate: 1,
            markup: 1,
            isNGN: true,
            loading: false,
            countryCode,
          });
        }
        return;
      }

      // ── Step 2: fetch live NGN → target exchange rate ───────────────────
      let rate = 1;
      try {
        // exchangerate-api.com free tier: no key needed for simple pair queries
        const fxRes = await fetch(
          `https://api.exchangerate-api.com/v4/latest/NGN`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (fxRes.ok) {
          const fxData = await fxRes.json();
          rate = fxData.rates?.[targetCurrency] ?? rate;
        }
      } catch {
        // FX fetch failed — use a hardcoded approximate fallback
        const FALLBACK_RATES: Record<string, number> = {
          GBP: 0.00052,
          EUR: 0.00062,
          USD: 0.00065,
          CAD: 0.00089,
          AUD: 0.00099,
          CHF: 0.00057,
          JPY: 0.097,
          CNY: 0.0047,
          INR: 0.054,
          AED: 0.0024,
          SAR: 0.0024,
          ZAR: 0.012,
          GHS: 0.0082,
          KES: 0.083,
          XOF: 0.405,
        };
        rate = FALLBACK_RATES[targetCurrency] ?? 0.00065; // USD as last resort
      }

      if (!cancelled) {
        setInfo({
          currency: targetCurrency,
          locale: CURRENCY_LOCALE[targetCurrency] ?? "en-US",
          rate,
          markup: 2, // 100% markup for all non-NGN currencies
          isNGN: false,
          loading: false,
          countryCode,
        });
      }
    }

    detectAndFetch();
    return () => { cancelled = true; };
  }, []);

  return (
    <CurrencyContext.Provider value={info}>
      {children}
    </CurrencyContext.Provider>
  );
}
