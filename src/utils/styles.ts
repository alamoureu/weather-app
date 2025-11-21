/**
 * Shared style utilities and constants
 * Centralizes common styling patterns used across components
 */

import type { ColorMode } from '@chakra-ui/react';

export const STYLES = {
  glassmorphism: {
    blur: 'blur(12px) saturate(180%)',
    blurStrong: 'blur(20px) saturate(180%)',
  },
  borderRadius: {
    sm: 'xl',
    md: '2xl',
  },
  spacing: {
    card: 2.5,
    section: 3,
  },
} as const;

export const COLORS = {
  dark: {
    bg: {
      card: 'rgba(30, 41, 59, 0.6)',
      cardStrong: 'rgba(15,23,42,0.7)',
      cardActive: 'rgba(59, 130, 246, 0.5)',
      scrollbarTrack: 'rgba(255, 255, 255, 0.05)',
    },
    border: {
      default: 'rgba(255,255,255,0.15)',
      active: 'rgba(59, 130, 246, 0.6)',
    },
    text: {
      primary: 'white',
      secondary: 'gray.300',
      tertiary: 'gray.400',
      muted: 'gray.500',
    },
  },
  light: {
    bg: {
      card: 'rgba(255,255,255,0.5)',
      cardStrong: 'rgba(255,255,255,0.7)',
      cardActive: 'rgba(59, 130, 246, 0.3)',
      scrollbarTrack: 'rgba(0, 0, 0, 0.05)',
    },
    border: {
      default: 'rgba(0,0,0,0.15)',
      active: 'rgba(59, 130, 246, 0.4)',
    },
    text: {
      primary: 'gray.800',
      secondary: 'gray.700',
      tertiary: 'gray.600',
      muted: 'gray.500',
    },
  },
} as const;

export function getCardStyles(colorMode: ColorMode, isActive = false) {
  const colors = colorMode === 'dark' ? COLORS.dark : COLORS.light;
  return {
    bg: isActive ? colors.bg.cardActive : colors.bg.card,
    borderColor: isActive ? colors.border.active : colors.border.default,
  };
}

export function getTextColor(colorMode: ColorMode, variant: 'primary' | 'secondary' | 'tertiary' | 'muted' = 'primary') {
  const colors = colorMode === 'dark' ? COLORS.dark : COLORS.light;
  return colors.text[variant];
}

export const SCROLLBAR_STYLES = {
  webkit: (colorMode: ColorMode) => ({
    '&::-webkit-scrollbar': {
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: colorMode === 'dark' ? COLORS.dark.bg.scrollbarTrack : COLORS.light.bg.scrollbarTrack,
      borderRadius: '20px',
      backdropFilter: STYLES.glassmorphism.blur,
    },
    '&::-webkit-scrollbar-thumb': {
      background:
        colorMode === 'dark'
          ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6))'
          : 'linear-gradient(90deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4))',
      borderRadius: '20px',
      backdropFilter: STYLES.glassmorphism.blur,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background:
        colorMode === 'dark'
          ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))'
          : 'linear-gradient(90deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6))',
    },
    scrollbarWidth: 'thin' as const,
    scrollbarColor:
      colorMode === 'dark'
        ? 'rgba(59, 130, 246, 0.6) rgba(255, 255, 255, 0.05)'
        : 'rgba(59, 130, 246, 0.4) rgba(0, 0, 0, 0.05)',
  }),
};

