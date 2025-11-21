/**
 * Fichier: src/components/WeatherStats.tsx
 * Description: Composant pour afficher les statistiques météo détaillées
 * 
 * Ce composant affiche une grille de 4 cartes avec :
 * - Humidité
 * - Vent (vitesse et direction)
 * - Pression atmosphérique
 * - Visibilité
 * 
 * Props:
 * - weather: données météo contenant les statistiques
 */

import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, useColorMode, Box } from "@chakra-ui/react";
import { windDirectionToText, formatVisibility } from "../utils/weatherHelpers";
import { getCardStyles, getTextColor, STYLES } from "../utils/styles";
import type { WeatherData } from "../types/weather";

interface WeatherStatsProps {
  weather?: WeatherData; // Données météo contenant les stats
  isLoading?: boolean; // État de chargement
}

export function WeatherStats({ weather, isLoading }: WeatherStatsProps) {
  // Hook pour obtenir le mode couleur actuel
  const { colorMode } = useColorMode();

  const cardStyles = getCardStyles(colorMode);

  const statProps = {
    borderRadius: STYLES.borderRadius.sm,
    bg: cardStyles.bg,
    backdropFilter: STYLES.glassmorphism.blur,
    p: STYLES.spacing.card,
    borderWidth: "1px",
    borderColor: cardStyles.borderColor,
    minH: "100px",
    h: "100px",
  };

  if (isLoading || !weather) {
    return (
      <SimpleGrid columns={2} spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} {...statProps} minH="100px" h="100px">
            <Box width="60px" height="14px" bg={colorMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} borderRadius="md" mb={2} />
            <Box width="70px" height="24px" bg={colorMode === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)'} borderRadius="md" mb={1} />
            <Box width="120px" height="12px" bg={colorMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'} borderRadius="md" />
          </Box>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid columns={2} spacing={2}>
      <Stat {...statProps}>
        <StatLabel fontSize="xs" color={getTextColor(colorMode, 'secondary')}>
          Humidité
        </StatLabel>
        <StatNumber fontSize="lg" color={getTextColor(colorMode, 'primary')}>
          {weather.humidity.toFixed(0)}%
        </StatNumber>
        <StatHelpText fontSize="xs" color={getTextColor(colorMode, 'tertiary')}>
          Niveau d'humidité de l'air
        </StatHelpText>
      </Stat>

      <Stat {...statProps}>
        <StatLabel fontSize="xs" color={getTextColor(colorMode, 'secondary')}>
          Vent
        </StatLabel>
        <StatNumber fontSize="lg" color={getTextColor(colorMode, 'primary')}>
          {weather.windSpeed.toFixed(1)} m/s
        </StatNumber>
        <StatHelpText fontSize="xs" color={getTextColor(colorMode, 'tertiary')}>
          Direction {windDirectionToText(weather.windDirection)}
        </StatHelpText>
      </Stat>

      <Stat {...statProps}>
        <StatLabel fontSize="xs" color={getTextColor(colorMode, 'secondary')}>
          Pression
        </StatLabel>
        <StatNumber fontSize="lg" color={getTextColor(colorMode, 'primary')}>
          {weather.pressure != null ? `${weather.pressure} hPa` : "N/D"}
        </StatNumber>
        <StatHelpText fontSize="xs" color={getTextColor(colorMode, 'tertiary')}>
          Pression atmosphérique
        </StatHelpText>
      </Stat>

      <Stat {...statProps}>
        <StatLabel fontSize="xs" color={getTextColor(colorMode, 'secondary')}>
          Visibilité
        </StatLabel>
        <StatNumber fontSize="lg" color={getTextColor(colorMode, 'primary')}>
          {formatVisibility(weather.visibility)}
        </StatNumber>
        <StatHelpText fontSize="xs" color={getTextColor(colorMode, 'tertiary')}>
          Distance de visibilité
        </StatHelpText>
      </Stat>
    </SimpleGrid>
  );
}

