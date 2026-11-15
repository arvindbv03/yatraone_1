"use client";

import { useState } from "react";
import {
  Accessibility,
  ArrowRight,
  CarFront,
  Check,
  Compass,
  Gift,
  Headphones,
  Info,
  Lock,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { ADD_ONS } from "@/lib/data";
import { cn, formatINR, travellersLabel } from "@/lib/format";
import { addOnTotal, calculateQuote } from "@/lib/pricing";
import type { AddOn, TripConfig } from "@/lib/types";
import { BackButton, Divider, Eyebrow, PriceLine, Sheet, Tag } from "@/components/ui";

const ADDON_ICONS: Record<AddOn["icon"], typeof Compass> = {
  guide: Compass,
  wheelchair: Accessibility,
  meals: UtensilsCrossed,
  prasadam: Gift,
  transfer: CarFront,
  concierge: Headphones,
};

export function ExtrasScreen({
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
  const [lockedOpen, setLockedOpen] = useState(false);
  const wheelchairRequested = trip.accessibility.includes("wheelchair");
  const selectedCount = trip.addOnIds.length;

  const toggle = (addOn: AddOn) => {
    if (addOn.id === "wheelchair" && wheelchairRequested) {
      setLockedOpen(true);
      return;
    }
    const selected = trip.addOnIds.includes(addOn.id);
    onTripChange({
      ...trip,
      addOnIds: selected
        ? trip.addOnIds.filter((id) => id !== addOn.id)
        : [...trip.addOnIds, addOn.id],
    });
  };

  return (
    <div className="pb-32 md:pb-14">
      <div className="container-page pt-6">
        <BackButton onClick={onBack} label="Back to transport" />
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>04 · The finishing touches</Eyebrow>
            <h1 className="mt-3 font-display text-[40px] leading-[0.98] tracking-[-0.04em] text-forest sm:text-[50px]">
              Small things that
              <span className="ml-2 italic text-saffron-deep">change the day.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-forest-soft">
              A guide who knows the queue, a proper meal after darshan, someone to call when plans
              move. Add only what is useful; nothing is pre-ticked without a reason.
            </p>
          </div>
          <Tag tone="sage">
            <Sparkles size={12} aria-hidden="true" />
            {selectedCount} selected
          </Tag>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Optional extras
              </p>
              <p className="flex items-center gap-1.5 text-[10px] text-muted">
                <Info size={12} aria-hidden="true" />
                Remove or add until 7 days before departure
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ADD_ONS.map((addOn) => {
                const Icon = ADDON_ICONS[addOn.icon];
                const selected = trip.addOnIds.includes(addOn.id);
                const locked = addOn.id === "wheelchair" && wheelchairRequested;
                const total = addOnTotal(addOn, trip);

                return (
                  <article
                    key={addOn.id}
                    className={cn(
                      "flex flex-col rounded-[22px] border bg-paper p-4 transition",
                      selected
                        ? "border-forest/35 shadow-[0_14px_30px_-26px_rgba(20,56,47,0.5)]"
                        : "border-sand hover:border-forest/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          selected
                            ? "bg-forest text-saffron"
                            : "bg-sage text-forest-soft",
                        )}
                      >
                        <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(addOn)}
                        aria-pressed={selected}
                        aria-label={
                          locked
                            ? `${addOn.name} is linked to your wheelchair request`
                            : `${selected ? "Remove" : "Add"} ${addOn.name}`
                        }
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border transition",
                          selected
                            ? "border-forest bg-forest text-cream"
                            : "border-sand-deep bg-cream text-transparent hover:border-forest/40",
                        )}
                      >
                        {locked ? (
                          <Lock size={12} aria-hidden="true" className="text-cream" />
                        ) : (
                          <Check size={14} aria-hidden="true" />
                        )}
                      </button>
                    </div>

                    <div className="mt-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[13px] font-semibold text-forest">{addOn.name}</h2>
                        {addOn.badge && (
                          <span className="rounded-full bg-[#f7e7d5] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.09em] text-saffron-deep">
                            {addOn.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[10px] leading-5 text-muted">{addOn.description}</p>
                      {locked && (
                        <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-sage px-2.5 py-2 text-[9px] leading-4 text-forest-soft">
                          <Lock size={10} className="mt-0.5 shrink-0" aria-hidden="true" />
                          Included because wheelchair assistance is part of this yatra. It cannot
                          be removed here.
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-2 border-t border-sand/60 pt-3">
                      <div>
                        <p className="text-[13px] font-bold text-forest">{formatINR(total)}</p>
                        <p className="text-[9px] text-muted">{addOn.priceLabel}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em]",
                          selected
                            ? "bg-sage text-forest-soft"
                            : "bg-mist text-muted",
                        )}
                      >
                        {selected ? "Added" : "Optional"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="rounded-[22px] border border-sand bg-paper p-4">
              <div className="flex items-start gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage text-forest">
                  <Info size={15} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-forest">
                    What we deliberately do not sell
                  </p>
                  <p className="mt-1 text-[10px] leading-5 text-muted">
                    Guaranteed darshan, VIP passes, forced shopping stops or insurance added at
                    the last click. If we cannot deliver it honestly, it does not belong in your
                    checkout.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-sand bg-paper p-4 soft-shadow lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-2">
                <Eyebrow>Your extras</Eyebrow>
                <Tag tone={selectedCount > 0 ? "sage" : "sand"}>
                  {selectedCount} of {ADD_ONS.length}
                </Tag>
              </div>
              <p className="mt-2 text-[10px] leading-4 text-muted">
                For {travellersLabel(trip.adults, trip.seniors, trip.children)} across{" "}
                {trip.days} days.
              </p>

              <div className="mt-3 space-y-1.5">
                {trip.addOnIds.length === 0 && (
                  <p className="rounded-xl bg-ivory px-3 py-2.5 text-[10px] text-muted">
                    No extras added. The yatra still includes stays, transport and care support.
                  </p>
                )}
                {trip.addOnIds.map((id) => {
                  const addOn = ADD_ONS.find((entry) => entry.id === id);
                  if (!addOn) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-cream/70 px-2.5 py-2"
                    >
                      <span className="truncate text-[10px] text-forest-soft">{addOn.name}</span>
                      <span className="shrink-0 text-[10px] font-semibold tabular-nums text-forest">
                        {formatINR(addOnTotal(addOn, trip))}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Divider className="my-3" />
              <PriceLine
                label="Stay + transport"
                value={formatINR(quote.hotelPaise + quote.transportPaise)}
                muted
              />
              <PriceLine label="Extras" value={formatINR(quote.addOnsPaise)} muted />
              <div className="mt-2 flex items-end justify-between gap-3">
                <span className="text-[11px] font-semibold text-forest-soft">
                  Subtotal before tax
                </span>
                <span className="font-display text-[24px] leading-none text-forest">
                  {formatINR(quote.subtotalPaise)}
                </span>
              </div>
              <p className="mt-1.5 text-[9px] leading-4 text-muted">
                Platform fee and GST are shown in full at review. Nothing is hidden in the per-day
                rate.
              </p>

              <button type="button" onClick={onContinue} className="button-primary mt-4 w-full">
                Review your yatra <ArrowRight size={15} aria-hidden="true" />
              </button>
              <p className="mt-2 text-center text-[9px] leading-4 text-muted">
                {formatINR(quote.advancePaise)} advance at the next step
              </p>
            </div>

            <div className="rounded-[24px] border border-forest/15 bg-sage/60 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-forest-soft">
                Care note
              </p>
              <p className="mt-2 text-[10px] leading-5 text-forest-soft/80">
                {wheelchairRequested
                  ? "Wheelchair and attendant support stays linked to your care request. The guide and driver are briefed on it before departure."
                  : "No mobility support is currently requested. You can add it in the builder at any time before payment."}
              </p>
              <button
                type="button"
                onClick={onEditCare}
                className="mt-2 inline-flex min-h-8 items-center gap-1 text-[10px] font-semibold text-forest underline decoration-forest/25 underline-offset-4 transition hover:decoration-forest"
              >
                Review care needs
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-cream/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Extras</p>
            <p className="text-[15px] font-bold text-forest">{formatINR(quote.addOnsPaise)}</p>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="button-primary flex-1 px-3 text-[12px]"
          >
            Review yatra <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Sheet
        open={lockedOpen}
        onClose={() => setLockedOpen(false)}
        title="Wheelchair support is linked to your care"
      >
        <div className="flex items-start gap-3 rounded-2xl border border-forest/15 bg-sage/60 p-3.5">
          <Accessibility size={18} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
          <div>
            <p className="text-[12px] font-semibold text-forest">
              You asked for wheelchair assistance on this yatra.
            </p>
            <p className="mt-1 text-[10px] leading-5 text-forest-soft/80">
              The wheelchair and attendant are included because of that request. To remove the
              support, revise the care need in the builder — we will not quietly drop it at
              checkout.
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => setLockedOpen(false)}
            className="button-primary w-full"
          >
            Keep wheelchair support
          </button>
          <button
            type="button"
            onClick={() => {
              setLockedOpen(false);
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
