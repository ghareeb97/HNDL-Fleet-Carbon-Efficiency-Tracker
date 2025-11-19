// Type definitions for the Fleet Carbon Tracker

export interface Tire {
  pressure: string;
  treadDepth: string;
}

export interface Vehicle {
  id: number;
  plate: string;
  providerName: string;
  make: string;
  model: string;
  year: string;
  fuelType: string;
  fuelEconomy: string;
  tireCount: number;
  tires: Tire[];
  lastOdometer: number;
}

export interface NewVehicle {
  plate: string;
  providerName: string;
  make: string;
  model: string;
  year: string;
  fuelType: string;
  fuelEconomy: string;
  tireCount: number;
  tires: Tire[];
}

export interface Stop {
  location: string;
  lat: number | null;
  lng: number | null;
}

export interface Emissions {
  fuel: number;
  tires: number;
  oil: number;
  idle: number;
  total: number;
}

export interface FormData {
  date: string;
  vehiclePlate: string;
  providerName: string;
  make: string;
  model: string;
  year: string;
  fuelType: string;
  fuelEconomy: string;
  loadWeight: string;
  loadPhoto: string | null;
  tireCount: number;
  tires: Tire[];
  oilCondition: string;
  airFilter: string;
  acUsage: boolean;
  includeIdleTime: boolean;
  idleTimePerStop: number;
  stops: Stop[];
  googleDistance: number;
  abnormalities: string;
  odometerStart?: number;
}

export interface ProviderStats {
  trips: number;
  emissions: number;
  distance: number;
}

export interface Inspection extends FormData {
  id: number;
  timestamp: string;
  odometerEnd: number;
  emissions: Emissions;
}

export interface VehicleDatabase {
  [make: string]: {
    models: string[];
    fuelConsumption: {
      [model: string]: number;
    };
  };
}
