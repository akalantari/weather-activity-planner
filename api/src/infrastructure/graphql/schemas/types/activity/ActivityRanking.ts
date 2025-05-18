import { ObjectType, Field, Float } from 'type-graphql';
import { City } from '@/infrastructure/graphql/schemas/types/city/City';
import { WeatherForecastDay } from '@/infrastructure/graphql/schemas/types/weather/WeatherForecastDay';

@ObjectType()
export class ActivityScore {
    @Field(() => Float)
    score!: number;

    @Field()
    recommendation!: string;
}

@ObjectType()
export class DailyActivities {
    @Field(() => ActivityScore)
    skiing!: ActivityScore;

    @Field(() => ActivityScore)
    surfing!: ActivityScore;

    @Field(() => ActivityScore, { name: 'outdoor_sightseeing' })
    outdoor_sightseeing!: ActivityScore;

    @Field(() => ActivityScore, { name: 'indoor_sightseeing' })
    indoor_sightseeing!: ActivityScore;
}

@ObjectType()
export class ActivityRankingDay {
    @Field()
    date!: string;

    @Field(() => DailyActivities)
    activities!: DailyActivities;
}

@ObjectType()
export class ActivityRanking {
    @Field(() => City)
    city!: City;

    @Field(() => [ActivityRankingDay])
    days!: ActivityRankingDay[];

    @Field(() => [WeatherForecastDay])
    weatherForecast?: WeatherForecastDay[];

}