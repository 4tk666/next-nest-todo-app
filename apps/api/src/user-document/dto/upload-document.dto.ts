import { z } from 'zod'
import { DocumentType } from '@prisma/client'

/**
 * ドキュメントアップロード用のZodスキーマ
 */
export const uploadDocumentSchema = z.object({
  documentType: z
    .nativeEnum(DocumentType, {
      errorMap: () => ({
        message: 'ドキュメントタイプは RESUME または WORK_HISTORY である必要があります',
      }),
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
 * アップロードドキュメントの型定義
 */
export type UploadDocumentDto = z.infer<typeof uploadDocumentSchema>
