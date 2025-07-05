import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { JwtPayload } from '../strategies/jwt.strategy'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name)
  /**
   * 認証結果をハンドリング
   * トークンがない場合や無効な場合に適切なエラーメッセージを返す
   */
  handleRequest<TUser = JwtPayload>(
    err: Error | null,
    user: TUser | null,
    _info: unknown,
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest<Request>()

    // エラーがある場合はそのまま投げる
    if (err) {
      throw err
    }

    // ユーザーが存在しない場合（認証失敗）
    if (!user) {
      const hasToken = this.extractTokenFromRequest(request)

      if (!hasToken) {
        throw new UnauthorizedException(
          '認証トークンが見つかりません。ログインしてください。',
        )
      }

      throw new UnauthorizedException(
        '認証トークンが無効です。再度ログインしてください。',
      )
    }

    return user
  }

  /**
   * リクエストからトークンを抽出する
   * JwtStrategyと同じロジックを使用
   */
  private extractTokenFromRequest(request: Request): string | null {
    // Cookieから取得
    const cookieToken = request.cookies?.['auth-token']
    if (cookieToken) {
      return cookieToken
    }

    this.logger.error(
      '認証トークンが見つかりません。Cookieに設定されていない可能性があります。',
    )
    return null
  }
}
