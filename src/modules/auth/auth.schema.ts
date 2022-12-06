import { Field, ObjectType, registerEnumType } from 'type-graphql'



// @InputType()
// export class TwoFAInput {
//     @Field()
//     @Length(6, 6)
//     code: string

//     @Field()
//     @Length(1, 255)
//     token: string
// }

@ObjectType()
export class LoginReturnType {
    @Field(() => LoginType)
    type: LoginType

    @Field()
    token: string
}

export enum LoginType {
    AUTH,
    TWO_FA
}

registerEnumType(LoginType, {
    name: 'LoginType'
})


@ObjectType()
export class ThirdPartyRedirectUrlReturnType {
    @Field()
    facebook: string
}

