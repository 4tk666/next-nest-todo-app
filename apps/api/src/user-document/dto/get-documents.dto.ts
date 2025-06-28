import { z } from 'zod'
import { DocumentType } from '@prisma/client'

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
