import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { SignInUserDto } from '../dto/sign-in-user.dto'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  // モックされたAuthServiceの定義
  const mockAuthService = {
    createUser: vi.fn(),
    signIn: vi.fn(),
  }

  // テストの前にモジュールをセットアップ
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('signUp', () => {
    const validCreateUserDto: CreateUserDto = {
      name: 'テストユーザー',
      email: 'test@example.com',
      password: 'Password123',
    }

    const expectedUserResponse = {
      id: 1,
      name: 'テストユーザー',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('正常な場合：新規ユーザーが作成されること', async () => {
      // Arrange（準備）
      mockAuthService.createUser.mockResolvedValue(expectedUserResponse)

      // Act（実行）
      const result = await controller.signUp(validCreateUserDto)

      // Assert（検証）
      // コントローラーが正しくサービス層に DTO（ユーザー登録情報）を渡しているかを検証
      expect(authService.createUser).toHaveBeenCalledWith(validCreateUserDto)
      // サービス層のメソッドが1回だけ呼び出されていることを検証
      expect(authService.createUser).toHaveBeenCalledTimes(1)
      // コントローラーのレスポンスが期待通りのユーザー情報であることを検証
      expect(result).toEqual(expectedUserResponse)
    })

    it('異常な場合：既存のメールアドレスでエラーが発生すること', async () => {
      // Arrange（準備）
      const errorMessage = 'このメールアドレスはすでに使用されています'
      mockAuthService.createUser.mockRejectedValue(
        new UnauthorizedException(errorMessage),
      )

      // コントローラーの signUp メソッドが UnauthorizedException をスローすることを検証
      await expect(controller.signUp(validCreateUserDto)).rejects.toThrow(
        UnauthorizedException,
      )
      // エラーメッセージが正しいことを検証
      await expect(controller.signUp(validCreateUserDto)).rejects.toThrow(
        errorMessage,
      )

      expect(authService.createUser).toHaveBeenCalledWith(validCreateUserDto)
      expect(authService.createUser).toHaveBeenCalledTimes(2) // 上で2回呼び出されているため
    })

  })

  describe('signIn', () => {
    const validSignInDto: SignInUserDto = {
      email: 'test@example.com',
      password: 'Password123',
    }

    const expectedTokenResponse = {
      access_token: 'jwt.token.here',
      user: {
        id: '1',
        name: 'テストユーザー',
        email: 'test@example.com',
      },
    }

    it('正しいメールアドレスとパスワードでログインに成功し、アクセストークンとユーザー情報が返ること', async () => {
      // Arrange（準備）
      // モックされたAuthServiceのsignInメソッドが期待されるトークンレスポンスを返すように設定
      mockAuthService.signIn.mockResolvedValue(expectedTokenResponse)

      // Act（実行）
      const result = await controller.signIn(validSignInDto)

      // Assert（検証）
      expect(authService.signIn).toHaveBeenCalledWith(validSignInDto)
      expect(authService.signIn).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expectedTokenResponse)
    })

    it('異常な場合：不正な認証情報でエラーが発生すること', async () => {
      // Arrange（準備）
      const errorMessage = 'メールアドレスまたはパスワードが正しくありません'
      mockAuthService.signIn.mockRejectedValue(
        new UnauthorizedException(errorMessage),
      )

      // Act & Assert（実行と検証）
      await expect(controller.signIn(validSignInDto)).rejects.toThrow(
        UnauthorizedException,
      )
      await expect(controller.signIn(validSignInDto)).rejects.toThrow(
        errorMessage,
      )

      expect(authService.signIn).toHaveBeenCalledWith(validSignInDto)
    })
  })
})
