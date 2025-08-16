'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname()

  const tabItems = [
    {
      value: 'overview',
      label: '概要',
      href: `/projects/${projectId}/overview`,
    },
    {
      value: 'list',
      label: 'リスト',
      href: `/projects/${projectId}/list`,
    },
    {
      value: 'board',
      label: 'ボード',
      href: `/projects/${projectId}/board`,
    },
  ]

  return (
    <nav className={clsx('flex')}>
      {tabItems.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.value}
            href={tab.href}
            className={clsx(
              'px-4 py-2 text-sm font-medium',
              'border-b-2 border-transparent',
              'hover:font-bold',
              active && 'border-b-white font-bold',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
