import axios from 'axios';
import { Service } from 'typedi';
import { fetchWeatherApi } from 'openmeteo';

import { CacheService, cacheServiceInstance } from '@/infrastructure/services/CacheService/CacheService';
import { LocationSearchProvider, LocationSearchResponse } from '@/modules/city/application/interfaces/LocationSearchProvider';
import { OpenMeteoGeocodingResponse } from './types/OpenMeteoGeocodingResponse';
import { OpenMeteoGeocodingSearchParams } from './types/OpenMeteoGeocodingSearchParams';
import { CacheTTL } from '@/infrastructure/services/CacheService/types';
import WeatherForecastProvider, { WeatherForecastResponse } from '@/modules/weather/application/interfaces/WeatherForecastProvider';


const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const MARINE_BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';

@Service()
export class OpenMeteoAPIService implements LocationSearchProvider, WeatherForecastProvider {

    private readonly cacheService: CacheService;

    constructor() {
        this.cacheService = cacheServiceInstance;
    }

    /**
     * Geocodes a location name to coordinates
     * @param name - Location name to geocode
     * @returns Geocoding result or null if not found
     */
    async searchCity(name: string): Promise<LocationSearchResponse | null> {
        const cacheKey = `geocode:${name.toLowerCase()}`;

        // Check cache
        const cachedResult = this.cacheService.get<LocationSearchResponse>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }
        
        try {
            const response = await axios.get<OpenMeteoGeocodingResponse>(GEOCODING_BASE_URL, {
                params: {
                    name,
                    count: 1,
                    format: 'json',
                    language: 'en'
                }
            } as OpenMeteoGeocodingSearchParams);
            
            if (!response.data.results || response.data.results.length === 0) {
                return null;
            }
            
            const result: LocationSearchResponse = {
                name: response.data.results[0].name,
                latitude: response.data.results[0].latitude,
                longitude: response.data.results[0].longitude,
                country_code: response.data.results[0].country_code,
            };
            
            // Cache the result
            this.cacheService.set(cacheKey, result, CacheTTL.OneDay);
            
            return result;
        } catch (error) {
            console.error('Error geocoding location:', error);
            throw new Error('Failed to geocode location');
        }
    }

    /**
     * Get weather forecast for a specific location
     * @param latitude - Location latitude
     * @param longitude - Location longitude
     * @param numberOfDays - Number of days to forecast
     * @returns Weather forecast data
     */
    async getWeatherForecast(
        latitude: number,
        longitude: number,
        numberOfDays?: number
    ): Promise<WeatherForecastResponse | null> {
        const cacheKey = `weather:${latitude},${longitude}`;

        // Check cache
        const cachedResult = this.cacheService.get<WeatherForecastResponse>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const responses = await fetchWeatherApi(WEATHER_BASE_URL, {
                latitude,
                longitude,
                daily: [
                        'temperature_2m_max',
                        'temperature_2m_min',
                        'precipitation_sum',
                        'snowfall_sum',
                        'precipitation_hours',
                        'wind_speed_10m_max',
                        'wind_gusts_10m_max',
                        'wind_direction_10m_dominant',
                        'shortwave_radiation_sum',
                        'cloud_cover_mean',
                        'visibility_mean'
                    ].join(','),
                    timezone: 'auto',
                    forecast_days: numberOfDays || 8
            });

            const response = responses[0];
            const daily = response.daily()!;
            
            const result: WeatherForecastResponse = {
                latitude: response.latitude(),
                longitude: response.longitude(),
                elevation: response.elevation(),
                generationtime_ms: response.generationTimeMilliseconds(),
                utc_offset_seconds: response.utcOffsetSeconds(),
                timezone_abbreviation: response.timezoneAbbreviation()!,
                timezone: response.timezone()!,
                daily: {
                    time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + response.utcOffsetSeconds()) * 1000)
                    ),
                    temperature2mMin: daily.variables(0)!.valuesArray()! as unknown as number[],
                    temperature2mMax: daily.variables(1)!.valuesArray()! as unknown as number[],
                    precipitationSum: daily.variables(2)!.valuesArray()! as unknown as number[],
                    snowfallSum: daily.variables(3)!.valuesArray()! as unknown as number[],
                    precipitationHours: daily.variables(4)!.valuesArray()! as unknown as number[],
                    windSpeed10mMax: daily.variables(5)!.valuesArray()! as unknown as number[],
                    windGusts10mMax: daily.variables(6)!.valuesArray()! as unknown as number[],
                    windDirection10mDominant: daily.variables(7)!.valuesArray()! as unknown as number[],
                    shortwaveRadiationSum: daily.variables(8)!.valuesArray()! as unknown as number[],
                    cloudCoverMean: daily.variables(9)!.valuesArray()! as unknown as number[],
                    visibilityMean: daily.variables(10)!.valuesArray()! as unknown as number[],
                }
            };

            // Cache the result
            this.cacheService.set(cacheKey, result, CacheTTL.OneHour);
            
            return result;
        } catch (error) {
            console.error('Error fetching weather forecast:', error);
            throw new Error('Failed to fetch weather forecast');
        }
    }

    /**
     * Get marine forecast for a specific location (for surfing)
     * @param latitude - Location latitude
     * @param longitude - Location longitude
     * @param numberOfDays - Number of days to forecast
     * @returns Marine forecast data with wave height
     */
    async getMarineForecast(latitude: number, longitude: number, numberOfDays?: number): Promise<WeatherForecastResponse | null> {
        const cacheKey = `marine:${latitude},${longitude}`;

        // Check cache
        const cachedResult = this.cacheService.get<WeatherForecastResponse>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const responses = await fetchWeatherApi(MARINE_BASE_URL, {
                latitude,
                longitude,
                daily: [
                    'wave_height_max',
                    'wave_direction_dominant',
                    'wave_period_max',
                    'wind_wave_height_max',
                    'wind_wave_period_max',
                    'wind_wave_peak_period_max',
                    'swell_wave_height_max',
                    'swell_wave_period_max',
                    'swell_wave_direction_dominant',
                ].join(','),
                timezone: 'auto',
                forecast_days: numberOfDays || 7
            });

            const response = responses[0];
            const daily = response.daily()!;
            
            const result: WeatherForecastResponse = {
                latitude: response.latitude(),
                longitude: response.longitude(),
                elevation: response.elevation(),
                generationtime_ms: response.generationTimeMilliseconds(),
                utc_offset_seconds: response.utcOffsetSeconds(),
                timezone_abbreviation: response.timezoneAbbreviation()!,
                timezone: response.timezone()!,
                marine: {
                    time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + response.utcOffsetSeconds()) * 1000)
                    ),
                    waveHeightMax: daily.variables(0)!.valuesArray()! as unknown as number[],
                    waveDirectionDominant: daily.variables(1)!.valuesArray()! as unknown as number[],
                    wavePeriodMax: daily.variables(2)!.valuesArray()! as unknown as number[],
                    windWaveHeightMax: daily.variables(3)!.valuesArray()! as unknown as number[],
                    windWavePeriodMax: daily.variables(4)!.valuesArray()! as unknown as number[],
                    windWavePeakPeriodMax: daily.variables(5)!.valuesArray()! as unknown as number[],
                    swellWaveHeightMax: daily.variables(6)!.valuesArray()! as unknown as number[],
                    swellWavePeriodMax: daily.variables(7)!.valuesArray()! as unknown as number[],
                    swellWaveDirectionDominant: daily.variables(8)!.valuesArray()! as unknown as number[],
                }
            };

            // Cache the result
            this.cacheService.set(cacheKey, result, CacheTTL.OneHour);
            
            return result;
        } catch (error) {
            console.error('Error fetching marine forecast:', error);
            throw new Error('Failed to fetch marine forecast');
        }
    }

    /**
     * Get current weather for a specific location
     * @param latitude - Location latitude
     * @param longitude - Location longitude
     * @returns Current weather data
     */
    async getCurrentWeather(
        latitude: number,
        longitude: number
    ): Promise<WeatherForecastResponse | null> {
        const cacheKey = `current:${latitude},${longitude}`;

        // Check cache
        const cachedResult = this.cacheService.get<WeatherForecastResponse>(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        try {
            const responses = await fetchWeatherApi(WEATHER_BASE_URL, {
                latitude,
                longitude,
                current: [
                    'temperature_2m',
                    'relative_humidity_2m',
                    'apparent_temperature',
                    'is_day',
                    'precipitation',
                    'rain',
                    'showers',
                    'snowfall',
                    'weather_code',
                    'cloud_cover',
                    'pressure_msl',
                    'surface_pressure',
                    'wind_speed_10m',
                    'wind_direction_10m',
                    'wind_gusts_10m',
                    'dew_point_2m',
                    'visibility'
                ].join(','),
                timezone: 'auto'
            });

            const response = responses[0];
            const current = response.current()!;
            
            const result: WeatherForecastResponse = {
                latitude: response.latitude(),
                longitude: response.longitude(),
                elevation: response.elevation(),
                generationtime_ms: response.generationTimeMilliseconds(),
                utc_offset_seconds: response.utcOffsetSeconds(),
                timezone_abbreviation: response.timezoneAbbreviation()!,
                timezone: response.timezone()!,
                current: {
                    time: new Date((Number(current.time()) + response.utcOffsetSeconds()) * 1000),
                    temperature2m: current.variables(0)!.value()!,
                    relativeHumidity: current.variables(1)!.value()!,
                    apparentTemperature: current.variables(2)!.value()!,
                    isDay: current.variables(3)!.value()! === 1,
                    precipitation: current.variables(4)!.value()!,
                    rain: current.variables(5)!.value()!,
                    showers: current.variables(6)!.value()!,
                    snowfall: current.variables(7)!.value()!,
                    weatherCode: current.variables(8)!.value()!,
                    cloudCover: current.variables(9)!.value()!,
                    pressureMsl: current.variables(10)!.value()!,
                    surfacePressure: current.variables(11)!.value()!,
                    windSpeed: current.variables(12)!.value()!,
                    windDirection: current.variables(13)!.value()!,
                    windGusts: current.variables(14)!.value()!,
                    dewPoint: current.variables(15)!.value()!,
                    visibility: current.variables(16)!.value()!
                }
            };

            // Cache the result - shorter TTL for current weather
            this.cacheService.set(cacheKey, result, CacheTTL.Short);
            
            return result;
        } catch (error) {
            console.error('Error fetching current weather:', error);
            throw new Error('Failed to fetch current weather');
        }
    }
    
}
