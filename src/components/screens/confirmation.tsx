"use client";

import { useState } from "react";
import {
  Accessibility,
  ArrowRight,
  BedDouble,
  CalendarDays,
  CarFront,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Copy,
  Landmark,
  MapPin,
  Printer,
  ReceiptText,
  ShieldCheck,
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
  travellersLabel,
} from "@/lib/format";
import type { Booking, VendorStatus } from "@/lib/types";
import { Divider, Eyebrow, PriceLine, Tag } from "@/components/ui";
import { CareTags } from "@/components/itinerary-view";
import { RouteMap } from "@/components/route-map";

const VENDOR_ICONS: Record<VendorStatus["id"], typeof BedDouble> = {
  stay: BedDouble,
  vehicle: CarFront,
  wheelchair: Accessibility,
  guide: Compass,
  darshan: Landmark,
};

const STATUS_META: Record<
  VendorStatus["state"],
  { label: string; tone: "sage" | "saffron" | "sand"; icon: typeof Check }
> = {
  confirmed: { label: "Confirmed", tone: "sage", icon: Check },
  requested: { label: "Requested", tone: "saffron", icon: Clock3 },
  pending: { label: "In progress", tone: "sand", icon: Clock3 },
  subject_to_temple: { label: "Subject to temple", tone: "sand", icon: Landmark },
  not_selected: { label: "Not added", tone: "sand", icon: Clock3 },
};

export function ConfirmationScreen({
  booking,
  onViewTrips,
  onViewTrip,
  onHome,
  onToast,
}: {
  booking: Booking;
  onViewTrips: () => void;
  onViewTrip: () => void;
  onHome: () => void;
  onToast: (message: string) => void;
}) {
  const hotel = getHotel(booking.hotelId);
  const vehicle = getVehicle(booking.vehicleId);
  const [copied, setCopied] = useState(false);
  const dueDate = formatDate(dateFromString(addDays(booking.trip.startDate, -7)));
  const paidAt = formatDate(new Date(booking.bookedAt), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(booking.reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      onToast(`Your reference is ${booking.reference}`);
    }
  };

  const requested = booking.vendorStatuses.filter(
    (vendor) => vendor.state === "requested" || vendor.state === "pending",
  ).length;

  return (
    <div className="pb-28 md:pb-14">
      <div className="container-page pt-10 md:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <span className="animate-check-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest text-saffron shadow-[0_18px_40px_-20px_rgba(20,56,47,0.6)]">
            <Check size={30} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <Eyebrow className="mt-6 justify-center">Advance paid · {booking.reference}</Eyebrow>
          <h1 className="text-balance mt-3 font-display text-[42px] leading-[0.98] tracking-[-0.04em] text-forest sm:text-[56px]">
            Your yatra is
            <span className="ml-2 italic text-saffron-deep">taking shape.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-forest-soft">
            Your advance is recorded and the first requests are with our partners. Here is exactly
            what is confirmed — and what is still a request, not a promise.
          </p>
          <div className="mx-auto mt-5 inline-flex max-w-full items-start gap-2 rounded-full border border-saffron/25 bg-[#fbf3e7] px-3.5 py-2 text-left text-[10px] leading-4 text-saffron-deep">
            <Sparkles size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
            Prototype payment: no money moved. A real payment would be labelled and receipted the
            same way.
          </div>
        </div>
      </div>

      <div className="container-page mt-8 grid gap-6 lg:grid-cols-[1fr_356px] lg:items-start">
        <div className="space-y-4">
          <section className="overflow-hidden rounded-[26px] border border-sand bg-paper">
            <div className="relative bg-forest px-5 py-5 text-cream sm:px-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-sage-deep/70">
                    Your booking
                  </p>
                  <p className="mt-1 font-display text-[26px] leading-tight tracking-[-0.025em]">
                    {booking.trip.origin} to the sacred circuit
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] text-cream/60">
                    <CalendarDays size={11} aria-hidden="true" />
                    {formatDateRange(booking.trip.startDate, booking.trip.days)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyReference}
                  className="flex items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-3 py-2 text-[10px] font-semibold text-cream transition hover:bg-cream/15"
                >
                  {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                  {copied ? "Copied" : booking.reference}
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_190px] sm:items-start">
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage text-forest">
                      <UsersRound size={14} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold text-forest">
                        {travellersLabel(
                          booking.trip.adults,
                          booking.trip.seniors,
                          booking.trip.children,
                        )}
                      </p>
                      <p className="mt-0.5 text-[9px] leading-4 text-muted">
                        {booking.quote.rooms} rooms · {booking.trip.days} days ·{" "}
                        {booking.trip.pace} pace
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage text-forest">
                      <BedDouble size={14} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold text-forest">{hotel.name}</p>
                      <p className="mt-0.5 text-[9px] leading-4 text-muted">
                        {booking.quote.nights} nights · {hotel.roomType} ·{" "}
                        {hotel.breakfast ? "breakfast included" : "breakfast not included"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage text-forest">
                      <CarFront size={14} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold text-forest">{vehicle.name}</p>
                      <p className="mt-0.5 text-[9px] leading-4 text-muted">
                        {vehicle.capacity} · {vehicle.accessible ? "accessible van" : "private vehicle"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-sand/70 p-1.5">
                  <RouteMap trip={booking.trip} compact />
                </div>
              </div>

              <Divider className="my-4" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Total", value: formatINR(booking.quote.totalPaise) },
                  { label: "Advance paid", value: formatINR(booking.paidPaise) },
                  { label: "Balance", value: formatINR(booking.quote.balancePaise) },
                  { label: "Balance due", value: dueDate },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-forest">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[26px] border border-sand bg-paper p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  Booking status
                </p>
                <h2 className="mt-1.5 font-display text-[25px] tracking-[-0.025em] text-forest">
                  What is confirmed, and what is not.
                </h2>
              </div>
              <Tag tone={requested > 0 ? "saffron" : "sage"}>
                {requested > 0 ? `${requested} partner requests open` : "All partners confirmed"}
              </Tag>
            </div>

            <div className="mt-4 space-y-2">
              {booking.vendorStatuses.map((vendor) => {
                const Icon = VENDOR_ICONS[vendor.id];
                const meta = STATUS_META[vendor.state];
                const StatusIcon = meta.icon;
                const confirmed = vendor.state === "confirmed";
                return (
                  <div
                    key={vendor.id}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-3.5",
                      confirmed
                        ? "border-forest/15 bg-sage/50"
                        : "border-sand bg-cream/50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        confirmed ? "bg-forest text-cream" : "bg-white text-forest-soft",
                      )}
                    >
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-forest">{vendor.label}</p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em]",
                            meta.tone === "sage"
                              ? "bg-sage text-forest-soft"
                              : meta.tone === "saffron"
                                ? "bg-[#f7e7d5] text-saffron-deep"
                                : "bg-mist text-muted",
                          )}
                        >
                          <StatusIcon size={9} aria-hidden="true" />
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-1 text-[9px] leading-4 text-muted">{vendor.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl border border-forest/15 bg-ivory px-3 py-2.5">
              <ShieldCheck size={12} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
              <p className="text-[9px] leading-4 text-forest-soft">
                If we cannot confirm the stay, the accessible vehicle or the wheelchair partner,
                your advance is fully refundable. We will tell you which part failed — not replace
                it silently.
              </p>
            </div>
          </section>

          <section className="rounded-[26px] border border-sand bg-paper p-5 sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              What happens next
            </p>
            <ol className="mt-4 space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  title: "Advance recorded",
                  copy: `A receipt was created for ${formatINR(booking.paidPaise)}. In this prototype, it is a simulation and no money moved.`,
                  time: "Now",
                },
                {
                  icon: Clock3,
                  title: "Partners respond",
                  copy: "Our operations team confirms the stay and the accessible vehicle, and assigns the wheelchair attendant. You will see each status change in My Yatra.",
                  time: "Within 24 hours",
                },
                {
                  icon: CalendarDays,
                  title: "Balance and care briefing",
                  copy: `The remaining ${formatINR(booking.quote.balancePaise)} is due by ${dueDate}. We confirm medication, rest and pickup details in the same call.`,
                  time: "7 days before",
                },
                {
                  icon: Sparkles,
                  title: "Final route briefing",
                  copy: "Your coordinator shares the driver's name and number, the darshan queue status and a weather note for the first morning.",
                  time: "48 hours before",
                },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="relative flex gap-3.5">
                    {index < 3 && (
                      <span
                        className="absolute bottom-0 left-[17px] top-9 w-px bg-sand"
                        aria-hidden="true"
                      />
                    )}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage text-forest">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[11px] font-semibold text-forest">{step.title}</p>
                        <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-saffron-deep">
                          {step.time}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] leading-5 text-muted">{step.copy}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="rounded-[26px] border border-forest/15 bg-sage/60 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest-soft">
                  Care on this booking
                </p>
                <p className="mt-1 text-[11px] font-semibold text-forest">
                  Senior-first support, carried into the operations sheet.
                </p>
              </div>
              <Accessibility size={18} className="text-forest-soft/60" aria-hidden="true" />
            </div>
            <CareTags trip={booking.trip} className="mt-2.5" />
            <p className="mt-2.5 text-[10px] leading-5 text-forest-soft/80">
              Your wheelchair request, rest-stop plan and meal preferences are shared with the
              stay, driver, guide and attendant. If a temple route has unavoidable steps, we will
              flag it before the visit.
            </p>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[24px] border border-sand bg-paper p-5 soft-shadow">
            <div className="flex items-center justify-between gap-2">
              <Eyebrow>Payment receipt</Eyebrow>
              <ReceiptText size={15} className="text-forest-soft/50" aria-hidden="true" />
            </div>
            <div className="mt-3 rounded-2xl bg-ivory/80 p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted">
                    Advance paid
                  </p>
                  <p className="mt-1 font-display text-[28px] leading-none text-forest">
                    {formatINR(booking.paidPaise)}
                  </p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-cream">
                  <Check size={14} aria-hidden="true" />
                </span>
              </div>
              <p className="mt-2 text-[9px] text-muted">
                {booking.paymentMethod} · {paidAt} · {booking.reference}
              </p>
            </div>

            <details className="group mt-3">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-1 py-2 text-[10px] font-semibold text-forest-soft transition hover:text-forest">
                View itemised receipt
                <span className="text-[9px] font-normal text-muted group-open:hidden">Open</span>
                <span className="hidden text-[9px] font-normal text-muted group-open:inline">
                  Close
                </span>
              </summary>
              <div className="mt-1 space-y-2 border-t border-sand/70 pt-3">
                <PriceLine label="Stay" value={formatINR(booking.quote.hotelPaise)} muted />
                <PriceLine
                  label="Transport"
                  value={formatINR(booking.quote.transportPaise)}
                  muted
                />
                <PriceLine label="Extras" value={formatINR(booking.quote.addOnsPaise)} muted />
                <PriceLine
                  label="Platform fee"
                  value={formatINR(booking.quote.platformFeePaise)}
                  muted
                />
                <PriceLine label="GST (5%)" value={formatINR(booking.quote.gstPaise)} muted />
                <Divider className="my-1" />
                <PriceLine label="Total" value={formatINR(booking.quote.totalPaise)} strong />
                <PriceLine
                  label="Paid today"
                  value={formatINR(booking.paidPaise)}
                  muted
                />
                <PriceLine
                  label="Balance due"
                  value={`${formatINR(booking.quote.balancePaise)} by ${dueDate}`}
                  muted
                />
              </div>
            </details>

            <button
              type="button"
              onClick={() => window.print()}
              className="button-secondary mt-3 w-full text-[11px]"
            >
              <Printer size={14} aria-hidden="true" /> Print receipt
            </button>
            <p className="mt-2 text-center text-[8px] leading-3 text-muted">
              Prototype receipt · not a tax invoice or payment proof
            </p>
          </div>

          <div className="rounded-[24px] border border-sand bg-paper p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-cream">
                MR
              </span>
              <div>
                <p className="text-[11px] font-semibold text-forest">Meera Raghavan</p>
                <p className="text-[9px] text-muted">Your Yatra coordinator · Bengaluru</p>
              </div>
            </div>
            <p className="mt-3 text-[10px] leading-5 text-muted">
              Meera is your named human contact for changes, vendor calls and anything that feels
              unclear. Trip support stays open 24 hours from departure.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToast("Demo only — no call placed to the coordinator.")}
                className="min-h-10 rounded-full border border-sand bg-cream text-[10px] font-semibold text-forest transition hover:border-forest/30 hover:bg-white"
              >
                Call (demo)
              </button>
              <button
                type="button"
                onClick={() => onToast("Demo only — no message sent to the coordinator.")}
                className="min-h-10 rounded-full border border-sand bg-cream text-[10px] font-semibold text-forest transition hover:border-forest/30 hover:bg-white"
              >
                Message
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-sand bg-paper p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              Keep it close
            </p>
            <div className="mt-3 space-y-2">
              <button type="button" onClick={onViewTrips} className="button-primary w-full">
                Open My Yatra <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button type="button" onClick={onViewTrip} className="button-secondary w-full">
                View this booking
              </button>
              <button
                type="button"
                onClick={onHome}
                className="flex min-h-10 w-full items-center justify-center text-[10px] font-semibold text-muted transition hover:text-forest"
              >
                Back to home
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-2xl border border-sand bg-cream p-3.5">
            <MapPin size={13} className="mt-0.5 shrink-0 text-saffron-deep" aria-hidden="true" />
            <p className="text-[9px] leading-4 text-muted">
              Keep this reference:{" "}
              <span className="font-semibold text-forest">{booking.reference}</span>. It works
              offline and is all you need when you call us.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
