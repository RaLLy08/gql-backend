import { Field, ID, ObjectType } from 'type-graphql'

import { Series } from './../series/series.schema';


@ObjectType()   
export class Studio {
    @Field(() => ID)
    id: string;

    @Field()
    createdAt: Date;

    @Field()
    deleted: boolean;

    @Field()
    name: string;

    // @Authorized(['permission:studio:get:name'])
    @Field()
    rating: number;

    @Field()
    thumbnail: string;

    @Field(() => [Series])
    series?: Series[]
}
