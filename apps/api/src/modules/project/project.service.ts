import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateProjectInput } from '@next-nest-todo-app/packages/schemas/project/create-project-schema'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * プロジェクトを作成
   * @param userId 作成者のユーザーID
   * @param createProjectInput プロジェクト作成データ
   * @returns 作成されたプロジェクト
   */
  async create(userId: string, createProjectInput: CreateProjectInput) {
    return this.prismaService.project.create({
      data: {
        name: createProjectInput.name,
        ownerId: userId,
      },
    })
  }
}
