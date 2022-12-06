import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { ICustomContext } from '../../types/custom-context.interface'
import { ThirdPartyRedirectUrlReturnType } from './auth.schema'
import { compare, hash } from '@utils/password.util'
import { randomUUID } from 'crypto'
import { HttpStatus, GqlHttpException } from '../../errors/errors'
import JwtTokenService from './jwt-token.service'
import { FacebookStrategy } from './strategies/facebook.strategy'
import { AuthService } from './auth.service'
import { ThirdPartyAuthType, User } from 'modules/user/user.schema'
import { UserService } from 'modules/user/user.service'
import { ValidateSchemas } from 'validation'
import { RegisterInput } from './input-schema/register.schema'
import { LoginInput } from './input-schema/login.schema'
import { sendEmailRegistrationConfirmationMail } from '@utils/mail.util'


// type ThirdPartyAuthKey = `thirdparty-auth:${ThirdPartyAuthType}:${string}`
// type EmailAuthKey = `email-auth:${string}`

// type RedisKeys =  ThirdPartyAuthKey | EmailAuthKey
@Resolver()
export class AuthResolver {
    private facebookStrategy: FacebookStrategy
    private userService: UserService
    private jwtTokenService: JwtTokenService
    private authService: AuthService
  
    constructor() {
        this.facebookStrategy = new FacebookStrategy()
        this.userService = new UserService()
        this.jwtTokenService = new JwtTokenService()
        this.authService = new AuthService()
    }

    private makeUniqueUsername = (id: string, prefix: ThirdPartyAuthType) => {
        const charSum = prefix.split("").reduce((acc, val) => {
            return acc + val.charCodeAt(0);
         }, 0);
    
        return `${id}User${charSum}`
    }

    @Mutation(() => Boolean)
    @ValidateSchemas()
    async register(@Arg('data') data: RegisterInput) {
        const user = await this.userService.findUserByEmailOrUsername(data.email, data.username)

        if (user) {
            if (user.username === data.username)
                throw new GqlHttpException('USERNAME_TAKEN', HttpStatus.BAD_REQUEST, 'Auth Errors')

            if (user.email === data.email)
                throw new GqlHttpException('EMAIL_TAKEN', HttpStatus.BAD_REQUEST, 'Auth Errors')

            return false
        }

        // const code = await nanoid(30)
        const code = randomUUID()
       
        await this.authService.setRegisterConfirmation(code, data);

        // Sending email
        const info = await sendEmailRegistrationConfirmationMail(data.email, `https://animakuro.domain/confirm/${code}`)

        // console.log(previewUrl(info))

        return true
    }

    @Mutation(() => Boolean)
    async confirmRegistration(@Arg('code') code: string) {
        const registerInput = await this.authService.getRegisterConfirmation(code);

        if (!registerInput)
            throw new GqlHttpException('CODE_NOT_FOUND', HttpStatus.NOT_FOUND, 'Auth Errors');

        await this.authService.deleteRegisterConfirmation(code);

        const { email, password, username } = registerInput;

        const user = await this.userService.findUserByEmailOrUsername(email, username);

        if (user) {
            if (user.username === username)
                throw new GqlHttpException('USERNAME_TAKEN', HttpStatus.BAD_REQUEST, 'Auth Errors')

            if (user.email === email)
                throw new GqlHttpException('EMAIL_TAKEN', HttpStatus.BAD_REQUEST, 'Auth Errors')

            return false
        }

        const hashedPassword = await hash(password)

        await this.userService.createUser({
            email,
            password: hashedPassword,
            username
        })

        return true
    }

    @Mutation(() => Boolean)
    async login(@Arg('data') data: LoginInput, @Ctx() ctx: ICustomContext) {

        const user = await this.userService.findUserByUsername(data.username);

        if (!user || !await compare(data.password, user.password))
            throw new GqlHttpException('INVALID_CREDENTIALS', HttpStatus.BAD_REQUEST, 'Auth Errors')

        const session = await this.authService.createSiteAuthSession({
            agent: ctx.request.headers['user-agent'],
            ip: ctx.request.socket.remoteAddress as string, // TODO: recheck
            active: true,
            userId: user.id
        })

        const accessToken = JwtTokenService.makeAccessToken({
            uid: user.id,
            sessionId: session.id,
        })

        JwtTokenService.setCookieAccessToken(ctx, accessToken)

        return true;
    }

    @Mutation(() => Boolean)
    async logout(
            @Ctx() ctx: ICustomContext
        ) {
        const { userJwtPayload } = ctx;
        // rewrite decorator

        if (!userJwtPayload)
            throw new GqlHttpException('INVALID_SESSION', HttpStatus.BAD_REQUEST, 'Auth Errors')


        const session = this.authService.updateSiteAuthSession(userJwtPayload.sessionId, {
            active: false,
        })

        JwtTokenService.removeCookieAccessToken(ctx);

        if (!session)
            throw new GqlHttpException('INVALID_SESSION', HttpStatus.BAD_REQUEST, 'Auth Errors')

            
        return true
    }


    @Mutation(() => User)
    async loginOrRegisterThirdParty(
        @Arg('code', () => String) code: string, 
        @Arg('authType', () => ThirdPartyAuthType, { nullable: true }) authType: ThirdPartyAuthType, 
        @Ctx() ctx: ICustomContext
    ) {
        const facebookUser = await this.facebookStrategy.getAccountData(code);

        let user = await this.userService.findUserByThirdpartyAuth(facebookUser.id, ThirdPartyAuthType.FACEBOOK);

        if (!user) {
            user = await this.userService.createUserWithThirdParty(
                {
                    username: this.makeUniqueUsername(facebookUser.id, ThirdPartyAuthType.FACEBOOK),
                }, 
                {
                    email: facebookUser.email,
                    firstName: facebookUser.first_name,
                    lastName: facebookUser.last_name,
                    uid: facebookUser.id,
                    type: ThirdPartyAuthType.FACEBOOK
                }
            )
        }

        const session = await this.authService.createSiteAuthSession({
            agent: ctx.request.headers['user-agent'],
            ip: ctx.request.socket.remoteAddress,
            active: true,
            userId: user.id
        })

        const accessToken = JwtTokenService.makeAccessToken({
            uid: user.id,
            sessionId: session.id,
            thirdPartyAuth: {
                type: ThirdPartyAuthType.FACEBOOK,
                uid: facebookUser.id,
            }
        })

        // const thirdpartyAuthRedisKey = JwtTokenService.getThirdPartyAuthRedisKey(ThirdPartyAuthType.FACEBOOK, facebookUser.id)

        // await this.jwtTokenService.saveJwtAccessToken(thirdpartyAuthRedisKey, accessToken)

        JwtTokenService.setCookieAccessToken(ctx, accessToken)

        return user;
    }

    @Query(() => ThirdPartyRedirectUrlReturnType)
    async getThirdPartyRedirectUrls() {

        return {
            facebook: this.facebookStrategy.getRedirectUrl()
        }
    }

}
