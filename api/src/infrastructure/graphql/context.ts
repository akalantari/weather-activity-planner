// This will be shared between graphql resolves, and plugins
// It is passed to the ApolloServer constructor, and to the context function
// Will be available in resolvers as "contextValue" (usually third argument)
export interface Context {
  services: {
    // activityRankingService: ActivityRankingService;
    // weatherQueryService: WeatherQueryService;
  };
}

export default Context;
