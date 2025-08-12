import { z } from 'zod'

/**
 * プロジェクト作成用のZodスキーマ
 * プロジェクト名（必須）と説明（オプション）のバリデーションを行います
 */
export const createProjectSchema = z.object({
  name: z
    .string({ required_error: 'プロジェクト名は必須です' })
    .min(1, 'プロジェクト名は必須です')
    .max(255, 'プロジェクト名は255文字以内で入力してください'),

  description: z
    .string()
    .max(1000, '説明は1000文字以内で入力してください')
    .optional(),
})

/**
 * createProjectSchemaから推論されるTypeScript型
 */
export type CreateProjectInput = z.infer<typeof createProjectSchema>
