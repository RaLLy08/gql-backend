import { GqlHttpException, HttpStatus } from 'errors/errors';
import { Arg, Args, Authorized, Mutation, Query, Resolver } from 'type-graphql'
import { prisma } from '../../index'
import { CreateStudioInput } from './input-schema/create-studio.schema';
import { UpdateStudioInput } from './input-schema/update-studio.schema';
import { GetStudiosArgs } from './input-schema/get-list-studio.schema';
import { Studio } from './studio.schema'
import { ValidateSchemas } from 'validation';
 
@Resolver()
export class StudioResolver {
    @Mutation(() => Studio)
    // or Roles  @Authorized('user, manager')
    @Authorized('createStudio')
    async createStudio(
        @Arg('data') data: CreateStudioInput
    ) {
        // validateInputPermission(data, 'userId', ['permission:studio:edit:rating'])

        const studio = prisma.studio.create({
            data,
        })

        return studio
    }

    @Mutation(() => Studio)
    async updateStudio(
        @Arg('id') id: string,
        @Arg('data') data: UpdateStudioInput
    ) {
        const isStudioExists = await prisma.studio.findFirst({
            where: {
                id,
            }
        })
    
        if (!isStudioExists) {
            throw new GqlHttpException(`Studio ${id} not found`, HttpStatus.NOT_FOUND)
        }


        return prisma.studio.update({
            where: {
                id
            },
            data
        })
    }

    @Mutation(() => Studio)
    async deleteStudio(@Arg('id') id: string) {
        return prisma.studio.delete({
            where: {
                id
            }
        })
    }

    // @Authorized('studios')
    @ValidateSchemas()
    @Query(() => [Studio]) 
    async studios(
        @Args() { skip, take, search }: GetStudiosArgs
    ) {
        const studios = await prisma.studio.findMany({
            take,
            skip,
            where: {
                name: {
                    contains: search
                }
            },
            include: {
                series: true
            }
        })

        return studios
       
    }
}
