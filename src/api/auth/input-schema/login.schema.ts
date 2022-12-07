import { Length } from "class-validator"
import { Field, InputType } from "type-graphql"

@InputType()
export class LoginInput {
    @Field()
    @Length(1, 64)
    username: string

    @Field()
    @Length(1, 255)
    password: string
}
