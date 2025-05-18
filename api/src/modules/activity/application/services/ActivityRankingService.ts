import { Service } from 'typedi';
import { 
    ActivityType, 
    ACTIVITY_CRITERIA, 
    WeatherFactor 
} from '@/modules/activity/domain/ActivityRankingCriteria';
import { WeatherDataService } from '@/modules/weather/application/services/WeatherDataService';
import { WeatherData } from '@/modules/weather/domain/interfaces/WeatherDataProvider';

import ActivityRankingDay from '@/modules/activity/application/interfaces/ActivityRankingDay';
import ActivityRankingResult from '@/modules/activity/application/interfaces/ActivityRankingResult';

@Service()
export class ActivityRankingService {
    constructor(
        private readonly weatherDataService: WeatherDataService
    ) {}

    /**
     * Get activity rankings for a city based on weather forecast
     * @param cityName - Name of the city to rank
     */
    async getActivityRankings(cityName: string): Promise<ActivityRankingResult> {
        try {
            // First, get the city coordinates using existing service
            const locationSearchService = new (await import('@/modules/city/application/services/LocationSearchService')).LocationSearchService();
            const city = await locationSearchService.searchCity(cityName);
            
            if (!city) {
                throw new Error(`City "${cityName}" not found`);
            }

            // Get weather data for the city
            const weatherData = await this.weatherDataService.getWeatherData(
                city.latitude,
                city.longitude,
                city.name,
                city.country_code
            );

            if (!weatherData || !weatherData.forecast) {
                throw new Error('Weather data not found');
            }

            // Calculate activity rankings for each day
            const days: ActivityRankingDay[] = weatherData.forecast.map(day => {
                return {
                    date: day.date.toISOString(),
                    activities: {
                        skiing: this.rankActivity('skiing', day),
                        surfing: this.rankActivity('surfing', day),
                        outdoor_sightseeing: this.rankActivity('outdoor_sightseeing', day),
                        indoor_sightseeing: this.rankActivity('indoor_sightseeing', day)
                    }
                };
            });

            return {
                city: weatherData.city,
                days
            };
        } catch (error) {
            console.error('Error ranking activities:', error);
            throw new Error('Failed to calculate activity rankings');
        }
    }

    /**
     * Rank a specific activity for a given day's weather
     * @param activityType - Type of activity to rank
     * @param weatherData - Weather data for the day
     * @returns Ranking score and recommendation
     */
    private rankActivity(activityType: ActivityType, weatherData: WeatherData): { score: number; recommendation: string } {
        const criteria = ACTIVITY_CRITERIA[activityType];
        let totalScore = 0;
        
        // Calculate score for each factor
        for (const factor of criteria.factors) {
            const factorScore = this.calculateFactorScore(factor, weatherData);
            totalScore += factorScore * factor.weight;
        }
        
        // Normalize the score between min and max
        const normalizedScore = Math.min(
            criteria.maxScore,
            Math.max(criteria.minScore, totalScore)
        );
        
        // Round to nearest integer
        const score = Math.round(normalizedScore);
        
        // Generate recommendation
        const recommendation = this.generateRecommendation(activityType, score);
        
        return {
            score,
            recommendation
        };
    }

    /**
     * Calculate the score for a specific weather factor
     * @param factor - Weather factor and weights
     * @param weatherData - Weather data for the day
     * @returns Score for this factor (0-100)
     */
    private calculateFactorScore(factor: any, weatherData: WeatherData): number {
        let actualValue: number | undefined;
        let score = 100; // Start with perfect score
        
        // Get the actual value from weather data
        switch (factor.factor) {
            case WeatherFactor.TEMPERATURE:
                actualValue = weatherData.temperature.avg;
                break;
            case WeatherFactor.SNOW_DEPTH:
                actualValue = weatherData.snowDepth;
                break;
            case WeatherFactor.WIND_SPEED:
                actualValue = weatherData.windSpeed;
                break;
            case WeatherFactor.PRECIPITATION:
                actualValue = weatherData.precipitation;
                break;
            case WeatherFactor.CLOUD_COVER:
                actualValue = weatherData.cloudCover;
                break;
            case WeatherFactor.VISIBILITY:
                actualValue = weatherData.visibility;
                break;
            case WeatherFactor.WAVE_HEIGHT:
                actualValue = weatherData.waveHeight ?? 0;
                break;
            default:
                return 50; // Default middle score for unknown factors
        }
        
        // Calculate score based on ideal value or range
        if (factor.idealValue !== undefined) {
            // Scoring based on deviation from ideal value
            const deviation = Math.abs(actualValue - factor.idealValue);
            const maxDeviation = factor.idealValue; // Assuming 100% deviation is worst case
            
            // Calculate penalty based on how far from ideal
            let penalty = 0;
            if ((factor.isBadWhenAbove && actualValue > factor.idealValue) ||
                (factor.isBadWhenBelow && actualValue < factor.idealValue)) {
                penalty = Math.min(100, (deviation / maxDeviation) * 100);
            }
            
            score = Math.max(0, 100 - penalty);
        } else if (factor.idealRange !== undefined) {
            const [min, max] = factor.idealRange;
            
            // If within ideal range, perfect score
            if (actualValue >= min && actualValue <= max) {
                score = 100;
            } else {
                // Calculate how far outside the range
                const deviation = actualValue < min ? min - actualValue : actualValue - max;
                const rangeSize = max - min;
                
                // Only penalize if in the bad direction
                if ((factor.isBadWhenAbove && actualValue > max) ||
                    (factor.isBadWhenBelow && actualValue < min) ||
                    (factor.isBadWhenAbove && factor.isBadWhenBelow)) {
                    
                    const penalty = Math.min(100, (deviation / rangeSize) * 100);
                    score = Math.max(0, 100 - penalty);
                }
            }
        }
        
        return score;
    }

    /**
     * Generate a recommendation based on activity and score
     * @param activityType - Type of activity
     * @param score - Calculated score
     * @returns Text recommendation
     */
    private generateRecommendation(activityType: ActivityType, score: number): string {
        if (score >= 80) {
            switch (activityType) {
                case 'skiing':
                    return 'Perfect conditions for skiing! Grab your skis and enjoy the slopes.';
                case 'surfing':
                    return 'Excellent surfing conditions! Head to the beach and catch some waves.';
                case 'outdoor_sightseeing':
                    return 'Ideal day for outdoor sightseeing. Get out and explore!';
                case 'indoor_sightseeing':
                    return 'Great day for indoor activities, but outdoor options are also excellent.';
            }
        } else if (score >= 60) {
            switch (activityType) {
                case 'skiing':
                    return 'Good skiing conditions. Should be an enjoyable day on the slopes.';
                case 'surfing':
                    return 'Good surfing conditions. Worth heading to the beach.';
                case 'outdoor_sightseeing':
                    return 'Nice day for outdoor sightseeing. Bring appropriate clothing.';
                case 'indoor_sightseeing':
                    return 'Good day for indoor activities, but outdoor options are also reasonable.';
            }
        } else if (score >= 40) {
            switch (activityType) {
                case 'skiing':
                    return 'Mediocre skiing conditions. You might want to check other activities.';
                case 'surfing':
                    return 'Average surfing conditions. Could be challenging.';
                case 'outdoor_sightseeing':
                    return 'Acceptable day for outdoor activities. Be prepared for varying conditions.';
                case 'indoor_sightseeing':
                    return 'Consider indoor sightseeing as weather conditions are mixed.';
            }
        } else if (score >= 20) {
            switch (activityType) {
                case 'skiing':
                    return 'Poor skiing conditions. Not recommended today.';
                case 'surfing':
                    return 'Poor surfing conditions. Consider alternative activities.';
                case 'outdoor_sightseeing':
                    return 'Not the best day for outdoor activities. Consider indoor alternatives.';
                case 'indoor_sightseeing':
                    return 'Good day to explore indoor attractions due to poor outdoor conditions.';
            }
        } else {
            switch (activityType) {
                case 'skiing':
                    return 'Terrible skiing conditions. Definitely avoid today.';
                case 'surfing':
                    return 'Dangerous surfing conditions. Avoid water activities.';
                case 'outdoor_sightseeing':
                    return 'Stay indoors. Outdoor activities not recommended at all.';
                case 'indoor_sightseeing':
                    return 'Perfect day for indoor activities. Enjoy museums, galleries, and other indoor attractions.';
            }
        }
        
        return 'Unable to provide a recommendation for this activity.';
    }
}