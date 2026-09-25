import { CURRENCY, LOCALE } from "@/config/locale";

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
});

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}
