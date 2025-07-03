import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from 'src/database/prisma/prisma.service'
import { CreateUserInput } from './schemas/create-user-schema'
import { SignInUserInput } from './schemas/sign-in-user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const { name, email, password } = createUserInput

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

  async signIn(signInInput: SignInUserInput) {
    const { email, password } = signInInput

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
