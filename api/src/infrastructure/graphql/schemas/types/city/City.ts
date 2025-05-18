import { Field, ObjectType, Float } from 'type-graphql';
import { CurrentWeather } from '@/infrastructure/graphql/schemas/types/weather/CurrentWeather';

/**
 * City type
 * @description City type
 * 
 * @field name - City name
 * @field latitude - City latitude
 * @field longitude - City longitude
 * @field country_code - City country code
 */
@ObjectType()
export class City {
  @Field(() => String!)
  name: string;

  @Field(() => Float!)
  latitude: number;

  @Field(() => Float!)
  longitude: number;

  @Field(() => String!)
  country_code: string;

  @Field(() => CurrentWeather)
  current_weather?: CurrentWeather;

}
