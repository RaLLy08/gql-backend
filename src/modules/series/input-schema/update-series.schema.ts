import { Field, InputType } from "type-graphql";

@InputType()
class UpdateSeriesStudioInput {
    @Field()
    id: string;
}

@InputType()
export class UpdateSeriesInput {
    @Field({ nullable: true})
    name: string;

    @Field({ nullable: true})
    studio?: UpdateSeriesStudioInput;
}