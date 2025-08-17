import z from 'zod'

/**
 * プロジェクトIDクエリパラメータのスキーマ
 * タスク一覧取得時のクエリパラメータを検証します
 */
export const projectIdQuerySchema = z.object({
  projectId: z.string().min(1, 'プロジェクトIDは必須です'),
})

/**
 * プロジェクトIDクエリパラメータの型定義
 */
export type ProjectIdQuery = z.infer<typeof projectIdQuerySchema>
