/**
 * Unit tests for weatherHelpers utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  getWeatherDescription,
  getWeatherEmoji,
  getWeatherEmojiForDay,
  getWeatherEmojiForTime,
  windDirectionToText,
  formatVisibility,
  mapOpenMeteoResponse,
} from '../../src/utils/weatherHelpers';
import type { OpenMeteoForecastResponse } from '../../src/types/weather';

describe('getWeatherDescription', () => {
  it('should return correct description for clear sky (code 0)', () => {
    expect(getWeatherDescription(0)).toBe('☀️ ciel dégagé');
  });

  it('should return correct description for mainly clear (code 1)', () => {
    expect(getWeatherDescription(1)).toBe('🌤️ principalement dégagé');
  });

  it('should return correct description for partly cloudy (code 2)', () => {
    expect(getWeatherDescription(2)).toBe('⛅ partiellement nuageux');
  });

  it('should return correct description for overcast (code 3)', () => {
    expect(getWeatherDescription(3)).toBe('☁️ couvert');
  });

  it('should return correct description for rain (code 61)', () => {
    expect(getWeatherDescription(61)).toBe('🌧️ pluie légère');
  });

  it('should return correct description for snow (code 71)', () => {
    expect(getWeatherDescription(71)).toBe('❄️ neige légère');
  });

  it('should return correct description for thunderstorm (code 95)', () => {
    expect(getWeatherDescription(95)).toBe('⛈️ orage');
  });

  it('should return unknown for invalid code', () => {
    expect(getWeatherDescription(999)).toBe('❓ conditions météo inconnues');
  });
});

describe('getWeatherEmoji', () => {
  it('should extract emoji from description', () => {
    expect(getWeatherEmoji('☀️ ciel dégagé')).toBe('☀️');
    expect(getWeatherEmoji('🌧️ pluie légère')).toBe('🌧️');
    expect(getWeatherEmoji('❄️ neige légère')).toBe('❄️');
  });

  it('should return default emoji for empty string', () => {
    expect(getWeatherEmoji('')).toBe('🌤️');
  });
});

describe('getWeatherEmojiForDay', () => {
  it('should return day emoji for clear sky', () => {
    expect(getWeatherEmojiForDay(0)).toBe('☀️');
  });

  it('should return day emoji for mainly clear', () => {
    expect(getWeatherEmojiForDay(1)).toBe('🌤️');
  });

  it('should return day emoji for partly cloudy', () => {
    expect(getWeatherEmojiForDay(2)).toBe('⛅');
  });

  it('should return day emoji for overcast', () => {
    expect(getWeatherEmojiForDay(3)).toBe('☁️');
  });

  it('should return appropriate emoji for rain', () => {
    expect(getWeatherEmojiForDay(61)).toBe('🌧️');
  });

  it('should return appropriate emoji for snow', () => {
    expect(getWeatherEmojiForDay(71)).toBe('❄️');
  });
});

describe('getWeatherEmojiForTime', () => {
  const sunriseIso = '2024-01-15T07:00:00Z';
  const sunsetIso = '2024-01-15T18:00:00Z';

  it('should return sun emoji during day for clear sky', () => {
    const dayTime = '2024-01-15T12:00:00Z';
    expect(getWeatherEmojiForTime(0, dayTime, sunriseIso, sunsetIso)).toBe(
      '☀️'
    );
  });

  it('should return moon emoji during night for clear sky', () => {
    const nightTime = '2024-01-15T22:00:00Z';
    expect(getWeatherEmojiForTime(0, nightTime, sunriseIso, sunsetIso)).toBe(
      '🌙'
    );
  });

  it('should use fallback hours when sunrise/sunset not provided', () => {
    // Use local time to avoid timezone issues with fallback logic
    const dayTime = new Date();
    dayTime.setHours(14, 0, 0, 0); // 2 PM local time
    const dayTimeIso = dayTime.toISOString();

    const nightTime = new Date();
    nightTime.setHours(22, 0, 0, 0); // 10 PM local time
    const nightTimeIso = nightTime.toISOString();

    expect(getWeatherEmojiForTime(0, dayTimeIso)).toBe('☀️');
    expect(getWeatherEmojiForTime(0, nightTimeIso)).toBe('🌙');
  });

  it('should return appropriate emoji for non-clear weather codes', () => {
    const dayTime = '2024-01-15T12:00:00Z';
    expect(getWeatherEmojiForTime(61, dayTime, sunriseIso, sunsetIso)).toBe(
      '🌧️'
    );
    expect(getWeatherEmojiForTime(71, dayTime, sunriseIso, sunsetIso)).toBe(
      '❄️'
    );
  });
});

describe('windDirectionToText', () => {
  it('should return N for 0 degrees', () => {
    expect(windDirectionToText(0)).toBe('N');
  });

  it('should return NE for 45 degrees', () => {
    expect(windDirectionToText(45)).toBe('NE');
  });

  it('should return E for 90 degrees', () => {
    expect(windDirectionToText(90)).toBe('E');
  });

  it('should return S for 180 degrees', () => {
    expect(windDirectionToText(180)).toBe('S');
  });

  it('should return O for 270 degrees', () => {
    expect(windDirectionToText(270)).toBe('O');
  });

  it('should handle values > 360', () => {
    expect(windDirectionToText(405)).toBe('NE'); // 405 % 360 = 45
  });

  it('should return N/A for null/undefined', () => {
    expect(windDirectionToText(undefined)).toBe('N/A');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(windDirectionToText(null as any)).toBe('N/A');
  });

  it('should round to nearest direction', () => {
    // 22 / 45 = 0.488, rounds to 0, so it's N
    expect(windDirectionToText(22)).toBe('N');
    // 23 / 45 = 0.511, rounds to 1, so it's NE
    expect(windDirectionToText(23)).toBe('NE');
  });
});

describe('formatVisibility', () => {
  it('should format meters correctly for values < 1000', () => {
    expect(formatVisibility(500)).toBe('500 m');
    expect(formatVisibility(999)).toBe('999 m');
  });

  it('should format kilometers correctly for values >= 1000', () => {
    expect(formatVisibility(1000)).toBe('1.0 km');
    expect(formatVisibility(5000)).toBe('5.0 km');
    expect(formatVisibility(1234)).toBe('1.2 km');
  });

  it('should return N/A for null/undefined', () => {
    expect(formatVisibility(undefined)).toBe('N/A');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(formatVisibility(null as any)).toBe('N/A');
  });

  it('should return N/A for 0', () => {
    expect(formatVisibility(0)).toBe('N/A');
  });
});

describe('mapOpenMeteoResponse', () => {
  const mockApiResponse: OpenMeteoForecastResponse = {
    current: {
      temperature_2m: 22.5,
      relative_humidity_2m: 65,
      wind_speed_10m: 5.2,
      wind_direction_10m: 180,
      weather_code: 1,
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
      time: [
        '2024-01-15T12:00:00Z',
        '2024-01-15T13:00:00Z',
        '2024-01-15T14:00:00Z',
      ],
      temperature_2m: [22.0, 23.0, 24.0],
      weather_code: [0, 1, 2],
    },
  };

  it('should map current weather data correctly', () => {
    const result = mapOpenMeteoResponse(mockApiResponse, 'Montréal', 'CA');

    expect(result.weather.temperature).toBe(22.5);
    expect(result.weather.humidity).toBe(65);
    expect(result.weather.windSpeed).toBe(5.2);
    expect(result.weather.windDirection).toBe(180);
    expect(result.weather.pressure).toBe(1013);
    expect(result.weather.visibility).toBe(10000);
  });

  it('should use daily weather code for main card', () => {
    const result = mapOpenMeteoResponse(mockApiResponse, 'Montréal', 'CA');
    // Should use daily.weather_code[0] (0) instead of current.weather_code (1)
    expect(result.weather.weatherCode).toBe(0);
    expect(result.weather.description).toBe('☀️ ciel dégagé');
  });

  it('should map daily temperature min/max', () => {
    const result = mapOpenMeteoResponse(mockApiResponse, 'Montréal', 'CA');
    expect(result.weather.tempMin).toBe(15.0);
    expect(result.weather.tempMax).toBe(25.0);
  });

  it('should format sunrise and sunset times', () => {
    const result = mapOpenMeteoResponse(mockApiResponse, 'Montréal', 'CA');
    expect(result.weather.sunrise).toBeDefined();
    expect(result.weather.sunset).toBeDefined();
    expect(result.weather.sunriseIso).toBe('2024-01-15T07:00:00Z');
    expect(result.weather.sunsetIso).toBe('2024-01-15T18:00:00Z');
  });

  it('should map hourly forecasts correctly', () => {
    // Use future dates so they pass the filter
    const now = new Date();
    const future1 = new Date(now.getTime() + 3600000); // +1 hour
    const future2 = new Date(now.getTime() + 7200000); // +2 hours
    const future3 = new Date(now.getTime() + 10800000); // +3 hours

    const futureResponse: OpenMeteoForecastResponse = {
      ...mockApiResponse,
      hourly: {
        time: [
          future1.toISOString(),
          future2.toISOString(),
          future3.toISOString(),
        ],
        temperature_2m: [22.0, 23.0, 24.0],
        weather_code: [0, 1, 2],
      },
    };

    const result = mapOpenMeteoResponse(futureResponse, 'Montréal', 'CA');
    // Should only include future forecasts
    expect(result.hourly.length).toBeGreaterThan(0);
    if (result.hourly.length > 0) {
      expect(result.hourly[0]).toHaveProperty('time');
      expect(result.hourly[0]).toHaveProperty('temperature');
      expect(result.hourly[0]).toHaveProperty('weatherCode');
    }
  });

  it('should handle missing current data gracefully', () => {
    const minimalResponse: OpenMeteoForecastResponse = {
      daily: {
        weather_code: [0],
        temperature_2m_max: [20],
        temperature_2m_min: [10],
        sunrise: ['2024-01-15T07:00:00Z'],
        sunset: ['2024-01-15T18:00:00Z'],
      },
    };

    const result = mapOpenMeteoResponse(minimalResponse, 'Test', 'CA');
    expect(result.weather.temperature).toBe(0);
    expect(result.weather.humidity).toBe(0);
    expect(result.weather.windSpeed).toBe(0);
  });

  it('should handle missing daily data', () => {
    const response: OpenMeteoForecastResponse = {
      current: {
        weather_code: 1,
        temperature_2m: 20,
      },
    };

    const result = mapOpenMeteoResponse(response, 'Test', 'CA');
    // Should fallback to current.weather_code
    expect(result.weather.weatherCode).toBe(1);
  });

  it('should round pressure correctly', () => {
    const response: OpenMeteoForecastResponse = {
      current: {
        pressure_msl: 1013.789,
      },
      daily: {
        weather_code: [0],
      },
    };

    const result = mapOpenMeteoResponse(response, 'Test', 'CA');
    expect(result.weather.pressure).toBe(1014);
  });
});
