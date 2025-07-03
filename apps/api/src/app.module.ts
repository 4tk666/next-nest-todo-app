import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './database/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { FinnhubModule } from './modules/finnhub/finnhub.module'
import { UserDocumentModule } from './modules/user-document/user-document.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    UserDocumentModule,
    FinnhubModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
