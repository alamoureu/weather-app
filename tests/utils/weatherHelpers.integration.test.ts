/**
 * Integration tests for weatherHelpers
 * Tests the complete data flow from API response to formatted data
 */

import { describe, it, expect } from 'vitest';
import { mapOpenMeteoResponse } from '../../src/utils/weatherHelpers';
import type { OpenMeteoForecastResponse } from '../../src/types/weather';

describe('mapOpenMeteoResponse - Integration Tests', () => {
  it('should correctly map complete API response with all units', () => {
    const completeResponse: OpenMeteoForecastResponse = {
      current: {
        // Temperature in °C (API unit)
        temperature_2m: 22.5,
        // Humidity in % (API unit)
        relative_humidity_2m: 65,
        // Wind speed in m/s (API unit)
        wind_speed_10m: 5.2,
        // Wind direction in degrees (API unit)
        wind_direction_10m: 180,
        weather_code: 1,
        // Pressure in hPa (API unit)
        pressure_msl: 1013.25,
        // Visibility in meters (API unit)
        visibility: 10000,
      },
      daily: {
        // Temperatures in °C (API unit)
        temperature_2m_max: [25.0],
        temperature_2m_min: [15.0],
        weather_code: [0],
        sunrise: ['2024-01-15T07:00:00Z'],
        sunset: ['2024-01-15T18:00:00Z'],
      },
      hourly: {
        time: [
          new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
        ],
        temperature_2m: [23.0, 24.0],
        weather_code: [0, 1],
      },
    };

    const result = mapOpenMeteoResponse(completeResponse, 'Montréal', 'CA');

    // Verify all units are preserved correctly
    expect(result.weather.temperature).toBe(22.5); // °C
    expect(result.weather.humidity).toBe(65); // %
    expect(result.weather.windSpeed).toBe(5.2); // m/s
    expect(result.weather.windDirection).toBe(180); // degrees
    expect(result.weather.pressure).toBe(1013); // hPa (rounded)
    expect(result.weather.visibility).toBe(10000); // meters

    // Verify daily temperatures
    expect(result.weather.tempMin).toBe(15.0); // °C
    expect(result.weather.tempMax).toBe(25.0); // °C

    // Verify hourly forecasts
    expect(result.hourly.length).toBeGreaterThan(0);
    result.hourly.forEach((forecast) => {
      expect(forecast.temperature).toBeGreaterThan(-50); // Reasonable °C range
      expect(forecast.temperature).toBeLessThan(60);
      expect(forecast.weatherCode).toBeGreaterThanOrEqual(0);
      expect(forecast.weatherCode).toBeLessThanOrEqual(99);
    });
  });

  it('should handle missing optional fields gracefully', () => {
    const minimalResponse: OpenMeteoForecastResponse = {
      current: {
        temperature_2m: 20,
      },
      daily: {
        weather_code: [0],
      },
    };

    const result = mapOpenMeteoResponse(minimalResponse, 'Test', 'CA');

    expect(result.weather.temperature).toBe(20);
    expect(result.weather.humidity).toBe(0); // Default
    expect(result.weather.windSpeed).toBe(0); // Default
    expect(result.weather.pressure).toBeUndefined();
    expect(result.weather.visibility).toBeUndefined();
  });

  it('should correctly prioritize daily weather code over current', () => {
    const response: OpenMeteoForecastResponse = {
      current: {
        weather_code: 3, // Overcast
        temperature_2m: 20,
      },
      daily: {
        weather_code: [0], // Clear sky
        temperature_2m_max: [25],
        temperature_2m_min: [15],
      },
    };

    const result = mapOpenMeteoResponse(response, 'Test', 'CA');

    // Should use daily weather code (0) not current (3)
    expect(result.weather.weatherCode).toBe(0);
    expect(result.weather.description).toBe('☀️ ciel dégagé');
  });
});
