"use client";

import {
  Accessibility,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  HeartHandshake,
  MapPin,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { CIRCUITS, DESTINATIONS } from "@/lib/data";
import { formatDateRange, formatINR, nightsLabel } from "@/lib/format";
import type { Circuit, Screen, TripConfig } from "@/lib/types";
import { Eyebrow, Stars, Tag } from "@/components/ui";
import { assetPath } from "@/lib/paths";

export function HomeScreen({
  trip,
  hasStarted,
  onNavigate,
  onStartCircuit,
  onStartPersona,
  onOpenDestination,
}: {
  trip: TripConfig;
  hasStarted: boolean;
  onNavigate: (screen: Screen) => void;
  onStartCircuit: (circuit: Circuit) => void;
  onStartPersona: (persona: "family" | "senior" | "group") => void;
  onOpenDestination: (id: string) => void;
}) {
  const featured = DESTINATIONS[0];

  return (
    <div className="pb-24 md:pb-0">
      <section className="container-page pt-7 md:pt-12 lg:pt-16">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <div className="animate-fade-up flex flex-col justify-center">
            <Eyebrow>South India · Curated pilgrimage travel</Eyebrow>
            <h1 className="text-balance mt-5 max-w-xl font-display text-[46px] font-normal leading-[0.98] tracking-[-0.04em] text-forest sm:text-[58px] lg:text-[68px]">
              A pilgrimage that
              <span className="relative ml-2 inline-block italic text-saffron-deep">
                moves
                <svg
                  viewBox="0 0 164 12"
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-saffron/35"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8.2C38 2.5 103 2.2 162 7"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              at your pace.
            </h1>
            <p className="mt-6 max-w-[510px] text-[15px] leading-7 text-forest-soft">
              Temples, stays and trusted local partners, planned around your family — not a
              fixed tour. Built with extra care for senior travellers.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium text-forest-soft">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck size={15} className="text-forest-soft" aria-hidden="true" />
                Verified local partners
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Accessibility size={15} className="text-forest-soft" aria-hidden="true" />
                Senior-first planning
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-forest-soft" aria-hidden="true" />
                No hidden fees
              </span>
            </div>

            <div className="mt-8 rounded-[26px] border border-sand bg-paper p-2 soft-shadow">
              <div className="grid gap-1 sm:grid-cols-[1.3fr_1fr_1fr_auto]">
                <button
                  type="button"
                  onClick={() => onNavigate("explore")}
                  className="group flex min-h-[64px] flex-col justify-center rounded-[18px] px-3.5 py-2.5 text-left transition hover:bg-ivory"
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                    <MapPin size={11} aria-hidden="true" /> Where
                  </span>
                  <span className="mt-1 truncate text-[13px] font-semibold text-forest">
                    Tirupati & Srikalahasti
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("plan")}
                  className="group flex min-h-[64px] flex-col justify-center rounded-[18px] border-t border-sand/70 px-3.5 py-2.5 text-left transition hover:bg-ivory sm:border-l sm:border-t-0"
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                    <CalendarDays size={11} aria-hidden="true" /> When
                  </span>
                  <span className="mt-1 text-[13px] font-semibold text-forest">
                    {formatDateRange(trip.startDate, trip.days)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("plan")}
                  className="group flex min-h-[64px] flex-col justify-center rounded-[18px] border-t border-sand/70 px-3.5 py-2.5 text-left transition hover:bg-ivory sm:border-l sm:border-t-0"
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                    <UsersRound size={11} aria-hidden="true" /> Who
                  </span>
                  <span className="mt-1 text-[13px] font-semibold text-forest">
                    {trip.adults + trip.seniors + trip.children} travellers · {trip.seniors} seniors
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("plan")}
                  className="flex min-h-[54px] items-center justify-center gap-2 rounded-[18px] bg-forest px-5 text-[13px] font-semibold text-cream transition hover:bg-forest-deep sm:min-h-0"
                >
                  <Search size={15} aria-hidden="true" />
                  <span className="sm:hidden lg:inline">Plan my yatra</span>
                  <span className="hidden sm:inline lg:hidden">Plan</span>
                </button>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
              <Sparkles size={12} className="text-saffron" aria-hidden="true" />
              A 4-day starter plan is pre-filled. You can change everything.
            </p>
          </div>

          <div
            className="animate-fade-up relative min-h-[420px] overflow-hidden rounded-[30px] bg-forest sm:min-h-[480px] lg:min-h-[610px]"
            style={{ animationDelay: "100ms" }}
          >
            <img
              src={assetPath("/images/madurai.jpg")}
              alt="The intricately painted south gopuram of Meenakshi Amman Temple, Madurai"
              className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
            />
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-6 sm:top-6">
              <Tag tone="white" className="pl-2">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
                The YatraOne edit
              </Tag>
              <Tag tone="forest" className="hidden sm:inline-flex">
                <MapPin size={11} aria-hidden="true" />
                Madurai, Tamil Nadu
              </Tag>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
                Journey no. 02
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <h2 className="max-w-[360px] font-display text-[31px] leading-[1.02] tracking-[-0.03em] sm:text-[38px]">
                    A city built around a goddess.
                  </h2>
                  <p className="mt-2 max-w-[320px] text-[12px] leading-5 text-white/70">
                    Madurai, Rameswaram and the road to Dhanushkodi. Five days, no rushing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onStartCircuit(CIRCUITS[1])}
                  aria-label="Explore the Madurai and Rameswaram circuit"
                  className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cream text-forest transition hover:bg-white"
                >
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/15 pt-4">
                <Tag tone="white" className="bg-white/15 text-white">
                  <Route size={11} aria-hidden="true" />
                  5 days · 4 nights
                </Tag>
                <Tag tone="white" className="bg-white/15 text-white">
                  <Accessibility size={11} aria-hidden="true" />
                  Mobility-friendly options
                </Tag>
              </div>
            </div>

            <div className="absolute right-5 top-5 hidden w-[188px] rounded-2xl border border-white/20 bg-cream/95 p-3 shadow-lg backdrop-blur sm:block">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                Why this route
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-forest">
                Two temple towns, one island, and a coast road that ends at the sea.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-saffron-deep">
                <Stars rating={4.9} />
                <span className="text-muted">Guest favourite</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasStarted && (
        <section className="container-page mt-10 md:mt-12">
          <div className="animate-fade-in flex flex-col gap-4 rounded-2xl border border-forest/10 bg-sage/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest text-cream">
                <Route size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest-soft">
                  Continue planning
                </p>
                <p className="mt-0.5 text-sm font-semibold text-forest">
                  Your {featured.shortName} yatra ·{" "}
                  <span className="font-normal text-forest-soft">
                    {nightsLabel(trip.days)} ·{" "}
                    {trip.adults + trip.seniors + trip.children} travellers
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("plan")}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 self-start rounded-full border border-forest/20 bg-cream/60 px-4 text-xs font-semibold text-forest transition hover:bg-cream sm:self-auto"
            >
              Open draft <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </section>
      )}

      <section className="container-page mt-16 md:mt-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Start with a circuit</Eyebrow>
            <h2 className="mt-3 font-display text-[34px] leading-[1.02] tracking-[-0.03em] text-forest md:text-[44px]">
              Carefully plotted.
              <br className="hidden sm:block" /> Quietly flexible.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="hidden min-h-10 items-center gap-1.5 text-[12px] font-semibold text-forest transition hover:text-saffron-deep sm:flex"
          >
            All destinations <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CIRCUITS.map((circuit, index) => (
            <button
              key={circuit.id}
              type="button"
              onClick={() => onStartCircuit(circuit)}
              className="group animate-fade-up overflow-hidden rounded-[24px] border border-sand bg-paper text-left soft-shadow transition duration-300 hover:-translate-y-1 hover:border-forest/25"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={assetPath(circuit.image)}
                  alt={circuit.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 photo-tint opacity-80" />
                <div className="absolute left-4 top-4">
                  <Tag tone="white">{circuit.eyebrow}</Tag>
                </div>
                <p className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/80">
                  {circuit.tagline}
                </p>
              </div>
              <div className="p-5">
                <h3 className="font-display text-[24px] leading-[1.08] tracking-[-0.02em] text-forest">
                  {circuit.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-muted">{circuit.blurb}</p>
                <div className="mt-5 flex items-end justify-between gap-4 border-t border-sand/70 pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                      {circuit.nights} nights · from
                    </p>
                    <p className="mt-1 text-sm font-bold text-forest">
                      {formatINR(circuit.fromPricePaise)}{" "}
                      <span className="font-normal text-muted">/ person</span>
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sand text-forest transition group-hover:border-forest group-hover:bg-forest group-hover:text-cream">
                    <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onNavigate("explore")}
          className="mt-5 flex min-h-10 items-center gap-1.5 text-[12px] font-semibold text-forest sm:hidden"
        >
          All destinations <ArrowRight size={14} aria-hidden="true" />
        </button>
      </section>

      <section className="container-page mt-16 md:mt-24">
        <div className="rounded-[30px] bg-[#efe9dd] p-5 md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="max-w-md">
              <Eyebrow>Travel your way</Eyebrow>
              <h2 className="mt-3 font-display text-[34px] leading-[1.02] tracking-[-0.03em] text-forest md:text-[42px]">
                Built around the people you love.
              </h2>
              <p className="mt-4 text-sm leading-6 text-forest-soft">
                Tell us who is coming. We will keep the pace, the walking and the room
                configurations honest from the first draft to the final day.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-[11px] font-semibold text-forest-soft">
                <HeartHandshake size={14} aria-hidden="true" />
                Care is not an upgrade here.
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  id: "family" as const,
                  icon: UsersRound,
                  title: "Families",
                  copy: "Room for grandparents, children and the naps in between.",
                  label: "Family yatra",
                },
                {
                  id: "senior" as const,
                  icon: Accessibility,
                  title: "Parents & seniors",
                  copy: "Step-free stays, shorter walks and a coordinator who checks in.",
                  label: "Senior-friendly",
                },
                {
                  id: "group" as const,
                  icon: HeartHandshake,
                  title: "Groups",
                  copy: "Seats, payments and one clear manifest for your community.",
                  label: "Group enquiry",
                },
              ].map((persona) => {
                const Icon = persona.icon;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => onStartPersona(persona.id)}
                    className="group flex flex-col rounded-[20px] border border-white/75 bg-paper/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-forest/25 hover:bg-paper"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-forest">
                      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-sm font-bold text-forest">{persona.title}</h3>
                    <p className="mt-2 flex-1 text-[12px] leading-5 text-muted">{persona.copy}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-[11px] font-semibold text-forest transition group-hover:gap-2">
                      {persona.label} <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-16 md:mt-24">
        <div className="relative overflow-hidden rounded-[30px] bg-forest px-5 py-8 text-cream md:px-10 md:py-12">
          <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full border border-cream/10" />
          <div className="absolute -bottom-36 right-24 h-80 w-80 rounded-full border border-cream/10" />
          <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <Eyebrow light>Our planning promise</Eyebrow>
              <h2 className="mt-3 max-w-md font-display text-[34px] leading-[1.03] tracking-[-0.03em] md:text-[42px]">
                No invented availability. No surprise arrival.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-cream/65">
                Every price is itemised. Every vendor is verified. And when something changes,
                you hear it from a person — not a banner.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: BadgeCheck,
                  title: "Verified partners",
                  copy: "KYC, permits and insurance checked before a service goes live.",
                },
                {
                  icon: Accessibility,
                  title: "Accessibility kept",
                  copy: "If you ask for wheelchair support, we never silently swap it away.",
                },
                {
                  icon: ShieldCheck,
                  title: "One honest price",
                  copy: "Taxes and fees shown before you pay. Balance clearly dated.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-cream/12 bg-cream/[0.055] p-5"
                  >
                    <Icon size={20} className="text-saffron" strokeWidth={1.6} aria-hidden="true" />
                    <h3 className="mt-5 text-[13px] font-semibold text-cream">{item.title}</h3>
                    <p className="mt-2 text-[12px] leading-5 text-cream/55">{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-16 md:mt-24">
        <div className="grid gap-6 rounded-[28px] border border-sand bg-paper p-5 md:grid-cols-[1.15fr_0.85fr] md:p-8">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <Eyebrow>The pilot route</Eyebrow>
              <h2 className="mt-3 font-display text-[32px] leading-[1.04] tracking-[-0.03em] text-forest md:text-[38px]">
                Bengaluru → Tirupati → Srikalahasti → Kanipakam → home.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-forest-soft">
                We are beginning with one route, done properly. Our team will personally
                reconfirm every stay and vehicle before your departure.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate("plan")}
                className="button-primary"
              >
                Build this yatra <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenDestination("tirupati")}
                className="button-secondary"
              >
                See Tirupati
              </button>
            </div>
          </div>
          <div className="rounded-2xl bg-ivory p-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
              <Route size={13} aria-hidden="true" /> Route preview
            </div>
            <div className="mt-5 space-y-0">
              {["Bengaluru", "Tirupati", "Srikalahasti", "Kanipakam"].map((place, index, list) => (
                <div key={place} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ${
                        index === 0 ? "bg-saffron text-white" : "bg-forest text-cream"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {index < list.length - 1 && <span className="h-6 w-px bg-forest/20" />}
                  </div>
                  <p className="pb-4 text-xs font-semibold text-forest">{place}</p>
                </div>
              ))}
            </div>
            <div className="mt-1 flex items-center gap-2 border-t border-sand pt-3 text-[11px] text-muted">
              <MapPin size={12} aria-hidden="true" /> {featured.state} ·{" "}
              {formatDateRange(trip.startDate, trip.days)}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-16 md:mt-24">
        <div className="flex flex-col gap-4 border-t border-sand pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-[12px] leading-5 text-muted">
            Planning for a group of 10 or more? A dedicated group desk will help with seats,
            payments and a shared manifest.
          </p>
          <button
            type="button"
            onClick={() => onStartPersona("group")}
            className="inline-flex min-h-10 items-center gap-1.5 self-start text-[12px] font-semibold text-forest transition hover:text-saffron-deep"
          >
            Talk to the group desk <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
