import { Field, Float, ObjectType } from 'type-graphql';

@ObjectType()
export class WeatherForecastDay {
    @Field(() => String)
    date: string;

    @Field(() => Float)
    temperature_min: number;
    
    @Field(() => Float)
    temperature_max: number;
    
    @Field(() => Float)
    temperature_avg: number;
    
    @Field(() => Float)
    precipitation: number;
    
    @Field(() => Float)
    snowDepth: number;
    
    @Field(() => Float)
    windSpeed: number;

    @Field(() => Float)
    cloudCover: number;
    
    @Field(() => Float)
    visibility: number;
    
    @Field(() => Float, { nullable: true })
    waveHeight?: number;

}
