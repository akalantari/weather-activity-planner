import 'reflect-metadata';
import { ActivityRankingResolver } from '../ActivityRankingResolver';
import { ActivityRankingService } from '@/modules/activity/application/services/ActivityRankingService';
import { WeatherDataService } from '@/modules/weather/application/services/WeatherDataService';
import { ActivityRankingArgs } from '@/infrastructure/graphql/schemas/inputs/ActivityRankingArgs';
import { WeatherForecastDay } from '@/infrastructure/graphql/schemas/types/weather/WeatherForecastDay';

// Mock the dependencies
jest.mock('@/modules/activity/application/services/ActivityRankingService');
jest.mock('@/modules/weather/application/services/WeatherDataService');

describe('ActivityRankingResolver', () => {
  let activityRankingResolver: ActivityRankingResolver;
  let activityRankingService: jest.Mocked<ActivityRankingService>;
  let weatherDataService: jest.Mocked<WeatherDataService>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create mocks for the dependencies
    activityRankingService = new ActivityRankingService(null as any) as jest.Mocked<ActivityRankingService>;
    weatherDataService = new WeatherDataService(null as any) as jest.Mocked<WeatherDataService>;
    
    // Create the resolver under test with the mock dependencies
    activityRankingResolver = new ActivityRankingResolver(
      activityRankingService,
      weatherDataService
    );
  });

  describe('activityRanking', () => {
    it('should return activity rankings for a valid city', async () => {
      // Arrange
      const args: ActivityRankingArgs = {
        city: 'London'
      };
      
      const mockRankingResult = {
        city: {
          name: 'London',
          latitude: 51.5074,
          longitude: -0.1278,
          country_code: 'GB'
        },
        days: [
          {
            date: '2023-01-01T00:00:00.000Z',
            activities: {
              skiing: {
                score: 30,
                recommendation: 'Poor skiing conditions. Not recommended today.'
              },
              surfing: {
                score: 45,
                recommendation: 'Average surfing conditions. Could be challenging.'
              },
              outdoor_sightseeing: {
                score: 80,
                recommendation: 'Ideal day for outdoor sightseeing. Get out and explore!'
              },
              indoor_sightseeing: {
                score: 50,
                recommendation: 'Consider indoor sightseeing as weather conditions are mixed.'
              }
            }
          }
        ]
      };

      // Configure the service mock to return the test data
      activityRankingService.getActivityRankings = jest.fn().mockResolvedValue(mockRankingResult);

      // Act
      const result = await activityRankingResolver.activityRanking(args);

      // Assert
      expect(result).toEqual(mockRankingResult);
      expect(activityRankingService.getActivityRankings).toHaveBeenCalledWith('London');
    });

    it('should throw an error when the service fails', async () => {
      // Arrange
      const args: ActivityRankingArgs = {
        city: 'InvalidCity'
      };
      
      // Configure the service mock to throw an error
      activityRankingService.getActivityRankings = jest.fn().mockRejectedValue(
        new Error('Failed to calculate activity rankings')
      );

      // Act & Assert
      await expect(activityRankingResolver.activityRanking(args))
        .rejects.toThrow('Failed to get activity rankings');
      
      // Verify the service was called with the correct parameters
      expect(activityRankingService.getActivityRankings).toHaveBeenCalledWith('InvalidCity');
    });
  });

  describe('weatherForecast', () => {
    it('should return weather forecast for the activity ranking', async () => {
      // Arrange
      const activityRanking = {
        city: {
          name: 'London',
          latitude: 51.5074,
          longitude: -0.1278,
          country_code: 'GB'
        },
        days: []
      };
      
      const mockForecastData: WeatherForecastDay[] = [
        {
          date: '2023-01-01T00:00:00.000Z',
          temperature_min: 5,
          temperature_max: 10,
          temperature_avg: 7.5,
          precipitation: 0,
          snowDepth: 0,
          windSpeed: 10,
          cloudCover: 50,
          visibility: 10000,
          waveHeight: undefined
        }
      ];

      // Configure the service mock to return the test data
      weatherDataService.getWeatherForecast = jest.fn().mockResolvedValue(mockForecastData);

      // Act
      const result = await activityRankingResolver.weatherForecast(activityRanking);

      // Assert
      expect(result).toEqual(mockForecastData);
      expect(weatherDataService.getWeatherForecast).toHaveBeenCalledWith(
        'London', 51.5074, -0.1278, 'GB'
      );
    });

    it('should throw an error when weather service fails', async () => {
      // Arrange
      const activityRanking = {
        city: {
          name: 'London',
          latitude: 51.5074,
          longitude: -0.1278,
          country_code: 'GB'
        },
        days: []
      };
      
      // Configure the service mock to throw an error
      weatherDataService.getWeatherForecast = jest.fn().mockRejectedValue(
        new Error('Weather forecast not found')
      );

      // Act & Assert
      await expect(activityRankingResolver.weatherForecast(activityRanking))
        .rejects.toThrow('Weather forecast not found');
      
      // Verify the service was called with the correct parameters
      expect(weatherDataService.getWeatherForecast).toHaveBeenCalledWith(
        'London', 51.5074, -0.1278, 'GB'
      );
    });
  });
});