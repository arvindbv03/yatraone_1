"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Headphones,
  Luggage,
  MapPin,
  MessageCircle,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { getDestination, getHotel } from "@/lib/data";
import {
  addDays,
  cn,
  dateFromString,
  formatDate,
  formatDateRange,
  formatINR,
  travellersLabel,
} from "@/lib/format";
import type { Booking, Quote, TripConfig } from "@/lib/types";
import { assetPath } from "@/lib/paths";
import { Divider, EmptyState, Eyebrow, Tag } from "@/components/ui";
import { CareTags } from "@/components/itinerary-view";
import { RouteMap } from "@/components/route-map";

function isUpcoming(booking: Booking) {
  const start = dateFromString(booking.trip.startDate).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return start >= today.getTime();
}

function bookingStatus(booking: Booking) {
  const open = booking.vendorStatuses.filter(
    (vendor) => vendor.state === "requested" || vendor.state === "pending",
  ).length;
  return {
    open,
    label: open > 0 ? "Advance paid · confirming partners" : "Advance paid · all partners confirmed",
  };
}

function BookingCard({
  booking,
  onOpen,
  onHelp,
}: {
  booking: Booking;
  onOpen: () => void;
  onHelp: () => void;
}) {
  const first = getDestination(booking.trip.destinations[0]);
  const hotel = getHotel(booking.hotelId);
  const status = bookingStatus(booking);
  const confirmed = booking.vendorStatuses.filter(
    (vendor) => vendor.state === "confirmed",
  ).length;
  const totalPartners = booking.vendorStatuses.filter(
    (vendor) => vendor.state !== "not_selected",
  ).length;
  const balanceDue = formatDate(dateFromString(addDays(booking.trip.startDate, -7)));

  return (
    <article className="overflow-hidden rounded-[26px] border border-sand bg-paper transition hover:border-forest/20">
      <div className="grid md:grid-cols-[205px_1fr]">
        <div className="relative h-44 md:h-full md:min-h-[260px]">
          <Image
            src={assetPath(first?.image ?? "/images/tirupati-alt.jpg")}
            alt={first?.imageAlt ?? "Temple on your yatra route"}
            fill
            sizes="(max-width: 768px) 100vw, 205px"
            className="object-cover"
          />
          <div className="photo-tint absolute inset-0" />
          <div className="absolute inset-x-3 bottom-3">
            <p className="font-display text-[21px] leading-tight text-white">
              {first?.shortName ?? "Your yatra"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[8px] text-white/75">
              <MapPin size={9} aria-hidden="true" />
              {booking.trip.origin} · {booking.trip.destinations.length} stops
            </p>
          </div>
          <span className="absolute left-2.5 top-2.5 rounded-full bg-cream/90 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-forest backdrop-blur">
            {isUpcoming(booking) ? "Upcoming" : "Completed"}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-muted">
                {booking.reference} · {hotel.name}
              </p>
              <h3 className="mt-1 font-display text-[24px] leading-tight tracking-[-0.025em] text-forest">
                {first?.shortName ?? "Yatra"}
                {booking.trip.destinations.length > 1
                  ? ` & ${booking.trip.destinations.length - 1} more`
                  : ""}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f7e7d5] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-saffron-deep">
              <Clock3 size={9} aria-hidden="true" />
              {status.open > 0 ? `${status.open} open` : "Confirmed"}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted">
            <span className="flex items-center gap-1">
              <CalendarDays size={10} aria-hidden="true" />
              {formatDateRange(booking.trip.startDate, booking.trip.days)}
            </span>
            <span className="flex items-center gap-1">
              <UsersRound size={10} aria-hidden="true" />
              {travellersLabel(
                booking.trip.adults,
                booking.trip.seniors,
                booking.trip.children,
              )}
            </span>
          </div>

          <div className="mt-3 rounded-xl bg-ivory/80 p-2.5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] font-semibold text-forest-soft">
                {confirmed}/{totalPartners} partners confirmed
              </p>
              <span className="text-[8px] text-muted">{status.label}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-forest transition-all"
                style={{
                  width: `${totalPartners ? Math.max(8, (confirmed / totalPartners) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-sand/60 pt-3">
            <div>
              <p className="text-[9px] text-muted">
                Paid {formatINR(booking.paidPaise)} · balance {formatINR(booking.quote.balancePaise)}
              </p>
              <p className="mt-0.5 text-[8px] text-muted">Balance due {balanceDue}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onHelp}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-sand bg-cream px-3 text-[10px] font-semibold text-forest transition hover:border-forest/30 hover:bg-white"
              >
                <Headphones size={12} aria-hidden="true" /> Help
              </button>
              <button
                type="button"
                onClick={onOpen}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-forest px-3.5 text-[10px] font-semibold text-cream transition hover:bg-forest-deep"
              >
                View yatra <ArrowRight size={12} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TripsScreen({
  bookings,
  trip,
  quote,
  hasStarted,
  onOpenBooking,
  onContinuePlanning,
  onViewItinerary,
  onExplore,
  onNewTrip,
  onToast,
}: {
  bookings: Booking[];
  trip: TripConfig;
  quote: Quote;
  hasStarted: boolean;
  onOpenBooking: (reference: string) => void;
  onContinuePlanning: () => void;
  onViewItinerary: () => void;
  onExplore: () => void;
  onNewTrip: () => void;
  onToast: (message: string) => void;
}) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const upcoming = bookings.filter(isUpcoming);
  const past = bookings.filter((booking) => !isUpcoming(booking));
  const list = tab === "upcoming" ? upcoming : past;
  const showDraft = hasStarted || bookings.length === 0;
  const careTrip = upcoming[0]?.trip ?? trip;
  const firstDestination = getDestination(trip.destinations[0]);

  return (
    <div className="pb-24 md:pb-10">
      <div className="container-page pt-9 md:pt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>My Yatra</Eyebrow>
            <h1 className="mt-3 font-display text-[42px] leading-[0.98] tracking-[-0.04em] text-forest sm:text-[54px]">
              Everything, in
              <span className="ml-2 italic text-saffron-deep">one place.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-forest-soft">
              Your booked journeys, the care plan on file and the draft you are still shaping.
              No fine print tucked away.
            </p>
          </div>
          <button type="button" onClick={onNewTrip} className="button-primary self-start">
            <Sparkles size={15} aria-hidden="true" /> Plan a new yatra
          </button>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_336px] lg:items-start">
          <div className="space-y-5">
            {showDraft && (
              <section className="relative overflow-hidden rounded-[28px] border border-forest/20 bg-forest text-cream">
                <div className="paper-grid absolute inset-0 opacity-[0.06]" aria-hidden="true" />
                <div className="relative grid gap-5 p-5 sm:p-6 md:grid-cols-[1fr_220px] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-cream/70">
                        <Sparkles size={9} aria-hidden="true" />
                        {hasStarted ? "Saved draft" : "Sample draft"}
                      </span>
                      <span className="text-[9px] text-cream/45">Not booked · no payment</span>
                    </div>
                    <h2 className="mt-3 font-display text-[30px] leading-[1.02] tracking-[-0.03em]">
                      {firstDestination?.shortName ?? "Your route"} & beyond
                    </h2>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-cream/60">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={10} aria-hidden="true" />
                        {formatDateRange(trip.startDate, trip.days)}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersRound size={10} aria-hidden="true" />
                        {travellersLabel(trip.adults, trip.seniors, trip.children)}
                      </span>
                    </p>
                    <div className="mt-3">
                      <CareTags trip={trip} limit={3} light />
                    </div>
                    <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.13em] text-cream/40">
                          Current estimate
                        </p>
                        <p className="mt-1 font-display text-[27px] leading-none">
                          {formatINR(quote.totalPaise)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={onViewItinerary}
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-cream/20 bg-cream/10 px-3.5 text-[10px] font-semibold text-cream transition hover:bg-cream/15"
                        >
                          View itinerary
                        </button>
                        <button
                          type="button"
                          onClick={onContinuePlanning}
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-cream px-3.5 text-[10px] font-semibold text-forest transition hover:bg-white"
                        >
                          Continue planning <ArrowRight size={12} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-1.5">
                    <RouteMap trip={trip} compact />
                  </div>
                </div>
              </section>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="flex w-fit gap-1 rounded-full border border-sand bg-paper p-1"
                role="tablist"
                aria-label="Booking history"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "upcoming"}
                  onClick={() => setTab("upcoming")}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[10px] font-semibold transition",
                    tab === "upcoming"
                      ? "bg-forest text-cream"
                      : "text-forest-soft hover:bg-cream",
                  )}
                >
                  Upcoming · {upcoming.length}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "past"}
                  onClick={() => setTab("past")}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[10px] font-semibold transition",
                    tab === "past"
                      ? "bg-forest text-cream"
                      : "text-forest-soft hover:bg-cream",
                  )}
                >
                  Past · {past.length}
                </button>
              </div>
              <p className="flex items-center gap-1.5 text-[9px] text-muted">
                <ShieldCheck size={11} aria-hidden="true" />
                Bookings and statuses are prototype data
              </p>
            </div>

            {list.length > 0 ? (
              <div className="space-y-4">
                {list.map((booking) => (
                  <BookingCard
                    key={booking.reference}
                    booking={booking}
                    onOpen={() => onOpenBooking(booking.reference)}
                    onHelp={() =>
                      onToast(
                        "This is a prototype. In the live app, your coordinator would be paged now.",
                      )
                    }
                  />
                ))}
              </div>
            ) : tab === "upcoming" ? (
              <EmptyState
                icon={<Luggage size={24} aria-hidden="true" />}
                title="No confirmed yatras yet"
                copy="Your draft above is ready whenever you are. Complete checkout and the booking will appear here with honest vendor statuses."
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    <button type="button" onClick={onContinuePlanning} className="button-primary">
                      Continue your draft
                    </button>
                    <button type="button" onClick={onExplore} className="button-secondary">
                      Explore circuits
                    </button>
                  </div>
                }
              />
            ) : (
              <EmptyState
                icon={<Compass size={24} aria-hidden="true" />}
                title="No journeys behind you yet"
                copy="Completed yatras, receipts and the itinerary you travelled will live here."
                action={
                  <button type="button" onClick={onExplore} className="button-secondary">
                    Find your next yatra
                  </button>
                }
              />
            )}

            {list.length > 0 && (
              <div className="flex flex-col gap-3 rounded-[22px] border border-sand bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage text-forest">
                    <Route size={15} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-forest">
                      Planning another journey?
                    </p>
                    <p className="mt-0.5 text-[10px] leading-4 text-muted">
                      Start fresh without losing this draft or your booked yatra.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onNewTrip}
                  className="button-secondary min-h-10 shrink-0 px-4 text-[11px]"
                >
                  Plan a new yatra
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-sand bg-paper p-4">
              <div className="flex items-center justify-between gap-2">
                <Eyebrow>Care on file</Eyebrow>
                <Tag tone="sage">Remembered</Tag>
              </div>
              <div className="mt-3">
                <CareTags trip={careTrip} />
              </div>
              <p className="mt-2.5 text-[10px] leading-5 text-muted">
                {careTrip.seniors > 0
                  ? `${careTrip.seniors} senior travellers are on this plan. Rest stops, step-free stays and vegetarian meals are kept together, not re-asked at every step.`
                  : "Care requests stay attached to the booking and are shared with every partner."}
              </p>
              <Divider className="my-3" />
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted">Emergency contact</span>
                <span className="font-semibold text-forest">Vikram Rao</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px]">
                <span className="text-muted">Coordinator</span>
                <span className="font-semibold text-forest">Meera R.</span>
              </div>
              <p className="mt-2 text-[9px] leading-4 text-muted">
                Care details are illustrative in this prototype.
              </p>
            </div>

            <div className="rounded-[24px] border border-forest/15 bg-sage/60 p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-saffron">
                <Headphones size={16} aria-hidden="true" />
              </span>
              <p className="mt-3 text-[11px] font-semibold text-forest">A person, not a bot.</p>
              <p className="mt-1 text-[10px] leading-5 text-forest-soft/80">
                Yatra coordinators answer 7 AM–10 PM IST, and trip support stays open 24 hours from
                departure. No phone trees.
              </p>
              <button
                type="button"
                onClick={() =>
                  onToast("Prototype only — the support line is not connected in this build.")
                }
                className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-forest/20 bg-paper/70 px-3 text-[10px] font-semibold text-forest transition hover:bg-white"
              >
                <MessageCircle size={12} aria-hidden="true" /> Contact support
              </button>
            </div>

            <div className="rounded-[24px] border border-sand bg-paper p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                What happens after booking
              </p>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Stay and vehicle confirmed by partners",
                  "Wheelchair attendant assigned",
                  "Darshan queue reconfirmed daily",
                  "Balance paid 7 days before",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[10px] leading-4 text-forest-soft"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sage text-forest">
                      <Check size={9} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
