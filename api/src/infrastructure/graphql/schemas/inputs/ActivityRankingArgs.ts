import { ArgsType, Field } from 'type-graphql';
import { Min, Max, Length } from 'class-validator';

@ArgsType()
export class ActivityRankingArgs {
    @Field({ description: 'City name to get activity rankings for' })
    @Length(2, 50, { message: 'City name must be between 2 and 50 characters' })
    city!: string;
}