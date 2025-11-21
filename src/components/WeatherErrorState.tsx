/**
 * Error state component
 */

import { Text, VStack, useColorMode } from '@chakra-ui/react';
import { getTextColor } from '../utils/styles';

interface WeatherErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function WeatherErrorState({
  message = 'Impossible de charger la météo.',
  onRetry,
}: WeatherErrorStateProps) {
  const { colorMode } = useColorMode();

  return (
    <VStack spacing={2} textAlign="center" py={6}>
      <Text fontSize="sm" color="red.300" fontWeight="medium">
        {message}
      </Text>
      <Text fontSize="xs" color={getTextColor(colorMode, 'tertiary')} mt={1}>
        Vérifie ta connexion ou le nom de la ville, puis réessaie.
      </Text>
      {onRetry && (
        <Text
          fontSize="xs"
          color={colorMode === 'dark' ? 'blue.300' : 'blue.600'}
          cursor="pointer"
          onClick={onRetry}
          _hover={{ textDecoration: 'underline' }}
          mt={2}
        >
          Réessayer
        </Text>
      )}
    </VStack>
  );
}

