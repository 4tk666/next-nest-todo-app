import {
  type TemplateResponse,
  templateResponseSchema,
} from '@next-nest-todo-app/packages/schemas/common/template-response'

/**
 * URLにクエリパラメータを追加する関数
 */
export function addQueryParams(url: string, query: Record<string, string>): string {
  const urlObject = new URL(url)

  for (const [key, value] of Object.entries(query)) {
    if (value !== '') {
      urlObject.searchParams.append(key, value)
    }
  }

  return urlObject.toString()
}

export function buildApiUrl(path: string): string {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4000'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalizedPath, apiBaseUrl).toString()
}

export function buildApiUrlWithQuery({
  path,
  params = {},
}: { path: string; params: Record<string, string> }): string {
  const baseUrl = buildApiUrl(path)
  return addQueryParams(baseUrl, params)
}

export function validateTemplateResponse(response: unknown): TemplateResponse {
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
      validatedBody.error?.messages?.join('、') ?? '不明なエラーが発生しました'
    console.error(`APIエラー: ${errorMessages}`)
    throw new Error(`${errorMessages}`)
  }

  return { response, body: validatedBody }
}

