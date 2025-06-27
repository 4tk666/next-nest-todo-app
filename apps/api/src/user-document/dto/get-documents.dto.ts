import { z } from 'zod'
import { DocumentType } from '@prisma/client'

/**
 * ドキュメント取得用のクエリパラメータスキーマ
 */
export const getDocumentsQuerySchema = z.object({
  documentType: z
    .nativeEnum(DocumentType, {
      errorMap: () => ({
        message: 'ドキュメントタイプは RESUME または WORK_HISTORY である必要があります',
      }),
    })
    .optional(),
})

/**
 * ドキュメント取得クエリの型定義
 */
export type GetDocumentsQueryDto = z.infer<typeof getDocumentsQuerySchema>

/**
 * ドキュメントレスポンス用のスキーマ
 */
export const documentResponseSchema = z.object({
  id: z.number(),
  userId: z.string().uuid(),
  documentType: z.nativeEnum(DocumentType),
  fileName: z.string(),
  uploadedAt: z.date(),
})

/**
 * ドキュメントレスポンスの型定義
 */
export type DocumentResponseDto = z.infer<typeof documentResponseSchema>
