import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from 'src/database/prisma/prisma.service'
import { SignInUserDto } from './dto/sign-in-user.dto'
import { CreateUserInput } from '@ai-job-interview/packages/schemas/user/create-user-schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserInput) {
    const { name, email, password } = createUserDto

    // メールアドレスの重複チェック
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      throw new UnauthorizedException(
        'このメールアドレスはすでに使用されています',
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    // ユーザーをデータベースに作成するロジック
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async signIn(signInDto: SignInUserDto) {
    const { email, password } = signInDto

    // ユーザーをデータベースから取得
    const user = await this.prismaService.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new NotFoundException('ユーザーが見つかりません')
    }

    // パスワードの照合
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('パスワードが正しくありません')
    }

    const jwtPayload = {
      sub: user.id,
    }

    // JWTトークンの生成
    const token = this.jwtService.sign(jwtPayload)

    return { token }
  }
}
