import { z } from 'zod'

/**
 * タスクステータスのスキーマ
 * Prismaスキーマで定義されたTaskStatusと一致させる
 */
export const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE'])

/**
 * タスクステータスの型定義
 */
export type TaskStatus = z.infer<typeof taskStatusSchema>

/**
 * タスクの基本情報スキーマ
 */
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: taskStatusSchema,
  projectId: z.string(),
  assignedId: z.string().nullable(),
  dueDate: z.coerce.date().nullable(),
  assigned: z
    .object({
      id: z.string(),
      name: z.string(),
      avatarUrl: z.string().nullable(),
    })
    .nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

/**
 * タスク一覧のスキーマ
 */
export const tasksSchema = z.array(taskSchema)

/**
 * タスクの型定義
 */
export type Task = z.infer<typeof taskSchema>

/**
 * タスク一覧の型定義
 */
export type Tasks = z.infer<typeof tasksSchema>
