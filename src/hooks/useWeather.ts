/**
 * Custom hook for weather data fetching and state management
 * Encapsulates all weather-related logic and state
 */

import { useState, useCallback } from 'react';
import { geocodeCity, fetchWeatherData } from '../utils/api';
import { mapOpenMeteoResponse } from '../utils/weatherHelpers';
import type {
  WeatherData,
  HourlyForecast,
  WeatherStatus,
} from '../types/weather';

interface UseWeatherReturn {
  weather: WeatherData | null;
  hourlyForecasts: HourlyForecast[];
  status: WeatherStatus;
  refreshKey: number;
  search: (cityName: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useWeather(initialCity: string = 'Montréal'): UseWeatherReturn {
  const [city, setCity] = useState(initialCity);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyForecast[]>([]);
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [refreshKey, setRefreshKey] = useState(0);

  const search = useCallback(async (cityName: string) => {
    const trimmedCity = cityName.trim();
    if (!trimmedCity) return;

    try {
      setStatus('loading');
      setCity(trimmedCity);

      const location = await geocodeCity(trimmedCity);
      if (!location) {
        throw new Error('Ville non trouvée');
      }

      const weatherData = await fetchWeatherData(
        location.latitude,
        location.longitude
      );

      const { weather: mapped, hourly } = mapOpenMeteoResponse(
        weatherData,
        location.name,
        location.country
      );

      setWeather(mapped);
      setHourlyForecasts(hourly);
      setStatus('success');
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Erreur lors de la recherche météo:', error);
      setStatus('error');
      setWeather(null);
      setHourlyForecasts([]);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (city) {
      await search(city);
    }
  }, [city, search]);

  return {
    weather,
    hourlyForecasts,
    status,
    refreshKey,
    search,
    refresh,
  };
}
