/**
 * API client for Open-Meteo services
 * Handles geocoding and weather forecast API calls
 */

import type {
  GeocodeResult,
  GeocodeApiResponse,
  OpenMeteoForecastResponse,
} from '../types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Fonction pour obtenir les coordonnées GPS d'une ville
 * @param cityName - Nom de la ville à rechercher
 * @returns Promise avec les coordonnées, nom et pays, ou null si non trouvé
 *
 * Cette fonction :
 * 1. Encode le nom de ville pour l'URL (gère les espaces et caractères spéciaux)
 * 2. Fait un appel GET à l'API de géocodage Open-Meteo
 * 3. Retourne le premier résultat trouvé (le plus pertinent)
 * 4. Retourne null si aucune ville n'est trouvée ou en cas d'erreur
 */
export async function geocodeCity(
  cityName: string
): Promise<GeocodeResult | null> {
  try {
    const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(
      cityName
    )}&count=1&language=fr`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError('Erreur de géocodage', response.status);
    }

    const data = (await response.json()) as GeocodeApiResponse;

    if (!data.results?.length) {
      return null;
    }

    return data.results[0];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Erreur de géocodage:', error);
    throw new ApiError('Impossible de contacter le service de géocodage');
  }
}

/**
 * Fonction pour récupérer les données météo depuis Open-Meteo
 * @param latitude - Latitude GPS de la position
 * @param longitude - Longitude GPS de la position
 * @returns Promise avec les données météo brutes de l'API
 *
 * Cette fonction :
 * 1. Construit les paramètres de requête avec toutes les données nécessaires
 * 2. Fait un appel GET à l'API de prévisions Open-Meteo
 * 3. Retourne les données JSON brutes
 *
 * Paramètres demandés à l'API :
 * - current : données actuelles (température, humidité, vent, pression, visibilité, code météo)
 * - hourly : prévisions horaires (température et code météo)
 * - daily : prévisions quotidiennes (min/max, lever/coucher soleil, code météo)
 * - timezone : fuseau horaire automatique
 * - forecast_days : 3 jours de prévisions pour avoir assez de données horaires
 */
const CURRENT_PARAMS =
  'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,pressure_msl,visibility';
const HOURLY_PARAMS = 'temperature_2m,weather_code';
const DAILY_PARAMS =
  'temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset';

export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<OpenMeteoForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: CURRENT_PARAMS,
    hourly: HOURLY_PARAMS,
    daily: DAILY_PARAMS,
    timezone: 'auto',
    forecast_days: '3',
  });

  try {
    const url = `${FORECAST_API_URL}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError('Erreur API météo', response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Erreur lors de la récupération des données météo:', error);
    throw new ApiError('Impossible de contacter le service météo');
  }
}
