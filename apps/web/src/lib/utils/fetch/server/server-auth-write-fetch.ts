'use server'

import { AUTH_TOKEN_KEY } from '@/constants/auth-token-key'
import { cookies } from 'next/headers'
import type { z } from 'zod'
import { buildApiUrl, extractJsonResponse } from '../fetch-utils'

type MaybeOutput<Output> = Output extends void ? undefined : Output

/**
 * 認証が必要なAPIエンドポイントへの書き込みリクエスト用ユーティリティ
 * JWTトークンをCookieに含めてリクエストを送信します
 */
type AuthenticatedWriteFetchProps<Input, Output> = {
  path: string
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: Input
  validateOutput?: z.Schema<Output>
}

/**
 * 認証が必要な書き込みリクエストを送信する
 */
export async function serverAuthenticatedWriteFetch<Input, Output = void>({
  path,
  method,
  body,
  validateOutput,
}: AuthenticatedWriteFetchProps<Input, Output>): Promise<MaybeOutput<Output>> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_KEY)
  const apiUrl = buildApiUrl(path)

  try {
    const response = await fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Cookie: `auth-token=${token.value}` } : {}),
      },
      ...(body && { body: JSON.stringify(body) }),
    })

    const { body: responseBody } = await extractJsonResponse(response)

    if (validateOutput) {
      const validationResult = validateOutput.safeParse(responseBody.data)
      if (!validationResult.success) {
        console.error('出力データの検証に失敗しました:', validationResult.error)
        throw new Error('出力データの検証に失敗しました')
      }
      return validationResult.data as MaybeOutput<Output>
    }

    return responseBody.data as MaybeOutput<Output>
  } catch (error) {
    console.error('認証API書き込みリクエスト中にエラーが発生しました:', error)
    throw error
  }
}
