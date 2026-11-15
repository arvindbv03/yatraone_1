"use client";

import { Image } from "@/components/image";
import { useMemo, useState } from "react";
import {
  Accessibility,
  ArrowRight,
  BedDouble,
  CalendarDays,
  CarFront,
  Check,
  Clock3,
  Compass,
  CreditCard,
  Download,
  FileText,
  Headphones,
  Info,
  Landmark,
  MessageCircle,
  Phone,
  Printer,
  ReceiptText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { getDestination, getHotel, getVehicle } from "@/lib/data";
import {
  addDays,
  cn,
  dateFromString,
  formatDate,
  formatDateRange,
  formatINR,
  travellersLabel,
} from "@/lib/format";
import { buildItinerary, routeLabel } from "@/lib/itinerary";
import type { Booking, VendorStatus } from "@/lib/types";
import { BackButton, Divider, Eyebrow, PriceLine, Tag } from "@/components/ui";
import { CareTags, DayTabs, DayTimeline } from "@/components/itinerary-view";
import { RouteMap } from "@/components/route-map";

const VENDOR_ICONS: Record<VendorStatus["id"], typeof BedDouble> = {
  stay: BedDouble,
  vehicle: CarFront,
  wheelchair: Accessibility,
  guide: Compass,
  darshan: Landmark,
};

const STATUS_LABEL: Record<
  VendorStatus["state"],
  { label: string; className: string }
> = {
  confirmed: { label: "Confirmed", className: "bg-sage text-forest-soft" },
  requested: { label: "Requested", className: "bg-[#f7e7d5] text-saffron-deep" },
  pending: { label: "In progress", className: "bg-mist text-muted" },
  subject_to_temple: { label: "Subject to temple", className: "bg-mist text-muted" },
  not_selected: { label: "Not added", className: "bg-mist text-muted" },
};

const TABS = [
  { id: "overview" as const, label: "Overview" },
  { id: "itinerary" as const, label: "Day by day" },
  { id: "payments" as const, label: "Payments" },
];

export function TripDetailScreen({
  booking,
  onBack,
  onToast,
}: {
  booking: Booking;
  onBack: () => void;
  onToast: (message: string) => void;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("overview");
  const itinerary = useMemo(() => buildItinerary(booking.trip), [booking.trip]);
  const [activeDay, setActiveDay] = useState(itinerary.days[0]?.day ?? 1);
  const hotel = getHotel(booking.hotelId);
  const vehicle = getVehicle(booking.vehicleId);
  const first = getDestination(booking.trip.destinations[0]);
  const day = itinerary.days.find((entry) => entry.day === activeDay) ?? itinerary.days[0];
  const openRequests = booking.vendorStatuses.filter(
    (vendor) => vendor.state === "requested" || vendor.state === "pending",
  ).length;
  const dueDate = formatDate(dateFromString(addDays(booking.trip.startDate, -7)));
  const bookedAt = formatDate(new Date(booking.bookedAt), {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const title =
    itinerary.destinations.length > 2
      ? `${itinerary.destinations[0].shortName} & the sacred circuit`
      : itinerary.destinations.map((destination) => destination.shortName).join(" & ");

  return (
    <div className="pb-24 md:pb-14">
      <div className="container-page pt-6">
        <BackButton onClick={onBack} label="Back to My Yatra" />

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Eyebrow>{booking.reference}</Eyebrow>
              <Tag tone="saffron">
                <Clock3 size={10} aria-hidden="true" />
                {openRequests > 0 ? `${openRequests} partner requests open` : "All partners confirmed"}
              </Tag>
            </div>
            <h1 className="mt-3 font-display text-[40px] leading-[0.98] tracking-[-0.04em] text-forest sm:text-[50px]">
              {title}
            </h1>
            <p className="mt-2 text-[11px] leading-5 text-forest-soft">
              {routeLabel(booking.trip)} · {formatDateRange(booking.trip.startDate, booking.trip.days)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onToast("Prototype only — support is not connected in this build.")}
              className="button-secondary min-h-10 px-4 text-[11px]"
            >
              <Headphones size={14} aria-hidden="true" /> Get help
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="button-primary min-h-10 px-4 text-[11px]"
            >
              <Printer size={14} aria-hidden="true" /> Print
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-sand bg-sand/70 sm:grid-cols-4">
          {[
            {
              icon: CalendarDays,
              label: "Dates",
              value: formatDateRange(booking.trip.startDate, booking.trip.days),
            },
            {
              icon: UsersRound,
              label: "Travellers",
              value: travellersLabel(
                booking.trip.adults,
                booking.trip.seniors,
                booking.trip.children,
              ),
            },
            {
              icon: CreditCard,
              label: "Paid",
              value: formatINR(booking.paidPaise),
            },
            {
              icon: ReceiptText,
              label: "Balance",
              value: formatINR(booking.quote.balancePaise),
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-paper px-4 py-3.5">
                <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-muted">
                  <Icon size={11} aria-hidden="true" />
                  {item.label}
                </p>
                <p className="mt-1.5 text-[11px] font-semibold leading-4 text-forest">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto rounded-full border border-sand bg-paper p-1 md:w-fit">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              aria-pressed={tab === entry.id}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[10px] font-semibold transition",
                tab === entry.id
                  ? "bg-forest text-cream"
                  : "text-forest-soft hover:bg-cream",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="print-only mt-6">
          <p className="font-display text-2xl">YatraOne · {booking.reference}</p>
          <p className="text-xs">
            {routeLabel(booking.trip)} · {formatDateRange(booking.trip.startDate, booking.trip.days)}
          </p>
          <p className="text-xs">
            {travellersLabel(booking.trip.adults, booking.trip.seniors, booking.trip.children)} ·{" "}
            {booking.trip.days} days · {booking.trip.pace} pace
          </p>
        </div>

        {tab === "overview" && (
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_336px] lg:items-start">
            <div className="space-y-4">
              <section className="overflow-hidden rounded-[26px] border border-sand bg-paper">
                <div className="relative h-52 sm:h-64">
                  <Image
                    src={first?.image ?? "/images/tirupati-alt.jpg"}
                    alt={first?.imageAlt ?? "Temple on your yatra route"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                  />
                  <div className="hero-gradient absolute inset-0" />
                  <div className="absolute inset-x-5 bottom-4 text-white sm:inset-x-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">
                      {booking.trip.origin} · {booking.trip.destinations.length} stops
                    </p>
                    <p className="mt-1 font-display text-[26px] leading-tight">
                      {formatDateRange(booking.trip.startDate, booking.trip.days)}
                    </p>
                    <div className="mt-2">
                      <CareTags trip={booking.trip} light limit={4} />
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
                  {[
                    {
                      label: "Stay",
                      value: hotel.name,
                      detail: `${booking.quote.rooms} rooms · ${booking.quote.nights} nights`,
                    },
                    {
                      label: "Transport",
                      value: vehicle.name,
                      detail: vehicle.accessible ? "Accessible van · ramp" : "Private chauffeur",
                    },
                    {
                      label: "Lead traveller",
                      value: booking.traveller.name,
                      detail: booking.traveller.phone,
                    },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-ivory/80 p-3">
                      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted">
                        {item.label}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-forest">{item.value}</p>
                      <p className="mt-0.5 text-[9px] text-muted">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-sand bg-paper p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                      Partner status
                    </p>
                    <h2 className="mt-1 font-display text-[23px] tracking-[-0.025em] text-forest">
                      What is confirmed today
                    </h2>
                  </div>
                  <span className="text-[9px] text-muted">Last checked just now</span>
                </div>
                <div className="mt-3 space-y-2">
                  {booking.vendorStatuses.map((vendor) => {
                    const Icon = VENDOR_ICONS[vendor.id];
                    const meta = STATUS_LABEL[vendor.state];
                    return (
                      <div
                        key={vendor.id}
                        className="flex items-start gap-2.5 rounded-xl border border-sand/70 bg-cream/40 p-3"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-forest-soft">
                          <Icon size={13} aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <p className="text-[10px] font-semibold text-forest">{vendor.label}</p>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.07em]",
                                meta.className,
                              )}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[9px] leading-4 text-muted">{vendor.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 flex items-start gap-1.5 text-[9px] leading-4 text-muted">
                  <Info size={11} className="mt-0.5 shrink-0" aria-hidden="true" />
                  A paid advance does not mean every vendor has confirmed. This list is the honest
                  version.
                </p>
              </section>

              <section className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-sand bg-paper p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                      Your stay
                    </p>
                    <BedDouble size={14} className="text-forest-soft/50" aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-[12px] font-semibold text-forest">{hotel.name}</p>
                  <p className="mt-1 text-[9px] leading-4 text-muted">
                    {hotel.roomType} · {booking.quote.nights} nights ·{" "}
                    {hotel.breakfast ? "breakfast included" : "breakfast not included"}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hotel.accessibility.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-sage px-2 py-1 text-[8px] text-forest-soft"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-[9px] leading-4 text-muted">{hotel.cancellation}</p>
                </div>

                <div className="rounded-[22px] border border-sand bg-paper p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                      Your transport
                    </p>
                    <CarFront size={14} className="text-forest-soft/50" aria-hidden="true" />
                  </div>
                  <p className="mt-2 text-[12px] font-semibold text-forest">{vehicle.name}</p>
                  <p className="mt-1 text-[9px] leading-4 text-muted">
                    {vehicle.capacity} · {vehicle.luggage}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {vehicle.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-sage px-2 py-1 text-[8px] text-forest-soft"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-[9px] leading-4 text-muted">{vehicle.note}</p>
                </div>
              </section>

              <section className="rounded-[24px] border border-sand bg-paper p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                    Traveller & pickup details
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onToast("In the live app, this would open an edit request for your coordinator.")
                    }
                    className="text-[9px] font-semibold text-forest underline decoration-forest/20 underline-offset-4"
                  >
                    Request a change
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.1em] text-muted">Lead traveller</p>
                    <p className="mt-1 text-[10px] font-semibold text-forest">{booking.traveller.name}</p>
                    <p className="text-[9px] text-muted">
                      {booking.traveller.phone} · {booking.traveller.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.1em] text-muted">Pickup</p>
                    <p className="mt-1 text-[10px] leading-4 text-forest-soft">
                      {booking.traveller.pickupAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.1em] text-muted">
                      Emergency contact
                    </p>
                    <p className="mt-1 text-[10px] text-forest-soft">
                      {booking.traveller.emergencyContact}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.1em] text-muted">
                      Notes for the coordinator
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-forest-soft">
                      {booking.traveller.notes || "None added."}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <div className="overflow-hidden rounded-[24px] border border-sand bg-paper p-2.5">
                <RouteMap trip={booking.trip} />
              </div>

              <div className="rounded-[24px] border border-forest/15 bg-sage/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-soft">
                    Care on this yatra
                  </p>
                  <Accessibility size={14} className="text-forest-soft/60" aria-hidden="true" />
                </div>
                <CareTags trip={booking.trip} className="mt-2.5" />
                <p className="mt-2.5 text-[10px] leading-5 text-forest-soft/80">
                  Shared with the stay, driver, guide and wheelchair partner. Any unavoidable
                  steps are flagged before each temple visit.
                </p>
              </div>

              <div className="rounded-[24px] border border-sand bg-paper p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-[10px] font-bold text-cream">
                    MR
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-forest">Meera Raghavan</p>
                    <p className="text-[9px] text-muted">Your Yatra coordinator</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onToast("Demo only — no call placed.")}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-sand bg-cream text-[10px] font-semibold text-forest transition hover:bg-white"
                  >
                    <Phone size={11} aria-hidden="true" /> Call
                  </button>
                  <button
                    type="button"
                    onClick={() => onToast("Demo only — no message sent.")}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-sand bg-cream text-[10px] font-semibold text-forest transition hover:bg-white"
                  >
                    <MessageCircle size={11} aria-hidden="true" /> Message
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-sand bg-paper p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                  Tickets & documents
                </p>
                <div className="mt-2 space-y-1.5">
                  {[
                    { icon: FileText, label: "Care plan", action: "View" },
                    { icon: ReceiptText, label: "Booking receipt", action: "Print" },
                    { icon: Download, label: "GST invoice", action: "Demo" },
                  ].map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <button
                        key={doc.label}
                        type="button"
                        onClick={() => {
                          if (doc.action === "Print") window.print();
                          else onToast(`${doc.label} is illustrative in this prototype.`);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-1.5 py-2 text-left transition hover:bg-cream"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist text-forest-soft">
                          <Icon size={12} aria-hidden="true" />
                        </span>
                        <span className="flex-1 text-[10px] text-forest-soft">{doc.label}</span>
                        <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-muted">
                          {doc.action}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[24px] border border-sand bg-paper p-4">
                <div className="flex items-center justify-between gap-2">
                  <Eyebrow>Payment</Eyebrow>
                  <Tag tone="sage">Advance paid</Tag>
                </div>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.1em] text-muted">Paid now</p>
                    <p className="mt-1 font-display text-[24px] leading-none text-forest">
                      {formatINR(booking.paidPaise)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-muted">
                      Balance by {dueDate}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-forest">
                      {formatINR(booking.quote.balancePaise)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("payments")}
                  className="mt-3 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full border border-sand bg-cream text-[10px] font-semibold text-forest transition hover:bg-white"
                >
                  View payment details <ArrowRight size={11} aria-hidden="true" />
                </button>
              </div>
            </aside>
          </div>
        )}

        {tab === "itinerary" && day && (
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
            <div className="space-y-4">
              <div className="rounded-[20px] border border-sand bg-paper p-2">
                <DayTabs days={itinerary.days} activeDay={day.day} onChange={setActiveDay} />
              </div>
              <DayTimeline day={day} />
            </div>
            <aside className="space-y-4">
              <div className="rounded-[24px] border border-sand bg-paper p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                  Print & share
                </p>
                <p className="mt-1.5 text-[10px] leading-5 text-muted">
                  Print the full itinerary to carry with you, or share it with family who are not
                  travelling.
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="button-primary w-full text-[11px]"
                  >
                    <Printer size={14} aria-hidden="true" /> Print itinerary
                  </button>
                  <button
                    type="button"
                    onClick={() => onToast("Sharing is not connected in this prototype.")}
                    className="button-secondary w-full text-[11px]"
                  >
                    <MessageCircle size={14} aria-hidden="true" /> Share with family
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#e8d3c2] bg-[#fbf4ec] p-4">
                <div className="flex items-center gap-2">
                  <Landmark size={14} className="text-saffron-deep" aria-hidden="true" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-saffron-deep">
                    Darshan note
                  </p>
                </div>
                <p className="mt-2 text-[10px] leading-5 text-forest-soft">
                  Darshan timing is reconfirmed with the temple on the morning of the visit. It is
                  not a guaranteed slot, and queue times can move.
                </p>
              </div>

              <div className="rounded-[24px] border border-forest/15 bg-sage/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-forest-soft">
                  Care reminders
                </p>
                <CareTags trip={booking.trip} className="mt-2.5" />
                <p className="mt-2.5 text-[10px] leading-5 text-forest-soft/80">
                  Rest windows are planned every 90 minutes on the road. Tell your coordinator if
                  the pace needs to change on the day.
                </p>
              </div>
            </aside>
          </div>
        )}

        {tab === "payments" && (
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_336px] lg:items-start">
            <div className="space-y-4">
              <section className="rounded-[24px] border border-sand bg-paper p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                      Payment receipt
                    </p>
                    <h2 className="mt-1 font-display text-[24px] tracking-[-0.025em] text-forest">
                      {booking.reference}
                    </h2>
                    <p className="mt-1 text-[9px] text-muted">
                      Paid {bookedAt} · {booking.paymentMethod} · prototype transaction
                    </p>
                  </div>
                  <Tag tone="sage">
                    <Check size={9} aria-hidden="true" /> Advance paid
                  </Tag>
                </div>

                <div className="mt-4 rounded-2xl bg-ivory/80 p-4">
                  <div className="space-y-2">
                    <PriceLine label="Stay" value={formatINR(booking.quote.hotelPaise)} muted />
                    <PriceLine
                      label="Transport"
                      value={formatINR(booking.quote.transportPaise)}
                      muted
                    />
                    <PriceLine
                      label="Extras"
                      value={formatINR(booking.quote.addOnsPaise)}
                      muted
                    />
                    <PriceLine
                      label="Platform fee"
                      value={formatINR(booking.quote.platformFeePaise)}
                      muted
                    />
                    <PriceLine label="GST (5%)" value={formatINR(booking.quote.gstPaise)} muted />
                    <Divider className="my-1" />
                    <PriceLine label="Total" value={formatINR(booking.quote.totalPaise)} strong />
                    <PriceLine
                      label="Advance paid"
                      value={formatINR(booking.paidPaise)}
                      strong
                    />
                    <PriceLine
                      label="Balance due"
                      value={`${formatINR(booking.quote.balancePaise)} by ${dueDate}`}
                      muted
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="button-secondary mt-3 text-[11px]"
                >
                  <Printer size={14} aria-hidden="true" /> Print receipt
                </button>
                <p className="mt-2 text-[8px] leading-3 text-muted">
                  Prototype receipt · no money moved · not a tax invoice
                </p>
              </section>

              <section className="rounded-[24px] border border-sand bg-paper p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Payment schedule
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2.5 rounded-xl border border-forest/15 bg-sage/50 p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-forest text-cream">
                      <Check size={12} aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="text-[10px] font-semibold text-forest">Advance · 25%</p>
                        <p className="text-[10px] font-semibold text-forest">
                          {formatINR(booking.paidPaise)}
                        </p>
                      </div>
                      <p className="mt-0.5 text-[9px] text-muted">
                        Paid {bookedAt} · {booking.paymentMethod} · simulated
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-xl border border-sand bg-cream/50 p-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-forest-soft">
                      <Clock3 size={12} aria-hidden="true" />
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <p className="text-[10px] font-semibold text-forest">Balance · 75%</p>
                        <p className="text-[10px] font-semibold text-forest">
                          {formatINR(booking.quote.balancePaise)}
                        </p>
                      </div>
                      <p className="mt-0.5 text-[9px] text-muted">
                        Due {dueDate}, 7 days before departure
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[24px] border border-sand bg-paper p-4">
                <div className="flex items-center justify-between gap-2">
                  <Eyebrow>Balance</Eyebrow>
                  <ReceiptText size={14} className="text-forest-soft/50" aria-hidden="true" />
                </div>
                <p className="mt-3 font-display text-[30px] leading-none text-forest">
                  {formatINR(booking.quote.balancePaise)}
                </p>
                <p className="mt-1.5 text-[9px] leading-4 text-muted">
                  Due by {dueDate}. We send a reminder seven days before, and a coordinator calls
                  if you prefer.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onToast("Prototype only — balance payment is not connected in this build.")
                  }
                  className="button-primary mt-3 w-full text-[11px]"
                >
                  Pay balance · demo
                </button>
                <p className="mt-2 text-center text-[8px] text-muted">
                  No payment is taken in this prototype.
                </p>
              </div>

              <div className="rounded-[24px] border border-sand bg-paper p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                  Refunds & changes
                </p>
                <p className="mt-2 text-[10px] leading-5 text-forest-soft">
                  {hotel.cancellation}. If a partner cannot confirm, the advance is refundable.
                  Changes are handled by your coordinator, not a hidden fee.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onToast("Prototype only — cancellation requests are not connected.")
                  }
                  className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-sand bg-cream px-3 text-[10px] font-semibold text-forest transition hover:bg-white"
                >
                  Request a change
                </button>
              </div>

              <div className="rounded-[24px] border border-forest/15 bg-sage/60 p-4">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={14} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
                  <p className="text-[10px] leading-5 text-forest-soft">
                    Your advance is held against this booking. It is not a vendor confirmation by
                    itself. Check the partner status above for what is actually locked in.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
