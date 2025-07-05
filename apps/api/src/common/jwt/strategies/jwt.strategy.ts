import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

export type JwtPayload = {
  sub: string
}

export type AuthenticatedRequest = {
  user: JwtPayload
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      throw new Error('JWT_SECRET環境変数が設定されていません')
    }

    super({
      // JWT（JSON Web Token）をリクエストからどのように抽出するかを定義するための設定
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies['auth-token'] ?? null
        },
      ]),
      // 期限切れトークンを拒否する
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    })
  }

  /**
   * JWTペイロードを検証し、ユーザー情報を返す
   * @param payload JWTペイロード
   * @returns ユーザー情報
   */
  async validate(payload: JwtPayload) {
    return { sub: payload.sub }
  }
}
