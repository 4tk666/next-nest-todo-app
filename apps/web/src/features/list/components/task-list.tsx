'use client'

import { Accordion } from '@/components/ui/accordion'
import {
  TASK_STATUS,
  TASK_STATUS_LABELS,
} from '@next-nest-todo-app/packages/constants/taskStatus'
import type { Task } from '@next-nest-todo-app/packages/schemas/task/task-schema'
import clsx from 'clsx'
import { HiDotsVertical } from 'react-icons/hi'

type TaskListProps = {
  tasks: Task[]
}

/**
 * タスク一覧表示コンポーネント
 * ステータス別にグループ化してタスクを表示します
 */
export function TaskList({ tasks }: TaskListProps) {
  // ステータス別にタスクをグループ化
  const tasksByStatus = {
    [TASK_STATUS.TODO]: tasks.filter(
      (task) => task.status === TASK_STATUS.TODO,
    ),
    [TASK_STATUS.IN_PROGRESS]: tasks.filter(
      (task) => task.status === TASK_STATUS.IN_PROGRESS,
    ),
    [TASK_STATUS.DONE]: tasks.filter(
      (task) => task.status === TASK_STATUS.DONE,
    ),
  }

  return (
    <div className="space-y-6">
      {/* To-Do セクション */}
      <TaskSection
        title={TASK_STATUS_LABELS[TASK_STATUS.TODO]}
        tasks={tasksByStatus[TASK_STATUS.TODO]}
      />

      {/* 進行中セクション */}
      <TaskSection
        title={TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS]}
        tasks={tasksByStatus[TASK_STATUS.IN_PROGRESS]}
      />

      {/* 完了セクション */}
      <TaskSection
        title={TASK_STATUS_LABELS[TASK_STATUS.DONE]}
        tasks={tasksByStatus[TASK_STATUS.DONE]}
      />
    </div>
  )
}

type TaskSectionProps = {
  title: string
  tasks: Task[]
}

/**
 * タスクセクションコンポーネント
 * 折りたたみ可能なタスクリストを表示
 */
function TaskSection({ title, tasks }: TaskSectionProps) {
  return (
    <Accordion
      title={title}
      content={
        <div>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="py-3 text-center">まだタスクがありません。新しいタスクを作成してください。</div>
          )}
        </div>
      }
    />
  )
}

type TaskItemProps = {
  task: Task
}

/**
 * タスクアイテムコンポーネント
 * 個別のタスクを表示
 */
function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="px-4 py-3 border-t-[0.5px] border-[#bdc1c6]">
      <div className="flex items-center justify-between">
        {/* タスク情報 */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* タスクタイトル */}
          <div className="flex-1 min-w-0">
            <p className={clsx('text-sm font-medium truncate')}>{task.title}</p>
          </div>
        </div>

        {/* メタ情報 */}
        <div className="flex items-center space-x-4 ml-4">
          {/* アクションボタン */}
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            aria-label="タスクメニュー"
          >
            <HiDotsVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
