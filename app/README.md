# Weather Activity Planner Frontend

A Next.js application that provides an intuitive interface for viewing weather forecasts and activity recommendations based on weather conditions.

## Tech Stack

- **Next.js 14** - React framework with server-side rendering and file-based routing
- **TypeScript** - Type safety and improved developer experience
- **React** - UI component library
- **Apollo Client** - GraphQL client with built-in caching
- **Chart.js** - Interactive data visualization
- **Tailwind CSS** - Utility-first CSS framework
- **React Testing Library** - Component testing

## Key Features

- City search with geocoding
- 8-day weather forecast visualization
- Activity recommendations with ratings (0-5 stars)
- Interactive temperature and precipitation charts
- Local storage for search history
- Responsive design optimized for all devices
- Interactive weather map using MapTiler API

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── activity/         # Activity pages
│   │   └── [city]/       # Dynamic city page
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── components/           # Reusable UI components
│   ├── ActivityRankingCard.tsx    # Activity card component
│   ├── ActivityRankingChart.tsx   # Chart component
│   ├── CityCard.tsx              # City card component
│   ├── SearchHistory.tsx         # Search history component
│   ├── SuggestedCities.tsx       # City suggestions component
│   └── WeatherMap.tsx            # Interactive weather map component
├── hooks/                # Custom React hooks
│   ├── useActivityQuery.ts       # Activity data fetching
│   ├── useActivityRanking.ts     # Activity ranking logic
│   ├── useCityQuery.ts           # City search logic
│   └── useSearchHistory.ts       # Search history management
├── lib/                  # Utility libraries
│   └── apollo/           # Apollo client setup
└── types/                # TypeScript type definitions
    └── index.ts          # Common type definitions
```

## Setup & Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_MAPTILER_API_KEY=your_maptiler_api_key_here
```

### Installation

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linting
npm run lint
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Component Overview

### `ActivityRankingCard`

Displays a weather card for a specific day with:
- Date and weather conditions
- Temperature range
- Activity ratings (0-5 stars)
- Personalized recommendations

### `ActivityRankingChart`

Visualizes:
- Temperature trends over the forecast period
- Precipitation probability
- Activity score trends

### `WeatherMap`

Interactive map (using MapTiler API) that displays:
- Weather layers (temperature, precipitation, wind, etc.)
- Time slider for weather animation
- City location marker

## Apollo Client Setup

The application uses Apollo Client for GraphQL data fetching with:
- Intelligent caching
- Request deduplication
- Optimized data loading
- TypeScript integration

## Custom Hooks

### `useActivityQuery`

Fetches activity data from the GraphQL API including:
- City information
- Daily activity rankings
- Weather forecast data

## Next Steps

1. Add user authentication and saved preferences
2. Implement detailed activity guides
3. Add multi-language support
4. Enhance weather visualization options
5. Add offline support with service workers