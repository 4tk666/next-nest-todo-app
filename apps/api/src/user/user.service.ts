import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * ユーザーIDでユーザー詳細を取得
   * @param userId ユーザーID
   * @returns ユーザー詳細（パスワードを除く）
   */
  async findById(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException('ユーザーが見つかりません')
    }

    return user
  }
}
