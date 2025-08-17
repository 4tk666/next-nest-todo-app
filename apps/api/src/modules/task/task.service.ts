import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateTaskInput } from '@next-nest-todo-app/packages/schemas/task/create-task-schema'
import { PrismaService } from 'src/database/prisma/prisma.service'

/**
 * タスク関連のビジネスロジックを担当するサービス
 * タスクの作成、取得、更新、削除を管理します
 */
@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 指定されたプロジェクトのタスク一覧を取得
   * @param userId ユーザーID
   * @param projectId プロジェクトID
   * @returns プロジェクトのタスク一覧
   */
  async getTasksByProject(userId: string, projectId: string) {
    // ユーザーがプロジェクトのメンバーかどうかを確認
    const hasProjectAccess = await this.checkProjectAccess(userId, projectId)
    if (!hasProjectAccess) {
      throw new ForbiddenException(
        'このプロジェクトにアクセスする権限がありません',
      )
    }

    return this.prismaService.task.findMany({
      where: {
        projectId,
      },
      include: {
        assigned: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  /**
   * タスクを作成
   * @param userId 作成者のユーザーID
   * @param createTaskInput タスク作成データ
   * @returns 作成されたタスク
   */
  async create(userId: string, createTaskInput: CreateTaskInput) {
    // ユーザーがプロジェクトのメンバーかどうかを確認
    const hasProjectAccess = await this.checkProjectAccess(
      userId,
      createTaskInput.projectId,
    )
    if (!hasProjectAccess) {
      throw new ForbiddenException(
        'このプロジェクトにタスクを作成する権限がありません',
      )
    }

    // 担当者が指定されている場合、そのユーザーがプロジェクトのメンバーかどうかを確認
    if (createTaskInput.assignedId) {
      const assignedUserHasAccess = await this.checkProjectAccess(
        createTaskInput.assignedId,
        createTaskInput.projectId,
      )
      if (!assignedUserHasAccess) {
        throw new ForbiddenException(
          '指定された担当者はこのプロジェクトのメンバーではありません',
        )
      }
    }

    // 期限日の処理（文字列からDateオブジェクトに変換）
    // new Date()は修正する必要がある
    const dueDate = createTaskInput.dueDate
      ? new Date(createTaskInput.dueDate)
      : null

    return this.prismaService.task.create({
      data: {
        title: createTaskInput.title,
        description: createTaskInput.description || null,
        projectId: createTaskInput.projectId,
        assignedId: createTaskInput.assignedId || null,
        dueDate,
      },
      include: {
        assigned: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })
  }

  /**
   * ユーザーが指定されたプロジェクトにアクセス権限があるかを確認
   * @param userId ユーザーID
   * @param projectId プロジェクトID
   * @returns アクセス権限がある場合はtrue
   */
  private async checkProjectAccess(
    userId: string,
    projectId: string,
  ): Promise<boolean> {
    const projectMember = await this.prismaService.projectMember.findFirst({
      where: {
        userId,
        projectId,
      },
    })

    return !!projectMember
  }
}
