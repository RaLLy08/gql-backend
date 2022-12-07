import { ThirdPartyAuthInput } from "api/auth/input-schema/third-party.schema"
import { CreateUserInput } from "api/user/input-schema/create-user.schema"
import { ThirdPartyAuthType } from "api/user/user.schema"
import { prisma } from "index"


export class UserService {
    async createUserWithThirdParty(
        userInput: CreateUserInput, 
        thirdPartyInput: ThirdPartyAuthInput, 
    ) {
        return await prisma.user.create({
            data: {
               username: userInput.username,
               thirdPartyAuth: {
                    create: thirdPartyInput
               }
            },
            include: {
                thirdPartyAuth: true,
                siteAuthSessions: true
            }
        })
    }

    async findUserByThirdpartyAuth(uid: string, type: ThirdPartyAuthType) {
        return await prisma.user.findFirst({
            where: {
                thirdPartyAuth: {
                    uid,
                    type,
                }
            },
            include: {
                thirdPartyAuth: true,
                siteAuthSessions: true
            }
        })
    }

    async findUserByEmail(email: string) {
        return await prisma.user.findFirst({
            where: {
                email
            },
        })
    }

    async findUserById(id: string) {
        return await prisma.user.findUnique({
            where: {
                id
            },
        })
    }

    async findUserSession(sessionId: string, uid: string) {
        return await prisma.siteAuthSession.findFirst({
            where: {
                id: sessionId,
                userId: uid
            }
        })
    }

    async findUserByEmailOrUsername(email: string, username: string) {
        return await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        })
    }

    async findUserByUsername(username: string) {
        return await prisma.user.findFirst({
            where: {
                username
            }
        })
    }

    async getUserEmailCount(email: string) {
        return await prisma.user.count({
            where: {
                email
            }
        })
    }

    async createUser(user: CreateUserInput) {
        return await prisma.user.create({
            data: user,
        })
    }

}