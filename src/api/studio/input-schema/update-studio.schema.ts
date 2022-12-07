import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateStudioInput {
    @Field({ nullable: true})
    name?: string;

    @Field({ nullable: true})
    rating?: number;
    
    @Field({ nullable: true})
    thumbnail?: string;
}

