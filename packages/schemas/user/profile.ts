import { z } from 'zod'

/**
 * ユーザープロフィール情報のZodスキーマ
 * APIから取得されるユーザー情報の型定義とバリデーション
 */
export const userProfileSchema = z.object({
  id: z.string().uuid('有効なUUIDである必要があります'),
  email: z.string().email('有効なメールアドレスである必要があります'),
  name: z.string().nullable(),
  createdAt: z.string().datetime('有効な日時である必要があります'),
  updatedAt: z.string().datetime('有効な日時である必要があります'),
})

/**
 * userProfileSchemaから推論されるTypeScript型
 */
export type UserProfile = z.infer<typeof userProfileSchema>