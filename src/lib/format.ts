const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(paise: number) {
  return inrFormatter.format(paise / 100);
}

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(date);
}

export function dateFromString(value: string) {
  return new Date(`${value}T12:00:00`);
}

export function addDays(value: string, days: number) {
  const date = dateFromString(value);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatDateRange(startDate: string, days: number) {
  const start = dateFromString(startDate);
  const end = dateFromString(addDays(startDate, days - 1));
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: sameMonth ? undefined : "short",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(end);
  return `${startLabel}–${endLabel}`;
}

export function formatLongDate(value: string) {
  return formatDate(dateFromString(value), {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatWeekday(value: string) {
  return formatDate(dateFromString(value), { weekday: "long" });
}

export function nightsLabel(days: number) {
  const nights = Math.max(0, days - 1);
  return `${days} ${days === 1 ? "day" : "days"} · ${nights} ${
    nights === 1 ? "night" : "nights"
  }`;
}

export function travellersLabel(adults: number, seniors: number, children: number) {
  const total = adults + seniors + children;
  const parts = [total === 1 ? "1 traveller" : `${total} travellers`];
  if (seniors > 0) parts.push(`${seniors} senior${seniors > 1 ? "s" : ""}`);
  return parts.join(" · ");
}

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function plural(value: number, singular: string, pluralForm?: string) {
  return `${value} ${value === 1 ? singular : pluralForm ?? `${singular}s`}`;
}
