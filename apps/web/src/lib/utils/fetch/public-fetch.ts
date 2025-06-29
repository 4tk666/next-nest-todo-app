import type { z } from 'zod'
import { buildApiUrl, extractJsonResponse } from './fetch-utils'

type PublicFetchProps<Input, Output> = {
  path: string
  inputBody: Input
  method?: 'POST' | 'PUT'
  validateOutput?: z.Schema<Output>
}

export async function publicFetch<Input, Output>({
  path,
  inputBody,
  method = 'POST',
  validateOutput,
}: PublicFetchProps<Input, Output>): Promise<Output> {
  const apiUrl = buildApiUrl(path)

  try {
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
        console.error('出力データの検証に失敗しました:', validationResult.error, body.data)
        throw new Error('出力データの検証に失敗しました')
      }
      return validationResult.data
    }

    return body.data as Output
  } catch (error) {
    console.error('APIリクエスト中にエラーが発生しました:', error)
    throw error
  }
}
