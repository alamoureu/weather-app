import { extendTheme } from '@chakra-ui/react';

// ⚙️ Configuration du thème Chakra (mode sombre par défaut)
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      'html, body': {
        minHeight: '100vh',
        background:
          props.colorMode === 'dark'
            ? 'radial-gradient(circle at top, #1a365d 0, #0b1120 40%, #020617 100%)'
            : 'radial-gradient(circle at top, #e0f2fe 0, #bae6fd 40%, #93c5fd 100%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      },
      '#root': {
        minHeight: '100vh',
      },
      body: {
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      },
    }),
  },
  components: {
    // 🎨 Personnalisation des toasts pour correspondre au design de l'app
    Toast: {
      baseStyle: (props: { colorMode: string }) => ({
        container: {
          bg:
            props.colorMode === 'dark'
              ? 'rgba(15,23,42,0.95)'
              : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(18px)',
          borderWidth: '1px',
          borderColor:
            props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.200',
          borderRadius: 'xl',
          boxShadow: '2xl',
          color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
        },
      }),
      variants: {
        success: () => ({
          container: {
            borderLeft: '4px solid',
            borderLeftColor: 'green.400',
          },
        }),
        error: () => ({
          container: {
            borderLeft: '4px solid',
            borderLeftColor: 'red.400',
          },
        }),
        warning: () => ({
          container: {
            borderLeft: '4px solid',
            borderLeftColor: 'yellow.400',
          },
        }),
        info: () => ({
          container: {
            borderLeft: '4px solid',
            borderLeftColor: 'blue.400',
          },
        }),
      },
    },
  },
});

export default theme;
