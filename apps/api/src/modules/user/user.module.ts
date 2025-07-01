import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/database/prisma/prisma.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
