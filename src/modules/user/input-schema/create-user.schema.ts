import { Gender } from '../user.schema';
import { IsEmail, IsOptional, IsString, isString, Length, ValidateIf } from "class-validator";
import { Field, InputType } from "type-graphql";


@InputType()
export class CreateUserInput {
    @Field({ nullable: true })
    @IsString()
    @Length(1, 64)
    username: string

    @IsOptional()
    @Field({ nullable: true })
    @Length(1, 320)
    @IsEmail()
    email?: string

    @IsString()
    @Field({ nullable: true })
    password?: string

    // @IsOptional()
    // @Field({ nullable: true })
    // @Length(1, 20)
    // secret2fa?: string

    @IsOptional()
    @Field({ nullable: true })
    birthday?: Date

    @IsOptional()
    @Field({ nullable: true })
    gender?: Gender

    @IsOptional()
    @Field({ nullable: true })
    @Length(1, 64)
    customGender?: string
}
