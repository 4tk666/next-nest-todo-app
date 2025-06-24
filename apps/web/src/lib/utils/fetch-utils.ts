import z from 'zod'

const templateResponseSchema = z.object({
  data: z.unknown(),
  error: z
    .object({
      code: z.string(),
      messages: z.array(z.string()).optional(),
    })
    .optional(),
})

type TemplateResponse = z.infer<typeof templateResponseSchema>

function validateTemplateResponse(response: unknown): TemplateResponse {
  const result = templateResponseSchema.safeParse(response)
  if (!result.success) {
    console.error('レスポンス形式が正しくありません:', result.error)
    throw new Error('レスポンス形式が正しくありません')
  }
  return result.data
}

export async function extractJsonResponse(response: Response) {
  try {
    const body = await response.json()
    const validatedBody = validateTemplateResponse(body)

    if (!response.ok) {
      const errorCode = validatedBody.error?.code ?? '不明なエラー'
      const errorMessages =
        validatedBody.error?.messages?.join('、') ?? '詳細情報はありません'
      throw new Error(`${errorCode}: ${errorMessages}`)
    }

    return { response, body: validatedBody }
  } catch (error) {
    if (error instanceof Error) {
      console.error('JSONレスポンスの解析に失敗しました:', error.message)
      throw new Error(`JSONレスポンスの解析に失敗しました: ${error.message}`)
    }
    throw new Error('JSONレスポンスの解析に失敗しました: 不明なエラー')
  }
}

type WriteFetchProps<Input, Output> = {
  path: string
  inputBody: Input
  method?: 'POST' | 'PUT'
  validateOutput?: z.Schema<Output>
}

function buildApiUrl(path: string): string {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:4000'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalizedPath, apiBaseUrl).toString()
}

export async function writeFetch<Input, Output>({
  path,
  inputBody,
  method = 'POST',
  validateOutput,
}: WriteFetchProps<Input, Output>): Promise<Output> {
  const apiUrl = buildApiUrl(path)

  const response = await fetch(apiUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inputBody),
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
}
