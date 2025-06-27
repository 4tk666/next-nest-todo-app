import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { UserDocumentModule } from './user-document/user-document.module'

@Module({
  imports: [PrismaModule, AuthModule, UserModule, UserDocumentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
