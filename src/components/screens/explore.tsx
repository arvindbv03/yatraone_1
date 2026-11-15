"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Accessibility,
  ArrowRight,
  Compass,
  List,
  Map,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { CIRCUITS, DESTINATIONS } from "@/lib/data";
import { cn } from "@/lib/format";
import type { Circuit, Destination } from "@/lib/types";
import { Eyebrow, Stars, Tag } from "@/components/ui";

const FILTERS = [
  { id: "all", label: "All places" },
  { id: "temples", label: "Temples" },
  { id: "circuits", label: "Circuits" },
  { id: "senior", label: "Senior-friendly" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function ExploreScreen({
  onOpenDestination,
  onStartCircuit,
}: {
  onOpenDestination: (id: string) => void;
  onStartCircuit: (circuit: Circuit) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [state, setState] = useState("All states");
  const [view, setView] = useState<"list" | "map">("list");

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return DESTINATIONS.filter((destination) => {
      if (filter === "circuits") return false;
      if (state !== "All states" && destination.state !== state) return false;
      if (!normalizedQuery) return true;
      return [
        destination.name,
        destination.city,
        destination.state,
        destination.deity,
        destination.temple,
        destination.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [filter, query, state]);

  const filteredCircuits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return CIRCUITS.filter((circuit) => {
      if (!normalizedQuery) return true;
      return [circuit.name, circuit.tagline, circuit.blurb]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query]);

  const showCircuits = filter === "all" || filter === "circuits";

  return (
    <div className="pb-24 md:pb-0">
      <div className="container-page pt-9 md:pt-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Discover South India</Eyebrow>
            <h1 className="mt-3 font-display text-[40px] leading-[0.98] tracking-[-0.04em] text-forest md:text-[56px]">
              Temples, towns
              <br />
              and the roads between.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-forest-soft">
              Search by temple, city, deity or circuit. Every place carries practical notes on
              access, timings and the kind of day it asks for.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-sand bg-paper px-4 py-3 text-right md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
              Pilot network
            </p>
            <p className="mt-1 text-sm font-semibold text-forest">
              {DESTINATIONS.length} destinations
              <span className="mx-1.5 text-sand-deep">·</span>
              {CIRCUITS.length} circuits
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-sand bg-paper p-2.5 soft-shadow">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search destinations</span>
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try 'Tirupati', 'Shiva' or 'Rameswaram'"
                className="input-shell h-12 border-transparent bg-ivory/70 pl-11 pr-10 text-[13px] focus:bg-white"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-sand/50 hover:text-forest"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </label>
            <div className="flex items-center gap-2">
              <label className="relative flex-1 sm:flex-none">
                <span className="sr-only">Filter by state</span>
                <select
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  className="input-shell h-12 min-w-[150px] cursor-pointer appearance-none border-transparent bg-ivory/70 pr-9 text-[12px] font-semibold focus:bg-white"
                >
                  <option>All states</option>
                  <option>Tamil Nadu</option>
                  <option>Andhra Pradesh</option>
                </select>
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] text-muted">
                  ▼
                </span>
              </label>
              <div className="flex rounded-full border border-sand bg-ivory/70 p-1">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  className={cn(
                    "flex h-9 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition",
                    view === "list"
                      ? "bg-forest text-cream"
                      : "text-forest-soft hover:bg-white",
                  )}
                >
                  <List size={13} aria-hidden="true" /> List
                </button>
                <button
                  type="button"
                  onClick={() => setView("map")}
                  aria-pressed={view === "map"}
                  className={cn(
                    "flex h-9 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition",
                    view === "map"
                      ? "bg-forest text-cream"
                      : "text-forest-soft hover:bg-white",
                  )}
                >
                  <Map size={13} aria-hidden="true" /> Map
                </button>
              </div>
            </div>
          </div>
          <div className="hide-scrollbar mt-2.5 flex gap-2 overflow-x-auto px-1 pb-1">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn("chip shrink-0", filter === item.id && "chip-active")}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setFilter("senior");
                setState("All states");
              }}
              className={cn(
                "chip shrink-0 border-saffron/25 text-saffron-deep",
                filter === "senior" && "border-saffron bg-saffron text-white",
              )}
            >
              <Accessibility size={13} aria-hidden="true" />
              Step-free stays
            </button>
          </div>
        </div>

        {view === "map" && (
          <div className="animate-fade-in mt-6">
            <ExploreMap onOpen={onOpenDestination} />
            <p className="mt-2 text-[11px] text-muted">
              Illustrative route map. Distances and travel times are estimated, not live.
            </p>
          </div>
        )}

        {showCircuits && filteredCircuits.length > 0 && filter === "all" && !query && (
          <section className="mt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <Eyebrow>Ready-made, never rigid</Eyebrow>
                <h2 className="mt-2 font-display text-[29px] tracking-[-0.03em] text-forest md:text-[34px]">
                  Start with a circuit
                </h2>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {filteredCircuits.map((circuit) => (
                <button
                  key={circuit.id}
                  type="button"
                  onClick={() => onStartCircuit(circuit)}
                  className="group flex items-center gap-4 rounded-2xl border border-sand bg-paper p-2.5 pr-4 text-left transition hover:-translate-y-0.5 hover:border-forest/30"
                >
                  <div className="relative h-[86px] w-[92px] shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={circuit.image}
                      alt={circuit.imageAlt}
                      fill
                      sizes="92px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-saffron-deep">
                      {circuit.nights} nights
                    </p>
                    <h3 className="mt-1 truncate text-[13px] font-semibold text-forest">
                      {circuit.name}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-muted">{circuit.tagline}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-forest">
                      View circuit <ArrowRight size={11} aria-hidden="true" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {filter === "circuits" ? (
          <section className="mt-9">
            <div className="grid gap-5 md:grid-cols-3">
              {filteredCircuits.map((circuit) => (
                <button
                  key={circuit.id}
                  type="button"
                  onClick={() => onStartCircuit(circuit)}
                  className="group overflow-hidden rounded-[24px] border border-sand bg-paper text-left soft-shadow transition hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={circuit.image}
                      alt={circuit.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 photo-tint opacity-70" />
                    <div className="absolute left-3 top-3">
                      <Tag tone="white">{circuit.eyebrow}</Tag>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-[24px] leading-[1.08] text-forest">
                      {circuit.name}
                    </h2>
                    <p className="mt-2 text-[12px] leading-5 text-muted">{circuit.blurb}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-sand pt-3 text-[11px] font-semibold text-forest">
                      <span>{circuit.tagline}</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-10 md:mt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <Eyebrow>Places with a point of view</Eyebrow>
                <h2 className="mt-2 font-display text-[29px] tracking-[-0.03em] text-forest md:text-[34px]">
                  {query ? `Results for “${query}”` : "Explore the map"}
                </h2>
              </div>
              <p className="hidden text-[11px] text-muted sm:block">
                {filtered.length} {filtered.length === 1 ? "place" : "places"}
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((destination, index) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onOpen={() => onOpenDestination(destination.id)}
                    delay={index * 45}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-sand-deep bg-paper/50 px-6 py-16 text-center">
                <Compass size={28} className="mx-auto text-muted" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl text-forest">No places match that search</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
                  Try a city, a deity or a circuit name. The pilot network currently covers Tamil
                  Nadu and Andhra Pradesh.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setState("All states");
                    setFilter("all");
                  }}
                  className="button-secondary mt-5"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}

        <section className="mt-14 md:mt-20">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[26px] bg-sage px-5 py-6 sm:flex-row sm:items-center md:px-8">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest text-cream">
                <Sparkles size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest-soft">
                  Not sure where to begin?
                </p>
                <p className="mt-1 text-sm font-semibold text-forest">
                  Start with the 4-day Tirupati circuit. Change anything later.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onStartCircuit(CIRCUITS[0])}
              className="button-secondary shrink-0 border-forest/15 bg-cream/70"
            >
              Start planning <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function DestinationCard({
  destination,
  onOpen,
  delay,
}: {
  destination: Destination;
  onOpen: () => void;
  delay: number;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group animate-fade-up overflow-hidden rounded-[24px] border border-sand bg-paper text-left soft-shadow transition duration-300 hover:-translate-y-1 hover:border-forest/25"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 photo-tint opacity-70" />
        <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-1.5">
          <Tag tone="white">{destination.state}</Tag>
        </div>
        <div className="absolute bottom-3.5 left-3.5">
          <Tag tone="forest" className="bg-forest/80 backdrop-blur-sm">
            {destination.category}
          </Tag>
        </div>
        <span className="absolute bottom-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-forest transition group-hover:bg-white">
          <ArrowRight size={15} aria-hidden="true" />
        </span>
      </div>
      <div className="p-4.5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[23px] leading-none tracking-[-0.02em] text-forest">
              {destination.shortName}
            </h3>
            <p className="mt-1.5 flex items-center gap-1 truncate text-[11px] text-muted">
              <MapPin size={11} aria-hidden="true" />
              {destination.city} · {destination.deity}
            </p>
          </div>
          <Stars rating={destination.rating} />
        </div>
        <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-muted">{destination.summary}</p>
        <div className="mt-4 flex items-center justify-between border-t border-sand/70 pt-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-forest-soft">
            <Accessibility size={12} aria-hidden="true" />
            Accessibility notes
          </span>
          <span className="text-[10px] text-muted">{destination.idealDuration}</span>
        </div>
      </div>
    </button>
  );
}

function ExploreMap({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-[28px] border border-sand bg-[#e8eee3] sm:min-h-[520px]">
      <div className="paper-grid absolute inset-0 opacity-50" />
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dce8e2" />
            <stop offset="100%" stopColor="#c9ddd6" />
          </linearGradient>
          <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1ecdf" />
            <stop offset="100%" stopColor="#e4ead9" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#sea)" />
        <path
          d="M60 20C180 70 280 45 360 110C430 165 500 150 590 120C690 85 760 105 800 170L800 600L500 600C470 520 400 500 340 450C260 385 240 300 170 245C115 200 100 120 60 20Z"
          fill="url(#land)"
        />
        <path
          d="M60 20C180 70 280 45 360 110C430 165 500 150 590 120C690 85 760 105 800 170"
          fill="none"
          stroke="#c8bda7"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          opacity="0.6"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M${-50 + i * 180} 600C${90 + i * 160} 480 ${290 + i * 130} 430 ${430 + i * 160} 300`}
            fill="none"
            stroke="#9dbcb2"
            strokeWidth="1"
            opacity="0.22"
          />
        ))}
        <path
          d="M180 160C260 200 300 260 280 330C265 385 300 420 360 450"
          fill="none"
          stroke="#c9d9bd"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-cream/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-forest backdrop-blur">
        <Compass size={11} className="mr-1 inline" aria-hidden="true" />
        Illustrative map
      </div>
      <div className="absolute right-4 top-4 rounded-full border border-white/70 bg-cream/85 px-3 py-1.5 text-[10px] font-medium text-muted backdrop-blur">
        Not to scale
      </div>

      {DESTINATIONS.map((destination, index) => (
        <button
          key={destination.id}
          type="button"
          onClick={() => onOpen(destination.id)}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${Math.min(84, Math.max(16, destination.mapPos.x))}%`,
            top: `${Math.min(87, Math.max(14, destination.mapPos.y))}%`,
          }}
          aria-label={`Open ${destination.shortName}`}
        >
          <span className="flex items-center gap-2 rounded-full border border-white/80 bg-paper/95 py-1 pl-1 pr-3 text-[10px] font-semibold text-forest shadow-md backdrop-blur transition group-hover:-translate-y-0.5 group-hover:border-forest/30">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-[9px] font-bold text-cream">
              {index + 1}
            </span>
            <span className="whitespace-nowrap">{destination.shortName}</span>
          </span>
          <span className="mx-auto mt-1 block h-1.5 w-1.5 rounded-full bg-saffron shadow-[0_0_0_4px_rgba(200,111,36,0.15)]" />
        </button>
      ))}

      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-2xl border border-white/70 bg-cream/90 p-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-5 text-muted">
          Tap a pin to read the temple notes. Every listing shows access before you add it.
        </p>
        <button
          type="button"
          onClick={() => onOpen("tirupati")}
          className="inline-flex min-h-9 items-center gap-1 self-start rounded-full bg-forest px-4 text-[10px] font-semibold text-cream sm:self-auto"
        >
          Open the pilot route <ArrowRight size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
