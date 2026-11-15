export type Screen =
  | "home"
  | "explore"
  | "destination"
  | "plan"
  | "itinerary"
  | "stay"
  | "transport"
  | "extras"
  | "checkout"
  | "confirmation"
  | "trips"
  | "trip"
  | "profile";

export type Pace = "relaxed" | "balanced";

export type AccessibilityId =
  | "wheelchair"
  | "step-free"
  | "rest-stops"
  | "vegetarian";

export type Destination = {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  deity: string;
  temple: string;
  category: string;
  tagline: string;
  summary: string;
  significance: string;
  bestTime: string;
  idealDuration: string;
  timingsNote: string;
  rating: number;
  reviewCount: number;
  image: string;
  imageAlt: string;
  accessibility: string[];
  facilities: string[];
  nearby: { name: string; distance: string }[];
  coords: { lat: number; lng: number };
  mapPos: { x: number; y: number };
  tint: string;
};

export type Circuit = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  image: string;
  imageAlt: string;
  days: number;
  nights: number;
  destinationIds: string[];
  fromPricePaise: number;
  eyebrow: string;
};

export type Hotel = {
  id: string;
  name: string;
  category: string;
  distance: string;
  rating: number;
  reviews: number;
  pricePerNightPaise: number;
  image: string;
  imageAlt: string;
  roomType: string;
  breakfast: boolean;
  highlights: string[];
  accessibility: string[];
  cancellation: string;
  recommendation?: string;
};

export type Vehicle = {
  id: string;
  name: string;
  category: string;
  capacity: string;
  luggage: string;
  pricePerDayPaise: number;
  features: string[];
  accessible: boolean;
  recommendedForMobility: boolean;
  note: string;
};

export type AddOnPricing =
  | { kind: "flat"; amountPaise: number }
  | { kind: "perDay"; amountPaise: number; days: number }
  | { kind: "perTraveller"; amountPaise: number }
  | { kind: "perTravellerPerDay"; amountPaise: number };

export type AddOn = {
  id: string;
  name: string;
  description: string;
  icon: "guide" | "wheelchair" | "meals" | "prasadam" | "transfer" | "concierge";
  pricing: AddOnPricing;
  priceLabel: string;
  defaultSelected: boolean;
  badge?: string;
};

export type TripConfig = {
  origin: string;
  destinations: string[];
  startDate: string;
  days: number;
  adults: number;
  seniors: number;
  children: number;
  pace: Pace;
  accessibility: AccessibilityId[];
  localStops: string[];
  hotelId: string;
  vehicleId: string;
  addOnIds: string[];
};

export type Quote = {
  hotelPaise: number;
  transportPaise: number;
  addOnsPaise: number;
  subtotalPaise: number;
  platformFeePaise: number;
  gstPaise: number;
  totalPaise: number;
  advancePaise: number;
  balancePaise: number;
  rooms: number;
  nights: number;
};

export type ItineraryStopType =
  | "travel"
  | "temple"
  | "hotel"
  | "meal"
  | "rest"
  | "experience";

export type ItineraryStop = {
  time: string;
  title: string;
  description: string;
  duration?: string;
  type: ItineraryStopType;
};

export type ItineraryDay = {
  day: number;
  date: string;
  weekday: string;
  title: string;
  location: string;
  note?: string;
  stops: ItineraryStop[];
};

export type PaymentMethod = "UPI" | "Card" | "Netbanking";

export type TravellerDetails = {
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  emergencyContact: string;
  notes: string;
};

export type VendorStatusState =
  | "confirmed"
  | "requested"
  | "pending"
  | "subject_to_temple"
  | "not_selected";

export type VendorStatus = {
  id: "stay" | "vehicle" | "wheelchair" | "guide" | "darshan";
  label: string;
  state: VendorStatusState;
  detail: string;
};

export type Booking = {
  reference: string;
  bookedAt: string;
  status: "advance_paid" | "paid_in_full";
  paymentMethod: PaymentMethod;
  paidPaise: number;
  quote: Quote;
  trip: TripConfig;
  hotelId: string;
  vehicleId: string;
  addOnIds: string[];
  traveller: TravellerDetails;
  vendorStatuses: VendorStatus[];
};

export type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export type ItineraryAdjustment = {
  restEveryDay: boolean;
  softenDay: number | null;
  changeLog: string[];
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  careDefaults: AccessibilityId[];
  notifyEmail: boolean;
  notifySms: boolean;
  notifyWhatsapp: boolean;
};
