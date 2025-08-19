'use client'

import { Button } from '@/components/ui/button'
import { ErrorBanner } from '@/components/ui/error-banner'
import { DateInputField } from '@/components/ui/fields/date-input-field'
import { TextareaField } from '@/components/ui/fields/textarea-field'
import { FormError } from '@/components/ui/form-error'
import { Input } from '@/components/ui/input'
import { formatDateToString } from '@/lib/utils/date-utils'
import type { ActionState } from '@/types/form'
import type { CreateTaskInput } from '@next-nest-todo-app/packages/schemas/task/create-task-schema'
import { useActionState } from 'react'
import { toast } from 'sonner'
import { createTaskAction } from '../server-actions/create-task-action'

type TodoFormProps = {
  projectId: string
  onSuccess?: () => void
  onCancel: () => void
}

/**
 * タスク作成フォームコンポーネント（サーバーアクション対応版）
 */
export function TaskForm({ projectId, onSuccess, onCancel }: TodoFormProps) {
  const [state, action, isPending] = useActionState(
    async (
      prevState: ActionState<void, CreateTaskInput> | undefined,
      formData: FormData,
    ) => {
      const result = await createTaskAction(prevState, formData, projectId)

      if (result.success) {
        // 成功時のコールバック
        onSuccess?.()
        toast.success('タスクを作成しました')
      } else {
        // エラー時のコールバック
        toast.error(result.error?.message || 'タスクの作成に失敗しました')
      }

      return result
    },
    undefined,
  )

  return (
    <form action={action} className="space-y-6 text-left">
      {/* プロジェクトIDの隠しフィールド */}
      <input type="hidden" name="projectId" value={projectId} />

      {/* 全体エラーメッセージ */}
      {state?.error && <ErrorBanner message={state.error.message} />}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <Input
          id="title"
          name="title"
          placeholder="タスクのタイトルを入力"
          disabled={isPending}
          defaultValue={state?.values?.title}
          errors={state?.error?.fields?.title}
        />
        <FormError errors={state?.error?.fields?.title} id="title" />
      </div>

      <div>
        <TextareaField
          id="description"
          label="説明"
          name="description"
          placeholder="タスクの詳細を入力"
          rows={5}
          disabled={isPending}
          defaultValue={state?.values?.description ?? ''}
          errors={state?.error?.fields?.description}
        />
      </div>

      <div>
        <DateInputField
          id="dueDate"
          name="dueDate"
          label="期日"
          disabled={isPending}
          defaultValue={
            state?.values?.dueDate
              ? formatDateToString({
                  date: state.values.dueDate,
                })
              : undefined
          }
          errors={state?.error?.fields?.dueDate}
        />
      </div>

      <div className="flex space-x-4">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          variant="outline"
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? '作成中...' : 'タスクを作成'}
        </Button>
      </div>
    </form>
  )
}
