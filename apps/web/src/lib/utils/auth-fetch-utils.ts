'use server'

import { AUTH_TOKEN_KEY } from '@/constants/auth-token-key'
import { cookies } from 'next/headers'
import type { z } from 'zod'
import { buildApiUrl, extractJsonResponse } from './fetch-utils'

/**
 * 認証が必要なAPIエンドポイントへのGETリクエスト用ユーティリティ
 * JWTトークンをAuthorizationヘッダーに含めてリクエストを送信します
 */
type AuthenticatedFetchProps<Output> = {
  path: string
  validateOutput?: z.Schema<Output>
}

/**
 * 認証トークンを取得する
 */
async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_KEY)
  
  if (!token?.value) {
    throw new Error('認証トークンが見つかりません')
  }
  
  return token.value
}

/**
 * 認証が必要なGETリクエストを送信する
 */
export async function authenticatedFetch<Output>({
  path,
  validateOutput,
}: AuthenticatedFetchProps<Output>): Promise<Output> {
  const apiUrl = buildApiUrl(path)
  const token = await getAuthToken()

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      mode: 'cors',
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
