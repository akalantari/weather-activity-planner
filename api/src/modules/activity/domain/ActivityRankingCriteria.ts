/**
 * ActivityRankingCriteria.ts
 * Defines the criteria used to rank activities based on weather conditions
 */
export interface ActivityWeatherCriteria {
    minScore: number;  // Minimum score for this activity (0-100)
    maxScore: number;  // Maximum score for this activity (0-100)
    factors: WeatherFactorWeight[];  // Weighted factors affecting this activity
}

export interface WeatherFactorWeight {
    factor: WeatherFactor;  // The weather factor to consider
    weight: number;  // The weight of this factor (0-1, all weights for an activity should sum to 1)
    idealValue?: number; // The ideal value for this factor, if applicable
    idealRange?: [number, number]; // The ideal range for this factor, if applicable
    isBadWhenAbove?: boolean; // Whether values above idealValue/idealRange are bad
    isBadWhenBelow?: boolean; // Whether values below idealValue/idealRange are bad
}

export enum WeatherFactor {
    TEMPERATURE = 'temperature',
    SNOW_DEPTH = 'snow_depth',
    WIND_SPEED = 'wind_speed',
    PRECIPITATION = 'precipitation',
    CLOUD_COVER = 'cloud_cover',
    WAVE_HEIGHT = 'wave_height',  // For surfing
    VISIBILITY = 'visibility'     // For sightseeing
}

export type ActivityType = 'skiing' | 'surfing' | 'outdoor_sightseeing' | 'indoor_sightseeing';

/**
 * Activity ranking criteria for each activity type
 */
export const ACTIVITY_CRITERIA: Record<ActivityType, ActivityWeatherCriteria> = {
    // Skiing criteria
    skiing: {
        minScore: 0,
        maxScore: 100,
        factors: [
            { 
                factor: WeatherFactor.TEMPERATURE, 
                weight: 0.3, 
                idealRange: [-10, 5], 
                isBadWhenAbove: true 
            },
            { 
                factor: WeatherFactor.SNOW_DEPTH, 
                weight: 0.4, 
                idealValue: 50, 
                isBadWhenBelow: true 
            },
            { 
                factor: WeatherFactor.PRECIPITATION, 
                weight: 0.1, 
                idealValue: 0, 
                isBadWhenAbove: true 
            },
            { 
                factor: WeatherFactor.VISIBILITY, 
                weight: 0.2, 
                idealValue: 10000, 
                isBadWhenBelow: true 
            }
        ]
    },
    
    // Surfing criteria
    surfing: {
        minScore: 0,
        maxScore: 100,
        factors: [
            { 
                factor: WeatherFactor.TEMPERATURE, 
                weight: 0.2, 
                idealRange: [18, 30], 
                isBadWhenBelow: true 
            },
            { 
                factor: WeatherFactor.WIND_SPEED, 
                weight: 0.3, 
                idealRange: [10, 30], 
                isBadWhenAbove: true 
            },
            { 
                factor: WeatherFactor.WAVE_HEIGHT, 
                weight: 0.4, 
                idealRange: [1, 3], 
                isBadWhenBelow: true 
            },
            { 
                factor: WeatherFactor.PRECIPITATION, 
                weight: 0.1, 
                idealValue: 0, 
                isBadWhenAbove: true 
            }
        ]
    },
    
    // Outdoor sightseeing criteria
    outdoor_sightseeing: {
        minScore: 0,
        maxScore: 100,
        factors: [
            { 
                factor: WeatherFactor.TEMPERATURE, 
                weight: 0.3, 
                idealRange: [15, 28], 
                isBadWhenBelow: true,
                isBadWhenAbove: true
            },
            { 
                factor: WeatherFactor.PRECIPITATION, 
                weight: 0.3, 
                idealValue: 0, 
                isBadWhenAbove: true 
            },
            { 
                factor: WeatherFactor.CLOUD_COVER, 
                weight: 0.2, 
                idealValue: 0, 
                isBadWhenAbove: true 
            },
            { 
                factor: WeatherFactor.VISIBILITY, 
                weight: 0.2, 
                idealValue: 10000, 
                isBadWhenBelow: true 
            }
        ]
    },
    
    // Indoor sightseeing criteria - less affected by weather but still affected
    indoor_sightseeing: {
        minScore: 40, // Even in bad weather, indoor activities are still viable
        maxScore: 100,
        factors: [
            { 
                factor: WeatherFactor.PRECIPITATION, 
                weight: 0.6, 
                idealValue: 100, // High precipitation makes indoor activities more attractive
                isBadWhenBelow: true 
            },
            { 
                factor: WeatherFactor.TEMPERATURE, 
                weight: 0.2, 
                idealRange: [-40, 15], // Lower temperatures favor indoor activities
                isBadWhenAbove: true 
            },
            { 
                factor: WeatherFactor.VISIBILITY, 
                weight: 0.2, 
                idealValue: 0, // Poor visibility favors indoor activities
                isBadWhenAbove: true 
            }
        ]
    }
};