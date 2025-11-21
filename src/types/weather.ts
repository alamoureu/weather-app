/**
 * Fichier: src/types/weather.ts
 * Description: Définit tous les types TypeScript utilisés dans l'application météo
 *
 * Ce fichier contient les interfaces et types pour :
 * - Les données météo normalisées
 * - Les prévisions horaires
 * - Les statuts de chargement
 * - Les réponses de l'API Open-Meteo
 */

// Type pour les prévisions horaires
// Chaque prévision contient l'heure, la température et le code météo
export type HourlyForecast = {
  time: string; // Date/heure ISO de la prévision
  temperature: number; // Température en degrés Celsius
  weatherCode: number; // Code météo Open-Meteo (0-99)
};

// Type pour les données météo principales
// Toutes les données viennent directement de l'API Open-Meteo
export type WeatherData = {
  city: string; // Nom de la ville (depuis l'API de géocodage)
  country?: string; // Code pays (depuis l'API de géocodage)
  description: string; // Description météo avec emoji (générée depuis weather_code)
  weatherCode: number; // Code météo WMO (0-99) - pour affichage jour/nuit
  temperature: number; // Température actuelle en °C (current.temperature_2m)
  feelsLike: number; // Température ressentie en °C (utilise temperature_2m car Open-Meteo ne fournit pas feels_like)
  tempMin?: number; // Température minimale du jour en °C (daily.temperature_2m_min[0])
  tempMax?: number; // Température maximale du jour en °C (daily.temperature_2m_max[0])
  humidity: number; // Humidité relative en % (current.relative_humidity_2m)
  windSpeed: number; // Vitesse du vent en m/s (current.wind_speed_10m)
  windDirection?: number; // Direction du vent en degrés (current.wind_direction_10m)
  pressure?: number; // Pression atmosphérique en hPa (current.pressure_msl)
  sunrise?: string; // Heure de lever du soleil formatée (daily.sunrise[0])
  sunset?: string; // Heure de coucher du soleil formatée (daily.sunset[0])
  sunriseIso?: string; // Heure de lever du soleil en ISO (daily.sunrise[0]) - pour calcul jour/nuit
  sunsetIso?: string; // Heure de coucher du soleil en ISO (daily.sunset[0]) - pour calcul jour/nuit
  visibility?: number; // Visibilité en mètres (current.visibility) - données réelles de l'API
  icon?: string; // Non utilisé (Open-Meteo utilise des codes météo)
};

// Statut de chargement de l'application
export type WeatherStatus =
  | 'idle' // État initial, aucune recherche effectuée
  | 'loading' // Chargement en cours
  | 'success' // Données chargées avec succès
  | 'error'; // Erreur lors du chargement

// Type pour la réponse de géocodage
export type GeocodeResult = {
  latitude: number; // Latitude de la ville
  longitude: number; // Longitude de la ville
  name: string; // Nom officiel de la ville
  country: string; // Code pays (ex: "CA", "FR")
};

// Type pour la réponse brute de l'API Open-Meteo Forecast
export type OpenMeteoForecastResponse = {
  current?: {
    temperature_2m?: number; // Température à 2m en °C
    relative_humidity_2m?: number; // Humidité relative à 2m en %
    wind_speed_10m?: number; // Vitesse du vent à 10m en m/s
    wind_direction_10m?: number; // Direction du vent à 10m en degrés
    weather_code?: number; // Code météo WMO (0-99)
    pressure_msl?: number; // Pression au niveau de la mer en hPa
    visibility?: number; // Visibilité en mètres (données réelles de l'API)
  };
  hourly?: {
    time?: string[]; // Tableau de dates/heures ISO
    temperature_2m?: number[]; // Tableau de températures en °C
    weather_code?: number[]; // Tableau de codes météo
  };
  daily?: {
    temperature_2m_max?: number[]; // Températures maximales quotidiennes en °C
    temperature_2m_min?: number[]; // Températures minimales quotidiennes en °C
    weather_code?: number[]; // Codes météo quotidiens
    sunrise?: string[]; // Heures de lever du soleil (ISO)
    sunset?: string[]; // Heures de coucher du soleil (ISO)
  };
};

// Type pour la réponse de l'API de géocodage Open-Meteo
export type GeocodeApiResponse = {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
    country: string;
  }>;
};
