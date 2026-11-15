"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, HeartHandshake, Pencil, X } from "lucide-react";
import {
  DEFAULT_PROFILE,
  DEFAULT_TRIP,
  DESTINATIONS,
  LANGUAGE_OPTIONS,
  getDestination,
  getHotel,
  getVehicle,
} from "@/lib/data";
import { cn } from "@/lib/format";
import { buildItinerary } from "@/lib/itinerary";
import { calculateQuote } from "@/lib/pricing";
import type {
  Booking,
  Circuit,
  ItineraryAdjustment,
  PaymentMethod,
  Profile,
  Screen,
  TravellerDetails,
  TripConfig,
  VendorStatus,
} from "@/lib/types";
import { AppHeader, MobileBottomNav, SiteFooter } from "@/components/app-shell";
import { Stepper } from "@/components/ui";
import { CARE_META } from "@/components/itinerary-view";
import { HomeScreen } from "@/components/screens/home";
import { ExploreScreen } from "@/components/screens/explore";
import { DestinationScreen } from "@/components/screens/destination";
import { PlanScreen } from "@/components/screens/plan";
import { ItineraryScreen } from "@/components/screens/itinerary";
import { StayScreen } from "@/components/screens/stay";
import { TransportScreen } from "@/components/screens/transport";
import { ExtrasScreen } from "@/components/screens/extras";
import { CheckoutScreen } from "@/components/screens/checkout";
import { ConfirmationScreen } from "@/components/screens/confirmation";
import { TripsScreen } from "@/components/screens/trips";
import { TripDetailScreen } from "@/components/screens/trip-detail";
import { ProfileScreen } from "@/components/screens/profile";

const STORAGE_KEY = "yatraone.prototype.v1";

const FLOW_SCREENS: Screen[] = [
  "plan",
  "itinerary",
  "stay",
  "transport",
  "extras",
  "checkout",
];

const FOOTER_SCREENS: Screen[] = [
  "home",
  "explore",
  "destination",
  "trips",
  "trip",
  "profile",
];

const VALID_SCREENS: Screen[] = [
  "home",
  "explore",
  "destination",
  "plan",
  "itinerary",
  "stay",
  "transport",
  "extras",
  "checkout",
  "confirmation",
  "trips",
  "trip",
  "profile",
];

const EMPTY_ADJUSTMENTS: ItineraryAdjustment = {
  restEveryDay: false,
  softenDay: null,
  changeLog: [],
};

type PersistedState = {
  trip: TripConfig;
  bookings: Booking[];
  profile: Profile;
  language: string;
  hasStarted: boolean;
  adjustments: ItineraryAdjustment;
  activeReference: string | null;
};

type Route = {
  screen: Screen;
  destinationId?: string;
  reference?: string;
};

function parseRoute(hash: string): Route {
  const raw = hash.replace(/^#\/?/, "");
  const [root, rawParam] = raw.split("/");
  const param = rawParam ? decodeURIComponent(rawParam) : undefined;

  if (!root) return { screen: "home" };
  if (root === "destination") {
    return param
      ? { screen: "destination", destinationId: param }
      : { screen: "explore" };
  }
  if (root === "trip") {
    return param ? { screen: "trip", reference: param } : { screen: "trips" };
  }
  if (root === "confirmation") {
    return param
      ? { screen: "confirmation", reference: param }
      : { screen: "confirmation" };
  }
  if (VALID_SCREENS.includes(root as Screen)) {
    return { screen: root as Screen };
  }
  return { screen: "home" };
}

function snapshotTrip(trip: TripConfig): TripConfig {
  return {
    ...trip,
    destinations: [...trip.destinations],
    accessibility: [...trip.accessibility],
    localStops: [...trip.localStops],
    addOnIds: [...trip.addOnIds],
  };
}

function normalizeTrip(value?: Partial<TripConfig> | null): TripConfig {
  if (!value) return snapshotTrip(DEFAULT_TRIP);
  return {
    ...DEFAULT_TRIP,
    ...value,
    destinations:
      Array.isArray(value.destinations) && value.destinations.length > 0
        ? [...value.destinations]
        : [...DEFAULT_TRIP.destinations],
    accessibility: Array.isArray(value.accessibility)
      ? [...value.accessibility]
      : [...DEFAULT_TRIP.accessibility],
    localStops: Array.isArray(value.localStops) ? [...value.localStops] : [],
    addOnIds: Array.isArray(value.addOnIds) ? [...value.addOnIds] : [],
  };
}

function readPersistedState(): PersistedState {
  const fallback: PersistedState = {
    trip: snapshotTrip(DEFAULT_TRIP),
    bookings: [],
    profile: { ...DEFAULT_PROFILE },
    language: "EN",
    hasStarted: false,
    adjustments: EMPTY_ADJUSTMENTS,
    activeReference: null,
  };

  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const stored = JSON.parse(raw) as Partial<PersistedState>;
    const bookings = Array.isArray(stored.bookings) ? stored.bookings : [];
    const savedReference =
      typeof stored.activeReference === "string" ? stored.activeReference : null;
    const activeReference = bookings.some(
      (booking) => booking.reference === savedReference,
    )
      ? savedReference
      : bookings[0]?.reference ?? null;

    return {
      trip: normalizeTrip(stored.trip),
      bookings,
      profile: stored.profile
        ? { ...DEFAULT_PROFILE, ...stored.profile }
        : fallback.profile,
      language: typeof stored.language === "string" ? stored.language : "EN",
      hasStarted: typeof stored.hasStarted === "boolean" ? stored.hasStarted : false,
      adjustments: stored.adjustments ?? EMPTY_ADJUSTMENTS,
      activeReference,
    };
  } catch {
    return fallback;
  }
}

function readInitialRoute(state: PersistedState): Route {
  if (typeof window === "undefined") return { screen: "home" };
  const route = parseRoute(window.location.hash);

  if (route.screen === "trip" || route.screen === "confirmation") {
    const reference = route.reference ?? state.activeReference;
    if (
      !reference ||
      !state.bookings.some((booking) => booking.reference === reference)
    ) {
      return { screen: "trips" };
    }
    return { ...route, reference };
  }

  if (route.screen === "destination" && !route.destinationId) {
    return { ...route, destinationId: DESTINATIONS[0].id };
  }

  return route;
}

function buildVendorStatuses(trip: TripConfig, quote: ReturnType<typeof calculateQuote>): VendorStatus[] {
  const hotel = getHotel(trip.hotelId);
  const vehicle = getVehicle(trip.vehicleId);
  const hasWheelchair = trip.accessibility.includes("wheelchair");
  const hasGuide = trip.addOnIds.includes("guide");

  const statuses: VendorStatus[] = [
    {
      id: "stay",
      label: `Stay · ${hotel.name}`,
      state: "requested",
      detail: `${quote.rooms} rooms for ${quote.nights} nights. The stay partner has been asked to confirm; this is not locked yet.`,
    },
    {
      id: "vehicle",
      label: `Vehicle · ${vehicle.name}`,
      state: "confirmed",
      detail: `A partner vehicle is allocated for all ${trip.days} days. Driver details are shared 48 hours before departure.`,
    },
  ];

  if (hasWheelchair) {
    statuses.push({
      id: "wheelchair",
      label: "Wheelchair + attendant",
      state: "requested",
      detail:
        "A lightweight wheelchair and attendant have been requested for the full route. Assignment follows the stay confirmation.",
    });
  }

  if (hasGuide) {
    statuses.push({
      id: "guide",
      label: "Local guide",
      state: "confirmed",
      detail:
        "A Tamil- and English-speaking guide is allocated for the two main temple days.",
    });
  }

  statuses.push({
    id: "darshan",
    label: "Temple darshan",
    state: "subject_to_temple",
    detail:
      "Darshan slots are issued by the temple on the day. We do not sell a guarantee and will reconfirm the queue each morning.",
  });

  return statuses;
}

function makeReference(trip: TripConfig) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let index = 0; index < 4; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `YO-${trip.startDate.slice(0, 4)}-${suffix}`;
}

function careVehicle(accessibility: TripConfig["accessibility"]) {
  return accessibility.includes("wheelchair") ? "urbania" : "innova";
}

function careAddOns(accessibility: TripConfig["accessibility"]) {
  return accessibility.includes("wheelchair")
    ? ["guide", "wheelchair", "meals"]
    : ["guide", "meals"];
}

export function YatraApp() {
  const [initial] = useState(readPersistedState);
  const [initialRoute] = useState(() => readInitialRoute(initial));
  const [screen, setScreen] = useState<Screen>(initialRoute.screen);
  const [destinationId, setDestinationId] = useState(
    initialRoute.destinationId ?? DESTINATIONS[0].id,
  );
  const [trip, setTrip] = useState<TripConfig>(initial.trip);
  const [bookings, setBookings] = useState<Booking[]>(initial.bookings);
  const [profile, setProfile] = useState<Profile>(initial.profile);
  const [language, setLanguage] = useState(initial.language);
  const [hasStarted, setHasStarted] = useState(initial.hasStarted);
  const [adjustments, setAdjustments] = useState<ItineraryAdjustment>(
    initial.adjustments,
  );
  const [activeReference, setActiveReference] = useState<string | null>(
    initialRoute.reference ?? initial.activeReference,
  );
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const itinerary = useMemo(() => buildItinerary(trip), [trip]);
  const quote = useMemo(() => calculateQuote(trip), [trip]);
  const selectedDestination =
    getDestination(destinationId) ?? DESTINATIONS[0];
  const activeBooking = activeReference
    ? bookings.find((booking) => booking.reference === activeReference)
    : bookings[0];
  const visibleScreen: Screen =
    (screen === "trip" || screen === "confirmation") && !activeBooking
      ? "trips"
      : screen;

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4300);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const navigate = useCallback(
    (
      next: Screen,
      options?: {
        destinationId?: string;
        reference?: string;
        replace?: boolean;
      },
    ) => {
      if (next === "destination" && options?.destinationId) {
        setDestinationId(options.destinationId);
      }
      if (options?.reference !== undefined) {
        setActiveReference(options.reference);
      }
      setScreen(next);

      if (typeof window === "undefined") return;
      let path = `#/${next}`;
      if (next === "destination") {
        path = `#/destination/${options?.destinationId ?? destinationId}`;
      } else if (next === "trip") {
        path = `#/trip/${options?.reference ?? activeReference ?? ""}`;
      } else if (next === "confirmation") {
        path = `#/confirmation/${options?.reference ?? activeReference ?? ""}`;
      } else if (next === "home") {
        path = "#/";
      }

      if (options?.replace) {
        window.history.replaceState(null, "", path);
      } else if (window.location.hash !== path) {
        window.location.hash = path;
      }
    },
    [activeReference, destinationId],
  );

  useEffect(() => {
    const applyHash = () => {
      const route = parseRoute(window.location.hash);
      setScreen(route.screen);
      if (route.screen === "destination") {
        setDestinationId(route.destinationId ?? DESTINATIONS[0].id);
      }
      if (route.reference) setActiveReference(route.reference);
    };

    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    const state: PersistedState = {
      trip,
      bookings,
      profile,
      language,
      hasStarted,
      adjustments,
      activeReference,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Local storage can be unavailable in private windows; the prototype still works in memory.
    }
  }, [
    trip,
    bookings,
    profile,
    language,
    hasStarted,
    adjustments,
    activeReference,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [visibleScreen, destinationId, activeReference]);

  const handleNavigate = useCallback(
    (next: Screen) => {
      if (next === "plan") setHasStarted(true);
      navigate(next);
    },
    [navigate],
  );

  const handleTripChange = useCallback((next: TripConfig) => {
    setTrip(next);
    setHasStarted(true);
  }, []);

  const handleLanguageChange = useCallback(
    (code: string) => {
      setLanguage(code);
      const option = LANGUAGE_OPTIONS.find((entry) => entry.code === code);
      showToast(
        `${option?.native ?? code} selected. This prototype previews the choice but keeps sample content in English.`,
      );
    },
    [showToast],
  );

  const handleEditCare = useCallback(() => {
    setHasStarted(true);
    navigate("plan");
  }, [navigate]);

  const handlePlanContinue = useCallback(() => {
    setHasStarted(true);
    navigate("itinerary");
  }, [navigate]);

  const handleAddDestination = useCallback(
    (id: string) => {
      const destination = getDestination(id);
      setTrip((previous) => {
        if (previous.destinations.includes(id)) return previous;
        const destinations = [...previous.destinations, id];
        return {
          ...previous,
          destinations,
          days: Math.max(4, destinations.length + 1),
          localStops: [],
        };
      });
      setHasStarted(true);
      showToast(
        destination
          ? `${destination.shortName} added. We added a day so the route stays gentle.`
          : "Destination added to your draft.",
      );
      navigate("plan");
    },
    [navigate, showToast],
  );

  const handleStartCircuit = useCallback(
    (circuit: Circuit) => {
      const accessibility = profile.careDefaults;
      setTrip({
        ...DEFAULT_TRIP,
        destinations: [...circuit.destinationIds],
        days: Math.max(4, circuit.days),
        accessibility: [...accessibility],
        hotelId: "amara",
        vehicleId: careVehicle(accessibility),
        addOnIds: careAddOns(accessibility),
        localStops: [],
      });
      setAdjustments(EMPTY_ADJUSTMENTS);
      setHasStarted(true);
      navigate("plan");
      showToast(`${circuit.name} is loaded into the builder. Adjust anything you like.`);
    },
    [navigate, profile.careDefaults, showToast],
  );

  const handleStartPersona = useCallback(
    (persona: "family" | "senior" | "group") => {
      const accessibility: TripConfig["accessibility"] =
        persona === "senior"
          ? ["wheelchair", "step-free", "rest-stops", "vegetarian"]
          : persona === "family"
            ? ["step-free", "rest-stops", "vegetarian"]
            : ["rest-stops", "vegetarian"];

      const travellerSetup =
        persona === "family"
          ? { adults: 2, seniors: 2, children: 2 }
          : persona === "senior"
            ? { adults: 2, seniors: 2, children: 0 }
            : { adults: 8, seniors: 2, children: 0 };

      setTrip({
        ...DEFAULT_TRIP,
        ...travellerSetup,
        accessibility: [...accessibility],
        days: persona === "group" ? 5 : 4,
        pace: persona === "group" ? "balanced" : "relaxed",
        hotelId: "amara",
        vehicleId: persona === "group" ? "tempo" : careVehicle(accessibility),
        addOnIds: careAddOns(accessibility),
        localStops: [],
      });
      setAdjustments(EMPTY_ADJUSTMENTS);
      setHasStarted(true);
      navigate("plan");
      showToast(
        persona === "group"
          ? "A group draft is ready. The group desk would confirm seats and a shared manifest in a live build."
          : "Your care preferences are pre-filled. Adjust the group and pace as needed.",
      );
    },
    [navigate, showToast],
  );

  const handleNewTrip = useCallback(() => {
    const accessibility = profile.careDefaults;
    setTrip({
      ...DEFAULT_TRIP,
      accessibility: [...accessibility],
      vehicleId: careVehicle(accessibility),
      addOnIds: careAddOns(accessibility),
      localStops: [],
    });
    setAdjustments(EMPTY_ADJUSTMENTS);
    setHasStarted(true);
    navigate("plan");
    showToast("A fresh draft is ready. Your saved care defaults are pre-filled.");
  }, [navigate, profile.careDefaults, showToast]);

  const handlePay = useCallback(
    (traveller: TravellerDetails, paymentMethod: PaymentMethod) => {
      const booking: Booking = {
        reference: makeReference(trip),
        bookedAt: new Date().toISOString(),
        status: "advance_paid",
        paymentMethod,
        paidPaise: quote.advancePaise,
        quote,
        trip: snapshotTrip(trip),
        hotelId: trip.hotelId,
        vehicleId: trip.vehicleId,
        addOnIds: [...trip.addOnIds],
        traveller,
        vendorStatuses: buildVendorStatuses(trip, quote),
      };

      setBookings((previous) => [booking, ...previous]);
      setActiveReference(booking.reference);
      setAdjustments(EMPTY_ADJUSTMENTS);
      setHasStarted(false);
      navigate("confirmation", { reference: booking.reference });
      showToast("Demo booking created. No money moved.");
    },
    [navigate, quote, showToast, trip],
  );

  const handleOpenBooking = useCallback(
    (reference: string) => {
      setActiveReference(reference);
      navigate("trip", { reference });
    },
    [navigate],
  );

  const handleResetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing else to do if storage is unavailable.
    }
    setTrip(DEFAULT_TRIP);
    setBookings([]);
    setProfile(DEFAULT_PROFILE);
    setLanguage("EN");
    setHasStarted(false);
    setAdjustments(EMPTY_ADJUSTMENTS);
    setActiveReference(null);
    setDestinationId("tirupati");
    window.history.replaceState(null, "", "#/");
    setScreen("home");
    showToast("Demo data cleared. You are back to a fresh start.");
  }, [showToast]);

  const handleProfileChange = useCallback((next: Profile) => {
    setProfile(next);
  }, []);

  const showStepper = FLOW_SCREENS.includes(visibleScreen);
  const showMobileNav = !showStepper && visibleScreen !== "confirmation";
  const showFooter = FOOTER_SCREENS.includes(visibleScreen);

  const careItems = trip.accessibility.map((id) => ({
    id,
    ...CARE_META[id],
  }));

  let content: React.ReactNode;

  switch (visibleScreen) {
    case "home":
      content = (
        <HomeScreen
          trip={trip}
          hasStarted={hasStarted}
          onNavigate={handleNavigate}
          onStartCircuit={handleStartCircuit}
          onStartPersona={handleStartPersona}
          onOpenDestination={(id) => {
            setDestinationId(id);
            navigate("destination", { destinationId: id });
          }}
        />
      );
      break;
    case "explore":
      content = (
        <ExploreScreen
          onOpenDestination={(id) => {
            setDestinationId(id);
            navigate("destination", { destinationId: id });
          }}
          onStartCircuit={handleStartCircuit}
        />
      );
      break;
    case "destination":
      content = (
        <DestinationScreen
          destination={selectedDestination}
          trip={trip}
          onBack={() => navigate("explore")}
          onAddToTrip={() => handleAddDestination(selectedDestination.id)}
          onStartCircuit={handleStartCircuit}
        />
      );
      break;
    case "plan":
      content = (
        <PlanScreen
          trip={trip}
          onTripChange={handleTripChange}
          onBack={() => navigate("home")}
          onContinue={handlePlanContinue}
          onSave={() => {
            setHasStarted(true);
            showToast("Draft saved on this device.");
          }}
        />
      );
      break;
    case "itinerary":
      content = (
        <ItineraryScreen
          trip={trip}
          days={itinerary.days}
          warnings={itinerary.warnings}
          adjustments={adjustments}
          onAdjustmentsChange={setAdjustments}
          onBack={() => navigate("plan")}
          onContinue={() => navigate("stay")}
        />
      );
      break;
    case "stay":
      content = (
        <StayScreen
          trip={trip}
          onTripChange={handleTripChange}
          onBack={() => navigate("itinerary")}
          onContinue={() => navigate("transport")}
          onEditCare={handleEditCare}
        />
      );
      break;
    case "transport":
      content = (
        <TransportScreen
          trip={trip}
          onTripChange={handleTripChange}
          onBack={() => navigate("stay")}
          onContinue={() => navigate("extras")}
          onEditCare={handleEditCare}
        />
      );
      break;
    case "extras":
      content = (
        <ExtrasScreen
          trip={trip}
          onTripChange={handleTripChange}
          onBack={() => navigate("transport")}
          onContinue={() => navigate("checkout")}
          onEditCare={handleEditCare}
        />
      );
      break;
    case "checkout":
      content = (
        <CheckoutScreen
          trip={trip}
          quote={quote}
          profile={profile}
          onBack={() => navigate("extras")}
          onPay={handlePay}
        />
      );
      break;
    case "confirmation":
      content = activeBooking ? (
        <ConfirmationScreen
          booking={activeBooking}
          onViewTrips={() => navigate("trips")}
          onViewTrip={() =>
            handleOpenBooking(activeBooking.reference)
          }
          onHome={() => navigate("home")}
          onToast={showToast}
        />
      ) : (
        <div className="container-page py-20 text-sm text-muted">
          Looking for your booking…
        </div>
      );
      break;
    case "trips":
      content = (
        <TripsScreen
          bookings={bookings}
          trip={trip}
          quote={quote}
          hasStarted={hasStarted}
          onOpenBooking={handleOpenBooking}
          onContinuePlanning={() => {
            setHasStarted(true);
            navigate("plan");
          }}
          onViewItinerary={() => {
            setHasStarted(true);
            navigate("itinerary");
          }}
          onExplore={() => navigate("explore")}
          onNewTrip={handleNewTrip}
          onToast={showToast}
        />
      );
      break;
    case "trip":
      content = activeBooking ? (
        <TripDetailScreen
          booking={activeBooking}
          onBack={() => navigate("trips")}
          onToast={showToast}
        />
      ) : (
        <div className="container-page py-20 text-sm text-muted">
          Looking for your booking…
        </div>
      );
      break;
    case "profile":
      content = (
        <ProfileScreen
          profile={profile}
          language={language}
          onProfileChange={handleProfileChange}
          onLanguageChange={handleLanguageChange}
          onBack={() => navigate("home")}
          onToast={showToast}
          onResetDemo={handleResetDemo}
        />
      );
      break;
    default:
      content = null;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        screen={visibleScreen}
        language={language}
        onNavigate={handleNavigate}
        onLanguageChange={handleLanguageChange}
        onProfile={() => navigate("profile")}
      />

      <div className="no-print border-b border-sand/70 bg-sage/40">
        <div className="container-page hide-scrollbar flex min-h-9 items-center gap-2 overflow-x-auto py-1.5">
          <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-forest-soft">
            <HeartHandshake size={12} aria-hidden="true" />
            Care on this yatra
          </span>
          <span className="h-3 w-px shrink-0 bg-forest/15" aria-hidden="true" />
          {careItems.length === 0 ? (
            <span className="shrink-0 rounded-full bg-paper/70 px-2 py-1 text-[9px] font-medium text-muted">
              No care requests yet
            </span>
          ) : (
            careItems.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.id}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-paper/70 px-2 py-1 text-[9px] font-medium text-forest-soft"
                >
                  <Icon size={10} aria-hidden="true" />
                  {item.short}
                </span>
              );
            })
          )}
          {trip.seniors > 0 && (
            <span className="shrink-0 rounded-full bg-paper/70 px-2 py-1 text-[9px] font-medium text-forest-soft">
              {trip.seniors} {trip.seniors === 1 ? "senior" : "seniors"}
            </span>
          )}
          <button
            type="button"
            onClick={handleEditCare}
            className="ml-auto flex min-h-7 shrink-0 items-center gap-1 rounded-full px-2 text-[9px] font-semibold text-forest transition hover:bg-paper/60"
          >
            <Pencil size={10} aria-hidden="true" />
            Edit care
          </button>
        </div>
      </div>

      {showStepper && <Stepper current={screen} onNavigate={handleNavigate} />}

      <main className="flex-1">{content}</main>

      {showFooter && <SiteFooter onNavigate={handleNavigate} />}
      {showMobileNav && (
        <MobileBottomNav screen={visibleScreen} onNavigate={handleNavigate} />
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-fade-up md:bottom-6"
        >
          <div className="flex items-start gap-2.5 rounded-2xl border border-cream/10 bg-forest px-4 py-3 text-cream shadow-[0_20px_50px_-20px_rgba(12,42,34,0.8)]">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream/10">
              <Check size={11} aria-hidden="true" />
            </span>
            <p className="flex-1 text-[11px] leading-5 text-cream/90">{toast}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss message"
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-cream/50 transition hover:bg-cream/10 hover:text-cream",
              )}
            >
              <X size={12} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
