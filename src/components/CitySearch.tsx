/**
 * Fichier: src/components/CitySearch.tsx
 * Description: Composant de recherche de ville avec input et boutons de villes populaires
 * 
 * Ce composant contient :
 * - Un champ de saisie pour entrer une ville
 * - Un bouton de recherche
 * - Des boutons de sélection rapide pour les villes canadiennes populaires
 * 
 * Props:
 * - city: valeur actuelle du champ de saisie
 * - onCityChange: fonction appelée quand l'utilisateur tape dans l'input
 * - onSearch: fonction appelée quand l'utilisateur clique sur rechercher
 * - isLoading: booléen indiquant si une recherche est en cours
 */

import { Box, VStack, HStack, Text, Input, IconButton, Spinner, useColorMode } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { DEFAULT_CITIES } from "../constants/cities";

interface CitySearchProps {
  city: string;                    // Ville actuellement saisie
  onCityChange: (city: string) => void; // Callback quand la ville change
  onSearch: (city?: string) => void; // Callback pour lancer la recherche (peut recevoir une ville en paramètre)
  onCitySelect: (city: string) => void; // Callback quand une ville populaire est sélectionnée
  isLoading: boolean;              // État de chargement
}

export function CitySearch({ city, onCityChange, onSearch, onCitySelect, isLoading }: CitySearchProps) {
  // Hook pour obtenir le mode couleur actuel
  const { colorMode } = useColorMode();

  return (
    <VStack spacing={2} align="stretch" mb={3}>
      {/* Texte d'instruction */}
      <Text fontSize="xs" color={colorMode === "dark" ? "gray.400" : "gray.600"}>
        Saisis une ville ou choisis une ville populaire
      </Text>
      
      {/* Ligne avec input et bouton de recherche */}
      <HStack spacing={2}>
        {/* Champ de saisie */}
        <Input
          placeholder="Ex: Montréal, Toronto, Vancouver..."
          value={typeof city === 'string' ? city : String(city || "")}  // Valeur contrôlée, s'assurer que c'est une string
          onChange={(e) => onCityChange(e.target.value)}  // Mise à jour à chaque frappe
          onKeyDown={(e) => {                // Détecter la touche Entrée
            if (e.key === 'Enter' && !isLoading) {
              onSearch();                     // Lancer la recherche
            }
          }}
          borderRadius="xl"                               // Coins arrondis
          fontSize="sm"                                   // Taille de police petite
          _focusVisible={{                               // Styles au focus
            boxShadow: "0 0 0 1px",                      // Ombre bleue
            borderColor: "blue.300",                     // Bordure bleue
          }}
        />
        
        {/* Bouton de recherche */}
        <IconButton
          aria-label="Rechercher la météo"  // Accessibilité
          icon={isLoading ? <Spinner size="sm" /> : <SearchIcon />} // Icône : spinner si chargement, loupe sinon
          onClick={() => onSearch()}        // Action au clic - appeler sans paramètre pour utiliser l'état city
          borderRadius="xl"                  // Coins arrondis
          size="md"                          // Taille moyenne
          isDisabled={isLoading}              // Désactivé pendant le chargement
        />
      </HStack>
      
      {/* Section des villes populaires */}
      <Box>
        {/* Label */}
        <Text fontSize="2xs" color={colorMode === "dark" ? "gray.500" : "gray.500"} mb={2}>
          Villes populaires (Canada) :
        </Text>
        
        {/* Container horizontal scrollable pour les boutons */}
        <HStack 
          spacing={1.5}                      // Espacement entre les boutons
          overflowX="auto"                   // Scroll horizontal si nécessaire
          pb={2}                             // Padding bottom
          css={{                            // Styles CSS personnalisés
            '&::-webkit-scrollbar': {       // Masquer la scrollbar WebKit
              display: 'none',
            },
            scrollbarWidth: 'none',         // Masquer la scrollbar Firefox
          }}
        >
          {/* Mapper chaque ville en bouton */}
          {DEFAULT_CITIES.map((defaultCity) => (
            <Box
              key={defaultCity.name}        // Clé unique React
              as="button"                   // Rendre le Box cliquable
              onClick={() => {              // Action au clic
                onCityChange(defaultCity.name); // Mettre à jour le champ
                // Appeler directement onCitySelect avec la ville sélectionnée
                // Pas besoin de setTimeout car onCitySelect reçoit directement la ville
                onCitySelect(defaultCity.name);
              }}
              px={3}                        // Padding horizontal
              py={1.5}                      // Padding vertical
              borderRadius="full"            // Forme ronde
              fontSize="0.7rem"             // Taille de police très petite
              fontWeight="medium"           // Poids de police moyen
              bg={colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} // Fond semi-transparent
              backdropFilter="blur(8px)"    // Effet glassmorphism
              color={colorMode === "dark" ? "gray.300" : "gray.700"} // Couleur du texte
              _hover={{                    // Styles au survol
                bg: colorMode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)", // Fond plus opaque
                transform: "scale(1.05)",   // Légère augmentation de taille
                backdropFilter: "blur(10px)", // Flou plus prononcé
              }}
              transition="all 0.2s"        // Animation douce
              whiteSpace="nowrap"           // Empêcher le retour à la ligne
              disabled={isLoading}           // Désactivé pendant le chargement
              cursor={isLoading ? "not-allowed" : "pointer"} // Curseur selon l'état
              opacity={isLoading ? 0.5 : 1}  // Opacité réduite si chargement
            >
              {defaultCity.name}            {/* Nom de la ville */}
            </Box>
          ))}
        </HStack>
      </Box>
    </VStack>
  );
}

