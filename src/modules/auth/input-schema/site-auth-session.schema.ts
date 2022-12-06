import { Field, InputType, ID } from "type-graphql"


@InputType()
class SiteAuthSessionUserInput {
    @Field()
    id: string
}

@InputType()
export class CreateSiteAuthSessionInput {
    @Field()
    agent: string

    @Field()
    ip: string

    @Field(() => ID, {nullable: true})
    userId: string

    @Field()
    active: boolean
}

@InputType()
export class UpdateSiteAuthSessionInput {
    @Field({ nullable: true})
    agent?: string

    @Field({ nullable: true})
    ip?: string

    @Field(() => ID, {nullable: true})
    userId?: string

    @Field({ nullable: true})
    active?: boolean
}