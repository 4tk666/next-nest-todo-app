import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PROJECT_ROLE } from '@next-nest-todo-app/packages/constants/projectRole'
import { CreateProjectInput } from '@next-nest-todo-app/packages/schemas/project/create-project-schema'
import { ProjectDetail } from '@next-nest-todo-app/packages/schemas/project/project-schema'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllProjects(userId: string) {
    return this.prismaService.project.findMany({
      where: {
        projectMembers: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getProjectDetail(userId: string, projectId: string) {
    const projectDetail: ProjectDetail | null =
      await this.prismaService.project.findUnique({
        where: {
          id: projectId,
        },
        include: {
          projectMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

    if (!projectDetail) {
      throw new NotFoundException('指定されたプロジェクトが見つかりません')
    }

    const isMember = projectDetail.projectMembers.some(
      (member) => member.user.id === userId,
    )

    if (!isMember) {
      throw new ForbiddenException(
        'このプロジェクトにアクセスする権限がありません',
      )
    }

    return projectDetail
  }

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
