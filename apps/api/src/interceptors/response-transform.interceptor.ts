import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import type { TemplateResponse } from '../../../web/src/lib/utils/fetch-utils'

/**
 * レスポンスを統一フォーマットに変換するインターセプター
 */
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, TemplateResponse>
{
  // intercept: リクエストの処理をフックし、レスポンスを変換するために使用される
  intercept(
    _context: ExecutionContext,
    // next: 実際のコントローラー処理へのバイパス（次に進める）
    next: CallHandler,
  ): Observable<TemplateResponse> {
    // next.handle()：コントローラーやサービスの処理を実行し、そのレスポンスを受け取る
    // map()：レスポンスをTemplateResponse形式に変換する
    return next.handle().pipe(
      map((data) => ({
        data,
      })),
    )
  }
}
