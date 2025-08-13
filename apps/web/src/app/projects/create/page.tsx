import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { CreateProjectForm } from '@/features/project/components/create-project-form'
import clsx from 'clsx'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プロジェクト作成',
  description: '新しいプロジェクトを作成します',
}

/**
 * プロジェクト作成ページ
 * ユーザーが新しいプロジェクトを作成するためのページです
 */
export default function CreateProjectPage() {
  return (
    <div
      className={clsx('h-full', 'py-12 px-4', 'sm:px-6 lg:px-8', 'bg-gray-50')}
    >
      <div className={clsx('mx-auto', 'max-w-md')}>
        <div className={clsx('text-center', 'mb-8')}>
          <h1 className={clsx('text-3xl font-bold text-gray-900')}>
            プロジェクト作成
          </h1>
          <p className={clsx('mt-2', 'text-sm text-gray-600')}>
            新しいプロジェクトを作成して、タスク管理を始めましょう
          </p>
        </div>

        <div className={clsx('p-6', 'rounded-lg shadow-md', 'bg-white')}>
          <CreateProjectForm />
        </div>
      </div>
    </div>
  )
}
