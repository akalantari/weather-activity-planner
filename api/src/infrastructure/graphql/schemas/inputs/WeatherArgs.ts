import { ArgsType, Field } from 'type-graphql';
import { IsString } from 'class-validator';

// Weather Query Args types
@ArgsType()
export class WeatherArgs {
  @Field(() => String!, { description: 'City name' })
  @IsString()
  city: string;
}
