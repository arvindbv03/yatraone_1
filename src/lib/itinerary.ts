import { getDestination, getHotel, LOCAL_STOPS } from "./data";
import { addDays, formatLongDate, formatWeekday, plural } from "./format";
import type { Destination, ItineraryDay, ItineraryStop, TripConfig } from "./types";

const ORIGIN_COORDS: Record<string, { lat: number; lng: number }> = {
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Coimbatore: { lat: 11.0168, lng: 76.9558 },
  Mysuru: { lat: 12.2958, lng: 76.6394 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
};

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const earthRadius = 6371;
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function roadEstimate(
  from: { lat: number; lng: number } | string,
  to: { lat: number; lng: number } | string,
) {
  const a = typeof from === "string" ? ORIGIN_COORDS[from] : from;
  const b = typeof to === "string" ? ORIGIN_COORDS[to] : to;
  if (!a || !b) return { km: 120, label: "Approx. 2 hr 30 min" };
  const direct = haversineKm(a, b);
  const roadKm = Math.round((direct * 1.25) / 10) * 10;
  const minutes = Math.max(30, Math.round((roadKm / 52) * 60));
  const roundedMinutes = Math.round(minutes / 15) * 15;
  const hours = Math.floor(roundedMinutes / 60);
  const mins = roundedMinutes % 60;
  const label = hours
    ? `${hours} hr${mins ? ` ${mins} min` : ""}`
    : `${mins} min`;
  return { km: roadKm, label };
}

function stop(
  time: string,
  title: string,
  description: string,
  type: ItineraryStop["type"],
  duration?: string,
): ItineraryStop {
  return { time, title, description, type, duration };
}

function localStopsFor(destination: Destination, trip: TripConfig) {
  return trip.localStops
    .map((id) => LOCAL_STOPS.find((local) => local.id === id))
    .filter((local): local is (typeof LOCAL_STOPS)[number] => Boolean(local))
    .filter((local) => local.near === destination.id);
}

export function buildItinerary(trip: TripConfig): {
  days: ItineraryDay[];
  warnings: string[];
  destinations: Destination[];
} {
  const destinations = trip.destinations
    .map((id) => getDestination(id))
    .filter((destination): destination is Destination => Boolean(destination));
  const hotel = getHotel(trip.hotelId);

  if (destinations.length === 0) {
    return { days: [], warnings: [], destinations: [] };
  }

  const first = destinations[0];
  const last = destinations[destinations.length - 1];
  const remaining = destinations.slice(1);
  const firstStop = localStopsFor(first, trip)[0];
  const originToFirst = roadEstimate(trip.origin, first.coords);
  const lastToOrigin = roadEstimate(last.coords, trip.origin);
  const isMobility = trip.accessibility.includes("wheelchair");
  const isRelaxed = trip.pace === "relaxed";
  const totalDays = trip.days;
  const itinerary: ItineraryDay[] = [];

  const dayOneStops: ItineraryStop[] = [
    stop(
      "6:15 AM",
      `${trip.origin} → ${first.city}`,
      `${originToFirst.km} km · about ${originToFirst.label}. Your chauffeur meets you at your pickup point 15 minutes early.`,
      "travel",
      originToFirst.label,
    ),
    stop(
      "11:30 AM",
      `Check in at ${hotel.name}`,
      `${hotel.roomType} · ${hotel.distance}. Early check-in is requested, not guaranteed.`,
      "hotel",
      "45 min",
    ),
    stop(
      "1:00 PM",
      "Lunch and a slow afternoon",
      isRelaxed
        ? "A vegetarian lunch, then time to unpack and rest before the first temple visit."
        : "Lunch and a short rest before heading out.",
      "meal",
      "90 min",
    ),
  ];

  if (firstStop) {
    dayOneStops.push(
      stop("3:30 PM", firstStop.name, firstStop.description, "temple", firstStop.duration),
    );
  }

  dayOneStops.push(
    stop(
      firstStop ? "5:30 PM" : "4:30 PM",
      `Gentle evening aarti at ${first.temple}`,
      isMobility
        ? "We have requested step-free access and a shorter walking route. Your attendant will meet you at the entrance."
        : "A short, unhurried visit to settle into the rhythm of the town.",
      "temple",
      "75 min",
    ),
    stop(
      "7:30 PM",
      "Dinner and an early night",
      "A simple vegetarian dinner at the hotel. Tomorrow starts early.",
      "meal",
      "60 min",
    ),
  );

  itinerary.push({
    day: 1,
    date: formatLongDate(trip.startDate),
    weekday: formatWeekday(trip.startDate),
    title: `The road to ${first.shortName}`,
    location: `${trip.origin} → ${first.city}`,
    note: isMobility
      ? "A rest stop every 90 minutes is built into today's drive."
      : undefined,
    stops: dayOneStops,
  });

  const primaryDarshanStops: ItineraryStop[] = [
    stop(
      "5:00 AM",
      "Tea, a light snack and a gentle start",
      "Your driver and coordinator confirm the darshan queue before you leave.",
      "meal",
      "30 min",
    ),
    stop(
      "6:00 AM",
      `${first.temple} darshan`,
      isMobility
        ? "Wheelchair support is requested for the full route. Darshan slots are subject to temple confirmation on the day."
        : "Darshan slots are subject to temple confirmation on the day. Your coordinator will share the queue status.",
      "temple",
      "3 hr",
    ),
    stop(
      "9:30 AM",
      "Breakfast back at the hotel",
      "A proper breakfast and medication break, with no rush to leave the table.",
      "meal",
      "60 min",
    ),
    stop(
      "11:00 AM",
      "Rest and recharge",
      isRelaxed
        ? "Two and a half hours of quiet time. The afternoon is deliberately light."
        : "A short rest before the afternoon.",
      "rest",
      isRelaxed ? "2 hr 30 min" : "90 min",
    ),
  ];

  if (firstStop) {
    primaryDarshanStops.push(
      stop(
        "4:00 PM",
        "Optional local interlude",
        "Your coordinator can add a nearby temple or a quiet walk, depending on energy levels.",
        "experience",
        "90 min",
      ),
    );
  }

  primaryDarshanStops.push(
    stop(
      "7:00 PM",
      "Dinner and trip notes",
      "Your coordinator shares tomorrow's pickup time and confirms the route with the driver.",
      "meal",
      "60 min",
    ),
  );

  itinerary.push({
    day: 2,
    date: formatLongDate(addDays(trip.startDate, 1)),
    weekday: formatWeekday(addDays(trip.startDate, 1)),
    title: `${first.shortName} darshan`,
    location: first.city,
    note: "Darshan timing is a plan, not a promise. We reconfirm it with the temple and your guide.",
    stops: primaryDarshanStops,
  });

  const middleDayCount = Math.max(1, totalDays - 3);
  const chunks: Destination[][] = Array.from({ length: middleDayCount }, () => []);
  remaining.forEach((destination, index) => {
    chunks[Math.min(index, middleDayCount - 1)].push(destination);
  });

  for (let index = 0; index < middleDayCount; index += 1) {
    const chunk = chunks[index];
    const dayNumber = 3 + index;
    const date = addDays(trip.startDate, dayNumber - 1);

    if (chunk.length === 0) {
      itinerary.push({
        day: dayNumber,
        date: formatLongDate(date),
        weekday: formatWeekday(date),
        title: "A day with no fixed schedule",
        location: first.city,
        note: "Built-in breathing room for families and senior travellers.",
        stops: [
          stop("8:30 AM", "Breakfast at leisure", "No alarm today.", "meal", "60 min"),
          stop(
            "10:30 AM",
            "Choose your own quiet detour",
            "A local market, an extra temple or simply the hotel veranda. Your coordinator can arrange either.",
            "experience",
            "2 hr",
          ),
          stop("1:00 PM", "Lunch", "A vegetarian lunch at a trusted local partner.", "meal", "60 min"),
          stop("3:00 PM", "Rest", "Time to read, nap or sit by the temple tank.", "rest", "2 hr"),
        ],
      });
      continue;
    }

    const stops: ItineraryStop[] = [
      stop(
        "7:00 AM",
        "Breakfast and a gentle departure",
        "Your vehicle is loaded and waiting. Today includes a longer drive, so we start with breakfast.",
        "meal",
        "45 min",
      ),
    ];

    let previous = first;
    chunk.forEach((destination, destinationIndex) => {
      const drive = roadEstimate(previous.coords, destination.coords);
      const isSecond = destinationIndex > 0;
      stops.push(
        stop(
          isSecond ? "1:15 PM" : "8:00 AM",
          `${previous.city} → ${destination.city}`,
          `${drive.km} km · about ${drive.label}. A comfort stop is included.`,
          "travel",
          drive.label,
        ),
        stop(
          isSecond ? "3:00 PM" : "10:15 AM",
          `${destination.temple}`,
          isMobility
            ? "Wheelchair assistance is requested. Some temple interiors may still have unavoidable steps; we will tell you before you go in."
            : "A guided visit with time for the main shrine and the surrounding courtyards.",
          "temple",
          "90 min",
        ),
        stop(
          isSecond ? "4:30 PM" : "12:15 PM",
          isSecond ? "Tea and a rest" : "Lunch and a longer rest",
          "A proper break off your feet before the next leg.",
          "meal",
          "75 min",
        ),
      );
      previous = destination;
    });

    stops.push(
      stop(
        "5:00 PM",
        `Return to ${first.city}`,
        isRelaxed
          ? "Back before the evening rush. The rest of the day is yours."
          : "A direct return with one comfort stop.",
        "travel",
        roadEstimate(previous.coords, first.coords).label,
      ),
      stop(
        "7:00 PM",
        "Dinner and an early night",
        "Your coordinator checks tomorrow's pickup time and shares a weather note.",
        "meal",
        "60 min",
      ),
    );

    itinerary.push({
      day: dayNumber,
      date: formatLongDate(date),
      weekday: formatWeekday(date),
      title:
        chunk.length === 1
          ? `${chunk[0].shortName} at a gentle pace`
          : chunk.map((destination) => destination.shortName).join(" & "),
      location:
        chunk.length === 1
          ? `${first.city} → ${chunk[0].city}`
          : `${first.city} · ${chunk.map((destination) => destination.city).join(" · ")}`,
      note:
        chunk.length > 1
          ? "Today includes two temple visits and a longer drive. We keep the evening free."
          : "Today includes a longer drive. The afternoon is deliberately light.",
      stops,
    });
  }

  const finalDate = addDays(trip.startDate, totalDays - 1);
  itinerary.push({
    day: totalDays,
    date: formatLongDate(finalDate),
    weekday: formatWeekday(finalDate),
    title: "A quiet farewell",
    location: `${last.city} → ${trip.origin}`,
    stops: [
      stop(
        "7:30 AM",
        "Breakfast without a hurry",
        "A final slow breakfast and time to pack.",
        "meal",
        "60 min",
      ),
      stop(
        "9:30 AM",
        "A last local stop",
        "A temple tank, a craft shop or simply a walk near the hotel. Your coordinator will choose something close.",
        "experience",
        "90 min",
      ),
      stop("11:00 AM", "Check out", "Bags loaded, rooms checked, nothing left behind.", "hotel", "30 min"),
      stop(
        "12:00 PM",
        `${last.city} → ${trip.origin}`,
        `${lastToOrigin.km} km · about ${lastToOrigin.label}. Lunch is planned en route.`,
        "travel",
        lastToOrigin.label,
      ),
      stop(
        "Evening",
        `Home in ${trip.origin}`,
        "Your coordinator checks in after you reach home. Trip support stays open for 24 hours.",
        "rest",
      ),
    ],
  });

  const warnings = [
    "Temple darshan availability is confirmed by the temple on the day. YatraOne does not sell guaranteed darshan.",
    "Hotel and vehicle assignments are reconfirmed by our operations team 48 hours before departure.",
    isMobility
      ? "Wheelchair support is requested for the full route, but some temple interiors have unavoidable steps. We will flag these before each visit."
      : "If your accessibility needs change, tell us before the quote is locked.",
    trip.destinations.includes("dhanushkodi")
      ? "The road to Dhanushkodi can close because of weather or sea conditions. The local coordinator will confirm access on the morning of the visit."
      : "Road timings are estimates and may change with traffic, weather or festival crowds.",
  ];

  return { days: itinerary, warnings, destinations };
}

export function routeLabel(trip: TripConfig) {
  const destinations = trip.destinations
    .map((id) => getDestination(id))
    .filter(Boolean) as Destination[];
  if (destinations.length === 0) return trip.origin;
  return `${trip.origin} → ${destinations
    .map((destination) => destination.shortName)
    .join(" → ")} → ${trip.origin}`;
}

export function routeDurationLabel(days: number) {
  return `${plural(days, "day")} planned`;
}
