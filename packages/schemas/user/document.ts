import { z } from 'zod'

const DOCUMENT_TYPE = {
  RESUME: 'RESUME',
  WORK_HISTORY: 'WORK_HISTORY',
} as const

/**
 * ドキュメントタイプ定義
 */
export type UploadDocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE]

/**
 * ドキュメントアップロード用のスキーマ
 */
export const uploadDocumentSchema = z.object({
  documentType: z.nativeEnum(DOCUMENT_TYPE, {
    required_error: 'ドキュメントタイプは必須です',
    invalid_type_error: 'ドキュメントタイプは有効な値である必要があります',
  }),
  fileName: z
    .string({
      required_error: 'ファイル名は必須です',
      invalid_type_error: 'ファイル名は文字列である必要があります',
    })
    .min(1, 'ファイル名は必須です')
    .max(255, 'ファイル名は255文字以内で入力してください'),
})

/**
 * ドキュメントレスポンス用のスキーマ
 */
export const documentResponseSchema = z.object({
  id: z.number(),
  userId: z.string().uuid('有効なUUIDである必要があります'),
  documentType: z.nativeEnum(DOCUMENT_TYPE, {
    required_error: 'ドキュメントタイプは必須です',
    invalid_type_error: 'ドキュメントタイプは有効な値である必要があります',
  }),
  fileName: z.string(),
  uploadedAt: z.string(),
})

/**
 * アップロードドキュメントの型定義
 */
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>

/**
 * ドキュメントレスポンスの型定義
 */
export type DocumentResponse = z.infer<typeof documentResponseSchema>
