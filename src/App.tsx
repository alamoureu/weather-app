/**
 * Fichier: src/App.tsx
 * Description: Composant principal de l'application météo
 * 
 * Ce fichier est le point d'entrée de l'application. Il :
 * 1. Gère l'état global (ville, données météo, statut de chargement)
 * 2. Coordonne les appels API (géocodage + prévisions météo)
 * 3. Affiche les différents états (idle, loading, error, success)
 * 4. Assemble tous les composants enfants
 * 
 * Toutes les données affichées proviennent directement de l'API Open-Meteo.
 * Aucune donnée n'est inventée ou estimée (sauf la description météo générée depuis les codes WMO).
 */

import { Box, Container, VStack, HStack, Text, Divider, useColorMode } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useWeather } from "./hooks/useWeather";
import { ThemeToggle } from "./components/ThemeToggle";
import { CitySearch } from "./components/CitySearch";
import { WeatherCard } from "./components/WeatherCard";
import { HourlyForecast } from "./components/HourlyForecast";
import { WeatherStats } from "./components/WeatherStats";
import { WeatherLoadingState } from "./components/WeatherLoadingState";
import { WeatherErrorState } from "./components/WeatherErrorState";
import { WeatherIdleState } from "./components/WeatherIdleState";

const DEFAULT_CITY = "Montréal";

function App() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const { weather, hourlyForecasts, status, refreshKey, search, refresh } = useWeather(DEFAULT_CITY);
  const { colorMode } = useColorMode();

  useEffect(() => {
    search(DEFAULT_CITY);
  }, [search]);

  return (
    // Container principal centré verticalement et horizontalement
    <Container
      maxW="sm"                        // Largeur maximale : small (mobile-first)
      h="100vh"                        // Hauteur : 100% de la viewport
      minH="fit-content"               // Hauteur minimale : s'adapte au contenu
      display="flex"                   // Flexbox pour centrer
      alignItems="center"              // Centrage vertical
      justifyContent="center"          // Centrage horizontal
      py={6}                           // Padding vertical
      px={4}                           // Padding horizontal
    >
      {/* Carte principale avec effet glassmorphism */}
      <Box
        w="100%"                       // Largeur : 100% du container
        borderRadius="2xl"             // Coins très arrondis
        bg={colorMode === "dark" ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.7)"} // Fond semi-transparent
        boxShadow="2xl"                // Ombre portée très prononcée
        backdropFilter="blur(20px) saturate(180%)" // Effet glassmorphism avec saturation
        px={4}                         // Padding horizontal
        py={5}                         // Padding vertical
        position="relative"           // Position relative pour le bouton thème en absolu
      >
        {/* Bouton de changement de thème (composant séparé) */}
        <ThemeToggle />

        {/* En-tête de l'application */}
        <Box mb={4}>
          <Text fontSize="lg" fontWeight="semibold" letterSpacing="wide">
            Mon Dashboard Météo
          </Text>
          <Text fontSize="xs" color={colorMode === "dark" ? "gray.400" : "gray.600"}>
            Mobile-first • Chakra UI v2
          </Text>
        </Box>

        <CitySearch
          city={city}
          onCityChange={setCity}
          onSearch={() => search(city)}
          onCitySelect={search}
          isLoading={status === "loading"}
        />

        <Divider borderColor={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"} mb={3} />

        {status === "idle" && <WeatherIdleState />}
        {status === "loading" && <WeatherLoadingState />}
        {status === "error" && <WeatherErrorState onRetry={refresh} />}

        {/* État : Success - Données chargées avec succès */}
        {status === "success" && weather && (
          <VStack spacing={3} align="stretch">
            {/* Carte principale météo (composant séparé) */}
            <WeatherCard weather={weather} />

            {/* Prévisions horaires (composant séparé) */}
            <HourlyForecast 
              forecasts={hourlyForecasts} 
              sunriseIso={weather.sunriseIso}
              sunsetIso={weather.sunsetIso}
            />

            {/* Statistiques détaillées (composant séparé) */}
            <WeatherStats weather={weather} />

            <HStack justify="space-between" mt={1}>
              <Text fontSize="2xs" color={colorMode === "dark" ? "gray.500" : "gray.500"}>
                Dernier refresh #{refreshKey}
              </Text>
              <Text
                fontSize="xs"
                color={colorMode === "dark" ? "blue.300" : "blue.600"}
                cursor="pointer"
                onClick={refresh}
                _hover={{ textDecoration: "underline" }}
              >
                Actualiser les données
              </Text>
            </HStack>
          </VStack>
        )}
      </Box>
    </Container>
  );
}

export default App;
