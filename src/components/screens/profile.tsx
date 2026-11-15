"use client";

import { useState } from "react";
import {
  Accessibility,
  Bell,
  Check,
  CreditCard,
  Globe2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserRound,
} from "lucide-react";
import { LANGUAGE_OPTIONS } from "@/lib/data";
import { cn } from "@/lib/format";
import type { AccessibilityId, Profile } from "@/lib/types";
import { BackButton, Divider, Eyebrow, Sheet, Tag } from "@/components/ui";
import { CARE_META } from "@/components/itinerary-view";

const CARE_OPTIONS: { id: AccessibilityId; copy: string }[] = [
  { id: "wheelchair", copy: "Accessible vehicle, attendant coordination and ramp access." },
  { id: "step-free", copy: "Lift access, step-free entrances and accessible bathrooms." },
  { id: "rest-stops", copy: "Shorter walking days, frequent sits and a slower pace." },
  { id: "vegetarian", copy: "Simple vegetarian meals at every stay and stop." },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-6 w-10 shrink-0 rounded-full transition",
        checked ? "bg-forest" : "bg-sand-deep",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow-sm transition-all",
          checked ? "left-[18px]" : "left-0.5",
        )}
      />
    </button>
  );
}

export function ProfileScreen({
  profile,
  language,
  onProfileChange,
  onLanguageChange,
  onBack,
  onToast,
  onResetDemo,
}: {
  profile: Profile;
  language: string;
  onProfileChange: (profile: Profile) => void;
  onLanguageChange: (code: string) => void;
  onBack: () => void;
  onToast: (message: string) => void;
  onResetDemo: () => void;
}) {
  const [form, setForm] = useState<Profile>(profile);
  const [resetOpen, setResetOpen] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(profile);
  const activeCare = form.careDefaults;

  const update = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const toggleCare = (id: AccessibilityId) => {
    update(
      "careDefaults",
      activeCare.includes(id)
        ? activeCare.filter((entry) => entry !== id)
        : [...activeCare, id],
    );
  };

  const save = () => {
    onProfileChange(form);
    onToast("Profile saved on this device.");
  };

  return (
    <div className="pb-24 md:pb-10">
      <div className="container-page pt-9 md:pt-12">
        <BackButton onClick={onBack} label="Back to home" />
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Your account</Eyebrow>
            <h1 className="mt-3 font-display text-[42px] leading-[0.98] tracking-[-0.04em] text-forest sm:text-[54px]">
              The person behind
              <span className="ml-2 italic text-saffron-deep">the yatra.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-forest-soft">
              Keep your details and care defaults close. This prototype stores them on this device
              only — no account is created.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="sand">
              <Lock size={10} aria-hidden="true" /> Demo profile
            </Tag>
            <button
              type="button"
              onClick={save}
              disabled={!dirty}
              className="button-primary self-start disabled:opacity-40"
            >
              {dirty ? "Save changes" : "Saved"} <Check size={15} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[300px_1fr] lg:items-start">
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[26px] border border-sand bg-paper">
              <div className="relative bg-forest px-5 pb-5 pt-6 text-cream">
                <div className="paper-grid absolute inset-0 opacity-[0.07]" aria-hidden="true" />
                <div className="relative flex items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-[16px] font-bold text-forest ring-4 ring-cream/10">
                    {initials(profile.name)}
                  </span>
                  <div>
                    <p className="font-display text-[21px] leading-tight">{profile.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] text-cream/55">
                      <MapPin size={9} aria-hidden="true" /> {profile.city}
                    </p>
                  </div>
                </div>
                <p className="relative mt-3 text-[9px] leading-4 text-cream/50">
                  YatraOne member since 2024 · Bengali, English, Hindi
                </p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-muted">
                    Care defaults
                  </p>
                  <span className="text-[8px] text-muted">Applied to new yatras</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {activeCare.length === 0 && (
                    <span className="pill bg-mist text-muted">No care defaults</span>
                  )}
                  {activeCare.map((id) => {
                    const meta = CARE_META[id];
                    const Icon = meta.icon;
                    return (
                      <span key={id} className="pill bg-sage text-forest-soft">
                        <Icon size={10} aria-hidden="true" />
                        {meta.short}
                      </span>
                    );
                  })}
                </div>
                <Divider className="my-3" />
                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Email</span>
                    <span className="max-w-[160px] truncate font-semibold text-forest">
                      {profile.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Mobile</span>
                    <span className="font-semibold text-forest">{profile.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Language</span>
                    <span className="font-semibold text-forest">
                      {LANGUAGE_OPTIONS.find((option) => option.code === language)?.native ??
                        "English"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-forest/15 bg-sage/60 p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-semibold text-forest">Your data stays here.</p>
                  <p className="mt-1 text-[9px] leading-4 text-forest-soft/80">
                    This is a local prototype. Profile edits, drafts and bookings are stored in
                    this browser only and are not sent to a server.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#d8a58f] bg-[#fbe7e1] px-4 py-2.5 text-[10px] font-semibold text-[#8d3d25] transition hover:bg-[#f7d9cf]"
            >
              <Trash2 size={13} aria-hidden="true" /> Clear demo data
            </button>
          </aside>

          <div className="space-y-4">
            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Personal details
                  </p>
                  <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em] text-forest">
                    How we reach you.
                  </h2>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage text-forest">
                  <UserRound size={16} aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Full name
                  </span>
                  <input
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    autoComplete="name"
                    className="input-shell h-12 text-[12px]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Home city
                  </span>
                  <input
                    value={form.city}
                    onChange={(event) => update("city", event.target.value)}
                    autoComplete="address-level2"
                    className="input-shell h-12 text-[12px]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-forest-soft">
                    <Mail size={11} aria-hidden="true" /> Email
                  </span>
                  <input
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    inputMode="email"
                    autoComplete="email"
                    className="input-shell h-12 text-[12px]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-forest-soft">
                    <Phone size={11} aria-hidden="true" /> Mobile
                  </span>
                  <input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    className="input-shell h-12 text-[12px]"
                  />
                </label>
              </div>
              <p className="mt-3 text-[9px] leading-4 text-muted">
                Your coordinator uses these details for pickup, care calls and vendor coordination.
              </p>
            </section>

            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Emergency contact
                  </p>
                  <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em] text-forest">
                    Someone we can call.
                  </h2>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7e7d5] text-saffron-deep">
                  <Phone size={15} aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Name
                  </span>
                  <input
                    value={form.emergencyName}
                    onChange={(event) => update("emergencyName", event.target.value)}
                    className="input-shell h-12 text-[12px]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Relationship
                  </span>
                  <input
                    value={form.emergencyRelation}
                    onChange={(event) => update("emergencyRelation", event.target.value)}
                    className="input-shell h-12 text-[12px]"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold text-forest-soft">
                    Phone
                  </span>
                  <input
                    value={form.emergencyPhone}
                    onChange={(event) => update("emergencyPhone", event.target.value)}
                    inputMode="tel"
                    className="input-shell h-12 text-[12px]"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Travel care defaults
                  </p>
                  <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em] text-forest">
                    What should we remember?
                  </h2>
                  <p className="mt-1 max-w-lg text-[10px] leading-5 text-muted">
                    These pre-fill new yatras. Your current booked yatra keeps its own care plan
                    until you change it explicitly.
                  </p>
                </div>
                <Accessibility size={18} className="text-forest-soft/50" aria-hidden="true" />
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {CARE_OPTIONS.map((option) => {
                  const meta = CARE_META[option.id];
                  const Icon = meta.icon;
                  const active = activeCare.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleCare(option.id)}
                      aria-pressed={active}
                      className={cn(
                        "flex items-start gap-2.5 rounded-xl border p-3 text-left transition",
                        active
                          ? "border-forest/30 bg-sage"
                          : "border-sand bg-cream/50 hover:border-forest/20 hover:bg-white",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                          active ? "bg-forest text-cream" : "bg-white text-forest-soft",
                        )}
                      >
                        <Icon size={13} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2 text-[10px] font-semibold text-forest">
                          {meta.label}
                          {active && (
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-forest text-cream">
                              <Check size={8} aria-hidden="true" />
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[9px] leading-4 text-muted">
                          {option.copy}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Language
                  </p>
                  <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em] text-forest">
                    Travel in your language.
                  </h2>
                  <p className="mt-1 text-[10px] leading-5 text-muted">
                    Five languages are planned at launch. This prototype previews the selected
                    language but keeps the sample content in English.
                  </p>
                </div>
                <Globe2 size={18} className="text-forest-soft/50" aria-hidden="true" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {LANGUAGE_OPTIONS.map((option) => {
                  const active = language === option.code;
                  return (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => onLanguageChange(option.code)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-left transition",
                        active
                          ? "border-forest bg-forest text-cream"
                          : "border-sand bg-cream/50 text-forest hover:border-forest/30 hover:bg-white",
                      )}
                    >
                      <span className="block text-[12px] font-semibold">{option.native}</span>
                      <span
                        className={cn(
                          "mt-0.5 block text-[8px] uppercase tracking-[0.08em]",
                          active ? "text-cream/50" : "text-muted",
                        )}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Notifications
                  </p>
                  <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em] text-forest">
                    Only the useful ones.
                  </h2>
                </div>
                <Bell size={18} className="text-forest-soft/50" aria-hidden="true" />
              </div>
              <div className="mt-4 divide-y divide-sand/70 rounded-xl border border-sand/70">
                {[
                  {
                    key: "notifyWhatsapp" as const,
                    label: "WhatsApp updates",
                    copy: "Vendor confirmations, driver details and day-of changes.",
                    icon: Smartphone,
                  },
                  {
                    key: "notifySms" as const,
                    label: "SMS fallback",
                    copy: "For poor signal areas and emergency coordination.",
                    icon: MessageCircle,
                  },
                  {
                    key: "notifyEmail" as const,
                    label: "Email receipts",
                    copy: "Booking receipts, invoices and the final itinerary.",
                    icon: Mail,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      className="flex items-center gap-3 px-3.5 py-3.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mist text-forest-soft">
                        <Icon size={13} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-forest">{item.label}</p>
                        <p className="mt-0.5 text-[9px] leading-4 text-muted">{item.copy}</p>
                      </div>
                      <Toggle
                        checked={form[item.key]}
                        onChange={() => update(item.key, !form[item.key])}
                        label={`Toggle ${item.label}`}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="mt-2.5 text-[9px] leading-4 text-muted">
                No marketing by default. We only send what is needed for this yatra.
              </p>
            </section>

            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Payment methods
                  </p>
                  <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em] text-forest">
                    Saved for later.
                  </h2>
                </div>
                <CreditCard size={18} className="text-forest-soft/50" aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-forest/20 bg-sage/50 p-3.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-cream">
                    <Smartphone size={14} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-forest">UPI · demo@yatraone</p>
                    <p className="mt-0.5 text-[9px] text-muted">Simulated · default for advances</p>
                  </div>
                  <Tag tone="sage">Default</Tag>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-sand bg-cream/50 p-3.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mist text-forest-soft">
                    <CreditCard size={14} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-forest">Visa ending 4242</p>
                    <p className="mt-0.5 text-[9px] text-muted">Demo card · no real credentials</p>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[9px] leading-4 text-muted">
                This prototype does not store real payment credentials. Methods are illustrative.
              </p>
            </section>

            <section className="rounded-[24px] border border-sand bg-paper p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Privacy & data
                  </p>
                  <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em] text-forest">
                    You are in control.
                  </h2>
                </div>
                <Lock size={18} className="text-forest-soft/50" aria-hidden="true" />
              </div>
              <div className="mt-3 space-y-2">
                {[
                  {
                    icon: MapPin,
                    title: "Stored on this device only",
                    copy: "Your draft, bookings and profile edits live in browser storage. No account is created.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "No real payments",
                    copy: "The checkout is simulated. No card, UPI or bank credentials are collected.",
                  },
                  {
                    icon: Trash2,
                    title: "Clear everything, anytime",
                    copy: "Use the button in the sidebar to remove the demo data from this browser.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-2.5 rounded-xl bg-ivory/70 p-3"
                    >
                      <Icon size={13} className="mt-0.5 shrink-0 text-forest-soft" aria-hidden="true" />
                      <div>
                        <p className="text-[10px] font-semibold text-forest">{item.title}</p>
                        <p className="mt-0.5 text-[9px] leading-4 text-muted">{item.copy}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex flex-col gap-3 rounded-[22px] border border-sand bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] leading-4 text-muted">
                {dirty ? "You have unsaved changes." : "All changes are saved on this device."}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm(profile)}
                  disabled={!dirty}
                  className="button-secondary min-h-10 px-4 text-[11px] disabled:opacity-40"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={!dirty}
                  className="button-primary min-h-10 px-4 text-[11px] disabled:opacity-40"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Clear all demo data?"
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setResetOpen(false)}
              className="button-secondary flex-1"
            >
              Keep my data
            </button>
            <button
              type="button"
              onClick={() => {
                setResetOpen(false);
                onResetDemo();
              }}
              className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#8d3d25] px-4 text-[13px] font-semibold text-white transition hover:bg-[#74301c]"
            >
              Clear everything
            </button>
          </div>
        }
      >
        <div className="rounded-2xl border border-[#d8a58f] bg-[#fbe7e1] p-4">
          <p className="flex items-center gap-2 text-[12px] font-semibold text-[#8d3d25]">
            <Trash2 size={15} aria-hidden="true" /> This cannot be undone.
          </p>
          <p className="mt-2 text-[10px] leading-5 text-[#8d3d25]/80">
            This removes your saved profile edits, the current draft, all prototype bookings and
            language preference from this browser. It does not affect any real account or vendor.
          </p>
        </div>
      </Sheet>
    </div>
  );
}
