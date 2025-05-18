export interface WeatherForecastResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current?: {
        time: Date;
        temperature2m: number;
        apparentTemperature: number;
        isDay: boolean;
        surfacePressure: number;
        precipitation: number;
        snowfall: number;
        cloudCover: number;
        pressureMsl: number;
        weatherCode: number;
        relativeHumidity: number;
        dewPoint: number;
        rain: number;
        showers: number;
        windSpeed: number;
        windDirection: number;
        windGusts: number;
        visibility: number;
    };
    marine?: {
        time: Date[];
        waveHeightMax: number[];
        waveDirectionDominant: number[];
        wavePeriodMax: number[];
        windWaveHeightMax: number[];
        windWavePeriodMax: number[];
        windWavePeakPeriodMax: number[];
        swellWaveHeightMax: number[];
        swellWavePeriodMax: number[];
        swellWaveDirectionDominant: number[];
    };
    daily?: {
        time: Date[];
        temperature2mMax: number[];
        temperature2mMin: number[];
        precipitationSum: number[];
        snowfallSum: number[];
        precipitationHours: number[];
        windSpeed10mMax: number[];
        windGusts10mMax: number[];
        windDirection10mDominant: number[];
        shortwaveRadiationSum: number[];
        cloudCoverMean: number[];
        visibilityMean?: number[];
    };
}

export interface WeatherForecastProvider {
    getWeatherForecast(
        latitude: number,
        longitude: number,
        numberOfDays: number
    ): Promise<WeatherForecastResponse | null>;

    getCurrentWeather(
        latitude: number,
        longitude: number
    ): Promise<WeatherForecastResponse | null>;

}

export default WeatherForecastProvider;