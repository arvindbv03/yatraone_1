import { ADD_ONS, getHotel, getVehicle } from "./data";
import type { AddOn, Quote, TripConfig } from "./types";

export const PLATFORM_FEE_PAISE = 149900;

export function travellerCount(trip: TripConfig) {
  return trip.adults + trip.seniors + trip.children;
}

export function roomCount(trip: TripConfig) {
  return Math.max(1, Math.ceil(travellerCount(trip) / 3));
}

export function addOnTotal(addOn: AddOn, trip: TripConfig) {
  const travellers = travellerCount(trip);
  const strategy = addOn.pricing;
  switch (strategy.kind) {
    case "flat":
      return strategy.amountPaise;
    case "perDay":
      return strategy.amountPaise * strategy.days;
    case "perTraveller":
      return strategy.amountPaise * travellers;
    case "perTravellerPerDay":
      return strategy.amountPaise * travellers * trip.days;
    default:
      return 0;
  }
}

export function quoteAddOns(trip: TripConfig) {
  return trip.addOnIds.reduce((total, id) => {
    const addOn = ADD_ONS.find((entry) => entry.id === id);
    return addOn ? total + addOnTotal(addOn, trip) : total;
  }, 0);
}

export function calculateQuote(trip: TripConfig): Quote {
  const hotel = getHotel(trip.hotelId);
  const vehicle = getVehicle(trip.vehicleId);
  const rooms = roomCount(trip);
  const nights = Math.max(0, trip.days - 1);
  const hotelPaise = hotel.pricePerNightPaise * rooms * nights;
  const transportPaise = vehicle.pricePerDayPaise * trip.days;
  const addOnsPaise = quoteAddOns(trip);
  const subtotalPaise = hotelPaise + transportPaise + addOnsPaise;
  const platformFeePaise = PLATFORM_FEE_PAISE;
  const gstPaise = Math.round((subtotalPaise + platformFeePaise) * 0.05);
  const totalPaise = subtotalPaise + platformFeePaise + gstPaise;
  const advancePaise = Math.round((totalPaise * 0.25) / 100) * 100;
  const balancePaise = totalPaise - advancePaise;

  return {
    hotelPaise,
    transportPaise,
    addOnsPaise,
    subtotalPaise,
    platformFeePaise,
    gstPaise,
    totalPaise,
    advancePaise,
    balancePaise,
    rooms,
    nights,
  };
}
