import { decode, JwtPayload, sign, verify } from "jsonwebtoken";
import { ICustomContext } from "types/custom-context.interface";
import { ThirdPartyAuthType } from "api/user/user.schema";

// type ThirdPartyAuthRedisKey = `thirdparty-auth:${ThirdPartyAuthType}:${string}`
// type EmailAuthKey = `email-auth:${string}`

// type RedisTokenKeys =  ThirdPartyAuthRedisKey | EmailAuthKey


export interface JwtInputPayload {
    uid: string;
    sessionId: string;
    thirdPartyAuth?: {
        uid: string;
        type: ThirdPartyAuthType;
    };
}

export default class JwtTokenService {
    // static getThirdPartyAuthRedisKey(type: ThirdPartyAuthType, uid: string) {
    //     return `thirdparty-auth:${type}:${uid}` as ThirdPartyAuthRedisKey
    // }

    // static getEmailAuthRedisKey(uid: string) {
    //     return `email-auth:${uid}` as EmailAuthKey
    // }

    constructor() {
        // const checkEnvs = [process.env.JWT_SECRET, process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SEC].some(
        //     (env) => env === undefined
        // )

        // if (checkEnvs) {
        //     throw new Error("JwtTokenService")
        // }
    }

    static ACCESS_TOKEN_COOKIE_NAME = 'animakuro-access-token';

    static verifyAccessToken(token: string) {
        return verify(token, process.env.JWT_SECRET!) as JwtInputPayload & JwtPayload;
    }

    static setCookieAccessToken(ctx: ICustomContext, accessToken: string) {
        ctx.response.cookie(JwtTokenService.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 1000 * +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SEC,
        })
    }

    static removeCookieAccessToken(ctx: ICustomContext) {
        ctx.response.clearCookie(JwtTokenService.ACCESS_TOKEN_COOKIE_NAME);
    }

    static makeAccessToken(payload: JwtInputPayload, ) {
        const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SEC;

        return sign(payload, process.env.JWT_SECRET, {
            expiresIn,
            audience: 'content',
            issuer: 'auth',
        });
    }

    static decodeAccessToken(token: string) {
        const decoded = decode(token) as JwtInputPayload & JwtPayload;

        return decoded;
    }


    // async saveJwtAccessToken(key: RedisTokenKeys, token: string) {
    //     await redis.set(key, token, { EX: +process.env.JWT_ACCESS_TOKEN_EXPIRES_IN_SEC })
    // }

    // async getJwtAccessToken(key: RedisTokenKeys) {
    //     return await redis.get(key);
    // }
}