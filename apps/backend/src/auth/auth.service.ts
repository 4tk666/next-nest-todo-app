import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto
    // ユーザーをデータベースに作成するロジック
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password, // パスワードはハッシュ化して保存することを推奨
      },
    })
  }
}
