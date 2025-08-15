import { AUTH_TOKEN_KEY } from '@/constants/auth-token-key'
import { SidebarProjectList } from '@/features/project/components/sidebar-project-list'
import { clsx } from 'clsx'
import { cookies } from 'next/headers'
import Link from 'next/link'

/**
 * サイドバーコンポーネント
 * ログイン後のユーザーに表示されるナビゲーション
 */
export async function Sidebar() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_KEY)

  // ログインしていない場合は何も表示しない
  if (!token) {
    return null
  }

  return (
    <aside
      className={clsx(
        'fixed left-0 top-16 z-40',
        'w-64 h-full',
        'bg-gray-800',
        'shadow-sm',
      )}
    >
      <nav className="p-4 border-b border-gray-700">
        <ul className="space-y-2">
          <li>
            <Link
              href="/profile"
              className={clsx(
                'block px-4 py-2 rounded-lg',
                'text-gray-300 hover:bg-gray-700 hover:text-white',
                'transition-colors duration-200',
              )}
            >
              プロフィール
            </Link>
          </li>
        </ul>
      </nav>

      {/* プロジェクト一覧セクション */}
      <SidebarProjectList />
    </aside>
  )
}
