import { ArgsType, Field } from 'type-graphql';
import { IsString } from 'class-validator';

// City Query Args types
@ArgsType()
export class CityArgs {
  @Field(() => String!, { description: 'City name' })
  @IsString()
  city: string;
}
