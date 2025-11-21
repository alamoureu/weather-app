/**
 * Unit tests for wind direction conversion
 * Verifies all 8 cardinal directions are mapped correctly
 */

import { describe, it, expect } from 'vitest';
import { windDirectionToText } from '../../src/utils/weatherHelpers';

describe('windDirectionToText - Complete Direction Mapping', () => {
  it('should map all 8 cardinal directions correctly', () => {
    // North (0°)
    expect(windDirectionToText(0)).toBe('N');
    expect(windDirectionToText(360)).toBe('N');
    expect(windDirectionToText(22)).toBe('N'); // Rounds to 0

    // Northeast (45°)
    expect(windDirectionToText(45)).toBe('NE');
    expect(windDirectionToText(23)).toBe('NE'); // Rounds to 45
    expect(windDirectionToText(67)).toBe('NE'); // Rounds to 45

    // East (90°)
    expect(windDirectionToText(90)).toBe('E');
    expect(windDirectionToText(68)).toBe('E'); // Rounds to 90
    expect(windDirectionToText(112)).toBe('E'); // Rounds to 90

    // Southeast (135°)
    expect(windDirectionToText(135)).toBe('SE');
    expect(windDirectionToText(113)).toBe('SE');
    expect(windDirectionToText(157)).toBe('SE');

    // South (180°)
    expect(windDirectionToText(180)).toBe('S');
    expect(windDirectionToText(158)).toBe('S');
    expect(windDirectionToText(202)).toBe('S');

    // Southwest (225°)
    expect(windDirectionToText(225)).toBe('SO');
    expect(windDirectionToText(203)).toBe('SO');
    expect(windDirectionToText(247)).toBe('SO');

    // West (270°)
    expect(windDirectionToText(270)).toBe('O');
    expect(windDirectionToText(248)).toBe('O');
    expect(windDirectionToText(292)).toBe('O');

    // Northwest (315°)
    expect(windDirectionToText(315)).toBe('NO');
    expect(windDirectionToText(293)).toBe('NO');
    expect(windDirectionToText(337)).toBe('NO');
  });

  it('should handle edge cases', () => {
    expect(windDirectionToText(359)).toBe('N'); // Near 360
    expect(windDirectionToText(1)).toBe('N'); // Near 0
    expect(windDirectionToText(44)).toBe('NE'); // Near 45
    expect(windDirectionToText(46)).toBe('NE'); // Near 45
  });
});
