/**
 * Interfaces for the weather data provider
 */
export interface WeatherData {
    date: Date;
    temperature: {
        min: number;
        max: number;
        avg: number;
    };
    precipitation: number;
    snowDepth: number;
    windSpeed: number;
    cloudCover: number;
    visibility: number;
    waveHeight?: number;
}

export interface WeatherDataResponse {
    city: {
        name: string;
        latitude: number;
        longitude: number;
        country_code: string;
    };
    current_weather?: WeatherData;
    forecast?: WeatherData[];
}

export interface WeatherDataProvider {
    /**
     * Get weather data for a specific location
     * @param latitude - Location latitude
     * @param longitude - Location longitude
     * @param cityName - City name for reference
     * @param countryCode - Country code for reference
     * @returns Weather forecast data
     */
    getWeatherData(
        latitude: number, 
        longitude: number, 
        cityName: string, 
        countryCode: string
    ): Promise<WeatherDataResponse>;
}