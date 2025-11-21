/**
 * Loading state component with skeleton UI
 */

import { Box, VStack, HStack, Text, useColorMode } from '@chakra-ui/react';
import { getCardStyles, getTextColor, STYLES } from '../utils/styles';

export function WeatherLoadingState() {
  const { colorMode } = useColorMode();
  const cardBg = colorMode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255,255,255,0.5)';
  const cardStyles = getCardStyles(colorMode);

  return (
    <VStack spacing={3} align="stretch">
      <Box
        borderRadius="2xl"
        height="180px"
        bgGradient="linear(to-br, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))"
        backdropFilter="blur(20px) saturate(180%)"
        boxShadow="0 8px 32px rgba(0,0,0,0.3)"
      />
      
      {/* Skeleton for hourly forecast */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={2} color={getTextColor(colorMode, 'secondary')}>
          Prévisions horaires
        </Text>
        <Box 
          overflowX="auto"
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
                p={STYLES.spacing.card}
                borderRadius={STYLES.borderRadius.sm}
                bg={cardStyles.bg}
                backdropFilter={STYLES.glassmorphism.blur}
                borderWidth="1px"
                borderColor={cardStyles.borderColor}
              >
                <Box
                  width="30px"
                  height="12px"
                  borderRadius="md"
                  bg={colorMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
                />
                <Box
                  width="32px"
                  height="32px"
                  borderRadius="md"
                  bg={colorMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}
                />
                <Box
                  width="24px"
                  height="16px"
                  borderRadius="md"
                  bg={colorMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
                />
              </VStack>
            ))}
          </HStack>
        </Box>
      </Box>

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

