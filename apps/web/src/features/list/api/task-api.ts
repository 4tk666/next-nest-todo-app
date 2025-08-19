import { serverAuthenticatedWriteFetch } from '@/lib/utils/fetch/server/server-auth-write-fetch'
import type { CreateTaskInput } from '@next-nest-todo-app/packages/schemas/task/create-task-schema'

/**
 * 新しいタスクを作成する
 * @param taskData タスク作成データ
 * @returns 作成されたタスク情報
 */
export async function createTask(taskData: CreateTaskInput) {
  return serverAuthenticatedWriteFetch({
    path: '/tasks',
    method: 'POST',
    body: taskData,
  })
}
