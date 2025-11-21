/**
 * Loading state component with skeleton UI
 */

import { Box, VStack, useColorMode } from '@chakra-ui/react';

export function WeatherLoadingState() {
  const { colorMode } = useColorMode();
  const cardBg = colorMode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255,255,255,0.5)';

  return (
    <VStack spacing={3} align="stretch">
      <Box
        borderRadius="2xl"
        height="180px"
        bgGradient="linear(to-br, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))"
        backdropFilter="blur(20px) saturate(180%)"
        boxShadow="0 8px 32px rgba(0,0,0,0.3)"
      />
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
        {[1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            borderRadius="xl"
            height="100px"
            bg={cardBg}
          />
        ))}
      </Box>
    </VStack>
  );
}

