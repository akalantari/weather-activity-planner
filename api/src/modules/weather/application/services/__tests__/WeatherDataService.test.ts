import 'reflect-metadata';
import { WeatherDataService } from '../WeatherDataService';
import { OpenMeteoAPIService } from '@/infrastructure/services/OpenMeteo/OpenMeteoAPIService';

// Mock the OpenMeteoAPIService
jest.mock('@/infrastructure/services/OpenMeteo/OpenMeteoAPIService');

describe('WeatherDataService', () => {
  let weatherDataService: WeatherDataService;
  let openMeteoAPIService: jest.Mocked<OpenMeteoAPIService>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create mock for OpenMeteoAPIService
    openMeteoAPIService = new OpenMeteoAPIService() as jest.Mocked<OpenMeteoAPIService>;
    
    // Create the service under test with the mock dependency
    weatherDataService = new WeatherDataService(openMeteoAPIService);
  });

  describe('getWeatherData', () => {
    it('should return weather data for a valid location', async () => {
      // Arrange
      const mockWeatherForecast = {
        daily: {
          time: [new Date('2023-01-01'), new Date('2023-01-02')],
          temperature2mMin: [5, 6],
          temperature2mMax: [10, 12],
          precipitationSum: [0, 5],
          snowfallSum: [0, 0],
          windSpeed10mMax: [10, 12],
          cloudCoverMean: [50, 70],
          visibilityMean: [10000, 8000]
        }
      };

      // Configure the mock to return the test data
      openMeteoAPIService.getWeatherForecast = jest.fn().mockResolvedValue(mockWeatherForecast);
      openMeteoAPIService.getMarineForecast = jest.fn().mockResolvedValue({
        marine: {
          waveHeightMax: [1.5, 2]
        }
      });

      // Act
      const result = await weatherDataService.getWeatherData(51.5074, -0.1278, 'London', 'GB');

      // Assert
      expect(result).toBeDefined();
      expect(result.city).toEqual({
        name: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        country_code: 'GB'
      });
      
      // Check forecast data
      expect(result.forecast).toBeDefined();
      expect(result.forecast?.length).toBe(2);
      
      if (result.forecast && result.forecast.length > 0) {
        // Check first day's data
        const day1 = result.forecast[0];
        expect(day1.date).toEqual(new Date('2023-01-01'));
        expect(day1.temperature.min).toBe(5);
        expect(day1.temperature.max).toBe(10);
        expect(day1.precipitation).toBe(0);
        expect(day1.snowDepth).toBe(0);
        expect(day1.windSpeed).toBe(10);
        expect(day1.cloudCover).toBe(50);
        expect(day1.visibility).toBe(10000);
      }
      
      // Verify the API service was called with the correct parameters
      expect(openMeteoAPIService.getWeatherForecast).toHaveBeenCalledWith(51.5074, -0.1278);
      expect(openMeteoAPIService.getMarineForecast).toHaveBeenCalledWith(51.5074, -0.1278);
    });

    it('should throw an error when weather data is not available', async () => {
      // Arrange
      openMeteoAPIService.getWeatherForecast = jest.fn().mockResolvedValue({
        daily: undefined
      });

      // Act & Assert
      await expect(weatherDataService.getWeatherData(51.5074, -0.1278, 'London', 'GB'))
        .rejects.toThrow('Failed to retrieve weather data');
    });

    it('should handle missing marine data gracefully', async () => {
      // Arrange
      const mockWeatherForecast = {
        daily: {
          time: [new Date('2023-01-01')],
          temperature2mMin: [5],
          temperature2mMax: [10],
          precipitationSum: [0],
          snowfallSum: [0],
          windSpeed10mMax: [10],
          cloudCoverMean: [50],
          visibilityMean: [10000]
        }
      };

      // Configure the mock to return weather data but throw for marine data
      openMeteoAPIService.getWeatherForecast = jest.fn().mockResolvedValue(mockWeatherForecast);
      openMeteoAPIService.getMarineForecast = jest.fn().mockRejectedValue(new Error('Marine data not available'));

      // Act
      const result = await weatherDataService.getWeatherData(51.5074, -0.1278, 'London', 'GB');

      // Assert
      expect(result).toBeDefined();
      expect(result.forecast).toBeDefined();
      expect(result.forecast?.length).toBe(1);
      if (result.forecast && result.forecast.length > 0) {
        expect(result.forecast[0].waveHeight).toBeUndefined();
      }
    });
  });

  describe('getCurrentWeather', () => {
    it('should return current weather for a valid location', async () => {
      // Arrange
      const mockCurrentWeather = {
        current: {
          time: new Date('2023-01-01T12:00:00Z'),
          temperature2m: 7.5,
          precipitation: 0,
          snowfall: 0,
          windSpeed: 10,
          cloudCover: 50,
          visibility: 10000
        }
      };

      // Configure the mock to return the test data
      openMeteoAPIService.getCurrentWeather = jest.fn().mockResolvedValue(mockCurrentWeather);

      // Act
      const result = await weatherDataService.getCurrentWeather('London', 51.5074, -0.1278, 'GB');

      // Assert
      expect(result).toBeDefined();
      expect(result.city).toEqual({
        name: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        country_code: 'GB'
      });
      
      // Check current weather data
      expect(result.current_weather).toBeDefined();
      expect(result.current_weather?.date).toEqual(mockCurrentWeather.current.time);
      expect(result.current_weather?.temperature.avg).toBe(7.5);
      expect(result.current_weather?.precipitation).toBe(0);
      expect(result.current_weather?.snowDepth).toBe(0);
      expect(result.current_weather?.windSpeed).toBe(10);
      expect(result.current_weather?.cloudCover).toBe(50);
      expect(result.current_weather?.visibility).toBe(10000);
      expect(result.current_weather?.waveHeight).toBeUndefined();
      
      // Verify the API service was called with the correct parameters
      expect(openMeteoAPIService.getCurrentWeather).toHaveBeenCalledWith(51.5074, -0.1278);
    });

    it('should throw an error when current weather data is not available', async () => {
      // Arrange
      openMeteoAPIService.getCurrentWeather = jest.fn().mockResolvedValue({});

      // Act & Assert
      await expect(weatherDataService.getCurrentWeather('London', 51.5074, -0.1278, 'GB'))
        .rejects.toThrow('Weather data not found');
    });
  });

  describe('getWeatherForecast', () => {
    it('should return weather forecast for a valid location', async () => {
      // Arrange
      const mockWeatherData = {
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
            waveHeight: 1.5
          }
        ]
      };

      // Configure the mock
      jest.spyOn(weatherDataService, 'getWeatherData').mockResolvedValue(mockWeatherData);

      // Act
      const result = await weatherDataService.getWeatherForecast('London', 51.5074, -0.1278, 'GB');

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      
      // Check forecast data format
      const forecast = result[0];
      expect(forecast.date).toBe(mockWeatherData.forecast[0].date.toISOString());
      expect(forecast.temperature_min).toBe(5);
      expect(forecast.temperature_max).toBe(10);
      expect(forecast.temperature_avg).toBe(7.5);
      expect(forecast.precipitation).toBe(0);
      expect(forecast.snowDepth).toBe(0);
      expect(forecast.windSpeed).toBe(10);
      expect(forecast.cloudCover).toBe(50);
      expect(forecast.visibility).toBe(10000);
      expect(forecast.waveHeight).toBe(1.5);
      
      // Verify getWeatherData was called with the correct parameters
      expect(weatherDataService.getWeatherData).toHaveBeenCalledWith(
        51.5074, -0.1278, 'London', 'GB'
      );
    });

    it('should throw an error when forecast data is not available', async () => {
      // Arrange
      jest.spyOn(weatherDataService, 'getWeatherData').mockResolvedValue({
        city: {
          name: 'London',
          latitude: 51.5074,
          longitude: -0.1278,
          country_code: 'GB'
        }
      } as any);

      // Act & Assert
      await expect(weatherDataService.getWeatherForecast('London', 51.5074, -0.1278, 'GB'))
        .rejects.toThrow('Weather forecast not found');
    });
  });

  describe('convertToWeatherData', () => {
    it('should correctly convert Open-Meteo data format to our domain model', async () => {
      // Arrange
      const openMeteoDaily = {
        time: [new Date('2023-01-01'), new Date('2023-01-02')],
        temperature2mMin: [5, 6],
        temperature2mMax: [10, 12],
        precipitationSum: [0, 5],
        snowfallSum: [0, 0],
        windSpeed10mMax: [10, 12],
        cloudCoverMean: [50, 70],
        visibilityMean: [10000, 8000]
      };
      
      const marineData = {
        waveHeightMax: [1.5, 2]
      };

      // Access the private method using type assertion
      const convertToWeatherData = (weatherDataService as any).convertToWeatherData.bind(weatherDataService);
      
      // Act
      const result = convertToWeatherData(openMeteoDaily, marineData);
      
      // Assert
      expect(result).toHaveLength(2);
      
      // Check first day
      expect(result[0].date).toEqual(new Date('2023-01-01'));
      expect(result[0].temperature.min).toBe(5);
      expect(result[0].temperature.max).toBe(10);
      expect(result[0].temperature.avg).toBe(7.5);
      expect(result[0].precipitation).toBe(0);
      expect(result[0].snowDepth).toBe(0);
      expect(result[0].windSpeed).toBe(10);
      expect(result[0].cloudCover).toBe(50);
      expect(result[0].visibility).toBe(10000);
      expect(result[0].waveHeight).toBe(1.5);
      
      // Check second day
      expect(result[1].date).toEqual(new Date('2023-01-02'));
      expect(result[1].waveHeight).toBe(2);
    });

    it('should handle missing visibility data', async () => {
      // Arrange
      const openMeteoDaily = {
        time: [new Date('2023-01-01')],
        temperature2mMin: [5],
        temperature2mMax: [10],
        precipitationSum: [0],
        snowfallSum: [0],
        windSpeed10mMax: [10],
        cloudCoverMean: [50],
        // visibilityMean is missing
      };

      // Access the private method using type assertion
      const convertToWeatherData = (weatherDataService as any).convertToWeatherData.bind(weatherDataService);
      
      // Act
      const result = convertToWeatherData(openMeteoDaily);
      
      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].visibility).toBe(10000); // Default value
    });

    it('should throw an error when daily data is undefined', async () => {
      // Access the private method using type assertion
      const convertToWeatherData = (weatherDataService as any).convertToWeatherData.bind(weatherDataService);
      
      // Act & Assert
      expect(() => convertToWeatherData(undefined)).toThrow('Weather data not available');
    });
  });
});