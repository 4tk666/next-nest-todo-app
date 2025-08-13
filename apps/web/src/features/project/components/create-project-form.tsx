'use client'

import { Button } from '@/components/ui/button'
import { ErrorBanner } from '@/components/ui/error-banner'
import { InputField } from '@/components/ui/fields/input-field'
import { TextareaField } from '@/components/ui/fields/textarea-field'
import { createProjectAction } from '@/features/project/server-actions/create-project-action'
import { useActionState } from 'react'

/**
 * プロジェクト作成フォームコンポーネント
 * プロジェクト名と説明を入力してプロジェクトを作成します
 */
export function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    undefined,
  )

  return (
    <form action={formAction} className="max-w-md mx-auto space-y-6">
      {/* エラーメッセージ */}
      {state?.error?.message && <ErrorBanner message={state?.error?.message} />}

      <div className="space-y-4">
        {/* プロジェクト名入力 */}
        <div className="space-y-2">
          <InputField
            id="name"
            label="プロジェクト名"
            type="text"
            placeholder="メールアドレスを入力"
            defaultValue={state?.values?.name}
            errors={state?.error?.fields?.name}
          />
        </div>

        {/* プロジェクト説明入力 */}
        <div className="space-y-2">
          <TextareaField
            id="description"
            label="プロジェクト説明"
            placeholder="プロジェクトの説明を入力"
            defaultValue={state?.values?.description}
            errors={state?.error?.fields?.description}
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'プロジェクトを作成中...' : 'プロジェクトを作成'}
      </Button>
    </form>
  )
}
