import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './database/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { StockModule } from './modules/stock/stock.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    StockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
