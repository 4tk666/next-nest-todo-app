import { z } from 'zod'

/**
 * プロジェクトの基本情報を表すZodスキーマ
 * PrismaのProjectモデルに対応します
 */
export const projectSchema = z.object({
  id: z.string(),
  name: z
    .string({ required_error: 'プロジェクト名は必須です' })
    .min(1, 'プロジェクト名は必須です')
    .max(255, 'プロジェクト名は255文字以内で入力してください'),
  description: z
    .string()
    .max(1000, '説明は1000文字以内で入力してください')
    .nullable(),
  ownerId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

/**
 * プロジェクト配列のZodスキーマ
 * 複数のプロジェクトを扱う際に使用します
 */
export const projectsSchema = z.array(projectSchema)

/**
 * projectSchemaから推論されるTypeScript型
 */
export type Project = z.infer<typeof projectSchema>

/**
 * projectsSchemaから推論されるTypeScript型
 */
export type Projects = z.infer<typeof projectsSchema>
