import type { Projects } from '@next-nest-todo-app/packages/schemas/project'
import { clsx } from 'clsx'
import Link from 'next/link'
import { HiPlus } from 'react-icons/hi2'
import { getAllProjects } from '../api/project-api'
import { ProjectListItem } from './project-list-item'

/**
 * サイドバー内でプロジェクト一覧を表示するコンポーネント
 * キャプチャのデザインに基づいてプロジェクトリストを表示します
 */

export async function SidebarProjectList() {
  const projects: Projects = await getAllProjects()

  return (
    <div className="px-4 py-3">
      {/* プロジェクトセクションヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <h2
          className={clsx(
            'text-sm font-semibold',
            'text-gray-200',
            'tracking-wide',
          )}
        >
          プロジェクト
        </h2>
        {/* プロジェクト追加ボタン */}
        <Link
          href="/projects/create"
          className={clsx(
            'flex items-center justify-center',
            'w-5 h-5',
            'text-gray-400 hover:text-gray-200',
            'transition-colors duration-200',
          )}
          aria-label="新しいプロジェクトを作成"
        >
          <HiPlus className="w-4 h-4" />
        </Link>
      </div>

      {/* プロジェクト一覧 */}
      <div className="space-y-1">
        {projects.length === 0 ? (
          <div className={clsx('text-xs text-gray-400', 'py-2 px-3', 'italic')}>
            プロジェクトがありません
          </div>
        ) : (
          projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  )
}
