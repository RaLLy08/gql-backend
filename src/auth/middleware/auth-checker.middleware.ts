import { getMetadataStorage, ResolverData } from "type-graphql";

import { GqlHttpException, HttpStatus } from "errors/errors";
import { redis } from "index";
import { ICustomContext } from "types/custom-context.interface";
import JwtTokenService from "../jwt-token.service";
import { UserService } from "user/user.service";
/* only for testing */

let allReturnTypes;
let operationsData;

const rejectedFields = [
    {
        name: 'Series',
        fieldNames: [ 'id', 'createdAt', 'deleted', 'name', 'studio' ]
    },
    {
        name: 'Studio',
        fieldNames: [
          'name',
        ]
    },
];


setTimeout(() =>{
    operationsData = {
        'mutation': getMetadataStorage().mutations,
        'query': getMetadataStorage().queries,
    }
    allReturnTypes = getMetadataStorage().objectTypes;

    // allReturnTypes.push(r.find(el => el.name === 'Series'))
    

    // console.log(allReturnTypes)
}, 100)

const getReturnTypeObject = (returnTypeName) => allReturnTypes.find(el => el.name === returnTypeName);
const getRejectTypeObject = (returnTypeName) => rejectedFields.find(el => el.name === returnTypeName);

/* only for testing */

export class AuthCheckerMiddleware {
    private jwtTokenService: JwtTokenService
    private userService: UserService;
    
    constructor() {
       this.jwtTokenService = new JwtTokenService()
       this.userService = new UserService()
    }

    static checkSelectionFields = (node, objectType, rejectionObject) => {
        if (node.selectionSet) {
            node.selectionSet.selections.forEach((selection) => {

                if (selection.selectionSet) {
                    const _expandedField = objectType.fields.find(el => el.name === selection.name.value);
                    const _objectTypeName = _expandedField.getType().name;

                    const nextRejectionObject = getRejectTypeObject(_objectTypeName);
                    const nextObjectType = getReturnTypeObject(_objectTypeName);

                    AuthCheckerMiddleware.checkSelectionFields(selection, nextObjectType, nextRejectionObject);
                } else {
                    if (rejectionObject.fieldNames.includes(selection.name.value)) {
                        throw new GqlHttpException(selection.name.value, HttpStatus.UNAUTHORIZED)
                    }
                }
            });
        }
    }

    private checkPermissions = (info) => {
        const returnType = info.returnType.toString().replace(/[\[\]]|!/g, '');
        const returnObjectType = getReturnTypeObject(returnType);
        const rejectionObject = getRejectTypeObject(returnType);


        AuthCheckerMiddleware.checkSelectionFields(info.fieldNodes[0], returnObjectType, rejectionObject)
    }


    private thirdPartyCheck = async (sessionId: string, uid: string) => {
        // const savedAccessToken = await this.jwtTokenService.getJwtAccessToken(
        //     JwtTokenService.getThirdPartyAuthRedisKey(type, uid)
        // );
        const savedSession = await this.userService.findUserSession(sessionId, uid);
    
        if (!savedSession) {
            throw new GqlHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        }

        // const savedAccessTokenPayload = JwtTokenService.decodeAccessToken(savedAccessToken);

        if (sessionId !== savedSession.id) {
            throw new GqlHttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        }

    }
  
    check = async ({ root, args, context, info }: ResolverData<ICustomContext>, permissions: string[]) => {
        const accessToken = context.request.cookies[JwtTokenService.ACCESS_TOKEN_COOKIE_NAME]

        
        if (!accessToken) {
            throw new GqlHttpException('Unauthorized', HttpStatus.UNAUTHORIZED, 'TOKEN_NOT_FOUND')
        }
    
        // handle errors
        const accessTokenPayload = JwtTokenService.verifyAccessToken(accessToken)
    
        if (accessTokenPayload.thirdPartyAuth) {
            const { sessionId, uid } = accessTokenPayload;

            this.thirdPartyCheck(sessionId, uid);

        } 
        
        this.checkPermissions(info);

        context.userJwtPayload = accessTokenPayload;


        return true
        // checks perrmision access for Mutations and Queries fields
    
        /*  EXAMPLE uncomment with exaple decorators in series resolvers and schemas
    
            const userPermissions = [
                'createSeries:name',
                'createSeries',
                'series:name',
            ]
    
            for (const allowed of permissions) {
                for (const current of userPermissions) {
                    if (allowed === current) {
                        return true
                    }
                }
            }
    
            otherwise -
            throw new GqlHttpException(`You don't have permission to access ${info.fieldName}`, HttpStatus.FORBIDDEN)
        */

    }
  }

