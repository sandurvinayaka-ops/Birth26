
export interface CountryData {
  name: string;
  iso: string;
  birthRate: number; // Births per 1,000 people
  totalBirths: number;
  latitude: number;
  longitude: number;
  region: string;
  color: string;
}

export interface GlobalStats {
  totalEstimatedBirthsToday: number;
  averageGlobalRate: number;
  topGrowthRegions: string[];
}

export interface AIInsight {
  title: string;
  content: string;
  severity: 'low' | 'medium' | 'high';
}
