/**
 * Fichier: src/components/ThemeToggle.tsx
 * Description: Composant bouton pour basculer entre le mode clair et sombre
 * 
 * Ce composant affiche un bouton avec une icône (soleil ou lune)
 * qui permet de changer le thème de l'application.
 * 
 * Props: Aucune (utilise useColorMode de Chakra UI)
 */

import { Box, IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export function ThemeToggle() {
  // Hook Chakra UI pour gérer le mode couleur
  // colorMode : "dark" ou "light"
  // toggleColorMode : fonction pour basculer entre les deux modes
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    // Container positionné en absolu en haut à droite
    <Box position="absolute" top={4} right={4} zIndex={10}>
      {/* Bouton avec icône qui change selon le mode */}
      <IconButton
        aria-label="Basculer le mode couleur" // Accessibilité
        size="sm"                              // Taille petite
        variant="ghost"                        // Style ghost (transparent)
        onClick={toggleColorMode}              // Action au clic
        icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />} // Icône : soleil en mode sombre, lune en mode clair
        borderRadius="full"                    // Forme ronde
        bg={colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} // Fond semi-transparent
        backdropFilter="blur(10px)"           // Effet de flou glassmorphism
        _hover={{                             // Styles au survol
          bg: colorMode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)", // Fond plus opaque
          transform: "scale(1.05)",            // Légère augmentation de taille
          backdropFilter: "blur(12px)",       // Flou plus prononcé
        }}
        transition="all 0.2s"                 // Animation douce
      />
    </Box>
  );
}

