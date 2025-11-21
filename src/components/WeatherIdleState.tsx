/**
 * Idle state component (initial state before any search)
 */

import { Box, Text, useColorMode } from '@chakra-ui/react';
import { getTextColor } from '../utils/styles';

export function WeatherIdleState() {
  const { colorMode } = useColorMode();

  return (
    <Box textAlign="center" py={6}>
      <Text fontSize="sm" color={getTextColor(colorMode, 'tertiary')}>
        Lance une recherche pour afficher les conditions météo détaillées.
      </Text>
    </Box>
  );
}

