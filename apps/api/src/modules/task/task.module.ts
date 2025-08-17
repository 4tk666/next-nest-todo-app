import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/database/prisma/prisma.module'
import { TaskController } from './task.controller'
import { TaskService } from './task.service'

/**
 * タスク機能を管理するNestJSモジュール
 * タスクのコントローラーとサービスを提供し、Prismaモジュールをインポートします
 */
@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
