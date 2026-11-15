"use client";

import { Image } from "@/components/image";
import { useEffect, useState } from "react";
import {
  Accessibility,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  Coffee,
  Footprints,
  Gauge,
  Info,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Route,
  Sparkles,
  TimerReset,
  Trash2,
  UsersRound,
} from "lucide-react";
import { DESTINATIONS, getDestination, ORIGIN_OPTIONS } from "@/lib/data";
import { cn, formatDateRange, formatINR } from "@/lib/format";
import { roadEstimate } from "@/lib/itinerary";
import { calculateQuote, roomCount, travellerCount } from "@/lib/pricing";
import type { AccessibilityId, TripConfig } from "@/lib/types";
import {
  BackButton,
  Divider,
  Eyebrow,
  PriceLine,
  Sheet,
  Tag,
} from "@/components/ui";

const ACCESSIBILITY_OPTIONS: {
  id: AccessibilityId;
  label: string;
  copy: string;
  icon: typeof Accessibility;
}[] = [
  {
    id: "wheelchair",
    label: "Wheelchair assistance",
    copy: "Accessible vehicle + attendant coordination",
    icon: Accessibility,
  },
  {
    id: "step-free",
    label: "Step-free stays",
    copy: "Lift access and accessible bathrooms",
    icon: Footprints,
  },
  {
    id: "rest-stops",
    label: "Frequent rest stops",
    copy: "Shorter walking days and time to sit",
    icon: TimerReset,
  },
  {
    id: "vegetarian",
    label: "Vegetarian meals",
    copy: "Simple, familiar food at every stop",
    icon: Leaf,
  },
];

export function PlanScreen({
  trip,
  onTripChange,
  onBack,
  onContinue,
  onSave,
}: {
  trip: TripConfig;
  onTripChange: (trip: TripConfig) => void;
  onBack: () => void;
  onContinue: () => void;
  onSave: () => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const quote = calculateQuote(trip);
  const travelers = travellerCount(trip);
  const rooms = roomCount(trip);

  useEffect(() => {
    if (!generating) return;
    const stepTimer = window.setInterval(() => {
      setGenerationStep((step) => Math.min(step + 1, 2));
    }, 650);
    const finishTimer = window.setTimeout(() => {
      onContinue();
    }, 2200);
    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(finishTimer);
    };
  }, [generating, onContinue]);

  const update = (patch: Partial<TripConfig>) => {
    onTripChange({ ...trip, ...patch });
  };

  const addDestination = (id: string) => {
    if (trip.destinations.includes(id)) return;
    const destinations = [...trip.destinations, id];
    update({
      destinations,
      days: Math.max(4, destinations.length + 1),
    });
    setAddOpen(false);
  };

  const removeDestination = (id: string) => {
    if (trip.destinations.length <= 1) return;
    const destinations = trip.destinations.filter((destination) => destination !== id);
    update({
      destinations,
      days: Math.max(4, destinations.length + 1),
      localStops: [],
    });
  };

  const moveDestination = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= trip.destinations.length) return;
    const destinations = [...trip.destinations];
    const [moved] = destinations.splice(index, 1);
    destinations.splice(nextIndex, 0, moved);
    update({ destinations });
  };

  const toggleAccessibility = (id: AccessibilityId) => {
    const active = trip.accessibility.includes(id);
    const accessibility = active
      ? trip.accessibility.filter((item) => item !== id)
      : [...trip.accessibility, id];
    const vehicleId =
      id === "wheelchair" && !active ? "urbania" : trip.vehicleId;
    update({ accessibility, vehicleId });
  };

  const changeTraveler = (field: "adults" | "seniors" | "children", delta: number) => {
    const nextValue = Math.max(field === "adults" ? 1 : 0, trip[field] + delta);
    update({ [field]: nextValue });
  };

  const totalEstimate = quote.totalPaise;
  const addedDestinations = DESTINATIONS.filter(
    (destination) => !trip.destinations.includes(destination.id),
  );

  return (
    <div className="pb-32 md:pb-14">
      <div className="container-page pt-6">
        <BackButton onClick={onBack} label="Back to home" />
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Yatra builder</Eyebrow>
            <h1 className="mt-3 font-display text-[39px] leading-[0.98] tracking-[-0.04em] text-forest md:text-[52px]">
              Build your yatra.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-forest-soft">
              Start with the people and the pace. We will draft the route, stays and transport
              around them.
            </p>
          </div>
          <Tag tone="sage" className="self-start md:self-auto">
            <Sparkles size={12} aria-hidden="true" />
            Free to plan · no payment yet
          </Tag>
        </div>
      </div>

      <div className="container-page mt-7 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-4">
          <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  01 · The route
                </p>
                <h2 className="mt-2 font-display text-[25px] tracking-[-0.03em] text-forest">
                  Where should we take you?
                </h2>
              </div>
              <Tag tone="saffron">{trip.destinations.length} stops</Tag>
            </div>

            <div className="mt-5">
              <label className="block text-[11px] font-semibold text-forest-soft">
                Starting from
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-sage text-forest">
                  <MapPin size={14} aria-hidden="true" />
                </span>
                <select
                  value={trip.origin}
                  onChange={(event) => update({ origin: event.target.value })}
                  className="input-shell h-14 cursor-pointer appearance-none pl-14 pr-10 text-[13px] font-semibold"
                >
                  {ORIGIN_OPTIONS.map((origin) => (
                    <option key={origin}>{origin}</option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-forest-soft">Your stops</p>
                <span className="text-[10px] text-muted">Reorder with the arrows</span>
              </div>
              <div className="mt-2 space-y-2">
                {trip.destinations.map((id, index) => {
                  const destination = getDestination(id);
                  if (!destination) return null;
                  const previous =
                    index === 0
                      ? { coords: null, name: trip.origin }
                      : {
                          coords: getDestination(trip.destinations[index - 1])?.coords ?? null,
                          name: getDestination(trip.destinations[index - 1])?.city ?? trip.origin,
                        };
                  const drive = previous.coords
                    ? roadEstimate(previous.coords, destination.coords)
                    : roadEstimate(trip.origin, destination.coords);
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 rounded-2xl border border-sand/80 bg-cream/55 p-2 pr-2"
                    >
                      <div className="flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-0.5 text-muted">
                        <button
                          type="button"
                          onClick={() => moveDestination(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move ${destination.shortName} earlier`}
                          className="flex h-4 w-5 items-center justify-center rounded hover:bg-sand/50 disabled:opacity-25"
                        >
                          <ArrowUp size={12} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDestination(index, 1)}
                          disabled={index === trip.destinations.length - 1}
                          aria-label={`Move ${destination.shortName} later`}
                          className="flex h-4 w-5 items-center justify-center rounded hover:bg-sand/50 disabled:opacity-25"
                        >
                          <ArrowDown size={12} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand">
                        <Image
                          src={destination.image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-forest/85 text-[9px] font-bold text-cream">
                          {index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-forest">
                          {destination.shortName}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-muted">
                          {index === 0 ? "From origin" : `From ${previous.name}`} ·{" "}
                          {drive.label}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDestination(id)}
                        disabled={trip.destinations.length <= 1}
                        aria-label={`Remove ${destination.shortName}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-[#fbe7e1] hover:text-[#8d3d25] disabled:opacity-30"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-sand-deep bg-transparent text-[11px] font-semibold text-forest transition hover:border-forest/40 hover:bg-cream"
              >
                <Plus size={14} aria-hidden="true" /> Add a temple or place
              </button>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-ivory px-3.5 py-3 text-[10px] leading-5 text-muted">
              <Route size={13} className="mt-0.5 shrink-0 text-forest-soft" aria-hidden="true" />
              {formatDateRange(trip.startDate, trip.days)} · We add a day whenever you add a new
              stop, so the route never becomes a rush.
            </div>
          </section>

          <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              02 · When
            </p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-[25px] tracking-[-0.03em] text-forest">
                  Choose a start date.
                </h2>
                <p className="mt-1 text-[11px] text-muted">
                  We will plan backwards from rest and check-in times.
                </p>
              </div>
              <Tag tone="sand">{trip.days - 1} nights</Tag>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-forest-soft">
                  <CalendarDays size={13} aria-hidden="true" /> Start date
                </span>
                <input
                  type="date"
                  value={trip.startDate}
                  min="2026-11-20"
                  max="2027-12-31"
                  onChange={(event) => {
                    if (event.target.value) update({ startDate: event.target.value });
                  }}
                  className="input-shell h-12 text-[12px] font-semibold"
                />
              </label>
              <div className="rounded-xl border border-sand bg-ivory/70 px-4 py-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                  Trip length
                </p>
                <p className="mt-1 text-[12px] font-semibold text-forest">
                  {trip.days} days · {trip.days - 1} nights
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {formatDateRange(trip.startDate, trip.days)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  03 · Who
                </p>
                <h2 className="mt-2 font-display text-[25px] tracking-[-0.03em] text-forest">
                  Who is coming along?
                </h2>
              </div>
              <Tag tone="sage">
                <UsersRound size={12} aria-hidden="true" />
                {travelers} travellers
              </Tag>
            </div>

            <div className="mt-5 divide-y divide-sand/70 rounded-2xl border border-sand/70">
              {[
                { field: "adults" as const, label: "Adults", copy: "Ages 18–59" },
                { field: "seniors" as const, label: "Seniors", copy: "Ages 60+" },
                { field: "children" as const, label: "Children", copy: "Ages 0–17" },
              ].map((row) => (
                <div key={row.field} className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <div>
                    <p className="text-[12px] font-semibold text-forest">{row.label}</p>
                    <p className="mt-0.5 text-[10px] text-muted">{row.copy}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeTraveler(row.field, -1)}
                      disabled={trip[row.field] <= (row.field === "adults" ? 1 : 0)}
                      aria-label={`Remove one ${row.label.toLowerCase()}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-sand text-forest transition hover:border-forest hover:bg-white disabled:opacity-30"
                    >
                      <Minus size={13} aria-hidden="true" />
                    </button>
                    <span className="w-5 text-center text-[13px] font-bold tabular-nums text-forest">
                      {trip[row.field]}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeTraveler(row.field, 1)}
                      aria-label={`Add one ${row.label.toLowerCase()}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-sand text-forest transition hover:border-forest hover:bg-white"
                    >
                      <Plus size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted">
              <Info size={11} aria-hidden="true" />
              {rooms} {rooms === 1 ? "room" : "rooms"} will be reserved for this group.
            </p>
          </section>

          <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              04 · How
            </p>
            <h2 className="mt-2 font-display text-[25px] tracking-[-0.03em] text-forest">
              Travel care preferences
            </h2>
            <p className="mt-1 max-w-lg text-[11px] leading-5 text-muted">
              Kept through the itinerary, transport and hotel selection. If a requested service
              cannot be met, we will tell you — not quietly replace it.
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {ACCESSIBILITY_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = trip.accessibility.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleAccessibility(option.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition",
                      active
                        ? "border-forest/30 bg-sage"
                        : "border-sand bg-cream/50 hover:border-forest/20 hover:bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        active ? "bg-forest text-cream" : "bg-white text-forest-soft",
                      )}
                    >
                      <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 text-[11px] font-semibold text-forest">
                        {option.label}
                        {active && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-forest text-cream">
                            <Check size={9} aria-hidden="true" />
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block text-[10px] leading-4 text-muted">
                        {option.copy}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold text-forest-soft">Travel pace</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => update({ pace: "relaxed" })}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition",
                    trip.pace === "relaxed"
                      ? "border-forest/30 bg-sage"
                      : "border-sand bg-cream/50 hover:bg-white",
                  )}
                >
                  <Coffee size={16} className="text-forest" aria-hidden="true" />
                  <span>
                    <span className="block text-[11px] font-semibold text-forest">Relaxed</span>
                    <span className="mt-0.5 block text-[10px] text-muted">Rest built into each day</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => update({ pace: "balanced" })}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition",
                    trip.pace === "balanced"
                      ? "border-forest/30 bg-sage"
                      : "border-sand bg-cream/50 hover:bg-white",
                  )}
                >
                  <Gauge size={16} className="text-forest" aria-hidden="true" />
                  <span>
                    <span className="block text-[11px] font-semibold text-forest">Balanced</span>
                    <span className="mt-0.5 block text-[10px] text-muted">A little more each day</span>
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-[26px] border border-sand bg-paper p-5 soft-shadow">
            <div className="flex items-center justify-between gap-3">
              <Eyebrow>Your yatra so far</Eyebrow>
              <Tag tone="sage">Draft</Tag>
            </div>
            <div className="mt-4">
              <p className="font-display text-[25px] leading-[1.08] tracking-[-0.03em] text-forest">
                {getDestination(trip.destinations[0])?.shortName ?? "Your route"}
                {trip.destinations.length > 1 ? " & beyond" : ""}
              </p>
              <p className="mt-1.5 text-[11px] text-muted">
                {formatDateRange(trip.startDate, trip.days)} · {travelers} travellers
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-ivory/75 p-3.5">
              <div className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 text-saffron-deep" aria-hidden="true" />
                <div className="min-w-0 text-[11px] leading-5 text-forest-soft">
                  <span className="font-semibold text-forest">{trip.origin}</span> →{" "}
                  {trip.destinations
                    .map((id) => getDestination(id)?.shortName)
                    .filter(Boolean)
                    .join(" → ")}{" "}
                  → <span className="font-semibold text-forest">{trip.origin}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <PriceLine
                label={`Stay · ${rooms} rooms · ${trip.days - 1} nights`}
                value={formatINR(quote.hotelPaise)}
                muted
              />
              <PriceLine label="Transport" value={formatINR(quote.transportPaise)} muted />
              <PriceLine label="Extras selected" value={formatINR(quote.addOnsPaise)} muted />
              <Divider className="my-1" />
              <div className="flex items-end justify-between gap-3">
                <span className="text-[11px] font-semibold text-forest-soft">Starting estimate</span>
                <span className="font-display text-[26px] leading-none tracking-[-0.02em] text-forest">
                  {formatINR(totalEstimate)}
                </span>
              </div>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-muted">
              Includes taxes and our platform fee. This is an estimate, not a confirmed price.
            </p>

            <button
              type="button"
              onClick={() => setGenerating(true)}
              disabled={generating}
              className="button-primary mt-4 w-full"
            >
              {generating ? "Building your route..." : "Generate my itinerary"}
              {!generating && <Sparkles size={15} aria-hidden="true" />}
            </button>
            <button type="button" onClick={onSave} className="button-secondary mt-2 w-full">
              Save draft
            </button>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-sand/70 bg-cream px-3 py-2.5 text-[10px] leading-4 text-muted">
              <Info size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
              We do not hold inventory while you plan. Availability is checked before payment.
            </div>
          </div>
        </aside>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-cream/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Estimate</p>
            <p className="text-[15px] font-bold text-forest">{formatINR(totalEstimate)}</p>
          </div>
          <button
            type="button"
            onClick={() => setGenerating(true)}
            className="button-primary flex-1 px-3 text-[12px]"
          >
            Generate itinerary <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Sheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a stop"
        footer={
          <p className="text-[10px] leading-4 text-muted">
            We add a day when your route grows, so senior travellers are not asked to hurry.
          </p>
        }
      >
        <div className="space-y-2">
          {addedDestinations.length === 0 && (
            <p className="rounded-2xl bg-sage p-4 text-sm text-forest">
              Every destination in the pilot network is already in your yatra.
            </p>
          )}
          {addedDestinations.map((destination) => (
            <button
              key={destination.id}
              type="button"
              onClick={() => addDestination(destination.id)}
              className="flex w-full items-center gap-3 rounded-2xl border border-sand bg-paper p-2.5 text-left transition hover:border-forest/30 hover:bg-white"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={destination.image}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-forest">{destination.shortName}</p>
                <p className="mt-0.5 truncate text-[10px] text-muted">
                  {destination.city} · {destination.deity}
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sand text-forest">
                <Plus size={14} aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </Sheet>

      {generating && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-forest px-6 text-cream"
          role="status"
          aria-live="polite"
        >
          <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-cream/15" />
            <span className="absolute inset-3 rounded-full border border-cream/20" />
            <span className="flex h-12 w-12 animate-[soft-pulse_2s_ease-in-out_infinite] items-center justify-center rounded-full bg-cream/10">
              <Sparkles size={22} className="text-saffron" aria-hidden="true" />
            </span>
          </div>
          <Eyebrow light>Designing your yatra</Eyebrow>
          <h2 className="mt-3 max-w-sm text-center font-display text-[32px] leading-[1.05] tracking-[-0.03em]">
            A route with room to breathe.
          </h2>
          <div className="mt-7 w-full max-w-xs space-y-2.5 text-left">
            {["Reading your care preferences", "Checking road times and rest stops", "Balancing temples and quiet time"].map(
              (label, index) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-2.5 rounded-full border px-3 py-2 text-[11px] transition",
                    generationStep >= index
                      ? "border-cream/20 bg-cream/10 text-cream"
                      : "border-cream/10 text-cream/35",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full",
                      generationStep > index
                        ? "bg-saffron text-white"
                        : generationStep === index
                          ? "border border-saffron/60"
                          : "border border-cream/20",
                    )}
                  >
                    {generationStep > index ? (
                      <Check size={9} aria-hidden="true" />
                    ) : (
                      <span className="h-1 w-1 rounded-full bg-current" />
                    )}
                  </span>
                  {label}
                </div>
              ),
            )}
          </div>
          <p className="mt-7 max-w-xs text-center text-[10px] leading-4 text-cream/45">
            This is a draft. You will review every change before anything is saved or paid for.
          </p>
        </div>
      )}
    </div>
  );
}
