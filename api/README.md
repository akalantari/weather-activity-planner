# Weather Activity Planner API

A GraphQL API that provides weather forecast data and activity recommendations based on weather conditions for travel planning.

## Tech Stack

- **Node.js** - JavaScript runtime
- **TypeScript** - Type safety and enhanced developer experience
- **Apollo Server** - GraphQL server implementation
- **TypeGraphQL** - GraphQL schema declaration with TypeScript decorators
- **TypeDI** - Dependency injection for TypeScript
- **Express** - Web server framework
- **Open-Meteo API** - Weather data provider
- **Node-Cache** - In-memory caching solution
- **Jest** - Testing framework
- **Axios** - HTTP client for external API requests
- **esbuild** - Fast JavaScript bundler and minifier

## Architecture

This API follows Domain-Driven Design principles with a clean architecture approach:

```
src/
├── config/                # Configuration management
├── domain/               # Domain layer - core business logic
│   └── value-objects/    # Core domain values
├── infrastructure/       # Infrastructure layer - external services
│   ├── graphql/          # GraphQL server setup
│   │   ├── context.ts    # Request context
│   │   ├── schemas/      # GraphQL schema definitions
│   │   └── resolvers/    # GraphQL resolvers
│   └── services/         # External service integrations
│       ├── CacheService/ # Data caching
│       └── OpenMeteo/    # Weather API integration
└── modules/              # Feature modules
    ├── activity/         # Activity ranking feature
    ├── city/             # City location feature
    └── weather/          # Weather data feature
```

Each module follows a consistent structure:
- **domain/** - Contains domain entities, value objects, and domain services
- **application/** - Contains application services and interfaces

## Setup & Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
CACHE_TTL=3600
```

### Installation

```bash
# Install dependencies
npm install

# Development mode with hot-reloading
npm run dev

# Standard build
npm run build

# Optimized production build with esbuild
npm run build:prod

# Run production build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (useful during development)
npm run test-watch
```

## GraphQL API

The GraphQL API is available at:

```
http://localhost:4000/graphql
```

### Main Queries

- `activityRanking(city: String!)`: Get activity rankings for a city based on weather forecast
- `city(city: String!)`: Get city location information

### Types

- `ActivityRanking`: Contains city information, daily activity rankings, and weather forecast
- `ActivityRankingDay`: Daily activity scores and recommendations
- `DailyActivities`: Collection of activities with scores for a single day
- `City`: Location information including coordinates
- `WeatherForecastDay`: Daily weather data with temperature, precipitation, etc.

### Example Query

```graphql
query ActivityRanking($city: String!) {
  activityRanking(city: $city) {
    city {
      name
      country_code
      latitude
      longitude
    }
    days {
      date
      activities {
        skiing {
          score
          recommendation
        }
        surfing {
          score
          recommendation
        }
        outdoor_sightseeing {
          score
          recommendation
        }
        indoor_sightseeing {
          score
          recommendation
        }
      }
    }
    weatherForecast {
      date
      temperature_min
      temperature_max
      temperature_avg
      precipitation
      snowDepth
      windSpeed
      cloudCover
      visibility
      waveHeight
    }
  }
}
```

## Test Environment

Tests run with a separate configuration for the test environment. This ensures that tests don't interfere with development or production environments.

The test coverage report is generated in the `coverage` directory. You can open `coverage/lcov-report/index.html` in a browser to view the detailed coverage report.

## Build Process

The build process uses a two-step approach:

1. **Standard Build**: `npm run build`
   - Uses TypeScript compiler (tsc) to compile TypeScript files
   - Preserves type information and decorator metadata
   - Handles module paths and aliases

2. **Production Build**: `npm run build:prod`
   - First compiles with TypeScript compiler
   - Then optimizes compiled JavaScript with esbuild
   - Minifies code and generates source maps
   - Significantly reduces bundle size and improves performance

The build process is implemented in two files:
- `esbuild.js` - Handles TypeScript compilation and file copying
- `esbuild-optimize.js` - Post-processes compiled JavaScript with esbuild for optimization

This approach provides the best balance between type safety (TypeScript) and production performance (esbuild).