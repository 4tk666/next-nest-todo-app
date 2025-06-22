import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

/**
 * PrismaClientのNestJSサービスラッパー
 * データベース接続を管理し、アプリケーション全体で利用可能にします
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * モジュール初期化時にデータベースに接続
   */
  async onModuleInit() {
    await this.$connect()
  }
}
