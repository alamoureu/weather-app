/**
 * Fichier: src/components/WeatherCard.tsx
 * Description: Composant pour afficher la carte principale avec les données météo actuelles
 * 
 * Ce composant affiche :
 * - Le nom de la ville et le pays
 * - La description météo avec emoji
 * - La température principale et ressentie
 * - Les températures min/max du jour
 * - Les heures de lever/coucher du soleil
 * 
 * Props:
 * - weather: données météo à afficher
 */

import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import { getWeatherEmojiForDay } from "../utils/weatherHelpers";
import type { WeatherData } from "../types/weather";

interface WeatherCardProps {
  weather?: WeatherData; // Données météo à afficher
  isLoading?: boolean; // État de chargement
}

export function WeatherCard({ weather, isLoading }: WeatherCardProps) {
  if (isLoading || !weather) {
    return (
      <Box
        borderRadius="2xl"
        bgGradient="linear(to-br, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))"
        backdropFilter="blur(20px) saturate(180%)"
        boxShadow="0 8px 32px rgba(0,0,0,0.3)"
        p={4}
        color="white"
        minH="180px"
        h="180px"
      >
        <HStack justify="space-between" align="flex-start">
          <VStack spacing={1} align="flex-start">
            <HStack spacing={2}>
              <Box width="80px" height="24px" bg="whiteAlpha.200" borderRadius="md" />
              <Box width="40px" height="18px" bg="whiteAlpha.200" borderRadius="md" />
            </HStack>
            <Box width="120px" height="16px" bg="whiteAlpha.200" borderRadius="md" />
          </VStack>
          <Box width="48px" height="48px" bg="whiteAlpha.200" borderRadius="md" />
        </HStack>
        <HStack mt={3} align="flex-end" justify="space-between">
          <VStack align="flex-start" spacing={0}>
            <Box width="60px" height="48px" bg="whiteAlpha.200" borderRadius="md" />
            <Box width="90px" height="16px" bg="whiteAlpha.200" borderRadius="md" mt={1} />
          </VStack>
          <VStack align="flex-end" spacing={0}>
            <Box width="140px" height="16px" bg="whiteAlpha.200" borderRadius="md" />
            <Box width="120px" height="16px" bg="whiteAlpha.200" borderRadius="md" mt={1} />
          </VStack>
        </HStack>
      </Box>
    );
  }

  return (
    // Carte principale avec dégradé bleu/violet et effet glassmorphism
    <Box
      borderRadius="2xl"                                    // Coins très arrondis
      bgGradient="linear(to-br, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))" // Dégradé bleu vers violet
      backdropFilter="blur(20px) saturate(180%)"           // Effet glassmorphism avec saturation
      boxShadow="0 8px 32px rgba(0,0,0,0.3)"               // Ombre portée
      p={4}                                                 // Padding interne
      color="white"                                         // Texte blanc
      minH="180px"
      h="180px"
    >
      {/* Ligne supérieure : ville, pays, description, emoji */}
      <HStack justify="space-between" align="flex-start">
        {/* Colonne gauche : informations texte */}
        <VStack spacing={1} align="flex-start">
          {/* Ligne avec nom de ville et badge pays */}
          <HStack spacing={2}>
            {/* Nom de la ville */}
            <Text fontSize="lg" fontWeight="bold">
              {weather.city}
            </Text>
            
            {/* Badge avec code pays (si disponible) */}
            {weather.country && (
              <Text
                fontSize="0.7rem"                           // Très petite police
                fontWeight="600"                            // Poids moyen-gras
                letterSpacing="0.5px"                       // Espacement des lettres
                textTransform="uppercase"                   // Majuscules
                color="whiteAlpha.800"                      // Blanc semi-transparent
                bg="whiteAlpha.100"                         // Fond blanc très transparent
                px={2.5}                                    // Padding horizontal
                py={1}                                      // Padding vertical
                borderRadius="md"                           // Coins arrondis moyens
              >
                {weather.country}
              </Text>
            )}
          </HStack>
          
          {/* Description météo (première lettre en majuscule) */}
          <Text fontSize="xs" opacity={0.9}>
            {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
          </Text>
        </VStack>
        
        {/* Colonne droite : emoji météo (toujours version jour pour représenter la journée) */}
        <Box fontSize="4xl" lineHeight={1}>
          {getWeatherEmojiForDay(weather.weatherCode)}
        </Box>
      </HStack>

      {/* Ligne inférieure : température principale et infos secondaires */}
      <HStack mt={3} align="flex-end" justify="space-between">
        {/* Colonne gauche : température principale */}
        <VStack align="flex-start" spacing={0}>
          {/* Température principale (grande) */}
          <Text fontSize="4xl" fontWeight="black" lineHeight={1}>
            {Math.round(weather.temperature)}°
          </Text>
          {/* Température ressentie */}
          <Text fontSize="xs" opacity={0.9}>
            Ressenti {Math.round(weather.feelsLike)}°
          </Text>
        </VStack>
        
        {/* Colonne droite : min/max et lever/coucher soleil */}
        <VStack align="flex-end" spacing={0}>
          {/* Températures min/max (si disponibles) */}
          {weather.tempMin != null && weather.tempMax != null && (
            <Text fontSize="xs">
              Min. {Math.round(weather.tempMin)}° • Max. {Math.round(weather.tempMax)}°
            </Text>
          )}
          {/* Lever et coucher du soleil (si disponibles) */}
          {weather.sunrise && weather.sunset && (
            <Text fontSize="xs" opacity={0.9}>
              ☀️ {weather.sunrise} • 🌙 {weather.sunset}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
}

