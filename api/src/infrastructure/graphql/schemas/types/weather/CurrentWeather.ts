import { Field, ObjectType, Float } from 'type-graphql';

@ObjectType()
export class CurrentWeather {
    @Field(() => String!)
    date: string;

    @Field(() => Float!)
    temperature: number;

    @Field(() => Float!)
    precipitation: number;

    @Field(() => Float!)
    snowDepth: number;

    @Field(() => Float!)
    windSpeed: number;

    @Field(() => Float!)
    cloudCover: number;

    @Field(() => Float!)
    visibility: number;

    @Field(() => Float!)
    waveHeight: number;
}
