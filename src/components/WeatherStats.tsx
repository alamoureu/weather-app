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

import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, useColorMode } from "@chakra-ui/react";
import { windDirectionToText, formatVisibility } from "../utils/weatherHelpers";
import { getCardStyles, getTextColor, STYLES } from "../utils/styles";
import type { WeatherData } from "../types/weather";

interface WeatherStatsProps {
  weather: WeatherData; // Données météo contenant les stats
}

export function WeatherStats({ weather }: WeatherStatsProps) {
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
  };

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
          {weather.pressure != null ? `${weather.pressure} hPa` : "N/A"}
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

