import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { prisma, redis } from '../../index'
import { previewUrl, sendEmailChangeConfirmationMail } from '@utils/mail.util'
import { compare, hash } from '@utils/password.util'
import { randomUUID } from 'crypto'
import { GqlHttpException, HttpStatus } from '../../errors/errors'
import { Gender, User } from './user.schema'
import { UpdateUserInput } from './input-schema/update-user.schema'
import { ValidateSchemas } from 'validation'
import { CreateUserInput } from './input-schema/create-user.schema'
import { ICustomContext } from 'types/custom-context.interface'
import { UserService } from './user.service'


@Resolver(() => User)
export class UserResolver {
    userService: UserService;

    constructor() {
        this.userService = new UserService()
    }

    @Query(() => [User])
    users(@Arg('email') email: string) {
        return prisma.user.findMany({ where: { email }})
    }

    @Query(() => User, { nullable: true })
    user(@Arg('id') id: string) {
        return prisma.user.findUnique({ where: { id }})
    }

    @Mutation(() => User)
    @Authorized()
    @ValidateSchemas()
    async createUser(
            @Arg('data', () => CreateUserInput) data: CreateUserInput,
            @Ctx() ctx: ICustomContext,
        ) {
        const { userJwtPayload } = ctx;

        const checkUsername = await this.userService.findUserByUsername(data.username)

        if (checkUsername) {
            throw new GqlHttpException('Username already used', HttpStatus.BAD_REQUEST)
        }

        const savedUser = await this.userService.findUserById(userJwtPayload.uid)

        const checkUsersCount = await this.userService.getUserEmailCount(savedUser.email);

        if (checkUsersCount >= 5) {
            throw new GqlHttpException('Too Many accounts', HttpStatus.BAD_REQUEST)
        }


        const hashedPassword = await hash(data.password)


        return await this.userService.createUser({
            ...data,
            email: savedUser.email,
            password: hashedPassword,
        })

        
    }
}
