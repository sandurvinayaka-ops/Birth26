
import { CountryData } from './types';

export const SAMPLE_COUNTRIES: CountryData[] = [
  { name: 'Nigeria', iso: 'NGA', birthRate: 36.5, totalBirths: 7800000, latitude: 9.082, longitude: 8.675, region: 'Africa', color: '#f87171' },
  { name: 'India', iso: 'IND', birthRate: 16.7, totalBirths: 23000000, latitude: 20.5937, longitude: 78.9629, region: 'Asia', color: '#fb923c' },
  { name: 'USA', iso: 'USA', birthRate: 11.0, totalBirths: 3600000, latitude: 37.0902, longitude: -95.7129, region: 'Americas', color: '#60a5fa' },
  { name: 'China', iso: 'CHN', birthRate: 6.7, totalBirths: 9500000, latitude: 35.8617, longitude: 104.1954, region: 'Asia', color: '#fbbf24' },
  { name: 'Brazil', iso: 'BRA', birthRate: 12.4, totalBirths: 2600000, latitude: -14.235, longitude: -51.9253, region: 'Americas', color: '#4ade80' },
  { name: 'Germany', iso: 'DEU', birthRate: 9.3, totalBirths: 790000, latitude: 51.1657, longitude: 10.4515, region: 'Europe', color: '#a78bfa' },
  { name: 'Japan', iso: 'JPN', birthRate: 6.6, totalBirths: 800000, latitude: 36.2048, longitude: 138.2529, region: 'Asia', color: '#f472b6' },
  { name: 'Congo', iso: 'COD', birthRate: 42.0, totalBirths: 3800000, latitude: -4.0383, longitude: 21.7587, region: 'Africa', color: '#f87171' },
  { name: 'Indonesia', iso: 'IDN', birthRate: 17.5, totalBirths: 4800000, latitude: -0.7893, longitude: 113.9213, region: 'Asia', color: '#fb923c' },
  { name: 'Pakistan', iso: 'PAK', birthRate: 27.0, totalBirths: 6000000, latitude: 30.3753, longitude: 69.3451, region: 'Asia', color: '#fb923c' }
];

export const REGIONS = ['Africa', 'Asia', 'Europe', 'Americas', 'Oceania'];

export const GLOBE_TEXTURE_URL = '//unpkg.com/three-globe/example/img/earth-night.jpg';
export const GLOBE_BUMP_URL = '//unpkg.com/three-globe/example/img/earth-topology.png';
