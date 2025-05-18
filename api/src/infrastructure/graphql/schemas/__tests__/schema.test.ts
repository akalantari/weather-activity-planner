import 'reflect-metadata';
import { buildSchema } from '../index';
import { GraphQLSchema } from 'graphql';

describe('GraphQL Schema', () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await buildSchema();
  });

  it('should build the schema successfully', () => {
    expect(schema).toBeDefined();
    expect(schema instanceof GraphQLSchema).toBe(true);
  });

  it('should have ActivityRanking query', () => {
    const queryType = schema.getQueryType();
    expect(queryType).toBeDefined();
    
    const activityRankingField = queryType?.getFields()['activityRanking'];
    expect(activityRankingField).toBeDefined();
    expect(activityRankingField?.type.toString()).toContain('ActivityRanking');
    
    // Check the arguments
    const cityArg = activityRankingField?.args.find(arg => arg.name === 'city');
    expect(cityArg).toBeDefined();
    expect(cityArg?.type.toString()).toBe('String!');
  });

  it('should have proper ActivityRanking type', () => {
    const activityRankingType = schema.getType('ActivityRanking');
    expect(activityRankingType).toBeDefined();
    
    // Get the fields of the ActivityRanking type
    const activityRankingFields = (activityRankingType as any)?.getFields();
    
    // Check city field
    expect(activityRankingFields.city).toBeDefined();
    expect(activityRankingFields.city.type.toString()).toContain('City');
    
    // Check days field
    expect(activityRankingFields.days).toBeDefined();
    expect(activityRankingFields.days.type.toString()).toContain('ActivityRankingDay');
    
    // Check weatherForecast field
    expect(activityRankingFields.weatherForecast).toBeDefined();
    expect(activityRankingFields.weatherForecast.type.toString()).toContain('WeatherForecastDay');
  });

  it('should have proper ActivityRankingDay type', () => {
    const activityRankingDayType = schema.getType('ActivityRankingDay');
    expect(activityRankingDayType).toBeDefined();
    
    // Get the fields of the ActivityRankingDay type
    const activityRankingDayFields = (activityRankingDayType as any)?.getFields();
    
    // Check date field
    expect(activityRankingDayFields.date).toBeDefined();
    
    // Check activities field
    expect(activityRankingDayFields.activities).toBeDefined();
    expect(activityRankingDayFields.activities.type.toString()).toContain('DailyActivities');
  });

  it('should have proper WeatherForecastDay type', () => {
    const weatherForecastDayType = schema.getType('WeatherForecastDay');
    expect(weatherForecastDayType).toBeDefined();
    
    // Get the fields of the WeatherForecastDay type
    const weatherForecastDayFields = (weatherForecastDayType as any)?.getFields();
    
    // Check essential weather fields
    expect(weatherForecastDayFields.date).toBeDefined();
    expect(weatherForecastDayFields.temperature_min).toBeDefined();
    expect(weatherForecastDayFields.temperature_max).toBeDefined();
    expect(weatherForecastDayFields.precipitation).toBeDefined();
    expect(weatherForecastDayFields.windSpeed).toBeDefined();
    expect(weatherForecastDayFields.cloudCover).toBeDefined();
  });
});