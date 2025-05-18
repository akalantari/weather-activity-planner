# Weather Activity Planner

## About Me
I'm Ali Kalantari, and this is a mock project demonstrating my software engineering skills and architectural knowledge. This project showcases my approach to building modern applications using clean architecture principles, domain-driven design, and GraphQL.

## Project Purpose
The Weather Activity Planner connects to the Open-Meteo weather API to provide activity rankings for specific cities over the next 8 days. The application offers personalized recommendations for activities like skiing, surfing, outdoor sightseeing, and indoor sightseeing based on weather conditions.

***You can also see this project running live at https://activity-planner.alikalantari.tech***

### Architecture
I've implemented a Domain-Driven Design (DDD) architecture with strict boundaries between layers:

#### Why DDD?
I chose Domain-Driven Design for this project for several important reasons:

1. **Separation of Concerns**: Clear boundaries between domain logic and infrastructure
2. **Maintainability**: Code organization follows business domains
3. **Testability**: Domain logic can be easily tested in isolation
4. **Flexibility**: Infrastructure implementations can be changed without affecting domain logic
5. **Scalability**: Modular design allows different parts to scale independently

#### Trade-offs

1. **Complexity**: More abstractions and indirection compared to simpler approaches
2. **Learning Curve**: Steeper learning curve for developers new to DDD
3. **Development Time**: Initial development can take longer due to additional abstractions
4. **Overhead**: May be excessive for very simple applications

#### Future Enhancements

If I were to continue developing this project, I would focus on:

- Implement AI-based recommendations using machine learning
- Analyze and display historical patterns to improve UX and prediction accuracy
- Generate natural language explanations for activity recommendations
- Personalize recommendations based on user preferences and past behavior
- Implement sentiment analysis for user reviews of activities

## Technology Stack

### Backend (API)
- **TypeScript**: Type-safe implementation
- **Node.js**: JavaScript runtime
- **Apollo Server**: GraphQL server implementation
- **TypeGraphQL**: Code-first GraphQL schema development
- **TypeDI**: Dependency injection for TypeScript
- **Express**: Web application framework
- **Jest**: Testing framework
- **Open-Meteo API**: Weather data provider
- **esbuild**: Fast JavaScript bundler and minifier

### Frontend (App)
- **TypeScript**: Type-safe implementation
- **Next.js 14**: React framework with App Router
- **React**: UI library
- **Apollo Client**: GraphQL client
- **Chart.js**: Data visualization library
- **Tailwind CSS**: Utility-first CSS framework
- **MapTiler API**: Interactive weather maps

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration

## Domain-Driven Design Architecture

I've implemented a Domain-Driven Design (DDD) architecture with strict boundaries between layers:

### Core Architectural Layers

1. **Domain Layer** (Core)
   - Domain entities and value objects
   - Business logic and rules
   - Activity ranking criteria and algorithms

2. **Application Layer**
   - Application services coordinating use cases
   - Interface adapters and data transformations
   - Service composition and orchestration

3. **Infrastructure Layer**
   - External API integrations (Open-Meteo)
   - GraphQL schema and resolvers
   - Caching mechanisms

4. **UI Layer**
   - React components for data presentation
   - State management using custom hooks
   - Interactive data visualization

### Key DDD Patterns Used

- **Bounded Contexts**: Separate models for weather, activities, and locations
- **Aggregates**: Core entities that maintain invariants
- **Value Objects**: Immutable objects like City and WeatherData
- **Domain Services**: Complex operations spanning multiple entities
- **Repositories**: Data access abstraction
- **Application Services**: Orchestration of domain operations

## Why DDD?

I chose Domain-Driven Design for this project for several important reasons:

### Advantages:
1. **Separation of Concerns**: Clear boundaries between domain logic and infrastructure
2. **Maintainability**: Code organization follows business domains
3. **Testability**: Domain logic can be easily tested in isolation
4. **Flexibility**: Infrastructure implementations can be changed without affecting domain logic
5. **Scalability**: Modular design allows different parts to scale independently

### Trade-offs:
1. **Complexity**: More abstractions and indirection compared to simpler approaches
2. **Learning Curve**: Steeper learning curve for developers new to DDD
3. **Development Time**: Initial development can take longer due to additional abstractions
4. **Overhead**: May be excessive for very simple applications

For this particular project, the benefits outweigh the costs because:
- The domain rules for activity ranking are complex and likely to evolve
- Clean separation allows for testing the core logic without external dependencies
- The architecture can easily accommodate new activity types or weather data sources

## Testing Methodology

I've implemented a comprehensive testing strategy with multiple layers:

### Unit Tests
- Tests for core domain logic in isolation
- Mocked dependencies for service and repository tests
- Focus on business rules and edge cases

### Integration Tests
- Tests for GraphQL resolvers
- Integration between services
- Database or external API interactions

### Test Structure
- Arrange-Act-Assert pattern
- Descriptive test names following BDD style
- Separation of test concerns

### Test Coverage
- Critical domain logic with high coverage
- Main application flows covered by integration tests
- Custom hooks and utilities with targeted tests

This approach ensures:
1. Business rules are correctly implemented
2. Components integrate properly
3. Regressions are caught early
4. Documentation of expected behavior through tests

## GraphQL Schema Design

I chose GraphQL for this project for several key reasons:

### Benefits:
1. **Declarative Data Fetching**: Clients request exactly what they need
2. **Type Safety**: Strong type system with SDL (Schema Definition Language)
3. **Single Endpoint**: Simplifies API consumption
4. **Efficient Data Loading**: Reduces over-fetching and under-fetching

### Schema Design Principles:
1. **Domain Alignment**: Schema types mirror domain entities
2. **Hierarchical Structure**: Nested relationships between types
3. **Input/Output Separation**: Clear distinction between query inputs and responses
4. **Field Nullability**: Careful consideration of which fields can be null

### Key Types:
- `City`: Location information
- `ActivityRanking`: Core response type with city, days, and activities
- `ActivityRankingDay`: Daily activity scores and recommendations
- `WeatherForecastDay`: Weather forecast data for a specific day

## Future Enhancements

If I were to continue developing this project, I would focus on:

### AI Integration
- Implement AI-based recommendations using machine learning
- Analyze historical patterns to improve prediction accuracy
- Generate natural language explanations for activity recommendations
- Personalize recommendations based on user preferences and past behavior
- Implement sentiment analysis for user reviews of activities

### Other Enhancements
- User authentication and profiles
- Personalized activity preferences
- Additional activity types
- Mobile applications using React Native
- Expanded weather visualization options
- Integration with activity booking services

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Docker and Docker Compose (optional)

### Environment Variables

Copy the environment variables from the example files:

```bash
# API
# Copy .env.example to .env and fill in the values
cp api/.env.example api/.env

# Frontend
# Copy .env.example to .env and fill in the values
cp app/.env.example app/.env
```

#### Backend Environment Variables
- `PORT`: API server port
- `HOST`: API server host
- `NODE_ENV`: Node.js environment (development, production)
- `CORS_ORIGIN`: Cross-Origin Resource Sharing (CORS) settings
- `CACHE_TTL`: Cache time-to-live in seconds

#### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: API server URL
- `NEXT_PUBLIC_MAPTILER_API_KEY`: MapTiler API key, required for weather maps

### API Setup (Without Docker)
```bash
# Navigate to the API directory
cd api

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production (optimized with esbuild)
npm run build:prod
```

### Frontend Setup (Without Docker)
```bash
# Navigate to the frontend directory
cd app

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Using Docker
```bash
# Install all dependencies and start the entire application stack in one command
# Make sure to have docker and docker compose installed

# Navigate to the root directory of the project
# Make sure to have the environment variables set

# Run the following command

# Install dependencies for the frontend
docker-compose run --rm app npm ci
docker-compose run --rm app npm run build:prod

# Install dependencies for the backend
docker-compose run --rm api npm ci
docker-compose run --rm api npm run build

# Start the application stack
docker-compose up
```

## How AI Assisted in Development

I leveraged AI (Claude) for several aspects of this project, but always within a controlled framework where I maintained architectural integrity and final decision-making:

1. **Component Structure Assistance**: After establishing the core architecture and building the City module as a foundation, I used AI to help with initial scaffolding of components like the WeatherMap and API calls. For example, with the WeatherMap component, AI provided a basic structure, but it used outdated documentation that required significant reworking.

2. **OpenMeteo Integration**: AI helped draft the initial OpenMeteo service integration, but I manually enhanced it to use the official OpenMeteo TypeScript library and restructured the interfaces according to my preferred pattern of keeping interfaces in separate files.

3. **Test Development**: AI assisted in writing some of the test cases, particularly for more routine testing scenarios, allowing me to focus on complex testing logic.

4. **Documentation**: AI helped draft documentation, including README files, which I then reviewed and refined to ensure accuracy and alignment with project goals.

In all cases, AI output was treated as a first draft requiring substantial human review and refinement. The architecture, design decisions, and final implementation were all driven by my vision and expertise.

## Technical Choices & Build Optimization

### Build Process
I implemented a two-step build process for optimal balance between development experience and production performance:

1. **TypeScript Compilation**: First pass uses the TypeScript compiler to preserve type information and decorator metadata essential for frameworks like TypeGraphQL.

2. **esbuild Optimization**: Second pass uses esbuild to minify and optimize JavaScript, with careful handling of GraphQL schema files to prevent type name conflicts.

This approach provides significant benefits:
- Preserves full type safety and reflection during development
- Reduces bundle size and improves runtime performance in production
- Maintains compatibility with decorator-based libraries

### Type-First Development
Throughout the project, I emphasized type safety by:
- Using TypeGraphQL for code-first schema generation
- Maintaining consistent type definitions across layers
- Leveraging TypeScript's advanced features for domain modeling

## Omissions & Trade-offs

### Intentional Omissions
1. **User Authentication**: Though planned for future implementation, I prioritized core domain functionality over auth infrastructure.
   
2. **Comprehensive Error Handling**: The current implementation has basic error handling. A production system would benefit from a more robust error handling framework with detailed logging.

3. **Full Mobile Responsiveness**: Focused on desktop-first experience with basic mobile support rather than comprehensive mobile optimization.

4. **End-to-End Testing**: Implemented unit and integration tests, but omitted E2E tests to prioritize core functionality delivery.

### Engineering Trade-offs

1. **In-Memory Cache vs Redis**: Used Node-Cache for simplicity, though a production system would benefit from Redis for distributed caching.

2. **TypeGraphQL vs SDL-First**: Selected TypeGraphQL for code-first schema development despite its learning curve, as it offers better TypeScript integration.

3. **Domain Complexity**: Implemented a full DDD architecture, accepting the overhead because it demonstrates architectural skills, even though a simpler CRUD approach might have been sufficient for this specific use case.

4. **Build Process**: The two-step build process (TypeScript + esbuild) adds complexity but was necessary to handle GraphQL schema requirements while still optimizing performance.

### Future Improvements

If continuing development, I would address:

1. Add proper handling of city not found case with user-friendly messaging
2. Implement more sophisticated weather data interpretation
3. Add more robust error boundary handling in the React application
4. Improve test coverage, especially for edge cases
5. Add feature flags for gradual rollout of new capabilities

## Conclusion

This project demonstrates my approach to software engineering with a focus on:

1. Clean, maintainable architecture
2. Domain-driven design principles
3. Type safety across the stack
4. Comprehensive testing
5. Modern frontend development

Feel free to explore the codebase and reach out if you have any questions!