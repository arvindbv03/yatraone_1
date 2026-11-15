"use client";

import { Compass, MapPin } from "lucide-react";
import { getDestination } from "@/lib/data";
import type { TripConfig } from "@/lib/types";

export function RouteMap({
  trip,
  compact = false,
  className = "",
}: {
  trip: TripConfig;
  compact?: boolean;
  className?: string;
}) {
  const destinations = trip.destinations
    .map((id) => getDestination(id))
    .filter((destination) => destination !== undefined);

  const origin = { x: 20, y: 72, label: trip.origin };
  const points = destinations.map((destination) => ({
    x: Math.min(82, Math.max(22, destination.mapPos.x)),
    y: Math.min(86, Math.max(20, destination.mapPos.y)),
    label: destination.shortName,
    index: destinations.indexOf(destination) + 1,
  }));

  const outbound = [origin, ...points]
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const routeDescription =
    points.length > 0
      ? `Route from ${trip.origin} to ${points.map((point) => point.label).join(", ")} and back to ${trip.origin}`
      : `Route from ${trip.origin}`;

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-sand bg-[#e8eee3] ${className}`}
      role="img"
      aria-label={`Illustrative map of your yatra. ${routeDescription}. Not to scale.`}
    >
      <div className="paper-grid absolute inset-0 opacity-40" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`route-sea-${trip.startDate}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9e7e2" />
            <stop offset="100%" stopColor="#c4dbd4" />
          </linearGradient>
          <linearGradient id={`route-land-${trip.startDate}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2eddf" />
            <stop offset="100%" stopColor="#e4ead9" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#route-sea-${trip.startDate})`} />
        <path
          d="M-6 -3C9 8 24 4 34 13C45 23 58 18 72 15C88 11 96 17 105 26L105 104L58 104C53 90 45 83 37 76C27 67 25 55 17 48C9 41 8 28 1 20Z"
          fill={`url(#route-land-${trip.startDate})`}
        />
        <path
          d="M-4 16C11 24 18 38 25 47C33 57 32 69 43 79C52 88 59 93 63 104"
          fill="none"
          stroke="#cbd8bd"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M85 8C77 28 84 42 74 55C65 67 57 72 52 83"
          fill="none"
          stroke="#c8d7cc"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.6"
        />
        <polyline
          points={outbound}
          fill="none"
          stroke="#14382f"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.65"
          vectorEffect="non-scaling-stroke"
        />
        {points.length > 0 && (
          <line
            x1={points[points.length - 1].x}
            y1={points[points.length - 1].y}
            x2={origin.x}
            y2={origin.y}
            stroke="#c86f24"
            strokeWidth="1.1"
            strokeDasharray="2 4"
            strokeLinecap="round"
            opacity="0.55"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      <div className="absolute left-3.5 top-3.5 rounded-full border border-white/80 bg-cream/85 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-forest backdrop-blur">
        <Compass size={10} className="mr-1 inline" aria-hidden="true" />
        {compact ? "Route preview" : "Your route"}
      </div>
      <div className="absolute right-3.5 top-3.5 rounded-full border border-white/80 bg-cream/75 px-2.5 py-1.5 text-[9px] font-medium text-muted backdrop-blur">
        Not to scale
      </div>

      {[{ ...origin, label: trip.origin, index: 0 }, ...points].map((point) => (
        <div
          key={`${point.label}-${point.index}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        >
          <div className="flex items-center gap-1.5 rounded-full border border-white/85 bg-paper/95 py-1 pl-1 pr-2.5 shadow-sm backdrop-blur">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold ${
                point.index === 0 ? "bg-saffron text-white" : "bg-forest text-cream"
              }`}
            >
              {point.index === 0 ? <MapPin size={10} aria-hidden="true" /> : point.index}
            </span>
            <span className="whitespace-nowrap text-[9px] font-semibold text-forest">
              {point.label}
            </span>
          </div>
          <span className="mx-auto mt-1 block h-1 w-1 rounded-full bg-forest/50" />
        </div>
      ))}

      {!compact && (
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/60 bg-cream/80 px-3 py-2 text-[9px] text-muted backdrop-blur">
          <span>
            {points.length} {points.length === 1 ? "stop" : "stops"} · {trip.days} days
          </span>
          <span className="font-medium text-forest-soft">
            Return drive included · estimates confirmed before travel
          </span>
        </div>
      )}
    </div>
  );
}
