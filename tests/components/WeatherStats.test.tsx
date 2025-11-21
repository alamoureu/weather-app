/**
 * Unit tests for WeatherStats component
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { WeatherStats } from '../../src/components/WeatherStats';
import type { WeatherData } from '../../src/types/weather';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('WeatherStats', () => {
  const mockWeatherData: WeatherData = {
    city: 'Montréal',
    country: 'CA',
    description: '☀️ ciel dégagé',
    weatherCode: 0,
    temperature: 22.5,
    feelsLike: 22.5,
    tempMin: 15.0,
    tempMax: 25.0,
    humidity: 65,
    windSpeed: 5.2,
    windDirection: 180,
    pressure: 1013,
    visibility: 10000,
    sunrise: '07:00',
    sunset: '18:00',
    sunriseIso: '2024-01-15T07:00:00Z',
    sunsetIso: '2024-01-15T18:00:00Z',
  };

  it('should display humidity with correct unit (%)', () => {
    renderWithProvider(<WeatherStats weather={mockWeatherData} />);
    expect(screen.getByText(/65%/)).toBeInTheDocument();
  });

  it('should display wind speed with correct unit (m/s)', () => {
    renderWithProvider(<WeatherStats weather={mockWeatherData} />);
    expect(screen.getByText(/5.2 m\/s/)).toBeInTheDocument();
  });

  it('should display pressure with correct unit (hPa)', () => {
    renderWithProvider(<WeatherStats weather={mockWeatherData} />);
    expect(screen.getByText(/1013 hPa/)).toBeInTheDocument();
  });

  it('should display visibility with correct formatting', () => {
    renderWithProvider(<WeatherStats weather={mockWeatherData} />);
    // 10000 meters = 10.0 km
    expect(screen.getByText(/10.0 km/)).toBeInTheDocument();
  });

  it('should display wind direction', () => {
    renderWithProvider(<WeatherStats weather={mockWeatherData} />);
    expect(screen.getByText(/Direction S/)).toBeInTheDocument();
  });

  it('should handle missing pressure gracefully', () => {
    const weatherWithoutPressure = { ...mockWeatherData, pressure: undefined };
    renderWithProvider(<WeatherStats weather={weatherWithoutPressure} />);
    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });

  it('should handle missing visibility gracefully', () => {
    const weatherWithoutVisibility = { ...mockWeatherData, visibility: undefined };
    renderWithProvider(<WeatherStats weather={weatherWithoutVisibility} />);
    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });

  it('should format visibility in meters for values < 1000', () => {
    const weatherWithLowVisibility = { ...mockWeatherData, visibility: 500 };
    renderWithProvider(<WeatherStats weather={weatherWithLowVisibility} />);
    expect(screen.getByText(/500 m/)).toBeInTheDocument();
  });
});

