/**
 * Unit tests for API functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { geocodeCity, fetchWeatherData } from '../../src/utils/api';
import type { GeocodeApiResponse, OpenMeteoForecastResponse } from '../../src/types/weather';

// Mock fetch globally
global.fetch = vi.fn();

describe('geocodeCity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return city coordinates for valid city name', async () => {
    const mockResponse: GeocodeApiResponse = {
      results: [
        {
          latitude: 45.5017,
          longitude: -73.5673,
          name: 'Montréal',
          country: 'CA',
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await geocodeCity('Montréal');

    expect(result).toEqual({
      latitude: 45.5017,
      longitude: -73.5673,
      name: 'Montréal',
      country: 'CA',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('geocoding-api.open-meteo.com')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('name=Montr%C3%A9al')
    );
  });

  it('should return null for city not found', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const result = await geocodeCity('NonexistentCity12345');

    expect(result).toBeNull();
  });

  it('should throw ApiError for HTTP error', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(geocodeCity('Test')).rejects.toThrow('Erreur de géocodage');
  });

  it('should encode city name in URL', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    await geocodeCity('New York');

    // encodeURIComponent uses %20 for spaces, not +
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('name=New%20York')
    );
  });
});

describe('fetchWeatherData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch weather data with correct parameters', async () => {
    const mockResponse: OpenMeteoForecastResponse = {
      current: {
        temperature_2m: 22.5,
        relative_humidity_2m: 65,
        wind_speed_10m: 5.2,
        wind_direction_10m: 180,
        weather_code: 0,
        pressure_msl: 1013.25,
        visibility: 10000,
      },
      daily: {
        temperature_2m_max: [25.0],
        temperature_2m_min: [15.0],
        weather_code: [0],
        sunrise: ['2024-01-15T07:00:00Z'],
        sunset: ['2024-01-15T18:00:00Z'],
      },
      hourly: {
        time: ['2024-01-15T12:00:00Z'],
        temperature_2m: [22.0],
        weather_code: [0],
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchWeatherData(45.5017, -73.5673);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.open-meteo.com/v1/forecast')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('latitude=45.5017')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('longitude=-73.5673')
    );
  });

  it('should include all required parameters in request', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await fetchWeatherData(45.5, -73.5);

    const callUrl = (global.fetch as any).mock.calls[0][0];
    expect(callUrl).toContain('current=');
    expect(callUrl).toContain('hourly=');
    expect(callUrl).toContain('daily=');
    expect(callUrl).toContain('timezone=auto');
    expect(callUrl).toContain('forecast_days=3');
  });

  it('should throw ApiError for HTTP error', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchWeatherData(45.5, -73.5)).rejects.toThrow('Erreur API météo');
  });

  it('should handle network errors gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchWeatherData(45.5, -73.5)).rejects.toThrow(
      'Impossible de contacter le service météo'
    );
  });
});
