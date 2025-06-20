import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

/**
 * Prismaサービスをアプリケーション全体で利用可能にするグローバルモジュール
 * このモジュールをインポートすることで、どこからでもPrismaServiceを使用できます
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
