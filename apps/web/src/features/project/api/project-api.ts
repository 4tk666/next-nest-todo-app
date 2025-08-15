import { serverAuthenticatedReadFetch } from '@/lib/utils/fetch/server/server-auth-fetch'
import { serverAuthenticatedWriteFetch } from '@/lib/utils/fetch/server/server-auth-write-fetch'
import type { CreateProjectInput } from '@next-nest-todo-app/packages/schemas/project/create-project-schema'
import { projectsSchema } from '@next-nest-todo-app/packages/schemas/project/project-schema'


export async function getAllProjects() {
  return serverAuthenticatedReadFetch({
    path: '/projects',
    validateOutput: projectsSchema,
  })
}

/**
 * 新しいプロジェクトを作成する
 * @param projectData プロジェクト作成データ
 * @returns 作成されたプロジェクト情報
 */
export async function createProject(projectData: CreateProjectInput) {
  return serverAuthenticatedWriteFetch({
    path: '/projects',
    method: 'POST',
    body: projectData,
  })
}
