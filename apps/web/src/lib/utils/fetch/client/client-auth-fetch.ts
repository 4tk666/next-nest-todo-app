import type { z } from 'zod'
import { buildApiUrlWithQuery, extractJsonResponse } from '../fetch-utils'

/**
 * 認証が必要なAPIエンドポイントへのGETリクエスト用ユーティリティ
 * JWTトークンをAuthorizationヘッダーに含めてリクエストを送信します
 */
type AuthenticatedReadFetchProps<Output> = {
  path: string
  validateOutput: z.Schema<Output>
  params?: Record<string, string>
}

/**
 * 認証が必要なGETリクエストを送信する
 */
export async function clientAuthenticatedReadFetch<Output>({
  path,
  validateOutput,
  params = {},
}: AuthenticatedReadFetchProps<Output>): Promise<Output> {
  const apiUrl = buildApiUrlWithQuery({
    path,
    params,
  })

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'include', // Cookieを送信するために必要
    })

    const { body } = await extractJsonResponse(response)

    if (validateOutput) {
      const validationResult = validateOutput.safeParse(body.data)
      if (!validationResult.success) {
        console.error('出力データの検証に失敗しました:', validationResult.error)
        throw new Error('出力データの検証に失敗しました')
      }
      return validationResult.data
    }

    return body.data as Output
  } catch (error) {
    console.error('認証APIリクエスト中にエラーが発生しました:', error)
    throw error
  }
}
