import type { z } from 'zod'
import {
  buildApiUrl,
  buildApiUrlWithQuery,
  extractJsonResponse,
  getAuthToken,
} from './fetch-utils'

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
 * 認証が必要なファイルアップロード用ユーティリティ
 * JWTトークンをAuthorizationヘッダーに含めてMultipart/form-dataでリクエストを送信します
 */
type AuthenticatedFileUploadProps<Input, Output> = {
  path: string
  file: File
  data: Input
  validateOutput?: z.Schema<Output>
}

/**
 * 認証が必要なGETリクエストを送信する
 */
export async function authenticatedReadFetch<Output>({
  path,
  validateOutput,
  params = {},
}: AuthenticatedReadFetchProps<Output>): Promise<Output> {
  const apiUrl = buildApiUrlWithQuery({
    path,
    params,
  })
  const token = await getAuthToken()

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

/**
 * 認証が必要なファイルアップロードリクエストを送信する
 * @param props アップロードパラメータ
 * @returns アップロード結果
 */
export async function authenticatedFileUpload<Input, Output>({
  path,
  file,
  data,
  validateOutput,
}: AuthenticatedFileUploadProps<Input, Output>): Promise<Output> {
  const apiUrl = buildApiUrl(path)
  const token = await getAuthToken()

  try {
    const formData = new FormData()
    formData.append('file', file)

    // データをFormDataに追加
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      formData.append(key, String(value))
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      mode: 'cors',
    })

    const { body } = await extractJsonResponse(response)

    if (validateOutput) {
      console.log('アップロードされたファイル:', body.data)
      const validationResult = validateOutput.safeParse(body.data)
      if (!validationResult.success) {
        console.error('出力データの検証に失敗しました:', validationResult.error)
        throw new Error('出力データの検証に失敗しました')
      }
      return validationResult.data
    }

    return body.data as Output
  } catch (error) {
    console.error('認証ファイルアップロード中にエラーが発生しました:', error)
    throw error
  }
}
