'use server'

import {
  type CreateProjectInput,
  createProjectSchema,
} from '@next-nest-todo-app/packages/schemas/project/create-project-schema'
import type { ActionState } from '../../../types/form'
import { createProject } from '../api/project-api'

/**
 * プロジェクト作成サーバーアクション
 * フォームデータを受け取り、バックエンドAPIを呼び出してプロジェクトを作成します
 */
export async function createProjectAction(
  _prevState: ActionState<void, CreateProjectInput> | undefined,
  formData: FormData,
): Promise<ActionState<void, CreateProjectInput>> {
  const rawData = {
    name: formData.get('name')?.toString() || '',
    description: formData.get('description')?.toString(),
  }

  // バリデーション
  const validationResult = createProjectSchema.safeParse(rawData)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    return {
      success: false,
      error: {
        message: 'プロジェクトの作成に失敗しました',
        fields: errors,
      },
      values: rawData,
    }
  }

  try {
    // バックエンドAPIにプロジェクト作成リクエストを送信
    await createProject(validationResult.data)

    return {
      success: true,
    }
  } catch (error) {
    console.error('プロジェクト作成エラー:', error)
    return {
      success: false,
      error: {
        message: 'プロジェクトの作成に失敗しました。もう一度お試しください。',
      },
    }
  }
}
