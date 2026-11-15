"use client";

import {
  Accessibility,
  Armchair,
  BedDouble,
  CarFront,
  Footprints,
  Landmark,
  Leaf,
  MapPin,
  Sparkles,
  TimerReset,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/format";
import type { AccessibilityId, ItineraryDay, ItineraryStop, TripConfig } from "@/lib/types";

const STOP_META: Record<
  ItineraryStop["type"],
  { icon: typeof CarFront; label: string; iconClass: string }
> = {
  travel: { icon: CarFront, label: "Travel", iconClass: "bg-sage text-forest-soft" },
  temple: { icon: Landmark, label: "Temple", iconClass: "bg-[#f7e7d5] text-saffron-deep" },
  hotel: { icon: BedDouble, label: "Stay", iconClass: "bg-mist text-forest-soft" },
  meal: { icon: UtensilsCrossed, label: "Meal", iconClass: "bg-[#f5ecdd] text-saffron-deep" },
  rest: { icon: Armchair, label: "Rest", iconClass: "bg-mist text-muted" },
  experience: { icon: Sparkles, label: "Experience", iconClass: "bg-sage text-forest" },
};

export const CARE_META: Record<
  AccessibilityId,
  { label: string; short: string; icon: typeof Accessibility }
> = {
  wheelchair: { label: "Wheelchair assistance", short: "Wheelchair", icon: Accessibility },
  "step-free": { label: "Step-free stays", short: "Step-free", icon: Footprints },
  "rest-stops": { label: "Frequent rest stops", short: "Rest stops", icon: TimerReset },
  vegetarian: { label: "Vegetarian meals", short: "Vegetarian", icon: Leaf },
};

export function DayTabs({
  days,
  activeDay,
  onChange,
  className,
}: {
  days: ItineraryDay[];
  activeDay: number;
  onChange: (day: number) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Itinerary days"
      className={cn("hide-scrollbar flex gap-2 overflow-x-auto pb-1", className)}
    >
      {days.map((day) => {
        const active = activeDay === day.day;
        return (
          <button
            key={day.day}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(day.day)}
            className={cn("day-tab shrink-0", active && "day-tab-active")}
          >
            <span
              className={cn(
                "text-[9px] font-bold uppercase tracking-[0.15em]",
                active ? "text-cream/55" : "text-muted",
              )}
            >
              Day {day.day}
            </span>
            <span className={cn("text-[11px] font-semibold", active ? "text-cream" : "text-forest")}>
              {day.date}
            </span>
            <span
              className={cn(
                "max-w-[92px] truncate text-[9px]",
                active ? "text-cream/55" : "text-muted",
              )}
            >
              {day.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function DayTimeline({
  day,
  assistantNote,
  assistantExtraStop,
  className,
}: {
  day: ItineraryDay;
  assistantNote?: string;
  assistantExtraStop?: ItineraryStop;
  className?: string;
}) {
  const stops = assistantExtraStop ? [...day.stops, assistantExtraStop] : day.stops;

  return (
    <section
      className={cn("overflow-hidden rounded-[24px] border border-sand bg-paper", className)}
    >
      <header className="border-b border-sand/70 bg-cream/50 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-forest px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-cream">
            Day {day.day}
          </span>
          <span className="text-[10px] font-medium text-muted">
            {day.weekday} · {day.date}
          </span>
        </div>
        <h2 className="mt-3 font-display text-[26px] leading-[1.05] tracking-[-0.03em] text-forest sm:text-[30px]">
          {day.title}
        </h2>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-forest-soft">
          <MapPin size={12} className="text-saffron-deep" aria-hidden="true" />
          {day.location}
        </p>
        {day.note && (
          <p className="mt-3 rounded-xl bg-ivory px-3.5 py-2.5 text-[10px] leading-5 text-muted">
            {day.note}
          </p>
        )}
        {assistantNote && (
          <p className="mt-2 flex items-start gap-2 rounded-xl border border-saffron/25 bg-[#fbf1e4] px-3.5 py-2.5 text-[10px] leading-5 text-saffron-deep">
            <Sparkles size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
            {assistantNote}
          </p>
        )}
      </header>

      <ol className="p-5 sm:p-6">
        {stops.map((stop, index) => {
          const meta = STOP_META[stop.type];
          const Icon = meta.icon;
          const last = index === stops.length - 1;
          const hasAccessNote = /wheelchair|step-free|accessible|assistance/i.test(
            stop.description,
          );

          return (
            <li key={`${stop.time}-${stop.title}-${index}`} className="relative flex gap-3.5 pb-6 last:pb-0">
              {!last && (
                <span
                  className="absolute bottom-0 left-[27px] top-11 w-px bg-sand"
                  aria-hidden="true"
                />
              )}
              <div className="flex w-14 shrink-0 flex-col items-center">
                <span className="whitespace-nowrap text-[9px] font-bold tabular-nums tracking-wide text-muted">
                  {stop.time}
                </span>
                <span
                  className={cn(
                    "mt-1.5 flex h-8 w-8 items-center justify-center rounded-xl",
                    meta.iconClass,
                  )}
                >
                  <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-[13px] font-semibold leading-5 text-forest">{stop.title}</p>
                  {stop.duration && (
                    <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {stop.duration}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-5 text-forest-soft">{stop.description}</p>
                {hasAccessNote && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-sage px-2 py-1 text-[9px] font-semibold text-forest-soft">
                    <Accessibility size={10} aria-hidden="true" />
                    Access note
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function CareTags({
  trip,
  limit,
  className,
  light = false,
}: {
  trip: TripConfig;
  limit?: number;
  className?: string;
  light?: boolean;
}) {
  const items = trip.accessibility.slice(0, limit ?? trip.accessibility.length);
  const remaining = trip.accessibility.length - items.length;

  if (trip.accessibility.length === 0) {
    return (
      <span
        className={cn(
          "pill",
          light ? "bg-white/10 text-cream/70" : "bg-mist text-muted",
          className,
        )}
      >
        No care requests yet
      </span>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((id) => {
        const meta = CARE_META[id];
        const Icon = meta.icon;
        return (
          <span
            key={id}
            className={cn(
              "pill",
              light ? "bg-white/10 text-cream/85" : "bg-sage text-forest-soft",
            )}
          >
            <Icon size={11} aria-hidden="true" />
            {meta.short}
          </span>
        );
      })}
      {remaining > 0 && (
        <span
          className={cn(
            "pill",
            light ? "bg-white/10 text-cream/70" : "bg-mist text-muted",
          )}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}
