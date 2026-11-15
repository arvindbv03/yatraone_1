"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Gauge,
  Info,
  MessageCircle,
  Send,
  ShieldAlert,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { formatDateRange, formatINR, travellersLabel, cn } from "@/lib/format";
import { routeLabel } from "@/lib/itinerary";
import { calculateQuote } from "@/lib/pricing";
import type {
  ChatMessage,
  ItineraryAdjustment,
  ItineraryDay,
  ItineraryStop,
  TripConfig,
} from "@/lib/types";
import { BackButton, Divider, Eyebrow, Sheet, Tag } from "@/components/ui";
import { CareTags, DayTabs, DayTimeline } from "@/components/itinerary-view";
import { RouteMap } from "@/components/route-map";

const QUICK_PROMPTS = [
  "Add more rest",
  "Make Day 3 lighter",
  "Wheelchair access?",
  "How firm is darshan?",
];

const REST_STOP: ItineraryStop = {
  time: "On request",
  title: "A flexible rest window",
  description:
    "A quiet hour with no fixed activity. Your coordinator can move it to fit the day, and the driver will wait.",
  type: "rest",
  duration: "60–90 min",
};

export function ItineraryScreen({
  trip,
  days,
  warnings,
  adjustments,
  onAdjustmentsChange,
  onBack,
  onContinue,
}: {
  trip: TripConfig;
  days: ItineraryDay[];
  warnings: string[];
  adjustments: ItineraryAdjustment;
  onAdjustmentsChange: (
    update: ItineraryAdjustment | ((previous: ItineraryAdjustment) => ItineraryAdjustment),
  ) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const quote = calculateQuote(trip);
  const [selectedDay, setSelectedDay] = useState(days[0]?.day ?? 1);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Namaskara. I drafted this yatra around your group and your care requests. Tell me if you want a slower day, more rest, or a clearer explanation of what is confirmed.",
    },
  ]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const active = days.find((day) => day.day === selectedDay) ?? days[0];

  const applyGentlerPace = () => {
    onAdjustmentsChange((previous) => ({
      ...previous,
      restEveryDay: true,
      changeLog: previous.changeLog.includes("A flexible rest window added to every day")
        ? previous.changeLog
        : [...previous.changeLog, "A flexible rest window added to every day"],
    }));
  };

  const applySoftDayThree = () => {
    onAdjustmentsChange((previous) => ({
      ...previous,
      softenDay: 3,
      changeLog: previous.changeLog.includes("Day 3 afternoon kept free")
        ? previous.changeLog
        : [...previous.changeLog, "Day 3 afternoon kept free"],
    }));
  };

  const resetAdjustments = () => {
    onAdjustmentsChange({ restEveryDay: false, softenDay: null, changeLog: [] });
    setMessages((previous) => [
      ...previous,
      {
        id: `reset-${Date.now()}`,
        role: "assistant",
        text: "I have reset the draft to the original generated plan. You can ask me to make changes again at any time.",
      },
    ]);
  };

  const ask = (raw: string) => {
    const text = raw.trim();
    if (!text || thinking) return;
    setMessages((previous) => [
      ...previous,
      { id: `user-${Date.now()}`, role: "user", text },
    ]);
    setThinking(true);

    timerRef.current = window.setTimeout(() => {
      const normalized = text.toLowerCase();
      let reply: string;

      if (
        normalized.includes("rest") &&
        !normalized.includes("darshan") &&
        (normalized.includes("more") ||
          normalized.includes("every") ||
          normalized.includes("slow") ||
          normalized.includes("gentle"))
      ) {
        applyGentlerPace();
        reply =
          "Done. I have added a flexible rest window to each day — it can move around the darshan queue. I have kept the temple visits but made the afternoons less rigid.";
      } else if (
        normalized.includes("day 3") ||
        normalized.includes("day three") ||
        normalized.includes("lighter") ||
        normalized.includes("light")
      ) {
        applySoftDayThree();
        reply =
          "I have kept the Day 3 afternoon free and marked it as a quiet window. The drive and morning temple visit stay, but there is no fixed activity after lunch.";
      } else if (
        normalized.includes("wheelchair") ||
        normalized.includes("access") ||
        normalized.includes("mobility") ||
        normalized.includes("step")
      ) {
        reply =
          "Wheelchair assistance is attached to this draft and to every transport leg. The vehicle has a ramp and your attendant travels with you. Some inner temple areas still have unavoidable steps — we will flag those before each visit rather than promise step-free access everywhere.";
      } else if (
        normalized.includes("darshan") ||
        normalized.includes("temple") ||
        normalized.includes("slot")
      ) {
        reply =
          "Darshan is the one thing we cannot promise. The temple issues slots on the day, and festival crowds can change the queue. Your coordinator reconfirms the timing each morning. If a slot cannot be confirmed, we will tell you and adjust the day — not quietly replace it.";
      } else if (
        normalized.includes("price") ||
        normalized.includes("cost") ||
        normalized.includes("budget") ||
        normalized.includes("advance")
      ) {
        reply = `The current estimate is ${formatINR(quote.totalPaise)} including taxes and our platform fee. At checkout you would pay ${formatINR(quote.advancePaise)} now, with the balance due before departure. This is an estimate until stay and transport are confirmed.`;
      } else if (
        normalized.includes("food") ||
        normalized.includes("meal") ||
        normalized.includes("vegetarian")
      ) {
        reply =
          "Every meal in this draft is vegetarian, with simple options for senior travellers. Meal breaks are deliberately generous, and the hotel kitchen is briefed on any allergies you add in checkout.";
      } else {
        reply =
          "I can slow down a day, add rest windows, explain darshan or access, or talk you through the current estimate. For anything medical or urgent, your human coordinator takes over — this assistant only edits the draft.";
      }

      setMessages((previous) => [
        ...previous,
        { id: `assistant-${Date.now()}`, role: "assistant", text: reply },
      ]);
      setThinking(false);
    }, 750);
  };

  const assistantNote =
    adjustments.softenDay === active?.day
      ? "Adjusted at your request — the afternoon is now free. Nothing outside this draft has changed."
      : undefined;

  const assistantExtraStop =
    adjustments.restEveryDay && active ? REST_STOP : undefined;

  const chatBody = (
    <div className="flex min-h-0 flex-col">
      <div className="hide-scrollbar max-h-[280px] space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[11px] leading-5",
                message.role === "user"
                  ? "rounded-br-md bg-forest text-cream"
                  : "rounded-bl-md bg-ivory text-forest-soft",
              )}
            >
              {message.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-ivory px-3.5 py-3">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-forest/40"
                  style={{ animationDelay: `${dot * 120}ms` }}
                />
              ))}
              <span className="ml-1 text-[9px] text-muted">Checking the draft</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.slice(0, 3).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => ask(prompt)}
            disabled={thinking}
            className="rounded-full border border-sand bg-cream px-2.5 py-1.5 text-[9px] font-semibold text-forest-soft transition hover:border-forest/30 hover:bg-white disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(draft);
          setDraft("");
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about pace, access, food…"
          maxLength={180}
          className="input-shell h-11 text-[11px]"
          aria-label="Message the demo assistant"
        />
        <button
          type="submit"
          disabled={!draft.trim() || thinking}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-cream transition hover:bg-forest-deep disabled:opacity-40"
        >
          <Send size={15} aria-hidden="true" />
        </button>
      </form>
      <p className="mt-2 text-[9px] leading-4 text-muted">
        Demo assistant. It edits this draft only; nothing is sent to a vendor.
      </p>
    </div>
  );

  if (!active) {
    return (
      <div className="container-page py-20">
        <p className="text-sm text-muted">
          Add at least one destination to build an itinerary.
        </p>
        <button type="button" onClick={onBack} className="button-primary mt-4">
          Back to the builder
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 md:pb-14">
      <div className="container-page pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <BackButton onClick={onBack} label="Back to the builder" />
          <Tag tone="sage">
            <Sparkles size={11} aria-hidden="true" />
            Draft v1 · not paid
          </Tag>
        </div>

        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Your itinerary</Eyebrow>
            <h1 className="mt-3 font-display text-[40px] leading-[0.98] tracking-[-0.04em] text-forest sm:text-[52px]">
              {trip.days} days, with room
              <span className="ml-2 italic text-saffron-deep">to breathe.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-forest-soft">
              Built around {travellersLabel(trip.adults, trip.seniors, trip.children)} and a{" "}
              {trip.pace} pace. Every temple visit has a rest window nearby, and we have not
              promised anything a vendor has not confirmed.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAssistantOpen(true)}
              className="button-secondary md:hidden"
            >
              <MessageCircle size={15} aria-hidden="true" /> Ask Yatra AI
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="button-primary hidden md:inline-flex"
            >
              Approve itinerary <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-sand bg-sand/70 sm:grid-cols-4">
          {[
            {
              icon: CalendarDays,
              label: "Dates",
              value: formatDateRange(trip.startDate, trip.days),
            },
            {
              icon: UsersRound,
              label: "Travellers",
              value: travellersLabel(trip.adults, trip.seniors, trip.children),
            },
            {
              icon: Gauge,
              label: "Pace",
              value: trip.pace === "relaxed" ? "Relaxed, senior-first" : "Balanced",
            },
            {
              icon: Clock3,
              label: "Temple stops",
              value: `${trip.destinations.length} sacred ${
                trip.destinations.length === 1 ? "stop" : "stops"
              }`,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-paper px-4 py-3.5">
                <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">
                  <Icon size={11} aria-hidden="true" />
                  {item.label}
                </p>
                <p className="mt-1.5 text-[11px] font-semibold leading-4 text-forest">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container-page mt-6 grid gap-6 lg:grid-cols-[1fr_348px] lg:items-start">
        <div className="space-y-4">
          {adjustments.changeLog.length > 0 && (
            <div className="animate-fade-in rounded-[20px] border border-saffron/30 bg-[#fbf3e7] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-saffron/15 text-saffron-deep">
                    <Sparkles size={13} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-forest">
                      Draft updated by your assistant
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {adjustments.changeLog.map((change) => (
                        <li
                          key={change}
                          className="flex items-start gap-1.5 text-[10px] leading-4 text-saffron-deep"
                        >
                          <Check size={10} className="mt-0.5 shrink-0" aria-hidden="true" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetAdjustments}
                  className="rounded-full border border-saffron/25 bg-paper/70 px-2.5 py-1 text-[9px] font-semibold text-saffron-deep transition hover:bg-white"
                >
                  Reset changes
                </button>
              </div>
            </div>
          )}

          <div className="rounded-[20px] border border-sand bg-paper p-2">
            <DayTabs days={days} activeDay={active.day} onChange={setSelectedDay} />
          </div>

          <DayTimeline
            day={active}
            assistantNote={assistantNote}
            assistantExtraStop={assistantExtraStop}
          />

          <div className="flex flex-col gap-3 rounded-[20px] border border-sand bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage text-forest">
                <MessageCircle size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-forest">
                  Want a different shape to the day?
                </p>
                <p className="mt-0.5 text-[10px] leading-4 text-muted">
                  Ask the assistant for more rest, a later start, or a shorter temple visit.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAssistantOpen(true)}
              className="button-secondary min-h-10 shrink-0 px-4 text-[11px]"
            >
              Ask for a change
            </button>
          </div>

          <div className="rounded-[20px] border border-sand bg-paper p-4">
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f7e7d5] text-saffron-deep">
                <Info size={15} aria-hidden="true" />
              </span>
              <div>
                <p className="text-[11px] font-semibold text-forest">
                  Approving this plan does not charge you.
                </p>
                <p className="mt-1 text-[10px] leading-5 text-muted">
                  Next you will choose a stay and vehicle. Availability is checked before
                  payment, and nothing is marked confirmed until the partner says yes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-[24px] border border-sand bg-paper p-2.5">
            <RouteMap trip={trip} />
            <p className="px-2 py-2 text-[10px] leading-4 text-muted">
              {routeLabel(trip)}
            </p>
          </div>

          <div className="rounded-[24px] border border-forest/15 bg-sage/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest-soft">
                Your care, carried through
              </p>
              <Sparkles size={13} className="text-forest-soft/60" aria-hidden="true" />
            </div>
            <CareTags trip={trip} className="mt-3" />
            <p className="mt-3 text-[10px] leading-5 text-forest-soft/80">
              These requests stay attached to every day, transfer and stay. If a partner cannot
              meet one, we will tell you before you pay — never swap it quietly.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-3 inline-flex min-h-8 items-center gap-1 text-[10px] font-semibold text-forest underline decoration-forest/25 underline-offset-4 transition hover:decoration-forest"
            >
              Edit care needs
            </button>
          </div>

          <div className="rounded-[24px] border border-[#e8d3c2] bg-[#fbf4ec] p-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-saffron-deep" aria-hidden="true" />
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-saffron-deep">
                What we are still confirming
              </p>
            </div>
            <ul className="mt-3 space-y-2.5">
              {warnings.map((warning) => (
                <li key={warning} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-saffron/70" />
                  <p className="text-[10px] leading-5 text-forest-soft">{warning}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-saffron/15 pt-2.5 text-[9px] leading-4 text-saffron-deep/80">
              No vendor is marked confirmed until they say yes in writing.
            </p>
          </div>

          <div className="rounded-[24px] border border-sand bg-paper p-4">
            <div className="flex items-center justify-between gap-2">
              <Eyebrow>Estimate so far</Eyebrow>
              <Tag tone="sage">Draft</Tag>
            </div>
            <p className="mt-3 font-display text-[34px] leading-none tracking-[-0.03em] text-forest">
              {formatINR(quote.totalPaise)}
            </p>
            <p className="mt-1.5 text-[10px] leading-4 text-muted">
              Includes stays, transport, selected extras, platform fee and GST.
            </p>
            <Divider className="my-3" />
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-forest-soft">Advance at checkout</span>
              <span className="font-bold text-forest">{formatINR(quote.advancePaise)}</span>
            </div>
            <button
              type="button"
              onClick={onContinue}
              className="button-primary mt-4 w-full"
            >
              Continue to stays <ArrowRight size={15} aria-hidden="true" />
            </button>
            <p className="mt-2 text-center text-[9px] leading-4 text-muted">
              No payment yet · availability checked before pay
            </p>
          </div>

          <div className="hidden overflow-hidden rounded-[24px] border border-sand bg-paper lg:block">
            <div className="flex items-center gap-2.5 border-b border-sand/70 bg-cream/60 p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest text-saffron">
                <Sparkles size={14} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-forest">
                  Yatra AI
                </p>
                <p className="text-[9px] text-muted">Draft assistant · demo</p>
              </div>
              <span className="rounded-full bg-sage px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-forest-soft">
                Beta
              </span>
            </div>
            <div className="p-4">{chatBody}</div>
          </div>
        </aside>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-cream/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">Estimate</p>
            <p className="text-[15px] font-bold text-forest">{formatINR(quote.totalPaise)}</p>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="button-primary flex-1 px-3 text-[12px]"
          >
            Approve itinerary <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Sheet
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        title="Yatra AI"
        footer={
          <p className="text-[10px] leading-4 text-muted">
            A demo assistant for the draft. Human coordinators handle anything urgent.
          </p>
        }
      >
        {chatBody}
      </Sheet>
    </div>
  );
}
