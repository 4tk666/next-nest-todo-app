/**
 * タスクステータスの定数定義
 * Prismaスキーマで定義されたTaskStatusと一致させる
 */
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const

/**
 * タスクステータスの型定義
 */
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

/**
 * タスクステータスの表示名マッピング
 */
export const TASK_STATUS_LABELS = {
  [TASK_STATUS.TODO]: '未着手',
  [TASK_STATUS.IN_PROGRESS]: '進行中',
  [TASK_STATUS.DONE]: '完了',
} as const

/**
 * タスクステータスの配列（選択肢として使用）
 */
export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.TODO, label: TASK_STATUS_LABELS[TASK_STATUS.TODO] },
  {
    value: TASK_STATUS.IN_PROGRESS,
    label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS],
  },
  { value: TASK_STATUS.DONE, label: TASK_STATUS_LABELS[TASK_STATUS.DONE] },
] as const
