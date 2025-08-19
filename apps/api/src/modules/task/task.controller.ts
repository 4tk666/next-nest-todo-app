import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  CreateTaskInput,
  createTaskSchema,
} from '@next-nest-todo-app/packages/schemas/task/create-task-schema'
import { JwtAuthGuard } from 'src/common/jwt/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/common/jwt/strategies/jwt.strategy'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { TaskService } from './task.service'

/**
 * タスク関連のHTTPエンドポイントを管理するコントローラー
 * タスクの作成、取得機能を提供します
 */
@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * 指定されたプロジェクトのタスク一覧を取得
   * @param projectId プロジェクトID（クエリパラメータ）
   * @param req リクエストオブジェクト（JWTから取得したユーザー情報が含まれる）
   * @returns プロジェクトのタスク一覧
   * @throws ForbiddenException ユーザーがプロジェクトのメンバーでない場合
   */
  @Get()
  async getTasksByProject(
    @Request() req: AuthenticatedRequest,
    @Param('projectId') projectId: string,
  ) {
    return this.taskService.getTasksByProject(req.user.sub, projectId)
  }

  /**
   * タスクを作成
   * @param req リクエストオブジェクト（JWTから取得したユーザー情報が含まれる）
   * @param createTaskInput タスク作成データ
   * @returns 作成されたタスク
   * @throws ForbiddenException ユーザーがプロジェクトのメンバーでない場合
   * @throws ForbiddenException 指定された担当者がプロジェクトのメンバーでない場合
   */
  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body(new ZodValidationPipe(createTaskSchema))
    createTaskInput: CreateTaskInput,
    @Param('projectId') projectId: string,
  ) {
    return this.taskService.create(req.user.sub, createTaskInput, projectId)
  }
}
