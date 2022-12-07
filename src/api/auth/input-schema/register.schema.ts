import { IsEmail, IsString, Length } from "class-validator"
import { Field, InputType } from "type-graphql"

@InputType()
export class RegisterInput {
    @Field()
    @Length(1, 64)
    username?: string

    @Field()
    @Length(1, 320)
    @IsString()
    @IsEmail()
    email: string

    @Field()
    @Length(1, 255)
    password: string
}
