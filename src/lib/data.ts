import type {
  AddOn,
  Circuit,
  Destination,
  Hotel,
  Profile,
  TripConfig,
  Vehicle,
} from "./types";

export const DESTINATIONS: Destination[] = [
  {
    id: "tirupati",
    name: "Tirumala & Tirupati",
    shortName: "Tirupati",
    city: "Tirupati",
    state: "Andhra Pradesh",
    deity: "Lord Venkateswara",
    temple: "Sri Venkateswara Temple",
    category: "Divya Desam",
    tagline: "The hill shrine of the seven hills",
    summary:
      "A pilgrimage to Tirumala is as much about the climb and the quiet as the darshan itself. We build the day around queue times, rest breaks and the needs of every generation.",
    significance:
      "One of the most visited sacred sites in the world, Tirumala is dedicated to Lord Venkateswara. Pilgrims come for darshan, the Margazhi season and the wide, still views from the hill.",
    bestTime: "October to March",
    idealDuration: "1–2 days",
    timingsNote:
      "Temple hours are generally 2:30 AM – 11:30 PM. Darshan slots change daily and are never guaranteed.",
    rating: 4.9,
    reviewCount: 18420,
    image: "/images/tirupati-alt.jpg",
    imageAlt: "The white gopuram of Sri Venkateswara Temple against the green Tirumala hills",
    accessibility: [
      "Step-free route to select darshan queues",
      "Wheelchair assistance can be arranged on request",
      "Rest points and medical counters on the hill",
    ],
    facilities: [
      "Cloakrooms",
      "Prasadam counters",
      "Medical assistance",
      "Wheelchair support",
    ],
    nearby: [
      { name: "Sri Padmavathi Temple", distance: "5 km" },
      { name: "Kapila Theertham", distance: "3 km" },
      { name: "Srikalahasti", distance: "38 km" },
    ],
    coords: { lat: 13.6288, lng: 79.4192 },
    mapPos: { x: 57, y: 35 },
    tint: "#d9e4d5",
  },
  {
    id: "srikalahasti",
    name: "Srikalahasti",
    shortName: "Srikalahasti",
    city: "Srikalahasti",
    state: "Andhra Pradesh",
    deity: "Lord Shiva",
    temple: "Sri Kalahasteeswara Temple",
    category: "Pancha Bhoota · Vayu",
    tagline: "Where the wind passes through stone",
    summary:
      "A riverside temple with an unusually intimate scale. The courtyard invites a slower visit, and the story of the spider, the snake and the elephant stays with you.",
    significance:
      "Srikalahasti is one of the five elemental Shiva temples, associated with vayu, the wind. Its lamp-lit inner corridors and the nearby Swarnamukhi river make it a deeply atmospheric stop.",
    bestTime: "November to February",
    idealDuration: "2–3 hours",
    timingsNote:
      "Typical hours are 6:00 AM – 9:00 PM. Festival days can shift darshan timings.",
    rating: 4.7,
    reviewCount: 6420,
    image: "/images/srikalahasti.jpg",
    imageAlt: "The tall white gopuram of Srikalahasti temple above the town and river",
    accessibility: [
      "Mostly level outer courtyard",
      "A few steps near the inner sanctum",
      "Pilgrim assistance available at the entrance",
    ],
    facilities: ["Footwear storage", "Prasadam counter", "Rest areas", "Drinking water"],
    nearby: [
      { name: "Swarnamukhi river ghat", distance: "500 m" },
      { name: "Tirupati", distance: "38 km" },
      { name: "Kanipakam", distance: "72 km" },
    ],
    coords: { lat: 13.75, lng: 79.7 },
    mapPos: { x: 67, y: 47 },
    tint: "#e7decd",
  },
  {
    id: "kanipakam",
    name: "Kanipakam",
    shortName: "Kanipakam",
    city: "Kanipakam",
    state: "Andhra Pradesh",
    deity: "Lord Ganesha",
    temple: "Sri Varasiddhi Vinayaka Temple",
    category: "Varasiddhi shrine",
    tagline: "A small town, a very big wish",
    summary:
      "A beloved Ganapathi shrine in a quiet town, built around a spring-fed temple tank. It is an easy, meaningful half-day stop between Tirupati and the coast.",
    significance:
      "The temple is devoted to Lord Vinayaka and is especially busy during Vinayaka Chaturthi. The sacred tank at the centre of the temple is integral to the shrine's story.",
    bestTime: "Year-round; festival days for Vinayaka Chaturthi",
    idealDuration: "1–2 hours",
    timingsNote:
      "Typical hours are 4:00 AM – 9:30 PM. Timings change during festival weeks.",
    rating: 4.7,
    reviewCount: 5100,
    image: "/images/kanipakam.jpg",
    imageAlt: "Kanipakam temple gopuram lit at night",
    accessibility: [
      "Level entry to the main courtyard",
      "Steps near the temple tank",
      "Wheelchair help available on request",
    ],
    facilities: ["Prasadam counter", "Footwear storage", "Drinking water", "Rest areas"],
    nearby: [
      { name: "Tirupati", distance: "68 km" },
      { name: "Srikalahasti", distance: "72 km" },
      { name: "Chittoor", distance: "12 km" },
    ],
    coords: { lat: 13.4667, lng: 79.1167 },
    mapPos: { x: 47, y: 27 },
    tint: "#eadfcb",
  },
  {
    id: "madurai",
    name: "Madurai",
    shortName: "Madurai",
    city: "Madurai",
    state: "Tamil Nadu",
    deity: "Goddess Meenakshi",
    temple: "Meenakshi Amman Temple",
    category: "Dravidian heritage",
    tagline: "A city built around a goddess",
    summary:
      "Madurai moves around the Meenakshi Amman Temple — its gopurams, tank, flower markets and the sound of the streets at dusk. Give this city a full day, not a stopover.",
    significance:
      "The Meenakshi Amman Temple is one of the great living temples of South India, known for its painted gopurams, thousand-pillar hall and the daily procession of temple rituals.",
    bestTime: "October to March",
    idealDuration: "1–2 days",
    timingsNote:
      "Typical hours are 5:00 AM – 10:00 PM. The museum and some halls keep shorter hours.",
    rating: 4.9,
    reviewCount: 22600,
    image: "/images/madurai.jpg",
    imageAlt: "Detailed painted gopuram of Meenakshi Amman Temple in Madurai",
    accessibility: [
      "Outer corridors are largely level",
      "Footwear storage and wheelchair help available",
      "Some inner areas have steps",
    ],
    facilities: ["Footwear storage", "Cloakroom", "Prasadam", "Wheelchair support"],
    nearby: [
      { name: "Thirumalai Nayakkar Mahal", distance: "1.2 km" },
      { name: "Gandhi Memorial Museum", distance: "2 km" },
      { name: "Rameswaram", distance: "170 km" },
    ],
    coords: { lat: 9.9252, lng: 78.1198 },
    mapPos: { x: 35, y: 78 },
    tint: "#eedfce",
  },
  {
    id: "rameswaram",
    name: "Rameswaram",
    shortName: "Rameswaram",
    city: "Rameswaram",
    state: "Tamil Nadu",
    deity: "Lord Shiva",
    temple: "Ramanathaswamy Temple",
    category: "Jyotirlinga",
    tagline: "Between the sea and the sacred",
    summary:
      "An island town of long corridors, sea air and a temple that asks you to slow down. The walk between its thousand pillars is a pilgrimage in itself.",
    significance:
      "Ramanathaswamy is one of the twelve Jyotirlingas and an important stop on the Char Dham circuit. The temple is known for its third corridor and its 22 sacred wells.",
    bestTime: "October to March",
    idealDuration: "1–2 days",
    timingsNote:
      "Temple hours are generally 5:00 AM – 9:00 PM. Theertham rituals have separate timings.",
    rating: 4.8,
    reviewCount: 15200,
    image: "/images/rameswaram-temple.jpg",
    imageAlt: "Golden gopuram of Ramanathaswamy Temple, Rameswaram",
    accessibility: [
      "Long walking distances within the temple",
      "Wheelchair assistance can be arranged",
      "Some corridors have uneven stone floors",
    ],
    facilities: ["Footwear storage", "Cloakroom", "Prasadam", "Drinking water"],
    nearby: [
      { name: "Agni Theertham", distance: "300 m" },
      { name: "Pamban Bridge", distance: "12 km" },
      { name: "Dhanushkodi", distance: "20 km" },
    ],
    coords: { lat: 9.2876, lng: 79.3129 },
    mapPos: { x: 51, y: 88 },
    tint: "#dfe6dd",
  },
  {
    id: "dhanushkodi",
    name: "Dhanushkodi",
    shortName: "Dhanushkodi",
    city: "Dhanushkodi",
    state: "Tamil Nadu",
    deity: "—",
    temple: "Dhanushkodi coastal heritage",
    category: "Coastal heritage",
    tagline: "The last road before the sea",
    summary:
      "A windswept strip of land where the Bay of Bengal meets the Indian Ocean. The ruins tell a story, and the horizon does the rest.",
    significance:
      "Dhanushkodi is a former town and pilgrimage point at the tip of Pamban Island. Visits are weather-dependent, and the road is only open during daylight hours.",
    bestTime: "October to March",
    idealDuration: "Half day",
    timingsNote:
      "Daylight visits only. Local authorities may close the road because of weather or sea conditions.",
    rating: 4.6,
    reviewCount: 8600,
    image: "/images/dhanushkodi.jpg",
    imageAlt: "A car on the coastal road at Dhanushkodi at sunset",
    accessibility: [
      "Vehicle-accessible viewpoints",
      "Uneven sand around the ruins",
      "Not recommended for long walks on hot afternoons",
    ],
    facilities: ["Parking", "Local refreshments", "Basic washrooms"],
    nearby: [
      { name: "Rameswaram", distance: "20 km" },
      { name: "Pamban Bridge", distance: "28 km" },
      { name: "Ariyaman Beach", distance: "18 km" },
    ],
    coords: { lat: 9.1933, lng: 79.4204 },
    mapPos: { x: 60, y: 94 },
    tint: "#e3e4d6",
  },
  {
    id: "thanjavur",
    name: "Thanjavur",
    shortName: "Thanjavur",
    city: "Thanjavur",
    state: "Tamil Nadu",
    deity: "Lord Shiva",
    temple: "Brihadeeswarar Temple",
    category: "UNESCO World Heritage",
    tagline: "A Chola masterpiece in stone",
    summary:
      "The great temple of Thanjavur stands at the centre of a city of art, bronze and music. Come for the scale, stay for the quiet courtyards.",
    significance:
      "Built by Raja Raja Chola I in the 11th century, Brihadeeswarar Temple is a UNESCO World Heritage Site and one of the finest examples of Chola architecture.",
    bestTime: "November to February",
    idealDuration: "1 day",
    timingsNote:
      "Typical hours are 6:00 AM – 12:30 PM and 4:00 PM – 8:30 PM. Timings may change on festival days.",
    rating: 4.8,
    reviewCount: 9400,
    image: "/images/thanjavur.jpg",
    imageAlt: "The carved stone gateway of Brihadeeswarar Temple in Thanjavur",
    accessibility: [
      "Level forecourt and wide paths",
      "Some areas have shallow steps",
      "Wheelchair access to the outer temple area",
    ],
    facilities: ["Guide services", "Footwear storage", "Rest areas", "Drinking water"],
    nearby: [
      { name: "Thanjavur Maratha Palace", distance: "2 km" },
      { name: "Saraswathi Mahal Library", distance: "2 km" },
      { name: "Kumbakonam", distance: "40 km" },
    ],
    coords: { lat: 10.787, lng: 79.1378 },
    mapPos: { x: 62, y: 63 },
    tint: "#e9dfca",
  },
  {
    id: "kanchipuram",
    name: "Kanchipuram",
    shortName: "Kanchipuram",
    city: "Kanchipuram",
    state: "Tamil Nadu",
    deity: "Lord Shiva",
    temple: "Kailasanathar Temple",
    category: "Pallava heritage",
    tagline: "The city of a thousand temples",
    summary:
      "One of India's oldest temple towns, known for silk, stone and stillness. Choose two temples and leave room for the lanes in between.",
    significance:
      "Kanchipuram was the capital of the Pallava dynasty and remains one of the seven sacred cities of Hinduism. Its temples hold some of the earliest Dravidian stone architecture.",
    bestTime: "November to February",
    idealDuration: "1 day",
    timingsNote:
      "Typical hours are 6:00 AM – 12:30 PM and 4:00 PM – 8:30 PM. Individual temples vary.",
    rating: 4.7,
    reviewCount: 7800,
    image: "/images/kanchipuram.jpg",
    imageAlt: "Kailasanathar Temple in Kanchipuram with carved stone walls",
    accessibility: [
      "Mostly level temple compounds",
      "Some sand and uneven stone paths",
      "Wheelchair assistance should be pre-arranged",
    ],
    facilities: ["Guide services", "Footwear storage", "Local shopping", "Drinking water"],
    nearby: [
      { name: "Ekambareswarar Temple", distance: "1 km" },
      { name: "Kailasanathar Temple", distance: "2 km" },
      { name: "Mahabalipuram", distance: "65 km" },
    ],
    coords: { lat: 12.8342, lng: 79.7036 },
    mapPos: { x: 70, y: 22 },
    tint: "#e5dfd0",
  },
  {
    id: "chidambaram",
    name: "Chidambaram",
    shortName: "Chidambaram",
    city: "Chidambaram",
    state: "Tamil Nadu",
    deity: "Lord Nataraja",
    temple: "Thillai Nataraja Temple",
    category: "Pancha Bhoota · Akasha",
    tagline: "The temple of the cosmic dance",
    summary:
      "A temple town with an otherworldly pull, home to the Nataraja shrine and the great temple tank. The evening ritual is worth planning the day around.",
    significance:
      "Thillai Nataraja Temple is one of the five elemental Shiva temples, associated with akasha, or ether. It is the site of the cosmic dance of Lord Nataraja.",
    bestTime: "November to February",
    idealDuration: "Half day",
    timingsNote:
      "Typical hours are 6:00 AM – 12:00 PM and 5:00 PM – 10:00 PM. The main ritual timings vary.",
    rating: 4.8,
    reviewCount: 10100,
    image: "/images/chidambaram.jpg",
    imageAlt: "The ornate gopuram of Thillai Nataraja Temple in Chidambaram",
    accessibility: [
      "Level entry and wide outer courtyard",
      "Some inner areas have steps",
      "Wheelchair assistance available on request",
    ],
    facilities: ["Footwear storage", "Prasadam", "Cloakroom", "Rest areas"],
    nearby: [
      { name: "Pichavaram Mangrove Forest", distance: "15 km" },
      { name: "Annamalai University", distance: "2 km" },
      { name: "Thanjavur", distance: "98 km" },
    ],
    coords: { lat: 11.3995, lng: 79.693 },
    mapPos: { x: 73, y: 51 },
    tint: "#e7ddce",
  },
];

export const CIRCUITS: Circuit[] = [
  {
    id: "tirupati-pilgrimage",
    name: "Tirupati & the sacred circuit",
    tagline: "Tirumala · Srikalahasti · Kanipakam",
    blurb:
      "The hill shrine, the wind temple and the wish-fulfilling Ganapathi — with slow mornings and accessible stays.",
    image: "/images/tirupati-alt.jpg",
    imageAlt: "Tirumala temple framed by green hills",
    days: 4,
    nights: 3,
    destinationIds: ["tirupati", "srikalahasti", "kanipakam"],
    fromPricePaise: 1595000,
    eyebrow: "Pilot circuit",
  },
  {
    id: "madurai-rameswaram",
    name: "Madurai & the sea",
    tagline: "Madurai · Rameswaram · Dhanushkodi",
    blurb:
      "Painted gopurams, long temple corridors and the road that ends in the ocean.",
    image: "/images/madurai.jpg",
    imageAlt: "The painted gopuram of Meenakshi Amman Temple",
    days: 5,
    nights: 4,
    destinationIds: ["madurai", "rameswaram", "dhanushkodi"],
    fromPricePaise: 2240000,
    eyebrow: "Curated journey",
  },
  {
    id: "chola-temples",
    name: "The Chola temple trail",
    tagline: "Thanjavur · Chidambaram · Kanchipuram",
    blurb:
      "Stone, bronze and living ritual across the great temple towns of Tamil Nadu.",
    image: "/images/thanjavur.jpg",
    imageAlt: "The stone gateway of Brihadeeswarar Temple",
    days: 5,
    nights: 4,
    destinationIds: ["thanjavur", "chidambaram", "kanchipuram"],
    fromPricePaise: 2380000,
    eyebrow: "Heritage journey",
  },
];

export const HOTELS: Hotel[] = [
  {
    id: "amara",
    name: "Amara Residency",
    category: "Signature · 4 star",
    distance: "2.1 km to temple",
    rating: 4.8,
    reviews: 1284,
    pricePerNightPaise: 640000,
    image: "/images/hotel-3.jpg",
    imageAlt: "A calm hotel pool and courtyard at dusk",
    roomType: "Deluxe twin · 2 rooms",
    breakfast: true,
    highlights: ["Temple view", "Vegetarian kitchen", "Airport pickup"],
    accessibility: ["Step-free entrance", "Lift to all floors", "Roll-in shower", "Wheelchair on request"],
    cancellation: "Free cancellation until 5 days before departure",
    recommendation: "Best for senior travellers",
  },
  {
    id: "vista",
    name: "Tirumala Vista",
    category: "Comfort · boutique stay",
    distance: "3.4 km to temple",
    rating: 4.6,
    reviews: 862,
    pricePerNightPaise: 420000,
    image: "/images/hotel-4.jpg",
    imageAlt: "A warm, contemporary hotel bedroom with twin beds",
    roomType: "Comfort twin · 2 rooms",
    breakfast: true,
    highlights: ["Quiet street", "Filtered water", "Early breakfast"],
    accessibility: ["Step-free entrance", "Lift to floors 1–3", "Grab rails in bathroom"],
    cancellation: "Free cancellation until 7 days before departure",
    recommendation: "A gentler price",
  },
  {
    id: "nivas",
    name: "Sri Padmavathi Nivas",
    category: "Simple · guesthouse",
    distance: "1.2 km to temple",
    rating: 4.3,
    reviews: 414,
    pricePerNightPaise: 120000,
    image: "/images/hotel-2.jpg",
    imageAlt: "A simple, sunlit bedroom with a double bed",
    roomType: "Family room · 2 rooms",
    breakfast: false,
    highlights: ["Closest to temple", "Simple vegetarian meals", "24-hour check-in"],
    accessibility: ["Ground-floor rooms", "No lift", "Steps at entrance"],
    cancellation: "Free cancellation until 48 hours before arrival",
    recommendation: "Most affordable",
  },
];

export const VEHICLES: Vehicle[] = [
  {
    id: "innova",
    name: "Toyota Innova Crysta",
    category: "Private AC SUV",
    capacity: "6 passengers + driver",
    luggage: "3 large bags",
    pricePerDayPaise: 562500,
    features: ["Chauffeur", "Bottled water", "Phone charging", "Child seat on request"],
    accessible: false,
    recommendedForMobility: false,
    note: "Comfortable for six, but no wheelchair conversion.",
  },
  {
    id: "urbania",
    name: "Force Urbania — Accessible",
    category: "Accessible AC van",
    capacity: "8 passengers + driver",
    luggage: "6 large bags",
    pricePerDayPaise: 712500,
    features: [
      "Wheelchair ramp",
      "Space for 1 wheelchair",
      "Trained driver assistance",
      "Extra legroom",
    ],
    accessible: true,
    recommendedForMobility: true,
    note: "Recommended because wheelchair assistance is part of this yatra.",
  },
  {
    id: "tempo",
    name: "Tempo Traveller",
    category: "Private AC mini-coach",
    capacity: "12 passengers + driver",
    luggage: "10 large bags",
    pricePerDayPaise: 775000,
    features: ["Chauffeur", "Pushback seats", "Large luggage bay", "Phone charging"],
    accessible: false,
    recommendedForMobility: false,
    note: "Best if your group grows or you are travelling with a community.",
  },
];

export const ADD_ONS: AddOn[] = [
  {
    id: "guide",
    name: "A local guide",
    description: "A Tamil- and English-speaking guide for two temple days.",
    icon: "guide",
    pricing: { kind: "perDay", amountPaise: 240000, days: 2 },
    priceLabel: "₹2,400 / day · 2 days",
    defaultSelected: true,
    badge: "Local partner",
  },
  {
    id: "wheelchair",
    name: "Wheelchair + attendant",
    description: "A lightweight wheelchair and a trained attendant throughout the yatra.",
    icon: "wheelchair",
    pricing: { kind: "flat", amountPaise: 600000 },
    priceLabel: "₹6,000 · all 4 days",
    defaultSelected: true,
    badge: "Mobility support",
  },
  {
    id: "meals",
    name: "Senior-friendly meals",
    description: "Simple vegetarian breakfasts and dinners, planned around rest stops.",
    icon: "meals",
    pricing: { kind: "perTravellerPerDay", amountPaise: 50000 },
    priceLabel: "₹500 / traveller / day",
    defaultSelected: true,
  },
  {
    id: "prasadam",
    name: "Prasadam pre-order",
    description: "A packaged prasadam hamper from an authorised temple counter.",
    icon: "prasadam",
    pricing: { kind: "flat", amountPaise: 180000 },
    priceLabel: "₹1,800 · one hamper",
    defaultSelected: false,
  },
  {
    id: "transfer",
    name: "Station transfers",
    description: "A separate car for your arrival and departure, if you are coming by train.",
    icon: "transfer",
    pricing: { kind: "flat", amountPaise: 260000 },
    priceLabel: "₹2,600 · both ways",
    defaultSelected: false,
  },
  {
    id: "concierge",
    name: "Yatra concierge",
    description: "One named coordinator who handles changes and vendor calls for you.",
    icon: "concierge",
    pricing: { kind: "flat", amountPaise: 350000 },
    priceLabel: "₹3,500 · entire trip",
    defaultSelected: false,
    badge: "Peace of mind",
  },
];

export const LOCAL_STOPS = [
  {
    id: "padmavathi",
    name: "Sri Padmavathi Temple",
    description:
      "A quiet evening visit to the temple of Goddess Padmavathi, 5 km from Tirupati.",
    near: "tirupati",
    duration: "1 hr 15 min",
  },
  {
    id: "kapila",
    name: "Kapila Theertham",
    description:
      "A waterfall temple at the foot of the Tirumala hills. Best visited before the afternoon heat.",
    near: "tirupati",
    duration: "45 min",
  },
];

export const DEFAULT_TRIP: TripConfig = {
  origin: "Bengaluru",
  destinations: ["tirupati", "srikalahasti", "kanipakam"],
  startDate: "2027-01-10",
  days: 4,
  adults: 4,
  seniors: 2,
  children: 0,
  pace: "relaxed",
  accessibility: ["wheelchair", "step-free", "rest-stops", "vegetarian"],
  localStops: [],
  hotelId: "amara",
  vehicleId: "urbania",
  addOnIds: ["guide", "wheelchair", "meals"],
};

export const DEFAULT_PROFILE: Profile = {
  name: "Ananya Rao",
  email: "ananya.rao@example.com",
  phone: "+91 98861 24480",
  city: "Bengaluru",
  emergencyName: "Vikram Rao",
  emergencyPhone: "+91 98450 11932",
  emergencyRelation: "Brother",
  careDefaults: ["wheelchair", "step-free", "rest-stops", "vegetarian"],
  notifyEmail: true,
  notifySms: true,
  notifyWhatsapp: true,
};

export const ORIGIN_OPTIONS = [
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Coimbatore",
  "Mysuru",
  "Kochi",
];

export const LANGUAGE_OPTIONS = [
  { code: "EN", label: "English", native: "English" },
  { code: "TA", label: "Tamil", native: "தமிழ்" },
  { code: "KN", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "TE", label: "Telugu", native: "తెలుగు" },
  { code: "ML", label: "Malayalam", native: "മലയാളം" },
];

export const CIRCUIT_FOR_DESTINATION: Record<string, string> = {
  tirupati: "tirupati-pilgrimage",
  srikalahasti: "tirupati-pilgrimage",
  kanipakam: "tirupati-pilgrimage",
  madurai: "madurai-rameswaram",
  rameswaram: "madurai-rameswaram",
  dhanushkodi: "madurai-rameswaram",
  thanjavur: "chola-temples",
  chidambaram: "chola-temples",
  kanchipuram: "chola-temples",
};

export function getDestination(id: string) {
  return DESTINATIONS.find((destination) => destination.id === id);
}

export function getHotel(id: string) {
  return HOTELS.find((hotel) => hotel.id === id) ?? HOTELS[0];
}

export function getVehicle(id: string) {
  return VEHICLES.find((vehicle) => vehicle.id === id) ?? VEHICLES[0];
}

export function getAddOn(id: string) {
  return ADD_ONS.find((addOn) => addOn.id === id);
}
