/**
 * Date and time utility functions
 */

export function formatTime(isoString: string, locale: string = 'fr-FR'): string {
  return new Date(isoString).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function isNightTime(
  time: Date,
  sunriseIso?: string,
  sunsetIso?: string
): boolean {
  if (!sunriseIso || !sunsetIso) {
    // Fallback: night between 20:00 and 06:00
    const hour = time.getHours();
    return hour >= 20 || hour < 6;
  }

  const timeMinutes = getMinutesSinceMidnight(time);
  const sunriseMinutes = getMinutesSinceMidnight(new Date(sunriseIso));
  const sunsetMinutes = getMinutesSinceMidnight(new Date(sunsetIso));

  // Handle polar regions where sunset might be before sunrise
  if (sunsetMinutes < sunriseMinutes) {
    return timeMinutes >= sunsetMinutes || timeMinutes < sunriseMinutes;
  }

  return timeMinutes < sunriseMinutes || timeMinutes >= sunsetMinutes;
}

