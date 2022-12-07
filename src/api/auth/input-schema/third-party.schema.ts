import { ThirdPartyAuthType } from "modules/user/user.schema"
import { Field, InputType } from "type-graphql"

@InputType()
export class ThirdPartyAuthInput {
    @Field()
    /**
     * Third party account id
     */
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