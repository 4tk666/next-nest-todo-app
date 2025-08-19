'use server'

import {
  type CreateTaskInput,
  createTaskSchema,
} from '@next-nest-todo-app/packages/schemas/task/create-task-schema'
import type { ActionState } from '../../../types/form'
import { createTask } from '../api/task-api'

/**
 * タスク作成サーバーアクション
 * フォームデータを受け取り、バックエンドAPIを呼び出してタスクを作成します
 */
export async function createTaskAction(
  _prevState: ActionState<void, CreateTaskInput> | undefined,
  formData: FormData,
): Promise<ActionState<void, CreateTaskInput>> {
  const rawData = {
    title: formData.get('title')?.toString() || '',
    description: formData.get('description')?.toString(),
    projectId: formData.get('projectId')?.toString() || '',
    assignedId: formData.get('assignedId')?.toString(),
    dueDate: formData.get('dueDate')?.toString()
      ? new Date(formData.get('dueDate')?.toString() || '')
      : undefined,
  }

  // バリデーション
  const validationResult = createTaskSchema.safeParse(rawData)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    return {
      success: false,
      error: {
        message: 'タスクの作成に失敗しました',
        fields: errors,
      },
      values: rawData,
    }
  }

  try {
    // バックエンドAPIにタスク作成リクエストを送信
    await createTask(validationResult.data)

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'タスクの作成に失敗しました。もう一度お試しください。',
      },
    }
  }
}
