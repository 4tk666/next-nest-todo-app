import { serverAuthenticatedReadFetch } from '@/lib/utils/fetch/server/server-auth-fetch'
import { serverAuthenticatedWriteFetch } from '@/lib/utils/fetch/server/server-auth-write-fetch'
import type { CreateTaskInput } from '@next-nest-todo-app/packages/schemas/task/create-task-schema'
import { tasksSchema } from '@next-nest-todo-app/packages/schemas/task/task-schema'

/**
 * 新しいタスクを作成する
 * @param projectId プロジェクトID
 * @param taskData タスク作成データ
 * @returns 作成されたタスク情報
 */
export async function createTask(projectId: string, taskData: CreateTaskInput) {
  return serverAuthenticatedWriteFetch({
    path: `/projects/${projectId}/tasks`,
    method: 'POST',
    body: taskData,
  })
}

export async function getTasksByProject(projectId: string) {
  return serverAuthenticatedReadFetch({
    path: `/projects/${projectId}/tasks`,
    validateOutput: tasksSchema,
  })
}
