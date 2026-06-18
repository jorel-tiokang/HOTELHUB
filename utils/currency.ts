import type { CurrencyCode } from "@/store/currencyStore";
import { EXCHANGE_RATES } from "@/store/currencyStore";

// ── Convert from XAF to any target currency ──────────────────────────────────
export function convertFromXAF(amountXAF: number, to: CurrencyCode): number {
  return amountXAF * EXCHANGE_RATES[to];
}

// ── Convert from any currency to XAF (for saving form inputs) ───────────────
export function convertToXAF(amount: number, from: CurrencyCode): number {
  return amount / EXCHANGE_RATES[from];
}

// ── Full currency formatter ──────────────────────────────────────────────────
/**
 * Converts `amountXAF` (stored in FCFA) to the target currency and formats it
 * using the browser's Intl API — respecting locale number conventions.
 *
 * @param amountXAF  - Raw price in XAF (the database/store base currency)
 * @param currency   - Target display currency code
 * @param locale     - next-intl locale string ("fr" | "en")
 *
 * Examples:
 *   formatPrice(150000, "XAF", "fr") → "150 000 FCFA"
 *   formatPrice(150000, "EUR", "fr") → "228,56 €"
 *   formatPrice(150000, "USD", "en") → "$246.60"
 */
export function formatPrice(
  amountXAF: number,
  currency: CurrencyCode,
  locale: string,
): string {
  const converted = convertFromXAF(amountXAF, currency);

  // XAF has no decimal places; EUR and USD use 2
  const fractionDigits = currency === "XAF" ? 0 : 2;

  // Use real ISO currency codes for Intl — XAF is a valid ISO 4217 code
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency,                           // ISO 4217: "XAF", "EUR", "USD"
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(converted);
}

// ── Compact formatter for large aggregated values (dashboard stats) ──────────
/**
 * Formats large amounts compactly — adapts unit automatically:
 *   XAF: 1 500 000 → "1,5M FCFA"
 *   EUR: 1 500 000 → "2 284 €"  (compact not useful at EUR scale so uses standard)
 *   USD: 1 500 000 → "$2,466"
 *
 * @param amountXAF - Raw amount in XAF
 * @param currency  - Target display currency
 * @param locale    - Locale string
 */
export function formatCompactPrice(
  amountXAF: number,
  currency: CurrencyCode,
  locale: string,
): string {
  const converted = convertFromXAF(amountXAF, currency);
  const intlLocale = locale === "fr" ? "fr-FR" : "en-US";

  // Only use compact notation when value is large enough to benefit
  if (converted >= 1_000_000) {
    return (
      new Intl.NumberFormat(intlLocale, {
        style: "currency",
        currency,
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
      }).format(converted)
    );
  }

  if (converted >= 1_000) {
    return (
      new Intl.NumberFormat(intlLocale, {
        style: "currency",
        currency,
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 1,
      }).format(converted)
    );
  }

  // Small values: standard format
  return formatPrice(amountXAF, currency, locale);
}

// ── Currency symbol only (for form labels) ───────────────────────────────────
export function getCurrencySymbol(currency: CurrencyCode, locale: string): string {
  const symbols: Record<CurrencyCode, string> = {
    XAF: "FCFA",
    EUR: "€",
    USD: "$",
  };
  return symbols[currency];
}
