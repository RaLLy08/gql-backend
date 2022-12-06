import { JwtInputPayload } from './../modules/auth/jwt-token.service';
import { Request, Response } from 'express'

export interface ICustomContext {
    request: Request

    response: Response & {
        json?: (data: unknown) => void;
    }

    userJwtPayload?: JwtInputPayload;
}
