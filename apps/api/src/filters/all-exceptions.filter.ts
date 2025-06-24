import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'

type TemplateResponse = {
  data?: unknown
  error?: {
    code: string
    messages?: string[]
  }
}

type RawErrorResponse = string | { message?: unknown }

/**
 * 生のエラーレスポンスを文字列配列に正規化する
 * 様々な形式のエラーメッセージを統一的な配列形式に変換
 */
function normalizeErrorMessages(rawResponse: RawErrorResponse): string[] {
  // 文字列の場合はそのまま配列に変換
  if (typeof rawResponse === 'string') {
    return [rawResponse]
  }

  const { message } = rawResponse

  // メッセージが配列の場合はそのまま使用
  if (
    Array.isArray(message) &&
    message.every((item) => typeof item === 'string')
  ) {
    return message
  }

  // その他の場合は文字列に変換して配列に格納
  const fallbackMessage =
    typeof message === 'string' ? message : '不明なエラーが発生しました'
  return [fallbackMessage]
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    // ArgumentsHostからリクエストのコンテキストを取得
    const ctx = host.switchToHttp()
    // リクエストのレスポンスオブジェクトを取得
    const response = ctx.getResponse<Response>()

    // 例外がHttpExceptionのインスタンスかどうかをチェック
    const isHttpException = exception instanceof HttpException

    // HttpExceptionの場合はステータスコードとレスポンスを取得
    const status: HttpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR

    //  例外からエラーレスポンスの生データを取得する
    //  HttpExceptionの場合はgetResponse()、それ以外はデフォルトメッセージを返す
    const rawErrorResponse = isHttpException
      ? exception.getResponse()
      : { message: 'Internal server error' }

    const messages: string[] = normalizeErrorMessages(rawErrorResponse)

    const formattedResponse: TemplateResponse = {
      data: undefined,
      error: {
        code: String(status),
        messages,
      },
    }

    response.status(status).json(formattedResponse)
  }
}
