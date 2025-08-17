import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './database/prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { ProjectModule } from './modules/project/project.module'
import { TaskModule } from './modules/task/task.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProjectModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
