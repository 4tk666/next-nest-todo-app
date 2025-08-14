import { Injectable } from '@nestjs/common'
import { PROJECT_ROLE } from '@next-nest-todo-app/packages/constants/projectRole'
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
    return this.prismaService.$transaction(async (tx) => {
      // プロジェクトを作成
      const project = await tx.project.create({
        data: {
          name: createProjectInput.name,
          description: createProjectInput.description,
          ownerId: userId,
        },
      })

      // プロジェクトメンバーとして作成者を追加（ADMIN権限）
      await tx.projectMember.create({
        data: {
          userId,
          projectId: project.id,
          role: PROJECT_ROLE.ADMIN, // 作成者はADMIN権限
        },
      })

      return project
    })
  }
}
