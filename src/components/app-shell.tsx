"use client";

import {
  CalendarDays,
  ChevronDown,
  Compass,
  Globe2,
  Home,
  Luggage,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGUAGE_OPTIONS } from "@/lib/data";
import { cn } from "@/lib/format";
import type { Screen } from "@/lib/types";
import { Avatar, Wordmark } from "./ui";

const NAV_ITEMS: { screen: Screen; label: string }[] = [
  { screen: "home", label: "Home" },
  { screen: "explore", label: "Explore" },
  { screen: "trips", label: "My Yatra" },
];

const MOBILE_NAV = [
  { screen: "home" as Screen, label: "Home", icon: Home },
  { screen: "explore" as Screen, label: "Explore", icon: Compass },
  { screen: "trips" as Screen, label: "My Yatra", icon: Luggage },
  { screen: "profile" as Screen, label: "Profile", icon: UserRound },
];

export function AppHeader({
  screen,
  language,
  onNavigate,
  onLanguageChange,
  onProfile,
}: {
  screen: Screen;
  language: string;
  onNavigate: (screen: Screen) => void;
  onLanguageChange: (code: string) => void;
  onProfile: () => void;
}) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!languageOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLanguageOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [languageOpen]);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-sand/70 bg-ivory/85 backdrop-blur-xl">
      <div className="container-page flex h-[68px] items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Wordmark onClick={() => onNavigate("home")} />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const active =
                screen === item.screen ||
                (item.screen === "trips" && (screen === "trip" || screen === "confirmation"));
              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => onNavigate(item.screen)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative min-h-10 rounded-full px-4 text-[13px] font-medium transition",
                    active
                      ? "bg-white text-forest shadow-[0_1px_0_rgba(20,56,47,0.06)]"
                      : "text-forest-soft hover:bg-white/60 hover:text-forest",
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-[11px] mx-auto h-1 w-1 rounded-full bg-saffron" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              aria-expanded={languageOpen}
              aria-haspopup="menu"
              className="flex min-h-10 items-center gap-1.5 rounded-full border border-sand bg-paper/70 px-3 text-[11px] font-bold tracking-wide text-forest transition hover:border-forest/40 hover:bg-white"
            >
              <Globe2 size={14} strokeWidth={1.8} aria-hidden="true" />
              {language}
              <ChevronDown
                size={12}
                className={cn("text-muted transition", languageOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            {languageOpen && (
              <div
                role="menu"
                className="animate-scale-in absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-sand bg-cream p-2 shadow-[0_24px_60px_-24px_rgba(20,56,47,0.4)]"
              >
                <div className="px-3 pb-2 pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Language
                  </p>
                  <p className="mt-1.5 text-[11px] leading-4 text-muted">
                    Five languages at launch. This prototype previews the English experience.
                  </p>
                </div>
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={language === option.code}
                    onClick={() => {
                      onLanguageChange(option.code);
                      setLanguageOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition",
                      language === option.code
                        ? "bg-forest text-cream"
                        : "text-forest hover:bg-sage/70",
                    )}
                  >
                    <span>
                      <span className="font-medium">{option.native}</span>
                      <span
                        className={cn(
                          "ml-2 text-[10px]",
                          language === option.code ? "text-cream/60" : "text-muted",
                        )}
                      >
                        {option.label}
                      </span>
                    </span>
                    {language === option.code && (
                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-cream/60">
                        Preview
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate("plan")}
            className="hidden min-h-10 items-center gap-2 rounded-full bg-forest px-4 text-[12px] font-semibold text-cream transition hover:bg-forest-deep lg:flex"
          >
            <Sparkles size={14} aria-hidden="true" />
            Plan a yatra
          </button>

          <Avatar size={36} onClick={onProfile} />
        </div>
      </div>
    </header>
  );
}

export function MobileBottomNav({
  screen,
  onNavigate,
}: {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <nav
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-sand/90 bg-cream/92 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto grid h-[60px] max-w-lg grid-cols-4 px-2">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const active =
            screen === item.screen ||
            (item.screen === "trips" && (screen === "trip" || screen === "confirmation"));
          return (
            <button
              key={item.screen}
              type="button"
              onClick={() => onNavigate(item.screen)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition",
                active ? "text-forest" : "text-muted hover:text-forest",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-9 items-center justify-center rounded-full transition",
                  active ? "bg-sage" : "",
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function SiteFooter({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <footer className="no-print mt-20 bg-forest-deep text-cream md:mt-28">
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Wordmark light onClick={() => onNavigate("home")} />
            <p className="mt-4 max-w-sm text-sm leading-6 text-cream/65">
              Pilgrimage travel, thoughtfully planned. Verified stays, accessible transport and
              senior-first care across South India.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-cream/60">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={12} aria-hidden="true" /> South India pilot
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={12} aria-hidden="true" /> Launching 2027
              </span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-deep/70">
              Explore
            </p>
            <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-cream/75">
              <button type="button" onClick={() => onNavigate("explore")} className="hover:text-white">
                Temples & circuits
              </button>
              <button type="button" onClick={() => onNavigate("plan")} className="hover:text-white">
                Build a yatra
              </button>
              <button type="button" onClick={() => onNavigate("trips")} className="hover:text-white">
                My Yatra
              </button>
              <button type="button" onClick={() => onNavigate("profile")} className="hover:text-white">
                Your profile
              </button>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sage-deep/70">
              Travel care
            </p>
            <div className="mt-4 flex flex-col items-start gap-2.5 text-sm text-cream/75">
              <span>Senior & mobility support</span>
              <span>Verified vendor network</span>
              <span>Transparent pricing</span>
              <span>24-hour trip assistance</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-cream/10 pt-5 text-[11px] leading-5 text-cream/45">
          <p>
            This is an interactive product prototype. Prices, ratings, availability and vendor
            confirmations are illustrative and do not represent live bookings. Photography via
            Wikimedia Commons and Unsplash.
          </p>
          <p className="mt-2">
            © 2026 YatraOne. Built for the way India travels. Tamil · Kannada · Telugu · Malayalam
            support planned at launch.
          </p>
        </div>
      </div>
    </footer>
  );
}
