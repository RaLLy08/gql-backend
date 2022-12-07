import { Field, InputType } from "type-graphql";

@InputType()
export class CreateStudioInput {
    @Field()
    name: string;

    // @AllowChangeBy({
    //     scopes: ['permission:studio:edit:rating'],
    // })
    @Field()
    rating: number;
    
    @Field()
    thumbnail: string;
}