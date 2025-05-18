import { Resolver, Query, Args, FieldResolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { ActivityRanking } from '@/infrastructure/graphql/schemas/types/activity/ActivityRanking';
import { ActivityRankingArgs } from '@/infrastructure/graphql/schemas/inputs/ActivityRankingArgs';
import { ActivityRankingService } from '@/modules/activity/application/services/ActivityRankingService';
import { WeatherDataService } from '@/modules/weather/application/services/WeatherDataService';
import { WeatherForecastDay } from '@/infrastructure/graphql/schemas/types/weather/WeatherForecastDay';

@Resolver(() => ActivityRanking)
@Service()
export class ActivityRankingResolver {
    constructor(
        private readonly activityRankingService: ActivityRankingService,
        private readonly weatherDataService: WeatherDataService
    ) {}

    @Query(() => ActivityRanking)
    async activityRanking(@Args() args: ActivityRankingArgs): Promise<ActivityRanking> {
        try {
            const result = await this.activityRankingService.getActivityRankings(args.city);
            return result;
        } catch (error) {
            console.error('Error in ActivityRankingResolver:', error);
            throw new Error('Failed to get activity rankings');
        }
    }

    @FieldResolver(() => [WeatherForecastDay])
    async weatherForecast(@Root() activityRanking: ActivityRanking): Promise<WeatherForecastDay[]> {
        const weatherData = await this.weatherDataService.getWeatherForecast(
            activityRanking.city.name,
            activityRanking.city.latitude,
            activityRanking.city.longitude,
            activityRanking.city.country_code
        );
        return weatherData;
    }

}