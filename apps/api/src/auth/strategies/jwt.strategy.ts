import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

type JwtPayload = {
  sub: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      throw new Error('JWT_SECRET環境変数が設定されていません')
    }

    super({
      // JWTの抽出方法を指定
      // ここではAuthorizationヘッダーからBearerトークンを抽出
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 期限切れトークンは検証しない
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
