import { Field, getMetadataStorage, ID, ObjectType } from 'type-graphql'
import { Studio } from '../studio/studio.schema';


@ObjectType()   
export class Series {
    @Field(() => ID)
    id: string;

    @Field()
    createdAt: Date;

    @Field()
    deleted: boolean;

    @Field()
    name: string;

    @Field(() => Studio, { nullable: true })
    studio?: Studio
}
