import { AUTH_TOKEN_KEY } from '@/constants/auth-token-key'
import {
  type TemplateResponse,
  templateResponseSchema,
} from '@ai-job-interview/packages/schemas/common/template-response'
import { cookies } from 'next/headers'

export function buildApiUrl(path: string): string {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4000'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalizedPath, apiBaseUrl).toString()
}

function validateTemplateResponse(response: unknown): TemplateResponse {
  const result = templateResponseSchema.safeParse(response)
  if (!result.success) {
    console.error('レスポンス形式が正しくありません:', result.error)
    throw new Error('レスポンス形式が正しくありません')
  }
  return result.data
}

export async function extractJsonResponse(response: Response) {
  const body = await response.json()
  const validatedBody = validateTemplateResponse(body)

  if (!response.ok) {
    const errorMessages =
      validatedBody.error?.messages?.join('、') ?? '詳細情報はありません'
    console.error(`APIエラー: ${errorMessages}`)
    throw new Error(`${errorMessages}`)
  }

  return { response, body: validatedBody }
}

/**
 * 認証トークンを取得する
 */
export async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_KEY)

  if (!token?.value) {
    throw new Error('認証トークンが見つかりません')
  }

  return token.value
}
