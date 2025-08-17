import { z } from 'zod'

/**
 * タスク作成用のスキーマ
 * フロントエンドとバックエンドで共有されるバリデーションルールを定義します
 */
export const createTaskSchema = z.object({
  /**
   * タスクのタイトル
   * 必須項目で、1文字以上255文字以下の文字列
   */
  title: z
    .string()
    .min(1, 'タスクタイトルは必須です')
    .max(255, 'タスクタイトルは255文字以内で入力してください'),

  /**
   * タスクの説明
   * オプション項目で、最大10000文字まで
   */
  description: z
    .string()
    .max(10000, 'タスクの説明は10000文字以内で入力してください')
    .optional(),

  /**
   * プロジェクトID
   * タスクが属するプロジェクトのIDを指定します
   */
  projectId: z.string().min(1, 'プロジェクトIDは必須です'),

  /**
   * 担当者のユーザーID
   * タスクの担当者を指定します（オプション）
   */
  assignedId: z.string().optional(),

  /**
   * 期限日
   * タスクの期限を指定します（オプション）
   */
  dueDate: z.coerce.date().optional(),
})

/**
 * タスク作成入力データの型定義
 */
export type CreateTaskInput = z.infer<typeof createTaskSchema>
