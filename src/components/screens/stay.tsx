"use client";

import { Image } from "@/components/image";
import { useState } from "react";
import {
  Accessibility,
  ArrowRight,
  BedDouble,
  Check,
  ChevronRight,
  Coffee,
  Info,
  MapPin,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { HOTELS, getHotel } from "@/lib/data";
import { cn, formatINR } from "@/lib/format";
import { calculateQuote, roomCount, travellerCount } from "@/lib/pricing";
import type { Hotel, TripConfig } from "@/lib/types";
import { BackButton, Divider, Eyebrow, PriceLine, Sheet, Stars, Tag } from "@/components/ui";
import { CareTags } from "@/components/itinerary-view";

function accessGaps(hotel: Hotel, trip: TripConfig) {
  const missing: string[] = [];
  const wantsWheelchair = trip.accessibility.includes("wheelchair");
  const wantsStepFree = trip.accessibility.includes("step-free");

  if (wantsWheelchair) {
    if (!hotel.accessibility.some((item) => /roll-in shower/i.test(item))) {
      missing.push("A roll-in shower");
    }
    if (!hotel.accessibility.some((item) => /wheelchair (on request|available)/i.test(item))) {
      missing.push("A wheelchair on request");
    }
  }

  if (wantsStepFree) {
    if (hotel.accessibility.some((item) => /steps at entrance/i.test(item))) {
      missing.push("A step-free entrance");
    }
    if (
      hotel.accessibility.some((item) => /no lift/i.test(item)) &&
      !hotel.accessibility.some((item) => /ground-floor/i.test(item))
    ) {
      missing.push("Lift access or a ground-floor room");
    }
  }

  return missing;
}

export function StayScreen({
  trip,
  onTripChange,
  onBack,
  onContinue,
  onEditCare,
}: {
  trip: TripConfig;
  onTripChange: (trip: TripConfig) => void;
  onBack: () => void;
  onContinue: () => void;
  onEditCare: () => void;
}) {
  const quote = calculateQuote(trip);
  const hotel = getHotel(trip.hotelId);
  const rooms = roomCount(trip);
  const nights = Math.max(0, trip.days - 1);
  const travellers = travellerCount(trip);
  const [detail, setDetail] = useState<Hotel | null>(null);
  const [blockedOpen, setBlockedOpen] = useState(false);
  const selectedGaps = accessGaps(hotel, trip);
  const careNeeded =
    trip.accessibility.includes("wheelchair") || trip.accessibility.includes("step-free");
  const isPilotRegion = trip.destinations.includes("tirupati");

  const totalFor = (entry: Hotel) => entry.pricePerNightPaise * rooms * nights;

  const choose = (entry: Hotel) => {
    onTripChange({ ...trip, hotelId: entry.id });
    setDetail(null);
  };

  const handleContinue = () => {
    if (selectedGaps.length > 0) {
      setBlockedOpen(true);
      return;
    }
    onContinue();
  };

  return (
    <div className="pb-32 md:pb-14">
      <div className="container-page pt-6">
        <BackButton onClick={onBack} label="Back to itinerary" />
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>02 · Where you stay</Eyebrow>
            <h1 className="mt-3 font-display text-[40px] leading-[0.98] tracking-[-0.04em] text-forest sm:text-[50px]">
              A proper place to
              <span className="ml-2 italic text-saffron-deep">come back to.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-forest-soft">
              {rooms} rooms for {travellers} travellers, close to the temple and chosen for
              quiet nights. Access requests are checked against every stay.
            </p>
          </div>
          <Tag tone="sage">
            <BedDouble size={12} aria-hidden="true" />
            {nights} nights · {rooms} rooms
          </Tag>
        </div>

        {!isPilotRegion && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-sand bg-cream px-3.5 py-3 text-[10px] leading-5 text-muted">
            <Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
            Stay inventory is currently curated for the Tirupati pilot. For this route preview,
            the options below are illustrative and should be read as a prototype, not live
            availability.
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-4">
            {careNeeded && (
              <div className="flex items-start gap-2.5 rounded-[18px] border border-forest/15 bg-sage/60 px-4 py-3.5">
                <Accessibility size={16} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-semibold text-forest">
                    Access filter is on for this yatra.
                  </p>
                  <p className="mt-0.5 text-[10px] leading-5 text-forest-soft/80">
                    A stay must meet your wheelchair and step-free requests before we can continue.
                    If none does, we will say so instead of quietly swapping the service.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                {HOTELS.length} stays in the pilot network
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-muted">
                <ShieldCheck size={12} aria-hidden="true" />
                Prices include taxes · pay only after confirmation
              </div>
            </div>

            {HOTELS.map((entry) => {
              const selected = entry.id === trip.hotelId;
              const gaps = accessGaps(entry, trip);
              const fits = gaps.length === 0;
              const delta = totalFor(entry) - quote.hotelPaise;

              return (
                <article
                  key={entry.id}
                  className={cn(
                    "overflow-hidden rounded-[24px] border bg-paper transition",
                    selected
                      ? "border-forest/40 shadow-[0_18px_40px_-32px_rgba(20,56,47,0.5)]"
                      : "border-sand hover:border-forest/20",
                  )}
                >
                  <div className="grid sm:grid-cols-[210px_1fr]">
                    <div className="relative h-48 sm:h-full sm:min-h-[230px]">
                      <Image
                        src={entry.image}
                        alt={entry.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 210px"
                        className="object-cover"
                      />
                      {entry.recommendation && (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-cream/90 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-forest backdrop-blur">
                          {entry.recommendation}
                        </span>
                      )}
                      {selected && (
                        <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-forest text-cream shadow-sm">
                          <Check size={14} aria-hidden="true" />
                        </span>
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                            {entry.category}
                          </p>
                          <h2 className="mt-1 font-display text-[25px] leading-tight tracking-[-0.025em] text-forest">
                            {entry.name}
                          </h2>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <Stars rating={entry.rating} reviews={entry.reviews} />
                            <span className="flex items-center gap-1 text-[10px] text-muted">
                              <MapPin size={10} aria-hidden="true" />
                              {entry.distance}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onTripChange({ ...trip, hotelId: entry.id })}
                          aria-pressed={selected}
                          aria-label={`Choose ${entry.name}`}
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                            selected
                              ? "border-forest bg-forest text-cream"
                              : "border-sand-deep bg-cream text-transparent hover:border-forest/40",
                          )}
                        >
                          <Check size={14} aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {entry.highlights.map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-medium text-forest-soft"
                          >
                            {highlight}
                          </span>
                        ))}
                        {entry.breakfast && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sage px-2.5 py-1 text-[9px] font-medium text-forest-soft">
                            <Coffee size={9} aria-hidden="true" />
                            Breakfast
                          </span>
                        )}
                      </div>

                      <div className="mt-3.5 space-y-1.5">
                        {entry.accessibility.slice(0, 3).map((feature) => (
                          <p
                            key={feature}
                            className="flex items-start gap-1.5 text-[10px] leading-4 text-forest-soft"
                          >
                            <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-sage text-forest">
                              <Check size={8} aria-hidden="true" />
                            </span>
                            {feature}
                          </p>
                        ))}
                      </div>

                      {careNeeded && !fits && (
                        <div className="mt-3 rounded-xl border border-saffron/25 bg-[#fbf3e7] px-3 py-2.5">
                          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-saffron-deep">
                            <X size={11} aria-hidden="true" />
                            Does not meet your access request
                          </p>
                          <p className="mt-1 text-[9px] leading-4 text-saffron-deep/80">
                            Missing: {gaps.join(", ")}. You can still view this stay, but we
                            cannot continue with it while the request is active.
                          </p>
                        </div>
                      )}

                      {careNeeded && fits && (
                        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sage px-2.5 py-1 text-[9px] font-semibold text-forest">
                          <Accessibility size={10} aria-hidden="true" />
                          Meets your access needs
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-sand/70 pt-3">
                        <div>
                          <p className="text-[15px] font-bold text-forest">
                            {formatINR(totalFor(entry))}
                            <span className="ml-1 text-[9px] font-normal text-muted">
                              total · {nights} nights
                            </span>
                          </p>
                          <p className="mt-0.5 text-[9px] text-muted">
                            {formatINR(entry.pricePerNightPaise)} / room / night
                            {delta !== 0 && (
                              <>
                                {" · "}
                                <span
                                  className={cn(
                                    "font-semibold",
                                    delta > 0 ? "text-saffron-deep" : "text-forest-soft",
                                  )}
                                >
                                  {formatINR(Math.abs(delta))} {delta > 0 ? "more" : "less"} than
                                  current
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDetail(entry)}
                          className="inline-flex min-h-9 items-center gap-1 rounded-full border border-sand bg-cream px-3 text-[10px] font-semibold text-forest transition hover:border-forest/30 hover:bg-white"
                        >
                          View details <ChevronRight size={12} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-sand bg-paper p-4 soft-shadow lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-2">
                <Eyebrow>Your stay</Eyebrow>
                <Tag tone="sage">Selected</Tag>
              </div>
              <div className="mt-3 overflow-hidden rounded-2xl border border-sand/70">
                <div className="relative h-32">
                  <Image
                    src={hotel.image}
                    alt={hotel.imageAlt}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  <div className="photo-tint absolute inset-0" />
                  <div className="absolute inset-x-3 bottom-2.5">
                    <p className="font-display text-[19px] leading-tight text-white">{hotel.name}</p>
                    <p className="mt-0.5 text-[9px] text-white/70">{hotel.category}</p>
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted">Rooms</span>
                    <span className="font-semibold text-forest">
                      {rooms} × {hotel.roomType.split("·")[0].trim()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted">Nights</span>
                    <span className="font-semibold text-forest">{nights}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted">Breakfast</span>
                    <span className="font-semibold text-forest">
                      {hotel.breakfast ? "Included" : "Not included"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <CareTags trip={trip} limit={3} />
              </div>

              {selectedGaps.length > 0 && (
                <div className="mt-3 rounded-xl border border-saffron/30 bg-[#fbf3e7] px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-saffron-deep">
                    This stay misses {selectedGaps.length} of your access needs.
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-saffron-deep/80">
                    Choose a matching stay, or revise your care needs before continuing.
                  </p>
                </div>
              )}

              <Divider className="my-3" />
              <PriceLine
                label={`${formatINR(hotel.pricePerNightPaise)} × ${rooms} rooms × ${nights} nights`}
                value={formatINR(quote.hotelPaise)}
                muted
              />
              <div className="mt-2 flex items-end justify-between gap-3">
                <span className="text-[11px] font-semibold text-forest-soft">Stay total</span>
                <span className="font-display text-[25px] leading-none text-forest">
                  {formatINR(quote.hotelPaise)}
                </span>
              </div>

              <button type="button" onClick={handleContinue} className="button-primary mt-4 w-full">
                Continue to transport <ArrowRight size={15} aria-hidden="true" />
              </button>
              <p className="mt-2 text-center text-[9px] leading-4 text-muted">
                Room availability is checked before payment.
              </p>
              <p className="mt-2 flex items-start gap-1.5 text-[9px] leading-4 text-muted">
                <ShieldCheck size={11} className="mt-0.5 shrink-0" aria-hidden="true" />
                {hotel.cancellation}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-cream/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Stay</p>
            <p className="text-[15px] font-bold text-forest">{formatINR(quote.hotelPaise)}</p>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="button-primary flex-1 px-3 text-[12px]"
          >
            Continue <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Sheet
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.name ?? "Stay details"}
        footer={
          detail && (
            <button
              type="button"
              onClick={() => choose(detail)}
              className="button-primary w-full"
            >
              {detail.id === trip.hotelId ? "Keep this stay" : "Choose this stay"}
              <Check size={15} aria-hidden="true" />
            </button>
          )
        }
      >
        {detail && (
          <div>
            <div className="relative h-48 overflow-hidden rounded-2xl">
              <Image
                src={detail.image}
                alt={detail.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, 480px"
                className="object-cover"
              />
              {detail.recommendation && (
                <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-forest backdrop-blur">
                  {detail.recommendation}
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Stars rating={detail.rating} reviews={detail.reviews} />
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <MapPin size={10} aria-hidden="true" /> {detail.distance}
              </span>
              <Tag tone="sage">
                <Coffee size={10} aria-hidden="true" />
                {detail.breakfast ? "Breakfast included" : "Breakfast not included"}
              </Tag>
            </div>

            <div className="mt-4 rounded-2xl bg-ivory p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                Why we like it
              </p>
              <p className="mt-1.5 text-[11px] leading-5 text-forest-soft">
                {detail.recommendation === "Best for senior travellers"
                  ? "The calmest choice for this group: level entry, lifts to every floor, roll-in showers and a vegetarian kitchen that understands early breakfasts."
                  : detail.recommendation === "A gentler price"
                    ? "A quieter, smaller stay with a step-free entrance and lift access to the first three floors. It suits travellers who do not need a roll-in shower."
                    : "The closest option to the temple and the simplest on price. The trade-off is access: steps at the entrance and no lift."}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-sand bg-cream/60 p-3">
                <p className="text-[9px] uppercase tracking-[0.12em] text-muted">Room plan</p>
                <p className="mt-1 text-[11px] font-semibold text-forest">{detail.roomType}</p>
              </div>
              <div className="rounded-xl border border-sand bg-cream/60 p-3">
                <p className="text-[9px] uppercase tracking-[0.12em] text-muted">For this yatra</p>
                <p className="mt-1 text-[11px] font-semibold text-forest">
                  {rooms} rooms · {nights} nights
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                Accessibility
              </p>
              <ul className="mt-2 space-y-2">
                {detail.accessibility.map((feature) => {
                  const positive = !/no lift|steps/i.test(feature);
                  return (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-[11px] leading-5 text-forest-soft"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          positive ? "bg-sage text-forest" : "bg-[#fbe7e1] text-[#8d3d25]",
                        )}
                      >
                        {positive ? (
                          <Check size={9} aria-hidden="true" />
                        ) : (
                          <X size={9} aria-hidden="true" />
                        )}
                      </span>
                      {feature}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                Good to know
              </p>
              <ul className="mt-2 space-y-1.5">
                {detail.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-center gap-2 text-[11px] text-forest-soft"
                  >
                    <Sparkles size={11} className="text-saffron-deep" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-[11px] text-forest-soft">
                  <UsersRound size={11} className="text-forest-soft" aria-hidden="true" />
                  Rooms are planned for up to three guests; extra beds on request.
                </li>
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-sand bg-cream p-3">
              <PriceLine label="Stay total for this yatra" value={formatINR(totalFor(detail))} strong />
              <p className="mt-1 text-[9px] leading-4 text-muted">
                {detail.cancellation}. Availability is reconfirmed before payment.
              </p>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet
        open={blockedOpen}
        onClose={() => setBlockedOpen(false)}
        title="A care request would not be met"
      >
        <div className="flex items-start gap-3 rounded-2xl border border-saffron/30 bg-[#fbf3e7] p-3.5">
          <Accessibility size={18} className="mt-0.5 shrink-0 text-saffron-deep" aria-hidden="true" />
          <div>
            <p className="text-[12px] font-semibold text-forest">
              {hotel.name} cannot meet every access request on this yatra.
            </p>
            <p className="mt-1 text-[10px] leading-5 text-saffron-deep/80">
              Missing: {selectedGaps.join(", ")}. We will not quietly remove these from your
              booking.
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              choose(getHotel("amara"));
              setBlockedOpen(false);
            }}
            className="button-primary w-full"
          >
            Choose the matching stay
          </button>
          <button
            type="button"
            onClick={() => {
              setBlockedOpen(false);
              onEditCare();
            }}
            className="button-secondary w-full"
          >
            Revise my care needs
          </button>
        </div>
        <p className="mt-3 text-[10px] leading-4 text-muted">
          Revising care needs is an explicit change to your request. We will confirm what the new
          plan can and cannot support before payment.
        </p>
      </Sheet>
    </div>
  );
}
