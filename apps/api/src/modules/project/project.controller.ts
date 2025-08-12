import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import {
  CreateProjectInput,
  createProjectSchema,
} from '@next-nest-todo-app/packages/schemas/project/create-project-schema'
import { JwtAuthGuard } from 'src/common/jwt/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/common/jwt/strategies/jwt.strategy'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { ProjectService } from './project.service'

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * プロジェクトを作成
   * @param req リクエストオブジェクト（JWTから取得したユーザー情報が含まれる）
   * @param createProjectInput プロジェクト作成データ
   * @returns 作成されたプロジェクト
   */
  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body(new ZodValidationPipe(createProjectSchema))
    createProjectInput: CreateProjectInput,
  ) {
    return this.projectService.create(req.user.sub, createProjectInput)
  }
}
