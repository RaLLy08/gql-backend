import { prisma, redis } from "index";

import { RegisterInput } from "./input-schema/register.schema";
import { CreateSiteAuthSessionInput, UpdateSiteAuthSessionInput } from "./input-schema/site-auth-session.schema";


export class AuthService {
    async setRegisterConfirmation(code: string, data: RegisterInput) {
        await redis.set(`confirmation:register:${code}`, JSON.stringify(data), {
            EX: 300
        }).catch(console.error)
    }

    async getRegisterConfirmation(code: string): Promise<RegisterInput> {
        const data = await redis.get(`confirmation:register:${code}`).catch(console.error)

        if (!data) {
            return null
        }
        
        return JSON.parse(data)
    }

    async deleteRegisterConfirmation(code: string) {
        await redis.del(`confirmation:register:${code}`).catch(console.error)
    }

    async createSiteAuthSession(siteAuthSessionInput: CreateSiteAuthSessionInput) {
        return await prisma.siteAuthSession.create({
            data: siteAuthSessionInput
        })
    }

    async updateSiteAuthSession(id: string, siteAuthSessionInput: UpdateSiteAuthSessionInput) {
        return await prisma.siteAuthSession.update({
            where: {
                id
            },
            data: siteAuthSessionInput
        })
    }
}