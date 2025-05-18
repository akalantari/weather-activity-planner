import { Service, Inject } from "typedi";
import { 
    WeatherData, 
    WeatherDataProvider, 
    WeatherDataResponse 
} from "@/modules/weather/domain/interfaces/WeatherDataProvider";
import { OpenMeteoAPIService } from "@/infrastructure/services/OpenMeteo/OpenMeteoAPIService";
import { WeatherForecastResponse } from "../interfaces/WeatherForecastProvider";
import { WeatherForecastDay } from "../../../../infrastructure/graphql/schemas/types/weather/WeatherForecastDay";

@Service()
export class WeatherDataService implements WeatherDataProvider {
    constructor(
        @Inject()
        private readonly weatherService: OpenMeteoAPIService
    ) {}

    /**
     * Get weather data for a specific location
     * @param latitude - Location latitude
     * @param longitude - Location longitude
     * @param cityName - City name for reference
     * @param countryCode - Country code for reference
     * @returns Weather forecast data
     */
    async getWeatherData(
        latitude: number,
        longitude: number,
        cityName: string,
        countryCode: string
    ): Promise<WeatherDataResponse> {
        try {
            // Get weather forecast from Open-Meteo
            const weatherData = await this.weatherService.getWeatherForecast(latitude, longitude);

            // Check if weather data is available, throw error if not
            // It checks both weatherData and daily being present
            if( typeof weatherData?.daily === 'undefined' ) {
                throw new Error('Weather data not available');
            }
            
            // Get marine data for surfing (wave height)
            let marineData: any = null;
            try {
                marineData = await this.weatherService.getMarineForecast(latitude, longitude);
            } catch (error) {
                console.log('Marine data not available, continuing without it');
            }

            // Convert Open-Meteo data to our domain model
            const forecast: WeatherData[] = this.convertToWeatherData(weatherData.daily);

            return {
                city: {
                    name: cityName,
                    latitude,
                    longitude,
                    country_code: countryCode
                },
                forecast
            };
        } catch (error) {
            console.error('Error in WeatherDataService:', error);
            throw new Error('Failed to retrieve weather data');
        }
    }

    async getCurrentWeather(cityName: string, latitude: number, longitude: number, countryCode: string): Promise<WeatherDataResponse> {
        const weatherData = await this.weatherService.getCurrentWeather(latitude, longitude);

        if (!weatherData || typeof weatherData?.current === 'undefined') {
            throw new Error('Weather data not found');
        }

        const result: WeatherDataResponse = {
            city: {
                name: cityName,
                latitude,
                longitude,
                country_code: countryCode
            },
            current_weather: {
                date: weatherData.current.time,
                temperature: {
                    min: weatherData.current.temperature2m,
                    max: weatherData.current.temperature2m,
                    avg: weatherData.current.temperature2m
                },
                precipitation: weatherData.current.precipitation,
                snowDepth: weatherData.current.snowfall,
                windSpeed: weatherData.current.windSpeed,
                cloudCover: weatherData.current.cloudCover,
                visibility: weatherData.current.visibility,
                waveHeight: undefined
            }
        };

        return result;
    }

    async getWeatherForecast(cityName: string, latitude: number, longitude: number, countryCode: string): Promise<WeatherForecastDay[]> {
        const weatherData = await this.getWeatherData(latitude, longitude, cityName, countryCode);

        if (!weatherData || typeof weatherData?.forecast === 'undefined') {
            throw new Error('Weather forecast not found');
        }

        const result: WeatherForecastDay[] = weatherData.forecast.map((day) => {
            return {
                date: day.date.toISOString(),
                temperature_min: day.temperature.min,
                temperature_max: day.temperature.max,
                temperature_avg: day.temperature.avg,
                precipitation: day.precipitation,
                snowDepth: day.snowDepth,
                windSpeed: day.windSpeed,
                cloudCover: day.cloudCover,
                visibility: day.visibility,
                waveHeight: day.waveHeight
            };
        });

        return result;
    }

    private convertToWeatherData(

        daily: WeatherForecastResponse['daily'],
        marineData?: WeatherForecastResponse['marine']
    ): WeatherData[] {
        if( typeof daily === 'undefined' ) {
            throw new Error('Weather data not available');
        }
        
        return daily.time.map((date, index) => {
            const avgTemp = (daily.temperature2mMax[index] + daily.temperature2mMin[index]) / 2;
            
            // Get wave height if available
            let waveHeight: number | undefined = undefined;
            if (marineData && marineData.waveHeightMax) {
                waveHeight = marineData.waveHeightMax[index];
            }

            return {
                date,
                temperature: {
                    min: daily.temperature2mMin[index],
                    max: daily.temperature2mMax[index],
                    avg: avgTemp
                },
                precipitation: daily.precipitationSum[index],
                snowDepth: daily.snowfallSum[index],
                windSpeed: daily.windSpeed10mMax[index],
                cloudCover: daily.cloudCoverMean[index],
                visibility: daily.visibilityMean ? 
                    daily.visibilityMean[index] : 10000, // Default visibility if not available
                waveHeight
            };
        });
    }

}