import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './database/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { UserDocumentModule } from './modules/user-document/user-document.module'

@Module({
  imports: [PrismaModule, AuthModule, UserModule, UserDocumentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
