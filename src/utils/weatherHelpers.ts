/**
 * Fichier: src/utils/weatherHelpers.ts
 * Description: Fonctions utilitaires pour traiter et formater les données météo
 *
 * Ce fichier contient :
 * - Mapping des codes météo Open-Meteo vers des descriptions en français
 * - Extraction d'emojis depuis les descriptions
 * - Adaptation des emojis selon l'heure (jour/nuit)
 * - Formatage des données (vent, visibilité)
 * - Transformation des données brutes de l'API vers notre format
 */

import type {
  WeatherData,
  HourlyForecast,
  OpenMeteoForecastResponse,
} from '../types/weather';
import { formatTime, isNightTime } from './datetime';

/**
 * Mapping des codes météo WMO (World Meteorological Organization) vers des descriptions en français
 * Les codes 0-99 correspondent aux conditions météo standardisées
 * @param weatherCode - Code météo WMO (0-99)
 * @returns Description en français avec emoji
 */
/**
 * Mapping WMO weather codes to descriptions with appropriate emojis
 * Based on WMO Weather Interpretation Codes (WW)
 * Reference: https://open-meteo.com/en/docs
 */
export function getWeatherDescription(weatherCode: number): string {
  const codes: Record<number, string> = {
    // Clear sky conditions (0-3)
    0: '☀️ ciel dégagé', // Clear sky
    1: '🌤️ principalement dégagé', // Mainly clear
    2: '⛅ partiellement nuageux', // Partly cloudy
    3: '☁️ couvert', // Overcast

    // Fog (45-48)
    45: '☁️ brouillard', // Fog
    48: '☁️ brouillard givrant', // Depositing rime fog

    // Drizzle (51-57)
    51: '🌦️ bruine légère', // Light drizzle
    53: '🌦️ bruine modérée', // Moderate drizzle
    55: '🌦️ bruine dense', // Dense drizzle
    56: '🌦️ bruine verglaçante légère', // Light freezing drizzle
    57: '🌦️ bruine verglaçante dense', // Dense freezing drizzle

    // Rain (61-67)
    61: '🌧️ pluie légère', // Slight rain
    63: '🌧️ pluie modérée', // Moderate rain
    65: '🌧️ pluie forte', // Heavy rain
    66: '🌧️ pluie verglaçante légère', // Light freezing rain
    67: '🌧️ pluie verglaçante forte', // Heavy freezing rain

    // Snow (71-77)
    71: '❄️ neige légère', // Slight snow fall
    73: '❄️ neige modérée', // Moderate snow fall
    75: '❄️ neige forte', // Heavy snow fall
    77: '❄️ grains de neige', // Snow grains

    // Rain showers (80-82)
    80: '🌦️ averses de pluie légères', // Slight rain showers
    81: '🌦️ averses de pluie modérées', // Moderate rain showers
    82: '🌧️ averses de pluie fortes', // Violent rain showers

    // Snow showers (85-86)
    85: '🌨️ averses de neige légères', // Slight snow showers
    86: '🌨️ averses de neige fortes', // Heavy snow showers

    // Thunderstorm (95-99)
    95: '⛈️ orage', // Thunderstorm
    96: '⛈️ orage avec grêle', // Thunderstorm with slight hail
    99: '⛈️ orage avec grêle forte', // Thunderstorm with heavy hail
  };

  return codes[weatherCode] || '❓ conditions météo inconnues';
}

/**
 * Extrait l'emoji du début d'une description météo
 * @param description - Description avec emoji (ex: "☀️ ciel dégagé")
 * @returns L'emoji seul (ex: "☀️")
 */
export function getWeatherEmoji(description: string): string {
  // Regex qui match le premier emoji (peut être multi-caractère)
  // Match tout jusqu'au premier espace, ce qui capture l'emoji complet
  const emojiMatch = description.match(/^[\S]+/);
  // Retourner l'emoji trouvé ou un emoji par défaut
  return emojiMatch ? emojiMatch[0] : '🌤️';
}

/**
 * Obtient l'emoji météo pour la journée (toujours version jour)
 * Utilisé pour la carte principale qui affiche le temps général de la journée
 * @param weatherCode - Code météo WMO (daily weather code)
 * @returns Emoji de la journée (toujours version jour)
 */
export function getWeatherEmojiForDay(weatherCode: number): string {
  // Mapping spécial pour les codes de ciel clair (toujours version jour)
  const dayNightMap: Record<number, { day: string; night: string }> = {
    0: { day: '☀️', night: '🌙' }, // Ciel dégagé : soleil le jour
    1: { day: '🌤️', night: '🌙' }, // Principalement dégagé : soleil nuageux le jour
    2: { day: '⛅', night: '☁️' }, // Partiellement nuageux : nuage avec soleil le jour
    3: { day: '☁️', night: '☁️' }, // Couvert : nuage jour et nuit
  };

  // Si c'est un code avec mapping jour/nuit, utiliser la version jour
  if (dayNightMap[weatherCode]) {
    return dayNightMap[weatherCode].day;
  }

  // Pour les autres codes (pluie, neige, etc.), utiliser l'emoji normal
  return getWeatherEmoji(getWeatherDescription(weatherCode));
}

/**
 * Obtient l'emoji météo adapté selon l'heure (jour/nuit)
 * Utilisé pour les prévisions horaires qui changent selon l'heure
 * @param weatherCode - Code météo WMO
 * @param time - Date/heure ISO de la prévision
 * @param sunriseIso - Heure de lever du soleil en ISO (optionnel)
 * @param sunsetIso - Heure de coucher du soleil en ISO (optionnel)
 * @returns Emoji adapté (soleil le jour, lune la nuit)
 *
 * Cette fonction adapte les icônes selon l'heure :
 * - Jour (entre lever et coucher du soleil) : soleil pour ciel dégagé
 * - Nuit (avant lever ou après coucher du soleil) : lune pour ciel dégagé
 * - Si sunrise/sunset non disponibles, utilise 6h-20h comme fallback
 * - Autres conditions : emoji normal
 */
export function getWeatherEmojiForTime(
  weatherCode: number,
  time: string,
  sunriseIso?: string,
  sunsetIso?: string
): string {
  const forecastDate = new Date(time);
  const night = isNightTime(forecastDate, sunriseIso, sunsetIso);

  // Mapping spécial pour les codes de ciel clair (jour/nuit)
  const dayNightMap: Record<number, { day: string; night: string }> = {
    0: { day: '☀️', night: '🌙' }, // Ciel dégagé : soleil le jour, lune la nuit
    1: { day: '🌤️', night: '🌙' }, // Principalement dégagé : soleil nuageux le jour, lune la nuit
    2: { day: '⛅', night: '☁️' }, // Partiellement nuageux : nuage avec soleil le jour, nuage la nuit
    3: { day: '☁️', night: '☁️' }, // Couvert : nuage jour et nuit
  };

  // Si c'est un code avec mapping jour/nuit, utiliser le bon emoji
  if (dayNightMap[weatherCode]) {
    return night
      ? dayNightMap[weatherCode].night
      : dayNightMap[weatherCode].day;
  }

  // Pour les autres codes (pluie, neige, etc.), utiliser l'emoji normal
  return getWeatherEmoji(getWeatherDescription(weatherCode));
}

/**
 * Convertit la direction du vent en degrés vers une direction cardinale
 * @param deg - Direction en degrés (0-360, 0 = Nord)
 * @returns Direction cardinale (N, NE, E, SE, S, SO, O, NO)
 */
export function windDirectionToText(deg?: number): string {
  // Si pas de direction, retourner N/A
  if (deg == null) return 'N/A';

  // Tableau des 8 directions cardinales
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

  // Convertir les degrés en index (0-7)
  // Math.round(deg / 45) donne un nombre de 0 à 8
  // % 8 assure qu'on reste dans la plage 0-7
  const index = Math.round(deg / 45) % 8;

  return directions[index];
}

/**
 * Formate la visibilité en mètres vers un format lisible
 * @param meters - Visibilité en mètres (données réelles de l'API)
 * @returns String formatée (ex: "10.5 km" ou "500 m")
 */
export function formatVisibility(meters?: number): string {
  // Si pas de visibilité ou 0, retourner N/A
  if (meters == null || meters === 0) return 'N/A';

  // Si >= 1000m, convertir en km avec 1 décimale
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  }

  // Sinon, afficher en mètres (arrondi)
  return `${Math.round(meters)} m`;
}

/**
 * Transforme les données brutes de l'API Open-Meteo vers notre format normalisé
 * @param weatherData - Données brutes de l'API
 * @param cityName - Nom de la ville (depuis le géocodage)
 * @param country - Code pays (depuis le géocodage)
 * @returns Objet avec weather (données principales) et hourly (prévisions horaires)
 *
 * Cette fonction :
 * 1. Extrait les données current, daily, hourly de la réponse API
 * 2. Formate les heures de lever/coucher du soleil
 * 3. Filtre les prévisions horaires pour ne garder que les heures futures
 * 4. Mappe toutes les données vers notre format WeatherData
 *
 * Toutes les données viennent directement de l'API, aucune donnée inventée.
 */
export function mapOpenMeteoResponse(
  weatherData: OpenMeteoForecastResponse,
  cityName: string,
  country: string
): { weather: WeatherData; hourly: HourlyForecast[] } {
  // Extraire les sections de données (avec valeurs par défaut si absentes)
  const current = weatherData.current || {};
  const daily = weatherData.daily || {};
  const hourly = weatherData.hourly || {};

  // Obtenir le code météo pour la carte principale
  // Priorité : daily[0] (météo de la journée) > current (météo actuelle)
  // La carte principale doit afficher le temps général de la journée
  const weatherCode = daily.weather_code?.[0] ?? current.weather_code ?? 0;

  // Formater les heures de lever/coucher du soleil
  const sunriseIso = daily.sunrise?.[0];
  const sunsetIso = daily.sunset?.[0];
  const sunrise = sunriseIso ? formatTime(sunriseIso) : undefined;
  const sunset = sunsetIso ? formatTime(sunsetIso) : undefined;

  // Mapper les prévisions horaires (seulement les heures futures)
  const hourlyForecasts: HourlyForecast[] = [];

  // Vérifier que les données horaires existent
  if (hourly.time && hourly.temperature_2m && hourly.weather_code) {
    const now = new Date(); // Date/heure actuelle

    // Parcourir les 24 premières heures de prévisions
    for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
      const forecastTime = new Date(hourly.time[i]);

      // Ne garder que les heures futures (>= maintenant)
      if (forecastTime >= now) {
        hourlyForecasts.push({
          time: hourly.time[i], // Date/heure ISO
          temperature: hourly.temperature_2m[i], // Température en °C
          weatherCode: hourly.weather_code[i], // Code météo WMO
        });
      }
    }
  }

  // Retourner les données mappées
  return {
    weather: {
      city: cityName, // Nom de la ville (API géocodage)
      country: country, // Code pays (API géocodage)
      description: getWeatherDescription(weatherCode), // Description générée depuis le code
      weatherCode: weatherCode, // Code météo pour affichage jour/nuit
      temperature: current.temperature_2m ?? 0, // Température actuelle (API)
      feelsLike: current.temperature_2m ?? 0, // Ressenti = température (Open-Meteo ne fournit pas feels_like)
      tempMin: daily.temperature_2m_min?.[0], // Température min du jour (API)
      tempMax: daily.temperature_2m_max?.[0], // Température max du jour (API)
      humidity: current.relative_humidity_2m ?? 0, // Humidité relative en % (API)
      windSpeed: current.wind_speed_10m ?? 0, // Vitesse du vent en m/s (API)
      windDirection: current.wind_direction_10m, // Direction du vent en degrés (API)
      pressure: current.pressure_msl
        ? Math.round(current.pressure_msl)
        : undefined, // Pression en hPa arrondie (API)
      sunrise: sunrise, // Lever du soleil formaté (API)
      sunset: sunset, // Coucher du soleil formaté (API)
      sunriseIso: sunriseIso, // Lever du soleil en ISO (pour calcul jour/nuit)
      sunsetIso: sunsetIso, // Coucher du soleil en ISO (pour calcul jour/nuit)
      visibility: current.visibility, // Visibilité en mètres (API - données réelles)
      icon: undefined, // Non utilisé (Open-Meteo utilise des codes)
    },
    hourly: hourlyForecasts, // Prévisions horaires filtrées
  };
}
