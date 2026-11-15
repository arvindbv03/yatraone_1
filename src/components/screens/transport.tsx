"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Accessibility,
  ArrowRight,
  Briefcase,
  CarFront,
  Check,
  ChevronRight,
  CircleDollarSign,
  Fuel,
  Info,
  MapPin,
  Route,
  ShieldCheck,
  Snowflake,
  UsersRound,
  X,
} from "lucide-react";
import { getDestination, getVehicle, VEHICLES } from "@/lib/data";
import { cn, formatINR, plural } from "@/lib/format";
import { roadEstimate } from "@/lib/itinerary";
import { calculateQuote } from "@/lib/pricing";
import type { TripConfig, Vehicle } from "@/lib/types";
import { BackButton, Divider, Eyebrow, PriceLine, Sheet, Tag } from "@/components/ui";
import { assetPath } from "@/lib/paths";

const VEHICLE_IMAGES: Record<string, string> = {
  innova: assetPath("/images/car-1.jpg"),
  urbania: assetPath("/images/bus-1.jpg"),
  tempo: assetPath("/images/bus-1.jpg"),
};

const INCLUDED = [
  { icon: Fuel, label: "Fuel, tolls and parking" },
  { icon: CircleDollarSign, label: "Driver allowance" },
  { icon: UsersRound, label: "Private chauffeur, not a shared coach" },
  { icon: ShieldCheck, label: "24-hour trip support" },
];

export function TransportScreen({
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
  const vehicle = getVehicle(trip.vehicleId);
  const [detail, setDetail] = useState<Vehicle | null>(null);
  const [blockedOpen, setBlockedOpen] = useState(false);
  const mobilityRequested = trip.accessibility.includes("wheelchair");
  const currentIncompatible = mobilityRequested && !vehicle.accessible;

  const points = trip.destinations
    .map((id) => getDestination(id))
    .filter((destination) => destination !== undefined);
  const legs = points.map((destination, index) => {
    const previous = index === 0 ? null : points[index - 1];
    const estimate = previous
      ? roadEstimate(previous.coords, destination.coords)
      : roadEstimate(trip.origin, destination.coords);
    return {
      from: previous?.city ?? trip.origin,
      to: destination.city,
      label: destination.shortName,
      km: estimate.km,
      time: estimate.label,
    };
  });
  if (points.length > 0) {
    const last = points[points.length - 1];
    const back = roadEstimate(last.coords, trip.origin);
    legs.push({
      from: last.city,
      to: trip.origin,
      label: "Return",
      km: back.km,
      time: back.label,
    });
  }
  const totalKm = legs.reduce((sum, leg) => sum + leg.km, 0);

  const choose = (entry: Vehicle) => {
    if (mobilityRequested && !entry.accessible) return;
    onTripChange({ ...trip, vehicleId: entry.id });
    setDetail(null);
  };

  const handleContinue = () => {
    if (currentIncompatible) {
      setBlockedOpen(true);
      return;
    }
    onContinue();
  };

  return (
    <div className="pb-32 md:pb-14">
      <div className="container-page pt-6">
        <BackButton onClick={onBack} label="Back to stays" />
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>03 · How you travel</Eyebrow>
            <h1 className="mt-3 font-display text-[40px] leading-[0.98] tracking-[-0.04em] text-forest sm:text-[50px]">
              The road, made
              <span className="ml-2 italic text-saffron-deep">comfortable.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-forest-soft">
              One private vehicle for the whole yatra, with a chauffeur who knows the temple
              queues and a pace that leaves room for rest stops.
            </p>
          </div>
          <Tag tone="sage">
            <Route size={12} aria-hidden="true" />
            {totalKm} km · {legs.length} legs
          </Tag>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-4">
            {mobilityRequested && (
              <div className="flex items-start gap-2.5 rounded-[18px] border border-forest/15 bg-sage/60 px-4 py-3.5">
                <Accessibility
                  size={16}
                  className="mt-0.5 shrink-0 text-forest"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[11px] font-semibold text-forest">
                    Wheelchair assistance is part of this yatra.
                  </p>
                  <p className="mt-0.5 text-[10px] leading-5 text-forest-soft/80">
                    Only a vehicle with a ramp and wheelchair space can be selected. The other
                    options stay visible so you can see what you are trading, not so we can
                    quietly switch you into one.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-[22px] border border-sand bg-paper p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                  Your route with this vehicle
                </p>
                <span className="text-[9px] text-muted">Estimates, not live traffic</span>
              </div>
              <ol className="mt-3 divide-y divide-sand/60">
                {legs.map((leg) => (
                  <li
                    key={`${leg.from}-${leg.to}`}
                    className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sage text-forest">
                      <MapPin size={12} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-forest">
                        {leg.from} → {leg.to}
                      </p>
                      <p className="text-[9px] text-muted">
                        {leg.label === "Return" ? "Return journey" : leg.label}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-semibold text-forest">{leg.km} km</p>
                      <p className="text-[9px] text-muted">{leg.time}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {mobilityRequested && (
                <p className="mt-3 rounded-lg bg-ivory px-3 py-2 text-[9px] leading-4 text-muted">
                  A rest stop is planned every 90 minutes. Your attendant travels with you, and
                  the driver helps with boarding and luggage.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                {VEHICLES.length} vehicle options
              </p>
              <p className="flex items-center gap-1.5 text-[10px] text-muted">
                <Snowflake size={12} aria-hidden="true" />
                Air-conditioned · private group
              </p>
            </div>

            {VEHICLES.map((entry) => {
              const selected = entry.id === trip.vehicleId;
              const incompatible = mobilityRequested && !entry.accessible;
              const total = entry.pricePerDayPaise * trip.days;

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
                    <div className="relative h-44 sm:h-full sm:min-h-[220px]">
                      <Image
                        src={VEHICLE_IMAGES[entry.id] ?? "/images/car-1.jpg"}
                        alt={`${entry.name} vehicle`}
                        fill
                        sizes="(max-width: 640px) 100vw, 210px"
                        className={cn("object-cover", incompatible && "grayscale")}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/35 to-transparent" />
                      {entry.recommendedForMobility && (
                        <span className="absolute left-2.5 top-2.5 rounded-full bg-cream/90 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-forest backdrop-blur">
                          Recommended for you
                        </span>
                      )}
                      {selected && (
                        <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-forest text-cream shadow-sm">
                          <Check size={14} aria-hidden="true" />
                        </span>
                      )}
                      {incompatible && (
                        <span className="absolute inset-x-2.5 bottom-2.5 rounded-lg bg-forest-deep/80 px-2.5 py-1.5 text-center text-[8px] font-bold uppercase tracking-[0.09em] text-cream backdrop-blur">
                          Not available for wheelchair
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
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted">
                            <span className="flex items-center gap-1">
                              <UsersRound size={10} aria-hidden="true" />
                              {entry.capacity}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase size={10} aria-hidden="true" />
                              {entry.luggage}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => choose(entry)}
                          disabled={incompatible}
                          aria-pressed={selected}
                          aria-label={
                            incompatible
                              ? `${entry.name} is unavailable while wheelchair assistance is requested`
                              : `Choose ${entry.name}`
                          }
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                            selected
                              ? "border-forest bg-forest text-cream"
                              : incompatible
                                ? "cursor-not-allowed border-sand bg-mist text-muted/50"
                                : "border-sand-deep bg-cream text-transparent hover:border-forest/40",
                          )}
                        >
                          {incompatible ? (
                            <X size={13} aria-hidden="true" />
                          ) : (
                            <Check size={14} aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {entry.features.map((feature) => (
                          <span
                            key={feature}
                            className="rounded-full bg-mist px-2.5 py-1 text-[9px] font-medium text-forest-soft"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {entry.accessible ? (
                        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sage px-2.5 py-1 text-[9px] font-semibold text-forest">
                          <Accessibility size={10} aria-hidden="true" />
                          Ramp + wheelchair space
                        </p>
                      ) : (
                        <p className="mt-3 text-[9px] leading-4 text-muted">{entry.note}</p>
                      )}

                      {incompatible && (
                        <div className="mt-3 rounded-xl border border-saffron/25 bg-[#fbf3e7] px-3 py-2.5 text-[9px] leading-4 text-saffron-deep">
                          This vehicle cannot carry a wheelchair. It is hidden from selection
                          while your wheelchair request is active.
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-sand/70 pt-3">
                        <div>
                          <p className="text-[15px] font-bold text-forest">
                            {formatINR(total)}
                            <span className="ml-1 text-[9px] font-normal text-muted">
                              for {plural(trip.days, "day")}
                            </span>
                          </p>
                          <p className="mt-0.5 text-[9px] text-muted">
                            {formatINR(entry.pricePerDayPaise)} / day · driver included
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDetail(entry)}
                          className="inline-flex min-h-9 items-center gap-1 rounded-full border border-sand bg-cream px-3 text-[10px] font-semibold text-forest transition hover:border-forest/30 hover:bg-white"
                        >
                          Details <ChevronRight size={12} aria-hidden="true" />
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
                <Eyebrow>Your transport</Eyebrow>
                <Tag tone={vehicle.accessible ? "sage" : "sand"}>
                  {vehicle.accessible ? "Accessible" : "Selected"}
                </Tag>
              </div>
              <div className="mt-3 overflow-hidden rounded-2xl border border-sand/70">
                <div className="relative h-32">
                  <Image
                    src={VEHICLE_IMAGES[vehicle.id] ?? "/images/car-1.jpg"}
                    alt={vehicle.name}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  <div className="photo-tint absolute inset-0" />
                  <div className="absolute inset-x-3 bottom-2.5">
                    <p className="font-display text-[19px] leading-tight text-white">
                      {vehicle.name}
                    </p>
                    <p className="mt-0.5 text-[9px] text-white/70">{vehicle.category}</p>
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted">Duration</span>
                    <span className="font-semibold text-forest">{plural(trip.days, "day")}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted">Route</span>
                    <span className="font-semibold text-forest">{totalKm} km estimated</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted">Wheelchair</span>
                    <span className="font-semibold text-forest">
                      {vehicle.accessible ? "Ramp fitted" : "Not supported"}
                    </span>
                  </div>
                </div>
              </div>

              {currentIncompatible && (
                <div className="mt-3 rounded-xl border border-saffron/30 bg-[#fbf3e7] px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-saffron-deep">
                    This vehicle cannot meet your wheelchair request.
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-saffron-deep/80">
                    Switch to the accessible van, or revise your care needs explicitly.
                  </p>
                </div>
              )}

              <Divider className="my-3" />
              <PriceLine
                label={`${formatINR(vehicle.pricePerDayPaise)} × ${plural(trip.days, "day")}`}
                value={formatINR(quote.transportPaise)}
                muted
              />
              <div className="mt-2 flex items-end justify-between gap-3">
                <span className="text-[11px] font-semibold text-forest-soft">Transport total</span>
                <span className="font-display text-[25px] leading-none text-forest">
                  {formatINR(quote.transportPaise)}
                </span>
              </div>

              <button type="button" onClick={handleContinue} className="button-primary mt-4 w-full">
                Continue to extras <ArrowRight size={15} aria-hidden="true" />
              </button>
              <p className="mt-2 text-center text-[9px] leading-4 text-muted">
                Vehicle availability is checked before payment.
              </p>
            </div>

            <div className="rounded-[24px] border border-sand bg-paper p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                Included with the vehicle
              </p>
              <ul className="mt-3 space-y-2.5">
                {INCLUDED.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.label}
                      className="flex items-center gap-2 text-[10px] text-forest-soft"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sage text-forest">
                        <Icon size={11} aria-hidden="true" />
                      </span>
                      {item.label}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 border-t border-sand/70 pt-2.5 text-[9px] leading-4 text-muted">
                Not included: temple entry tickets, darshan charges, personal shopping or optional
                tips. We will never add these without asking.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-cream/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Transport</p>
            <p className="text-[15px] font-bold text-forest">{formatINR(quote.transportPaise)}</p>
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
        title={detail?.name ?? "Vehicle details"}
        footer={
          detail && (
            <button
              type="button"
              onClick={() => choose(detail)}
              disabled={mobilityRequested && !detail.accessible}
              className="button-primary w-full disabled:opacity-50"
            >
              {mobilityRequested && !detail.accessible
                ? "Unavailable for your care request"
                : detail.id === trip.vehicleId
                  ? "Keep this vehicle"
                  : "Choose this vehicle"}
              {!(mobilityRequested && !detail.accessible) && (
                <Check size={15} aria-hidden="true" />
              )}
            </button>
          )
        }
      >
        {detail && (
          <div>
            <div className="relative h-44 overflow-hidden rounded-2xl">
              <Image
                src={VEHICLE_IMAGES[detail.id] ?? "/images/car-1.jpg"}
                alt={detail.name}
                fill
                sizes="(max-width: 640px) 100vw, 480px"
                className={cn(
                  "object-cover",
                  mobilityRequested && !detail.accessible && "grayscale",
                )}
              />
              <div className="photo-tint absolute inset-0" />
              <div className="absolute inset-x-4 bottom-3">
                <p className="font-display text-[24px] text-white">{detail.name}</p>
                <p className="text-[10px] text-white/70">{detail.category}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-sand bg-cream/60 p-3">
                <p className="text-[9px] uppercase tracking-[0.12em] text-muted">Capacity</p>
                <p className="mt-1 text-[11px] font-semibold text-forest">{detail.capacity}</p>
              </div>
              <div className="rounded-xl border border-sand bg-cream/60 p-3">
                <p className="text-[9px] uppercase tracking-[0.12em] text-muted">Luggage</p>
                <p className="mt-1 text-[11px] font-semibold text-forest">{detail.luggage}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted">
                In the vehicle
              </p>
              <ul className="mt-2 space-y-2">
                {detail.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-[11px] leading-5 text-forest-soft"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sage text-forest">
                      <Check size={9} aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={cn(
                "mt-4 rounded-xl border p-3",
                detail.accessible
                  ? "border-forest/15 bg-sage/60"
                  : "border-sand bg-cream/70",
              )}
            >
              <p className="flex items-center gap-1.5 text-[10px] font-semibold text-forest">
                {detail.accessible ? (
                  <Accessibility size={12} aria-hidden="true" />
                ) : (
                  <Info size={12} aria-hidden="true" />
                )}
                {detail.accessible ? "Mobility support" : "Mobility note"}
              </p>
              <p className="mt-1 text-[10px] leading-5 text-forest-soft">{detail.note}</p>
            </div>

            <div className="mt-4 rounded-xl border border-sand bg-cream p-3">
              <PriceLine
                label={`${formatINR(detail.pricePerDayPaise)} × ${plural(trip.days, "day")}`}
                value={formatINR(detail.pricePerDayPaise * trip.days)}
                strong
              />
              <p className="mt-1 text-[9px] leading-4 text-muted">
                Chauffeur, fuel, tolls and parking included. The same vehicle stays with your
                group for the full yatra.
              </p>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet
        open={blockedOpen}
        onClose={() => setBlockedOpen(false)}
        title="This vehicle cannot take a wheelchair"
      >
        <div className="flex items-start gap-3 rounded-2xl border border-saffron/30 bg-[#fbf3e7] p-3.5">
          <CarFront size={18} className="mt-0.5 shrink-0 text-saffron-deep" aria-hidden="true" />
          <div>
            <p className="text-[12px] font-semibold text-forest">
              {vehicle.name} does not have a ramp or wheelchair space.
            </p>
            <p className="mt-1 text-[10px] leading-5 text-saffron-deep/80">
              Wheelchair assistance is active on this yatra. We will not continue with a vehicle
              that cannot carry it.
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => {
              onTripChange({ ...trip, vehicleId: "urbania" });
              setBlockedOpen(false);
            }}
            className="button-primary w-full"
          >
            Switch to the accessible van
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
      </Sheet>
    </div>
  );
}
