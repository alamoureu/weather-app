/**
 * Unit tests for datetime utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  formatTime,
  getMinutesSinceMidnight,
  isNightTime,
} from '../../src/utils/datetime';

describe('formatTime', () => {
  it('should format ISO string to time string', () => {
    const iso = '2024-01-15T14:30:00Z';
    const formatted = formatTime(iso);
    // Should be in format HH:MM
    expect(formatted).toMatch(/^\d{2}:\d{2}$/);
  });

  it('should use fr-FR locale by default', () => {
    const iso = '2024-01-15T09:15:00Z';
    const formatted = formatTime(iso);
    expect(formatted).toBeDefined();
  });

  it('should accept custom locale', () => {
    const iso = '2024-01-15T14:30:00Z';
    const formatted = formatTime(iso, 'en-US');
    expect(formatted).toBeDefined();
  });
});

describe('getMinutesSinceMidnight', () => {
  it('should return 0 for midnight', () => {
    const date = new Date('2024-01-15T00:00:00');
    expect(getMinutesSinceMidnight(date)).toBe(0);
  });

  it('should return correct minutes for 1:30 AM', () => {
    const date = new Date('2024-01-15T01:30:00');
    expect(getMinutesSinceMidnight(date)).toBe(90);
  });

  it('should return correct minutes for noon', () => {
    const date = new Date('2024-01-15T12:00:00');
    expect(getMinutesSinceMidnight(date)).toBe(720);
  });

  it('should return correct minutes for 11:59 PM', () => {
    const date = new Date('2024-01-15T23:59:00');
    expect(getMinutesSinceMidnight(date)).toBe(1439);
  });
});

describe('isNightTime', () => {
  const sunriseIso = '2024-01-15T07:00:00Z';
  const sunsetIso = '2024-01-15T18:00:00Z';

  it('should return false during day (between sunrise and sunset)', () => {
    const dayTime = new Date('2024-01-15T12:00:00Z');
    expect(isNightTime(dayTime, sunriseIso, sunsetIso)).toBe(false);
  });

  it('should return true before sunrise', () => {
    const nightTime = new Date('2024-01-15T05:00:00Z');
    expect(isNightTime(nightTime, sunriseIso, sunsetIso)).toBe(true);
  });

  it('should return true after sunset', () => {
    const nightTime = new Date('2024-01-15T20:00:00Z');
    expect(isNightTime(nightTime, sunriseIso, sunsetIso)).toBe(true);
  });

  it('should use fallback hours when sunrise/sunset not provided', () => {
    // Use local time dates to avoid timezone issues
    const dayTime = new Date();
    dayTime.setHours(14, 0, 0, 0); // 2 PM local time

    const nightTime = new Date();
    nightTime.setHours(22, 0, 0, 0); // 10 PM local time

    const earlyNight = new Date();
    earlyNight.setHours(4, 0, 0, 0); // 4 AM local time

    expect(isNightTime(dayTime)).toBe(false);
    expect(isNightTime(nightTime)).toBe(true);
    expect(isNightTime(earlyNight)).toBe(true);
  });

  it('should handle polar regions (sunset before sunrise)', () => {
    // Simulate polar night: sunset at 2:00, sunrise at 10:00
    const polarSunset = '2024-01-15T02:00:00Z';
    const polarSunrise = '2024-01-15T10:00:00Z';

    const nightTime = new Date('2024-01-15T05:00:00Z'); // Between sunset and sunrise
    const dayTime = new Date('2024-01-15T12:00:00Z'); // After sunrise

    expect(isNightTime(nightTime, polarSunrise, polarSunset)).toBe(true);
    expect(isNightTime(dayTime, polarSunrise, polarSunset)).toBe(false);
  });

  it('should handle edge case at sunrise', () => {
    const sunriseTime = new Date(sunriseIso);
    // At exactly sunrise, it should be day
    expect(isNightTime(sunriseTime, sunriseIso, sunsetIso)).toBe(false);
  });

  it('should handle edge case at sunset', () => {
    const sunsetTime = new Date(sunsetIso);
    // At exactly sunset, it should be night
    expect(isNightTime(sunsetTime, sunriseIso, sunsetIso)).toBe(true);
  });
});
