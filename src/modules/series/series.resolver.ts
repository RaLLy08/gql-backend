import { validateInputPermission } from 'modules/auth/permission/input-permision-validator';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql'

import { GqlHttpException, HttpStatus } from 'errors/errors'
import { prisma } from '../../index'
import { Series } from './series.schema'
import { CreateSeriesInput } from './input-schema/create-series.schema'
import { UpdateSeriesInput } from './input-schema/update-series.schema'
 

@Resolver()
export class SeriesResolver {
    @Mutation(() => Series)
    // example 
    // @Authorized('createSeries')
    async createSeries(
        @Arg('data') data: CreateSeriesInput,
    ) {
        // for AllowChangeBy decorator
        // validateInputPermission(data, 'userId', ['createSeries'])

        if (data.studio) {
            const isStudioExists = await prisma.studio.findFirst({
                where: {
                    id: data.studio.id,
                }
            })

            if (!isStudioExists) {
                throw new GqlHttpException(`Studio ${data.studio.id} not found`, HttpStatus.NOT_FOUND)
            }
        }

        return prisma.series.create({
            data: {
                ...data,
                studio: {
                    connect: data.studio
                }
            },
            include: {
                studio: !!data.studio
            }
        })
    }
    @Mutation(() => Series)
    async updateSeries(
        @Arg('id') id: string,
        @Arg('data') data: UpdateSeriesInput,
    ) {
        if (data.studio) {
            const isStudioExists = await prisma.studio.findFirst({
                where: {
                    id: data.studio.id,
                }
            })

            if (!isStudioExists) {
                throw new GqlHttpException(`Studio ${data.studio.id} not found`, HttpStatus.NOT_FOUND)
            }
        }

        return prisma.series.update({
            where: {
                id
            },
            data: {
                ...data,
                studio: {
                    connect: data.studio
                }
            },
            include: {
                studio: !!data.studio
            }
        })
    }

    @Mutation(() => Series)
    async deleteMovie(@Arg('id') id: string) {
        return prisma.series.delete({
            where: {
                id
            }
        })
    }

    @Authorized()
    @Query(() => [Series]) 
    async series() {
        return prisma.series.findMany({
            include: {
                studio: true
            },
        })
    }

}
