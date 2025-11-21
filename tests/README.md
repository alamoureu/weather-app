# Test Suite

This directory contains comprehensive unit tests for the weather application.

## Test Structure

```
tests/
├── setup.ts                          # Test environment setup
├── utils/
│   ├── weatherHelpers.test.ts        # Weather helper functions
│   ├── weatherHelpers.integration.test.ts  # Integration tests
│   ├── datetime.test.ts              # Date/time utilities
│   ├── api.test.ts                   # API functions
│   └── windDirection.test.ts         # Wind direction conversion
├── components/
│   └── WeatherStats.test.tsx         # Component tests
└── API_VERIFICATION.md               # API units verification document
```

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with UI
yarn test:ui

# Run tests with coverage
yarn test:coverage
```

## Test Coverage

### Utility Functions

- ✅ Weather code mapping (all WMO codes)
- ✅ Emoji extraction and day/night logic
- ✅ Wind direction conversion (all 8 directions)
- ✅ Visibility formatting (meters/km)
- ✅ API response mapping
- ✅ Date/time utilities

### API Functions

- ✅ Geocoding with error handling
- ✅ Weather data fetching
- ✅ Error handling and edge cases

### Components

- ✅ WeatherStats component rendering
- ✅ Unit display verification
- ✅ Missing data handling

## API Units Verification

All units have been verified against Open-Meteo API documentation:

- **Temperature**: °C ✅
- **Humidity**: % ✅
- **Wind Speed**: m/s ✅
- **Wind Direction**: degrees → cardinal ✅
- **Pressure**: hPa ✅
- **Visibility**: meters ✅

See `API_VERIFICATION.md` for detailed verification.
