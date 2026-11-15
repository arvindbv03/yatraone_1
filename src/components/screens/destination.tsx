"use client";

import Image from "next/image";
import {
  Accessibility,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock3,
  Compass,
  Hotel,
  Info,
  MapPin,
  Navigation,
  Route,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import {
  CIRCUITS,
  CIRCUIT_FOR_DESTINATION,
  getDestination,
} from "@/lib/data";
import { formatINR, nightsLabel } from "@/lib/format";
import type { Circuit, Destination, TripConfig } from "@/lib/types";
import { BackButton, Eyebrow, Stars, Tag } from "@/components/ui";

export function DestinationScreen({
  destination,
  trip,
  onBack,
  onAddToTrip,
  onStartCircuit,
}: {
  destination: Destination;
  trip: TripConfig;
  onBack: () => void;
  onAddToTrip: () => void;
  onStartCircuit: (circuit: Circuit) => void;
}) {
  const circuit =
    CIRCUITS.find((entry) => entry.id === CIRCUIT_FOR_DESTINATION[destination.id]) ??
    CIRCUITS[0];
  const isInTrip = trip.destinations.includes(destination.id);

  return (
    <div className="pb-24 md:pb-10">
      <div className="container-page pt-4 md:pt-6">
        <BackButton onClick={onBack} label="Back to discovery" />
      </div>

      <section className="container-page mt-3">
        <div className="relative min-h-[400px] overflow-hidden rounded-[28px] bg-forest sm:min-h-[480px] lg:min-h-[540px]">
          <Image
            src={destination.image}
            alt={destination.imageAlt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="white" className="bg-white/15 text-white">
                <MapPin size={11} aria-hidden="true" />
                {destination.city}, {destination.state}
              </Tag>
              <Tag tone="white" className="bg-white/15 text-white">
                {destination.category}
              </Tag>
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
              <div>
                <h1 className="max-w-2xl font-display text-[44px] leading-[0.96] tracking-[-0.04em] sm:text-[60px]">
                  {destination.shortName}
                </h1>
                <p className="mt-2 max-w-xl font-display text-[21px] italic text-white/70 sm:text-[25px]">
                  {destination.tagline}
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-forest-deep/20 px-3.5 py-2.5 backdrop-blur">
                <Stars rating={destination.rating} />
                <span className="h-4 w-px bg-white/20" />
                <span className="text-[11px] text-white/70">
                  {destination.reviewCount.toLocaleString("en-IN")} visits
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page mt-6 grid gap-8 lg:grid-cols-[1fr_350px] lg:gap-10">
        <main>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { icon: Clock3, label: "Typical day", value: destination.timingsNote.split(".")[0] },
              { icon: CalendarDays, label: "Best time", value: destination.bestTime },
              { icon: Compass, label: "Ideal stay", value: destination.idealDuration },
              { icon: Sun, label: "Deity", value: destination.deity },
            ].map((fact) => {
              const Icon = fact.icon;
              return (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-sand bg-paper p-3.5"
                >
                  <Icon size={15} className="text-saffron-deep" aria-hidden="true" />
                  <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-[12px] font-semibold leading-5 text-forest">
                    {fact.value}
                  </p>
                </div>
              );
            })}
          </div>

          <section className="mt-9">
            <Eyebrow>The place</Eyebrow>
            <h2 className="mt-3 font-display text-[32px] leading-[1.08] tracking-[-0.03em] text-forest">
              Why pilgrims come here
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-forest-soft">{destination.summary}</p>
            <p className="mt-3 text-[14px] leading-7 text-forest-soft/85">
              {destination.significance}
            </p>
          </section>

          <section className="mt-8 rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage text-forest">
                <Accessibility size={19} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-forest">Access, without guesswork</h2>
                <p className="mt-1.5 text-[12px] leading-5 text-muted">
                  These notes are reviewed by our operations team. If a temple path has steps, we
                  say so before you plan around it.
                </p>
              </div>
            </div>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {destination.accessibility.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 rounded-xl bg-ivory/80 px-3 py-2.5 text-[12px] leading-5 text-forest-soft"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-saffron" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-saffron/20 bg-[#fdf3e7] px-3.5 py-3 text-[11px] leading-5 text-saffron-deep">
              <ShieldCheck size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              If you request wheelchair assistance, we keep that requirement in the booking. We do
              not silently swap it for a non-accessible option.
            </div>
          </section>

          <section className="mt-9">
            <Eyebrow>Before you go</Eyebrow>
            <h2 className="mt-2 font-display text-[28px] tracking-[-0.03em] text-forest">
              Practical notes
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-sand bg-paper p-5">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-forest">
                  <Clock3 size={15} aria-hidden="true" /> Timings
                </div>
                <p className="mt-3 text-[12px] leading-5 text-muted">{destination.timingsNote}</p>
                <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-5 text-saffron-deep">
                  <Info size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
                  Darshan slots change. We reconfirm before each visit.
                </p>
              </div>
              <div className="rounded-2xl border border-sand bg-paper p-5">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-forest">
                  <BadgeCheck size={15} aria-hidden="true" /> Facilities
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {destination.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="rounded-full bg-ivory px-2.5 py-1 text-[10px] font-medium text-forest-soft"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-9">
            <Eyebrow>Nearby</Eyebrow>
            <h2 className="mt-2 font-display text-[28px] tracking-[-0.03em] text-forest">
              Keep the day connected
            </h2>
            <div className="mt-4 divide-y divide-sand rounded-2xl border border-sand bg-paper">
              {destination.nearby.map((place) => (
                <div key={place.name} className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Navigation size={14} className="text-muted" aria-hidden="true" />
                    <span className="text-[12px] font-medium text-forest">{place.name}</span>
                  </div>
                  <span className="text-[11px] text-muted">{place.distance}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-9 overflow-hidden rounded-2xl bg-sage p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-cream">
                <Hotel size={18} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-forest">Stays checked for access</p>
                <p className="mt-0.5 text-[12px] text-forest-soft">
                  Step-free entrances, lifts and roll-in showers are verified before a stay appears.
                </p>
              </div>
            </div>
          </section>
        </main>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[26px] border border-sand bg-paper p-5 soft-shadow">
            <Eyebrow>Make it part of your yatra</Eyebrow>
            <h2 className="mt-3 font-display text-[28px] leading-[1.04] tracking-[-0.03em] text-forest">
              A {nightsLabel(circuit.days)} circuit
            </h2>
            <p className="mt-2 text-[12px] leading-5 text-muted">{circuit.tagline}</p>

            <div className="mt-5 space-y-3">
              {[
                { icon: Route, label: `${circuit.destinationIds.length} sacred stops` },
                { icon: CalendarDays, label: nightsLabel(circuit.days) },
                { icon: Accessibility, label: "Mobility-friendly options" },
                { icon: ShieldCheck, label: "Verified stays and vehicles" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2.5 text-[12px] text-forest-soft">
                    <Icon size={14} className="text-forest-soft/70" aria-hidden="true" />
                    {item.label}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-end justify-between border-t border-sand pt-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                  Curated from
                </p>
                <p className="mt-1 text-lg font-bold text-forest">
                  {formatINR(circuit.fromPricePaise)}
                  <span className="ml-1 text-[11px] font-normal text-muted">/ person</span>
                </p>
              </div>
              <Tag tone="sage">
                <Sparkles size={11} aria-hidden="true" /> Pilot
              </Tag>
            </div>

            <button
              type="button"
              onClick={isInTrip ? onAddToTrip : onAddToTrip}
              className="button-primary mt-4 w-full"
            >
              {isInTrip ? "Continue with this yatra" : "Add to my yatra"}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onStartCircuit(circuit)}
              className="button-secondary mt-2 w-full"
            >
              Plan the full circuit
            </button>
            <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-4 text-muted">
              <Info size={11} className="mt-0.5 shrink-0" aria-hidden="true" />
              No payment is taken while you plan. Availability is only presented as confirmed when a
              vendor confirms it.
            </p>
          </div>

          <div className="mt-4 rounded-[22px] border border-sand bg-cream p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              Also in this circuit
            </p>
            <div className="mt-3 space-y-2">
              {circuit.destinationIds
                .filter((id) => id !== destination.id)
                .map((id) => {
                  const other = getDestination(id);
                  if (!other) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 text-[11px] text-forest-soft">
                      <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                      {other.shortName}
                    </div>
                  );
                })}
            </div>
          </div>
        </aside>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-cream/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
              Circuit from
            </p>
            <p className="text-sm font-bold text-forest">{formatINR(circuit.fromPricePaise)}</p>
          </div>
          <button type="button" onClick={onAddToTrip} className="button-primary flex-1">
            Add to my yatra <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
