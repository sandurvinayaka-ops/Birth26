
export interface BirthEvent {
  id: string;
  lat: number;
  lng: number;
  country: string;
  timestamp: number;
}

export interface RegionWeight {
  name: string;
  weight: number; // Probability weight
  coords: [number, number]; // [lat, lng] approx center
  radius: number; // For jitter
}

export interface PopulationInsight {
  summary: string;
  keyPoints: string[];
  projection: string;
}
