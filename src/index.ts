import express from 'express'
import cors from 'cors'
import { buildSchema, getMetadataStorage } from 'type-graphql'
import { graphqlUploadExpress } from 'graphql-upload'
import { graphqlHTTP } from 'express-graphql'
import { createClient } from 'redis'
import cookieParser from 'cookie-parser'
import { Server } from 'http'
import { PrismaClient } from '@prisma/client';
import 'reflect-metadata'

import { AuthCheckerMiddleware } from './modules/auth/middleware/auth-checker.middleware';
import * as dotenv from 'dotenv'
import { ExtendedGraphQLError } from 'errors/types'
import exceptionsHandler from 'errors/exception-handler'


dotenv.config()

const PORT = +process.env.PORT || 8080

export const redis = createClient({
    url: process.env.REDIS_URL,
})


export const prisma = new PrismaClient()

async function main() {

    await redis.connect()
    console.log('Redis connected')

    const app = await createServer()
    const server = await new Promise<Server>(resolve => {
        const server = app.listen(PORT, () => resolve(server))
    })

    console.log(`🚀 Server started at port ${PORT}`)
    
}

main().catch(console.error)

const cache = {}


async function createServer() {
    const app = express()
    const schema = await buildSchema({
        resolvers: [
            __dirname + '/**/*.resolver.ts',
            __dirname + '/**/*.resolver.js'
        ],
        emitSchemaFile: true,
        authChecker: new AuthCheckerMiddleware().check,
        // authMode: 'null',
        validate: false
    })

    app.use(cors())
    app.use(cookieParser())
    app.post('/graphql',
        graphqlUploadExpress(),
        graphqlHTTP((request, response) => {
            return {
                schema,
                context: { request, response },
                graphiql: false,
                customFormatErrorFn: (error: ExtendedGraphQLError) => {
                    return exceptionsHandler(error, response)
                }
            }
        })
        // (_, __, {query}) => {
        //     if (!(query in cache)) {
        //         const document = parse(query)
        //         redisClient.hSet('graphqlcache', query, Buffer.from(compileQuery(schema, document).toString()))
        //         // cache[query] = ;
        //     }
        //
        //     return {
        //         schema,
        //         graphiql: true,
        //         customExecuteFn: ({rootValue, variableValues, contextValue}) =>
        //             cache[query].query(rootValue, contextValue, variableValues),
        //     }
        // }
    )

    return app
}

// async function createServer() {
//     const schema = await buildSchema({
//         resolvers: [HelloResolver, AuthResolver],
//     })
//
//     const expressServer = Express();
//     const httpServer = http.createServer(expressServer)
//
//     const apolloServer = new ApolloServer({
//         schema,
//         csrfPrevention: true,
//         plugins: [
//             ApolloServerPluginLandingPageLocalDefault({ embed: true }),
//             ApolloServerPluginDrainHttpServer({httpServer})
//         ]
//     })
//
//     await apolloServer.start()
//     apolloServer.applyMiddleware({ app: expressServer })
//
//     return {apolloServer, expressServer, httpServer}
// }


