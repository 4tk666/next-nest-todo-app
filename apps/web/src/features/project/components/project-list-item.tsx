import type { Project } from '@next-nest-todo-app/packages/schemas/project/project-schema'
import { clsx } from 'clsx'

/**
 * 個別のプロジェクト項目コンポーネント
 * サイドバー内で単一のプロジェクトを表示します
 */
type ProjectListItemProps = {
  /** 表示するプロジェクトデータ */
  project: Project
}

export function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3',
        'px-3 py-2',
        'rounded-md',
        'text-sm text-gray-300',
        'hover:bg-gray-700 hover:text-white',
        'transition-all duration-200',
        'group cursor-pointer',
      )}
    >
      {/* プロジェクトアイコン（キャプチャのような円形アイコン） */}
      <div
        className={clsx(
          'flex-shrink-0',
          'w-4 h-4',
          'rounded-full',
          'bg-cyan-500',
          'group-hover:bg-cyan-400',
          'transition-colors duration-200',
        )}
      />

      {/* プロジェクト名 */}
      <span className={clsx('truncate', 'flex-1')}>{project.name}</span>
    </div>
  )
}
