/**
 * Fichier: src/components/HourlyForecast.tsx
 * Description: Composant pour afficher les prévisions horaires en scroll horizontal
 * 
 * Ce composant affiche une liste de cartes horizontales scrollables
 * avec les prévisions météo pour les prochaines heures.
 * 
 * Props:
 * - forecasts: tableau des prévisions horaires
 */

import { Box, VStack, HStack, Text, useColorMode } from "@chakra-ui/react";
import { getWeatherEmojiForTime } from "../utils/weatherHelpers";
import { getCardStyles, getTextColor, STYLES } from "../utils/styles";
import type { HourlyForecast as HourlyForecastType } from "../types/weather";

interface HourlyForecastProps {
  forecasts: HourlyForecastType[]; // Liste des prévisions horaires
  sunriseIso?: string; // Heure de lever du soleil en ISO (pour calcul jour/nuit)
  sunsetIso?: string; // Heure de coucher du soleil en ISO (pour calcul jour/nuit)
  isLoading?: boolean; // État de chargement
}

export function HourlyForecast({ forecasts, sunriseIso, sunsetIso, isLoading }: HourlyForecastProps) {
  // Hook pour obtenir le mode couleur actuel
  const { colorMode } = useColorMode();

  const cardStyles = getCardStyles(colorMode);

  if (isLoading) {
    return (
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2} color={getTextColor(colorMode, 'secondary')}>
          Prévisions horaires
        </Text>
        <Box 
          overflowX="auto"
          h="110px"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          <HStack spacing={2} align="stretch" pb={2}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <VStack
                key={i}
                spacing={1.5}
                align="center"
                minW="70px"
                h="100px"
                p={STYLES.spacing.card}
                borderRadius={STYLES.borderRadius.sm}
                bg={cardStyles.bg}
                backdropFilter={STYLES.glassmorphism.blur}
                borderWidth="1px"
                borderColor={cardStyles.borderColor}
              >
                <Box width="40px" height="12px" bg={colorMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} borderRadius="md" />
                <Box width="32px" height="32px" bg={colorMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'} borderRadius="md" />
                <Box width="24px" height="16px" bg={colorMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} borderRadius="md" />
              </VStack>
            ))}
          </HStack>
        </Box>
      </Box>
    );
  }

  // Si pas de prévisions, ne rien afficher
  if (forecasts.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text fontSize="sm" fontWeight="semibold" mb={2} color={getTextColor(colorMode, 'secondary')}>
        Prévisions horaires
      </Text>
      
      <Box 
        overflowX="auto"
        h="110px"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
        }}
      >
        {/* Container horizontal avec les cartes */}
        <HStack spacing={2} align="stretch" pb={2}>
          {/* Mapper chaque prévision en carte */}
          {forecasts.map((forecast, index) => {
            // Parser la date ISO pour extraire l'heure
            const forecastDate = new Date(forecast.time);
            const hour = forecastDate.getHours(); // Heure (0-23)
            const isNow = index === 0;           // La première prévision est "Maintenant"
            
            const cardStyles = getCardStyles(colorMode, isNow);
            
            return (
              <VStack
                key={forecast.time}
                spacing={1.5}
                align="center"
                minW="70px"
                h="100px"
                p={STYLES.spacing.card}
                borderRadius={STYLES.borderRadius.sm}
                bg={cardStyles.bg}
                backdropFilter={STYLES.glassmorphism.blur}
                borderWidth="1px"
                borderColor={cardStyles.borderColor}
                transition="all 0.2s"
              >
                <Text
                  fontSize="2xs"
                  fontWeight={isNow ? "bold" : "medium"}
                  color={isNow ? "white" : getTextColor(colorMode, 'secondary')}
                >
                  {isNow ? "Maintenant" : `${hour}h`}
                </Text>
                
                <Text fontSize="2xl">
                  {getWeatherEmojiForTime(forecast.weatherCode, forecast.time, sunriseIso, sunsetIso)}
                </Text>
                
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={isNow ? "white" : getTextColor(colorMode, 'primary')}
                >
                  {Math.round(forecast.temperature)}°
                </Text>
              </VStack>
            );
          })}
        </HStack>
      </Box>
    </Box>
  );
}

