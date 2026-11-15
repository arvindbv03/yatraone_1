"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  CreditCard,
  Info,
  Landmark,
  LoaderCircle,
  Lock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { getHotel, getVehicle } from "@/lib/data";
import {
  addDays,
  cn,
  dateFromString,
  formatDate,
  formatDateRange,
  formatINR,
  plural,
  travellersLabel,
} from "@/lib/format";
import { roomCount, travellerCount } from "@/lib/pricing";
import type { PaymentMethod, Profile, Quote, TravellerDetails, TripConfig } from "@/lib/types";
import { BackButton, Divider, Eyebrow, PriceLine, Sheet, Tag } from "@/components/ui";
import { CareTags } from "@/components/itinerary-view";

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  detail: string;
  icon: typeof Smartphone;
}[] = [
  { id: "UPI", label: "UPI", detail: "demo@yatraone · simulated", icon: Smartphone },
  { id: "Card", label: "Card", detail: "Visa ending 4242 · demo", icon: CreditCard },
  { id: "Netbanking", label: "Netbanking", detail: "HDFC Bank · simulated", icon: Landmark },
];

export function CheckoutScreen({
  trip,
  quote,
  profile,
  onBack,
  onPay,
}: {
  trip: TripConfig;
  quote: Quote;
  profile: Profile;
  onBack: () => void;
  onPay: (details: TravellerDetails, method: PaymentMethod) => void;
}) {
  const vehicle = getVehicle(trip.vehicleId);
  const rooms = roomCount(trip);
  const travellers = travellerCount(trip);
  const balanceDue = formatDate(dateFromString(addDays(trip.startDate, -7)));

  const [form, setForm] = useState<TravellerDetails>({
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    pickupAddress: "31, 4th Cross, Jayanagar 4th Block, Bengaluru 560011",
    emergencyContact: `${profile.emergencyName} · ${profile.emergencyPhone}`,
    notes: "",
  });
  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const [acceptedVendors, setAcceptedVendors] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payOpen, setPayOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const update = (field: keyof TravellerDetails, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Add the lead traveller's full name.";
    if (form.phone.replace(/\D/g, "").length < 10) {
      next.phone = "Add a mobile number with at least 10 digits.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Add an email we can send confirmation to.";
    }
    if (form.pickupAddress.trim().length < 8) {
      next.pickupAddress = "Add the pickup address for the first morning.";
    }
    if (form.emergencyContact.trim().length < 5) {
      next.emergencyContact = "Add a name and number for emergencies.";
    }
    if (!acceptedVendors) {
      next.acceptedVendors = "Please acknowledge how vendor confirmation works.";
    }
    if (!acceptedTerms) {
      next.acceptedTerms = "Please accept the booking terms to continue.";
    }
    setErrors(next);

    if (Object.keys(next).length > 0) {
      window.setTimeout(() => {
        document
          .getElementById("checkout-errors")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 60);
      return false;
    }
    return true;
  };

  const startPayment = () => {
    if (paying) return;
    if (!validate()) return;
    setPayOpen(true);
  };

  const confirmPayment = () => {
    setPayOpen(false);
    setPaying(true);
    timerRef.current = window.setTimeout(() => {
      onPay(form, method);
    }, 1900);
  };

  const errorCount = Object.keys(errors).length;
  const selectedAddOns = trip.addOnIds.length;

  return (
    <div className="pb-32 md:pb-14">
      <div className="container-page pt-6">
        <BackButton onClick={onBack} label="Back to extras" />
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>05 · Review & pay</Eyebrow>
            <h1 className="mt-3 font-display text-[40px] leading-[0.98] tracking-[-0.04em] text-forest sm:text-[50px]">
              One clear look
              <span className="ml-2 italic text-saffron-deep">before you pay.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-forest-soft">
              Check the people, the care plan and the price. You pay a 25% advance today; the
              balance is due a week before departure.
            </p>
          </div>
          <Tag tone="sage">
            <Lock size={12} aria-hidden="true" />
            Demo payment · no money moves
          </Tag>
        </div>

        {errorCount > 0 && (
          <div
            id="checkout-errors"
            className="mt-5 rounded-2xl border border-[#d8a58f] bg-[#fbe7e1] px-4 py-3"
          >
            <p className="text-[11px] font-bold text-[#8d3d25]">
              Please check {plural(errorCount, "detail")} before paying.
            </p>
            <ul className="mt-1.5 space-y-0.5">
              {Object.values(errors).map((error) => (
                <li key={error} className="text-[10px] leading-4 text-[#8d3d25]/85">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_372px] lg:items-start">
          <div className="space-y-4">
            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Lead traveller
                  </p>
                  <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em] text-forest">
                    Who should we call first?
                  </h2>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage text-forest">
                  <UsersRound size={16} aria-hidden="true" />
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Full name
                  </span>
                  <input
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    className={cn("input-shell h-12 text-[12px]", errors.name && "border-[#b26a51]")}
                  />
                  {errors.name && <span className="mt-1 block text-[9px] text-[#8d3d25]">{errors.name}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Mobile number
                  </span>
                  <input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    className={cn("input-shell h-12 text-[12px]", errors.phone && "border-[#b26a51]")}
                  />
                  {errors.phone && <span className="mt-1 block text-[9px] text-[#8d3d25]">{errors.phone}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Email
                  </span>
                  <input
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    inputMode="email"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    className={cn("input-shell h-12 text-[12px]", errors.email && "border-[#b26a51]")}
                  />
                  {errors.email && <span className="mt-1 block text-[9px] text-[#8d3d25]">{errors.email}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Pickup address
                  </span>
                  <input
                    value={form.pickupAddress}
                    onChange={(event) => update("pickupAddress", event.target.value)}
                    autoComplete="street-address"
                    aria-invalid={Boolean(errors.pickupAddress)}
                    className={cn(
                      "input-shell h-12 text-[12px]",
                      errors.pickupAddress && "border-[#b26a51]",
                    )}
                  />
                  {errors.pickupAddress && (
                    <span className="mt-1 block text-[9px] text-[#8d3d25]">{errors.pickupAddress}</span>
                  )}
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Emergency contact · name and number
                  </span>
                  <input
                    value={form.emergencyContact}
                    onChange={(event) => update("emergencyContact", event.target.value)}
                    aria-invalid={Boolean(errors.emergencyContact)}
                    className={cn(
                      "input-shell h-12 text-[12px]",
                      errors.emergencyContact && "border-[#b26a51]",
                    )}
                  />
                  {errors.emergencyContact && (
                    <span className="mt-1 block text-[9px] text-[#8d3d25]">
                      {errors.emergencyContact}
                    </span>
                  )}
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Anything your coordinator should know? <span className="font-normal text-muted">(optional)</span>
                  </span>
                  <textarea
                    value={form.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    rows={3}
                    placeholder="Medication times, food allergies, a preferred language, or a mobility detail we should brief the driver on."
                    className="input-shell min-h-[86px] resize-y py-3 text-[12px]"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[24px] border border-forest/15 bg-sage/60 p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-forest-soft">
                Care on this booking
              </p>
              <div className="mt-2.5">
                <CareTags trip={trip} />
              </div>
              <p className="mt-2.5 text-[10px] leading-5 text-forest-soft/80">
                {travellersLabel(trip.adults, trip.seniors, trip.children)} ·{" "}
                {rooms} rooms · {trip.pace} pace. Wheelchair support is requested for every
                transfer and temple entry where possible. We will not remove it silently if a
                partner cannot meet it.
              </p>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-paper/60 px-3 py-2.5">
                <ShieldCheck size={12} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
                <p className="text-[9px] leading-4 text-forest-soft">
                  This care plan goes to the stay, driver, guide and wheelchair partner. Any
                  mismatch is flagged before departure.
                </p>
              </div>
            </section>

            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Payment method
                  </p>
                  <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em] text-forest">
                    Pay the advance.
                  </h2>
                </div>
                <span className="rounded-full bg-[#f7e7d5] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-saffron-deep">
                  Simulated
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {PAYMENT_METHODS.map((option) => {
                  const Icon = option.icon;
                  const active = method === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setMethod(option.id)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-start gap-2.5 rounded-xl border p-3 text-left transition",
                        active
                          ? "border-forest/30 bg-sage"
                          : "border-sand bg-cream/50 hover:border-forest/20 hover:bg-white",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          active ? "bg-forest text-cream" : "bg-mist text-forest-soft",
                        )}
                      >
                        <Icon size={14} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold text-forest">
                          {option.label}
                        </span>
                        <span className="mt-0.5 block text-[9px] leading-4 text-muted">
                          {option.detail}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-[9px] leading-4 text-muted">
                <Info size={11} className="mt-0.5 shrink-0" aria-hidden="true" />
                This prototype does not collect real card numbers, CVVs, UPI PINs or bank
                credentials. The payment gateway is simulated.
              </p>
            </section>

            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Before you pay
              </p>
              <div className="mt-3 space-y-2.5">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sand bg-cream/50 p-3.5 transition hover:bg-white">
                  <input
                    type="checkbox"
                    checked={acceptedVendors}
                    onChange={(event) => {
                      setAcceptedVendors(event.target.checked);
                      setErrors((previous) => {
                        const next = { ...previous };
                        delete next.acceptedVendors;
                        return next;
                      });
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#14382f]"
                  />
                  <span className="text-[10px] leading-5 text-forest-soft">
                    I understand that temple darshan is subject to the temple on the day, and that
                    my stay and vehicle are confirmed by partners after this payment. If they
                    cannot be confirmed, my advance is refundable.
                  </span>
                </label>
                {errors.acceptedVendors && (
                  <p className="pl-1 text-[9px] text-[#8d3d25]">{errors.acceptedVendors}</p>
                )}

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sand bg-cream/50 p-3.5 transition hover:bg-white">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => {
                      setAcceptedTerms(event.target.checked);
                      setErrors((previous) => {
                        const next = { ...previous };
                        delete next.acceptedTerms;
                        return next;
                      });
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#14382f]"
                  />
                  <span className="text-[10px] leading-5 text-forest-soft">
                    I agree to the booking terms and cancellation policy, and I understand that
                    this is a prototype with a simulated payment.
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <p className="pl-1 text-[9px] text-[#8d3d25]">{errors.acceptedTerms}</p>
                )}
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-[9px] leading-4 text-muted">
                <CalendarDays size={11} className="mt-0.5 shrink-0" aria-hidden="true" />
                Free cancellation on this stay until 5 days before departure. The full policy is
                shown before confirmation.
              </p>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-sand bg-paper p-5 soft-shadow lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-2">
                <Eyebrow>Your yatra</Eyebrow>
                <Tag tone="sage">Draft</Tag>
              </div>
              <div className="mt-3">
                <p className="font-display text-[24px] leading-tight tracking-[-0.025em] text-forest">
                  {getHotel(trip.hotelId).name}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {formatDateRange(trip.startDate, trip.days)} · {rooms} rooms · {travellers}{" "}
                  travellers
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <PriceLine
                  label={`Stay · ${rooms} rooms × ${quote.nights} nights`}
                  value={formatINR(quote.hotelPaise)}
                  muted
                />
                <PriceLine
                  label={`Transport · ${vehicle.name.split("—")[0].trim()} × ${trip.days} days`}
                  value={formatINR(quote.transportPaise)}
                  muted
                />
                <PriceLine
                  label={`Extras · ${selectedAddOns} selected`}
                  value={formatINR(quote.addOnsPaise)}
                  muted
                />
                <PriceLine label="Platform fee" value={formatINR(quote.platformFeePaise)} muted />
                <PriceLine label="GST (5%)" value={formatINR(quote.gstPaise)} muted />
              </div>

              <Divider className="my-3" />
              <div className="flex items-end justify-between gap-3">
                <span className="text-[12px] font-semibold text-forest-soft">Total</span>
                <span className="font-display text-[28px] leading-none text-forest">
                  {formatINR(quote.totalPaise)}
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-forest p-4 text-cream">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-sage-deep/70">
                      Pay today · 25%
                    </p>
                    <p className="mt-1 font-display text-[28px] leading-none">
                      {formatINR(quote.advancePaise)}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-saffron">
                    <Lock size={15} aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-cream/10 pt-2.5 text-[9px] text-cream/65">
                  <span>Balance later</span>
                  <span>{formatINR(quote.balancePaise)}</span>
                </div>
                <p className="mt-1 text-[8px] text-cream/45">
                  Due by {balanceDue}, 7 days before departure
                </p>
              </div>

              <button type="button" onClick={startPayment} className="button-primary mt-4 w-full">
                Pay {formatINR(quote.advancePaise)} advance
                <ArrowRight size={15} aria-hidden="true" />
              </button>
              <div className="mt-3 flex items-start gap-1.5 text-[9px] leading-4 text-muted">
                <ShieldCheck size={11} className="mt-0.5 shrink-0" aria-hidden="true" />
                Secure demo checkout. No real payment is taken and no live inventory is held.
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  "No hidden fees",
                  "Free cancellation*",
                  "Human coordinator",
                  "Care plan shared",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 rounded-lg bg-ivory px-2 py-1.5 text-[8px] font-medium text-forest-soft"
                  >
                    <Check size={9} className="shrink-0 text-forest" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[8px] leading-3 text-muted">
                *As per the selected stay&apos;s cancellation terms.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-cream/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">
              Advance · 25%
            </p>
            <p className="text-[15px] font-bold text-forest">{formatINR(quote.advancePaise)}</p>
          </div>
          <button
            type="button"
            onClick={startPayment}
            className="button-primary flex-1 px-3 text-[12px]"
          >
            Pay advance <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Sheet
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title="Confirm demo payment"
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPayOpen(false)}
              className="button-secondary flex-1"
            >
              <ChevronLeft size={15} aria-hidden="true" /> Back
            </button>
            <button type="button" onClick={confirmPayment} className="button-primary flex-1">
              Pay {formatINR(quote.advancePaise)}
            </button>
          </div>
        }
      >
        <div className="rounded-2xl border border-sand bg-cream p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                Advance due now
              </p>
              <p className="mt-1 font-display text-[30px] leading-none text-forest">
                {formatINR(quote.advancePaise)}
              </p>
            </div>
            <Tag tone="saffron">25% of total</Tag>
          </div>
          <div className="mt-3 space-y-1.5 text-[10px]">
            <div className="flex justify-between">
              <span className="text-muted">Method</span>
              <span className="font-semibold text-forest">
                {PAYMENT_METHODS.find((option) => option.id === method)?.label} · demo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Lead traveller</span>
              <span className="font-semibold text-forest">{form.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Balance later</span>
              <span className="font-semibold text-forest">{formatINR(quote.balancePaise)}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-saffron/25 bg-[#fbf3e7] p-3">
          <Sparkles size={13} className="mt-0.5 shrink-0 text-saffron-deep" aria-hidden="true" />
          <p className="text-[10px] leading-5 text-saffron-deep">
            This is a product prototype. Pressing pay simulates a successful advance. No money
            moves and no real vendor is booked.
          </p>
        </div>

        <div className="mt-3 rounded-xl bg-ivory p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">
            After this payment
          </p>
          <ul className="mt-2 space-y-1.5">
            {[
              "Your advance is recorded and a reference is created.",
              "We request the stay, vehicle and care partner.",
              "You see exactly what is confirmed in My Yatra.",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-1.5 text-[10px] leading-4 text-forest-soft"
              >
                <Check size={10} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Sheet>

      {paying && (
        <div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-forest px-6 text-cream"
          role="status"
          aria-live="polite"
        >
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-cream/15" />
            <LoaderCircle
              size={48}
              className="animate-spin text-saffron"
              strokeWidth={1.2}
              aria-hidden="true"
            />
          </div>
          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-cream/50">
            Demo payment gateway
          </p>
          <h2 className="mt-2 max-w-sm text-center font-display text-[30px] leading-tight tracking-[-0.03em]">
            Processing a simulated advance.
          </h2>
          <p className="mt-3 max-w-xs text-center text-[10px] leading-5 text-cream/50">
            No money is moving. In a live build this is where the payment provider and availability
            checks would run.
          </p>
        </div>
      )}

      <div className="print-only mt-8">
        <p className="text-sm font-semibold">YatraOne booking review</p>
        <p className="text-xs">
          {formatDateRange(trip.startDate, trip.days)} · {travellersLabel(trip.adults, trip.seniors, trip.children)}
        </p>
        <p className="text-xs">Total {formatINR(quote.totalPaise)} · Advance {formatINR(quote.advancePaise)}</p>
        <p className="mt-2 flex items-center gap-1 text-xs">
          <ArrowLeft size={12} /> Prototype only. No payment has been taken.
        </p>
      </div>
    </div>
  );
}
