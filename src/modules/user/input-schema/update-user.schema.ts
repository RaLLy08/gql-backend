import { GraphQLUpload } from 'graphql-upload';
import { IUpload } from './../../../types/upload.interface';
import { Gender } from './../user.schema';
import { IsEmail, IsNotEmpty, IsOptional, IsString, isString, Length, ValidateIf } from "class-validator";
import { Field, InputType } from "type-graphql";
import { Match } from 'validation';


@InputType()
export class UpdateUserInput {
    @IsOptional()
    @Field({ nullable: true })
    @Length(1, 64)
    username?: string

    @IsOptional()
    @Field({ nullable: true })
    @Length(1, 320)
    @IsEmail()
    email?: string

    @IsString()
    @ValidateIf((o) => o.newPassword)
    @Field({ nullable: true })
    password?: string
    
    @IsString()
    @ValidateIf((o) => o.password)
    @Field({ nullable: true })
    newPassword: string

    @Field({ nullable: true })
    birthday?: Date;

    @Field({ nullable: true })
    gender?: Gender;

    @Field({ nullable: true })
    customGender?: string

    @Field(() => GraphQLUpload, { nullable: true })
    avatar?: IUpload

    @Field(() => GraphQLUpload, { nullable: true })
    banner?: IUpload
}
