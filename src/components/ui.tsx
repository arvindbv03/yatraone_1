"use client";

import { ArrowLeft, Check, ChevronLeft, Star, X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/format";
import type { Screen } from "@/lib/types";

export function LogoMark({ size = 36, light = false }: { size?: number; light?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="36" height="36" rx="12" fill={light ? "#F8F4EA" : "#14382F"} />
      <path
        d="M10.5 9.5L18 18M25.5 9.5L18 18M18 18V27"
        stroke={light ? "#14382F" : "#F8F4EA"}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="27" r="1.9" fill="#C86F24" />
    </svg>
  );
}

export function Wordmark({ light = false, onClick }: { light?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg text-left",
        onClick ? "" : "cursor-default",
      )}
      aria-label="YatraOne home"
    >
      <LogoMark size={34} light={light} />
      <span
        className={cn(
          "font-feature text-[19px] font-semibold tracking-[-0.045em]",
          light ? "text-cream" : "text-forest",
        )}
      >
        Yatra
        <span className="font-display font-medium italic tracking-[-0.03em]">One</span>
      </span>
    </button>
  );
}

export function Eyebrow({
  children,
  className,
  light = false,
}: {
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]",
        light ? "text-sage-deep" : "text-saffron-deep",
        className,
      )}
    >
      <span className={cn("h-px w-5", light ? "bg-sage-deep/60" : "bg-saffron/60")} />
      {children}
    </p>
  );
}

export function Tag({
  children,
  tone = "sage",
  className,
}: {
  children: ReactNode;
  tone?: "sage" | "saffron" | "sand" | "forest" | "white" | "danger";
  className?: string;
}) {
  const tones = {
    sage: "bg-sage text-forest",
    saffron: "bg-[#f7e7d5] text-saffron-deep",
    sand: "bg-mist text-forest-soft",
    forest: "bg-forest text-white",
    white: "bg-white/90 text-forest backdrop-blur-sm",
    danger: "bg-[#fbe7e1] text-[#8d3d25]",
  };
  return <span className={cn("pill", tones[tone], className)}>{children}</span>;
}

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <span className="flex items-center gap-1 text-xs font-semibold text-forest">
      <Star size={13} className="fill-saffron text-saffron" aria-hidden="true" />
      {rating.toFixed(1)}
      {reviews !== undefined && (
        <span className="font-normal text-muted">({reviews.toLocaleString("en-IN")})</span>
      )}
    </span>
  );
}

export function ArrowButton({
  onClick,
  label,
  direction = "left",
  className,
  light = false,
}: {
  onClick: () => void;
  label: string;
  direction?: "left" | "right";
  className?: string;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border transition",
        light
          ? "border-white/30 bg-forest-deep/30 text-white backdrop-blur hover:bg-forest-deep/50"
          : "border-sand bg-paper/80 text-forest hover:border-forest hover:bg-white",
        className,
      )}
    >
      {direction === "left" ? (
        <ChevronLeft size={19} aria-hidden="true" />
      ) : (
        <ChevronLeft size={19} className="rotate-180" aria-hidden="true" />
      )}
    </button>
  );
}

export function BackButton({
  onClick,
  label = "Go back",
  light = false,
}: {
  onClick: () => void;
  label?: string;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-full pr-3 text-sm font-medium transition",
        light ? "text-white/90 hover:text-white" : "text-forest-soft hover:text-forest",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border",
          light ? "border-white/30 bg-forest-deep/20" : "border-sand bg-paper/70",
        )}
      >
        <ArrowLeft size={16} aria-hidden="true" />
      </span>
      {label}
    </button>
  );
}

const STEPS: { screen: Screen; label: string }[] = [
  { screen: "plan", label: "Plan" },
  { screen: "itinerary", label: "Itinerary" },
  { screen: "stay", label: "Stay" },
  { screen: "transport", label: "Travel" },
  { screen: "extras", label: "Extras" },
  { screen: "checkout", label: "Review" },
];

export function Stepper({
  current,
  onNavigate,
}: {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  const activeIndex = STEPS.findIndex((step) => step.screen === current);

  return (
    <div className="border-b border-sand/80 bg-ivory/80">
      <div className="container-page py-3">
        <div className="hidden items-center justify-between gap-2 md:flex">
          {STEPS.map((step, index) => {
            const done = index < activeIndex;
            const active = index === activeIndex;
            const canVisit = index < activeIndex;
            return (
              <div key={step.screen} className="flex flex-1 items-center gap-2.5">
                <button
                  type="button"
                  disabled={!canVisit}
                  onClick={() => canVisit && onNavigate(step.screen)}
                  className={cn(
                    "group flex items-center gap-2 rounded-full text-left transition",
                    canVisit ? "cursor-pointer" : "cursor-default",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold transition",
                      active
                        ? "border-forest bg-forest text-white"
                        : done
                          ? "border-forest/20 bg-sage text-forest group-hover:border-forest/40"
                          : "border-sand bg-transparent text-muted",
                    )}
                  >
                    {done ? <Check size={13} aria-hidden="true" /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      active ? "text-forest" : done ? "text-forest-soft" : "text-muted/70",
                    )}
                  >
                    {step.label}
                  </span>
                </button>
                {index < STEPS.length - 1 && (
                  <span
                    className={cn(
                      "h-px flex-1",
                      index < activeIndex ? "bg-forest/25" : "bg-sand",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
            Step {activeIndex + 1} of {STEPS.length}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-sand">
            <div
              className="h-full rounded-full bg-forest transition-all duration-500"
              style={{ width: `${((activeIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-forest">{STEPS[activeIndex]?.label}</span>
        </div>
      </div>
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="bottom-sheet-backdrop no-print"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn("bottom-sheet", className)}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sand/70 bg-cream/95 px-5 py-4 backdrop-blur sm:px-6">
          <h2 className="font-display text-xl text-forest">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-sand bg-paper text-forest transition hover:border-forest"
            aria-label="Close"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="sticky bottom-0 border-t border-sand/70 bg-cream/95 px-5 py-4 backdrop-blur sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function PriceLine({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={cn("text-sm", muted ? "text-muted" : "text-forest-soft")}>{label}</span>
      <span
        className={cn(
          "shrink-0 text-sm tabular-nums",
          strong ? "font-bold text-forest" : "font-medium text-forest",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-sand/80", className)} />;
}

export function Avatar({
  initials = "AR",
  size = 36,
  onClick,
}: {
  initials?: string;
  size?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open profile"
      className="flex items-center justify-center rounded-full bg-forest text-[11px] font-bold tracking-wide text-cream ring-2 ring-ivory transition hover:bg-forest-deep"
      style={{ width: size, height: size }}
    >
      {initials}
    </button>
  );
}

export function StepIcon({
  children,
  tone = "sage",
}: {
  children: ReactNode;
  tone?: "sage" | "saffron";
}) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
        tone === "sage" ? "bg-sage text-forest-soft" : "bg-[#f7e7d5] text-saffron-deep",
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  copy,
  action,
}: {
  icon: ReactNode;
  title: string;
  copy: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-sand bg-paper px-6 py-12 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-forest">
        {icon}
      </span>
      <h3 className="font-display text-xl text-forest">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{copy}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
