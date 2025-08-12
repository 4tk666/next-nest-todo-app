import { AUTH_TOKEN_KEY } from '@/constants/auth-token-key'
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
        'bg-white border-r border-gray-200',
        'shadow-sm',
      )}
    >
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/profile"
              className={clsx(
                'block px-4 py-2 rounded-lg',
                'text-gray-700 hover:bg-gray-100',
                'transition-colors duration-200',
              )}
            >
              profile
            </Link>
          </li>
          <li>
            <Link
              href="/todos"
              className={clsx(
                'block px-4 py-2 rounded-lg',
                'text-gray-700 hover:bg-gray-100',
                'transition-colors duration-200',
              )}
            >
              TODO一覧
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
