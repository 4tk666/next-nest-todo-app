import { Module } from '@nestjs/common'
import { UserDocumentController } from './user-document.controller'
import { UserDocumentService } from './user-document.service'
import { PrismaModule } from 'src/database/prisma/prisma.module'

/**
 * ユーザードキュメント機能のモジュール
 */
@Module({
  imports: [PrismaModule],
  controllers: [UserDocumentController],
  providers: [UserDocumentService],
  exports: [UserDocumentService],
})
export class UserDocumentModule {}
