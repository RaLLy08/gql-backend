import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'

export enum Gender {
    UNSPECIFIED = "UNSPECIFIED",
    MALE = "MALE",
    FEMALE = "FEMALE",
    CUSTOM = "CUSTOM"
}

export enum ThirdPartyAuthType {
    DISCORD="DISCORD",
    GOOGLE='GOOGLE',
    APPLE='APPLE',
    FACEBOOK='FACEBOOK',
}


registerEnumType(Gender, {
    name: 'Gender'
})

registerEnumType(ThirdPartyAuthType, {
    name: 'Gender'
})


@ObjectType()
export class UserThirdParty {
    @Field()
    uid: string

    @Field()
    type: ThirdPartyAuthType

    @Field({ nullable: true })
    firstName?: string

    @Field({ nullable: true })
    lastName?: string

    @Field({ nullable: true })
    email?: string

    @Field({ nullable: true })
    avatar?: string
}


@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    username: string;

    @Field({ nullable: true})
    email?: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field({ nullable: true })
    banner?: string;

    @Field({ nullable: true })
    birthday?: Date;

    @Field({defaultValue: Gender.UNSPECIFIED})
    gender: Gender;

    @Field({ nullable: true })
    customGender?: string

    @Field(() => UserThirdParty, { nullable: true })
    thirdPartyAuth?: UserThirdParty
}
