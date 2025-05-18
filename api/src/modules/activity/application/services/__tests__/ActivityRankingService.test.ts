import 'reflect-metadata';
import { ActivityRankingService } from '../ActivityRankingService';
import { WeatherDataService } from '@/modules/weather/application/services/WeatherDataService';
import { Service } from 'typedi';
import { WeatherDataResponse } from '@/modules/weather/domain/interfaces/WeatherDataProvider';

// Mock the dependencies
jest.mock('@/modules/weather/application/services/WeatherDataService');
jest.mock('@/modules/city/application/services/LocationSearchService', () => ({
  LocationSearchService: jest.fn().mockImplementation(() => ({
    searchCity: jest.fn().mockResolvedValue({
      name: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      country_code: 'GB'
    })
  }))
}));

describe('ActivityRankingService', () => {
  let activityRankingService: ActivityRankingService;
  let weatherDataService: jest.Mocked<WeatherDataService>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create mock for WeatherDataService
    weatherDataService = new WeatherDataService(null as any) as jest.Mocked<WeatherDataService>;
    
    // Create the service under test with the mock dependencies
    activityRankingService = new ActivityRankingService(weatherDataService);
  });

  describe('getActivityRankings', () => {
    it('should return activity rankings for a valid city', async () => {
      // Arrange
      const mockWeatherData: WeatherDataResponse = {
        city: {
          name: 'London',
          latitude: 51.5074,
          longitude: -0.1278,
          country_code: 'GB'
        },
        forecast: [
          {
            date: new Date('2023-01-01'),
            temperature: {
              min: 5,
              max: 10,
              avg: 7.5
            },
            precipitation: 0,
            snowDepth: 0,
            windSpeed: 10,
            cloudCover: 50,
            visibility: 10000,
            waveHeight: undefined
          }
        ]
      };

      // Configure the mock to return the test data
      weatherDataService.getWeatherData = jest.fn().mockResolvedValue(mockWeatherData);

      // Act
      const result = await activityRankingService.getActivityRankings('London');

      // Assert
      expect(result).toBeDefined();
      expect(result.city).toEqual(mockWeatherData.city);
      expect(result.days).toHaveLength(1);
      
      // Check that we have activity scores for each activity type
      const day = result.days[0];
      expect(day.activities.skiing).toBeDefined();
      expect(day.activities.surfing).toBeDefined();
      expect(day.activities.outdoor_sightseeing).toBeDefined();
      expect(day.activities.indoor_sightseeing).toBeDefined();
      
      // Check that each activity has a score and recommendation
      Object.values(day.activities).forEach(activity => {
        expect(activity.score).toBeGreaterThanOrEqual(0);
        expect(activity.score).toBeLessThanOrEqual(100);
        expect(activity.recommendation).toBeTruthy();
      });
      
      // Verify the weather service was called with the correct parameters
      expect(weatherDataService.getWeatherData).toHaveBeenCalledWith(
        51.5074, -0.1278, 'London', 'GB'
      );
    });

    it('should throw an error when city is not found', async () => {
      // Arrange - mock LocationSearchService to return null
      jest.doMock('@/modules/city/application/services/LocationSearchService', () => ({
        LocationSearchService: jest.fn().mockImplementation(() => ({
          searchCity: jest.fn().mockResolvedValue(null)
        }))
      }));

      // Re-import to get the new mock
      const { LocationSearchService } = await import('@/modules/city/application/services/LocationSearchService');
      
      // Act & Assert
      await expect(activityRankingService.getActivityRankings('NonExistentCity'))
        .rejects.toThrow('Failed to calculate activity rankings');
    });

    it('should throw an error when weather data is not available', async () => {
      // Arrange
      weatherDataService.getWeatherData = jest.fn().mockResolvedValue(null as any);

      // Act & Assert
      await expect(activityRankingService.getActivityRankings('London'))
        .rejects.toThrow('Failed to calculate activity rankings');
    });
  });

  describe('rankActivity', () => {
    it('should return high score for skiing in ideal conditions', async () => {
      // Arrange
      const mockWeatherData = {
        date: new Date('2023-01-01'),
        temperature: { min: -5, max: 0, avg: -2.5 },
        precipitation: 0,
        snowDepth: 50,
        windSpeed: 5,
        cloudCover: 0,
        visibility: 10000,
        waveHeight: undefined
      };

      // Access the private method using type assertion
      const rankActivity = (activityRankingService as any).rankActivity.bind(activityRankingService);
      
      // Act
      const result = rankActivity('skiing', mockWeatherData);
      
      // Assert
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.recommendation).toContain('Perfect conditions for skiing');
    });

    it('should return low score for skiing in poor conditions', async () => {
      // Arrange
      const mockWeatherData = {
        date: new Date('2023-01-01'),
        temperature: { min: 20, max: 25, avg: 22.5 },
        precipitation: 10,
        snowDepth: 0,
        windSpeed: 30,
        cloudCover: 100,
        visibility: 1000,
        waveHeight: undefined
      };

      // Access the private method using type assertion
      const rankActivity = (activityRankingService as any).rankActivity.bind(activityRankingService);
      
      // Act
      const result = rankActivity('skiing', mockWeatherData);
      
      // Assert
      expect(result.score).toBeLessThan(40);
      expect(result.recommendation).toContain('skiing conditions');
    });

    it('should return high score for outdoor sightseeing in ideal conditions', async () => {
      // Arrange
      const mockWeatherData = {
        date: new Date('2023-01-01'),
        temperature: { min: 18, max: 25, avg: 21.5 },
        precipitation: 0,
        snowDepth: 0,
        windSpeed: 5,
        cloudCover: 10,
        visibility: 10000,
        waveHeight: undefined
      };

      // Access the private method using type assertion
      const rankActivity = (activityRankingService as any).rankActivity.bind(activityRankingService);
      
      // Act
      const result = rankActivity('outdoor_sightseeing', mockWeatherData);
      
      // Assert
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.recommendation).toContain('Ideal day for outdoor sightseeing');
    });
  });

  describe('calculateFactorScore', () => {
    it('should calculate perfect score when value matches ideal value', async () => {
      // Arrange
      const factor = {
        factor: 'temperature',
        weight: 0.3,
        idealValue: 20,
        isBadWhenAbove: true,
        isBadWhenBelow: true
      };
      
      const weatherData = {
        temperature: { min: 18, max: 22, avg: 20 },
        precipitation: 0,
        snowDepth: 0,
        windSpeed: 5,
        cloudCover: 10,
        visibility: 10000,
        waveHeight: undefined
      };

      // Access the private method using type assertion
      const calculateFactorScore = (activityRankingService as any).calculateFactorScore.bind(activityRankingService);
      
      // Act
      const score = calculateFactorScore(factor, weatherData);
      
      // Assert
      expect(score).toBe(100);
    });

    it('should calculate reduced score when value is outside ideal range', async () => {
      // Arrange
      const factor = {
        factor: 'temperature',
        weight: 0.3,
        idealRange: [15, 25],
        isBadWhenAbove: true,
        isBadWhenBelow: true
      };
      
      const weatherData = {
        temperature: { min: 28, max: 32, avg: 30 },
        precipitation: 0,
        snowDepth: 0,
        windSpeed: 5,
        cloudCover: 10,
        visibility: 10000,
        waveHeight: undefined
      };

      // Access the private method using type assertion
      const calculateFactorScore = (activityRankingService as any).calculateFactorScore.bind(activityRankingService);
      
      // Act
      const score = calculateFactorScore(factor, weatherData);
      
      // Assert
      expect(score).toBeLessThan(100);
    });

    it('should return default score for unknown factor', async () => {
      // Arrange
      const factor = {
        factor: 'unknown_factor',
        weight: 0.3,
        idealValue: 20
      };
      
      const weatherData = {
        temperature: { min: 18, max: 22, avg: 20 },
        precipitation: 0,
        snowDepth: 0,
        windSpeed: 5,
        cloudCover: 10,
        visibility: 10000,
        waveHeight: undefined
      };

      // Access the private method using type assertion
      const calculateFactorScore = (activityRankingService as any).calculateFactorScore.bind(activityRankingService);
      
      // Act
      const score = calculateFactorScore(factor, weatherData);
      
      // Assert
      expect(score).toBe(50);
    });
  });
});